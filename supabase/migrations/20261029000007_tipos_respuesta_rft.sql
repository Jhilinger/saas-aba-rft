-- Respuestas que no son la elección de un estímulo en los programas RFT
-- (sí/no, igual/diferente/no se sabe, ejecución de una acción, respuesta
-- abierta), respuestas esperadas por clase y ensayos de control.
begin;

-- Tipo de respuesta del programa, con posibles cambios por fase:
-- respuesta_por_fase = {"test_combinatorio": {"tipo": "opciones", "opciones": ["Igual", "Diferente", "No se sabe"]}}
alter table programas_base
  add column tipo_respuesta text not null default 'seleccion'
    check (tipo_respuesta in ('seleccion', 'opciones', 'ejecucion', 'abierta')),
  add column opciones_respuesta text[],
  add column respuesta_por_fase jsonb not null default '{}'::jsonb;

alter table programas_alumno
  add column tipo_respuesta text not null default 'seleccion'
    check (tipo_respuesta in ('seleccion', 'opciones', 'ejecucion', 'abierta')),
  add column opciones_respuesta text[],
  add column respuesta_por_fase jsonb not null default '{}'::jsonb;

-- Respuesta esperada de una clase para cada combinación de posiciones:
-- {"A→C": "No se sabe"}. Si existe, la toma de datos corrige sola.
alter table clases_rft_base add column respuestas_esperadas jsonb not null default '{}'::jsonb;
alter table clases_rft add column respuestas_esperadas jsonb not null default '{}'::jsonb;

-- Respuesta del alumno y ensayos de control (no cuentan para el % ni el dominio)
alter table ensayos_rft_detalle
  add column respuesta text,
  add column tipo_ensayo text not null default 'principal' check (tipo_ensayo in ('principal', 'control'));

alter table bloques_ensayo_rft
  add column controles_total integer not null default 0 check (controles_total >= 0),
  add column controles_aciertos integer not null default 0 check (controles_aciertos >= 0);

-- La configuración de respuesta también es contenido de la plantilla
create or replace function programas_base_marcar_contenido()
returns trigger language plpgsql set search_path = public as $$
begin
  if (new.nombre, new.objetivo, new.materiales, new.instrucciones_terapeuta, new.ayudas_posibles,
      new.ensayos_por_bloque, new.bloques_para_dominio, new.porcentaje_dominio,
      new.tipo_respuesta, new.opciones_respuesta, new.respuesta_por_fase)
     is distinct from
     (old.nombre, old.objetivo, old.materiales, old.instrucciones_terapeuta, old.ayudas_posibles,
      old.ensayos_por_bloque, old.bloques_para_dominio, old.porcentaje_dominio,
      old.tipo_respuesta, old.opciones_respuesta, old.respuesta_por_fase) then
    new.contenido_actualizado_at := now();
  end if;
  return new;
end;
$$;

commit;
