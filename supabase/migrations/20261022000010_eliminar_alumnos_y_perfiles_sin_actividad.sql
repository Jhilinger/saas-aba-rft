-- Eliminar alumnos, terapeutas y familias creados por error (sin actividad).
-- Si ya tienen datos, se archivan/desactivan: la historia clínica conserva
-- quién registró qué. Solo el clinica_admin, y solo en su clínica.
begin;

-- Alumno: solo si no tiene ningún dato clínico (las FK hacia alumnos son
-- ON DELETE CASCADE, así que hay que comprobarlo explícitamente)
create or replace function eliminar_alumno_sin_datos(p_alumno_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth_rol() is distinct from 'clinica_admin'
     or not exists (select 1 from alumnos where id = p_alumno_id and clinica_id = auth_clinica_id()) then
    raise exception 'No tienes permiso para eliminar este alumno' using errcode = '42501';
  end if;

  if exists (select 1 from programas_alumno where alumno_id = p_alumno_id)
     or exists (select 1 from evaluaciones_iniciales where alumno_id = p_alumno_id)
     or exists (select 1 from informes where alumno_id = p_alumno_id)
     or exists (select 1 from preferencias_alumno where alumno_id = p_alumno_id)
     or exists (select 1 from evaluaciones_preferencia where alumno_id = p_alumno_id) then
    raise exception 'El alumno ya tiene datos registrados: archívalo en lugar de eliminarlo' using errcode = 'P0001';
  end if;

  delete from alumnos where id = p_alumno_id;  -- arrastra sus vínculos con terapeutas y familias
end;
$$;

-- Terapeuta o familia: borra la cuenta de acceso (auth.users), que arrastra
-- el perfil y sus vínculos. Si tiene actividad registrada, las FK sin
-- cascada lo impiden y se devuelve un mensaje claro.
create or replace function eliminar_perfil_sin_actividad(p_perfil_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth_rol() is distinct from 'clinica_admin'
     or p_perfil_id = auth.uid()
     or not exists (
       select 1 from perfiles
       where id = p_perfil_id and clinica_id = auth_clinica_id() and rol in ('terapeuta', 'familia')
     ) then
    raise exception 'No tienes permiso para eliminar este perfil' using errcode = '42501';
  end if;

  begin
    delete from auth.users where id = p_perfil_id;
  exception when foreign_key_violation then
    raise exception 'Ya tiene actividad registrada: desactívalo en lugar de eliminarlo' using errcode = 'P0001';
  end;
end;
$$;

revoke execute on function eliminar_alumno_sin_datos(uuid) from public, anon;
revoke execute on function eliminar_perfil_sin_actividad(uuid) from public, anon;
grant execute on function eliminar_alumno_sin_datos(uuid) to authenticated;
grant execute on function eliminar_perfil_sin_actividad(uuid) to authenticated;

commit;
