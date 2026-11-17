-- Transferir Funciones a través de Relaciones Temporales: 8 grupos; entrenamiento en orden directo («y después» / «primero…, luego») y transformación en orden inverso («B después de A» / «Antes de B, A»), alternados.

begin;

delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales');

with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'), 'Clase 1', 'Grupo 1', '{"entrenamiento:A→B": "Toca la mesa y después salta.", "transformacion_funciones:A→B": "Salta después de tocar la mesa."}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A1', 'A', 'Tocar la mesa', null),
  ('B1', 'B', 'Saltar', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'), 'Clase 2', 'Grupo 1', '{"entrenamiento:A→B": "Primero coge el lápiz, luego siéntate.", "transformacion_funciones:A→B": "Siéntate después de coger el lápiz."}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A2', 'A', 'Coger el lápiz', null),
  ('B2', 'B', 'Sentarse', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'), 'Clase 3', 'Grupo 1', '{"entrenamiento:A→B": "Abre la caja y después aplaude.", "transformacion_funciones:A→B": "Antes de aplaudir, abre la caja."}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A3', 'A', 'Abrir la caja', null),
  ('B3', 'B', 'Aplaudir', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'), 'Clase 4', 'Grupo 2', '{"entrenamiento:A→B": "Primero levanta los brazos, luego tócate la nariz.", "transformacion_funciones:A→B": "Antes de tocarte la nariz, levanta los brazos."}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A4', 'A', 'Levantar los brazos', null),
  ('B4', 'B', 'Tocarse la nariz', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'), 'Clase 5', 'Grupo 2', '{"entrenamiento:A→B": "Dame la pelota y después da una vuelta.", "transformacion_funciones:A→B": "Da una vuelta después de darme la pelota."}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A5', 'A', 'Dar la pelota', null),
  ('B5', 'B', 'Dar una vuelta', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'), 'Clase 6', 'Grupo 2', '{"entrenamiento:A→B": "Primero cierra el libro, luego pisa fuerte.", "transformacion_funciones:A→B": "Pisa fuerte después de cerrar el libro."}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A6', 'A', 'Cerrar el libro', null),
  ('B6', 'B', 'Pisar fuerte', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'), 'Clase 7', 'Grupo 3', '{"entrenamiento:A→B": "Tócate la cabeza y después coge la cuchara.", "transformacion_funciones:A→B": "Antes de coger la cuchara, tócate la cabeza."}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A7', 'A', 'Tocarse la cabeza', null),
  ('B7', 'B', 'Coger la cuchara', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'), 'Clase 8', 'Grupo 3', '{"entrenamiento:A→B": "Primero aplaude, luego abre la puerta.", "transformacion_funciones:A→B": "Antes de abrir la puerta, aplaude."}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A8', 'A', 'Aplaudir', null),
  ('B8', 'B', 'Abrir la puerta', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'), 'Clase 9', 'Grupo 3', '{"entrenamiento:A→B": "Pon el coche en la caja y después levántate.", "transformacion_funciones:A→B": "Levántate después de poner el coche en la caja."}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A9', 'A', 'Poner el coche en la caja', null),
  ('B9', 'B', 'Levantarse', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'), 'Clase 10', 'Grupo 4', '{"entrenamiento:A→B": "Primero agáchate, luego dame el vaso.", "transformacion_funciones:A→B": "Dame el vaso después de agacharte."}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A10', 'A', 'Agacharse', null),
  ('B10', 'B', 'Dar el vaso', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'), 'Clase 11', 'Grupo 4', '{"entrenamiento:A→B": "Di «hola» y después tócate los pies.", "transformacion_funciones:A→B": "Antes de tocarte los pies, di «hola»."}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A11', 'A', 'Decir «hola»', null),
  ('B11', 'B', 'Tocarse los pies', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'), 'Clase 12', 'Grupo 4', '{"entrenamiento:A→B": "Primero coge el cuento, luego da una palmada en la mesa.", "transformacion_funciones:A→B": "Antes de dar una palmada en la mesa, coge el cuento."}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A12', 'A', 'Coger el cuento', null),
  ('B12', 'B', 'Dar una palmada en la mesa', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'), 'Clase 13', 'Grupo 5', '{"entrenamiento:A→B": "Salta y después cierra los ojos.", "transformacion_funciones:A→B": "Cierra los ojos después de saltar."}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A13', 'A', 'Saltar', null),
  ('B13', 'B', 'Cerrar los ojos', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'), 'Clase 14', 'Grupo 5', '{"entrenamiento:A→B": "Primero pon la ficha en el plato, luego aplaude.", "transformacion_funciones:A→B": "Aplaude después de poner la ficha en el plato."}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A14', 'A', 'Poner la ficha en el plato', null),
  ('B14', 'B', 'Aplaudir', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'), 'Clase 15', 'Grupo 5', '{"entrenamiento:A→B": "Da una vuelta y después toca la ventana.", "transformacion_funciones:A→B": "Antes de tocar la ventana, da una vuelta."}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A15', 'A', 'Dar una vuelta', null),
  ('B15', 'B', 'Tocar la ventana', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'), 'Clase 16', 'Grupo 6', '{"entrenamiento:A→B": "Primero levanta un pie, luego dame el lápiz.", "transformacion_funciones:A→B": "Antes de darme el lápiz, levanta un pie."}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A16', 'A', 'Levantar un pie', null),
  ('B16', 'B', 'Dar el lápiz', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'), 'Clase 17', 'Grupo 6', '{"entrenamiento:A→B": "Tócate las rodillas y después salta.", "transformacion_funciones:A→B": "Salta después de tocarte las rodillas."}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A17', 'A', 'Tocarse las rodillas', null),
  ('B17', 'B', 'Saltar', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'), 'Clase 18', 'Grupo 6', '{"entrenamiento:A→B": "Primero abre la mochila, luego tócate la barriga.", "transformacion_funciones:A→B": "Tócate la barriga después de abrir la mochila."}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A18', 'A', 'Abrir la mochila', null),
  ('B18', 'B', 'Tocarse la barriga', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'), 'Clase 19', 'Grupo 7', '{"entrenamiento:A→B": "Pisa fuerte y después coge la pelota.", "transformacion_funciones:A→B": "Antes de coger la pelota, pisa fuerte."}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A19', 'A', 'Pisar fuerte', null),
  ('B19', 'B', 'Coger la pelota', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'), 'Clase 20', 'Grupo 7', '{"entrenamiento:A→B": "Primero mueve las manos, luego siéntate.", "transformacion_funciones:A→B": "Antes de sentarte, mueve las manos."}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A20', 'A', 'Mover las manos', null),
  ('B20', 'B', 'Sentarse', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'), 'Clase 21', 'Grupo 7', '{"entrenamiento:A→B": "Pon el vaso en la mesa y después da una vuelta.", "transformacion_funciones:A→B": "Da una vuelta después de poner el vaso en la mesa."}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A21', 'A', 'Poner el vaso en la mesa', null),
  ('B21', 'B', 'Dar una vuelta', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'), 'Clase 22', 'Grupo 8', '{"entrenamiento:A→B": "Primero cierra los ojos, luego levanta los brazos.", "transformacion_funciones:A→B": "Levanta los brazos después de cerrar los ojos."}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A22', 'A', 'Cerrar los ojos', null),
  ('B22', 'B', 'Levantar los brazos', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'), 'Clase 23', 'Grupo 8', '{"entrenamiento:A→B": "Toca la puerta y después tócate los hombros.", "transformacion_funciones:A→B": "Antes de tocarte los hombros, toca la puerta."}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A23', 'A', 'Tocar la puerta', null),
  ('B23', 'B', 'Tocarse los hombros', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones Temporales'), 'Clase 24', 'Grupo 8', '{"entrenamiento:A→B": "Primero coge la goma, luego agáchate.", "transformacion_funciones:A→B": "Antes de agacharte, coge la goma."}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A24', 'A', 'Coger la goma', null),
  ('B24', 'B', 'Agacharse', null)) x(etiqueta, posicion, nombre, concepto);

commit;
