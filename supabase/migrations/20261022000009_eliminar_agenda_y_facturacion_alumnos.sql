-- Se eliminan la agenda (sesiones, asistencia, recordatorios) y la
-- facturación por alumno (datos fiscales que aportaba la familia): son
-- gestión administrativa de la clínica, fuera del núcleo del producto.
-- Datos al borrar: 3 sesiones de prueba (sept. 2026) y 0 datos de facturación.
begin;

drop table sesiones_programadas;
drop table datos_facturacion_familia;
drop type estado_sesion;

commit;
