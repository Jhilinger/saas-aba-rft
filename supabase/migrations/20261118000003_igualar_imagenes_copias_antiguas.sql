-- Copias antiguas de «Igualar Imágenes» (A.H.A., Álvaro, Fran, Juan Andrés):
-- las dos clases de prueba sin imagen pasan a un grupo aparte (conservan sus
-- ensayos) y se añaden las clases de la plantilla que faltan.
begin;

with copias as (
  select pa.id from programas_alumno pa
  where pa.nombre = 'Igualar Imágenes'
    and exists (select 1 from clases_rft c join estimulos_rft e on e.clase_id = c.id
                where c.programa_alumno_id = pa.id and c.grupo = 'Grupo 1' and e.concepto_imagen is null)
)
update clases_rft c set grupo = 'Pruebas antiguas', nombre = c.nombre || ' (prueba)'
where c.programa_alumno_id in (select id from copias) and c.grupo = 'Grupo 1'
  and exists (select 1 from estimulos_rft e where e.clase_id = c.id and e.concepto_imagen is null);

create temporary table _nuevas on commit drop as
select pa.id programa_alumno_id, cb.id clase_base_id, cb.nombre, cb.grupo, cb.respuestas_esperadas, cb.consignas, gen_random_uuid() nueva_id
from programas_alumno pa
join programas_base pb on pb.clinica_id is null and pb.nombre = 'Igualar Imágenes'
join clases_rft_base cb on cb.programa_base_id = pb.id
where pa.nombre = 'Igualar Imágenes'
  and exists (select 1 from clases_rft c where c.programa_alumno_id = pa.id and c.grupo = 'Pruebas antiguas')
  and not exists (select 1 from clases_rft c where c.programa_alumno_id = pa.id and c.grupo = cb.grupo and c.nombre = cb.nombre);

insert into clases_rft (id, programa_alumno_id, nombre, grupo, tipo_relacion, respuestas_esperadas, consignas)
select nueva_id, programa_alumno_id, nombre, grupo, 'coordinacion', respuestas_esperadas, consignas from _nuevas;

insert into estimulos_rft (clase_id, etiqueta, nombre, posicion, concepto_imagen, pantalla)
select n.nueva_id, e.etiqueta, e.nombre, e.posicion, e.concepto_imagen, e.pantalla
from _nuevas n join estimulos_rft_base e on e.clase_base_id = n.clase_base_id;

commit;
