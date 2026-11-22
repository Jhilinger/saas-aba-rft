-- Oposición (plan de fusión, Luciano et al., 2009): dos programas con transformación final.
-- 1) Nuevo «Vincular Mutuamente Relaciones de Oposición» con estímulos inventados (sustituye a
--    «Vincular Mutuamente Opuestos», de opuestos reales, que se desactiva).
-- 2) «Transferir Funciones a través de Relaciones de Oposición» (red + transformación) pasa a ser
--    «Derivar Relaciones de Oposición en Redes Combinatorias»; la antigua red de figuras se desactiva.
-- 3) Se desactiva «Responder a Preguntas ¿Por qué?» (3.7.2). Requisitos, orden y referencias.
begin;

insert into programas_base (nombre, tipo, area, dominio_id, orden, visibilidad, objetivo, materiales, instrucciones_terapeuta, ayudas_posibles,
  ensayos_por_bloque, bloques_para_dominio, porcentaje_dominio, tipo_relacion, formato_recogida, nivel_rft, tipo_respuesta, opciones_respuesta,
  respuesta_por_fase, secuencia_rft, opciones_clase, activo, creado_por)
select 'Vincular Mutuamente Relaciones de Oposición', 'rft', pb.area, pb.dominio_id, 2, pb.visibilidad, $t$A partir de una relación de oposición entre dos estímulos inventados («El botón Tok hace lo contrario que el botón Mif»), el alumno deriva la relación inversa («¿Qué botón hace lo contrario que Tok?» → Mif) y transforma la función a través de ella: si Mif enciende la luz y quiere apagarla, elige Tok (Luciano et al., 2009).$t$, $t$Grupos de 3 (o más) clases con 2 miembros:

A: Estímulo inventado con una función de dos polos claros (el botón Mif enciende la luz)
B: Estímulo inventado que hace lo contrario que A

Los dos miembros son del mismo tipo (botones, palancas, llaves, grifos…) y llevan nombres inventados, de forma que solo la relación indica su función; cada grupo es de un solo tipo, para que el distractor sea del mismo tipo. En la tableta, las opciones son los dos estímulos y uno de otra clase del grupo. Contrapesos: en la mitad de las clases la frase nombra primero a B («Tok hace lo contrario que Mif») y en la otra mitad a A; las funciones alternan su polo (encender/apagar).$t$, $t$
Requisito previo: el alumno ha superado "Abstraer Claves de Oposición" (dominio 3.2).

Opciones de respuesta: en la tableta, las opciones son los dos estímulos de la relación y uno de otra clase del grupo (ej. «El botón Mif», «El botón Tok», «El botón Dax»); el alumno elige uno.

Fase 1 - Entrenamiento (A → B): enuncie la relación y pregunte por ella: "El botón Tok hace lo contrario que el botón Mif. ¿Qué botón hace lo contrario que el botón Mif?". Refuerce hasta alcanzar el criterio de dominio.

Fase 2 - Test de Vinculación Mutua (B → A), sin entrenamiento directo: "… ¿Qué botón hace lo contrario que el botón Tok?". No refuerce diferencialmente durante estos ensayos, pero registre la respuesta. Si responde correctamente, la oposición es simétrica para el alumno: si Tok es lo contrario de Mif, Mif es lo contrario de Tok.

Fase 3 - Test de Transformación de Funciones a través de la relación mutua, sin entrenamiento directo (Luciano et al., 2009):

1. Dé a uno de los dos una función y plantee el deseo contrario: "El botón Mif enciende la luz. El botón Tok hace lo contrario que el botón Mif. Quiero apagar la luz. ¿Qué botón uso?" (respuesta: Tok, función invertida). Con la función en B se pregunta por A: "El botón Tok apaga la luz… Quiero encender la luz. ¿Qué botón uso?" (respuesta: Mif).
2. No refuerce diferencialmente durante estos ensayos, pero registre la respuesta.
3. Elegir el que tiene la función indica que no transforma la función a través de la relación.

Generalización (sondas): relaciones nuevas con otras funciones (ej. "El agua Kafi está caliente; el agua Somi es lo contrario. ¿Cómo está el agua Somi?").

Realice el primer bloque de cada test sin ayudas. Si el alumno alcanza el criterio, la relación se considera DERIVADA; si se enseña con ayudas, quedará registrada como DOMINADA (no derivada), aunque el último bloque se realice sin ayudas.

