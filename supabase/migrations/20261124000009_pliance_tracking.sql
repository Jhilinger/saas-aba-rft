-- Pliance y tracking según Törneke, Luciano y Valdivia-Salas (2008) y Wymer et al. (2016): cinco grupos con ejemplos concretos.
-- Revisado por el usuario el 2026-11-24 (ejemplos de pliance más claros; quién da la regla y si tiene sentido, por separado).
begin;
delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 1', 'Grupo 1', 1, $j${"entrenamiento:A→B": "Mamá dice: «Recoge los juguetes ahora, que lo digo yo». Lucas los recoge. ¿Por qué?"}$j$::jsonb, $j${"A→B": "Porque se lo dice alguien"}$j$::jsonb, $j${"entrenamiento:A→B": ["Porque se lo dice alguien", "Por lo que pasa"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A1', 'A', $j$Mamá dice: «Recoge los juguetes ahora, que lo digo yo». Lucas los recoge. ¿Por qué?$j$, null from nueva union all select id, 'B1', 'B', $j$Porque se lo dice alguien$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 2', 'Grupo 1', 2, $j${"entrenamiento:A→B": "Papá dice: «Ponte el abrigo, que fuera hace frío y lo vas a pasar mal». Ana se lo pone. ¿Por qué?"}$j$::jsonb, $j${"A→B": "Por lo que pasa"}$j$::jsonb, $j${"entrenamiento:A→B": ["Porque se lo dice alguien", "Por lo que pasa"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A2', 'A', $j$Papá dice: «Ponte el abrigo, que fuera hace frío y lo vas a pasar mal». Ana se lo pone. ¿Por qué?$j$, null from nueva union all select id, 'B2', 'B', $j$Por lo que pasa$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 3', 'Grupo 1', 3, $j${"entrenamiento:A→B": "La profe dice: «Pon la mochila en la percha azul o te quedas sin recreo». Pablo la pone allí. ¿Por qué?"}$j$::jsonb, $j${"A→B": "Porque se lo dice alguien"}$j$::jsonb, $j${"entrenamiento:A→B": ["Porque se lo dice alguien", "Por lo que pasa"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A3', 'A', $j$La profe dice: «Pon la mochila en la percha azul o te quedas sin recreo». Pablo la pone allí. ¿Por qué?$j$, null from nueva union all select id, 'B3', 'B', $j$Porque se lo dice alguien$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 4', 'Grupo 1', 4, $j${"entrenamiento:A→B": "La abuela dice: «Si riegas la planta, crecerá». Marta la riega y la mira cada día. ¿Por qué?"}$j$::jsonb, $j${"A→B": "Por lo que pasa"}$j$::jsonb, $j${"entrenamiento:A→B": ["Porque se lo dice alguien", "Por lo que pasa"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A4', 'A', $j$La abuela dice: «Si riegas la planta, crecerá». Marta la riega y la mira cada día. ¿Por qué?$j$, null from nueva union all select id, 'B4', 'B', $j$Por lo que pasa$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 5', 'Grupo 1', 5, $j${"entrenamiento:A→B": "Papá dice: «Hoy ponte la camiseta azul, que así me gusta». Luis se la pone. ¿Por qué?"}$j$::jsonb, $j${"A→B": "Porque se lo dice alguien"}$j$::jsonb, $j${"entrenamiento:A→B": ["Porque se lo dice alguien", "Por lo que pasa"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A5', 'A', $j$Papá dice: «Hoy ponte la camiseta azul, que así me gusta». Luis se la pone. ¿Por qué?$j$, null from nueva union all select id, 'B5', 'B', $j$Porque se lo dice alguien$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 6', 'Grupo 1', 6, $j${"entrenamiento:A→B": "Su hermano le dice: «Átate los cordones o te vas a caer». Eva se los ata. ¿Por qué?"}$j$::jsonb, $j${"A→B": "Por lo que pasa"}$j$::jsonb, $j${"entrenamiento:A→B": ["Porque se lo dice alguien", "Por lo que pasa"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A6', 'A', $j$Su hermano le dice: «Átate los cordones o te vas a caer». Eva se los ata. ¿Por qué?$j$, null from nueva union all select id, 'B6', 'B', $j$Por lo que pasa$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 7', 'Grupo 2', 7, $j${"entrenamiento:A→B": "«Si das palmas, te doy la pelota»"}$j$::jsonb, $j${"A→B": "Lo hago"}$j$::jsonb, $j${"entrenamiento:A→B": ["Lo hago", "No lo hago"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A7', 'A', $j$«Si das palmas, te doy la pelota»$j$, null from nueva union all select id, 'B7', 'B', $j$Lo hago$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 8', 'Grupo 2', 8, $j${"entrenamiento:A→B": "«Si das palmas, te doy brócoli»"}$j$::jsonb, $j${"A→B": "No lo hago"}$j$::jsonb, $j${"entrenamiento:A→B": ["Lo hago", "No lo hago"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A8', 'A', $j$«Si das palmas, te doy brócoli»$j$, null from nueva union all select id, 'B8', 'B', $j$No lo hago$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 9', 'Grupo 2', 9, $j${"entrenamiento:A→B": "«Si te tocas la nariz, te doy un trozo de chocolate»"}$j$::jsonb, $j${"A→B": "Lo hago"}$j$::jsonb, $j${"entrenamiento:A→B": ["Lo hago", "No lo hago"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A9', 'A', $j$«Si te tocas la nariz, te doy un trozo de chocolate»$j$, null from nueva union all select id, 'B9', 'B', $j$Lo hago$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 10', 'Grupo 2', 10, $j${"entrenamiento:A→B": "«Si te tocas la nariz, tienes que ordenar los cubiertos»"}$j$::jsonb, $j${"A→B": "No lo hago"}$j$::jsonb, $j${"entrenamiento:A→B": ["Lo hago", "No lo hago"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A10', 'A', $j$«Si te tocas la nariz, tienes que ordenar los cubiertos»$j$, null from nueva union all select id, 'B10', 'B', $j$No lo hago$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 11', 'Grupo 3', 11, $j${"entrenamiento:A→B": "«Si abres la caja roja, encontrarás una pegatina» (la caja tiene pegatina)"}$j$::jsonb, $j${"A→B": "Sigo haciéndolo"}$j$::jsonb, $j${"entrenamiento:A→B": ["Sigo haciéndolo", "Pruebo otra cosa"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A11', 'A', $j$«Si abres la caja roja, encontrarás una pegatina» (la caja tiene pegatina)$j$, null from nueva union all select id, 'B11', 'B', $j$Sigo haciéndolo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 12', 'Grupo 3', 12, $j${"entrenamiento:A→B": "«Si abres la caja roja, encontrarás una pegatina» (la caja ya está vacía, varias veces seguidas)"}$j$::jsonb, $j${"A→B": "Pruebo otra cosa"}$j$::jsonb, $j${"entrenamiento:A→B": ["Sigo haciéndolo", "Pruebo otra cosa"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A12', 'A', $j$«Si abres la caja roja, encontrarás una pegatina» (la caja ya está vacía, varias veces seguidas)$j$, null from nueva union all select id, 'B12', 'B', $j$Pruebo otra cosa$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 13', 'Grupo 3', 13, $j${"entrenamiento:A→B": "«Si aprietas este botón, se enciende la luz» (se enciende)"}$j$::jsonb, $j${"A→B": "Sigo haciéndolo"}$j$::jsonb, $j${"entrenamiento:A→B": ["Sigo haciéndolo", "Pruebo otra cosa"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A13', 'A', $j$«Si aprietas este botón, se enciende la luz» (se enciende)$j$, null from nueva union all select id, 'B13', 'B', $j$Sigo haciéndolo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 14', 'Grupo 3', 14, $j${"entrenamiento:A→B": "«Si aprietas este botón, se enciende la luz» (ya no se enciende)"}$j$::jsonb, $j${"A→B": "Pruebo otra cosa"}$j$::jsonb, $j${"entrenamiento:A→B": ["Sigo haciéndolo", "Pruebo otra cosa"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A14', 'A', $j$«Si aprietas este botón, se enciende la luz» (ya no se enciende)$j$, null from nueva union all select id, 'B14', 'B', $j$Pruebo otra cosa$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 15', 'Grupo 4', 15, $j${"entrenamiento:A→B": "La profe dice: «Si te pones el abrigo, no tendrás frío». ¿Qué haces?"}$j$::jsonb, $j${"A→B": "La sigo"}$j$::jsonb, $j${"entrenamiento:A→B": ["La sigo", "No la sigo"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A15', 'A', $j$La profe dice: «Si te pones el abrigo, no tendrás frío». ¿Qué haces?$j$, null from nueva union all select id, 'B15', 'B', $j$La sigo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 16', 'Grupo 4', 16, $j${"entrenamiento:A→B": "Un desconocido en el parque dice: «Si vienes conmigo, te doy chuches». ¿Qué haces?"}$j$::jsonb, $j${"A→B": "No la sigo"}$j$::jsonb, $j${"entrenamiento:A→B": ["La sigo", "No la sigo"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A16', 'A', $j$Un desconocido en el parque dice: «Si vienes conmigo, te doy chuches». ¿Qué haces?$j$, null from nueva union all select id, 'B16', 'B', $j$No la sigo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 17', 'Grupo 4', 17, $j${"entrenamiento:A→B": "Mamá dice: «Si cruzas cuando el muñeco está verde, no te pasará nada». ¿Qué haces?"}$j$::jsonb, $j${"A→B": "La sigo"}$j$::jsonb, $j${"entrenamiento:A→B": ["La sigo", "No la sigo"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A17', 'A', $j$Mamá dice: «Si cruzas cuando el muñeco está verde, no te pasará nada». ¿Qué haces?$j$, null from nueva union all select id, 'B17', 'B', $j$La sigo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 18', 'Grupo 4', 18, $j${"entrenamiento:A→B": "Un señor que no conoces dice: «Si subes a mi coche, te llevo a casa». ¿Qué haces?"}$j$::jsonb, $j${"A→B": "No la sigo"}$j$::jsonb, $j${"entrenamiento:A→B": ["La sigo", "No la sigo"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A18', 'A', $j$Un señor que no conoces dice: «Si subes a mi coche, te llevo a casa». ¿Qué haces?$j$, null from nueva union all select id, 'B18', 'B', $j$No la sigo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 19', 'Grupo 4', 19, $j${"entrenamiento:A→B": "El médico dice: «Si te tomas la medicina, te pondrás bien». ¿Qué haces?"}$j$::jsonb, $j${"A→B": "La sigo"}$j$::jsonb, $j${"entrenamiento:A→B": ["La sigo", "No la sigo"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A19', 'A', $j$El médico dice: «Si te tomas la medicina, te pondrás bien». ¿Qué haces?$j$, null from nueva union all select id, 'B19', 'B', $j$La sigo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 20', 'Grupo 4', 20, $j${"entrenamiento:A→B": "Alguien que no conoces te escribe en un juego: «Si me dices dónde vives, te mando un regalo». ¿Qué haces?"}$j$::jsonb, $j${"A→B": "No la sigo"}$j$::jsonb, $j${"entrenamiento:A→B": ["La sigo", "No la sigo"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A20', 'A', $j$Alguien que no conoces te escribe en un juego: «Si me dices dónde vives, te mando un regalo». ¿Qué haces?$j$, null from nueva union all select id, 'B20', 'B', $j$No la sigo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 21', 'Grupo 5', 21, $j${"entrenamiento:A→B": "Un compañero dice: «Si estudias, te saldrá mejor el examen». ¿Qué haces?"}$j$::jsonb, $j${"A→B": "La sigo"}$j$::jsonb, $j${"entrenamiento:A→B": ["La sigo", "No la sigo"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A21', 'A', $j$Un compañero dice: «Si estudias, te saldrá mejor el examen». ¿Qué haces?$j$, null from nueva union all select id, 'B21', 'B', $j$La sigo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 22', 'Grupo 5', 22, $j${"entrenamiento:A→B": "Un compañero dice: «Si comes tierra, crecerás más». ¿Qué haces?"}$j$::jsonb, $j${"A→B": "No la sigo"}$j$::jsonb, $j${"entrenamiento:A→B": ["La sigo", "No la sigo"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A22', 'A', $j$Un compañero dice: «Si comes tierra, crecerás más». ¿Qué haces?$j$, null from nueva union all select id, 'B22', 'B', $j$No la sigo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 23', 'Grupo 5', 23, $j${"entrenamiento:A→B": "Un compañero dice: «Si te pones crema, no te quemarás con el sol». ¿Qué haces?"}$j$::jsonb, $j${"A→B": "La sigo"}$j$::jsonb, $j${"entrenamiento:A→B": ["La sigo", "No la sigo"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A23', 'A', $j$Un compañero dice: «Si te pones crema, no te quemarás con el sol». ¿Qué haces?$j$, null from nueva union all select id, 'B23', 'B', $j$La sigo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 24', 'Grupo 5', 24, $j${"entrenamiento:A→B": "Un compañero dice: «Si tocas el enchufe, no pasa nada». ¿Qué haces?"}$j$::jsonb, $j${"A→B": "No la sigo"}$j$::jsonb, $j${"entrenamiento:A→B": ["La sigo", "No la sigo"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A24', 'A', $j$Un compañero dice: «Si tocas el enchufe, no pasa nada». ¿Qué haces?$j$, null from nueva union all select id, 'B24', 'B', $j$No la sigo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 25', 'Grupo 5', 25, $j${"entrenamiento:A→B": "Un compañero dice: «Si corres por el suelo mojado, te resbalarás». ¿Qué haces?"}$j$::jsonb, $j${"A→B": "La sigo"}$j$::jsonb, $j${"entrenamiento:A→B": ["La sigo", "No la sigo"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A25', 'A', $j$Un compañero dice: «Si corres por el suelo mojado, te resbalarás». ¿Qué haces?$j$, null from nueva union all select id, 'B25', 'B', $j$La sigo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias'), 'Clase 26', 'Grupo 5', 26, $j${"entrenamiento:A→B": "Un compañero dice: «Si saltas desde la mesa, volarás». ¿Qué haces?"}$j$::jsonb, $j${"A→B": "No la sigo"}$j$::jsonb, $j${"entrenamiento:A→B": ["La sigo", "No la sigo"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A26', 'A', $j$Un compañero dice: «Si saltas desde la mesa, volarás». ¿Qué haces?$j$, null from nueva union all select id, 'B26', 'B', $j$No la sigo$j$, null from nueva;
update programas_base set objetivo = $t$El alumno distingue si una regla se sigue por quien la da (pliance) o por lo que pasa en el mundo (tracking), la sigue según la consecuencia que describe, deja de seguirla cuando deja de funcionar y no sigue reglas de personas que no son de fiar o que chocan con lo que sabe.$t$, materiales = $t$Cinco grupos con situaciones concretas (A: la situación; B: la respuesta correcta):
1. ¿Por qué la sigue? Pliance o tracking (tableta o mesa).
2. Seguir según la consecuencia: lo que le gusta o no le gusta al alumno (en vivo; cambie los ejemplos por los suyos).
3. Comprobar la regla: la regla funciona y después deja de funcionar sin avisar (en vivo, con una caja con pegatinas y una luz con botón, o similares).
4. ¿Quién da la regla? Personas de confianza frente a desconocidos (tableta o mesa).
5. ¿Tiene sentido la regla? Reglas de un compañero que encajan o chocan con lo que se sabe (tableta o mesa).

