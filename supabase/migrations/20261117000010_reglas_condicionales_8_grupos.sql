-- Seguir Reglas Condicionales: 8 grupos de reglas nuevas, cada uno con un tipo de condición distinto; las respuestas cambian entre grupos.

begin;

delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales');

with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 1', 'Grupo 1', '{"test_mutuo:B→A": "¿Cuándo tienes que aplaudir?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A1', 'A', 'La tarjeta azul («Si te enseño la tarjeta azul, aplaude»)', null),
  ('B1', 'B', 'Aplaudir', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 2', 'Grupo 1', '{"test_mutuo:B→A": "¿Cuándo tienes que saltar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A2', 'A', 'La tarjeta roja («Si te enseño la tarjeta roja, salta»)', null),
  ('B2', 'B', 'Saltar', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 3', 'Grupo 1', '{"test_mutuo:B→A": "¿Cuándo tienes que tocarte la cabeza?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A3', 'A', 'La tarjeta amarilla («Si te enseño la tarjeta amarilla, tócate la cabeza»)', null),
  ('B3', 'B', 'Tocarse la cabeza', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 4', 'Grupo 2', '{"test_mutuo:B→A": "¿Cuándo tienes que sentarte?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A4', 'A', 'La campana («Si suena la campana, siéntate»)', null),
  ('B4', 'B', 'Sentarse', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 5', 'Grupo 2', '{"test_mutuo:B→A": "¿Cuándo tienes que levantar los brazos?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A5', 'A', 'El tambor («Si suena el tambor, levanta los brazos»)', null),
  ('B5', 'B', 'Levantar los brazos', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 6', 'Grupo 2', '{"test_mutuo:B→A": "¿Cuándo tienes que dar una vuelta?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A6', 'A', 'El silbato («Si suena el silbato, da una vuelta»)', null),
  ('B6', 'B', 'Dar una vuelta', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 7', 'Grupo 3', '{"test_mutuo:B→A": "¿Cuándo tienes que tocarte la nariz?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A7', 'A', 'El círculo («Si te enseño el círculo, tócate la nariz»)', null),
  ('B7', 'B', 'Tocarse la nariz', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 8', 'Grupo 3', '{"test_mutuo:B→A": "¿Cuándo tienes que pisar fuerte?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A8', 'A', 'El cuadrado («Si te enseño el cuadrado, pisa fuerte»)', null),
  ('B8', 'B', 'Pisar fuerte', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 9', 'Grupo 3', '{"test_mutuo:B→A": "¿Cuándo tienes que agacharte?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A9', 'A', 'El triángulo («Si te enseño el triángulo, agáchate»)', null),
  ('B9', 'B', 'Agacharse', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 10', 'Grupo 4', '{"test_mutuo:B→A": "¿Cuándo tienes que tocarte las rodillas?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A10', 'A', 'Levantar la mano («Si levanto la mano, tócate las rodillas»)', null),
  ('B10', 'B', 'Tocarse las rodillas', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 11', 'Grupo 4', '{"test_mutuo:B→A": "¿Cuándo tienes que aplaudir?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A11', 'A', 'Tocarse la oreja («Si me toco la oreja, aplaude»)', null),
  ('B11', 'B', 'Aplaudir', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 12', 'Grupo 4', '{"test_mutuo:B→A": "¿Cuándo tienes que decir «hola»?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A12', 'A', 'Cerrar los ojos («Si cierro los ojos, di «hola»»)', null),
  ('B12', 'B', 'Decir «hola»', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 13', 'Grupo 5', '{"test_mutuo:B→A": "¿Cuándo tienes que saltar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A13', 'A', 'El perro («Si te enseño el perro, salta»)', null),
  ('B13', 'B', 'Saltar', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 14', 'Grupo 5', '{"test_mutuo:B→A": "¿Cuándo tienes que tocarte la barriga?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A14', 'A', 'El gato («Si te enseño el gato, tócate la barriga»)', null),
  ('B14', 'B', 'Tocarse la barriga', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 15', 'Grupo 5', '{"test_mutuo:B→A": "¿Cuándo tienes que mover las manos?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A15', 'A', 'La vaca («Si te enseño la vaca, mueve las manos»)', null),
  ('B15', 'B', 'Mover las manos', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 16', 'Grupo 6', '{"test_mutuo:B→A": "¿Cuándo tienes que levantarte?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A16', 'A', 'Decir «uno» («Si digo «uno», levántate»)', null),
  ('B16', 'B', 'Levantarse', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 17', 'Grupo 6', '{"test_mutuo:B→A": "¿Cuándo tienes que tocarte los pies?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A17', 'A', 'Decir «dos» («Si digo «dos», tócate los pies»)', null),
  ('B17', 'B', 'Tocarse los pies', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 18', 'Grupo 6', '{"test_mutuo:B→A": "¿Cuándo tienes que dar una palmada en la mesa?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A18', 'A', 'Decir «tres» («Si digo «tres», da una palmada en la mesa»)', null),
  ('B18', 'B', 'Dar una palmada en la mesa', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 19', 'Grupo 7', '{"test_mutuo:B→A": "¿Cuándo tienes que cerrar los ojos?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A19', 'A', 'Decir «zup» («Si digo «zup», cierra los ojos»)', null),
  ('B19', 'B', 'Cerrar los ojos', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 20', 'Grupo 7', '{"test_mutuo:B→A": "¿Cuándo tienes que dar una vuelta?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A20', 'A', 'Decir «mif» («Si digo «mif», da una vuelta»)', null),
  ('B20', 'B', 'Dar una vuelta', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 21', 'Grupo 7', '{"test_mutuo:B→A": "¿Cuándo tienes que tocarte los hombros?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A21', 'A', 'Decir «tok» («Si digo «tok», tócate los hombros»)', null),
  ('B21', 'B', 'Tocarse los hombros', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 22', 'Grupo 8', '{"test_mutuo:B→A": "¿Cuándo tienes que pisar fuerte?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A22', 'A', 'La cuchara («Si te enseño la cuchara, pisa fuerte»)', null),
  ('B22', 'B', 'Pisar fuerte', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 23', 'Grupo 8', '{"test_mutuo:B→A": "¿Cuándo tienes que levantar un pie?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A23', 'A', 'El lápiz («Si te enseño el lápiz, levanta un pie»)', null),
  ('B23', 'B', 'Levantar un pie', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 24', 'Grupo 8', '{"test_mutuo:B→A": "¿Cuándo tienes que tocarte la cabeza?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A24', 'A', 'La pelota («Si te enseño la pelota, tócate la cabeza»)', null),
  ('B24', 'B', 'Tocarse la cabeza', null)) x(etiqueta, posicion, nombre, concepto);

commit;
