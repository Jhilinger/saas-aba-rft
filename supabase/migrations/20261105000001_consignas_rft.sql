-- Consignas de los programas RFT: la clave relacional que se le da al alumno
-- (la tableta la dice en voz alta; con material, el terapeuta la lee). Por
-- programa y paso ({"entrenamiento:A→B": "Toca {muestra}", ...}, con
-- "alternativas" por relación para las sondas de generalización) y, cuando la
-- pregunta depende de la clase (transformación de funciones, categorías), por
-- clase con las mismas claves.

alter table programas_base add column if not exists consignas jsonb;
alter table programas_alumno add column if not exists consignas jsonb;
alter table clases_rft_base add column if not exists consignas jsonb;
alter table clases_rft add column if not exists consignas jsonb;

comment on column programas_base.consignas is 'Consignas por paso: {pasos: {"fase:O→D": texto}, alternativas: {"O→D": texto}}; {muestra} = la palabra oída de la muestra (ver app/dashboard/consignas-rft.ts)';
comment on column programas_alumno.consignas is 'Copia editable de programas_base.consignas';
comment on column clases_rft_base.consignas is 'Consignas propias de la clase: {"fase:O→D": texto}; tienen prioridad sobre las del programa';
comment on column clases_rft.consignas is 'Copia editable de clases_rft_base.consignas';

-- Un cambio de consignas en la plantilla también avisa a las copias del PEI
create or replace function programas_base_marcar_contenido()
returns trigger language plpgsql set search_path = public as $$
begin
  if (new.nombre, new.objetivo, new.materiales, new.instrucciones_terapeuta, new.ayudas_posibles,
      new.ensayos_por_bloque, new.bloques_para_dominio, new.porcentaje_dominio,
      new.tipo_respuesta, new.opciones_respuesta, new.respuesta_por_fase, new.secuencia_rft, new.consignas)
     is distinct from
     (old.nombre, old.objetivo, old.materiales, old.instrucciones_terapeuta, old.ayudas_posibles,
      old.ensayos_por_bloque, old.bloques_para_dominio, old.porcentaje_dominio,
      old.tipo_respuesta, old.opciones_respuesta, old.respuesta_por_fase, old.secuencia_rft, old.consignas) then
    new.contenido_actualizado_at := now();
  end if;
  return new;
end;
$$;
