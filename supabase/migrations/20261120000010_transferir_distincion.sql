-- 3.1.4 Transferir Funciones a través de Relaciones de Distinción (Luciano et al.,
-- 2009, 6.3.2: «jugar con un dutnyb es diferente a jugar con un balón. Si quieres
-- jugar, ¿cuál cogerías?»). Un objeto conocido con su función y un objeto inventado
-- que «sirve para lo mismo» o «para algo diferente» (se mezclan coordinación y
-- distinción, como pide el capítulo). Oyente y hablante.

begin;

insert into programas_base (nombre, tipo, area, dominio_id, orden, visibilidad, objetivo, materiales, instrucciones_terapeuta, ayudas_posibles,
  ensayos_por_bloque, bloques_para_dominio, porcentaje_dominio, tipo_relacion, formato_recogida, nivel_rft, tipo_respuesta, opciones_respuesta,
  respuesta_por_fase, secuencia_rft, activo, creado_por)
select 'Transferir Funciones a través de Relaciones de Distinción', 'rft', pb.area, pb.dominio_id, 4, pb.visibilidad,
  $t$A partir de una relación de distinción o de coordinación entre un objeto conocido y otro inventado («El tasi sirve para algo diferente que el balón»), el alumno deriva si el objeto inventado tiene o no la función del conocido («Quiero jugar y no tengo balón. ¿Me sirve el tasi?» → «No») sin entrenamiento directo de esa función, como oyente (elige entre opciones) y como hablante (responde sin ellas).$t$,
  $t$Grupos de 3 (o más) clases con 2 miembros:

A: Objeto conocido con una función clara (el balón sirve para jugar)
B: Objeto inventado (el tasi), del que solo se sabe si sirve para lo mismo que A o para algo diferente

En cada grupo se mezclan clases «lo mismo» y «diferente», para que no se pueda acertar respondiendo siempre igual. Para el oyente, tarjetas LO MISMO / DIFERENTE y SÍ / NO; para la prueba de conducta, si es posible, cajas iguales con A en una y B oculto en la otra.$t$,
  $t$
Requisito previo: el alumno ha superado "Vincular Mutuamente Relaciones de Distinción" (dominio 3.1) y conoce la función de los objetos que se usan (ver "Vincular Mutuamente Funciones de los Objetos con sus Nombres").

Oyente y hablante: elija la forma en cada bloque al tomar datos. Como oyente, el alumno elige entre las tarjetas (LO MISMO / DIFERENTE; SÍ / NO). Como hablante, no presente las tarjetas: el alumno responde y usted marca la respuesta. Cada forma se domina por separado (Luciano et al., 2009: oyente y hablante).

Fase 1 - Entrenamiento (la relación, B → A):

1. Diga la relación y pregunte por ella: "El tasi sirve para algo diferente que el balón. ¿El tasi sirve para lo mismo que el balón o para algo diferente?".
2. Alterne clases «lo mismo» y «diferente» y el orden de las opciones en la pregunta.
3. Refuerce hasta alcanzar el criterio de dominio.

Fase 2 - Test de Transformación de Funciones (A → B), sin entrenamiento directo:

1. Diga la función de A, la relación y plantee la necesidad sin A: "El balón sirve para jugar. El tasi sirve para algo diferente que el balón. Quiero jugar y no tengo balón. ¿Me sirve el tasi?" (respuesta: "No"; si la relación es «lo mismo», "Sí").
2. No refuerce diferencialmente durante estos ensayos, pero registre la respuesta.
3. Si el alumno responde correctamente, la función de A se ha transformado a través de la relación: se transfiere a B por coordinación y no se transfiere por distinción. Responder siempre "Sí" indica que transfiere la función sin atender a la clave.
4. Prueba de conducta con material (opcional): dos cajas iguales, una con el balón y otra con el tasi oculto. "Quiero jugar, pero esta caja (la del balón) está cerrada. ¿Abro la otra?".

Generalización (sondas): objetos y funciones nuevos, y la relación dicha de otra forma ("El tasi no es como el balón", "El tasi es distinto del balón").

