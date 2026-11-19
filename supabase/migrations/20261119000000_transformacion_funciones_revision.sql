-- Dominio 2.4 (Transformación de Funciones Básicas), tras revisar la investigación:
-- Discriminativas: la transformación es de ejecución (Barnes et al., 1995), no de selección.
-- Apetitivas: claves «Toca el igual» y un distractor no entrenado por grupo (control de
--   preferencia por lo conocido); el distractor solo aparece en el test de transformación.
-- Objetos Conocidos: ejemplos de las instrucciones iguales a los estímulos reales.
-- Emocionales: preguntas de situación en los grupos 2, 4 y 7 y prueba de preferencia
--   (medida evaluativa; Valdivia-Salas, Dougher y Luciano, 2013; Perez et al., 2018).
-- Redes (5): sonda de seguimiento de la transformación (distancia nodal; Rehfeldt y Dymond, 2005).

begin;

update programas_base set respuesta_por_fase = '{"transformacion_funciones": {"tipo": "ejecucion", "opciones": []}}'::jsonb
where clinica_id is null and nombre in ('Transferir Funciones Discriminativas a Estímulos Arbitrarios', 'Transferir Funciones Discriminativas a Estímulos Arbitrarios en Redes Combinatorias');

update programas_base set consignas = (select consignas from programas_base where clinica_id is null and nombre = 'Transferir Funciones de Evitación a Estímulos Arbitrarios')
where clinica_id is null and nombre = 'Transferir Funciones Apetitivas a Estímulos Arbitrarios';
update programas_base set consignas = (select consignas from programas_base where clinica_id is null and nombre = 'Transferir Funciones de Evitación a Estímulos Arbitrarios en Redes Combinatorias')
where clinica_id is null and nombre = 'Transferir Funciones Apetitivas a Estímulos Arbitrarios en Redes Combinatorias';

with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Apetitivas a Estímulos Arbitrarios'), 'Distractor', 'Grupo 1', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, 'X1', 'B', 'Figura 1.X', null, '{"c": 3, "s": "rft-tfaaea-g1-x", "v": 1, "fig": "abstracta"}'::jsonb from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Apetitivas a Estímulos Arbitrarios'), 'Distractor', 'Grupo 2', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, 'X2', 'B', 'MERP', null, '{"t": "MERP"}'::jsonb from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Apetitivas a Estímulos Arbitrarios'), 'Distractor', 'Grupo 3', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, 'X3', 'B', 'Figura 3.X', null, '{"c": 9, "s": "rft-tfaaea-g3-x", "v": 1, "fig": "abstracta"}'::jsonb from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Apetitivas a Estímulos Arbitrarios'), 'Distractor', 'Grupo 4', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, 'X4', 'B', 'Figura 4.X', null, '{"c": 2, "s": "rft-tfaaea-g4-x", "v": 1, "fig": "abstracta"}'::jsonb from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Apetitivas a Estímulos Arbitrarios'), 'Distractor', 'Grupo 5', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, 'X5', 'B', 'Figura 5.X', null, '{"c": 5, "s": "rft-tfaaea-g5-x", "v": 1, "fig": "abstracta"}'::jsonb from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Apetitivas a Estímulos Arbitrarios'), 'Distractor', 'Grupo 6', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, 'X6', 'B', 'Figura 6.X', null, '{"c": 8, "s": "rft-tfaaea-g6-x", "v": 1, "fig": "abstracta"}'::jsonb from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Apetitivas a Estímulos Arbitrarios'), 'Distractor', 'Grupo 7', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, 'X7', 'B', 'Figura 7.X', null, '{"c": 1, "s": "rft-tfaaea-g7-x", "v": 1, "fig": "abstracta"}'::jsonb from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Apetitivas a Estímulos Arbitrarios'), 'Distractor', 'Grupo 8', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, 'X8', 'B', 'Figura 8.X', null, '{"c": 4, "s": "rft-tfaaea-g8-x", "v": 1, "fig": "abstracta"}'::jsonb from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Apetitivas a Estímulos Arbitrarios en Redes Combinatorias'), 'Distractor', 'Grupo 1', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, 'X1', 'C', 'TAPU', null, '{"t": "TAPU"}'::jsonb from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Apetitivas a Estímulos Arbitrarios en Redes Combinatorias'), 'Distractor', 'Grupo 2', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, 'X2', 'C', 'Figura 2.X', null, '{"c": 9, "s": "rft-tfaaeaerc-g2-x", "v": 1, "fig": "abstracta"}'::jsonb from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Apetitivas a Estímulos Arbitrarios en Redes Combinatorias'), 'Distractor', 'Grupo 3', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, 'X3', 'C', 'NIBE', null, '{"t": "NIBE"}'::jsonb from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Apetitivas a Estímulos Arbitrarios en Redes Combinatorias'), 'Distractor', 'Grupo 4', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, 'X4', 'C', 'ROMU', null, '{"t": "ROMU"}'::jsonb from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Apetitivas a Estímulos Arbitrarios en Redes Combinatorias'), 'Distractor', 'Grupo 5', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, 'X5', 'C', 'BELU', null, '{"t": "BELU"}'::jsonb from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Apetitivas a Estímulos Arbitrarios en Redes Combinatorias'), 'Distractor', 'Grupo 6', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, 'X6', 'C', 'DAVO', null, '{"t": "DAVO"}'::jsonb from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Apetitivas a Estímulos Arbitrarios en Redes Combinatorias'), 'Distractor', 'Grupo 7', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, 'X7', 'C', 'PIRE', null, '{"t": "PIRE"}'::jsonb from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Apetitivas a Estímulos Arbitrarios en Redes Combinatorias'), 'Distractor', 'Grupo 8', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, 'X8', 'C', 'GOBA', null, '{"t": "GOBA"}'::jsonb from nueva;

