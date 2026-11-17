-- Vincular Mutuamente Relaciones Condicionales: 8 grupos con opciones de la propia clase en audio
-- (mismo formato que «Vincular Mutuamente Relaciones Temporales»).

begin;

delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales');

with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'), 'Clase 1', 'Grupo 1', '{"entrenamiento:A→B": "Si Pim bebe, Tok baila. ¿Qué hace Tok si Pim bebe?", "test_mutuo:B→A": "Si Pim bebe, Tok baila. ¿Cuándo baila Tok?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A1', 'A', 'Bebe', 'acciones/beber'),
  ('B1', 'B', 'Baila', 'acciones/bailar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'), 'Clase 2', 'Grupo 1', '{"entrenamiento:A→B": "Mo aplaude si Lu recorta. ¿Qué hace Mo si Lu recorta?", "test_mutuo:B→A": "Mo aplaude si Lu recorta. ¿Cuándo aplaude Mo?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A2', 'A', 'Recorta', 'acciones/cortar'),
  ('B2', 'B', 'Aplaude', 'acciones/aplaudir')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'), 'Clase 3', 'Grupo 1', '{"entrenamiento:A→B": "Cuando Kiri corre, Dax monta en bici. ¿Qué hace Dax cuando Kiri corre?", "test_mutuo:B→A": "Cuando Kiri corre, Dax monta en bici. ¿Cuándo monta Dax en bici?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A3', 'A', 'Corre', 'acciones/correr'),
  ('B3', 'B', 'Monta en bici', 'acciones/montar-en-bici')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'), 'Clase 4', 'Grupo 2', '{"entrenamiento:A→B": "Fi abraza cuando Bo salta. ¿Qué hace Fi cuando Bo salta?", "test_mutuo:B→A": "Fi abraza cuando Bo salta. ¿Cuándo abraza Fi?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A4', 'A', 'Salta', 'acciones/saltar'),
  ('B4', 'B', 'Abraza', 'acciones/abrazar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'), 'Clase 5', 'Grupo 2', '{"entrenamiento:A→B": "Si Pim monta en bici, Tok cocina. ¿Qué hace Tok si Pim monta en bici?", "test_mutuo:B→A": "Si Pim monta en bici, Tok cocina. ¿Cuándo cocina Tok?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A5', 'A', 'Monta en bici', 'acciones/montar-en-bici'),
  ('B5', 'B', 'Cocina', 'acciones/cocinar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'), 'Clase 6', 'Grupo 2', '{"entrenamiento:A→B": "Mo sube las escaleras si Lu escribe. ¿Qué hace Mo si Lu escribe?", "test_mutuo:B→A": "Mo sube las escaleras si Lu escribe. ¿Cuándo sube Mo las escaleras?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A6', 'A', 'Escribe', 'acciones/escribir'),
  ('B6', 'B', 'Sube las escaleras', 'acciones/subir-escaleras')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'), 'Clase 7', 'Grupo 3', '{"entrenamiento:A→B": "Cuando Kiri barre, Dax canta. ¿Qué hace Dax cuando Kiri barre?", "test_mutuo:B→A": "Cuando Kiri barre, Dax canta. ¿Cuándo canta Dax?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A7', 'A', 'Barre', 'acciones/barrer'),
  ('B7', 'B', 'Canta', 'acciones/cantar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'), 'Clase 8', 'Grupo 3', '{"entrenamiento:A→B": "Fi aplaude cuando Bo escribe. ¿Qué hace Fi cuando Bo escribe?", "test_mutuo:B→A": "Fi aplaude cuando Bo escribe. ¿Cuándo aplaude Fi?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A8', 'A', 'Escribe', 'acciones/escribir'),
  ('B8', 'B', 'Aplaude', 'acciones/aplaudir')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'), 'Clase 9', 'Grupo 3', '{"entrenamiento:A→B": "Si Pim lee, Tok sopla. ¿Qué hace Tok si Pim lee?", "test_mutuo:B→A": "Si Pim lee, Tok sopla. ¿Cuándo sopla Tok?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A9', 'A', 'Lee', 'acciones/leer'),
  ('B9', 'B', 'Sopla', 'acciones/soplar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'), 'Clase 10', 'Grupo 4', '{"entrenamiento:A→B": "Mo monta en bici si Lu abraza. ¿Qué hace Mo si Lu abraza?", "test_mutuo:B→A": "Mo monta en bici si Lu abraza. ¿Cuándo monta Mo en bici?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A10', 'A', 'Abraza', 'acciones/abrazar'),
  ('B10', 'B', 'Monta en bici', 'acciones/montar-en-bici')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'), 'Clase 11', 'Grupo 4', '{"entrenamiento:A→B": "Cuando Kiri bebe, Dax recorta. ¿Qué hace Dax cuando Kiri bebe?", "test_mutuo:B→A": "Cuando Kiri bebe, Dax recorta. ¿Cuándo recorta Dax?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A11', 'A', 'Bebe', 'acciones/beber'),
  ('B11', 'B', 'Recorta', 'acciones/cortar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'), 'Clase 12', 'Grupo 4', '{"entrenamiento:A→B": "Fi pinta cuando Bo sopla. ¿Qué hace Fi cuando Bo sopla?", "test_mutuo:B→A": "Fi pinta cuando Bo sopla. ¿Cuándo pinta Fi?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A12', 'A', 'Sopla', 'acciones/soplar'),
  ('B12', 'B', 'Pinta', 'acciones/pintar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'), 'Clase 13', 'Grupo 5', '{"entrenamiento:A→B": "Si Pim canta, Tok recorta. ¿Qué hace Tok si Pim canta?", "test_mutuo:B→A": "Si Pim canta, Tok recorta. ¿Cuándo recorta Tok?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A13', 'A', 'Canta', 'acciones/cantar'),
  ('B13', 'B', 'Recorta', 'acciones/cortar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'), 'Clase 14', 'Grupo 5', '{"entrenamiento:A→B": "Mo se peina si Lu lee. ¿Qué hace Mo si Lu lee?", "test_mutuo:B→A": "Mo se peina si Lu lee. ¿Cuándo se peina Mo?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A14', 'A', 'Lee', 'acciones/leer'),
  ('B14', 'B', 'Se peina', 'acciones/peinarse')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'), 'Clase 15', 'Grupo 5', '{"entrenamiento:A→B": "Cuando Kiri baila, Dax escribe. ¿Qué hace Dax cuando Kiri baila?", "test_mutuo:B→A": "Cuando Kiri baila, Dax escribe. ¿Cuándo escribe Dax?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A15', 'A', 'Baila', 'acciones/bailar'),
  ('B15', 'B', 'Escribe', 'acciones/escribir')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'), 'Clase 16', 'Grupo 6', '{"entrenamiento:A→B": "Fi se peina cuando Bo monta en bici. ¿Qué hace Fi cuando Bo monta en bici?", "test_mutuo:B→A": "Fi se peina cuando Bo monta en bici. ¿Cuándo se peina Fi?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A16', 'A', 'Monta en bici', 'acciones/montar-en-bici'),
  ('B16', 'B', 'Se peina', 'acciones/peinarse')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'), 'Clase 17', 'Grupo 6', '{"entrenamiento:A→B": "Si Pim aplaude, Tok juega. ¿Qué hace Tok si Pim aplaude?", "test_mutuo:B→A": "Si Pim aplaude, Tok juega. ¿Cuándo juega Tok?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A17', 'A', 'Aplaude', 'acciones/aplaudir'),
  ('B17', 'B', 'Juega', 'acciones/jugar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'), 'Clase 18', 'Grupo 6', '{"entrenamiento:A→B": "Mo canta si Lu salta. ¿Qué hace Mo si Lu salta?", "test_mutuo:B→A": "Mo canta si Lu salta. ¿Cuándo canta Mo?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A18', 'A', 'Salta', 'acciones/saltar'),
  ('B18', 'B', 'Canta', 'acciones/cantar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'), 'Clase 19', 'Grupo 7', '{"entrenamiento:A→B": "Cuando Kiri cocina, Dax salta. ¿Qué hace Dax cuando Kiri cocina?", "test_mutuo:B→A": "Cuando Kiri cocina, Dax salta. ¿Cuándo salta Dax?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A19', 'A', 'Cocina', 'acciones/cocinar'),
  ('B19', 'B', 'Salta', 'acciones/saltar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'), 'Clase 20', 'Grupo 7', '{"entrenamiento:A→B": "Fi bebe cuando Bo sube las escaleras. ¿Qué hace Fi cuando Bo sube las escaleras?", "test_mutuo:B→A": "Fi bebe cuando Bo sube las escaleras. ¿Cuándo bebe Fi?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A20', 'A', 'Sube las escaleras', 'acciones/subir-escaleras'),
  ('B20', 'B', 'Bebe', 'acciones/beber')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'), 'Clase 21', 'Grupo 7', '{"entrenamiento:A→B": "Si Pim pinta, Tok escribe. ¿Qué hace Tok si Pim pinta?", "test_mutuo:B→A": "Si Pim pinta, Tok escribe. ¿Cuándo escribe Tok?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A21', 'A', 'Pinta', 'acciones/pintar'),
  ('B21', 'B', 'Escribe', 'acciones/escribir')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'), 'Clase 22', 'Grupo 8', '{"entrenamiento:A→B": "Mo cocina si Lu baila. ¿Qué hace Mo si Lu baila?", "test_mutuo:B→A": "Mo cocina si Lu baila. ¿Cuándo cocina Mo?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A22', 'A', 'Baila', 'acciones/bailar'),
  ('B22', 'B', 'Cocina', 'acciones/cocinar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'), 'Clase 23', 'Grupo 8', '{"entrenamiento:A→B": "Cuando Kiri juega, Dax abraza. ¿Qué hace Dax cuando Kiri juega?", "test_mutuo:B→A": "Cuando Kiri juega, Dax abraza. ¿Cuándo abraza Dax?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A23', 'A', 'Juega', 'acciones/jugar'),
  ('B23', 'B', 'Abraza', 'acciones/abrazar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales'), 'Clase 24', 'Grupo 8', '{"entrenamiento:A→B": "Fi lee cuando Bo recorta. ¿Qué hace Fi cuando Bo recorta?", "test_mutuo:B→A": "Fi lee cuando Bo recorta. ¿Cuándo lee Fi?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A24', 'A', 'Recorta', 'acciones/cortar'),
  ('B24', 'B', 'Lee', 'acciones/leer')) x(etiqueta, posicion, nombre, concepto);

