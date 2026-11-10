-- Opciones definidas por la clase: en los programas de relaciones enunciadas
-- verbalmente (nivel 3), cada ensayo ofrece los dos elementos de la relación
-- de esa clase y un distractor de otra clase del grupo, para que la respuesta
-- dependa de la clave relacional y no de haber oído el nombre (si las
-- opciones fueran solo los B del grupo, bastaría con elegir el nombrado).
-- Piloto: «Vincular Mutuamente Relaciones Espaciales» con 8 grupos.

begin;

alter table programas_base add column if not exists opciones_clase boolean not null default false;
alter table programas_alumno add column if not exists opciones_clase boolean not null default false;
comment on column programas_base.opciones_clase is 'Las opciones de cada ensayo son los estímulos de la propia clase y un distractor de otra clase del grupo';
comment on column programas_alumno.opciones_clase is 'Copia de programas_base.opciones_clase';

create or replace function programas_base_marcar_contenido()
returns trigger language plpgsql set search_path = public as $$
begin
  if (new.nombre, new.objetivo, new.materiales, new.instrucciones_terapeuta, new.ayudas_posibles,
      new.ensayos_por_bloque, new.bloques_para_dominio, new.porcentaje_dominio,
      new.tipo_respuesta, new.opciones_respuesta, new.respuesta_por_fase, new.secuencia_rft, new.consignas, new.actividad_tablet, new.opciones_clase)
     is distinct from
     (old.nombre, old.objetivo, old.materiales, old.instrucciones_terapeuta, old.ayudas_posibles,
      old.ensayos_por_bloque, old.bloques_para_dominio, old.porcentaje_dominio,
      old.tipo_respuesta, old.opciones_respuesta, old.respuesta_por_fase, old.secuencia_rft, old.consignas, old.actividad_tablet, old.opciones_clase) then
    new.contenido_actualizado_at := now();
  end if;
  return new;
end;
$$;

-- Piloto: se sustituyen las clases de ejemplo por 8 grupos con imágenes
delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales');

