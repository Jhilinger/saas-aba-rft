-- Vincular Mutuamente Relaciones Temporales: 8 grupos con opciones de la propia clase en audio
-- (mismo formato que «Vincular Mutuamente Relaciones Espaciales»).

begin;

delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales');

with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'), 'Clase 1', 'Grupo 1', '{"entrenamiento:B→A": "Pim salta antes de cantar. ¿Qué hace Pim antes de cantar?", "test_mutuo:A→B": "Pim salta antes de cantar. ¿Qué hace Pim después de saltar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A1', 'A', 'Salta', 'acciones/saltar'),
  ('B1', 'B', 'Canta', 'acciones/cantar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'), 'Clase 2', 'Grupo 1', '{"entrenamiento:B→A": "Antes de bailar, Tok pinta. ¿Qué hace Tok antes de bailar?", "test_mutuo:A→B": "Antes de bailar, Tok pinta. ¿Qué hace Tok después de pintar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A2', 'A', 'Pinta', 'acciones/pintar'),
  ('B2', 'B', 'Baila', 'acciones/bailar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'), 'Clase 3', 'Grupo 1', '{"entrenamiento:B→A": "Lu corre después de aplaudir. ¿Qué hace Lu después de aplaudir?", "test_mutuo:A→B": "Lu corre después de aplaudir. ¿Qué hace Lu antes de correr?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A3', 'A', 'Corre', 'acciones/correr'),
  ('B3', 'B', 'Aplaude', 'acciones/aplaudir')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'), 'Clase 4', 'Grupo 2', '{"entrenamiento:B→A": "Después de leer, Mo recorta. ¿Qué hace Mo después de leer?", "test_mutuo:A→B": "Después de leer, Mo recorta. ¿Qué hace Mo antes de recortar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A4', 'A', 'Recorta', 'acciones/cortar'),
  ('B4', 'B', 'Lee', 'acciones/leer')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'), 'Clase 5', 'Grupo 2', '{"entrenamiento:B→A": "Kiri sopla antes de barrer. ¿Qué hace Kiri antes de barrer?", "test_mutuo:A→B": "Kiri sopla antes de barrer. ¿Qué hace Kiri después de soplar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A5', 'A', 'Sopla', 'acciones/soplar'),
  ('B5', 'B', 'Barre', 'acciones/barrer')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'), 'Clase 6', 'Grupo 2', '{"entrenamiento:B→A": "Antes de jugar, Dax abraza. ¿Qué hace Dax antes de jugar?", "test_mutuo:A→B": "Antes de jugar, Dax abraza. ¿Qué hace Dax después de abrazar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A6', 'A', 'Abraza', 'acciones/abrazar'),
  ('B6', 'B', 'Juega', 'acciones/jugar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'), 'Clase 7', 'Grupo 3', '{"entrenamiento:B→A": "Bo monta en bici después de beber. ¿Qué hace Bo después de beber?", "test_mutuo:A→B": "Bo monta en bici después de beber. ¿Qué hace Bo antes de montar en bici?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A7', 'A', 'Monta en bici', 'acciones/montar-en-bici'),
  ('B7', 'B', 'Bebe', 'acciones/beber')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'), 'Clase 8', 'Grupo 3', '{"entrenamiento:B→A": "Después de subir las escaleras, Fi aplaude. ¿Qué hace Fi después de subir las escaleras?", "test_mutuo:A→B": "Después de subir las escaleras, Fi aplaude. ¿Qué hace Fi antes de aplaudir?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A8', 'A', 'Aplaude', 'acciones/aplaudir'),
  ('B8', 'B', 'Sube las escaleras', 'acciones/subir-escaleras')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'), 'Clase 9', 'Grupo 3', '{"entrenamiento:B→A": "Pim cocina antes de escribir. ¿Qué hace Pim antes de escribir?", "test_mutuo:A→B": "Pim cocina antes de escribir. ¿Qué hace Pim después de cocinar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A9', 'A', 'Cocina', 'acciones/cocinar'),
  ('B9', 'B', 'Escribe', 'acciones/escribir')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'), 'Clase 10', 'Grupo 4', '{"entrenamiento:B→A": "Antes de saltar, Tok se peina. ¿Qué hace Tok antes de saltar?", "test_mutuo:A→B": "Antes de saltar, Tok se peina. ¿Qué hace Tok después de peinarse?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A10', 'A', 'Se peina', 'acciones/peinarse'),
  ('B10', 'B', 'Salta', 'acciones/saltar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'), 'Clase 11', 'Grupo 4', '{"entrenamiento:B→A": "Lu bebe después de recortar. ¿Qué hace Lu después de recortar?", "test_mutuo:A→B": "Lu bebe después de recortar. ¿Qué hace Lu antes de beber?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A11', 'A', 'Bebe', 'acciones/beber'),
  ('B11', 'B', 'Recorta', 'acciones/cortar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'), 'Clase 12', 'Grupo 4', '{"entrenamiento:B→A": "Después de cantar, Mo lee. ¿Qué hace Mo después de cantar?", "test_mutuo:A→B": "Después de cantar, Mo lee. ¿Qué hace Mo antes de leer?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A12', 'A', 'Lee', 'acciones/leer'),
  ('B12', 'B', 'Canta', 'acciones/cantar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'), 'Clase 13', 'Grupo 5', '{"entrenamiento:B→A": "Kiri baila antes de abrazar. ¿Qué hace Kiri antes de abrazar?", "test_mutuo:A→B": "Kiri baila antes de abrazar. ¿Qué hace Kiri después de bailar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A13', 'A', 'Baila', 'acciones/bailar'),
  ('B13', 'B', 'Abraza', 'acciones/abrazar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'), 'Clase 14', 'Grupo 5', '{"entrenamiento:B→A": "Antes de pintar, Dax corre. ¿Qué hace Dax antes de pintar?", "test_mutuo:A→B": "Antes de pintar, Dax corre. ¿Qué hace Dax después de correr?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A14', 'A', 'Corre', 'acciones/correr'),
  ('B14', 'B', 'Pinta', 'acciones/pintar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'), 'Clase 15', 'Grupo 5', '{"entrenamiento:B→A": "Bo aplaude después de jugar. ¿Qué hace Bo después de jugar?", "test_mutuo:A→B": "Bo aplaude después de jugar. ¿Qué hace Bo antes de aplaudir?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A15', 'A', 'Aplaude', 'acciones/aplaudir'),
  ('B15', 'B', 'Juega', 'acciones/jugar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'), 'Clase 16', 'Grupo 6', '{"entrenamiento:B→A": "Después de escribir, Fi monta en bici. ¿Qué hace Fi después de escribir?", "test_mutuo:A→B": "Después de escribir, Fi monta en bici. ¿Qué hace Fi antes de montar en bici?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A16', 'A', 'Monta en bici', 'acciones/montar-en-bici'),
  ('B16', 'B', 'Escribe', 'acciones/escribir')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'), 'Clase 17', 'Grupo 6', '{"entrenamiento:B→A": "Pim sopla antes de subir las escaleras. ¿Qué hace Pim antes de subir las escaleras?", "test_mutuo:A→B": "Pim sopla antes de subir las escaleras. ¿Qué hace Pim después de soplar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A17', 'A', 'Sopla', 'acciones/soplar'),
  ('B17', 'B', 'Sube las escaleras', 'acciones/subir-escaleras')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'), 'Clase 18', 'Grupo 6', '{"entrenamiento:B→A": "Antes de beber, Tok lee. ¿Qué hace Tok antes de beber?", "test_mutuo:A→B": "Antes de beber, Tok lee. ¿Qué hace Tok después de leer?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A18', 'A', 'Lee', 'acciones/leer'),
  ('B18', 'B', 'Bebe', 'acciones/beber')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'), 'Clase 19', 'Grupo 7', '{"entrenamiento:B→A": "Lu se peina después de saltar. ¿Qué hace Lu después de saltar?", "test_mutuo:A→B": "Lu se peina después de saltar. ¿Qué hace Lu antes de peinarse?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A19', 'A', 'Se peina', 'acciones/peinarse'),
  ('B19', 'B', 'Salta', 'acciones/saltar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'), 'Clase 20', 'Grupo 7', '{"entrenamiento:B→A": "Después de aplaudir, Mo recorta. ¿Qué hace Mo después de aplaudir?", "test_mutuo:A→B": "Después de aplaudir, Mo recorta. ¿Qué hace Mo antes de recortar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A20', 'A', 'Recorta', 'acciones/cortar'),
  ('B20', 'B', 'Aplaude', 'acciones/aplaudir')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'), 'Clase 21', 'Grupo 7', '{"entrenamiento:B→A": "Kiri canta antes de barrer. ¿Qué hace Kiri antes de barrer?", "test_mutuo:A→B": "Kiri canta antes de barrer. ¿Qué hace Kiri después de cantar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A21', 'A', 'Canta', 'acciones/cantar'),
  ('B21', 'B', 'Barre', 'acciones/barrer')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'), 'Clase 22', 'Grupo 8', '{"entrenamiento:B→A": "Antes de escribir, Dax abraza. ¿Qué hace Dax antes de escribir?", "test_mutuo:A→B": "Antes de escribir, Dax abraza. ¿Qué hace Dax después de abrazar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A22', 'A', 'Abraza', 'acciones/abrazar'),
  ('B22', 'B', 'Escribe', 'acciones/escribir')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'), 'Clase 23', 'Grupo 8', '{"entrenamiento:B→A": "Bo barre después de pintar. ¿Qué hace Bo después de pintar?", "test_mutuo:A→B": "Bo barre después de pintar. ¿Qué hace Bo antes de barrer?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A23', 'A', 'Barre', 'acciones/barrer'),
  ('B23', 'B', 'Pinta', 'acciones/pintar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales'), 'Clase 24', 'Grupo 8', '{"entrenamiento:B→A": "Después de jugar, Fi cocina. ¿Qué hace Fi después de jugar?", "test_mutuo:A→B": "Después de jugar, Fi cocina. ¿Qué hace Fi antes de cocinar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A24', 'A', 'Cocina', 'acciones/cocinar'),
  ('B24', 'B', 'Juega', 'acciones/jugar')) x(etiqueta, posicion, nombre, concepto);

update programas_base set
  opciones_clase = true,
  consignas = null,
  objetivo = 'A partir de una relación temporal enunciada ("Pim salta antes de cantar"), el alumno deriva la relación inversa ("¿Qué hace Pim después de saltar?" → "Canta"), tanto de «antes» a «después» como de «después» a «antes».',
  materiales = 'Grupos de 3 (o más) clases con 2 miembros:

A: Acción por la que se pregunta en el entrenamiento (la que va antes si la relación se enuncia con «antes»; la que va después si se enuncia con «después»)
B: La otra acción de la relación

Personajes inventados (Pim, Tok, Lu…) y pares de acciones sin un orden habitual, para que la respuesta no pueda salir de la experiencia del alumno. La relación se presenta solo de forma verbal. Las opciones también son verbales: en cada ensayo se dicen, una a una, las dos acciones nombradas y una tercera (distractor) de otra relación del grupo, y el alumno elige una (en la tableta, tocando su tarjeta de audio). En la mitad de las clases la relación se enuncia con «antes» y en la otra mitad con «después», y en la mitad la frase va en orden invertido («Antes de cantar, Pim salta»), para que la respuesta no sea siempre la misma palabra temporal ni el mismo lugar de la frase.',
  instrucciones_terapeuta = '
Requisito previo: el alumno ha superado "Abstraer Claves Temporales" (dominio 3.5).

Opciones de respuesta: en cada ensayo, diga una a una las dos acciones nombradas y una tercera de otra relación del grupo (ej. «salta», «canta», «pinta»); el alumno elige una. Así no basta con elegir la acción que se ha oído en la pregunta: hay que responder a la clave temporal. La mitad de las clases se enuncian con «antes» y la otra mitad con «después», y en la mitad la frase va en orden invertido («Antes de cantar, Pim salta»).

Fase 1 - Entrenamiento directo (pregunta en el sentido enunciado):

1. Enuncie la relación (ej. "Pim salta antes de cantar") y pregunte en el mismo sentido ("¿Qué hace Pim antes de cantar?").
2. Refuerce las respuestas correctas hasta alcanzar el criterio de dominio.

Fase 2 - Test de Vinculación Mutua (pregunta en el sentido inverso), sin entrenamiento directo:

1. Enuncie la relación y pregunte en el sentido inverso ("¿Qué hace Pim después de saltar?"; si se enunció con «después», "¿Qué hace Lu antes de bailar?").
2. No refuerce diferencialmente durante estos ensayos (evite dar pistas de si es correcto o incorrecto), pero registre la respuesta.
3. Si el alumno responde correctamente sin haber sido entrenado en esa dirección, se considera evidencia de vinculación mutua temporal: "antes" implica "después", y "después" implica "antes".
4. Si falla sistemáticamente, entrene también esta dirección de forma directa.

Generalización (sondas): rutinas reales del alumno (ej. "¿Cuándo te lavas las manos?" → "Antes de comer"; "¿Qué haces después de cenar?").

Realice el primer bloque de cada test sin ayudas. Si el alumno alcanza el criterio, la relación se considera DERIVADA; si se enseña con ayudas, quedará registrada como DOMINADA (no derivada), aunque el último bloque se realice sin ayudas.

Registro en la app (fase · posición origen → destino; el destino es la respuesta correcta):
- Entrenamiento: B → A ("¿Qué hace Pim antes de cantar?"; la respuesta es A)
- Test de vínculo mutuo: A → B ("¿Qué hace Pim después de saltar?"; la respuesta es B)
Las sondas con los mismos estímulos en otro contexto o con otra persona se registran con las mismas posiciones, eligiendo "Sonda de generalización" como tipo de bloque una vez dominada la combinación.

Grupos de estímulos: los grupos y clases de este programa son un ejemplo. Cree en el PEI del alumno tantos grupos como considere oportuno, incluido un grupo de generalización con estímulos nuevos. En ese grupo, el primer bloque de entrenamiento realizado sin ayudas y sin reforzar diferencialmente funciona como sonda: si el alumno alcanza el criterio a la primera, hay generalización a estímulos nuevos (anótelo en las notas del bloque). Los tests de ese grupo se habilitan cuando su entrenamiento está dominado. Las sondas con los mismos estímulos en otro contexto o con otra persona se registran como "Sonda de generalización" en el grupo ya dominado.'
where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales';

commit;