-- PROGRAMA
update programas_base set
  opciones_clase = true,
  consignas = null,
  objetivo = 'A partir de una regla condicional enunciada verbalmente ("Si Pim salta, Tok canta"), el alumno deriva la relación inversa ("¿Cuándo canta Tok?" → "Salta") sin apoyo de rutinas conocidas, tanto si la regla se enuncia con «si» como con «cuando» y en cualquier orden.',
  materiales = 'Grupos de 3 (o más) clases con 2 miembros:

A: Condición (lo que hace un personaje inventado)
B: Consecuente (lo que hace otro personaje cuando se da la condición)

Personajes inventados (Pim, Tok, Lu, Mo…) y acciones arbitrarias, sin relación causal ni de rutina entre ellas (no «si corre, bebe»), para que la respuesta no pueda basarse en la experiencia del alumno. Cada pareja de personajes usa acciones distintas en todas sus reglas, para que no haya reglas contradictorias entre grupos. Las imágenes de las acciones sirven al terapeuta; la regla se presenta solo de forma verbal. Las opciones también son verbales: en cada ensayo se dicen, una a una, las dos acciones de la regla y una tercera (distractor) de otra regla del grupo, y el alumno elige una (en la tableta, tocando su tarjeta de audio). La mitad de las reglas se enuncian con «si» y la otra mitad con «cuando», y en la mitad la frase va en orden invertido («Mo aplaude si Lu recorta»), para que la respuesta no dependa de una palabra ni de un lugar de la frase.',
  instrucciones_terapeuta = '
