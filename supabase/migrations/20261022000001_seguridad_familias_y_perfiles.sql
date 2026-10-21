-- Seguridad: (1) nadie salvo el superadmin puede cambiar el rol/clínica de un
-- perfil (antes un terapeuta o familia podía hacerse clinica_admin vía API);
-- (2) las familias dejan de heredar acceso "por clínica" (antes podían leer
-- datos de todos los niños de su clínica) y acceden solo a través de su
-- vínculo con su hijo (alumno_familia).

begin;

-- ============================================================
-- 1. Perfiles: escalada de rol
-- ============================================================

drop policy perfiles_update on perfiles;
create policy perfiles_update on perfiles for update
  using (
    auth_rol() = 'superadmin'
    or id = auth.uid()
    or (auth_rol() = 'clinica_admin' and clinica_id = auth_clinica_id())
  )
  with check (
    auth_rol() = 'superadmin'
    or id = auth.uid()
    or (auth_rol() = 'clinica_admin' and clinica_id = auth_clinica_id())
  );

-- Qué campos puede cambiar cada uno (RLS no distingue columnas):
-- - rol, clinica_id, id, created_at: solo el superadmin
-- - activo, tambien_terapeuta: solo el clinica_admin (activo, nunca el suyo)
-- - nombre, email: el propio usuario o el clinica_admin
-- Sin auth.uid() (service role, SQL directo) no se restringe nada.
create or replace function perfiles_proteger_campos()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_rol rol_usuario;
begin
  if auth.uid() is null then
    return new;
  end if;

  select rol into v_rol from perfiles where id = auth.uid();
  if v_rol = 'superadmin' then
    return new;
  end if;

  if new.id is distinct from old.id
     or new.created_at is distinct from old.created_at
     or new.rol is distinct from old.rol
     or new.clinica_id is distinct from old.clinica_id then
    raise exception 'No tienes permiso para cambiar el rol o la clínica de un perfil' using errcode = '42501';
  end if;

  if (new.activo is distinct from old.activo or new.tambien_terapeuta is distinct from old.tambien_terapeuta)
     and v_rol is distinct from 'clinica_admin' then
    raise exception 'Solo el administrador de la clínica puede cambiar este dato' using errcode = '42501';
  end if;

  if new.activo is distinct from old.activo and new.id = auth.uid() then
    raise exception 'No puedes desactivar tu propio perfil' using errcode = '42501';
  end if;

  return new;
end;
$$;

create trigger perfiles_proteger_campos
  before update on perfiles
  for each row execute function perfiles_proteger_campos();

-- ============================================================
-- 2. Familias: sin acceso "por clínica"
-- ============================================================

-- La clínica del usuario, solo para el personal. Todas las políticas "es de mi
-- clínica" dejan así de aplicar a las familias.
create or replace function auth_clinica_id()
returns uuid language sql stable security definer set search_path = public as $$
  select clinica_id from perfiles where id = auth.uid() and rol <> 'familia';
$$;

-- Alumnos vinculados a la familia y sus clínicas (security definer para no
-- encadenar políticas RLS dentro de otras políticas)
create or replace function familia_alumnos()
returns setof uuid language sql stable security definer set search_path = public as $$
  select alumno_id from alumno_familia where perfil_id = auth.uid();
$$;

create or replace function familia_clinicas()
returns setof uuid language sql stable security definer set search_path = public as $$
  select distinct a.clinica_id
  from alumnos a join alumno_familia af on af.alumno_id = a.id
  where af.perfil_id = auth.uid() and a.clinica_id is not null;
$$;

revoke execute on function familia_alumnos() from public, anon;
revoke execute on function familia_clinicas() from public, anon;
grant execute on function familia_alumnos() to authenticated;
grant execute on function familia_clinicas() to authenticated;

-- Perfiles: cada uno ve el suyo; el personal, los de su clínica
drop policy perfiles_select on perfiles;
create policy perfiles_select on perfiles for select
  using (auth_rol() = 'superadmin' or id = auth.uid() or clinica_id = auth_clinica_id());

-- Accesos propios de la familia (se suman a las políticas existentes)
create policy clinicas_select_familia on clinicas for select
  using (id in (select familia_clinicas()));

create policy informes_select_familia on informes for select
  using (destinatario = 'familia' and alumno_id in (select familia_alumnos()));

create policy tipos_documento_select_familia on tipos_documento_clinica for select
  using (clinica_id in (select familia_clinicas()));

create policy programas_base_select_familia on programas_base for select
  using (
    (visibilidad = 'clinica' and clinica_id in (select familia_clinicas()))
    or id in (
      select pa.programa_base_id from programas_alumno pa
      where pa.alumno_id in (select familia_alumnos())
    )
  );

create policy dominio_rft_fases_select_familia on dominio_rft_fases for select
  using (
    programa_alumno_id in (
      select pa.id from programas_alumno pa where pa.alumno_id in (select familia_alumnos())
    )
  );

commit;
