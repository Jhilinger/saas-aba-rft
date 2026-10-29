-- Requisitos previos entre programas (antes solo en el texto de las
-- instrucciones). El importador del PEI avisa de los que el alumno no ha
-- dominado; no bloquean (la secuencia entre dominios sigue en calcularBloqueos).
begin;

create table requisitos_programa (
  programa_base_id uuid not null references programas_base(id) on delete cascade,
  requisito_id uuid not null references programas_base(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (programa_base_id, requisito_id),
  check (programa_base_id <> requisito_id)
);

create index requisitos_programa_requisito_idx on requisitos_programa (requisito_id);

alter table requisitos_programa enable row level security;

-- Visible si se ven los dos programas (las subconsultas aplican la RLS de programas_base)
create policy requisitos_programa_select on requisitos_programa for select to authenticated
using (
  exists (select 1 from programas_base where id = programa_base_id)
  and exists (select 1 from programas_base where id = requisito_id)
);

-- Edita quien puede editar el programa: superadmin en el currículo global;
-- el autor o el clinica_admin en los de su clínica
create or replace function puede_editar_programa_base(p_programa_base_id uuid)
returns boolean language sql stable security invoker set search_path = public as $$
  select exists (
    select 1 from programas_base pb
    where pb.id = p_programa_base_id
      and (
        (auth_rol() = 'superadmin' and pb.clinica_id is null)
        or (pb.clinica_id = auth_clinica_id() and (pb.creado_por = auth.uid() or auth_rol() = 'clinica_admin'))
      )
  );
$$;

create policy requisitos_programa_insert on requisitos_programa for insert to authenticated
with check (
  puede_editar_programa_base(programa_base_id)
  and exists (select 1 from programas_base where id = requisito_id)
);

create policy requisitos_programa_delete on requisitos_programa for delete to authenticated
using (puede_editar_programa_base(programa_base_id));

commit;
