-- Una combinación de test (mutuo, combinatorio, transformación de funciones)
-- solo es DERIVADA si ninguno de sus bloques ha tenido ayudas. Antes se
-- miraba únicamente el último bloque, de modo que una relación enseñada con
-- ayudas y cerrada con un bloque limpio al criterio quedaba marcada como
-- derivada.
create or replace function public.actualizar_dominio_grupo_rft(p_programa_alumno_id uuid, p_grupo text, p_fase fase_rft, p_posicion_origen text, p_posicion_destino text)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
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
    -- Entrenamiento: sin cambios. Los últimos N bloques de esta combinación
    -- exacta deben llegar al % de dominio.
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

-- Corrige las combinaciones ya marcadas como derivadas que tuvieron ayudas
-- en algún bloque
update dominio_rft_fases f
set via_entrenamiento = true, updated_at = now()
where f.fase in ('test_mutuo', 'test_combinatorio', 'transformacion_funciones')
  and f.via_entrenamiento = false
  and exists (
    select 1
    from ensayos_rft_detalle d
    join bloques_ensayo_rft b on b.id = d.bloque_id
    where b.programa_alumno_id = f.programa_alumno_id
      and b.grupo = f.grupo
      and b.fase = f.fase
      and b.posicion_origen = f.posicion_origen
      and b.posicion_destino = f.posicion_destino
      and d.ayuda != 'independiente'
  );
