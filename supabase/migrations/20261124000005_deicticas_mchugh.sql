-- Relaciones deícticas (4.1) con el protocolo de Barnes-Holmes/McHugh (Heagle y Rehfeldt 2006) traducido, transformación de
-- funciones (PEAK-T), contrabalanceo yo/tú y de estímulos, ahora/antes alternado con hoy/ayer. Revisado por el usuario el 2026-11-24.
begin;
delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 1', 'Grupo 1', 1, $j${"entrenamiento:A→B": "Yo tengo el bloque rojo y tú el bloque verde. ¿Cuál tengo yo?"}$j$::jsonb, $j${"A→B": "Bloque rojo"}$j$::jsonb, $j${"entrenamiento:A→B": ["Bloque rojo", "Bloque verde"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A1', 'A', $j$Yo tengo el bloque rojo y tú el bloque verde.$j$, null from nueva union all select id, 'B1', 'B', $j$Bloque rojo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 2', 'Grupo 1', 2, $j${"entrenamiento:A→B": "Yo tengo el bloque rojo y tú el bloque verde. ¿Cuál tienes tú?"}$j$::jsonb, $j${"A→B": "Bloque verde"}$j$::jsonb, $j${"entrenamiento:A→B": ["Bloque rojo", "Bloque verde"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A2', 'A', $j$Yo tengo el bloque rojo y tú el bloque verde.$j$, null from nueva union all select id, 'B2', 'B', $j$Bloque verde$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 3', 'Grupo 1', 3, $j${"entrenamiento:A→B": "Yo estoy aquí, en la silla azul, y tú allí, en la silla negra. ¿Dónde estoy yo?"}$j$::jsonb, $j${"A→B": "Silla azul"}$j$::jsonb, $j${"entrenamiento:A→B": ["Silla azul", "Silla negra"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A3', 'A', $j$Yo estoy aquí, en la silla azul, y tú allí, en la silla negra.$j$, null from nueva union all select id, 'B3', 'B', $j$Silla azul$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 4', 'Grupo 1', 4, $j${"entrenamiento:A→B": "Yo estoy aquí, en la silla azul, y tú allí, en la silla negra. ¿Dónde estás tú?"}$j$::jsonb, $j${"A→B": "Silla negra"}$j$::jsonb, $j${"entrenamiento:A→B": ["Silla azul", "Silla negra"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A4', 'A', $j$Yo estoy aquí, en la silla azul, y tú allí, en la silla negra.$j$, null from nueva union all select id, 'B4', 'B', $j$Silla negra$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 5', 'Grupo 1', 5, $j${"entrenamiento:A→B": "Antes yo veía la tele; ahora leo un cuento. ¿Qué hago ahora?"}$j$::jsonb, $j${"A→B": "Leer un cuento"}$j$::jsonb, $j${"entrenamiento:A→B": ["Leer un cuento", "Ver la tele"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A5', 'A', $j$Antes yo veía la tele; ahora leo un cuento.$j$, null from nueva union all select id, 'B5', 'B', $j$Leer un cuento$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 6', 'Grupo 1', 6, $j${"entrenamiento:A→B": "Antes tú veías la tele; ahora lees un cuento. ¿Qué hacías antes?"}$j$::jsonb, $j${"A→B": "Ver la tele"}$j$::jsonb, $j${"entrenamiento:A→B": ["Leer un cuento", "Ver la tele"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A6', 'A', $j$Antes tú veías la tele; ahora lees un cuento.$j$, null from nueva union all select id, 'B6', 'B', $j$Ver la tele$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 7', 'Grupo 1', 7, $j${"transformacion_funciones:A→C": "Yo estoy aquí al sol y tú allí a la sombra. ¿Quién tiene calor?"}$j$::jsonb, $j${"transformacion_funciones:A→C": "Yo"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Tú", "Yo"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A7', 'A', $j$Yo estoy aquí al sol y tú allí a la sombra.$j$, null from nueva union all select id, 'C7', 'C', $j$Yo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 8', 'Grupo 2', 8, $j${"entrenamiento:A→B": "Yo tengo el lápiz naranja y tú el lápiz amarillo. ¿Cuál tengo yo?"}$j$::jsonb, $j${"A→B": "Lápiz naranja"}$j$::jsonb, $j${"entrenamiento:A→B": ["Lápiz amarillo", "Lápiz naranja"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A8', 'A', $j$Yo tengo el lápiz naranja y tú el lápiz amarillo.$j$, null from nueva union all select id, 'B8', 'B', $j$Lápiz naranja$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 9', 'Grupo 2', 9, $j${"entrenamiento:A→B": "Yo tengo el lápiz naranja y tú el lápiz amarillo. ¿Cuál tienes tú?"}$j$::jsonb, $j${"A→B": "Lápiz amarillo"}$j$::jsonb, $j${"entrenamiento:A→B": ["Lápiz amarillo", "Lápiz naranja"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A9', 'A', $j$Yo tengo el lápiz naranja y tú el lápiz amarillo.$j$, null from nueva union all select id, 'B9', 'B', $j$Lápiz amarillo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 10', 'Grupo 2', 10, $j${"entrenamiento:A→B": "Yo estoy aquí, en el sofá morado, y tú allí, en el sofá rosa. ¿Dónde estoy yo?"}$j$::jsonb, $j${"A→B": "Sofá morado"}$j$::jsonb, $j${"entrenamiento:A→B": ["Sofá morado", "Sofá rosa"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A10', 'A', $j$Yo estoy aquí, en el sofá morado, y tú allí, en el sofá rosa.$j$, null from nueva union all select id, 'B10', 'B', $j$Sofá morado$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 11', 'Grupo 2', 11, $j${"entrenamiento:A→B": "Yo estoy aquí, en el sofá morado, y tú allí, en el sofá rosa. ¿Dónde estás tú?"}$j$::jsonb, $j${"A→B": "Sofá rosa"}$j$::jsonb, $j${"entrenamiento:A→B": ["Sofá morado", "Sofá rosa"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A11', 'A', $j$Yo estoy aquí, en el sofá morado, y tú allí, en el sofá rosa.$j$, null from nueva union all select id, 'B11', 'B', $j$Sofá rosa$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 12', 'Grupo 2', 12, $j${"entrenamiento:A→B": "Ayer yo cantaba; hoy pinto. ¿Qué hago hoy?"}$j$::jsonb, $j${"A→B": "Pintar"}$j$::jsonb, $j${"entrenamiento:A→B": ["Cantar", "Pintar"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A12', 'A', $j$Ayer yo cantaba; hoy pinto.$j$, null from nueva union all select id, 'B12', 'B', $j$Pintar$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 13', 'Grupo 2', 13, $j${"entrenamiento:A→B": "Ayer tú cantabas; hoy pintas. ¿Qué hacías ayer?"}$j$::jsonb, $j${"A→B": "Cantar"}$j$::jsonb, $j${"entrenamiento:A→B": ["Cantar", "Pintar"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A13', 'A', $j$Ayer tú cantabas; hoy pintas.$j$, null from nueva union all select id, 'B13', 'B', $j$Cantar$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 14', 'Grupo 2', 14, $j${"transformacion_funciones:A→C": "Yo estoy aquí bajo el tejado y tú allí bajo la lluvia sin paraguas. ¿Quién está mojado?"}$j$::jsonb, $j${"transformacion_funciones:A→C": "Tú"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Tú", "Yo"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A14', 'A', $j$Yo estoy aquí bajo el tejado y tú allí bajo la lluvia sin paraguas.$j$, null from nueva union all select id, 'C14', 'C', $j$Tú$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 15', 'Grupo 3', 15, $j${"entrenamiento:A→B": "Yo tengo el vaso de agua y tú el vaso de zumo. ¿Cuál tengo yo?"}$j$::jsonb, $j${"A→B": "Vaso de agua"}$j$::jsonb, $j${"entrenamiento:A→B": ["Vaso de agua", "Vaso de zumo"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A15', 'A', $j$Yo tengo el vaso de agua y tú el vaso de zumo.$j$, null from nueva union all select id, 'B15', 'B', $j$Vaso de agua$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 16', 'Grupo 3', 16, $j${"entrenamiento:A→B": "Yo tengo el vaso de agua y tú el vaso de zumo. ¿Cuál tienes tú?"}$j$::jsonb, $j${"A→B": "Vaso de zumo"}$j$::jsonb, $j${"entrenamiento:A→B": ["Vaso de agua", "Vaso de zumo"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A16', 'A', $j$Yo tengo el vaso de agua y tú el vaso de zumo.$j$, null from nueva union all select id, 'B16', 'B', $j$Vaso de zumo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 17', 'Grupo 3', 17, $j${"entrenamiento:A→B": "Yo estoy aquí, en la alfombra, y tú allí, en el cojín. ¿Dónde estoy yo?"}$j$::jsonb, $j${"A→B": "Alfombra"}$j$::jsonb, $j${"entrenamiento:A→B": ["Alfombra", "Cojín"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A17', 'A', $j$Yo estoy aquí, en la alfombra, y tú allí, en el cojín.$j$, null from nueva union all select id, 'B17', 'B', $j$Alfombra$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 18', 'Grupo 3', 18, $j${"entrenamiento:A→B": "Yo estoy aquí, en la alfombra, y tú allí, en el cojín. ¿Dónde estás tú?"}$j$::jsonb, $j${"A→B": "Cojín"}$j$::jsonb, $j${"entrenamiento:A→B": ["Alfombra", "Cojín"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A18', 'A', $j$Yo estoy aquí, en la alfombra, y tú allí, en el cojín.$j$, null from nueva union all select id, 'B18', 'B', $j$Cojín$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 19', 'Grupo 3', 19, $j${"entrenamiento:A→B": "Antes yo bailaba; ahora juego a la pelota. ¿Qué hago ahora?"}$j$::jsonb, $j${"A→B": "Jugar a la pelota"}$j$::jsonb, $j${"entrenamiento:A→B": ["Bailar", "Jugar a la pelota"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A19', 'A', $j$Antes yo bailaba; ahora juego a la pelota.$j$, null from nueva union all select id, 'B19', 'B', $j$Jugar a la pelota$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 20', 'Grupo 3', 20, $j${"entrenamiento:A→B": "Antes tú bailabas; ahora juegas a la pelota. ¿Qué hacías antes?"}$j$::jsonb, $j${"A→B": "Bailar"}$j$::jsonb, $j${"entrenamiento:A→B": ["Bailar", "Jugar a la pelota"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A20', 'A', $j$Antes tú bailabas; ahora juegas a la pelota.$j$, null from nueva union all select id, 'B20', 'B', $j$Bailar$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 21', 'Grupo 3', 21, $j${"transformacion_funciones:A→C": "Yo estoy aquí con la mochila llena de libros y tú allí con la mochila vacía. ¿A quién le pesa mucho la mochila?"}$j$::jsonb, $j${"transformacion_funciones:A→C": "Yo"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Tú", "Yo"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A21', 'A', $j$Yo estoy aquí con la mochila llena de libros y tú allí con la mochila vacía.$j$, null from nueva union all select id, 'C21', 'C', $j$Yo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 22', 'Grupo 4', 22, $j${"entrenamiento:A→B": "Yo tengo el muñeco y tú la pelota. ¿Cuál tengo yo?"}$j$::jsonb, $j${"A→B": "Muñeco"}$j$::jsonb, $j${"entrenamiento:A→B": ["Muñeco", "Pelota"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A22', 'A', $j$Yo tengo el muñeco y tú la pelota.$j$, null from nueva union all select id, 'B22', 'B', $j$Muñeco$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 23', 'Grupo 4', 23, $j${"entrenamiento:A→B": "Yo tengo el muñeco y tú la pelota. ¿Cuál tienes tú?"}$j$::jsonb, $j${"A→B": "Pelota"}$j$::jsonb, $j${"entrenamiento:A→B": ["Muñeco", "Pelota"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A23', 'A', $j$Yo tengo el muñeco y tú la pelota.$j$, null from nueva union all select id, 'B23', 'B', $j$Pelota$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 24', 'Grupo 4', 24, $j${"entrenamiento:A→B": "Yo estoy aquí, en el tobogán, y tú allí, en el columpio. ¿Dónde estoy yo?"}$j$::jsonb, $j${"A→B": "Tobogán"}$j$::jsonb, $j${"entrenamiento:A→B": ["Columpio", "Tobogán"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A24', 'A', $j$Yo estoy aquí, en el tobogán, y tú allí, en el columpio.$j$, null from nueva union all select id, 'B24', 'B', $j$Tobogán$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 25', 'Grupo 4', 25, $j${"entrenamiento:A→B": "Yo estoy aquí, en el tobogán, y tú allí, en el columpio. ¿Dónde estás tú?"}$j$::jsonb, $j${"A→B": "Columpio"}$j$::jsonb, $j${"entrenamiento:A→B": ["Columpio", "Tobogán"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A25', 'A', $j$Yo estoy aquí, en el tobogán, y tú allí, en el columpio.$j$, null from nueva union all select id, 'B25', 'B', $j$Columpio$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 26', 'Grupo 4', 26, $j${"entrenamiento:A→B": "Ayer yo comía pizza; hoy como macarrones. ¿Qué hago hoy?"}$j$::jsonb, $j${"A→B": "Comer macarrones"}$j$::jsonb, $j${"entrenamiento:A→B": ["Comer macarrones", "Comer pizza"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A26', 'A', $j$Ayer yo comía pizza; hoy como macarrones.$j$, null from nueva union all select id, 'B26', 'B', $j$Comer macarrones$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 27', 'Grupo 4', 27, $j${"entrenamiento:A→B": "Ayer tú comías pizza; hoy comes macarrones. ¿Qué hacías ayer?"}$j$::jsonb, $j${"A→B": "Comer pizza"}$j$::jsonb, $j${"entrenamiento:A→B": ["Comer macarrones", "Comer pizza"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A27', 'A', $j$Ayer tú comías pizza; hoy comes macarrones.$j$, null from nueva union all select id, 'B27', 'B', $j$Comer pizza$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'), 'Clase 28', 'Grupo 4', 28, $j${"transformacion_funciones:A→C": "Yo estoy aquí lejos de la música y tú allí al lado de la música muy alta. ¿Quién oye mucho ruido?"}$j$::jsonb, $j${"transformacion_funciones:A→C": "Tú"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Tú", "Yo"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A28', 'A', $j$Yo estoy aquí lejos de la música y tú allí al lado de la música muy alta.$j$, null from nueva union all select id, 'C28', 'C', $j$Tú$j$, null from nueva;
update programas_base set objetivo = $t$El alumno responde a preguntas sobre las relaciones YO–TÚ, AQUÍ–ALLÍ y AHORA–ANTES en escenas descritas verbalmente («Yo tengo el bloque rojo y tú el verde. ¿Cuál tienes tú?»), tanto si se le pregunta por él como por el otro, y aplica la relación a una situación con consecuencias («Yo estoy al sol y tú a la sombra. ¿Quién tiene calor?»).$t$, materiales = $t$Grupos de estímulos distintos (bloques/sillas/actividades; lápices/sofás; vasos/alfombra y cojín; pelota y muñeco/columpio y tobogán). En cada grupo, la misma escena se pregunta por «yo» y por «tú» (o por «ahora» y «antes»), y una clase final con una consecuencia.