Oyente y hablante: elija la forma en cada bloque al tomar datos. Como oyente, el alumno elige entre las opciones; como hablante, no se presentan opciones: el alumno responde y usted marca la respuesta. Cada forma se domina por separado (Luciano et al., 2009).

De lo no arbitrario a lo arbitrario: si al alumno le cuesta pasar de las relaciones físicas a las frases, practique primero «Con fichas iguales»: una ficha igual por cada nombre, que se ve y se señala al decirlo (como las monedas idénticas de Barnes-Holmes et al., 2004). Esos bloques no cuentan para el dominio: retire las fichas en cuanto pueda (Luciano et al., 2009).

Registro en la app (fase · posición origen → destino; el destino es la respuesta correcta):
- Entrenamiento: A → B ("¿Qué botón hace lo contrario que Mif?")
- Test de vínculo mutuo: B → A ("¿Qué botón hace lo contrario que Tok?")
- Transformación de funciones: A → B (la función, en A: "Mif enciende la luz… Quiero apagar la luz. ¿Qué botón uso?") y B → A (la función, en B: "Tok apaga la luz… Quiero encender la luz. ¿Qué botón uso?")
Las sondas con los mismos estímulos en otro contexto o con otra persona se registran con las mismas posiciones, eligiendo "Sonda de generalización" como tipo de bloque una vez dominada la combinación.

Grupos de estímulos: los grupos y clases de este programa son un ejemplo. Cree en el PEI del alumno tantos grupos como considere oportuno, incluido un grupo de generalización con estímulos nuevos. En ese grupo, el primer bloque de entrenamiento realizado sin ayudas y sin reforzar diferencialmente funciona como sonda: si el alumno alcanza el criterio a la primera, hay generalización a estímulos nuevos (anótelo en las notas del bloque). Los tests de ese grupo se habilitan cuando su entrenamiento está dominado.

Registro: en este programa los datos se toman solo en la tableta, que presenta la frase y las opciones (como hablante, solo la frase; usted marca la respuesta). Para el alumno que no lee, léale usted la frase.

Fuera de la tableta (sin registro): con un dispositivo real que se encienda y se apague, "Este botón enciende la luz; este otro hace lo contrario. Quiero que se apague: pulsa el que toca"; y en el día a día, con otros nombres y objetos reales.$t$, $t$(Aplicables en la fase de entrenamiento, o en los tests solo después de un primer bloque sin ayudas que no alcance el criterio; la relación se registrará entonces como dominada, no derivada)

- Verbal parcial: repetir la relación antes de la pregunta
- Visual: dibujar los dos estímulos unidos por una flecha rotulada "contrario" y retirarla antes de la pregunta
- Gestual: señalar en la pantalla el estímulo por el que se pregunta
- Modelado: el terapeuta responde primero con otra pareja como ejemplo$t$,
  10, 3, 90, 'oposicion', 'ensayo_discreto', 'mutuo', 'seleccion', null, '{}'::jsonb, '[{"fase": "entrenamiento", "origen": "A", "destino": "B"}, {"fase": "test_mutuo", "origen": "B", "destino": "A"}, {"fase": "transformacion_funciones", "origen": "A", "destino": "B"}, {"fase": "transformacion_funciones", "origen": "B", "destino": "A"}]'::jsonb, true, true, pb.creado_por
