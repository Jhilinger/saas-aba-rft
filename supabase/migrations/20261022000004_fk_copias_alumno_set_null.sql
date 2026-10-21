-- Las copias de estímulos del alumno apuntaban a la plantilla sin regla de
-- borrado: impedían borrar un programa base (o un conjunto/estímulo de
-- plantilla) que se hubiera asignado alguna vez. Como en programas_alumno y
-- pasos_tarea_alumno, la copia del alumno se conserva y pierde el enlace.
begin;

alter table conjuntos_estimulos_alumno
  drop constraint conjuntos_estimulos_alumno_conjunto_base_id_fkey,
  add constraint conjuntos_estimulos_alumno_conjunto_base_id_fkey
    foreign key (conjunto_base_id) references conjuntos_estimulos_base(id) on delete set null;

alter table estimulos_alumno
  drop constraint estimulos_alumno_estimulo_base_id_fkey,
  add constraint estimulos_alumno_estimulo_base_id_fkey
    foreign key (estimulo_base_id) references estimulos_base(id) on delete set null;

-- Programa de clínica de prueba ("Identificar colores primarios")
delete from programas_base where id = '5dd11357-64f5-4151-b100-9c11ca28324e';

commit;