A: La escena
B: La respuesta (entrenamiento)
C: La respuesta (transformación de funciones)

Las dos opciones de cada clase se dicen en audio y salen como botones, siempre en el mismo orden. Opcional en los primeros bloques: los objetos reales de la escena.$t$, instrucciones_terapeuta = $t$Requisito previo: el alumno ha superado "Usar Pronombres y Posesivos (YO–TÚ)" y "Tomar la Perspectiva Visual" (dominio 4.1) y responde a claves temporales (ver "Abstraer Claves Temporales" del dominio 3.5).

Por qué se hace así: en RFT la toma de perspectiva son tres marcos deícticos (YO–TÚ, AQUÍ–ALLÍ, AHORA–ANTES) en tres niveles de complejidad: simple, invertido y doblemente invertido (McHugh, Barnes-Holmes y Barnes-Holmes, 2004). Los errores bajan con la edad: a los 3–5 años se falla mucho y entre los 6 y los 11 apenas hay diferencias. Con el protocolo de Barnes-Holmes, niños de 6 a 11 años aprendieron las relaciones y las generalizaron a estímulos nuevos y a la conversación (Heagle y Rehfeldt, 2006), y niños con TEA las aprendieron con PEAK-T, incluida la transformación de funciones (Barron et al., 2019; Chastain y Dixon, 2024). Cada escena se pregunta por «yo» y por «tú» (o por «ahora» y «antes»), y los estímulos se intercambian entre grupos: así no se puede acertar respondiendo siempre lo mismo. La clave temporal alterna «ahora/antes» y «hoy/ayer» entre grupos para que no quede ligada a una sola palabra.

