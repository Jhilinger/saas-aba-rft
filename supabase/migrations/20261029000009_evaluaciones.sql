-- Aplicaciones de la evaluación inicial estandarizada a un alumno y sus
-- respuestas ítem a ítem (con los ensayos), más el guion de ensayos de los
-- ítems que se aplican en tableta.
begin;

-- Ensayos predefinidos para la pantalla del alumno: lista de
-- { fase: 'entrenamiento' | 'test', consigna, modelo, opciones, correcta }
alter table evaluacion_items add column guion jsonb;

create table evaluaciones (
  id uuid primary key default gen_random_uuid(),
  alumno_id uuid not null references alumnos(id) on delete cascade,
  evaluador_id uuid references perfiles(id) on delete set null,
  -- no_vocal: se aplican las variantes por selección de los ítems relacionales
  modalidad text not null default 'vocal' check (modalidad in ('vocal', 'no_vocal')),
  estado text not null default 'en_curso' check (estado in ('en_curso', 'finalizada', 'anulada')),
  -- Calculado por el cribado (el evaluador puede cambiarlo)
  nivel_inicio smallint references niveles_curriculo(numero),
  notas text,
  iniciada_at timestamptz not null default now(),
  finalizada_at timestamptz,
  colocacion_aplicada_at timestamptz,
  updated_at timestamptz not null default now()
);

create index evaluaciones_alumno_idx on evaluaciones (alumno_id, iniciada_at desc);

create table evaluacion_respuestas (
  evaluacion_id uuid not null references evaluaciones(id) on delete cascade,
  item_id uuid not null references evaluacion_items(id),
  -- null: sin puntuar todavía o no aplicado
  puntuacion smallint check (puntuacion between 0 and 2),
  no_aplicado text check (no_aplicado in ('techo', 'requisito', 'no_procede')),
  fuente text not null default 'observado' check (fuente in ('observado', 'informado')),
  -- Lista de { fase, correcto, respuesta?, latencia_ms? }
  ensayos jsonb not null default '[]',
  -- Ítems relacionales: bloques de entrenamiento hasta el criterio (o hasta el máximo)
  bloques_entrenamiento smallint check (bloques_entrenamiento between 0 and 10),
  entrenamiento_superado boolean,
  notas text,
  updated_at timestamptz not null default now(),
  primary key (evaluacion_id, item_id),
  check (puntuacion is null or no_aplicado is null)
);

alter table evaluaciones enable row level security;
alter table evaluacion_respuestas enable row level security;

-- Solo personal con acceso al alumno y superadmin. Las evaluaciones no se
-- borran: se anulan.
create policy evaluaciones_select on evaluaciones for select
  using (auth_rol() = 'superadmin' or puede_acceder_alumno(alumno_id));
create policy evaluaciones_insert on evaluaciones for insert
  with check (auth_rol() = 'superadmin' or puede_acceder_alumno(alumno_id));
create policy evaluaciones_update on evaluaciones for update
  using (auth_rol() = 'superadmin' or puede_acceder_alumno(alumno_id))
  with check (auth_rol() = 'superadmin' or puede_acceder_alumno(alumno_id));

create policy evaluacion_respuestas_all on evaluacion_respuestas for all
  using (exists (
    select 1 from evaluaciones e
    where e.id = evaluacion_id and (auth_rol() = 'superadmin' or puede_acceder_alumno(e.alumno_id))
  ))
  with check (exists (
    select 1 from evaluaciones e
    where e.id = evaluacion_id and e.estado = 'en_curso'
      and (auth_rol() = 'superadmin' or puede_acceder_alumno(e.alumno_id))
  ));

commit;