from programas_base pb where pb.clinica_id is null and pb.nombre = 'Transferir Funciones a través de Relaciones de Oposición'
and not exists (select 1 from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición');

with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), 'Clase 1', 'Grupo 1', 1, $j${"entrenamiento:A→B": "El botón Somi hace lo contrario que el botón Kafi. ¿Qué botón hace lo contrario que el botón Kafi?", "test_mutuo:B→A": "El botón Somi hace lo contrario que el botón Kafi. ¿Qué botón hace lo contrario que el botón Somi?", "transformacion_funciones:A→B": "El botón Kafi enciende la luz. El botón Somi hace lo contrario que el botón Kafi. Quiero apagar la luz. ¿Qué botón uso?", "transformacion_funciones:B→A": "El botón Somi apaga la luz. El botón Somi hace lo contrario que el botón Kafi. Quiero encender la luz. ¿Qué botón uso?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A1', 'A', 'El botón Kafi'), ('B1', 'B', 'El botón Somi')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición') and nombre = 'Clase 1');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), 'Clase 2', 'Grupo 1', 2, $j${"entrenamiento:A→B": "El botón Tuli hace lo contrario que el botón Pupi. ¿Qué botón hace lo contrario que el botón Tuli?", "test_mutuo:B→A": "El botón Tuli hace lo contrario que el botón Pupi. ¿Qué botón hace lo contrario que el botón Pupi?", "transformacion_funciones:A→B": "El botón Tuli apaga la luz. El botón Tuli hace lo contrario que el botón Pupi. Quiero encender la luz. ¿Qué botón uso?", "transformacion_funciones:B→A": "El botón Pupi enciende la luz. El botón Tuli hace lo contrario que el botón Pupi. Quiero apagar la luz. ¿Qué botón uso?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A2', 'A', 'El botón Tuli'), ('B2', 'B', 'El botón Pupi')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición') and nombre = 'Clase 2');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), 'Clase 3', 'Grupo 1', 3, $j${"entrenamiento:A→B": "El botón Guno hace lo contrario que el botón Nefo. ¿Qué botón hace lo contrario que el botón Nefo?", "test_mutuo:B→A": "El botón Guno hace lo contrario que el botón Nefo. ¿Qué botón hace lo contrario que el botón Guno?", "transformacion_funciones:A→B": "El botón Nefo apaga la luz. El botón Guno hace lo contrario que el botón Nefo. Quiero encender la luz. ¿Qué botón uso?", "transformacion_funciones:B→A": "El botón Guno enciende la luz. El botón Guno hace lo contrario que el botón Nefo. Quiero apagar la luz. ¿Qué botón uso?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A3', 'A', 'El botón Nefo'), ('B3', 'B', 'El botón Guno')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición') and nombre = 'Clase 3');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), 'Clase 4', 'Grupo 2', 4, $j${"entrenamiento:A→B": "La palanca Jopi hace lo contrario que la palanca Kalo. ¿Qué palanca hace lo contrario que la palanca Jopi?", "test_mutuo:B→A": "La palanca Jopi hace lo contrario que la palanca Kalo. ¿Qué palanca hace lo contrario que la palanca Kalo?", "transformacion_funciones:A→B": "La palanca Jopi hace que el tren arranque. La palanca Jopi hace lo contrario que la palanca Kalo. Quiero que el tren se pare. ¿Qué palanca uso?", "transformacion_funciones:B→A": "La palanca Kalo hace que el tren se pare. La palanca Jopi hace lo contrario que la palanca Kalo. Quiero que el tren arranque. ¿Qué palanca uso?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A4', 'A', 'La palanca Jopi'), ('B4', 'B', 'La palanca Kalo')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición') and nombre = 'Clase 4');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), 'Clase 5', 'Grupo 2', 5, $j${"entrenamiento:A→B": "La palanca Pori hace lo contrario que la palanca Mupe. ¿Qué palanca hace lo contrario que la palanca Mupe?", "test_mutuo:B→A": "La palanca Pori hace lo contrario que la palanca Mupe. ¿Qué palanca hace lo contrario que la palanca Pori?", "transformacion_funciones:A→B": "La palanca Mupe hace que el tren arranque. La palanca Pori hace lo contrario que la palanca Mupe. Quiero que el tren se pare. ¿Qué palanca uso?", "transformacion_funciones:B→A": "La palanca Pori hace que el tren se pare. La palanca Pori hace lo contrario que la palanca Mupe. Quiero que el tren arranque. ¿Qué palanca uso?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A5', 'A', 'La palanca Mupe'), ('B5', 'B', 'La palanca Pori')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición') and nombre = 'Clase 5');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), 'Clase 6', 'Grupo 2', 6, $j${"entrenamiento:A→B": "La palanca Suki hace lo contrario que la palanca Vemi. ¿Qué palanca hace lo contrario que la palanca Suki?", "test_mutuo:B→A": "La palanca Suki hace lo contrario que la palanca Vemi. ¿Qué palanca hace lo contrario que la palanca Vemi?", "transformacion_funciones:A→B": "La palanca Suki hace que el tren se pare. La palanca Suki hace lo contrario que la palanca Vemi. Quiero que el tren arranque. ¿Qué palanca uso?", "transformacion_funciones:B→A": "La palanca Vemi hace que el tren arranque. La palanca Suki hace lo contrario que la palanca Vemi. Quiero que el tren se pare. ¿Qué palanca uso?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A6', 'A', 'La palanca Suki'), ('B6', 'B', 'La palanca Vemi')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición') and nombre = 'Clase 6');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), 'Clase 7', 'Grupo 3', 7, $j${"entrenamiento:A→B": "La llave Bek hace lo contrario que la llave Zolu. ¿Qué llave hace lo contrario que la llave Zolu?", "test_mutuo:B→A": "La llave Bek hace lo contrario que la llave Zolu. ¿Qué llave hace lo contrario que la llave Bek?", "transformacion_funciones:A→B": "La llave Zolu cierra la puerta. La llave Bek hace lo contrario que la llave Zolu. Quiero abrir la puerta. ¿Qué llave uso?", "transformacion_funciones:B→A": "La llave Bek abre la puerta. La llave Bek hace lo contrario que la llave Zolu. Quiero cerrar la puerta. ¿Qué llave uso?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A7', 'A', 'La llave Zolu'), ('B7', 'B', 'La llave Bek')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición') and nombre = 'Clase 7');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), 'Clase 8', 'Grupo 3', 8, $j${"entrenamiento:A→B": "La llave Diru hace lo contrario que la llave Faki. ¿Qué llave hace lo contrario que la llave Diru?", "test_mutuo:B→A": "La llave Diru hace lo contrario que la llave Faki. ¿Qué llave hace lo contrario que la llave Faki?", "transformacion_funciones:A→B": "La llave Diru abre la puerta. La llave Diru hace lo contrario que la llave Faki. Quiero cerrar la puerta. ¿Qué llave uso?", "transformacion_funciones:B→A": "La llave Faki cierra la puerta. La llave Diru hace lo contrario que la llave Faki. Quiero abrir la puerta. ¿Qué llave uso?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A8', 'A', 'La llave Diru'), ('B8', 'B', 'La llave Faki')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición') and nombre = 'Clase 8');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), 'Clase 9', 'Grupo 3', 9, $j${"entrenamiento:A→B": "La llave Lomi hace lo contrario que la llave Keru. ¿Qué llave hace lo contrario que la llave Keru?", "test_mutuo:B→A": "La llave Lomi hace lo contrario que la llave Keru. ¿Qué llave hace lo contrario que la llave Lomi?", "transformacion_funciones:A→B": "La llave Keru abre la puerta. La llave Lomi hace lo contrario que la llave Keru. Quiero cerrar la puerta. ¿Qué llave uso?", "transformacion_funciones:B→A": "La llave Lomi cierra la puerta. La llave Lomi hace lo contrario que la llave Keru. Quiero abrir la puerta. ¿Qué llave uso?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A9', 'A', 'La llave Keru'), ('B9', 'B', 'La llave Lomi')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición') and nombre = 'Clase 9');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), 'Clase 10', 'Grupo 4', 10, $j${"entrenamiento:A→B": "El grifo Pefa hace lo contrario que el grifo Ruto. ¿Qué grifo hace lo contrario que el grifo Pefa?", "test_mutuo:B→A": "El grifo Pefa hace lo contrario que el grifo Ruto. ¿Qué grifo hace lo contrario que el grifo Ruto?", "transformacion_funciones:A→B": "El grifo Pefa echa agua fría. El grifo Pefa hace lo contrario que el grifo Ruto. Quiero agua caliente. ¿Qué grifo uso?", "transformacion_funciones:B→A": "El grifo Ruto echa agua caliente. El grifo Pefa hace lo contrario que el grifo Ruto. Quiero agua fría. ¿Qué grifo uso?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A10', 'A', 'El grifo Pefa'), ('B10', 'B', 'El grifo Ruto')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición') and nombre = 'Clase 10');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), 'Clase 11', 'Grupo 4', 11, $j${"entrenamiento:A→B": "El grifo Tavo hace lo contrario que el grifo Siba. ¿Qué grifo hace lo contrario que el grifo Siba?", "test_mutuo:B→A": "El grifo Tavo hace lo contrario que el grifo Siba. ¿Qué grifo hace lo contrario que el grifo Tavo?", "transformacion_funciones:A→B": "El grifo Siba echa agua fría. El grifo Tavo hace lo contrario que el grifo Siba. Quiero agua caliente. ¿Qué grifo uso?", "transformacion_funciones:B→A": "El grifo Tavo echa agua caliente. El grifo Tavo hace lo contrario que el grifo Siba. Quiero agua fría. ¿Qué grifo uso?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A11', 'A', 'El grifo Siba'), ('B11', 'B', 'El grifo Tavo')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición') and nombre = 'Clase 11');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), 'Clase 12', 'Grupo 4', 12, $j${"entrenamiento:A→B": "El grifo Nilu hace lo contrario que el grifo Toba. ¿Qué grifo hace lo contrario que el grifo Nilu?", "test_mutuo:B→A": "El grifo Nilu hace lo contrario que el grifo Toba. ¿Qué grifo hace lo contrario que el grifo Toba?", "transformacion_funciones:A→B": "El grifo Nilu echa agua caliente. El grifo Nilu hace lo contrario que el grifo Toba. Quiero agua fría. ¿Qué grifo uso?", "transformacion_funciones:B→A": "El grifo Toba echa agua fría. El grifo Nilu hace lo contrario que el grifo Toba. Quiero agua caliente. ¿Qué grifo uso?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A12', 'A', 'El grifo Nilu'), ('B12', 'B', 'El grifo Toba')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición') and nombre = 'Clase 12');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), 'Clase 13', 'Grupo 5', 13, $j${"entrenamiento:A→B": "El interruptor Dofi hace lo contrario que el interruptor Mavi. ¿Qué interruptor hace lo contrario que el interruptor Mavi?", "test_mutuo:B→A": "El interruptor Dofi hace lo contrario que el interruptor Mavi. ¿Qué interruptor hace lo contrario que el interruptor Dofi?", "transformacion_funciones:A→B": "El interruptor Mavi sube la persiana. El interruptor Dofi hace lo contrario que el interruptor Mavi. Quiero bajar la persiana. ¿Qué interruptor uso?", "transformacion_funciones:B→A": "El interruptor Dofi baja la persiana. El interruptor Dofi hace lo contrario que el interruptor Mavi. Quiero subir la persiana. ¿Qué interruptor uso?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A13', 'A', 'El interruptor Mavi'), ('B13', 'B', 'El interruptor Dofi')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición') and nombre = 'Clase 13');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), 'Clase 14', 'Grupo 5', 14, $j${"entrenamiento:A→B": "El interruptor Sefa hace lo contrario que el interruptor Bimo. ¿Qué interruptor hace lo contrario que el interruptor Sefa?", "test_mutuo:B→A": "El interruptor Sefa hace lo contrario que el interruptor Bimo. ¿Qué interruptor hace lo contrario que el interruptor Bimo?", "transformacion_funciones:A→B": "El interruptor Sefa baja la persiana. El interruptor Sefa hace lo contrario que el interruptor Bimo. Quiero subir la persiana. ¿Qué interruptor uso?", "transformacion_funciones:B→A": "El interruptor Bimo sube la persiana. El interruptor Sefa hace lo contrario que el interruptor Bimo. Quiero bajar la persiana. ¿Qué interruptor uso?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A14', 'A', 'El interruptor Sefa'), ('B14', 'B', 'El interruptor Bimo')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición') and nombre = 'Clase 14');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), 'Clase 15', 'Grupo 5', 15, $j${"entrenamiento:A→B": "El interruptor Kuli hace lo contrario que el interruptor Zaba. ¿Qué interruptor hace lo contrario que el interruptor Zaba?", "test_mutuo:B→A": "El interruptor Kuli hace lo contrario que el interruptor Zaba. ¿Qué interruptor hace lo contrario que el interruptor Kuli?", "transformacion_funciones:A→B": "El interruptor Zaba baja la persiana. El interruptor Kuli hace lo contrario que el interruptor Zaba. Quiero subir la persiana. ¿Qué interruptor uso?", "transformacion_funciones:B→A": "El interruptor Kuli sube la persiana. El interruptor Kuli hace lo contrario que el interruptor Zaba. Quiero bajar la persiana. ¿Qué interruptor uso?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A15', 'A', 'El interruptor Zaba'), ('B15', 'B', 'El interruptor Kuli')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición') and nombre = 'Clase 15');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), 'Clase 16', 'Grupo 6', 16, $j${"entrenamiento:A→B": "La tecla Nub hace lo contrario que la tecla Lipa. ¿Qué tecla hace lo contrario que la tecla Nub?", "test_mutuo:B→A": "La tecla Nub hace lo contrario que la tecla Lipa. ¿Qué tecla hace lo contrario que la tecla Lipa?", "transformacion_funciones:A→B": "La tecla Nub sube el volumen. La tecla Nub hace lo contrario que la tecla Lipa. Quiero bajar el volumen. ¿Qué tecla uso?", "transformacion_funciones:B→A": "La tecla Lipa baja el volumen. La tecla Nub hace lo contrario que la tecla Lipa. Quiero subir el volumen. ¿Qué tecla uso?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A16', 'A', 'La tecla Nub'), ('B16', 'B', 'La tecla Lipa')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición') and nombre = 'Clase 16');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), 'Clase 17', 'Grupo 6', 17, $j${"entrenamiento:A→B": "La tecla Coli hace lo contrario que la tecla Rof. ¿Qué tecla hace lo contrario que la tecla Rof?", "test_mutuo:B→A": "La tecla Coli hace lo contrario que la tecla Rof. ¿Qué tecla hace lo contrario que la tecla Coli?", "transformacion_funciones:A→B": "La tecla Rof sube el volumen. La tecla Coli hace lo contrario que la tecla Rof. Quiero bajar el volumen. ¿Qué tecla uso?", "transformacion_funciones:B→A": "La tecla Coli baja el volumen. La tecla Coli hace lo contrario que la tecla Rof. Quiero subir el volumen. ¿Qué tecla uso?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A17', 'A', 'La tecla Rof'), ('B17', 'B', 'La tecla Coli')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición') and nombre = 'Clase 17');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), 'Clase 18', 'Grupo 6', 18, $j${"entrenamiento:A→B": "La tecla Mepo hace lo contrario que la tecla Gufi. ¿Qué tecla hace lo contrario que la tecla Mepo?", "test_mutuo:B→A": "La tecla Mepo hace lo contrario que la tecla Gufi. ¿Qué tecla hace lo contrario que la tecla Gufi?", "transformacion_funciones:A→B": "La tecla Mepo baja el volumen. La tecla Mepo hace lo contrario que la tecla Gufi. Quiero subir el volumen. ¿Qué tecla uso?", "transformacion_funciones:B→A": "La tecla Gufi sube el volumen. La tecla Mepo hace lo contrario que la tecla Gufi. Quiero bajar el volumen. ¿Qué tecla uso?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A18', 'A', 'La tecla Mepo'), ('B18', 'B', 'La tecla Gufi')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición') and nombre = 'Clase 18');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), 'Clase 19', 'Grupo 7', 19, $j${"entrenamiento:A→B": "El mando Saro hace lo contrario que el mando Fito. ¿Qué mando hace lo contrario que el mando Fito?", "test_mutuo:B→A": "El mando Saro hace lo contrario que el mando Fito. ¿Qué mando hace lo contrario que el mando Saro?", "transformacion_funciones:A→B": "El mando Fito apaga la tele. El mando Saro hace lo contrario que el mando Fito. Quiero encender la tele. ¿Qué mando uso?", "transformacion_funciones:B→A": "El mando Saro enciende la tele. El mando Saro hace lo contrario que el mando Fito. Quiero apagar la tele. ¿Qué mando uso?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A19', 'A', 'El mando Fito'), ('B19', 'B', 'El mando Saro')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición') and nombre = 'Clase 19');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), 'Clase 20', 'Grupo 7', 20, $j${"entrenamiento:A→B": "El mando Tin hace lo contrario que el mando Rasu. ¿Qué mando hace lo contrario que el mando Tin?", "test_mutuo:B→A": "El mando Tin hace lo contrario que el mando Rasu. ¿Qué mando hace lo contrario que el mando Rasu?", "transformacion_funciones:A→B": "El mando Tin enciende la tele. El mando Tin hace lo contrario que el mando Rasu. Quiero apagar la tele. ¿Qué mando uso?", "transformacion_funciones:B→A": "El mando Rasu apaga la tele. El mando Tin hace lo contrario que el mando Rasu. Quiero encender la tele. ¿Qué mando uso?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A20', 'A', 'El mando Tin'), ('B20', 'B', 'El mando Rasu')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición') and nombre = 'Clase 20');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), 'Clase 21', 'Grupo 7', 21, $j${"entrenamiento:A→B": "El mando Dun hace lo contrario que el mando Bavi. ¿Qué mando hace lo contrario que el mando Bavi?", "test_mutuo:B→A": "El mando Dun hace lo contrario que el mando Bavi. ¿Qué mando hace lo contrario que el mando Dun?", "transformacion_funciones:A→B": "El mando Bavi enciende la tele. El mando Dun hace lo contrario que el mando Bavi. Quiero apagar la tele. ¿Qué mando uso?", "transformacion_funciones:B→A": "El mando Dun apaga la tele. El mando Dun hace lo contrario que el mando Bavi. Quiero encender la tele. ¿Qué mando uso?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A21', 'A', 'El mando Bavi'), ('B21', 'B', 'El mando Dun')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición') and nombre = 'Clase 21');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), 'Clase 22', 'Grupo 8', 22, $j${"entrenamiento:A→B": "El pedal Gor hace lo contrario que el pedal Lesu. ¿Qué pedal hace lo contrario que el pedal Gor?", "test_mutuo:B→A": "El pedal Gor hace lo contrario que el pedal Lesu. ¿Qué pedal hace lo contrario que el pedal Lesu?", "transformacion_funciones:A→B": "El pedal Gor hace que la bici vaya más despacio. El pedal Gor hace lo contrario que el pedal Lesu. Quiero que la bici vaya más deprisa. ¿Qué pedal uso?", "transformacion_funciones:B→A": "El pedal Lesu hace que la bici vaya más deprisa. El pedal Gor hace lo contrario que el pedal Lesu. Quiero que la bici vaya más despacio. ¿Qué pedal uso?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A22', 'A', 'El pedal Gor'), ('B22', 'B', 'El pedal Lesu')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición') and nombre = 'Clase 22');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), 'Clase 23', 'Grupo 8', 23, $j${"entrenamiento:A→B": "El pedal Mo hace lo contrario que el pedal Fi. ¿Qué pedal hace lo contrario que el pedal Fi?", "test_mutuo:B→A": "El pedal Mo hace lo contrario que el pedal Fi. ¿Qué pedal hace lo contrario que el pedal Mo?", "transformacion_funciones:A→B": "El pedal Fi hace que la bici vaya más despacio. El pedal Mo hace lo contrario que el pedal Fi. Quiero que la bici vaya más deprisa. ¿Qué pedal uso?", "transformacion_funciones:B→A": "El pedal Mo hace que la bici vaya más deprisa. El pedal Mo hace lo contrario que el pedal Fi. Quiero que la bici vaya más despacio. ¿Qué pedal uso?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A23', 'A', 'El pedal Fi'), ('B23', 'B', 'El pedal Mo')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición') and nombre = 'Clase 23');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), 'Clase 24', 'Grupo 8', 24, $j${"entrenamiento:A→B": "El pedal Pal hace lo contrario que el pedal Tiko. ¿Qué pedal hace lo contrario que el pedal Pal?", "test_mutuo:B→A": "El pedal Pal hace lo contrario que el pedal Tiko. ¿Qué pedal hace lo contrario que el pedal Tiko?", "transformacion_funciones:A→B": "El pedal Pal hace que la bici vaya más deprisa. El pedal Pal hace lo contrario que el pedal Tiko. Quiero que la bici vaya más despacio. ¿Qué pedal uso?", "transformacion_funciones:B→A": "El pedal Tiko hace que la bici vaya más despacio. El pedal Pal hace lo contrario que el pedal Tiko. Quiero que la bici vaya más deprisa. ¿Qué pedal uso?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A24', 'A', 'El pedal Pal'), ('B24', 'B', 'El pedal Tiko')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición') and nombre = 'Clase 24');