Recomendación: con alumnos pequeños o con TEA, en los primeros bloques ponga delante los objetos reales de la escena (dos bloques, dos sillas) y represéntela («Yo tengo este; tú tienes ese»), y retírelos poco a poco hasta que la escena sea solo verbal. Los bloques con objetos se registran igual.

Fase 1 - Entrenamiento: diga la escena y la pregunta de la clase («Yo tengo el bloque rojo y tú el bloque verde. ¿Cuál tienes tú?» (Bloque verde)) con las dos opciones. Mezcle en el bloque las tres relaciones del grupo. El primer bloque, sin ayudas y sin consecuencias, sirve de pretest: si alcanza el criterio, la relación queda DERIVADA y no se entrena. Si no, entrene con consecuencias y ayudas (repetir la escena señalando a quién corresponde cada cosa; con objetos, mover los objetos al invertir).

Fase 2 - Transformación de funciones, sin ayudas: la clase de cada grupo con una consecuencia (calor/fresco, mojado/seco, pesa mucho/poco, mucho/poco ruido).

Generalización: estímulos nuevos (cada grupo usa otros) y conversación sobre la vida real del alumno, sin consecuencias («Yo como aquí en casa y tú en el cole. Si yo fuera tú y tú fueras yo, ¿dónde comería yo?»).

Realice el primer bloque de cada fase sin ayudas. Si el alumno alcanza el criterio, la relación se considera DERIVADA; si se enseña con ayudas, quedará registrada como DOMINADA (no derivada), aunque el último bloque se realice sin ayudas.