update programas_base set
  instrucciones_terapeuta = regexp_replace(instrucciones_terapeuta,
    '(Se considera correcta la elección del estímulo ([BC]) vinculado al estímulo A por el que se pregunta\.)',
    '\1 En la app, el distractor de cada grupo es la clase «Distractor»: solo aparece como opción en el test de transformación y nunca se entrena ni se relaciona con A.'),
  materiales = materiales || E'\n\nEn la app, cada grupo incluye su distractor como clase «Distractor» (un solo estímulo, del mismo tipo que los de su posición).'
where clinica_id is null and nombre in ('Transferir Funciones Apetitivas a Estímulos Arbitrarios', 'Transferir Funciones Apetitivas a Estímulos Arbitrarios en Redes Combinatorias');

update programas_base set instrucciones_terapeuta = replace(instrucciones_terapeuta, '(coche → #)', '(coche → Figura 1.1)') where clinica_id is null and nombre in ('Transferir Funciones de Objetos Conocidos a Estímulos Arbitrarios', 'Transferir Funciones de Objetos Conocidos a Estímulos Arbitrarios en Redes Combinatorias');
update programas_base set instrucciones_terapeuta = replace(instrucciones_terapeuta, '(pelota → ¬)', '(pelota → Figura 1.2)') where clinica_id is null and nombre in ('Transferir Funciones de Objetos Conocidos a Estímulos Arbitrarios', 'Transferir Funciones de Objetos Conocidos a Estímulos Arbitrarios en Redes Combinatorias');
update programas_base set instrucciones_terapeuta = replace(instrucciones_terapeuta, '(cama → Ω)', '(cama → Figura 3.1)') where clinica_id is null and nombre in ('Transferir Funciones de Objetos Conocidos a Estímulos Arbitrarios', 'Transferir Funciones de Objetos Conocidos a Estímulos Arbitrarios en Redes Combinatorias');
update programas_base set instrucciones_terapeuta = replace(instrucciones_terapeuta, '(tijeras → Ж)', '(tijeras → Figura 3.2)') where clinica_id is null and nombre in ('Transferir Funciones de Objetos Conocidos a Estímulos Arbitrarios', 'Transferir Funciones de Objetos Conocidos a Estímulos Arbitrarios en Redes Combinatorias');
update programas_base set instrucciones_terapeuta = replace(instrucciones_terapeuta, '(pez → ネ)', '(pez → Figura 3.3)') where clinica_id is null and nombre in ('Transferir Funciones de Objetos Conocidos a Estímulos Arbitrarios', 'Transferir Funciones de Objetos Conocidos a Estímulos Arbitrarios en Redes Combinatorias');
update programas_base set instrucciones_terapeuta = replace(instrucciones_terapeuta, '(gato → Ξ)', '(gato → Figura 2.1)') where clinica_id is null and nombre in ('Transferir Funciones de Objetos Conocidos a Estímulos Arbitrarios', 'Transferir Funciones de Objetos Conocidos a Estímulos Arbitrarios en Redes Combinatorias');
update programas_base set instrucciones_terapeuta = replace(instrucciones_terapeuta, '(vaso → Љ)', '(vaso → Figura 2.2)') where clinica_id is null and nombre in ('Transferir Funciones de Objetos Conocidos a Estímulos Arbitrarios', 'Transferir Funciones de Objetos Conocidos a Estímulos Arbitrarios en Redes Combinatorias');
update programas_base set instrucciones_terapeuta = replace(instrucciones_terapeuta, '(cuchara → Ћ)', '(cuchara → Figura 2.3)') where clinica_id is null and nombre in ('Transferir Funciones de Objetos Conocidos a Estímulos Arbitrarios', 'Transferir Funciones de Objetos Conocidos a Estímulos Arbitrarios en Redes Combinatorias');
update clases_rft_base c set consignas = jsonb_set(coalesce(c.consignas,'{}'::jsonb), '{transformacion_funciones:A→B}', to_jsonb('Señala cómo se siente un niño en su cumpleaños'::text))
where c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Emocionales a Estímulos Arbitrarios') and c.grupo in ('Grupo 2','Grupo 4','Grupo 7')
  and exists (select 1 from estimulos_rft_base e where e.clase_base_id = c.id and e.posicion = 'A' and e.nombre ilike '%contenta%');