Nota: este programa trabaja contenidos emocionales del propio alumno. Conviene que lo aplique un profesional con formación en ACT, con la participación de la familia, y no sustituye una intervención psicológica cuando sea necesaria.$t$, instrucciones_terapeuta = $t$Requisito previo: el alumno ha superado "Seguir Reglas Condicionales" (dominio 3.7) y responde a preguntas "¿Por qué?" (ver "Abstraer Claves Causales" del dominio 3.7).

Por qué se hace así: hay tres formas de seguir reglas (Törneke, Luciano y Valdivia-Salas, 2008). En el pliance se sigue la regla por lo que hará quien la da; es la primera en aparecer y sobre ella se construye el tracking, en el que se sigue porque la regla describe cómo funciona el mundo; el augmenting cambia el valor de las consecuencias (ver «Identificar Valores»). Seguir reglas permite actuar por consecuencias lejanas, pero tiene dos riesgos: seguir una regla cuando ya no funciona (insensibilidad a las contingencias) y hacer siempre lo que se dice para agradar (pliance generalizado). Una regla que se entiende puede no seguirse por cuatro motivos: no se sabe hacer, quien la da no es de fiar, seguirla no trae nada o choca con lo que ya se sabe. Wymer et al. (2016) mostraron que niños con TEA de 4 y 5 años hacían lo que se les decía aunque la consecuencia no les gustara y que, tras entrenar con muchos ejemplos, pasaron a seguir las reglas según la consecuencia.