Requisito previo: el alumno ha superado "Abstraer Claves Causales" y "Responder a Preguntas ¿Por qué?" (dominio 3.7), y "Vincular Mutuamente Relaciones Temporales" (dominio 3.5).

Opciones de respuesta: en cada ensayo, diga una a una las dos acciones de la regla y una tercera de otra regla del grupo (ej. «Salta», «Canta», «Barre»), sin «cuando» ni «si»; el alumno elige una. Así no basta con elegir una acción cualquiera: hay que responder a la regla. La mitad de las reglas se enuncian con «si» y la otra mitad con «cuando», y en la mitad la frase va en orden invertido («Tok canta si Pim salta»).

Fase 1 - Entrenamiento directo (condición → consecuente):

1. Enuncie la regla (ej. "Si Pim salta, Tok canta") y pregunte por el consecuente ("¿Qué hace Tok si Pim salta?").
2. Refuerce las respuestas correctas hasta alcanzar el criterio de dominio.

Fase 2 - Test de Vinculación Mutua (consecuente → condición), sin entrenamiento directo:

1. Enuncie la regla y pregunte por la condición a partir del consecuente ("¿Cuándo canta Tok?"; la respuesta es "Salta").
2. No refuerce diferencialmente durante estos ensayos (evite dar pistas de si es correcto o incorrecto), pero registre la respuesta.
3. Si el alumno responde correctamente sin haber sido entrenado en esa dirección, se considera evidencia de vinculación mutua condicional: "si A, entonces B" implica "B ocurre cuando A".
4. Si falla sistemáticamente, entrene también esta dirección de forma directa.

