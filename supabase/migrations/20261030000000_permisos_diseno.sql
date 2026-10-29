-- Quién diseña la intervención (PEI, configuración de programas, valoración,
-- colocación, estados e informes). Cada clínica elige: solo supervisores (el
-- clinica_admin y los terapeutas marcados) o cada terapeuta con sus alumnos.
begin;

alter table clinicas
  add column diseno_pei text not null default 'supervisores' check (diseno_pei in ('supervisores', 'terapeutas'));

alter table perfiles add column es_supervisor boolean not null default false;

-- Mismas reglas que antes, con es_supervisor entre los campos que solo cambia
-- el clinica_admin
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

  if (new.activo is distinct from old.activo
      or new.tambien_terapeuta is distinct from old.tambien_terapeuta
      or new.es_supervisor is distinct from old.es_supervisor)
     and v_rol is distinct from 'clinica_admin' then
    raise exception 'Solo el administrador de la clínica puede cambiar este dato' using errcode = '42501';
  end if;

  if new.activo is distinct from old.activo and new.id = auth.uid() then
    raise exception 'No puedes desactivar tu propio perfil' using errcode = '42501';
  end if;

  return new;
end;
$$;

-- ¿El usuario actual diseña la intervención? (el acceso a cada alumno se
-- sigue comprobando aparte con puede_acceder_alumno)
create or replace function auth_puede_disenar()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((
    select p.rol in ('superadmin', 'clinica_admin')
      or (p.rol = 'terapeuta' and (p.es_supervisor or c.diseno_pei = 'terapeutas'))
    from perfiles p
    left join clinicas c on c.id = p.clinica_id
    where p.id = auth.uid() and p.activo
  ), false);
$$;

-- El clinica_admin no tiene permiso de escritura sobre clinicas: cambia solo
-- este ajuste de su propia clínica
create or replace function fijar_diseno_pei(p_valor text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth_rol() is distinct from 'clinica_admin' then
    raise exception 'Solo el administrador de la clínica puede cambiar este ajuste' using errcode = '42501';
  end if;
  if p_valor not in ('supervisores', 'terapeutas') then
    raise exception 'Valor no válido' using errcode = '22023';
  end if;
  update clinicas set diseno_pei = p_valor where id = auth_clinica_id();
end;
$$;

grant execute on function auth_puede_disenar() to authenticated;
grant execute on function fijar_diseno_pei(text) to authenticated;

commit;
