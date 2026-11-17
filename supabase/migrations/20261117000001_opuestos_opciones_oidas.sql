-- Vincular Mutuamente Opuestos: 8 grupos con opciones de la propia clase en audio.
-- Pares reales distintos de los de «Abstraer Claves de Oposición»; cada grupo es de una sola
-- categoría (adjetivos, verbos o nombres) para que el distractor sea del mismo tipo.

begin;

delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos');

with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'), 'Clase 1', 'Grupo 1', '{"entrenamiento:A→B": "¿Qué es lo contrario de despierto?", "test_mutuo:B→A": "¿Qué es lo contrario de dormido?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A1', 'A', 'Despierto', null),
  ('B1', 'B', 'Dormido', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'), 'Clase 2', 'Grupo 1', '{"entrenamiento:A→B": "¿Qué es lo contrario de triste?", "test_mutuo:B→A": "¿Qué es lo contrario de contento?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A2', 'A', 'Triste', null),
  ('B2', 'B', 'Contento', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'), 'Clase 3', 'Grupo 1', '{"entrenamiento:A→B": "¿Qué es lo contrario de duro?", "test_mutuo:B→A": "¿Qué es lo contrario de blando?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A3', 'A', 'Duro', null),
  ('B3', 'B', 'Blando', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'), 'Clase 4', 'Grupo 2', '{"entrenamiento:A→B": "¿Qué es lo contrario de viejo?", "test_mutuo:B→A": "¿Qué es lo contrario de nuevo?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A4', 'A', 'Viejo', null),
  ('B4', 'B', 'Nuevo', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'), 'Clase 5', 'Grupo 2', '{"entrenamiento:A→B": "¿Qué es lo contrario de ruidoso?", "test_mutuo:B→A": "¿Qué es lo contrario de silencioso?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A5', 'A', 'Ruidoso', null),
  ('B5', 'B', 'Silencioso', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'), 'Clase 6', 'Grupo 2', '{"entrenamiento:A→B": "¿Qué es lo contrario de salado?", "test_mutuo:B→A": "¿Qué es lo contrario de dulce?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A6', 'A', 'Salado', null),
  ('B6', 'B', 'Dulce', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'), 'Clase 7', 'Grupo 3', '{"entrenamiento:A→B": "¿Qué es lo contrario de bueno?", "test_mutuo:B→A": "¿Qué es lo contrario de malo?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A7', 'A', 'Bueno', null),
  ('B7', 'B', 'Malo', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'), 'Clase 8', 'Grupo 3', '{"entrenamiento:A→B": "¿Qué es lo contrario de difícil?", "test_mutuo:B→A": "¿Qué es lo contrario de fácil?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A8', 'A', 'Difícil', null),
  ('B8', 'B', 'Fácil', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'), 'Clase 9', 'Grupo 3', '{"entrenamiento:A→B": "¿Qué es lo contrario de sano?", "test_mutuo:B→A": "¿Qué es lo contrario de enfermo?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A9', 'A', 'Sano', null),
  ('B9', 'B', 'Enfermo', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'), 'Clase 10', 'Grupo 4', '{"entrenamiento:A→B": "¿Qué es lo contrario de débil?", "test_mutuo:B→A": "¿Qué es lo contrario de fuerte?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A10', 'A', 'Débil', null),
  ('B10', 'B', 'Fuerte', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'), 'Clase 11', 'Grupo 4', '{"entrenamiento:A→B": "¿Qué es lo contrario de claro?", "test_mutuo:B→A": "¿Qué es lo contrario de oscuro?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A11', 'A', 'Claro', null),
  ('B11', 'B', 'Oscuro', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'), 'Clase 12', 'Grupo 4', '{"entrenamiento:A→B": "¿Qué es lo contrario de feo?", "test_mutuo:B→A": "¿Qué es lo contrario de bonito?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A12', 'A', 'Feo', null),
  ('B12', 'B', 'Bonito', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'), 'Clase 13', 'Grupo 5', '{"entrenamiento:A→B": "¿Qué es lo contrario de tranquilo?", "test_mutuo:B→A": "¿Qué es lo contrario de nervioso?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A13', 'A', 'Tranquilo', null),
  ('B13', 'B', 'Nervioso', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'), 'Clase 14', 'Grupo 5', '{"entrenamiento:A→B": "¿Qué es lo contrario de áspero?", "test_mutuo:B→A": "¿Qué es lo contrario de suave?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A14', 'A', 'Áspero', null),
  ('B14', 'B', 'Suave', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'), 'Clase 15', 'Grupo 5', '{"entrenamiento:A→B": "¿Qué es lo contrario de valiente?", "test_mutuo:B→A": "¿Qué es lo contrario de miedoso?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A15', 'A', 'Valiente', null),
  ('B15', 'B', 'Miedoso', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'), 'Clase 16', 'Grupo 6', '{"entrenamiento:A→B": "¿Qué es lo contrario de bajar?", "test_mutuo:B→A": "¿Qué es lo contrario de subir?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A16', 'A', 'Bajar', null),
  ('B16', 'B', 'Subir', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'), 'Clase 17', 'Grupo 6', '{"entrenamiento:A→B": "¿Qué es lo contrario de entrar?", "test_mutuo:B→A": "¿Qué es lo contrario de salir?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A17', 'A', 'Entrar', null),
  ('B17', 'B', 'Salir', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'), 'Clase 18', 'Grupo 6', '{"entrenamiento:A→B": "¿Qué es lo contrario de perder?", "test_mutuo:B→A": "¿Qué es lo contrario de ganar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A18', 'A', 'Perder', null),
  ('B18', 'B', 'Ganar', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'), 'Clase 19', 'Grupo 7', '{"entrenamiento:A→B": "¿Qué es lo contrario de reír?", "test_mutuo:B→A": "¿Qué es lo contrario de llorar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A19', 'A', 'Reír', null),
  ('B19', 'B', 'Llorar', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'), 'Clase 20', 'Grupo 7', '{"entrenamiento:A→B": "¿Qué es lo contrario de terminar?", "test_mutuo:B→A": "¿Qué es lo contrario de empezar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A20', 'A', 'Terminar', null),
  ('B20', 'B', 'Empezar', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'), 'Clase 21', 'Grupo 7', '{"entrenamiento:A→B": "¿Qué es lo contrario de recordar?", "test_mutuo:B→A": "¿Qué es lo contrario de olvidar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A21', 'A', 'Recordar', null),
  ('B21', 'B', 'Olvidar', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'), 'Clase 22', 'Grupo 8', '{"entrenamiento:A→B": "¿Qué es lo contrario de la noche?", "test_mutuo:B→A": "¿Qué es lo contrario del día?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A22', 'A', 'La noche', null),
  ('B22', 'B', 'El día', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'), 'Clase 23', 'Grupo 8', '{"entrenamiento:A→B": "¿Qué es lo contrario del verano?", "test_mutuo:B→A": "¿Qué es lo contrario del invierno?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A23', 'A', 'El verano', null),
  ('B23', 'B', 'El invierno', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos'), 'Clase 24', 'Grupo 8', '{"entrenamiento:A→B": "¿Qué es lo contrario del final?", "test_mutuo:B→A": "¿Qué es lo contrario del principio?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A24', 'A', 'El final', null),
  ('B24', 'B', 'El principio', null)) x(etiqueta, posicion, nombre, concepto);

update programas_base set
  opciones_clase = true,
  consignas = null,
  objetivo = 'El alumno relaciona palabras con su opuesto y deriva la relación inversa: si A es lo contrario de B, B es lo contrario de A, con adjetivos, verbos y nombres, sin apoyo de propiedades físicas.',
  materiales = 'Grupos de 3 (o más) clases con 2 miembros:

A: El polo por el que se pregunta en el entrenamiento, en palabra
B: El polo contrario, en palabra

Pares reales distintos de los trabajados en "Abstraer Claves de Oposición", para comprobar que la clave se aplica a estímulos verbales y no a pares ya conocidos. Cada grupo es de una sola categoría (adjetivos, verbos o nombres con artículo), para que el distractor sea siempre del mismo tipo que la respuesta. Las opciones son verbales: en cada ensayo se dicen, una a una, la palabra preguntada, su contraria y la palabra de respuesta de otro par del grupo (distractor), y el alumno elige una (en la tableta, tocando su tarjeta de audio). Se alterna qué polo se pregunta en el entrenamiento, para que la respuesta no sea siempre el polo «negativo».',
  instrucciones_terapeuta = '
Requisito previo: el alumno ha superado "Abstraer Claves de Oposición" (dominio 3.2), incluida la sonda de generalización, y nombra cada polo por separado (ver "Vincular Mutuamente Características con sus Nombres" del dominio 2.1).

Opciones de respuesta: en cada ensayo, diga una a una la palabra preguntada, su contraria y la palabra de respuesta de otro par del grupo (ej. ante "¿Qué es lo contrario de despierto?": «Despierto», «Dormido», «Blando»); el alumno elige una. Elegir la palabra preguntada indica que repite lo oído; elegir la de otro par, que responde a una palabra diferente pero no opuesta (distinción y no oposición).

Fase 1 - Entrenamiento directo (A → B):

1. Pregunte "¿Qué es lo contrario de ___?" (ej. "¿Qué es lo contrario de despierto?").
2. Refuerce las respuestas correctas hasta alcanzar el criterio de dominio.

Fase 2 - Test de Vinculación Mutua (B → A), sin entrenamiento directo:

1. Pregunte por el contrario del polo B (ej. "¿Qué es lo contrario de dormido?"), sin haber entrenado antes esta dirección.
2. No refuerce diferencialmente durante estos ensayos (evite dar pistas de si es correcto o incorrecto), pero registre la respuesta.
3. Si el alumno responde correctamente sin haber sido entrenado en esa dirección, se considera evidencia de vinculación mutua de oposición.
4. Si falla sistemáticamente, entrene también esta dirección de forma directa.

Nota: son pares reales, por lo que el alumno puede haber aprendido ya la dirección del test fuera de las sesiones. Considere la relación DERIVADA solo si esa dirección no se ha enseñado antes; si lo sabe por su historia, anótelo en las notas del bloque.

Generalización (sondas): pares nuevos en contexto natural (ej. "La puerta está abierta; ¿cómo estaría al contrario?").

Realice el primer bloque de cada test sin ayudas. Si el alumno alcanza el criterio, la relación se considera DERIVADA; si se enseña con ayudas, quedará registrada como DOMINADA (no derivada), aunque el último bloque se realice sin ayudas.

Registro en la app (fase · posición origen → destino; el destino es la respuesta correcta):
- Entrenamiento: A → B ("¿Qué es lo contrario de despierto?"; la respuesta es B)
- Test de vínculo mutuo: B → A ("¿Qué es lo contrario de dormido?"; la respuesta es A)
Las sondas de generalización se registran con las mismas posiciones, eligiendo "Sonda de generalización" como tipo de bloque una vez dominada la combinación.

Grupos de estímulos: los grupos y clases de este programa son un ejemplo. Cree en el PEI del alumno tantos grupos como considere oportuno, incluido un grupo de generalización con estímulos nuevos. En ese grupo, el primer bloque de entrenamiento realizado sin ayudas y sin reforzar diferencialmente funciona como sonda: si el alumno alcanza el criterio a la primera, hay generalización a estímulos nuevos (anótelo en las notas del bloque). Los tests de ese grupo se habilitan cuando su entrenamiento está dominado. Las sondas con los mismos estímulos en otro contexto o con otra persona se registran como "Sonda de generalización" en el grupo ya dominado.'
where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos';

commit;
