-- Programas marcados como "dominado" en la valoración inicial de un alumno.
-- La usa la vista de progreso de la familia para que sus porcentajes coincidan
-- con los del terapeuta, sin dar a la familia acceso a la tabla
-- evaluaciones_iniciales (que incluye las notas del terapeuta).
-- Solo devuelve filas a la familia vinculada al alumno, al personal de su
-- clínica o al superadmin.
create or replace function programas_dominados_valoracion(p_alumno_id uuid)
returns setof uuid
language sql stable security definer set search_path = public as $$
  select e.programa_base_id
  from evaluaciones_iniciales e
  where e.alumno_id = p_alumno_id
    and e.valoracion = 'dominado'
    and (
      auth_rol() = 'superadmin'
      or exists (select 1 from alumno_familia af where af.alumno_id = p_alumno_id and af.perfil_id = auth.uid())
      -- auth_clinica_id() también devuelve la clínica de una familia: hay que
      -- exigir rol de personal o una familia vería a otros niños de su clínica
      or (
        auth_rol() in ('clinica_admin', 'terapeuta')
        and exists (select 1 from alumnos a where a.id = p_alumno_id and a.clinica_id = auth_clinica_id())
      )
    );
$$;

revoke execute on function programas_dominados_valoracion(uuid) from public, anon;
grant execute on function programas_dominados_valoracion(uuid) to authenticated;
