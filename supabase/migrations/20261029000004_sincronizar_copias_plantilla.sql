-- Actualizar las copias de los PEI desde su plantilla.
-- programas_base.contenido_actualizado_at registra cuándo cambió el contenido
-- de la plantilla (textos, criterios y estímulos; no el orden ni el dominio).
-- programas_alumno.plantilla_sincronizada_at registra cuándo se aplicó o se
-- descartó por última vez la versión de la plantilla en la copia. El aviso de
-- "versión nueva" sale si la plantilla cambió después y hay diferencias.
begin;

alter table programas_base
  add column contenido_actualizado_at timestamptz not null default now();

alter table programas_alumno
  add column plantilla_sincronizada_at timestamptz not null default now();

-- Las copias existentes se consideran sincronizadas cuando se importaron
update programas_alumno set plantilla_sincronizada_at = created_at;

create or replace function programas_base_marcar_contenido()
returns trigger language plpgsql set search_path = public as $$
begin
  if (new.nombre, new.objetivo, new.materiales, new.instrucciones_terapeuta, new.ayudas_posibles,
      new.ensayos_por_bloque, new.bloques_para_dominio, new.porcentaje_dominio)
     is distinct from
     (old.nombre, old.objetivo, old.materiales, old.instrucciones_terapeuta, old.ayudas_posibles,
      old.ensayos_por_bloque, old.bloques_para_dominio, old.porcentaje_dominio) then
    new.contenido_actualizado_at := now();
  end if;
  return new;
end;
$$;

create trigger programas_base_marcar_contenido
  before update on programas_base
  for each row execute function programas_base_marcar_contenido();

-- Cambios en clases, conjuntos, estímulos o pasos de una plantilla
create or replace function marcar_contenido_programa_base(p_programa_base_id uuid)
returns void language sql set search_path = public as $$
  update programas_base set contenido_actualizado_at = now() where id = p_programa_base_id;
$$;

create or replace function hijos_plantilla_marcar_contenido()
returns trigger language plpgsql set search_path = public as $$
declare
  v_fila jsonb;
  v_programa uuid;
begin
  if tg_op = 'DELETE' then v_fila := to_jsonb(old); else v_fila := to_jsonb(new); end if;
  if tg_table_name in ('clases_rft_base', 'conjuntos_estimulos_base', 'pasos_tarea_base') then
    v_programa := (v_fila->>'programa_base_id')::uuid;
  elsif tg_table_name = 'estimulos_rft_base' then
    select programa_base_id into v_programa from clases_rft_base where id = (v_fila->>'clase_base_id')::uuid;
  elsif tg_table_name = 'estimulos_base' then
    select programa_base_id into v_programa from conjuntos_estimulos_base where id = (v_fila->>'conjunto_id')::uuid;
  end if;
  if v_programa is not null then
    perform marcar_contenido_programa_base(v_programa);
  end if;
  return null;
end;
$$;

create trigger clases_rft_base_marcar_contenido
  after insert or update or delete on clases_rft_base
  for each row execute function hijos_plantilla_marcar_contenido();
create trigger estimulos_rft_base_marcar_contenido
  after insert or update or delete on estimulos_rft_base
  for each row execute function hijos_plantilla_marcar_contenido();
create trigger conjuntos_estimulos_base_marcar_contenido
  after insert or update or delete on conjuntos_estimulos_base
  for each row execute function hijos_plantilla_marcar_contenido();
create trigger estimulos_base_marcar_contenido
  after insert or update or delete on estimulos_base
  for each row execute function hijos_plantilla_marcar_contenido();
create trigger pasos_tarea_base_marcar_contenido
  after insert or update or delete on pasos_tarea_base
  for each row execute function hijos_plantilla_marcar_contenido();

commit;
