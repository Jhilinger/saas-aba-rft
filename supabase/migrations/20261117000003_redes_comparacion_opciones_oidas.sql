-- Derivar Relaciones de Comparación en Redes Combinatorias: 8 grupos de 3 clases con 3 miembros; las opciones son los tres
-- miembros de la clase, en audio; test combinatorio con las dos premisas en la clave.

begin;

delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias');

with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'), 'Clase 1', 'Grupo 1', '{"entrenamiento:B→A": "Rasu es más alto que Sami. ¿Quién es más alto?", "entrenamiento:C→B": "Sami es más alto que Mepo. ¿Quién es más alto?", "test_mutuo:A→B": "Rasu es más alto que Sami. ¿Quién es más bajo?", "test_mutuo:B→C": "Sami es más alto que Mepo. ¿Quién es más bajo?", "test_combinatorio:C→A": "Rasu es más alto que Sami. Sami es más alto que Mepo. ¿Quién es más alto, Rasu o Mepo?", "test_combinatorio:A→C": "Rasu es más alto que Sami. Sami es más alto que Mepo. ¿Quién es más bajo, Rasu o Mepo?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A1', 'A', 'Rasu', null),
  ('B1', 'B', 'Sami', null),
  ('C1', 'C', 'Mepo', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'), 'Clase 2', 'Grupo 1', '{"entrenamiento:B→A": "El tren Bori es más corto que el tren Tasi. ¿Qué tren es más corto?", "entrenamiento:C→B": "El tren Tasi es más corto que el tren Gufi. ¿Qué tren es más corto?", "test_mutuo:A→B": "El tren Bori es más corto que el tren Tasi. ¿Qué tren es más largo?", "test_mutuo:B→C": "El tren Tasi es más corto que el tren Gufi. ¿Qué tren es más largo?", "test_combinatorio:C→A": "El tren Bori es más corto que el tren Tasi. El tren Tasi es más corto que el tren Gufi. ¿Qué tren es más corto, Bori o Gufi?", "test_combinatorio:A→C": "El tren Bori es más corto que el tren Tasi. El tren Tasi es más corto que el tren Gufi. ¿Qué tren es más largo, Bori o Gufi?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A2', 'A', 'Bori', null),
  ('B2', 'B', 'Tasi', null),
  ('C2', 'C', 'Gufi', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'), 'Clase 3', 'Grupo 1', '{"entrenamiento:B→A": "Comparado con la caja Pupi, la caja Dun es más pesada. ¿Qué caja es más pesada?", "entrenamiento:C→B": "Comparado con la caja Kiri, la caja Pupi es más pesada. ¿Qué caja es más pesada?", "test_mutuo:A→B": "Comparado con la caja Pupi, la caja Dun es más pesada. ¿Qué caja es más ligera?", "test_mutuo:B→C": "Comparado con la caja Kiri, la caja Pupi es más pesada. ¿Qué caja es más ligera?", "test_combinatorio:C→A": "Comparado con la caja Pupi, la caja Dun es más pesada. Comparado con la caja Kiri, la caja Pupi es más pesada. ¿Qué caja es más pesada, Kiri o Dun?", "test_combinatorio:A→C": "Comparado con la caja Pupi, la caja Dun es más pesada. Comparado con la caja Kiri, la caja Pupi es más pesada. ¿Qué caja es más ligera, Kiri o Dun?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A3', 'A', 'Dun', null),
  ('B3', 'B', 'Pupi', null),
  ('C3', 'C', 'Kiri', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'), 'Clase 4', 'Grupo 2', '{"entrenamiento:B→A": "Comparado con el coche Pupi, el coche Bori es más lento. ¿Qué coche es más lento?", "entrenamiento:C→B": "Comparado con el coche Pal, el coche Pupi es más lento. ¿Qué coche es más lento?", "test_mutuo:A→B": "Comparado con el coche Pupi, el coche Bori es más lento. ¿Qué coche es más rápido?", "test_mutuo:B→C": "Comparado con el coche Pal, el coche Pupi es más lento. ¿Qué coche es más rápido?", "test_combinatorio:C→A": "Comparado con el coche Pupi, el coche Bori es más lento. Comparado con el coche Pal, el coche Pupi es más lento. ¿Qué coche es más lento, Pal o Bori?", "test_combinatorio:A→C": "Comparado con el coche Pupi, el coche Bori es más lento. Comparado con el coche Pal, el coche Pupi es más lento. ¿Qué coche es más rápido, Pal o Bori?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A4', 'A', 'Bori', null),
  ('B4', 'B', 'Pupi', null),
  ('C4', 'C', 'Pal', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'), 'Clase 5', 'Grupo 2', '{"entrenamiento:B→A": "La pelota Lu es más grande que la pelota Zup. ¿Qué pelota es más grande?", "entrenamiento:C→B": "La pelota Zup es más grande que la pelota Rof. ¿Qué pelota es más grande?", "test_mutuo:A→B": "La pelota Lu es más grande que la pelota Zup. ¿Qué pelota es más pequeña?", "test_mutuo:B→C": "La pelota Zup es más grande que la pelota Rof. ¿Qué pelota es más pequeña?", "test_combinatorio:C→A": "La pelota Zup es más grande que la pelota Rof. La pelota Lu es más grande que la pelota Zup. ¿Qué pelota es más grande, Lu o Rof?", "test_combinatorio:A→C": "La pelota Zup es más grande que la pelota Rof. La pelota Lu es más grande que la pelota Zup. ¿Qué pelota es más pequeña, Lu o Rof?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A5', 'A', 'Lu', null),
  ('B5', 'B', 'Zup', null),
  ('C5', 'C', 'Rof', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'), 'Clase 6', 'Grupo 2', '{"entrenamiento:B→A": "La torre Lipa es más baja que la torre Bimo. ¿Qué torre es más baja?", "entrenamiento:C→B": "La torre Bimo es más baja que la torre Nok. ¿Qué torre es más baja?", "test_mutuo:A→B": "La torre Lipa es más baja que la torre Bimo. ¿Qué torre es más alta?", "test_mutuo:B→C": "La torre Bimo es más baja que la torre Nok. ¿Qué torre es más alta?", "test_combinatorio:C→A": "La torre Bimo es más baja que la torre Nok. La torre Lipa es más baja que la torre Bimo. ¿Qué torre es más baja, Lipa o Nok?", "test_combinatorio:A→C": "La torre Bimo es más baja que la torre Nok. La torre Lipa es más baja que la torre Bimo. ¿Qué torre es más alta, Lipa o Nok?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A6', 'A', 'Lipa', null),
  ('B6', 'B', 'Bimo', null),
  ('C6', 'C', 'Nok', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'), 'Clase 7', 'Grupo 3', '{"entrenamiento:B→A": "Comparado con Zaba, Zup es más alto. ¿Quién es más alto?", "entrenamiento:C→B": "Comparado con Bori, Zaba es más alto. ¿Quién es más alto?", "test_mutuo:A→B": "Comparado con Zaba, Zup es más alto. ¿Quién es más bajo?", "test_mutuo:B→C": "Comparado con Bori, Zaba es más alto. ¿Quién es más bajo?", "test_combinatorio:C→A": "Comparado con Bori, Zaba es más alto. Comparado con Zaba, Zup es más alto. ¿Quién es más alto, Bori o Zup?", "test_combinatorio:A→C": "Comparado con Bori, Zaba es más alto. Comparado con Zaba, Zup es más alto. ¿Quién es más bajo, Bori o Zup?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A7', 'A', 'Zup', null),
  ('B7', 'B', 'Zaba', null),
  ('C7', 'C', 'Bori', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'), 'Clase 8', 'Grupo 3', '{"entrenamiento:B→A": "Comparado con el tren Fi, el tren Nok es más corto. ¿Qué tren es más corto?", "entrenamiento:C→B": "Comparado con el tren Rasu, el tren Fi es más corto. ¿Qué tren es más corto?", "test_mutuo:A→B": "Comparado con el tren Fi, el tren Nok es más corto. ¿Qué tren es más largo?", "test_mutuo:B→C": "Comparado con el tren Rasu, el tren Fi es más corto. ¿Qué tren es más largo?", "test_combinatorio:C→A": "Comparado con el tren Rasu, el tren Fi es más corto. Comparado con el tren Fi, el tren Nok es más corto. ¿Qué tren es más corto, Rasu o Nok?", "test_combinatorio:A→C": "Comparado con el tren Rasu, el tren Fi es más corto. Comparado con el tren Fi, el tren Nok es más corto. ¿Qué tren es más largo, Rasu o Nok?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A8', 'A', 'Nok', null),
  ('B8', 'B', 'Fi', null),
  ('C8', 'C', 'Rasu', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'), 'Clase 9', 'Grupo 3', '{"entrenamiento:B→A": "La caja Lipa es más pesada que la caja Gor. ¿Qué caja es más pesada?", "entrenamiento:C→B": "La caja Gor es más pesada que la caja Tok. ¿Qué caja es más pesada?", "test_mutuo:A→B": "La caja Lipa es más pesada que la caja Gor. ¿Qué caja es más ligera?", "test_mutuo:B→C": "La caja Gor es más pesada que la caja Tok. ¿Qué caja es más ligera?", "test_combinatorio:C→A": "La caja Lipa es más pesada que la caja Gor. La caja Gor es más pesada que la caja Tok. ¿Qué caja es más pesada, Tok o Lipa?", "test_combinatorio:A→C": "La caja Lipa es más pesada que la caja Gor. La caja Gor es más pesada que la caja Tok. ¿Qué caja es más ligera, Tok o Lipa?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A9', 'A', 'Lipa', null),
  ('B9', 'B', 'Gor', null),
  ('C9', 'C', 'Tok', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'), 'Clase 10', 'Grupo 4', '{"entrenamiento:B→A": "El coche Bavi es más lento que el coche Rof. ¿Qué coche es más lento?", "entrenamiento:C→B": "El coche Rof es más lento que el coche Tuli. ¿Qué coche es más lento?", "test_mutuo:A→B": "El coche Bavi es más lento que el coche Rof. ¿Qué coche es más rápido?", "test_mutuo:B→C": "El coche Rof es más lento que el coche Tuli. ¿Qué coche es más rápido?", "test_combinatorio:C→A": "El coche Bavi es más lento que el coche Rof. El coche Rof es más lento que el coche Tuli. ¿Qué coche es más lento, Tuli o Bavi?", "test_combinatorio:A→C": "El coche Bavi es más lento que el coche Rof. El coche Rof es más lento que el coche Tuli. ¿Qué coche es más rápido, Tuli o Bavi?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A10', 'A', 'Bavi', null),
  ('B10', 'B', 'Rof', null),
  ('C10', 'C', 'Tuli', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'), 'Clase 11', 'Grupo 4', '{"entrenamiento:B→A": "Comparado con la pelota Kuli, la pelota Tin es más grande. ¿Qué pelota es más grande?", "entrenamiento:C→B": "Comparado con la pelota Sami, la pelota Kuli es más grande. ¿Qué pelota es más grande?", "test_mutuo:A→B": "Comparado con la pelota Kuli, la pelota Tin es más grande. ¿Qué pelota es más pequeña?", "test_mutuo:B→C": "Comparado con la pelota Sami, la pelota Kuli es más grande. ¿Qué pelota es más pequeña?", "test_combinatorio:C→A": "Comparado con la pelota Kuli, la pelota Tin es más grande. Comparado con la pelota Sami, la pelota Kuli es más grande. ¿Qué pelota es más grande, Tin o Sami?", "test_combinatorio:A→C": "Comparado con la pelota Kuli, la pelota Tin es más grande. Comparado con la pelota Sami, la pelota Kuli es más grande. ¿Qué pelota es más pequeña, Tin o Sami?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A11', 'A', 'Tin', null),
  ('B11', 'B', 'Kuli', null),
  ('C11', 'C', 'Sami', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'), 'Clase 12', 'Grupo 4', '{"entrenamiento:B→A": "Comparado con la torre Lu, la torre Sefa es más baja. ¿Qué torre es más baja?", "entrenamiento:C→B": "Comparado con la torre Bori, la torre Lu es más baja. ¿Qué torre es más baja?", "test_mutuo:A→B": "Comparado con la torre Lu, la torre Sefa es más baja. ¿Qué torre es más alta?", "test_mutuo:B→C": "Comparado con la torre Bori, la torre Lu es más baja. ¿Qué torre es más alta?", "test_combinatorio:C→A": "Comparado con la torre Lu, la torre Sefa es más baja. Comparado con la torre Bori, la torre Lu es más baja. ¿Qué torre es más baja, Sefa o Bori?", "test_combinatorio:A→C": "Comparado con la torre Lu, la torre Sefa es más baja. Comparado con la torre Bori, la torre Lu es más baja. ¿Qué torre es más alta, Sefa o Bori?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A12', 'A', 'Sefa', null),
  ('B12', 'B', 'Lu', null),
  ('C12', 'C', 'Bori', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'), 'Clase 13', 'Grupo 5', '{"entrenamiento:B→A": "Lipa es más alto que Nok. ¿Quién es más alto?", "entrenamiento:C→B": "Nok es más alto que Bimo. ¿Quién es más alto?", "test_mutuo:A→B": "Lipa es más alto que Nok. ¿Quién es más bajo?", "test_mutuo:B→C": "Nok es más alto que Bimo. ¿Quién es más bajo?", "test_combinatorio:C→A": "Nok es más alto que Bimo. Lipa es más alto que Nok. ¿Quién es más alto, Bimo o Lipa?", "test_combinatorio:A→C": "Nok es más alto que Bimo. Lipa es más alto que Nok. ¿Quién es más bajo, Bimo o Lipa?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A13', 'A', 'Lipa', null),
  ('B13', 'B', 'Nok', null),
  ('C13', 'C', 'Bimo', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'), 'Clase 14', 'Grupo 5', '{"entrenamiento:B→A": "El tren Tuli es más corto que el tren Nub. ¿Qué tren es más corto?", "entrenamiento:C→B": "El tren Nub es más corto que el tren Mo. ¿Qué tren es más corto?", "test_mutuo:A→B": "El tren Tuli es más corto que el tren Nub. ¿Qué tren es más largo?", "test_mutuo:B→C": "El tren Nub es más corto que el tren Mo. ¿Qué tren es más largo?", "test_combinatorio:C→A": "El tren Nub es más corto que el tren Mo. El tren Tuli es más corto que el tren Nub. ¿Qué tren es más corto, Mo o Tuli?", "test_combinatorio:A→C": "El tren Nub es más corto que el tren Mo. El tren Tuli es más corto que el tren Nub. ¿Qué tren es más largo, Mo o Tuli?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A14', 'A', 'Tuli', null),
  ('B14', 'B', 'Nub', null),
  ('C14', 'C', 'Mo', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'), 'Clase 15', 'Grupo 5', '{"entrenamiento:B→A": "Comparado con la caja Sami, la caja Sefa es más pesada. ¿Qué caja es más pesada?", "entrenamiento:C→B": "Comparado con la caja Lu, la caja Sami es más pesada. ¿Qué caja es más pesada?", "test_mutuo:A→B": "Comparado con la caja Sami, la caja Sefa es más pesada. ¿Qué caja es más ligera?", "test_mutuo:B→C": "Comparado con la caja Lu, la caja Sami es más pesada. ¿Qué caja es más ligera?", "test_combinatorio:C→A": "Comparado con la caja Lu, la caja Sami es más pesada. Comparado con la caja Sami, la caja Sefa es más pesada. ¿Qué caja es más pesada, Sefa o Lu?", "test_combinatorio:A→C": "Comparado con la caja Lu, la caja Sami es más pesada. Comparado con la caja Sami, la caja Sefa es más pesada. ¿Qué caja es más ligera, Sefa o Lu?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A15', 'A', 'Sefa', null),
  ('B15', 'B', 'Sami', null),
  ('C15', 'C', 'Lu', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'), 'Clase 16', 'Grupo 6', '{"entrenamiento:B→A": "Comparado con el coche Dax, el coche Sami es más lento. ¿Qué coche es más lento?", "entrenamiento:C→B": "Comparado con el coche Tin, el coche Dax es más lento. ¿Qué coche es más lento?", "test_mutuo:A→B": "Comparado con el coche Dax, el coche Sami es más lento. ¿Qué coche es más rápido?", "test_mutuo:B→C": "Comparado con el coche Tin, el coche Dax es más lento. ¿Qué coche es más rápido?", "test_combinatorio:C→A": "Comparado con el coche Tin, el coche Dax es más lento. Comparado con el coche Dax, el coche Sami es más lento. ¿Qué coche es más lento, Sami o Tin?", "test_combinatorio:A→C": "Comparado con el coche Tin, el coche Dax es más lento. Comparado con el coche Dax, el coche Sami es más lento. ¿Qué coche es más rápido, Sami o Tin?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A16', 'A', 'Sami', null),
  ('B16', 'B', 'Dax', null),
  ('C16', 'C', 'Tin', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'), 'Clase 17', 'Grupo 6', '{"entrenamiento:B→A": "La pelota Lesu es más grande que la pelota Lipa. ¿Qué pelota es más grande?", "entrenamiento:C→B": "La pelota Lipa es más grande que la pelota Gufi. ¿Qué pelota es más grande?", "test_mutuo:A→B": "La pelota Lesu es más grande que la pelota Lipa. ¿Qué pelota es más pequeña?", "test_mutuo:B→C": "La pelota Lipa es más grande que la pelota Gufi. ¿Qué pelota es más pequeña?", "test_combinatorio:C→A": "La pelota Lesu es más grande que la pelota Lipa. La pelota Lipa es más grande que la pelota Gufi. ¿Qué pelota es más grande, Lesu o Gufi?", "test_combinatorio:A→C": "La pelota Lesu es más grande que la pelota Lipa. La pelota Lipa es más grande que la pelota Gufi. ¿Qué pelota es más pequeña, Lesu o Gufi?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A17', 'A', 'Lesu', null),
  ('B17', 'B', 'Lipa', null),
  ('C17', 'C', 'Gufi', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'), 'Clase 18', 'Grupo 6', '{"entrenamiento:B→A": "La torre Saro es más baja que la torre Zup. ¿Qué torre es más baja?", "entrenamiento:C→B": "La torre Zup es más baja que la torre Pupi. ¿Qué torre es más baja?", "test_mutuo:A→B": "La torre Saro es más baja que la torre Zup. ¿Qué torre es más alta?", "test_mutuo:B→C": "La torre Zup es más baja que la torre Pupi. ¿Qué torre es más alta?", "test_combinatorio:C→A": "La torre Saro es más baja que la torre Zup. La torre Zup es más baja que la torre Pupi. ¿Qué torre es más baja, Saro o Pupi?", "test_combinatorio:A→C": "La torre Saro es más baja que la torre Zup. La torre Zup es más baja que la torre Pupi. ¿Qué torre es más alta, Saro o Pupi?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A18', 'A', 'Saro', null),
  ('B18', 'B', 'Zup', null),
  ('C18', 'C', 'Pupi', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'), 'Clase 19', 'Grupo 7', '{"entrenamiento:B→A": "Comparado con Dun, Tiko es más alto. ¿Quién es más alto?", "entrenamiento:C→B": "Comparado con Lu, Dun es más alto. ¿Quién es más alto?", "test_mutuo:A→B": "Comparado con Dun, Tiko es más alto. ¿Quién es más bajo?", "test_mutuo:B→C": "Comparado con Lu, Dun es más alto. ¿Quién es más bajo?", "test_combinatorio:C→A": "Comparado con Dun, Tiko es más alto. Comparado con Lu, Dun es más alto. ¿Quién es más alto, Lu o Tiko?", "test_combinatorio:A→C": "Comparado con Dun, Tiko es más alto. Comparado con Lu, Dun es más alto. ¿Quién es más bajo, Lu o Tiko?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A19', 'A', 'Tiko', null),
  ('B19', 'B', 'Dun', null),
  ('C19', 'C', 'Lu', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'), 'Clase 20', 'Grupo 7', '{"entrenamiento:B→A": "Comparado con el tren Kuli, el tren Dax es más corto. ¿Qué tren es más corto?", "entrenamiento:C→B": "Comparado con el tren Bimo, el tren Kuli es más corto. ¿Qué tren es más corto?", "test_mutuo:A→B": "Comparado con el tren Kuli, el tren Dax es más corto. ¿Qué tren es más largo?", "test_mutuo:B→C": "Comparado con el tren Bimo, el tren Kuli es más corto. ¿Qué tren es más largo?", "test_combinatorio:C→A": "Comparado con el tren Kuli, el tren Dax es más corto. Comparado con el tren Bimo, el tren Kuli es más corto. ¿Qué tren es más corto, Bimo o Dax?", "test_combinatorio:A→C": "Comparado con el tren Kuli, el tren Dax es más corto. Comparado con el tren Bimo, el tren Kuli es más corto. ¿Qué tren es más largo, Bimo o Dax?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A20', 'A', 'Dax', null),
  ('B20', 'B', 'Kuli', null),
  ('C20', 'C', 'Bimo', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'), 'Clase 21', 'Grupo 7', '{"entrenamiento:B→A": "La caja Pim es más pesada que la caja Coli. ¿Qué caja es más pesada?", "entrenamiento:C→B": "La caja Coli es más pesada que la caja Rof. ¿Qué caja es más pesada?", "test_mutuo:A→B": "La caja Pim es más pesada que la caja Coli. ¿Qué caja es más ligera?", "test_mutuo:B→C": "La caja Coli es más pesada que la caja Rof. ¿Qué caja es más ligera?", "test_combinatorio:C→A": "La caja Coli es más pesada que la caja Rof. La caja Pim es más pesada que la caja Coli. ¿Qué caja es más pesada, Pim o Rof?", "test_combinatorio:A→C": "La caja Coli es más pesada que la caja Rof. La caja Pim es más pesada que la caja Coli. ¿Qué caja es más ligera, Pim o Rof?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A21', 'A', 'Pim', null),
  ('B21', 'B', 'Coli', null),
  ('C21', 'C', 'Rof', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'), 'Clase 22', 'Grupo 8', '{"entrenamiento:B→A": "El coche Lipa es más lento que el coche Gor. ¿Qué coche es más lento?", "entrenamiento:C→B": "El coche Gor es más lento que el coche Lu. ¿Qué coche es más lento?", "test_mutuo:A→B": "El coche Lipa es más lento que el coche Gor. ¿Qué coche es más rápido?", "test_mutuo:B→C": "El coche Gor es más lento que el coche Lu. ¿Qué coche es más rápido?", "test_combinatorio:C→A": "El coche Gor es más lento que el coche Lu. El coche Lipa es más lento que el coche Gor. ¿Qué coche es más lento, Lipa o Lu?", "test_combinatorio:A→C": "El coche Gor es más lento que el coche Lu. El coche Lipa es más lento que el coche Gor. ¿Qué coche es más rápido, Lipa o Lu?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A22', 'A', 'Lipa', null),
  ('B22', 'B', 'Gor', null),
  ('C22', 'C', 'Lu', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'), 'Clase 23', 'Grupo 8', '{"entrenamiento:B→A": "Comparado con la pelota Tasi, la pelota Tiko es más grande. ¿Qué pelota es más grande?", "entrenamiento:C→B": "Comparado con la pelota Bavi, la pelota Tasi es más grande. ¿Qué pelota es más grande?", "test_mutuo:A→B": "Comparado con la pelota Tasi, la pelota Tiko es más grande. ¿Qué pelota es más pequeña?", "test_mutuo:B→C": "Comparado con la pelota Bavi, la pelota Tasi es más grande. ¿Qué pelota es más pequeña?", "test_combinatorio:C→A": "Comparado con la pelota Bavi, la pelota Tasi es más grande. Comparado con la pelota Tasi, la pelota Tiko es más grande. ¿Qué pelota es más grande, Bavi o Tiko?", "test_combinatorio:A→C": "Comparado con la pelota Bavi, la pelota Tasi es más grande. Comparado con la pelota Tasi, la pelota Tiko es más grande. ¿Qué pelota es más pequeña, Bavi o Tiko?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A23', 'A', 'Tiko', null),
  ('B23', 'B', 'Tasi', null),
  ('C23', 'C', 'Bavi', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias'), 'Clase 24', 'Grupo 8', '{"entrenamiento:B→A": "Comparado con la torre Rul, la torre Tuli es más baja. ¿Qué torre es más baja?", "entrenamiento:C→B": "Comparado con la torre Fen, la torre Rul es más baja. ¿Qué torre es más baja?", "test_mutuo:A→B": "Comparado con la torre Rul, la torre Tuli es más baja. ¿Qué torre es más alta?", "test_mutuo:B→C": "Comparado con la torre Fen, la torre Rul es más baja. ¿Qué torre es más alta?", "test_combinatorio:C→A": "Comparado con la torre Fen, la torre Rul es más baja. Comparado con la torre Rul, la torre Tuli es más baja. ¿Qué torre es más baja, Fen o Tuli?", "test_combinatorio:A→C": "Comparado con la torre Fen, la torre Rul es más baja. Comparado con la torre Rul, la torre Tuli es más baja. ¿Qué torre es más alta, Fen o Tuli?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A24', 'A', 'Tuli', null),
  ('B24', 'B', 'Rul', null),
  ('C24', 'C', 'Fen', null)) x(etiqueta, posicion, nombre, concepto);

update programas_base set
  opciones_clase = true,
  consignas = null,
  objetivo = 'A partir de dos relaciones comparativas encadenadas enunciadas verbalmente ("Pim es más alto que Tok"; "Tok es más alto que Lu"), el alumno deriva la relación entre los extremos ("¿Quién es más alto, Pim o Lu?" → Pim; "¿Quién es más bajo?" → Lu), partiendo de cualquiera de los dos polos de la dimensión.',
  materiales = 'Grupos de 3 (o más) clases con 3 miembros:

A: El extremo con más de lo que dice la frase (ej. el más alto si se dice «más alto»)
B: El miembro intermedio
C: El otro extremo

Nombres inventados (Pim, el tren Bori, la caja Dun…), sin imágenes, de forma que ninguna propiedad física ni conocida indique la relación; las dimensiones rotan entre clases (altura, longitud, peso, velocidad, tamaño, altura de torres). Las opciones son los tres nombres de la red, dichos uno a uno (en la tableta, tarjetas de audio). Contrapesos: la mitad de las clases enuncian un polo («más alto») y la otra mitad el contrario («más bajo»); en la mitad la frase va en orden invertido («Comparado con Tok, Pim es más alto»); en el test combinatorio, la mitad de las clases dicen las premisas en orden inverso (B–C antes que A–B) y se alterna el orden de los extremos en la pregunta («Pim o Lu» / «Lu o Pim»).',
  instrucciones_terapeuta = '
Requisito previo: el alumno ha superado "Ordenar por Magnitud" y "Vincular Mutuamente Relaciones de Comparación" (dominio 3.3).

Opciones de respuesta: en cada ensayo, diga uno a uno los tres miembros de la red («Pim», «Tok», «Lu»); el alumno elige uno. Al estar siempre los tres, el miembro que no corresponde actúa como distractor y no hace falta añadir ninguno de otra clase.

Fase 1 - Entrenamiento (A–B y B–C por separado):

1. Enuncie una sola relación y pregunte en el sentido enunciado ("Pim es más alto que Tok. ¿Quién es más alto?"; "Tok es más alto que Lu. ¿Quién es más alto?").
2. No presente nunca A y C en la misma frase durante el entrenamiento.
3. Refuerce las respuestas correctas hasta alcanzar el criterio de dominio en ambas relaciones y realice después un bloque de mantenimiento con ambas mezcladas.

Fase 2 - Test de Vinculación Mutua (sentido inverso de cada par), sin entrenamiento directo:

1. Enuncie la relación y pregunte por el polo contrario ("Pim es más alto que Tok. ¿Quién es más bajo?").
2. No refuerce diferencialmente durante estos ensayos (evite dar pistas de si es correcto o incorrecto), pero registre la respuesta.

Fase 3 - Test de Vinculación Combinatoria (A ↔ C), sin entrenamiento directo:

1. Diga las dos premisas seguidas y pregunte por los extremos, que nunca se presentaron juntos: "Pim es más alto que Tok. Tok es más alto que Lu. ¿Quién es más alto, Pim o Lu?" y "… ¿Quién es más bajo, Pim o Lu?".
2. Si quiere, pregunte también "¿Quién es el más alto de los tres?" y regístrelo con "+ Ensayo de control" (no cuenta para el porcentaje ni el dominio).
3. No refuerce diferencialmente durante estos ensayos (evite dar pistas de si es correcto o incorrecto), pero registre la respuesta.
4. Si el alumno responde correctamente, se considera evidencia de vinculación combinatoria de comparación. Elegir B (el intermedio) indica que no integra las dos premisas.

Realice el primer bloque de cada test sin ayudas. Si el alumno alcanza el criterio, la relación se considera DERIVADA; si se enseña con ayudas, quedará registrada como DOMINADA (no derivada), aunque el último bloque se realice sin ayudas.

Registro en la app (fase · posición origen → destino; el destino es la respuesta correcta):
- Entrenamiento: B → A ("Pim es más alto que Tok. ¿Quién es más alto?") y C → B ("Tok es más alto que Lu. ¿Quién es más alto?")
- Test de vínculo mutuo: A → B y B → C (preguntas por el polo contrario)
- Test de vínculo combinatorio: C → A ("¿Quién es más alto, Pim o Lu?") y A → C ("¿Quién es más bajo, Pim o Lu?")
Las sondas de generalización se registran con las mismas posiciones, eligiendo "Sonda de generalización" como tipo de bloque una vez dominada la combinación.

Grupos de estímulos: los grupos y clases de este programa son un ejemplo. Cree en el PEI del alumno tantos grupos como considere oportuno, incluido un grupo de generalización con estímulos nuevos. En ese grupo, el primer bloque de entrenamiento realizado sin ayudas y sin reforzar diferencialmente funciona como sonda: si el alumno alcanza el criterio a la primera, hay generalización a estímulos nuevos (anótelo en las notas del bloque). Los tests de ese grupo se habilitan cuando su entrenamiento está dominado. Las sondas con los mismos estímulos en otro contexto o con otra persona se registran como "Sonda de generalización" en el grupo ya dominado.'
where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias';

commit;
