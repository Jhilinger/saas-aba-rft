-- Entrevista inicial (sustituye a la evaluación estandarizada de 80 ítems): el terapeuta pregunta y la
-- familia responde; preguntas en el orden del currículo (definidas en el código), regla de parada y
-- resultado aproximado (nivel y dominio por donde empezar, lagunas). El PEI muestra las entrevistas por fecha.
create table if not exists entrevistas_iniciales (
  id uuid primary key default gen_random_uuid(),
  alumno_id uuid not null references alumnos(id) on delete cascade,
  estado text not null default 'en_curso' check (estado in ('en_curso', 'finalizada', 'anulada')),
  -- Nivel por el que se empieza si es evidente (lo anterior se da por «Sí»); null = desde el principio
  nivel_salto integer check (nivel_salto between 1 and 4),
  modalidad text not null default 'vocal' check (modalidad in ('vocal', 'no_vocal')),
  -- número de pregunta → { r: 'si' | 'a_veces' | 'no' | 'no_se', comprobado?: { aciertos, total } }
  respuestas jsonb not null default '{}'::jsonb,
  nivel_recomendado integer,
  dominio_recomendado text,
  lagunas text[] not null default '{}',
  pendientes integer[] not null default '{}',
  notas text,
  creado_por uuid references perfiles(id) default auth.uid(),
  created_at timestamptz not null default now(),
  finalizada_at timestamptz
);

create index if not exists entrevistas_iniciales_alumno on entrevistas_iniciales (alumno_id, created_at desc);

alter table entrevistas_iniciales enable row level security;

create policy entrevistas_iniciales_select on entrevistas_iniciales for select
  using (auth_rol() = 'superadmin' or puede_acceder_alumno(alumno_id));
create policy entrevistas_iniciales_insert on entrevistas_iniciales for insert
  with check (auth_rol() = 'superadmin' or puede_acceder_alumno(alumno_id));
create policy entrevistas_iniciales_update on entrevistas_iniciales for update
  using (auth_rol() = 'superadmin' or puede_acceder_alumno(alumno_id))
  with check (auth_rol() = 'superadmin' or puede_acceder_alumno(alumno_id));
create policy entrevistas_iniciales_delete on entrevistas_iniciales for delete
  using (auth_rol() = 'superadmin' or puede_acceder_alumno(alumno_id));
