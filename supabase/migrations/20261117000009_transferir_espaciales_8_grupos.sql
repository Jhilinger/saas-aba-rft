-- Transferir Funciones a través de Relaciones Espaciales: 8 grupos de búsquedas; solo encima/debajo, delante/detrás e izquierda/derecha; distractor idéntico en la relación contraria; orden de las premisas alterno.

begin;

delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales');

with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'), 'Clase 1', 'Grupo 1', '{"entrenamiento:B→A": "La pegatina está debajo de la caja azul. ¡Búscala!", "entrenamiento:C→B": "Toca la caja que está detrás de la silla.", "transformacion_funciones:C→A": "La pegatina está debajo de la caja azul. La caja azul está detrás de la silla. ¡Búscala!"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A1', 'A', 'La pegatina (escondida debajo de la caja azul)', null),
  ('B1', 'B', 'La caja azul (detrás de la silla; distractor idéntico delante de la silla)', null),
  ('C1', 'C', 'La silla', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'), 'Clase 2', 'Grupo 1', '{"entrenamiento:B→A": "La llave está debajo del vaso rojo. ¡Búscala!", "entrenamiento:C→B": "Toca el vaso que está a la izquierda de la mesa.", "transformacion_funciones:C→A": "La llave está debajo del vaso rojo. El vaso rojo está a la izquierda de la mesa. ¡Búscala!"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A2', 'A', 'La llave (escondida debajo del vaso rojo)', null),
  ('B2', 'B', 'El vaso rojo (a la izquierda de la mesa; distractor idéntico a la derecha de la mesa)', null),
  ('C2', 'C', 'La mesa', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'), 'Clase 3', 'Grupo 1', '{"entrenamiento:B→A": "La canica está debajo del cuenco verde. ¡Búscala!", "entrenamiento:C→B": "Toca el cuenco que está encima de la mesa.", "transformacion_funciones:C→A": "La canica está debajo del cuenco verde. El cuenco verde está encima de la mesa. ¡Búscala!"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A3', 'A', 'La canica (escondida debajo del cuenco verde)', null),
  ('B3', 'B', 'El cuenco verde (encima de la mesa; distractor idéntico debajo de la mesa)', null),
  ('C3', 'C', 'La mesa', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'), 'Clase 4', 'Grupo 2', '{"entrenamiento:B→A": "El cromo está debajo de la taza blanca. ¡Búscalo!", "entrenamiento:C→B": "Toca la taza que está delante de la estantería.", "transformacion_funciones:C→A": "El cromo está debajo de la taza blanca. La taza blanca está delante de la estantería. ¡Búscalo!"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A4', 'A', 'El cromo (escondido debajo de la taza blanca)', null),
  ('B4', 'B', 'La taza blanca (delante de la estantería; distractor idéntico detrás de la estantería)', null),
  ('C4', 'C', 'La estantería', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'), 'Clase 5', 'Grupo 2', '{"entrenamiento:B→A": "El coche pequeño está debajo del gorro. ¡Búscalo!", "entrenamiento:C→B": "Toca el gorro que está a la derecha del sofá.", "transformacion_funciones:C→A": "El gorro está a la derecha del sofá. El coche pequeño está debajo del gorro. ¡Búscalo!"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A5', 'A', 'El coche pequeño (escondido debajo del gorro)', null),
  ('B5', 'B', 'El gorro (a la derecha del sofá; distractor idéntico a la izquierda del sofá)', null),
  ('C5', 'C', 'El sofá', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'), 'Clase 6', 'Grupo 2', '{"entrenamiento:B→A": "La goma está detrás del cojín. ¡Búscala!", "entrenamiento:C→B": "Toca el cojín que está debajo de la silla.", "transformacion_funciones:C→A": "El cojín está debajo de la silla. La goma está detrás del cojín. ¡Búscala!"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A6', 'A', 'La goma (escondida detrás del cojín)', null),
  ('B6', 'B', 'El cojín (debajo de la silla; distractor idéntico encima de la silla)', null),
  ('C6', 'C', 'La silla', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'), 'Clase 7', 'Grupo 3', '{"entrenamiento:B→A": "La moneda de juguete está debajo del plato naranja. ¡Búscala!", "entrenamiento:C→B": "Toca el plato que está detrás de la silla.", "transformacion_funciones:C→A": "El plato naranja está detrás de la silla. La moneda de juguete está debajo del plato naranja. ¡Búscala!"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A7', 'A', 'La moneda de juguete (escondida debajo del plato naranja)', null),
  ('B7', 'B', 'El plato naranja (detrás de la silla; distractor idéntico delante de la silla)', null),
  ('C7', 'C', 'La silla', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'), 'Clase 8', 'Grupo 3', '{"entrenamiento:B→A": "El dinosaurio pequeño está debajo de la caja azul. ¡Búscalo!", "entrenamiento:C→B": "Toca la caja que está a la izquierda de la mesa.", "transformacion_funciones:C→A": "La caja azul está a la izquierda de la mesa. El dinosaurio pequeño está debajo de la caja azul. ¡Búscalo!"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A8', 'A', 'El dinosaurio pequeño (escondido debajo de la caja azul)', null),
  ('B8', 'B', 'La caja azul (a la izquierda de la mesa; distractor idéntico a la derecha de la mesa)', null),
  ('C8', 'C', 'La mesa', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'), 'Clase 9', 'Grupo 3', '{"entrenamiento:B→A": "La ficha está debajo del vaso rojo. ¡Búscala!", "entrenamiento:C→B": "Toca el vaso que está encima del sofá.", "transformacion_funciones:C→A": "La ficha está debajo del vaso rojo. El vaso rojo está encima del sofá. ¡Búscala!"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A9', 'A', 'La ficha (escondida debajo del vaso rojo)', null),
  ('B9', 'B', 'El vaso rojo (encima del sofá; distractor idéntico debajo del sofá)', null),
  ('C9', 'C', 'El sofá', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'), 'Clase 10', 'Grupo 4', '{"entrenamiento:B→A": "El anillo de juguete está debajo del cubo amarillo. ¡Búscalo!", "entrenamiento:C→B": "Toca el cubo que está delante de la estantería.", "transformacion_funciones:C→A": "El anillo de juguete está debajo del cubo amarillo. El cubo amarillo está delante de la estantería. ¡Búscalo!"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A10', 'A', 'El anillo de juguete (escondido debajo del cubo amarillo)', null),
  ('B10', 'B', 'El cubo amarillo (delante de la estantería; distractor idéntico detrás de la estantería)', null),
  ('C10', 'C', 'La estantería', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'), 'Clase 11', 'Grupo 4', '{"entrenamiento:B→A": "La pelota pequeña está debajo de la taza blanca. ¡Búscala!", "entrenamiento:C→B": "Toca la taza que está a la derecha del sofá.", "transformacion_funciones:C→A": "La pelota pequeña está debajo de la taza blanca. La taza blanca está a la derecha del sofá. ¡Búscala!"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A11', 'A', 'La pelota pequeña (escondida debajo de la taza blanca)', null),
  ('B11', 'B', 'La taza blanca (a la derecha del sofá; distractor idéntico a la izquierda del sofá)', null),
  ('C11', 'C', 'El sofá', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'), 'Clase 12', 'Grupo 4', '{"entrenamiento:B→A": "El muñeco pequeño está debajo del gorro. ¡Búscalo!", "entrenamiento:C→B": "Toca el gorro que está debajo del banco.", "transformacion_funciones:C→A": "El muñeco pequeño está debajo del gorro. El gorro está debajo del banco. ¡Búscalo!"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A12', 'A', 'El muñeco pequeño (escondido debajo del gorro)', null),
  ('B12', 'B', 'El gorro (debajo del banco; distractor idéntico encima del banco)', null),
  ('C12', 'C', 'El banco', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'), 'Clase 13', 'Grupo 5', '{"entrenamiento:B→A": "La pegatina está debajo de la toalla. ¡Búscala!", "entrenamiento:C→B": "Toca la toalla que está detrás de la silla.", "transformacion_funciones:C→A": "La toalla está detrás de la silla. La pegatina está debajo de la toalla. ¡Búscala!"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A13', 'A', 'La pegatina (escondida debajo de la toalla)', null),
  ('B13', 'B', 'La toalla (detrás de la silla; distractor idéntico delante de la silla)', null),
  ('C13', 'C', 'La silla', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'), 'Clase 14', 'Grupo 5', '{"entrenamiento:B→A": "La llave está debajo del plato naranja. ¡Búscala!", "entrenamiento:C→B": "Toca el plato que está a la izquierda de la mesa.", "transformacion_funciones:C→A": "El plato naranja está a la izquierda de la mesa. La llave está debajo del plato naranja. ¡Búscala!"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A14', 'A', 'La llave (escondida debajo del plato naranja)', null),
  ('B14', 'B', 'El plato naranja (a la izquierda de la mesa; distractor idéntico a la derecha de la mesa)', null),
  ('C14', 'C', 'La mesa', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'), 'Clase 15', 'Grupo 5', '{"entrenamiento:B→A": "La canica está debajo de la caja azul. ¡Búscala!", "entrenamiento:C→B": "Toca la caja que está encima de la mesa.", "transformacion_funciones:C→A": "La caja azul está encima de la mesa. La canica está debajo de la caja azul. ¡Búscala!"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A15', 'A', 'La canica (escondida debajo de la caja azul)', null),
  ('B15', 'B', 'La caja azul (encima de la mesa; distractor idéntico debajo de la mesa)', null),
  ('C15', 'C', 'La mesa', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'), 'Clase 16', 'Grupo 6', '{"entrenamiento:B→A": "El cromo está debajo del cuenco verde. ¡Búscalo!", "entrenamiento:C→B": "Toca el cuenco que está delante de la estantería.", "transformacion_funciones:C→A": "El cuenco verde está delante de la estantería. El cromo está debajo del cuenco verde. ¡Búscalo!"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A16', 'A', 'El cromo (escondido debajo del cuenco verde)', null),
  ('B16', 'B', 'El cuenco verde (delante de la estantería; distractor idéntico detrás de la estantería)', null),
  ('C16', 'C', 'La estantería', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'), 'Clase 17', 'Grupo 6', '{"entrenamiento:B→A": "El coche pequeño está debajo del cubo amarillo. ¡Búscalo!", "entrenamiento:C→B": "Toca el cubo que está a la derecha del sofá.", "transformacion_funciones:C→A": "El coche pequeño está debajo del cubo amarillo. El cubo amarillo está a la derecha del sofá. ¡Búscalo!"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A17', 'A', 'El coche pequeño (escondido debajo del cubo amarillo)', null),
  ('B17', 'B', 'El cubo amarillo (a la derecha del sofá; distractor idéntico a la izquierda del sofá)', null),
  ('C17', 'C', 'El sofá', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'), 'Clase 18', 'Grupo 6', '{"entrenamiento:B→A": "La goma está debajo de la taza blanca. ¡Búscala!", "entrenamiento:C→B": "Toca la taza que está debajo de la silla.", "transformacion_funciones:C→A": "La goma está debajo de la taza blanca. La taza blanca está debajo de la silla. ¡Búscala!"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A18', 'A', 'La goma (escondida debajo de la taza blanca)', null),
  ('B18', 'B', 'La taza blanca (debajo de la silla; distractor idéntico encima de la silla)', null),
  ('C18', 'C', 'La silla', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'), 'Clase 19', 'Grupo 7', '{"entrenamiento:B→A": "La moneda de juguete está detrás del cojín. ¡Búscala!", "entrenamiento:C→B": "Toca el cojín que está detrás de la silla.", "transformacion_funciones:C→A": "La moneda de juguete está detrás del cojín. El cojín está detrás de la silla. ¡Búscala!"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A19', 'A', 'La moneda de juguete (escondida detrás del cojín)', null),
  ('B19', 'B', 'El cojín (detrás de la silla; distractor idéntico delante de la silla)', null),
  ('C19', 'C', 'La silla', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'), 'Clase 20', 'Grupo 7', '{"entrenamiento:B→A": "El dinosaurio pequeño está debajo de la toalla. ¡Búscalo!", "entrenamiento:C→B": "Toca la toalla que está a la izquierda de la mesa.", "transformacion_funciones:C→A": "El dinosaurio pequeño está debajo de la toalla. La toalla está a la izquierda de la mesa. ¡Búscalo!"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A20', 'A', 'El dinosaurio pequeño (escondido debajo de la toalla)', null),
  ('B20', 'B', 'La toalla (a la izquierda de la mesa; distractor idéntico a la derecha de la mesa)', null),
  ('C20', 'C', 'La mesa', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'), 'Clase 21', 'Grupo 7', '{"entrenamiento:B→A": "La ficha está debajo del plato naranja. ¡Búscala!", "entrenamiento:C→B": "Toca el plato que está encima del sofá.", "transformacion_funciones:C→A": "El plato naranja está encima del sofá. La ficha está debajo del plato naranja. ¡Búscala!"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A21', 'A', 'La ficha (escondida debajo del plato naranja)', null),
  ('B21', 'B', 'El plato naranja (encima del sofá; distractor idéntico debajo del sofá)', null),
  ('C21', 'C', 'El sofá', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'), 'Clase 22', 'Grupo 8', '{"entrenamiento:B→A": "El anillo de juguete está debajo del vaso rojo. ¡Búscalo!", "entrenamiento:C→B": "Toca el vaso que está delante de la estantería.", "transformacion_funciones:C→A": "El vaso rojo está delante de la estantería. El anillo de juguete está debajo del vaso rojo. ¡Búscalo!"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A22', 'A', 'El anillo de juguete (escondido debajo del vaso rojo)', null),
  ('B22', 'B', 'El vaso rojo (delante de la estantería; distractor idéntico detrás de la estantería)', null),
  ('C22', 'C', 'La estantería', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'), 'Clase 23', 'Grupo 8', '{"entrenamiento:B→A": "La pelota pequeña está debajo del cuenco verde. ¡Búscala!", "entrenamiento:C→B": "Toca el cuenco que está a la derecha del sofá.", "transformacion_funciones:C→A": "El cuenco verde está a la derecha del sofá. La pelota pequeña está debajo del cuenco verde. ¡Búscala!"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A23', 'A', 'La pelota pequeña (escondida debajo del cuenco verde)', null),
  ('B23', 'B', 'El cuenco verde (a la derecha del sofá; distractor idéntico a la izquierda del sofá)', null),
  ('C23', 'C', 'El sofá', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Espaciales'), 'Clase 24', 'Grupo 8', '{"entrenamiento:B→A": "El muñeco pequeño está debajo del cubo amarillo. ¡Búscalo!", "entrenamiento:C→B": "Toca el cubo que está debajo del banco.", "transformacion_funciones:C→A": "El cubo amarillo está debajo del banco. El muñeco pequeño está debajo del cubo amarillo. ¡Búscalo!"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A24', 'A', 'El muñeco pequeño (escondido debajo del cubo amarillo)', null),
  ('B24', 'B', 'El cubo amarillo (debajo del banco; distractor idéntico encima del banco)', null),
  ('C24', 'C', 'El banco', null)) x(etiqueta, posicion, nombre, concepto);

commit;