Registro en la app (fase · posición origen → destino):
- Entrenamiento: A → B (escena → respuesta)
- Transformación de funciones: A → C (escena → consecuencia)$t$, secuencia_rft = $j$[{"fase": "entrenamiento", "origen": "A", "destino": "B"}, {"fase": "transformacion_funciones", "origen": "A", "destino": "C"}]$j$::jsonb, tipo_respuesta = 'opciones', opciones_respuesta = null, respuesta_por_fase = '{}'::jsonb, opciones_clase = false, contenido_actualizado_at = now() where clinica_id is null and nombre = 'Relaciones Deícticas Simples';
delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 1', 'Grupo 1', 1, $j${"entrenamiento:A→B": "Yo tengo el bloque rojo y tú el bloque verde. Si yo fuera tú y tú fueras yo, ¿cuál tendría yo?"}$j$::jsonb, $j${"A→B": "Bloque verde"}$j$::jsonb, $j${"entrenamiento:A→B": ["Bloque rojo", "Bloque verde"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A1', 'A', $j$Yo tengo el bloque rojo y tú el bloque verde.$j$, null from nueva union all select id, 'B1', 'B', $j$Bloque verde$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 2', 'Grupo 1', 2, $j${"entrenamiento:A→B": "Yo tengo el bloque rojo y tú el bloque verde. Si yo fuera tú y tú fueras yo, ¿cuál tendrías tú?"}$j$::jsonb, $j${"A→B": "Bloque rojo"}$j$::jsonb, $j${"entrenamiento:A→B": ["Bloque rojo", "Bloque verde"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A2', 'A', $j$Yo tengo el bloque rojo y tú el bloque verde.$j$, null from nueva union all select id, 'B2', 'B', $j$Bloque rojo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 3', 'Grupo 1', 3, $j${"entrenamiento:A→B": "Yo estoy aquí, en la silla azul, y tú allí, en la silla negra. Si aquí fuera allí y allí fuera aquí, ¿dónde estaría yo?"}$j$::jsonb, $j${"A→B": "Silla negra"}$j$::jsonb, $j${"entrenamiento:A→B": ["Silla azul", "Silla negra"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A3', 'A', $j$Yo estoy aquí, en la silla azul, y tú allí, en la silla negra.$j$, null from nueva union all select id, 'B3', 'B', $j$Silla negra$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 4', 'Grupo 1', 4, $j${"entrenamiento:A→B": "Yo estoy aquí, en la silla azul, y tú allí, en la silla negra. Si aquí fuera allí y allí fuera aquí, ¿dónde estarías tú?"}$j$::jsonb, $j${"A→B": "Silla azul"}$j$::jsonb, $j${"entrenamiento:A→B": ["Silla azul", "Silla negra"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A4', 'A', $j$Yo estoy aquí, en la silla azul, y tú allí, en la silla negra.$j$, null from nueva union all select id, 'B4', 'B', $j$Silla azul$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 5', 'Grupo 1', 5, $j${"entrenamiento:A→B": "Antes yo veía la tele; ahora leo un cuento. Si ahora fuera antes y antes fuera ahora, ¿qué estaría haciendo ahora?"}$j$::jsonb, $j${"A→B": "Ver la tele"}$j$::jsonb, $j${"entrenamiento:A→B": ["Leer un cuento", "Ver la tele"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A5', 'A', $j$Antes yo veía la tele; ahora leo un cuento.$j$, null from nueva union all select id, 'B5', 'B', $j$Ver la tele$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 6', 'Grupo 1', 6, $j${"entrenamiento:A→B": "Antes tú veías la tele; ahora lees un cuento. Si ahora fuera antes y antes fuera ahora, ¿qué habrías hecho antes?"}$j$::jsonb, $j${"A→B": "Leer un cuento"}$j$::jsonb, $j${"entrenamiento:A→B": ["Leer un cuento", "Ver la tele"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A6', 'A', $j$Antes tú veías la tele; ahora lees un cuento.$j$, null from nueva union all select id, 'B6', 'B', $j$Leer un cuento$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 7', 'Grupo 1', 7, $j${"transformacion_funciones:A→C": "Yo estoy aquí al sol y tú allí a la sombra. Si yo fuera tú y tú fueras yo, ¿tendría calor o fresco?"}$j$::jsonb, $j${"transformacion_funciones:A→C": "Fresco"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Calor", "Fresco"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A7', 'A', $j$Yo estoy aquí al sol y tú allí a la sombra.$j$, null from nueva union all select id, 'C7', 'C', $j$Fresco$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 8', 'Grupo 2', 8, $j${"entrenamiento:A→B": "Yo tengo el lápiz naranja y tú el lápiz amarillo. Si yo fuera tú y tú fueras yo, ¿cuál tendría yo?"}$j$::jsonb, $j${"A→B": "Lápiz amarillo"}$j$::jsonb, $j${"entrenamiento:A→B": ["Lápiz amarillo", "Lápiz naranja"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A8', 'A', $j$Yo tengo el lápiz naranja y tú el lápiz amarillo.$j$, null from nueva union all select id, 'B8', 'B', $j$Lápiz amarillo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 9', 'Grupo 2', 9, $j${"entrenamiento:A→B": "Yo tengo el lápiz naranja y tú el lápiz amarillo. Si yo fuera tú y tú fueras yo, ¿cuál tendrías tú?"}$j$::jsonb, $j${"A→B": "Lápiz naranja"}$j$::jsonb, $j${"entrenamiento:A→B": ["Lápiz amarillo", "Lápiz naranja"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A9', 'A', $j$Yo tengo el lápiz naranja y tú el lápiz amarillo.$j$, null from nueva union all select id, 'B9', 'B', $j$Lápiz naranja$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 10', 'Grupo 2', 10, $j${"entrenamiento:A→B": "Yo estoy aquí, en el sofá morado, y tú allí, en el sofá rosa. Si aquí fuera allí y allí fuera aquí, ¿dónde estaría yo?"}$j$::jsonb, $j${"A→B": "Sofá rosa"}$j$::jsonb, $j${"entrenamiento:A→B": ["Sofá morado", "Sofá rosa"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A10', 'A', $j$Yo estoy aquí, en el sofá morado, y tú allí, en el sofá rosa.$j$, null from nueva union all select id, 'B10', 'B', $j$Sofá rosa$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 11', 'Grupo 2', 11, $j${"entrenamiento:A→B": "Yo estoy aquí, en el sofá morado, y tú allí, en el sofá rosa. Si aquí fuera allí y allí fuera aquí, ¿dónde estarías tú?"}$j$::jsonb, $j${"A→B": "Sofá morado"}$j$::jsonb, $j${"entrenamiento:A→B": ["Sofá morado", "Sofá rosa"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A11', 'A', $j$Yo estoy aquí, en el sofá morado, y tú allí, en el sofá rosa.$j$, null from nueva union all select id, 'B11', 'B', $j$Sofá morado$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 12', 'Grupo 2', 12, $j${"entrenamiento:A→B": "Ayer yo cantaba; hoy pinto. Si hoy fuera ayer y ayer fuera hoy, ¿qué estaría haciendo hoy?"}$j$::jsonb, $j${"A→B": "Cantar"}$j$::jsonb, $j${"entrenamiento:A→B": ["Cantar", "Pintar"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A12', 'A', $j$Ayer yo cantaba; hoy pinto.$j$, null from nueva union all select id, 'B12', 'B', $j$Cantar$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 13', 'Grupo 2', 13, $j${"entrenamiento:A→B": "Ayer tú cantabas; hoy pintas. Si hoy fuera ayer y ayer fuera hoy, ¿qué habrías hecho ayer?"}$j$::jsonb, $j${"A→B": "Pintar"}$j$::jsonb, $j${"entrenamiento:A→B": ["Cantar", "Pintar"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A13', 'A', $j$Ayer tú cantabas; hoy pintas.$j$, null from nueva union all select id, 'B13', 'B', $j$Pintar$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 14', 'Grupo 2', 14, $j${"transformacion_funciones:A→C": "Yo estoy aquí bajo el tejado y tú allí bajo la lluvia sin paraguas. Si yo fuera tú y tú fueras yo, ¿estaría mojado o seco?"}$j$::jsonb, $j${"transformacion_funciones:A→C": "Mojado"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Mojado", "Seco"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A14', 'A', $j$Yo estoy aquí bajo el tejado y tú allí bajo la lluvia sin paraguas.$j$, null from nueva union all select id, 'C14', 'C', $j$Mojado$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 15', 'Grupo 3', 15, $j${"entrenamiento:A→B": "Yo tengo el vaso de agua y tú el vaso de zumo. Si yo fuera tú y tú fueras yo, ¿cuál tendría yo?"}$j$::jsonb, $j${"A→B": "Vaso de zumo"}$j$::jsonb, $j${"entrenamiento:A→B": ["Vaso de agua", "Vaso de zumo"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A15', 'A', $j$Yo tengo el vaso de agua y tú el vaso de zumo.$j$, null from nueva union all select id, 'B15', 'B', $j$Vaso de zumo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 16', 'Grupo 3', 16, $j${"entrenamiento:A→B": "Yo tengo el vaso de agua y tú el vaso de zumo. Si yo fuera tú y tú fueras yo, ¿cuál tendrías tú?"}$j$::jsonb, $j${"A→B": "Vaso de agua"}$j$::jsonb, $j${"entrenamiento:A→B": ["Vaso de agua", "Vaso de zumo"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A16', 'A', $j$Yo tengo el vaso de agua y tú el vaso de zumo.$j$, null from nueva union all select id, 'B16', 'B', $j$Vaso de agua$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 17', 'Grupo 3', 17, $j${"entrenamiento:A→B": "Yo estoy aquí, en la alfombra, y tú allí, en el cojín. Si aquí fuera allí y allí fuera aquí, ¿dónde estaría yo?"}$j$::jsonb, $j${"A→B": "Cojín"}$j$::jsonb, $j${"entrenamiento:A→B": ["Alfombra", "Cojín"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A17', 'A', $j$Yo estoy aquí, en la alfombra, y tú allí, en el cojín.$j$, null from nueva union all select id, 'B17', 'B', $j$Cojín$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 18', 'Grupo 3', 18, $j${"entrenamiento:A→B": "Yo estoy aquí, en la alfombra, y tú allí, en el cojín. Si aquí fuera allí y allí fuera aquí, ¿dónde estarías tú?"}$j$::jsonb, $j${"A→B": "Alfombra"}$j$::jsonb, $j${"entrenamiento:A→B": ["Alfombra", "Cojín"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A18', 'A', $j$Yo estoy aquí, en la alfombra, y tú allí, en el cojín.$j$, null from nueva union all select id, 'B18', 'B', $j$Alfombra$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 19', 'Grupo 3', 19, $j${"entrenamiento:A→B": "Antes yo bailaba; ahora juego a la pelota. Si ahora fuera antes y antes fuera ahora, ¿qué estaría haciendo ahora?"}$j$::jsonb, $j${"A→B": "Bailar"}$j$::jsonb, $j${"entrenamiento:A→B": ["Bailar", "Jugar a la pelota"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A19', 'A', $j$Antes yo bailaba; ahora juego a la pelota.$j$, null from nueva union all select id, 'B19', 'B', $j$Bailar$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 20', 'Grupo 3', 20, $j${"entrenamiento:A→B": "Antes tú bailabas; ahora juegas a la pelota. Si ahora fuera antes y antes fuera ahora, ¿qué habrías hecho antes?"}$j$::jsonb, $j${"A→B": "Jugar a la pelota"}$j$::jsonb, $j${"entrenamiento:A→B": ["Bailar", "Jugar a la pelota"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A20', 'A', $j$Antes tú bailabas; ahora juegas a la pelota.$j$, null from nueva union all select id, 'B20', 'B', $j$Jugar a la pelota$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 21', 'Grupo 3', 21, $j${"transformacion_funciones:A→C": "Yo estoy aquí con la mochila llena de libros y tú allí con la mochila vacía. Si yo fuera tú y tú fueras yo, ¿me pesaría mucho o poco la mochila?"}$j$::jsonb, $j${"transformacion_funciones:A→C": "Poco"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Mucho", "Poco"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A21', 'A', $j$Yo estoy aquí con la mochila llena de libros y tú allí con la mochila vacía.$j$, null from nueva union all select id, 'C21', 'C', $j$Poco$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 22', 'Grupo 4', 22, $j${"entrenamiento:A→B": "Yo tengo el muñeco y tú la pelota. Si yo fuera tú y tú fueras yo, ¿cuál tendría yo?"}$j$::jsonb, $j${"A→B": "Pelota"}$j$::jsonb, $j${"entrenamiento:A→B": ["Muñeco", "Pelota"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A22', 'A', $j$Yo tengo el muñeco y tú la pelota.$j$, null from nueva union all select id, 'B22', 'B', $j$Pelota$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 23', 'Grupo 4', 23, $j${"entrenamiento:A→B": "Yo tengo el muñeco y tú la pelota. Si yo fuera tú y tú fueras yo, ¿cuál tendrías tú?"}$j$::jsonb, $j${"A→B": "Muñeco"}$j$::jsonb, $j${"entrenamiento:A→B": ["Muñeco", "Pelota"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A23', 'A', $j$Yo tengo el muñeco y tú la pelota.$j$, null from nueva union all select id, 'B23', 'B', $j$Muñeco$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 24', 'Grupo 4', 24, $j${"entrenamiento:A→B": "Yo estoy aquí, en el tobogán, y tú allí, en el columpio. Si aquí fuera allí y allí fuera aquí, ¿dónde estaría yo?"}$j$::jsonb, $j${"A→B": "Columpio"}$j$::jsonb, $j${"entrenamiento:A→B": ["Columpio", "Tobogán"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A24', 'A', $j$Yo estoy aquí, en el tobogán, y tú allí, en el columpio.$j$, null from nueva union all select id, 'B24', 'B', $j$Columpio$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 25', 'Grupo 4', 25, $j${"entrenamiento:A→B": "Yo estoy aquí, en el tobogán, y tú allí, en el columpio. Si aquí fuera allí y allí fuera aquí, ¿dónde estarías tú?"}$j$::jsonb, $j${"A→B": "Tobogán"}$j$::jsonb, $j${"entrenamiento:A→B": ["Columpio", "Tobogán"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A25', 'A', $j$Yo estoy aquí, en el tobogán, y tú allí, en el columpio.$j$, null from nueva union all select id, 'B25', 'B', $j$Tobogán$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 26', 'Grupo 4', 26, $j${"entrenamiento:A→B": "Ayer yo comía pizza; hoy como macarrones. Si hoy fuera ayer y ayer fuera hoy, ¿qué estaría haciendo hoy?"}$j$::jsonb, $j${"A→B": "Comer pizza"}$j$::jsonb, $j${"entrenamiento:A→B": ["Comer macarrones", "Comer pizza"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A26', 'A', $j$Ayer yo comía pizza; hoy como macarrones.$j$, null from nueva union all select id, 'B26', 'B', $j$Comer pizza$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 27', 'Grupo 4', 27, $j${"entrenamiento:A→B": "Ayer tú comías pizza; hoy comes macarrones. Si hoy fuera ayer y ayer fuera hoy, ¿qué habrías hecho ayer?"}$j$::jsonb, $j${"A→B": "Comer macarrones"}$j$::jsonb, $j${"entrenamiento:A→B": ["Comer macarrones", "Comer pizza"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A27', 'A', $j$Ayer tú comías pizza; hoy comes macarrones.$j$, null from nueva union all select id, 'B27', 'B', $j$Comer macarrones$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas'), 'Clase 28', 'Grupo 4', 28, $j${"transformacion_funciones:A→C": "Yo estoy aquí lejos de la música y tú allí al lado de la música muy alta. Si yo fuera tú y tú fueras yo, ¿oiría mucho ruido o poco?"}$j$::jsonb, $j${"transformacion_funciones:A→C": "Mucho"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Mucho", "Poco"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A28', 'A', $j$Yo estoy aquí lejos de la música y tú allí al lado de la música muy alta.$j$, null from nueva union all select id, 'C28', 'C', $j$Mucho$j$, null from nueva;
update programas_base set objetivo = $t$El alumno responde correctamente cuando se invierte una relación deíctica («Si yo fuera tú y tú fueras yo, ¿cuál tendría yo?»; «Si aquí fuera allí…»; «Si ahora fuera antes…») y transforma funciones con la inversión («Si yo fuera tú, ¿tendría calor o fresco?»).$t$, materiales = $t$Grupos de estímulos distintos (bloques/sillas/actividades; lápices/sofás; vasos/alfombra y cojín; pelota y muñeco/columpio y tobogán). En cada grupo, la misma escena se pregunta por «yo» y por «tú» (o por «ahora» y «antes»), y una clase final con una consecuencia.

