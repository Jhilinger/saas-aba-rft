-- Vincular Mutuamente Relaciones de Comparación: 8 grupos con opciones de la propia clase en audio
-- (mismo formato que «Vincular Mutuamente Relaciones Espaciales»).

begin;

delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación');

with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'), 'Clase 1', 'Grupo 1', '{"entrenamiento:B→A": "Pim es más alto que Tok. ¿Quién es más alto?", "test_mutuo:A→B": "Pim es más alto que Tok. ¿Quién es más bajo?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A1', 'A', 'Pim', null),
  ('B1', 'B', 'Tok', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'), 'Clase 2', 'Grupo 1', '{"entrenamiento:B→A": "Comparado con el tren Tasi, el tren Bori es más largo. ¿Qué tren es más largo?", "test_mutuo:A→B": "Comparado con el tren Tasi, el tren Bori es más largo. ¿Qué tren es más corto?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A2', 'A', 'Bori', null),
  ('B2', 'B', 'Tasi', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'), 'Clase 3', 'Grupo 1', '{"entrenamiento:B→A": "La caja Zup es más ligera que la caja Mil. ¿Qué caja es más ligera?", "test_mutuo:A→B": "La caja Zup es más ligera que la caja Mil. ¿Qué caja es más pesada?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A3', 'A', 'Zup', null),
  ('B3', 'B', 'Mil', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'), 'Clase 4', 'Grupo 2', '{"entrenamiento:B→A": "Comparado con el coche Dax, el coche Lu es más lento. ¿Qué coche es más lento?", "test_mutuo:A→B": "Comparado con el coche Dax, el coche Lu es más lento. ¿Qué coche es más rápido?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A4', 'A', 'Lu', null),
  ('B4', 'B', 'Dax', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'), 'Clase 5', 'Grupo 2', '{"entrenamiento:B→A": "La pelota Nok es más grande que la pelota Fen. ¿Qué pelota es más grande?", "test_mutuo:A→B": "La pelota Nok es más grande que la pelota Fen. ¿Qué pelota es más pequeña?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A5', 'A', 'Nok', null),
  ('B5', 'B', 'Fen', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'), 'Clase 6', 'Grupo 2', '{"entrenamiento:B→A": "Comparado con la torre Sami, la torre Rul es más alta. ¿Qué torre es más alta?", "test_mutuo:A→B": "Comparado con la torre Sami, la torre Rul es más alta. ¿Qué torre es más baja?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A6', 'A', 'Rul', null),
  ('B6', 'B', 'Sami', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'), 'Clase 7', 'Grupo 3', '{"entrenamiento:B→A": "El tren Kiri es más corto que el tren Bo. ¿Qué tren es más corto?", "test_mutuo:A→B": "El tren Kiri es más corto que el tren Bo. ¿Qué tren es más largo?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A7', 'A', 'Kiri', null),
  ('B7', 'B', 'Bo', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'), 'Clase 8', 'Grupo 3', '{"entrenamiento:B→A": "Comparado con la caja Pal, la caja Tiko es más ligera. ¿Qué caja es más ligera?", "test_mutuo:A→B": "Comparado con la caja Pal, la caja Tiko es más ligera. ¿Qué caja es más pesada?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A8', 'A', 'Tiko', null),
  ('B8', 'B', 'Pal', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'), 'Clase 9', 'Grupo 3', '{"entrenamiento:B→A": "El coche Fi es más rápido que el coche Mo. ¿Qué coche es más rápido?", "test_mutuo:A→B": "El coche Fi es más rápido que el coche Mo. ¿Qué coche es más lento?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A9', 'A', 'Fi', null),
  ('B9', 'B', 'Mo', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'), 'Clase 10', 'Grupo 4', '{"entrenamiento:B→A": "Comparado con la pelota Lesu, la pelota Dun es más grande. ¿Qué pelota es más grande?", "test_mutuo:A→B": "Comparado con la pelota Lesu, la pelota Dun es más grande. ¿Qué pelota es más pequeña?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A10', 'A', 'Dun', null),
  ('B10', 'B', 'Lesu', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'), 'Clase 11', 'Grupo 4', '{"entrenamiento:B→A": "La torre Gor es más baja que la torre Bavi. ¿Qué torre es más baja?", "test_mutuo:A→B": "La torre Gor es más baja que la torre Bavi. ¿Qué torre es más alta?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A11', 'A', 'Gor', null),
  ('B11', 'B', 'Bavi', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'), 'Clase 12', 'Grupo 4', '{"entrenamiento:B→A": "Comparado con Rasu, Tin es más bajo. ¿Quién es más bajo?", "test_mutuo:A→B": "Comparado con Rasu, Tin es más bajo. ¿Quién es más alto?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A12', 'A', 'Tin', null),
  ('B12', 'B', 'Rasu', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'), 'Clase 13', 'Grupo 5', '{"entrenamiento:B→A": "La caja Pim es más pesada que la caja Lu. ¿Qué caja es más pesada?", "test_mutuo:A→B": "La caja Pim es más pesada que la caja Lu. ¿Qué caja es más ligera?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A13', 'A', 'Pim', null),
  ('B13', 'B', 'Lu', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'), 'Clase 14', 'Grupo 5', '{"entrenamiento:B→A": "Comparado con el coche Bori, el coche Mil es más rápido. ¿Qué coche es más rápido?", "test_mutuo:A→B": "Comparado con el coche Bori, el coche Mil es más rápido. ¿Qué coche es más lento?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A14', 'A', 'Mil', null),
  ('B14', 'B', 'Bori', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'), 'Clase 15', 'Grupo 5', '{"entrenamiento:B→A": "La pelota Tok es más pequeña que la pelota Zup. ¿Qué pelota es más pequeña?", "test_mutuo:A→B": "La pelota Tok es más pequeña que la pelota Zup. ¿Qué pelota es más grande?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A15', 'A', 'Tok', null),
  ('B15', 'B', 'Zup', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'), 'Clase 16', 'Grupo 6', '{"entrenamiento:B→A": "Comparado con la torre Kiri, la torre Fen es más baja. ¿Qué torre es más baja?", "test_mutuo:A→B": "Comparado con la torre Kiri, la torre Fen es más baja. ¿Qué torre es más alta?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A16', 'A', 'Fen', null),
  ('B16', 'B', 'Kiri', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'), 'Clase 17', 'Grupo 6', '{"entrenamiento:B→A": "Sami es más alto que Nok. ¿Quién es más alto?", "test_mutuo:A→B": "Sami es más alto que Nok. ¿Quién es más bajo?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A17', 'A', 'Sami', null),
  ('B17', 'B', 'Nok', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'), 'Clase 18', 'Grupo 6', '{"entrenamiento:B→A": "Comparado con el tren Rul, el tren Dax es más largo. ¿Qué tren es más largo?", "test_mutuo:A→B": "Comparado con el tren Rul, el tren Dax es más largo. ¿Qué tren es más corto?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A18', 'A', 'Dax', null),
  ('B18', 'B', 'Rul', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'), 'Clase 19', 'Grupo 7', '{"entrenamiento:B→A": "El coche Tasi es más lento que el coche Fi. ¿Qué coche es más lento?", "test_mutuo:A→B": "El coche Tasi es más lento que el coche Fi. ¿Qué coche es más rápido?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A19', 'A', 'Tasi', null),
  ('B19', 'B', 'Fi', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'), 'Clase 20', 'Grupo 7', '{"entrenamiento:B→A": "Comparado con la pelota Mo, la pelota Pal es más pequeña. ¿Qué pelota es más pequeña?", "test_mutuo:A→B": "Comparado con la pelota Mo, la pelota Pal es más pequeña. ¿Qué pelota es más grande?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A20', 'A', 'Pal', null),
  ('B20', 'B', 'Mo', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'), 'Clase 21', 'Grupo 7', '{"entrenamiento:B→A": "La torre Bo es más alta que la torre Tiko. ¿Qué torre es más alta?", "test_mutuo:A→B": "La torre Bo es más alta que la torre Tiko. ¿Qué torre es más baja?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A21', 'A', 'Bo', null),
  ('B21', 'B', 'Tiko', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'), 'Clase 22', 'Grupo 8', '{"entrenamiento:B→A": "Comparado con Gor, Lesu es más alto. ¿Quién es más alto?", "test_mutuo:A→B": "Comparado con Gor, Lesu es más alto. ¿Quién es más bajo?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A22', 'A', 'Lesu', null),
  ('B22', 'B', 'Gor', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'), 'Clase 23', 'Grupo 8', '{"entrenamiento:B→A": "El tren Rasu es más corto que el tren Dun. ¿Qué tren es más corto?", "test_mutuo:A→B": "El tren Rasu es más corto que el tren Dun. ¿Qué tren es más largo?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A23', 'A', 'Rasu', null),
  ('B23', 'B', 'Dun', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación'), 'Clase 24', 'Grupo 8', '{"entrenamiento:B→A": "Comparado con la caja Tin, la caja Bavi es más ligera. ¿Qué caja es más ligera?", "test_mutuo:A→B": "Comparado con la caja Tin, la caja Bavi es más ligera. ¿Qué caja es más pesada?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A24', 'A', 'Bavi', null),
  ('B24', 'B', 'Tin', null)) x(etiqueta, posicion, nombre, concepto);

update programas_base set
  opciones_clase = true,
  consignas = null,
  objetivo = 'A partir de una relación comparativa enunciada verbalmente ("Pim es más alto que Tok"), el alumno deriva la relación inversa ("¿Quién es más bajo?" → Tok) sin apoyo de propiedades físicas, partiendo de cualquiera de los dos polos de la dimensión.',
  materiales = 'Grupos de 3 (o más) clases con 2 miembros:

A: Personaje u objeto inventado por el que se pregunta en el entrenamiento (el que tiene «más» de lo que dice la frase)
B: El otro personaje u objeto de la relación

Nombres inventados (Pim, Tok, el tren Bori…), sin imágenes, de forma que ninguna propiedad física ni conocida indique la relación. La relación se presenta solo de forma verbal. Las opciones también son verbales: en cada ensayo se dicen, una a una, los dos nombres de la relación y un tercero (distractor) de otra relación del grupo, y el alumno elige uno (en la tableta, tocando su tarjeta de audio). En la mitad de las clases la frase enuncia un polo de la dimensión («más alto») y en la otra mitad el contrario («más bajo»), y en la mitad la frase va en orden invertido («Comparado con Tok, Pim es más alto»), para que la respuesta no dependa de una palabra ni de un lugar de la frase.',
  instrucciones_terapeuta = '
Requisito previo: el alumno ha superado "Abstraer Claves de Comparación" (dominio 3.3) y conoce los dos polos de cada dimensión como opuestos (ver "Vincular Mutuamente Opuestos" del dominio 3.2).

Opciones de respuesta: en cada ensayo, diga uno a uno los dos nombres de la relación y un tercero de otra relación del grupo (ej. «Pim», «Tok», «Bori»); el alumno elige uno. Así no basta con elegir el nombre que se ha oído: hay que responder a la clave comparativa. La mitad de las clases enuncian un polo de la dimensión («más alto») y la otra mitad el contrario («más bajo»), y en la mitad la frase va en orden invertido («Comparado con Tok, Pim es más alto»).

Fase 1 - Entrenamiento directo (pregunta en el sentido enunciado):

1. Enuncie la relación (ej. "Pim es más alto que Tok") y pregunte en el mismo sentido ("¿Quién es más alto?").
2. Refuerce las respuestas correctas hasta alcanzar el criterio de dominio.

Fase 2 - Test de Vinculación Mutua (pregunta en el sentido inverso), sin entrenamiento directo:

1. Enuncie la relación y pregunte en el sentido inverso ("¿Quién es más bajo?").
2. No refuerce diferencialmente durante estos ensayos (evite dar pistas de si es correcto o incorrecto), pero registre la respuesta.
3. Si el alumno responde correctamente sin haber sido entrenado en esa dirección, se considera evidencia de vinculación mutua comparativa: "más alto que" implica "más bajo que".
4. Si falla sistemáticamente, entrene también esta dirección de forma directa.

Generalización (sondas): relaciones con personas u objetos reales que el alumno no pueda comparar a simple vista (ej. "Mi coche es más rápido que el de mi hermano. ¿Cuál es más lento?").

Realice el primer bloque de cada test sin ayudas. Si el alumno alcanza el criterio, la relación se considera DERIVADA; si se enseña con ayudas, quedará registrada como DOMINADA (no derivada), aunque el último bloque se realice sin ayudas.

Registro en la app (fase · posición origen → destino; el destino es la respuesta correcta):
- Entrenamiento: B → A ("¿Quién es más alto?"; la respuesta es A)
- Test de vínculo mutuo: A → B ("¿Quién es más bajo?"; la respuesta es B)
Las sondas con los mismos estímulos en otro contexto o con otra persona se registran con las mismas posiciones, eligiendo "Sonda de generalización" como tipo de bloque una vez dominada la combinación.

Grupos de estímulos: los grupos y clases de este programa son un ejemplo. Cree en el PEI del alumno tantos grupos como considere oportuno, incluido un grupo de generalización con estímulos nuevos. En ese grupo, el primer bloque de entrenamiento realizado sin ayudas y sin reforzar diferencialmente funciona como sonda: si el alumno alcanza el criterio a la primera, hay generalización a estímulos nuevos (anótelo en las notas del bloque). Los tests de ese grupo se habilitan cuando su entrenamiento está dominado. Las sondas con los mismos estímulos en otro contexto o con otra persona se registran como "Sonda de generalización" en el grupo ya dominado.'
where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación';

commit;
