-- Banco de imágenes de estímulos (generadas con IA y revisadas) para el modo
-- tableta. Cada concepto tiene varios ejemplares: los de entrenamiento se
-- alternan en los ensayos, el de generalización se reserva para la sonda con
-- un estímulo nuevo y el de evaluación, para la evaluación inicial.
begin;

create table biblioteca_imagenes (
  id uuid primary key default gen_random_uuid(),
  -- Clave del concepto, «categoría/concepto» (ej. alimentos/platano)
  concepto text not null,
  categoria text not null,
  nombre text not null,
  ejemplar text not null,
  uso text not null check (uso in ('entrenamiento', 'generalizacion', 'evaluacion')),
  -- Ruta dentro del bucket «biblioteca»
  ruta text not null unique,
  descripcion text,
  prompt text,
  modelo text,
  created_at timestamptz not null default now(),
  unique (concepto, ejemplar)
);

create index biblioteca_imagenes_concepto_idx on biblioteca_imagenes (concepto);

alter table biblioteca_imagenes enable row level security;
create policy biblioteca_imagenes_select on biblioteca_imagenes for select to authenticated using (true);
create policy biblioteca_imagenes_write on biblioteca_imagenes for all to authenticated
  using (auth_rol() = 'superadmin') with check (auth_rol() = 'superadmin');

-- Imágenes sin datos personales: lectura pública para servirlas a la tableta
insert into storage.buckets (id, name, public) values ('biblioteca', 'biblioteca', true)
on conflict (id) do nothing;

-- Concepto del banco que representa a un estímulo (la app elige el ejemplar)
alter table estimulos_rft_base add column concepto_imagen text;
alter table estimulos_rft add column concepto_imagen text;

-- Cómo se tomó cada bloque RFT: con material físico o en la tableta
alter table bloques_ensayo_rft
  add column modo text not null default 'material' check (modo in ('material', 'tableta'));

commit;