A: La escena
B: La respuesta (entrenamiento)
C: La respuesta (transformación de funciones)

Las dos opciones de cada clase se dicen en audio y salen como botones, siempre en el mismo orden. Opcional en los primeros bloques: los objetos reales de la escena.$t$, instrucciones_terapeuta = $t$Requisito previo: el alumno ha superado "Relaciones Deícticas Simples" (dominio 4.1).

Por qué se hace así: en RFT la toma de perspectiva son tres marcos deícticos (YO–TÚ, AQUÍ–ALLÍ, AHORA–ANTES) en tres niveles de complejidad: simple, invertido y doblemente invertido (McHugh, Barnes-Holmes y Barnes-Holmes, 2004). Los errores bajan con la edad: a los 3–5 años se falla mucho y entre los 6 y los 11 apenas hay diferencias. Con el protocolo de Barnes-Holmes, niños de 6 a 11 años aprendieron las relaciones y las generalizaron a estímulos nuevos y a la conversación (Heagle y Rehfeldt, 2006), y niños con TEA las aprendieron con PEAK-T, incluida la transformación de funciones (Barron et al., 2019; Chastain y Dixon, 2024). Cada escena se pregunta por «yo» y por «tú» (o por «ahora» y «antes»), y los estímulos se intercambian entre grupos: así no se puede acertar respondiendo siempre lo mismo. La clave temporal alterna «ahora/antes» y «hoy/ayer» entre grupos para que no quede ligada a una sola palabra.

