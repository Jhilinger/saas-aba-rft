-- Fecha de inicio de la intervención: por defecto, la fecha de alta del
-- alumno (editable en Datos clínicos si el inicio real fue otro).
begin;

create or replace function alumnos_crear_datos_clinicos()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into alumnos_datos_clinicos (alumno_id, fecha_inicio_intervencion)
  values (new.id, new.created_at::date)
  on conflict (alumno_id) do nothing;
  return new;
end;
$$;

create trigger alumnos_crear_datos_clinicos
  after insert on alumnos
  for each row execute function alumnos_crear_datos_clinicos();

-- Alumnos ya existentes
insert into alumnos_datos_clinicos (alumno_id, fecha_inicio_intervencion)
select id, created_at::date from alumnos
on conflict (alumno_id) do update
  set fecha_inicio_intervencion = coalesce(alumnos_datos_clinicos.fecha_inicio_intervencion, excluded.fecha_inicio_intervencion);

commit;