update clases_rft_base c set consignas = jsonb_set(coalesce(c.consignas,'{}'::jsonb), '{transformacion_funciones:A→B}', to_jsonb('Señala cómo se siente un niño al que se le rompe su juguete favorito'::text))
where c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Emocionales a Estímulos Arbitrarios') and c.grupo in ('Grupo 2','Grupo 4','Grupo 7')
  and exists (select 1 from estimulos_rft_base e where e.clase_base_id = c.id and e.posicion = 'A' and e.nombre ilike '%triste%');
update clases_rft_base c set consignas = jsonb_set(coalesce(c.consignas,'{}'::jsonb), '{transformacion_funciones:A→B}', to_jsonb('Señala cómo se siente un niño al que le quitan el juguete sin pedírselo'::text))
where c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Emocionales a Estímulos Arbitrarios') and c.grupo in ('Grupo 2','Grupo 4','Grupo 7')
  and exists (select 1 from estimulos_rft_base e where e.clase_base_id = c.id and e.posicion = 'A' and e.nombre ilike '%enfadada%');
update clases_rft_base c set consignas = jsonb_set(coalesce(c.consignas,'{}'::jsonb), '{transformacion_funciones:A→B}', to_jsonb('Señala cómo se siente un niño que oye un trueno muy fuerte por la noche'::text))
where c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Emocionales a Estímulos Arbitrarios') and c.grupo in ('Grupo 2','Grupo 4','Grupo 7')
  and exists (select 1 from estimulos_rft_base e where e.clase_base_id = c.id and e.posicion = 'A' and e.nombre ilike '%asustada%');
update clases_rft_base c set consignas = jsonb_set(coalesce(c.consignas,'{}'::jsonb), '{transformacion_funciones:A→B}', to_jsonb('Señala cómo se siente un niño que abre una caja y le sale un payaso'::text))
where c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Emocionales a Estímulos Arbitrarios') and c.grupo in ('Grupo 2','Grupo 4','Grupo 7')
  and exists (select 1 from estimulos_rft_base e where e.clase_base_id = c.id and e.posicion = 'A' and e.nombre ilike '%sorprendida%');
update clases_rft_base c set consignas = jsonb_set(coalesce(c.consignas,'{}'::jsonb), '{transformacion_funciones:A→B}', to_jsonb('Señala cómo se siente un niño que encuentra un gusano en su manzana'::text))
where c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Emocionales a Estímulos Arbitrarios') and c.grupo in ('Grupo 2','Grupo 4','Grupo 7')
  and exists (select 1 from estimulos_rft_base e where e.clase_base_id = c.id and e.posicion = 'A' and e.nombre ilike '%asco%');
update clases_rft_base c set consignas = jsonb_set(coalesce(c.consignas,'{}'::jsonb), '{transformacion_funciones:A→C}', to_jsonb('Señala cómo se siente un niño en su cumpleaños'::text))
where c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Emocionales a Estímulos Arbitrarios en Redes Combinatorias') and c.grupo in ('Grupo 2','Grupo 4','Grupo 7')
  and exists (select 1 from estimulos_rft_base e where e.clase_base_id = c.id and e.posicion = 'A' and e.nombre ilike '%contenta%');