Recomendación: con alumnos pequeños o con TEA, en los primeros bloques ponga delante los objetos reales de la escena (dos bloques, dos sillas) y represéntela («Yo tengo este; tú tienes ese»), y retírelos poco a poco hasta que la escena sea solo verbal. Los bloques con objetos se registran igual.

Fase 1 - Entrenamiento: diga la escena y la pregunta de la clase («Yo tengo el bloque rojo y tú el bloque verde. Si yo fuera tú y tú fueras yo, ¿cuál tendría yo?» (Bloque verde)) con las dos opciones. Mezcle en el bloque las tres relaciones del grupo. El primer bloque, sin ayudas y sin consecuencias, sirve de pretest: si alcanza el criterio, la relación queda DERIVADA y no se entrena. Si no, entrene con consecuencias y ayudas (repetir la escena señalando a quién corresponde cada cosa; con objetos, mover los objetos al invertir).

Fase 2 - Transformación de funciones, sin ayudas: la clase de cada grupo con una consecuencia (calor/fresco, mojado/seco, pesa mucho/poco, mucho/poco ruido).

Generalización: estímulos nuevos (cada grupo usa otros) y conversación sobre la vida real del alumno, sin consecuencias («Yo como aquí en casa y tú en el cole. Si yo fuera tú y tú fueras yo, ¿dónde comería yo?»).

Realice el primer bloque de cada fase sin ayudas. Si el alumno alcanza el criterio, la relación se considera DERIVADA; si se enseña con ayudas, quedará registrada como DOMINADA (no derivada), aunque el último bloque se realice sin ayudas.