-- Retirar 3.2.2 y la red de figuras (3.2.3); la red con funciones ocupa el lugar 3
update programas_base set activo = false, orden = null where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos';
update programas_base set activo = false, orden = null, nombre = 'Derivar Relaciones de Oposición en Redes Combinatorias (figuras, retirado)'
where clinica_id is null and nombre = 'Derivar Relaciones de Oposición en Redes Combinatorias';
update programas_base set nombre = 'Derivar Relaciones de Oposición en Redes Combinatorias', orden = 3,
  respuesta_por_fase = '{}'::jsonb,
  objetivo = $t$A partir de dos relaciones de oposición encadenadas entre estímulos inventados («Tok hace lo contrario que Mif»; «Dax hace lo contrario que Tok»), el alumno deriva que el contrario del contrario hace lo mismo («¿Qué botón hace lo mismo que Mif?» → Dax) y transforma la función a través de la red: invertida en B y restablecida en C («Mif enciende la música. Quiero apagarla: ¿qué botón uso?» → Tok; «Quiero encenderla, pero Mif no está» → Dax).$t$,
  instrucciones_terapeuta = replace(instrucciones_terapeuta, 'Requisito previo: el alumno ha superado "Derivar Relaciones de Oposición en Redes Combinatorias" (dominio 3.2).', 'Requisito previo: el alumno ha superado "Vincular Mutuamente Relaciones de Oposición" (dominio 3.2).')
