-- Los datos clínicos del alumno pasan a una tabla propia (1:1) que solo ve el
-- personal con acceso al alumno. La familia puede leer la fila de su hijo en
-- `alumnos` (lo necesitan sus pantallas), y RLS no filtra columnas: así deja
-- de tener acceso a diagnóstico, medicación, notas clínicas, etc.
begin;

create table alumnos_datos_clinicos (
  alumno_id uuid primary key references alumnos(id) on delete cascade,
  fecha_inicio_intervencion date,
  diagnostico text,
  modalidad_comunicacion text
    check (modalidad_comunicacion in ('vocal', 'signos', 'pictogramas', 'saac', 'mixta', 'no_funcional')),
  idiomas_entorno text,
  colegio text,
  otras_terapias text,
  medicacion text,
  alergias text,
  conductas_riesgo text,
  contacto_emergencia text,
  notas_clinicas text,
  updated_at timestamptz not null default now()
);

insert into alumnos_datos_clinicos (alumno_id, fecha_inicio_intervencion, diagnostico, modalidad_comunicacion,
  idiomas_entorno, colegio, otras_terapias, medicacion, alergias, conductas_riesgo, contacto_emergencia, notas_clinicas)
select id, fecha_inicio_intervencion, diagnostico, modalidad_comunicacion, idiomas_entorno, colegio,
  otras_terapias, medicacion, alergias, conductas_riesgo, contacto_emergencia, notas_clinicas
from alumnos
where coalesce(fecha_inicio_intervencion::text, diagnostico, modalidad_comunicacion, idiomas_entorno, colegio,
  otras_terapias, medicacion, alergias, conductas_riesgo, contacto_emergencia, notas_clinicas) is not null;

alter table alumnos
  drop column fecha_inicio_intervencion,
  drop column diagnostico,
  drop column modalidad_comunicacion,
  drop column idiomas_entorno,
  drop column colegio,
  drop column otras_terapias,
  drop column medicacion,
  drop column alergias,
  drop column conductas_riesgo,
  drop column contacto_emergencia,
  drop column notas_clinicas;

alter table alumnos_datos_clinicos enable row level security;

-- Solo personal con acceso al alumno (clinica_admin de su clínica o
-- terapeuta asignado) y superadmin. Nunca familias.
create policy alumnos_datos_clinicos_select on alumnos_datos_clinicos for select
  using (auth_rol() = 'superadmin' or puede_acceder_alumno(alumno_id));
create policy alumnos_datos_clinicos_insert on alumnos_datos_clinicos for insert
  with check (auth_rol() = 'superadmin' or puede_acceder_alumno(alumno_id));
create policy alumnos_datos_clinicos_update on alumnos_datos_clinicos for update
  using (auth_rol() = 'superadmin' or puede_acceder_alumno(alumno_id))
  with check (auth_rol() = 'superadmin' or puede_acceder_alumno(alumno_id));

commit;
