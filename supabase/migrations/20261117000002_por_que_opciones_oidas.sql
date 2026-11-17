-- Responder a Preguntas ¿Por qué?: 8 grupos con opciones de la propia clase en audio.
-- Causas y efectos cotidianos (A = causa, B = efecto); conector si/cuando alternado.

begin;

delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?');

with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'), 'Clase 1', 'Grupo 1', '{"entrenamiento:A→B": "Si llueve, ¿qué hacemos?", "test_mutuo:B→A": "¿Por qué abrimos el paraguas?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A1', 'A', 'Llueve', null),
  ('B1', 'B', 'Abrimos el paraguas', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'), 'Clase 2', 'Grupo 1', '{"entrenamiento:A→B": "Si tenemos hambre, ¿qué hacemos?", "test_mutuo:B→A": "¿Por qué comemos?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A2', 'A', 'Tenemos hambre', null),
  ('B2', 'B', 'Comemos', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'), 'Clase 3', 'Grupo 1', '{"entrenamiento:A→B": "Cuando tenemos sueño, ¿qué hacemos?", "test_mutuo:B→A": "¿Por qué dormimos?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A3', 'A', 'Tenemos sueño', null),
  ('B3', 'B', 'Dormimos', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'), 'Clase 4', 'Grupo 2', '{"entrenamiento:A→B": "Cuando hace frío, ¿qué hacemos?", "test_mutuo:B→A": "¿Por qué nos ponemos el abrigo?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A4', 'A', 'Hace frío', null),
  ('B4', 'B', 'Nos ponemos el abrigo', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'), 'Clase 5', 'Grupo 2', '{"entrenamiento:A→B": "Si tenemos sed, ¿qué hacemos?", "test_mutuo:B→A": "¿Por qué bebemos agua?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A5', 'A', 'Tenemos sed', null),
  ('B5', 'B', 'Bebemos agua', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'), 'Clase 6', 'Grupo 2', '{"entrenamiento:A→B": "Si tenemos las manos sucias, ¿qué hacemos?", "test_mutuo:B→A": "¿Por qué nos lavamos las manos?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A6', 'A', 'Tenemos las manos sucias', null),
  ('B6', 'B', 'Nos lavamos las manos', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'), 'Clase 7', 'Grupo 3', '{"entrenamiento:A→B": "Cuando es de noche, ¿qué hacemos?", "test_mutuo:B→A": "¿Por qué encendemos la luz?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A7', 'A', 'Es de noche', null),
  ('B7', 'B', 'Encendemos la luz', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'), 'Clase 8', 'Grupo 3', '{"entrenamiento:A→B": "Cuando suena el timbre, ¿qué hacemos?", "test_mutuo:B→A": "¿Por qué abrimos la puerta?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A8', 'A', 'Suena el timbre', null),
  ('B8', 'B', 'Abrimos la puerta', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'), 'Clase 9', 'Grupo 3', '{"entrenamiento:A→B": "Si hace calor, ¿qué hacemos?", "test_mutuo:B→A": "¿Por qué encendemos el ventilador?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A9', 'A', 'Hace calor', null),
  ('B9', 'B', 'Encendemos el ventilador', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'), 'Clase 10', 'Grupo 4', '{"entrenamiento:A→B": "Si el bebé llora, ¿qué hacemos?", "test_mutuo:B→A": "¿Por qué cogemos al bebé en brazos?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A10', 'A', 'El bebé llora', null),
  ('B10', 'B', 'Cogemos al bebé en brazos', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'), 'Clase 11', 'Grupo 4', '{"entrenamiento:A→B": "Cuando nos hacemos una herida, ¿qué hacemos?", "test_mutuo:B→A": "¿Por qué nos ponemos una tirita?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A11', 'A', 'Nos hacemos una herida', null),
  ('B11', 'B', 'Nos ponemos una tirita', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'), 'Clase 12', 'Grupo 4', '{"entrenamiento:A→B": "Cuando tenemos mocos, ¿qué hacemos?", "test_mutuo:B→A": "¿Por qué nos sonamos la nariz?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A12', 'A', 'Tenemos mocos', null),
  ('B12', 'B', 'Nos sonamos la nariz', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'), 'Clase 13', 'Grupo 5', '{"entrenamiento:A→B": "Si hace mucho sol, ¿qué hacemos?", "test_mutuo:B→A": "¿Por qué nos ponemos la gorra?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A13', 'A', 'Hace mucho sol', null),
  ('B13', 'B', 'Nos ponemos la gorra', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'), 'Clase 14', 'Grupo 5', '{"entrenamiento:A→B": "Si estamos cansados, ¿qué hacemos?", "test_mutuo:B→A": "¿Por qué nos sentamos?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A14', 'A', 'Estamos cansados', null),
  ('B14', 'B', 'Nos sentamos', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'), 'Clase 15', 'Grupo 5', '{"entrenamiento:A→B": "Cuando la sopa quema, ¿qué hacemos?", "test_mutuo:B→A": "¿Por qué soplamos la sopa?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A15', 'A', 'La sopa quema', null),
  ('B15', 'B', 'Soplamos la sopa', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'), 'Clase 16', 'Grupo 6', '{"entrenamiento:A→B": "Cuando el suelo está sucio, ¿qué hacemos?", "test_mutuo:B→A": "¿Por qué barremos?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A16', 'A', 'El suelo está sucio', null),
  ('B16', 'B', 'Barremos', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'), 'Clase 17', 'Grupo 6', '{"entrenamiento:A→B": "Si el juguete está roto, ¿qué hacemos?", "test_mutuo:B→A": "¿Por qué arreglamos el juguete?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A17', 'A', 'El juguete está roto', null),
  ('B17', 'B', 'Arreglamos el juguete', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'), 'Clase 18', 'Grupo 6', '{"entrenamiento:A→B": "Si el perro tiene hambre, ¿qué hacemos?", "test_mutuo:B→A": "¿Por qué damos de comer al perro?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A18', 'A', 'El perro tiene hambre', null),
  ('B18', 'B', 'Damos de comer al perro', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'), 'Clase 19', 'Grupo 7', '{"entrenamiento:A→B": "Cuando el semáforo está en rojo, ¿qué hacemos?", "test_mutuo:B→A": "¿Por qué nos paramos?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A19', 'A', 'El semáforo está en rojo', null),
  ('B19', 'B', 'Nos paramos', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'), 'Clase 20', 'Grupo 7', '{"entrenamiento:A→B": "Cuando hay mucho ruido, ¿qué hacemos?", "test_mutuo:B→A": "¿Por qué nos tapamos los oídos?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A20', 'A', 'Hay mucho ruido', null),
  ('B20', 'B', 'Nos tapamos los oídos', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'), 'Clase 21', 'Grupo 7', '{"entrenamiento:A→B": "Si se acaba el recreo, ¿qué hacemos?", "test_mutuo:B→A": "¿Por qué volvemos a clase?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A21', 'A', 'Se acaba el recreo', null),
  ('B21', 'B', 'Volvemos a clase', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'), 'Clase 22', 'Grupo 8', '{"entrenamiento:A→B": "Si está nevando, ¿qué hacemos?", "test_mutuo:B→A": "¿Por qué nos ponemos los guantes?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A22', 'A', 'Está nevando', null),
  ('B22', 'B', 'Nos ponemos los guantes', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'), 'Clase 23', 'Grupo 8', '{"entrenamiento:A→B": "Cuando tenemos el pelo mojado, ¿qué hacemos?", "test_mutuo:B→A": "¿Por qué nos secamos el pelo?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A23', 'A', 'Tenemos el pelo mojado', null),
  ('B23', 'B', 'Nos secamos el pelo', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?'), 'Clase 24', 'Grupo 8', '{"entrenamiento:A→B": "Cuando es el cumpleaños de Lu, ¿qué hacemos?", "test_mutuo:B→A": "¿Por qué cantamos cumpleaños feliz?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A24', 'A', 'Es el cumpleaños de Lu', null),
  ('B24', 'B', 'Cantamos cumpleaños feliz', null)) x(etiqueta, posicion, nombre, concepto);

update programas_base set
  opciones_clase = true,
  consignas = null,
  objetivo = 'El alumno responde a preguntas "¿Por qué…?" indicando la causa de un hecho o acción cotidiana ("¿Por qué abrimos el paraguas?" → "Llueve"), derivando la relación efecto → causa a partir de la relación causa → efecto entrenada, tanto si esta se enuncia con «si» como con «cuando».',
  materiales = 'Grupos de 3 (o más) clases con 2 miembros:

A: Causa (situación o estado: "Llueve", "Tenemos hambre")
B: Efecto (lo que hacemos: "Abrimos el paraguas", "Comemos")

Causas y efectos cotidianos. Las opciones son verbales: en cada ensayo se dicen, una a una, la causa y el efecto de la clase y un tercer elemento de otra clase del grupo que ocupa el mismo papel que la respuesta (otro efecto en el entrenamiento, otra causa en el test), y el alumno elige uno (en la tableta, tocando su tarjeta de audio). Las causas se dicen sin «porque». En la mitad de las clases la pregunta de entrenamiento empieza con «Si» y en la otra mitad con «Cuando».',
  instrucciones_terapeuta = '
Requisito previo: el alumno ha superado "Abstraer Claves Causales" (dominio 3.7), conoce el vocabulario de las causas y los efectos de cada clase (ej. nombra "lluvia" y "paraguas"; ver programas del dominio 2.1) y responde a preguntas "¿Qué…?" sencillas.

Opciones de respuesta: en cada ensayo, diga una a una la causa, el efecto y un tercer elemento de otra clase del grupo con el mismo papel que la respuesta (ej. ante "¿Por qué abrimos el paraguas?": «Llueve», «Abrimos el paraguas», «Tenemos sueño»); el alumno elige uno. Elegir el efecto ante "¿Por qué…?" indica que repite lo oído; elegir otra causa, que no relaciona esa causa con ese efecto.

Fase 1 - Entrenamiento directo (causa → efecto):

1. Presente la causa y pregunte por su consecuencia (ej. "Si llueve, ¿qué hacemos?"; en la mitad de las clases, "Cuando llueve, ¿qué hacemos?").
2. Refuerce las respuestas correctas ("Abrimos el paraguas") hasta alcanzar el criterio de dominio.

Fase 2 - Test de Vinculación Mutua causal (efecto → causa), sin entrenamiento directo:

1. Presente el efecto y pregunte por la causa (ej. "¿Por qué abrimos el paraguas?"), sin haber entrenado antes esta dirección.
2. No refuerce diferencialmente durante estos ensayos (evite dar pistas de si es correcto o incorrecto), pero registre la respuesta.
3. Si el alumno indica la causa sin haber sido entrenado en esa dirección, se considera evidencia de vinculación mutua causal.
4. Si falla sistemáticamente, entrene también esta dirección de forma directa con múltiples ejemplares y vuelva a testar con clases nuevas.

Nota: son situaciones cotidianas, por lo que el alumno puede haber aprendido ya la dirección del test fuera de las sesiones. Considere la relación DERIVADA solo si esa dirección no se ha enseñado antes; si lo sabe por su historia, anótelo en las notas del bloque.

Fase 3 - Generalización:

1. Pruebe la respuesta con causas y efectos no entrenados en este programa, incluyendo situaciones reales del momento (ej. "¿Por qué te pones el abrigo?" al salir a la calle), ya con respuesta oral libre ("Porque hace frío").
2. Varíe la forma de la pregunta ("¿Por qué…?", "¿Para qué…?" cuando proceda) y la persona que pregunta para promover generalización.

Realice el primer bloque de cada test sin ayudas. Si el alumno alcanza el criterio, la relación se considera DERIVADA; si se enseña con ayudas, quedará registrada como DOMINADA (no derivada), aunque el último bloque se realice sin ayudas.

Registro en la app (fase · posición origen → destino; el destino es la respuesta correcta):
- Entrenamiento: A → B ("Si llueve, ¿qué hacemos?"; la respuesta es el efecto)
- Test de vínculo mutuo: B → A ("¿Por qué abrimos el paraguas?"; la respuesta es la causa)
Las sondas de generalización (situaciones reales nuevas) se registran en B → A, eligiendo "Sonda de generalización" como tipo de bloque una vez dominada la combinación.

Grupos de estímulos: los grupos y clases de este programa son un ejemplo. Cree en el PEI del alumno tantos grupos como considere oportuno, incluido un grupo de generalización con estímulos nuevos. En ese grupo, el primer bloque de entrenamiento realizado sin ayudas y sin reforzar diferencialmente funciona como sonda: si el alumno alcanza el criterio a la primera, hay generalización a estímulos nuevos (anótelo en las notas del bloque). Los tests de ese grupo se habilitan cuando su entrenamiento está dominado. Las sondas con los mismos estímulos en otro contexto o con otra persona se registran como "Sonda de generalización" en el grupo ya dominado.'
where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?';

commit;