Realice el primer bloque del test sin ayudas. Si el alumno alcanza el criterio, la relación se considera DERIVADA; si se enseña con ayudas, quedará registrada como DOMINADA (no derivada), aunque el último bloque se realice sin ayudas.

Registro en la app (fase · posición origen → destino; el destino es la respuesta correcta):
- Entrenamiento: B → A ("¿El tasi sirve para lo mismo que el balón o para algo diferente?"; respuesta "Lo mismo" o "Diferente")
- Transformación de funciones: A → B ("Quiero jugar y no tengo balón. ¿Me sirve el tasi?"; respuesta "Sí" o "No")
Las sondas con los mismos estímulos en otro contexto o con otra persona se registran con las mismas posiciones, eligiendo "Sonda de generalización" como tipo de bloque una vez dominada la combinación.

Grupos de estímulos: los grupos y clases de este programa son un ejemplo. Cree en el PEI del alumno tantos grupos como considere oportuno, incluido un grupo de generalización con estímulos nuevos. En ese grupo, el primer bloque de entrenamiento realizado sin ayudas y sin reforzar diferencialmente funciona como sonda: si el alumno alcanza el criterio a la primera, hay generalización a estímulos nuevos (anótelo en las notas del bloque). Los tests de ese grupo se habilitan cuando su entrenamiento está dominado.$t$,
  $t$(Aplicables en la fase de entrenamiento, o en el test solo después de un primer bloque sin ayudas que no alcance el criterio; la relación se registrará entonces como dominada, no derivada)

- Verbal parcial: repetir la relación antes de la pregunta
- Visual: dibujar los dos objetos unidos por = o ≠ y retirarlo antes de la pregunta
- Gestual: señalar la tarjeta de la respuesta correcta (solo como oyente)
- Modelado: el terapeuta responde primero con otra pareja como ejemplo$t$,
  10, 3, 90, 'distincion', 'ensayo_discreto', 'mutuo', 'opciones', array['Lo mismo', 'Diferente'],
  '{"transformacion_funciones": {"tipo": "opciones", "opciones": ["Sí", "No"]}}'::jsonb,
  '[{"fase": "entrenamiento", "origen": "B", "destino": "A"}, {"fase": "transformacion_funciones", "origen": "A", "destino": "B"}]'::jsonb,
  true, pb.creado_por