Nota: la pregunta nombra una de las dos acciones y la respuesta es la otra, por lo que un alumno podría acertar eligiendo "la acción de la regla que no se ha nombrado". El control completo de la clave condicional llega en las redes combinatorias; observe si el alumno responde a «si/cuando» o solo por descarte.

Generalización (sondas): condicionales reales (ej. "¿Cuándo usamos el paraguas?" → "Cuando llueve"; "¿Cuándo nos ponemos el abrigo?" → "Cuando hace frío").

Realice el primer bloque de cada test sin ayudas. Si el alumno alcanza el criterio, la relación se considera DERIVADA; si se enseña con ayudas, quedará registrada como DOMINADA (no derivada), aunque el último bloque se realice sin ayudas.

Registro en la app (fase · posición origen → destino; el destino es la respuesta correcta):
- Entrenamiento: A → B ("¿Qué hace Tok si Pim salta?"; la respuesta es el consecuente, B)
- Test de vínculo mutuo: B → A ("¿Cuándo canta Tok?"; la respuesta es la condición, A)
Las sondas con los mismos estímulos en otro contexto o con otra persona se registran con las mismas posiciones, eligiendo "Sonda de generalización" como tipo de bloque una vez dominada la combinación.

Grupos de estímulos: los grupos y clases de este programa son un ejemplo. Cree en el PEI del alumno tantos grupos como considere oportuno, incluido un grupo de generalización con estímulos nuevos. En ese grupo, el primer bloque de entrenamiento realizado sin ayudas y sin reforzar diferencialmente funciona como sonda: si el alumno alcanza el criterio a la primera, hay generalización a estímulos nuevos (anótelo en las notas del bloque). Los tests de ese grupo se habilitan cuando su entrenamiento está dominado. Las sondas con los mismos estímulos en otro contexto o con otra persona se registran como "Sonda de generalización" en el grupo ya dominado.'
where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales';

commit;