Cómo enseñar el tracking: mientras el alumno sigue una regla de consecuencia natural, describa lo que va pasando sin añadir premios ("Mira cómo se van quedando limpias las manos") y después pregunte qué hizo, qué pasó y por qué.

Fase 1 - Entrenamiento: plantee la situación de la clase y las dos opciones. Grupos 1, 4 y 5: pregunta y respuesta (tableta o mesa). Grupos 2 y 3: en vivo, con consecuencias de verdad; registre lo que hace el alumno.
- Grupo 2: antes de cada sesión compruebe qué le gusta y qué no ese día, y use esas cosas en las reglas.
- Grupo 3: dé la regla y deje que la compruebe varias veces; después, sin avisar, haga que deje de cumplirse. Tras cada intento pregunte "¿Qué has hecho? ¿Qué ha pasado? ¿Por qué?". Anote en las notas del bloque en cuántos intentos cambia de conducta: seguir sin tener en cuenta lo que pasa es el dato clínico que interesa.

Generalización: reglas reales de casa y del aula, preguntando por qué se siguen y qué pasa si no se cumplen.

Realice el primer bloque sin ayudas. Si el alumno alcanza el criterio, la relación se considera DERIVADA; si se enseña con ayudas, quedará registrada como DOMINADA (no derivada), aunque el último bloque se realice sin ayudas.

Registro en la app (fase · posición origen → destino):
- Entrenamiento: A → B (situación → respuesta)$t$, secuencia_rft = $j$[{"fase": "entrenamiento", "origen": "A", "destino": "B"}]$j$::jsonb, tipo_respuesta = 'opciones', opciones_respuesta = null, respuesta_por_fase = '{}'::jsonb, opciones_clase = false, contenido_actualizado_at = now() where clinica_id is null and nombre = 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias';
commit;