with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'), 'Clase 1', 'Grupo 1', '{"entrenamiento:B→A": "El gato está encima de la mesa. ¿Qué está encima de la mesa?", "test_mutuo:A→B": "El gato está encima de la mesa. ¿Qué está debajo del gato?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A1', 'A', 'Gato', 'animales-de-granja/gato'),
  ('B1', 'B', 'Mesa', 'muebles/mesa')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'), 'Clase 2', 'Grupo 1', '{"entrenamiento:B→A": "El perro está delante del coche. ¿Qué está delante del coche?", "test_mutuo:A→B": "El perro está delante del coche. ¿Qué está detrás del perro?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A2', 'A', 'Perro', 'animales-de-granja/perro'),
  ('B2', 'B', 'Coche', 'vehiculos/coche')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'), 'Clase 3', 'Grupo 1', '{"entrenamiento:B→A": "La taza está a la izquierda del plato. ¿Qué está a la izquierda del plato?", "test_mutuo:A→B": "La taza está a la izquierda del plato. ¿Qué está a la derecha de la taza?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A3', 'A', 'Taza', 'utensilios-de-cocina/taza'),
  ('B3', 'B', 'Plato', 'utensilios-de-cocina/plato')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'), 'Clase 4', 'Grupo 2', '{"entrenamiento:B→A": "La pelota está debajo de la silla. ¿Qué está debajo de la silla?", "test_mutuo:A→B": "La pelota está debajo de la silla. ¿Qué está encima de la pelota?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A4', 'A', 'Pelota', 'objetos/pelota'),
  ('B4', 'B', 'Silla', 'muebles/silla')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'), 'Clase 5', 'Grupo 2', '{"entrenamiento:B→A": "El caballo está detrás de la vaca. ¿Qué está detrás de la vaca?", "test_mutuo:A→B": "El caballo está detrás de la vaca. ¿Qué está delante del caballo?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A5', 'A', 'Caballo', 'animales-de-granja/caballo'),
  ('B5', 'B', 'Vaca', 'animales-de-granja/vaca')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'), 'Clase 6', 'Grupo 2', '{"entrenamiento:B→A": "La cuchara está a la derecha del vaso. ¿Qué está a la derecha del vaso?", "test_mutuo:A→B": "La cuchara está a la derecha del vaso. ¿Qué está a la izquierda de la cuchara?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A6', 'A', 'Cuchara', 'utensilios-de-cocina/cuchara'),
  ('B6', 'B', 'Vaso', 'utensilios-de-cocina/vaso')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'), 'Clase 7', 'Grupo 3', '{"entrenamiento:B→A": "El libro está encima de la cama. ¿Qué está encima de la cama?", "test_mutuo:A→B": "El libro está encima de la cama. ¿Qué está debajo del libro?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A7', 'A', 'Libro', 'material-escolar/libro'),
  ('B7', 'B', 'Cama', 'muebles/cama')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'), 'Clase 8', 'Grupo 3', '{"entrenamiento:B→A": "La moto está delante del autobús. ¿Qué está delante del autobús?", "test_mutuo:A→B": "La moto está delante del autobús. ¿Qué está detrás de la moto?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A8', 'A', 'Moto', 'vehiculos/moto'),
  ('B8', 'B', 'Autobús', 'vehiculos/autobus')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'), 'Clase 9', 'Grupo 3', '{"entrenamiento:B→A": "La manzana está a la izquierda del plátano. ¿Qué está a la izquierda del plátano?", "test_mutuo:A→B": "La manzana está a la izquierda del plátano. ¿Qué está a la derecha de la manzana?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A9', 'A', 'Manzana', 'alimentos/manzana'),
  ('B9', 'B', 'Plátano', 'alimentos/platano')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'), 'Clase 10', 'Grupo 4', '{"entrenamiento:B→A": "El gorro está encima del armario. ¿Qué está encima del armario?", "test_mutuo:A→B": "El gorro está encima del armario. ¿Qué está debajo del gorro?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A10', 'A', 'Gorro', 'prendas-de-vestir/gorro'),
  ('B10', 'B', 'Armario', 'muebles/armario')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'), 'Clase 11', 'Grupo 4', '{"entrenamiento:B→A": "La oveja está detrás del cerdo. ¿Qué está detrás del cerdo?", "test_mutuo:A→B": "La oveja está detrás del cerdo. ¿Qué está delante de la oveja?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A11', 'A', 'Oveja', 'animales-de-granja/oveja'),
  ('B11', 'B', 'Cerdo', 'animales-de-granja/cerdo')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'), 'Clase 12', 'Grupo 4', '{"entrenamiento:B→A": "El tenedor está a la derecha del bol. ¿Qué está a la derecha del bol?", "test_mutuo:A→B": "El tenedor está a la derecha del bol. ¿Qué está a la izquierda del tenedor?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A12', 'A', 'Tenedor', 'utensilios-de-cocina/tenedor'),
  ('B12', 'B', 'Bol', 'utensilios-de-cocina/bol')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'), 'Clase 13', 'Grupo 5', '{"entrenamiento:B→A": "El peluche está debajo del sofá. ¿Qué está debajo del sofá?", "test_mutuo:A→B": "El peluche está debajo del sofá. ¿Qué está encima del peluche?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A13', 'A', 'Peluche', 'objetos/peluche'),
  ('B13', 'B', 'Sofá', 'muebles/sofa')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'), 'Clase 14', 'Grupo 5', '{"entrenamiento:B→A": "El pato está delante de la gallina. ¿Qué está delante de la gallina?", "test_mutuo:A→B": "El pato está delante de la gallina. ¿Qué está detrás del pato?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A14', 'A', 'Pato', 'animales-de-granja/pato'),
  ('B14', 'B', 'Gallina', 'animales-de-granja/gallina')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'), 'Clase 15', 'Grupo 5', '{"entrenamiento:B→A": "El lápiz está a la izquierda de la goma. ¿Qué está a la izquierda de la goma?", "test_mutuo:A→B": "El lápiz está a la izquierda de la goma. ¿Qué está a la derecha del lápiz?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A15', 'A', 'Lápiz', 'material-escolar/lapiz'),
  ('B15', 'B', 'Goma', 'material-escolar/goma')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'), 'Clase 16', 'Grupo 6', '{"entrenamiento:B→A": "El globo está encima de la estantería. ¿Qué está encima de la estantería?", "test_mutuo:A→B": "El globo está encima de la estantería. ¿Qué está debajo del globo?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A16', 'A', 'Globo', 'objetos/globo'),
  ('B16', 'B', 'Estantería', 'muebles/estanteria')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'), 'Clase 17', 'Grupo 6', '{"entrenamiento:B→A": "El camión está detrás del tractor. ¿Qué está detrás del tractor?", "test_mutuo:A→B": "El camión está detrás del tractor. ¿Qué está delante del camión?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A17', 'A', 'Camión', 'vehiculos/camion'),
  ('B17', 'B', 'Tractor', 'vehiculos/tractor')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'), 'Clase 18', 'Grupo 6', '{"entrenamiento:B→A": "La galleta está a la derecha de la leche. ¿Qué está a la derecha de la leche?", "test_mutuo:A→B": "La galleta está a la derecha de la leche. ¿Qué está a la izquierda de la galleta?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A18', 'A', 'Galleta', 'alimentos/galleta'),
  ('B18', 'B', 'Leche', 'alimentos/leche')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'), 'Clase 19', 'Grupo 7', '{"entrenamiento:B→A": "La muñeca está debajo de la mesita de noche. ¿Qué está debajo de la mesita de noche?", "test_mutuo:A→B": "La muñeca está debajo de la mesita de noche. ¿Qué está encima de la muñeca?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A19', 'A', 'Muñeca', 'objetos/muneca'),
  ('B19', 'B', 'Mesita de noche', 'muebles/mesita-de-noche')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'), 'Clase 20', 'Grupo 7', '{"entrenamiento:B→A": "La cabra está delante del burro. ¿Qué está delante del burro?", "test_mutuo:A→B": "La cabra está delante del burro. ¿Qué está detrás de la cabra?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A20', 'A', 'Cabra', 'animales-de-granja/cabra'),
  ('B20', 'B', 'Burro', 'animales-de-granja/burro')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'), 'Clase 21', 'Grupo 7', '{"entrenamiento:B→A": "El rotulador está a la izquierda de la regla. ¿Qué está a la izquierda de la regla?", "test_mutuo:A→B": "El rotulador está a la izquierda de la regla. ¿Qué está a la derecha del rotulador?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A21', 'A', 'Rotulador', 'material-escolar/rotulador'),
  ('B21', 'B', 'Regla', 'material-escolar/regla')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'), 'Clase 22', 'Grupo 8', '{"entrenamiento:B→A": "El reloj está encima de la cómoda. ¿Qué está encima de la cómoda?", "test_mutuo:A→B": "El reloj está encima de la cómoda. ¿Qué está debajo del reloj?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A22', 'A', 'Reloj', 'objetos/reloj'),
  ('B22', 'B', 'Cómoda', 'muebles/comoda')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'), 'Clase 23', 'Grupo 8', '{"entrenamiento:B→A": "La ambulancia está detrás del helicóptero. ¿Qué está detrás del helicóptero?", "test_mutuo:A→B": "La ambulancia está detrás del helicóptero. ¿Qué está delante de la ambulancia?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A23', 'A', 'Ambulancia', 'vehiculos/ambulancia'),
  ('B23', 'B', 'Helicóptero', 'vehiculos/helicoptero')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales'), 'Clase 24', 'Grupo 8', '{"entrenamiento:B→A": "El queso está a la derecha del pan. ¿Qué está a la derecha del pan?", "test_mutuo:A→B": "El queso está a la derecha del pan. ¿Qué está a la izquierda del queso?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A24', 'A', 'Queso', 'alimentos/queso'),
  ('B24', 'B', 'Pan', 'alimentos/pan')) x(etiqueta, posicion, nombre, concepto);

update programas_base set
  opciones_clase = true,
  consignas = null,
  materiales = 'Grupos de 3 (o más) clases con 2 miembros:

A: Elemento que ocupa la primera posición de la relación enunciada
B: Elemento de referencia

La relación se presenta solo de forma verbal, con imágenes sueltas de los elementos, sin colocarlas en la escena, de forma que ninguna disposición física indique la relación. En cada ensayo se ofrecen como opciones los dos elementos nombrados y un tercero (distractor) de otra relación del grupo, para que la respuesta dependa de la clave relacional y no de haber oído el nombre.',
  instrucciones_terapeuta = replace(replace(replace(instrucciones_terapeuta,
    '"El gato está encima de la caja"', '"El gato está encima de la mesa"'),
    '"¿Qué está encima de la caja?"', '"¿Qué está encima de la mesa?"'),
    'Fase 1 - Entrenamiento directo', 'Opciones de respuesta: en cada ensayo, las imágenes sueltas de los dos elementos nombrados y de un tercero de otra relación del grupo (ej. gato, mesa y coche). Así no basta con elegir el elemento que se ha oído: hay que responder a la clave relacional.

Fase 1 - Entrenamiento directo')
where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales';

commit;
