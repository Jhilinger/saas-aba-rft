-- Banco de ítems de la evaluación inicial estandarizada: cribado (decide el
-- nivel de inicio) e ítems por dominio, con los programas del currículo que
-- marca cada ítem como dominado en la valoración inicial.
begin;

create table evaluacion_items (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  tipo text not null check (tipo in ('cribado', 'item')),
  nivel smallint not null references niveles_curriculo(numero),
  dominio_id uuid references dominios_curriculo(id) on delete set null,
  orden integer not null,
  titulo text not null,
  -- tableta: el alumno responde en pantalla; fisico: material o respuesta verbal;
  -- familia: se puede puntuar con información de la familia ("informado")
  formatos text[] not null default '{}' check (formatos <@ array['tableta', 'fisico', 'familia']),
  -- Relacional: enseña relaciones con estímulos nuevos y prueba la derivación
  relacional boolean not null default false,
  -- Indicador: mide el repertorio pero no marca programas como dominados
  indicador boolean not null default false,
  consigna text not null,
  materiales text,
  ensayos integer check (ensayos > 0),
  criterio_2 text,
  criterio_1 text,
  criterio_0 text,
  pregunta_familia text,
  -- Solo se aplica si otro ítem alcanzó esta puntuación
  requiere_item_id uuid references evaluacion_items(id) on delete set null,
  requiere_puntuacion smallint check (requiere_puntuacion between 0 and 2),
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  check ((tipo = 'cribado') = (dominio_id is null))
);

create table evaluacion_item_programas (
  item_id uuid not null references evaluacion_items(id) on delete cascade,
  programa_base_id uuid not null references programas_base(id) on delete cascade,
  primary key (item_id, programa_base_id)
);

alter table evaluacion_items enable row level security;
alter table evaluacion_item_programas enable row level security;

create policy evaluacion_items_select on evaluacion_items for select to authenticated using (true);
create policy evaluacion_items_write on evaluacion_items for all to authenticated
  using (auth_rol() = 'superadmin') with check (auth_rol() = 'superadmin');

create policy evaluacion_item_programas_select on evaluacion_item_programas for select to authenticated using (true);
create policy evaluacion_item_programas_write on evaluacion_item_programas for all to authenticated
  using (auth_rol() = 'superadmin') with check (auth_rol() = 'superadmin');

commit;