from programas_base pb where pb.clinica_id is null and pb.nombre = 'Vincular Mutuamente Relaciones de Distinción'
and not exists (select 1 from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones de Distinción');

with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones de Distinción'), 'Clase 1', 'Grupo 1', 1, $j${"entrenamiento:B→A": "El tasi sirve para algo diferente que el balón. ¿El tasi sirve para lo mismo que el balón o para algo diferente?", "transformacion_funciones:A→B": "El balón sirve para jugar. El tasi sirve para algo diferente que el balón. Quiero jugar y no tengo balón. ¿Me sirve el tasi?"}$j$::jsonb, $j${"B→A": "Diferente", "A→B": "No"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values
  ('A1', 'A', 'El balón'),
  ('B1', 'B', 'El tasi')) x(etiqueta, posicion, nombre);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones de Distinción'), 'Clase 2', 'Grupo 1', 2, $j${"entrenamiento:B→A": "El bori sirve para lo mismo que la cuchara. ¿El bori sirve para lo mismo que la cuchara o para algo diferente?", "transformacion_funciones:A→B": "La cuchara sirve para comer sopa. El bori sirve para lo mismo que la cuchara. Quiero comer sopa y no tengo cuchara. ¿Me sirve el bori?"}$j$::jsonb, $j${"B→A": "Lo mismo", "A→B": "Sí"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values
  ('A2', 'A', 'La cuchara'),
  ('B2', 'B', 'El bori')) x(etiqueta, posicion, nombre);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones de Distinción'), 'Clase 3', 'Grupo 1', 3, $j${"entrenamiento:B→A": "El nok sirve para algo diferente que el paraguas. ¿El nok sirve para algo diferente que el paraguas o para lo mismo?", "transformacion_funciones:A→B": "El paraguas sirve para no mojarse cuando llueve. El nok sirve para algo diferente que el paraguas. Quiero no mojarme cuando llueva y no tengo paraguas. ¿Me sirve el nok?"}$j$::jsonb, $j${"B→A": "Diferente", "A→B": "No"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values
  ('A3', 'A', 'El paraguas'),
  ('B3', 'B', 'El nok')) x(etiqueta, posicion, nombre);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones de Distinción'), 'Clase 4', 'Grupo 1', 4, $j${"entrenamiento:B→A": "El fen sirve para lo mismo que el vaso. ¿El fen sirve para lo mismo que el vaso o para algo diferente?", "transformacion_funciones:A→B": "El vaso sirve para beber agua. El fen sirve para lo mismo que el vaso. Quiero beber agua y no tengo vaso. ¿Me sirve el fen?"}$j$::jsonb, $j${"B→A": "Lo mismo", "A→B": "Sí"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values
  ('A4', 'A', 'El vaso'),
  ('B4', 'B', 'El fen')) x(etiqueta, posicion, nombre);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones de Distinción'), 'Clase 5', 'Grupo 2', 5, $j${"entrenamiento:B→A": "La kiri sirve para lo mismo que el lápiz. ¿La kiri sirve para lo mismo que el lápiz o para algo diferente?", "transformacion_funciones:A→B": "El lápiz sirve para escribir. La kiri sirve para lo mismo que el lápiz. Quiero escribir y no tengo lápiz. ¿Me sirve la kiri?"}$j$::jsonb, $j${"B→A": "Lo mismo", "A→B": "Sí"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values
  ('A5', 'A', 'El lápiz'),
  ('B5', 'B', 'La kiri')) x(etiqueta, posicion, nombre);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones de Distinción'), 'Clase 6', 'Grupo 2', 6, $j${"entrenamiento:B→A": "El dax sirve para algo diferente que la llave. ¿El dax sirve para algo diferente que la llave o para lo mismo?", "transformacion_funciones:A→B": "La llave sirve para abrir la puerta. El dax sirve para algo diferente que la llave. Quiero abrir la puerta y no tengo llave. ¿Me sirve el dax?"}$j$::jsonb, $j${"B→A": "Diferente", "A→B": "No"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values
  ('A6', 'A', 'La llave'),
  ('B6', 'B', 'El dax')) x(etiqueta, posicion, nombre);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones de Distinción'), 'Clase 7', 'Grupo 2', 7, $j${"entrenamiento:B→A": "El rul sirve para algo diferente que la toalla. ¿El rul sirve para lo mismo que la toalla o para algo diferente?", "transformacion_funciones:A→B": "La toalla sirve para secarse. El rul sirve para algo diferente que la toalla. Quiero secarme y no tengo toalla. ¿Me sirve el rul?"}$j$::jsonb, $j${"B→A": "Diferente", "A→B": "No"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values
  ('A7', 'A', 'La toalla'),
  ('B7', 'B', 'El rul')) x(etiqueta, posicion, nombre);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones de Distinción'), 'Clase 8', 'Grupo 2', 8, $j${"entrenamiento:B→A": "El lomi sirve para lo mismo que las tijeras. ¿El lomi sirve para lo mismo que las tijeras o para algo diferente?", "transformacion_funciones:A→B": "Las tijeras sirven para cortar papel. El lomi sirve para lo mismo que las tijeras. Quiero cortar papel y no tengo tijeras. ¿Me sirve el lomi?"}$j$::jsonb, $j${"B→A": "Lo mismo", "A→B": "Sí"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values
  ('A8', 'A', 'Las tijeras'),
  ('B8', 'B', 'El lomi')) x(etiqueta, posicion, nombre);

insert into requisitos_programa (programa_base_id, requisito_id)
select (select id from programas_base where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones de Distinción'), r.id from programas_base r
where r.clinica_id is null and r.nombre in ('Vincular Mutuamente Relaciones de Distinción', 'Vincular Mutuamente Funciones de los Objetos con sus Nombres')
on conflict do nothing;

commit;