update clases_rft_base c set consignas = jsonb_set(coalesce(c.consignas,'{}'::jsonb), '{transformacion_funciones:A→C}', to_jsonb('Señala cómo se siente un niño al que se le rompe su juguete favorito'::text))
where c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Emocionales a Estímulos Arbitrarios en Redes Combinatorias') and c.grupo in ('Grupo 2','Grupo 4','Grupo 7')
  and exists (select 1 from estimulos_rft_base e where e.clase_base_id = c.id and e.posicion = 'A' and e.nombre ilike '%triste%');
update clases_rft_base c set consignas = jsonb_set(coalesce(c.consignas,'{}'::jsonb), '{transformacion_funciones:A→C}', to_jsonb('Señala cómo se siente un niño al que le quitan el juguete sin pedírselo'::text))
where c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Emocionales a Estímulos Arbitrarios en Redes Combinatorias') and c.grupo in ('Grupo 2','Grupo 4','Grupo 7')
  and exists (select 1 from estimulos_rft_base e where e.clase_base_id = c.id and e.posicion = 'A' and e.nombre ilike '%enfadada%');
update clases_rft_base c set consignas = jsonb_set(coalesce(c.consignas,'{}'::jsonb), '{transformacion_funciones:A→C}', to_jsonb('Señala cómo se siente un niño que oye un trueno muy fuerte por la noche'::text))
where c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Emocionales a Estímulos Arbitrarios en Redes Combinatorias') and c.grupo in ('Grupo 2','Grupo 4','Grupo 7')
  and exists (select 1 from estimulos_rft_base e where e.clase_base_id = c.id and e.posicion = 'A' and e.nombre ilike '%asustada%');
update clases_rft_base c set consignas = jsonb_set(coalesce(c.consignas,'{}'::jsonb), '{transformacion_funciones:A→C}', to_jsonb('Señala cómo se siente un niño que abre una caja y le sale un payaso'::text))
where c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Emocionales a Estímulos Arbitrarios en Redes Combinatorias') and c.grupo in ('Grupo 2','Grupo 4','Grupo 7')
  and exists (select 1 from estimulos_rft_base e where e.clase_base_id = c.id and e.posicion = 'A' and e.nombre ilike '%sorprendida%');
update clases_rft_base c set consignas = jsonb_set(coalesce(c.consignas,'{}'::jsonb), '{transformacion_funciones:A→C}', to_jsonb('Señala cómo se siente un niño que encuentra un gusano en su manzana'::text))
where c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones Emocionales a Estímulos Arbitrarios en Redes Combinatorias') and c.grupo in ('Grupo 2','Grupo 4','Grupo 7')
  and exists (select 1 from estimulos_rft_base e where e.clase_base_id = c.id and e.posicion = 'A' and e.nombre ilike '%asco%');

update programas_base set instrucciones_terapeuta = regexp_replace(instrucciones_terapeuta,
  '(si falla más en un tipo de pregunta que en otro\.)',
  E'\\1 En la app, los grupos 2, 4 y 7 usan preguntas de situación y los demás, preguntas directas.\n4. Prueba de preferencia (con material): presente el estímulo vinculado a la cara contenta junto al vinculado a la cara triste o enfadada y pregunte "¿Con cuál quieres jugar?" o "¿Cuál te gusta más?". Regístrela con "+ Ensayo de control". Es la medida más cercana a una función emocional (evaluativa): nombrar la emoción del estímulo no garantiza que el estímulo haya adquirido esa función.')
where clinica_id is null and nombre in ('Transferir Funciones Emocionales a Estímulos Arbitrarios', 'Transferir Funciones Emocionales a Estímulos Arbitrarios en Redes Combinatorias');

update programas_base set instrucciones_terapeuta = regexp_replace(instrucciones_terapeuta,
  '(\n)(Registro en la app)',
  E'\\1Seguimiento: repita el test de transformación unos días después del primero, como sonda de mantenimiento. En las redes de tres miembros, la función transferida a C suele ser menos estable que si se relacionara directamente con A (efecto de la distancia nodal); si se pierde, haga un bloque de mantenimiento de A–B y B–C antes de volver a probar.\n\n\\2')
where clinica_id is null and nombre in ('Transferir Funciones de Objetos Conocidos a Estímulos Arbitrarios en Redes Combinatorias', 'Transferir Funciones Apetitivas a Estímulos Arbitrarios en Redes Combinatorias', 'Transferir Funciones de Evitación a Estímulos Arbitrarios en Redes Combinatorias', 'Transferir Funciones Discriminativas a Estímulos Arbitrarios en Redes Combinatorias', 'Transferir Funciones Emocionales a Estímulos Arbitrarios en Redes Combinatorias');

commit;