where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones de Oposición';
update programas_alumno pa set nombre = pb.nombre, respuesta_por_fase = pb.respuesta_por_fase, objetivo = pb.objetivo, instrucciones_terapeuta = pb.instrucciones_terapeuta
from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Derivar Relaciones de Oposición en Redes Combinatorias';

-- 3.3.5 retirado antes: sin orden
update programas_base set orden = null where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones de Comparación';

-- Retirar ¿Por qué? (3.7.2) y cerrar el hueco
update programas_base pb set orden = pb.orden - 1
from programas_base q where q.clinica_id is null and q.nombre = 'Responder a Preguntas ¿Por qué?' and q.orden is not null
  and pb.clinica_id is null and pb.dominio_id = q.dominio_id and pb.orden > q.orden;
update programas_base set activo = false, orden = null where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?';

-- Requisitos: 3.2.2 → nuevo vínculo mutuo; red de oposición → nuevo vínculo mutuo; ¿Por qué? → Abstraer Claves Causales
update requisitos_programa rq set requisito_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición')
where rq.requisito_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos')
  and not exists (select 1 from requisitos_programa x where x.programa_base_id = rq.programa_base_id and x.requisito_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'));
update requisitos_programa rq set requisito_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición')
where rq.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Oposición en Redes Combinatorias')
  and rq.requisito_id = (select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones de Oposición en Redes Combinatorias (figuras, retirado)');
insert into requisitos_programa (programa_base_id, requisito_id)
select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Oposición'), id
from programas_base where clinica_id is null and nombre = 'Abstraer Claves de Oposición' on conflict do nothing;
insert into requisitos_programa (programa_base_id, requisito_id)
select rq.programa_base_id, (select id from programas_base where clinica_id is null and nombre = 'Abstraer Claves Causales')
from requisitos_programa rq where rq.requisito_id = (select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?')
on conflict do nothing;
delete from requisitos_programa where requisito_id = (select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?');

-- Referencias en las instrucciones
update programas_base set instrucciones_terapeuta = replace(instrucciones_terapeuta, '"Vincular Mutuamente Opuestos"', '"Vincular Mutuamente Relaciones de Oposición"')
where clinica_id is null and activo and instrucciones_terapeuta like '%"Vincular Mutuamente Opuestos"%';
update programas_base set instrucciones_terapeuta = replace(replace(replace(instrucciones_terapeuta,
  '"Abstraer Claves Causales" y "Responder a Preguntas ¿Por qué?"', '"Abstraer Claves Causales"'),
  '"Responder a Preguntas ¿Por qué?" y "Vincular Mutuamente Relaciones Condicionales"', '"Vincular Mutuamente Relaciones Condicionales"'),
  '(ver "Responder a Preguntas ¿Por qué?" del dominio 3.7)', '(ver "Abstraer Claves Causales" del dominio 3.7)')
where clinica_id is null and activo and instrucciones_terapeuta like '%Responder a Preguntas ¿Por qué?%';
update programas_alumno pa set instrucciones_terapeuta = pb.instrucciones_terapeuta
from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.activo
  and pb.nombre in ('Vincular Mutuamente Relaciones de Comparación', 'Completar Analogías Verbales', 'Derivar Relaciones Causales en Redes Combinatorias', 'Vincular Mutuamente Relaciones Condicionales', 'Diferenciar Seguir Reglas por Quién las Da o por sus Consecuencias');

commit;