Registro en la app (fase · posición origen → destino):
- Entrenamiento: A → B (escena → respuesta)
- Transformación de funciones: A → C (escena → consecuencia)$t$, secuencia_rft = $j$[{"fase": "entrenamiento", "origen": "A", "destino": "B"}, {"fase": "transformacion_funciones", "origen": "A", "destino": "C"}]$j$::jsonb, tipo_respuesta = 'opciones', opciones_respuesta = null, respuesta_por_fase = '{}'::jsonb, opciones_clase = false, contenido_actualizado_at = now() where clinica_id is null and nombre = 'Relaciones Deícticas Invertidas';
delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Doblemente Invertidas'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Doblemente Invertidas');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Doblemente Invertidas'), 'Clase 1', 'Grupo 1', 1, $j${"entrenamiento:A→B": "Yo estoy aquí, en la silla azul, y tú allí, en la silla negra. Si yo fuera tú y tú fueras yo, y si aquí fuera allí y allí fuera aquí, ¿dónde estaría yo?"}$j$::jsonb, $j${"A→B": "Silla azul"}$j$::jsonb, $j${"entrenamiento:A→B": ["Silla azul", "Silla negra"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A1', 'A', $j$Yo estoy aquí, en la silla azul, y tú allí, en la silla negra.$j$, null from nueva union all select id, 'B1', 'B', $j$Silla azul$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Doblemente Invertidas'), 'Clase 2', 'Grupo 1', 2, $j${"entrenamiento:A→B": "Yo estoy aquí, en la silla azul, y tú allí, en la silla negra. Si yo fuera tú y tú fueras yo, y si aquí fuera allí y allí fuera aquí, ¿dónde estarías tú?"}$j$::jsonb, $j${"A→B": "Silla negra"}$j$::jsonb, $j${"entrenamiento:A→B": ["Silla azul", "Silla negra"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A2', 'A', $j$Yo estoy aquí, en la silla azul, y tú allí, en la silla negra.$j$, null from nueva union all select id, 'B2', 'B', $j$Silla negra$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Doblemente Invertidas'), 'Clase 3', 'Grupo 1', 3, $j${"entrenamiento:A→B": "Antes yo estaba allí, en la silla azul; ahora estoy aquí, en la silla negra. Si aquí fuera allí y allí fuera aquí, y si ahora fuera antes y antes fuera ahora, ¿dónde estaría ahora?"}$j$::jsonb, $j${"A→B": "Silla negra"}$j$::jsonb, $j${"entrenamiento:A→B": ["Silla azul", "Silla negra"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A3', 'A', $j$Antes yo estaba allí, en la silla azul; ahora estoy aquí, en la silla negra.$j$, null from nueva union all select id, 'B3', 'B', $j$Silla negra$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Doblemente Invertidas'), 'Clase 4', 'Grupo 1', 4, $j${"entrenamiento:A→B": "Antes yo estaba allí, en la silla azul; ahora estoy aquí, en la silla negra. Si aquí fuera allí y allí fuera aquí, y si ahora fuera antes y antes fuera ahora, ¿dónde habría estado antes?"}$j$::jsonb, $j${"A→B": "Silla azul"}$j$::jsonb, $j${"entrenamiento:A→B": ["Silla azul", "Silla negra"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A4', 'A', $j$Antes yo estaba allí, en la silla azul; ahora estoy aquí, en la silla negra.$j$, null from nueva union all select id, 'B4', 'B', $j$Silla azul$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Doblemente Invertidas'), 'Clase 5', 'Grupo 1', 5, $j${"transformacion_funciones:A→C": "Yo estoy aquí al sol y tú allí a la sombra. Si yo fuera tú y tú fueras yo, y si aquí fuera allí y allí fuera aquí, ¿tendría calor o fresco?"}$j$::jsonb, $j${"transformacion_funciones:A→C": "Calor"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Calor", "Fresco"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A5', 'A', $j$Yo estoy aquí al sol y tú allí a la sombra.$j$, null from nueva union all select id, 'C5', 'C', $j$Calor$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Doblemente Invertidas'), 'Clase 6', 'Grupo 2', 6, $j${"entrenamiento:A→B": "Yo estoy aquí, en el sofá morado, y tú allí, en el sofá rosa. Si yo fuera tú y tú fueras yo, y si aquí fuera allí y allí fuera aquí, ¿dónde estaría yo?"}$j$::jsonb, $j${"A→B": "Sofá morado"}$j$::jsonb, $j${"entrenamiento:A→B": ["Sofá morado", "Sofá rosa"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A6', 'A', $j$Yo estoy aquí, en el sofá morado, y tú allí, en el sofá rosa.$j$, null from nueva union all select id, 'B6', 'B', $j$Sofá morado$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Doblemente Invertidas'), 'Clase 7', 'Grupo 2', 7, $j${"entrenamiento:A→B": "Yo estoy aquí, en el sofá morado, y tú allí, en el sofá rosa. Si yo fuera tú y tú fueras yo, y si aquí fuera allí y allí fuera aquí, ¿dónde estarías tú?"}$j$::jsonb, $j${"A→B": "Sofá rosa"}$j$::jsonb, $j${"entrenamiento:A→B": ["Sofá morado", "Sofá rosa"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A7', 'A', $j$Yo estoy aquí, en el sofá morado, y tú allí, en el sofá rosa.$j$, null from nueva union all select id, 'B7', 'B', $j$Sofá rosa$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Doblemente Invertidas'), 'Clase 8', 'Grupo 2', 8, $j${"entrenamiento:A→B": "Ayer yo estaba allí, en el sofá morado; hoy estoy aquí, en el sofá rosa. Si aquí fuera allí y allí fuera aquí, y si hoy fuera ayer y ayer fuera hoy, ¿dónde estaría hoy?"}$j$::jsonb, $j${"A→B": "Sofá rosa"}$j$::jsonb, $j${"entrenamiento:A→B": ["Sofá morado", "Sofá rosa"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A8', 'A', $j$Ayer yo estaba allí, en el sofá morado; hoy estoy aquí, en el sofá rosa.$j$, null from nueva union all select id, 'B8', 'B', $j$Sofá rosa$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Doblemente Invertidas'), 'Clase 9', 'Grupo 2', 9, $j${"entrenamiento:A→B": "Ayer yo estaba allí, en el sofá morado; hoy estoy aquí, en el sofá rosa. Si aquí fuera allí y allí fuera aquí, y si hoy fuera ayer y ayer fuera hoy, ¿dónde habría estado ayer?"}$j$::jsonb, $j${"A→B": "Sofá morado"}$j$::jsonb, $j${"entrenamiento:A→B": ["Sofá morado", "Sofá rosa"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A9', 'A', $j$Ayer yo estaba allí, en el sofá morado; hoy estoy aquí, en el sofá rosa.$j$, null from nueva union all select id, 'B9', 'B', $j$Sofá morado$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Doblemente Invertidas'), 'Clase 10', 'Grupo 2', 10, $j${"transformacion_funciones:A→C": "Yo estoy aquí bajo el tejado y tú allí bajo la lluvia sin paraguas. Si yo fuera tú y tú fueras yo, y si aquí fuera allí y allí fuera aquí, ¿estaría mojado o seco?"}$j$::jsonb, $j${"transformacion_funciones:A→C": "Seco"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Mojado", "Seco"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A10', 'A', $j$Yo estoy aquí bajo el tejado y tú allí bajo la lluvia sin paraguas.$j$, null from nueva union all select id, 'C10', 'C', $j$Seco$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Doblemente Invertidas'), 'Clase 11', 'Grupo 3', 11, $j${"entrenamiento:A→B": "Yo estoy aquí, en la alfombra, y tú allí, en el cojín. Si yo fuera tú y tú fueras yo, y si aquí fuera allí y allí fuera aquí, ¿dónde estaría yo?"}$j$::jsonb, $j${"A→B": "Alfombra"}$j$::jsonb, $j${"entrenamiento:A→B": ["Alfombra", "Cojín"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A11', 'A', $j$Yo estoy aquí, en la alfombra, y tú allí, en el cojín.$j$, null from nueva union all select id, 'B11', 'B', $j$Alfombra$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Doblemente Invertidas'), 'Clase 12', 'Grupo 3', 12, $j${"entrenamiento:A→B": "Yo estoy aquí, en la alfombra, y tú allí, en el cojín. Si yo fuera tú y tú fueras yo, y si aquí fuera allí y allí fuera aquí, ¿dónde estarías tú?"}$j$::jsonb, $j${"A→B": "Cojín"}$j$::jsonb, $j${"entrenamiento:A→B": ["Alfombra", "Cojín"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A12', 'A', $j$Yo estoy aquí, en la alfombra, y tú allí, en el cojín.$j$, null from nueva union all select id, 'B12', 'B', $j$Cojín$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Doblemente Invertidas'), 'Clase 13', 'Grupo 3', 13, $j${"entrenamiento:A→B": "Antes yo estaba allí, en la alfombra; ahora estoy aquí, en el cojín. Si aquí fuera allí y allí fuera aquí, y si ahora fuera antes y antes fuera ahora, ¿dónde estaría ahora?"}$j$::jsonb, $j${"A→B": "Cojín"}$j$::jsonb, $j${"entrenamiento:A→B": ["Alfombra", "Cojín"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A13', 'A', $j$Antes yo estaba allí, en la alfombra; ahora estoy aquí, en el cojín.$j$, null from nueva union all select id, 'B13', 'B', $j$Cojín$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Doblemente Invertidas'), 'Clase 14', 'Grupo 3', 14, $j${"entrenamiento:A→B": "Antes yo estaba allí, en la alfombra; ahora estoy aquí, en el cojín. Si aquí fuera allí y allí fuera aquí, y si ahora fuera antes y antes fuera ahora, ¿dónde habría estado antes?"}$j$::jsonb, $j${"A→B": "Alfombra"}$j$::jsonb, $j${"entrenamiento:A→B": ["Alfombra", "Cojín"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A14', 'A', $j$Antes yo estaba allí, en la alfombra; ahora estoy aquí, en el cojín.$j$, null from nueva union all select id, 'B14', 'B', $j$Alfombra$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Doblemente Invertidas'), 'Clase 15', 'Grupo 3', 15, $j${"transformacion_funciones:A→C": "Yo estoy aquí con la mochila llena de libros y tú allí con la mochila vacía. Si yo fuera tú y tú fueras yo, y si aquí fuera allí y allí fuera aquí, ¿me pesaría mucho o poco la mochila?"}$j$::jsonb, $j${"transformacion_funciones:A→C": "Mucho"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Mucho", "Poco"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A15', 'A', $j$Yo estoy aquí con la mochila llena de libros y tú allí con la mochila vacía.$j$, null from nueva union all select id, 'C15', 'C', $j$Mucho$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Doblemente Invertidas'), 'Clase 16', 'Grupo 4', 16, $j${"entrenamiento:A→B": "Yo estoy aquí, en el tobogán, y tú allí, en el columpio. Si yo fuera tú y tú fueras yo, y si aquí fuera allí y allí fuera aquí, ¿dónde estaría yo?"}$j$::jsonb, $j${"A→B": "Tobogán"}$j$::jsonb, $j${"entrenamiento:A→B": ["Columpio", "Tobogán"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A16', 'A', $j$Yo estoy aquí, en el tobogán, y tú allí, en el columpio.$j$, null from nueva union all select id, 'B16', 'B', $j$Tobogán$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Doblemente Invertidas'), 'Clase 17', 'Grupo 4', 17, $j${"entrenamiento:A→B": "Yo estoy aquí, en el tobogán, y tú allí, en el columpio. Si yo fuera tú y tú fueras yo, y si aquí fuera allí y allí fuera aquí, ¿dónde estarías tú?"}$j$::jsonb, $j${"A→B": "Columpio"}$j$::jsonb, $j${"entrenamiento:A→B": ["Columpio", "Tobogán"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A17', 'A', $j$Yo estoy aquí, en el tobogán, y tú allí, en el columpio.$j$, null from nueva union all select id, 'B17', 'B', $j$Columpio$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Doblemente Invertidas'), 'Clase 18', 'Grupo 4', 18, $j${"entrenamiento:A→B": "Ayer yo estaba allí, en el tobogán; hoy estoy aquí, en el columpio. Si aquí fuera allí y allí fuera aquí, y si hoy fuera ayer y ayer fuera hoy, ¿dónde estaría hoy?"}$j$::jsonb, $j${"A→B": "Columpio"}$j$::jsonb, $j${"entrenamiento:A→B": ["Columpio", "Tobogán"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A18', 'A', $j$Ayer yo estaba allí, en el tobogán; hoy estoy aquí, en el columpio.$j$, null from nueva union all select id, 'B18', 'B', $j$Columpio$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Doblemente Invertidas'), 'Clase 19', 'Grupo 4', 19, $j${"entrenamiento:A→B": "Ayer yo estaba allí, en el tobogán; hoy estoy aquí, en el columpio. Si aquí fuera allí y allí fuera aquí, y si hoy fuera ayer y ayer fuera hoy, ¿dónde habría estado ayer?"}$j$::jsonb, $j${"A→B": "Tobogán"}$j$::jsonb, $j${"entrenamiento:A→B": ["Columpio", "Tobogán"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A19', 'A', $j$Ayer yo estaba allí, en el tobogán; hoy estoy aquí, en el columpio.$j$, null from nueva union all select id, 'B19', 'B', $j$Tobogán$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Doblemente Invertidas'), 'Clase 20', 'Grupo 4', 20, $j${"transformacion_funciones:A→C": "Yo estoy aquí lejos de la música y tú allí al lado de la música muy alta. Si yo fuera tú y tú fueras yo, y si aquí fuera allí y allí fuera aquí, ¿oiría mucho ruido o poco?"}$j$::jsonb, $j${"transformacion_funciones:A→C": "Poco"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Mucho", "Poco"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A20', 'A', $j$Yo estoy aquí lejos de la música y tú allí al lado de la música muy alta.$j$, null from nueva union all select id, 'C20', 'C', $j$Poco$j$, null from nueva;
update programas_base set objetivo = $t$El alumno responde correctamente cuando se invierten a la vez dos relaciones deícticas, teniendo en cuenta que dos inversiones se anulan entre sí («Si yo fuera tú y tú fueras yo, y si aquí fuera allí y allí fuera aquí, ¿dónde estaría yo?»), también cuando la pregunta implica una consecuencia.$t$, materiales = $t$Grupos de estímulos distintos (bloques/sillas/actividades; lápices/sofás; vasos/alfombra y cojín; pelota y muñeco/columpio y tobogán). En cada grupo, la misma escena se pregunta por «yo» y por «tú» (o por «ahora» y «antes»), y una clase final con una consecuencia.

