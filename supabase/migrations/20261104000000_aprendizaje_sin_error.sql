-- Aprendizaje sin error en la tableta: escalera de grados de apoyo por
-- programa del alumno (tamaño del campo, desvanecimiento de distractores y
-- demora de la ayuda) y copia del escalón usado en cada bloque. En
-- entrenamiento, solo los bloques del escalón final cuentan para el dominio.

alter table programas_alumno add column if not exists sin_error jsonb;
alter table bloques_ensayo_rft add column if not exists sin_error jsonb;

comment on column programas_alumno.sin_error is 'Aprendizaje sin error en la tableta: {activo, escalones:[{nombre, comparaciones|null, opacidad, demora|null}], subir, bajar, tamano} (ver app/dashboard/sin-error.ts)';
comment on column bloques_ensayo_rft.sin_error is 'Escalón de apoyo con que se hizo el bloque (copia): {indice, total, final, nombre, comparaciones, opacidad, demora, aciertos_con_apoyo}';

CREATE OR REPLACE FUNCTION public.actualizar_dominio_grupo_rft(p_programa_alumno_id uuid, p_grupo text, p_fase fase_rft, p_posicion_origen text, p_posicion_destino text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_bloques_para_dominio int;
  v_porcentaje_dominio numeric(5,2);
  v_bloques_cumplen int;
  v_dominio_logrado boolean := false;
  v_via_entrenamiento boolean := false;
  v_pendientes int;
  v_ultimo_porcentaje numeric;
  v_alguna_ayuda boolean;
begin
  select bloques_para_dominio, porcentaje_dominio
    into v_bloques_para_dominio, v_porcentaje_dominio
  from programas_alumno
  where id = p_programa_alumno_id;

  if p_fase = 'entrenamiento' then
    -- Entrenamiento: los últimos N bloques de esta combinación exacta deben
    -- llegar al % de dominio. Con aprendizaje sin error solo cuentan los del
    -- escalón final (sin apoyo); los intermedios se guardan pero no cuentan.
    select count(*) into v_bloques_cumplen
    from (
      select porcentaje
      from bloques_ensayo_rft
      where programa_alumno_id = p_programa_alumno_id
        and grupo = p_grupo
        and fase = p_fase
        and posicion_origen = p_posicion_origen
        and posicion_destino = p_posicion_destino
        and (sin_error is null or (sin_error->>'final')::boolean)
      order by fecha desc
      limit v_bloques_para_dominio
    ) ultimos
    where porcentaje >= v_porcentaje_dominio;

    v_dominio_logrado := v_bloques_cumplen >= v_bloques_para_dominio;
    v_via_entrenamiento := false;
  else
    -- Fases de test (mutuo, combinatorio, transformación de funciones).
    -- Mientras ningún bloque de esta combinación haya usado ayudas, cada
    -- bloque es una sonda limpia: si el último llega al criterio, la
    -- relación es DERIVADA (emergente, sin enseñanza directa). En cuanto el
    -- terapeuta ha tenido que dar alguna ayuda, se le exige el mismo
    -- criterio que a un entrenamiento (los últimos N bloques al % de
    -- dominio) y, si lo logra, se considera DOMINADO, nunca derivado: ha
    -- necesitado enseñanza directa aunque el último bloque sea limpio.
    select exists (
      select 1
      from ensayos_rft_detalle d
      join bloques_ensayo_rft b on b.id = d.bloque_id
      where b.programa_alumno_id = p_programa_alumno_id
        and b.grupo = p_grupo
        and b.fase = p_fase
        and b.posicion_origen = p_posicion_origen
        and b.posicion_destino = p_posicion_destino
        and d.ayuda != 'independiente'
    ) into v_alguna_ayuda;

    if not v_alguna_ayuda then
      select porcentaje into v_ultimo_porcentaje
      from bloques_ensayo_rft
      where programa_alumno_id = p_programa_alumno_id
        and grupo = p_grupo
        and fase = p_fase
        and posicion_origen = p_posicion_origen
        and posicion_destino = p_posicion_destino
      order by fecha desc
      limit 1;

      v_dominio_logrado := v_ultimo_porcentaje >= v_porcentaje_dominio;
      v_via_entrenamiento := false;
    else
      select count(*) into v_bloques_cumplen
      from (
        select porcentaje
        from bloques_ensayo_rft
        where programa_alumno_id = p_programa_alumno_id
          and grupo = p_grupo
          and fase = p_fase
          and posicion_origen = p_posicion_origen
          and posicion_destino = p_posicion_destino
        order by fecha desc
        limit v_bloques_para_dominio
      ) ultimos
      where porcentaje >= v_porcentaje_dominio;

      v_dominio_logrado := v_bloques_cumplen >= v_bloques_para_dominio;
      v_via_entrenamiento := true;
    end if;
  end if;

  -- Registro granular: dominio de ESTA combinación exacta
  insert into dominio_rft_fases (programa_alumno_id, grupo, fase, posicion_origen, posicion_destino, dominado, via_entrenamiento, updated_at)
  values (p_programa_alumno_id, p_grupo, p_fase, p_posicion_origen, p_posicion_destino, v_dominio_logrado, v_via_entrenamiento, now())
  on conflict (programa_alumno_id, grupo, fase, posicion_origen, posicion_destino)
  do update set dominado = excluded.dominado, via_entrenamiento = excluded.via_entrenamiento, updated_at = now();

  -- Estado general de la clase: solo pasa a "dominado" cuando TODAS las
  -- combinaciones de fases de TEST (no entrenamiento) registradas para
  -- este grupo están dominadas.
  if p_fase != 'entrenamiento' and v_dominio_logrado then
    select count(*) into v_pendientes
    from dominio_rft_fases
    where programa_alumno_id = p_programa_alumno_id
      and grupo = p_grupo
      and fase in ('test_mutuo', 'test_combinatorio', 'transformacion_funciones')
      and dominado = false;

    if v_pendientes = 0 then
      update clases_rft
      set estado = 'dominado'
      where programa_alumno_id = p_programa_alumno_id
        and grupo = p_grupo;
    end if;
  end if;
end;
$function$;
