-- clases_rft_base / estimulos_rft_base tenían una única política ALL que
-- permitía a cualquier usuario autenticado (incluidas familias) crear,
-- modificar o borrar las plantillas RFT de los programas globales.
-- Se separa lectura y escritura, igual que en conjuntos/estimulos_base.
begin;

drop policy clases_rft_base_all on clases_rft_base;
drop policy estimulos_rft_base_all on estimulos_rft_base;

-- Lectura: plantillas de programas globales o de la propia clínica
create policy clases_rft_base_select on clases_rft_base for select
  using (
    auth_rol() = 'superadmin'
    or exists (
      select 1 from programas_base pb
      where pb.id = clases_rft_base.programa_base_id
        and (pb.clinica_id is null or pb.clinica_id = auth_clinica_id())
    )
  );
create policy estimulos_rft_base_select on estimulos_rft_base for select
  using (
    auth_rol() = 'superadmin'
    or exists (
      select 1 from clases_rft_base crb join programas_base pb on pb.id = crb.programa_base_id
      where crb.id = estimulos_rft_base.clase_base_id
        and (pb.clinica_id is null or pb.clinica_id = auth_clinica_id())
    )
  );

-- Escritura: superadmin, o quien gestiona el programa de su clínica
create policy clases_rft_base_gestion on clases_rft_base for all
  using (
    exists (
      select 1 from programas_base pb
      where pb.id = clases_rft_base.programa_base_id
        and (
          auth_rol() = 'superadmin'
          or (pb.clinica_id = auth_clinica_id() and (pb.creado_por = auth.uid() or auth_rol() = 'clinica_admin'))
        )
    )
  )
  with check (
    exists (
      select 1 from programas_base pb
      where pb.id = clases_rft_base.programa_base_id
        and (
          auth_rol() = 'superadmin'
          or (pb.clinica_id = auth_clinica_id() and (pb.creado_por = auth.uid() or auth_rol() = 'clinica_admin'))
        )
    )
  );
create policy estimulos_rft_base_gestion on estimulos_rft_base for all
  using (
    exists (
      select 1 from clases_rft_base crb join programas_base pb on pb.id = crb.programa_base_id
      where crb.id = estimulos_rft_base.clase_base_id
        and (
          auth_rol() = 'superadmin'
          or (pb.clinica_id = auth_clinica_id() and (pb.creado_por = auth.uid() or auth_rol() = 'clinica_admin'))
        )
    )
  )
  with check (
    exists (
      select 1 from clases_rft_base crb join programas_base pb on pb.id = crb.programa_base_id
      where crb.id = estimulos_rft_base.clase_base_id
        and (
          auth_rol() = 'superadmin'
          or (pb.clinica_id = auth_clinica_id() and (pb.creado_por = auth.uid() or auth_rol() = 'clinica_admin'))
        )
    )
  );

commit;
