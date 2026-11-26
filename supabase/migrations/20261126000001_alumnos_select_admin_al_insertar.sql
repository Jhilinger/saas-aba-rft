-- Fallo desde 20261022000006: un clinica_admin no podía crear alumnos. El insert de la app pide la fila
-- creada (insert … returning), Postgres aplica la política de SELECT y puede_acceder_alumno(id) busca el
-- alumno en la tabla, donde la fila recién insertada aún no se ve en la misma sentencia → «new row violates
-- row-level security policy». Misma regla, pero el acceso del administrador se comprueba con las columnas
-- de la propia fila.
drop policy if exists alumnos_select_clinica on alumnos;
create policy alumnos_select_clinica on alumnos for select using (
  auth_rol() = 'superadmin'
  or (auth_rol() = 'clinica_admin' and clinica_id = auth_clinica_id())
  or puede_acceder_alumno(id)
  or id in (select alumno_familia.alumno_id from alumno_familia where alumno_familia.perfil_id = auth.uid())
);