A: La escena
B: La respuesta (entrenamiento)
C: La respuesta (transformación de funciones)

Las dos opciones de cada clase se dicen en audio y salen como botones, siempre en el mismo orden. Opcional en los primeros bloques: los objetos reales de la escena.$t$, instrucciones_terapeuta = $t$Requisito previo: el alumno ha superado "Relaciones Deícticas Invertidas" (dominio 4.1).

Por qué se hace así: en RFT la toma de perspectiva son tres marcos deícticos (YO–TÚ, AQUÍ–ALLÍ, AHORA–ANTES) en tres niveles de complejidad: simple, invertido y doblemente invertido (McHugh, Barnes-Holmes y Barnes-Holmes, 2004). Los errores bajan con la edad: a los 3–5 años se falla mucho y entre los 6 y los 11 apenas hay diferencias. Con el protocolo de Barnes-Holmes, niños de 6 a 11 años aprendieron las relaciones y las generalizaron a estímulos nuevos y a la conversación (Heagle y Rehfeldt, 2006), y niños con TEA las aprendieron con PEAK-T, incluida la transformación de funciones (Barron et al., 2019; Chastain y Dixon, 2024). Cada escena se pregunta por «yo» y por «tú» (o por «ahora» y «antes»), y los estímulos se intercambian entre grupos: así no se puede acertar respondiendo siempre lo mismo. La clave temporal alterna «ahora/antes» y «hoy/ayer» entre grupos para que no quede ligada a una sola palabra.

Recomendación: con alumnos pequeños o con TEA, en los primeros bloques ponga delante los objetos reales de la escena (dos bloques, dos sillas) y represéntela («Yo tengo este; tú tienes ese»), y retírelos poco a poco hasta que la escena sea solo verbal. Los bloques con objetos se registran igual.

Fase 1 - Entrenamiento: diga la escena y la pregunta de la clase («Yo estoy aquí, en la silla azul, y tú allí, en la silla negra. Si yo fuera tú y tú fueras yo, y si aquí fuera allí y allí fuera aquí, ¿dónde estaría yo?» (Silla azul: las dos inversiones se anulan)) con las dos opciones. Mezcle en el bloque las tres relaciones del grupo. El primer bloque, sin ayudas y sin consecuencias, sirve de pretest: si alcanza el criterio, la relación queda DERIVADA y no se entrena. Si no, entrene con consecuencias y ayudas (repetir la escena señalando a quién corresponde cada cosa; con objetos, mover los objetos al invertir).

Fase 2 - Transformación de funciones, sin ayudas: la clase de cada grupo con una consecuencia (calor/fresco, mojado/seco, pesa mucho/poco, mucho/poco ruido).

Generalización: estímulos nuevos (cada grupo usa otros) y conversación sobre la vida real del alumno, sin consecuencias («Yo como aquí en casa y tú en el cole. Si yo fuera tú y tú fueras yo, ¿dónde comería yo?»).

Realice el primer bloque de cada fase sin ayudas. Si el alumno alcanza el criterio, la relación se considera DERIVADA; si se enseña con ayudas, quedará registrada como DOMINADA (no derivada), aunque el último bloque se realice sin ayudas.

Registro en la app (fase · posición origen → destino):
- Entrenamiento: A → B (escena → respuesta)
- Transformación de funciones: A → C (escena → consecuencia)$t$, secuencia_rft = $j$[{"fase": "entrenamiento", "origen": "A", "destino": "B"}, {"fase": "transformacion_funciones", "origen": "A", "destino": "C"}]$j$::jsonb, tipo_respuesta = 'opciones', opciones_respuesta = null, respuesta_por_fase = '{}'::jsonb, opciones_clase = false, contenido_actualizado_at = now() where clinica_id is null and nombre = 'Relaciones Deícticas Doblemente Invertidas';
commit;
