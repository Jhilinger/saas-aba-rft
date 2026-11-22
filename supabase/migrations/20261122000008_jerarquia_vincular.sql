-- Jerarquía (Villarroel y Luciano; Luciano et al., 2009). Nuevo «Vincular Mutuamente Relaciones
-- Jerárquicas»: solo «es un», miembros reales y luego inventados, lo común y lo propio, y
-- transformación en los dos sentidos (arriba abajo y «algunos, no todos»). Sustituye a
-- «Clasificar en Categorías» y absorbe «Transferir Funciones a través de Relaciones Jerárquicas».
begin;

insert into programas_base (nombre, tipo, area, dominio_id, orden, visibilidad, objetivo, materiales, instrucciones_terapeuta, ayudas_posibles,
  ensayos_por_bloque, bloques_para_dominio, porcentaje_dominio, tipo_relacion, formato_recogida, nivel_rft, tipo_respuesta, opciones_respuesta,
  respuesta_por_fase, secuencia_rft, opciones_clase, activo, creado_por)
select 'Vincular Mutuamente Relaciones Jerárquicas', 'rft', pb.area, pb.dominio_id, 2, pb.visibilidad, $t$A partir de una relación de pertenencia («Toby es un perro»; «El BRIL es una fruta»), el alumno identifica la categoría del miembro y el miembro de la categoría, y transforma funciones en los dos sentidos: de arriba abajo, lo común de la categoría pasa al miembro y lo de otra categoría no («Los perros ladran… ¿Ladra Toby?» → Sí; «¿Maúlla Toby?» → No); de abajo arriba, lo propio del miembro solo pasa a algunos («Toby es blanco. ¿Todos los perros son blancos?» → No; «¿Alguno es blanco?» → Sí) (Villarroel y Luciano; Luciano et al., 2009).$t$, $t$Grupos de 3 (o más) clases con 2 miembros:

A: Categoría (Perro, Fruta…)
B: Miembro de la categoría: un individuo con nombre de una categoría real (Toby, el perro) o un objeto inventado de una categoría real (el BRIL, una fruta)

Solo la clave «es un / una»: los atributos y las funciones de los objetos se trabajan en «Responder a Preguntas sobre Características / Funciones» (2.3) y la relación parte-todo («es parte de») queda fuera, porque se aprende de otra forma (Villarroel y Luciano). Los grupos 1 a 3 usan categorías y miembros reales y los demás, miembros inventados (Luciano et al., 2009: empezar por lo no arbitrario). En cada clase se trabaja lo común de la categoría (ladran, se guardan en el frutero) y lo propio del miembro (es blanco, tiene manchas azules). En la tableta, las opciones son los dos miembros y uno de otra clase del grupo; en la transformación, «Sí» y «No».$t$, $t$
Requisito previo: el alumno ha superado "Abstraer Claves de Clasificación" (dominio 3.6) y conoce las características y funciones de los objetos que se usan (dominio 2.2 y 2.3).

Lo común y lo propio (Villarroel y Luciano): la clave «es un» se aprende filtrando a la vez lo que comparten los miembros de una categoría y lo que distingue a cada uno. Si solo se trabaja lo común, el alumno transformará de arriba abajo pero no de abajo arriba. Antes del registro, y durante el entrenamiento, practique con ejemplos reales: "Toby es un perro; ladra y es blanco. Rocky es un perro; ladra y es marrón. ¿Son iguales Toby y Rocky?" ("No: uno es blanco y el otro marrón"); "¿Son perros los dos? ¿Por qué?" ("Sí, porque ladran"); "Dime todos los perros que conoces y todo lo que hacen". Varíe la forma de preguntar ("¿Qué es…?", "Dime todo lo que sabes de…", "¿Por qué es…?"), porque cambia lo que se deriva.

Fase 1 - Entrenamiento (B → A): diga la pertenencia y pregunte por la categoría: "Toby es un perro. ¿Qué es Toby?" (respuesta: Perro). Refuerce hasta alcanzar el criterio de dominio.

Fase 2 - Test de Vinculación Mutua (A → B), sin entrenamiento directo: "Toby es un perro. ¿Cuál de estos es un perro?" (respuesta: Toby). No refuerce diferencialmente durante estos ensayos, pero registre la respuesta.

Fase 3 - Test de Transformación de Funciones, sin entrenamiento directo (respuesta «Sí» o «No»):

1. De arriba abajo (A → B): lo común de la categoría pasa al miembro, y lo de otra categoría no: "Los perros ladran. Toby es un perro. ¿Ladra Toby?" (Sí); "Los gatos maúllan y los perros ladran. Misi es un gato. ¿Ladra Misi?" (No). Con miembros inventados: "Las frutas se guardan en el frutero. El BRIL es una fruta. ¿Se guarda el BRIL en el frutero?".
2. De abajo arriba (B → A): lo propio del miembro solo pasa a algunos de la categoría: "Toby es un perro. Toby es blanco. ¿Todos los perros son blancos?" (No); "… ¿Alguno de los perros es blanco?" (Sí).
3. No refuerce diferencialmente durante estos ensayos, pero registre la respuesta. Responder «Sí» a «todos» indica que aplica a toda la categoría lo que solo es de un miembro; responder «Sí» a la función de otra categoría, que mezcla lo de un grupo con lo de otro.

Generalización (sondas): categorías y miembros nuevos (ej. "La ballena es un mamífero; los mamíferos respiran aire. ¿Respira aire la ballena?").

Realice el primer bloque de cada test sin ayudas. Si el alumno alcanza el criterio, la relación se considera DERIVADA; si se enseña con ayudas, quedará registrada como DOMINADA (no derivada), aunque el último bloque se realice sin ayudas.

Oyente y hablante: elija la forma en cada bloque al tomar datos. Como oyente, el alumno elige entre las opciones; como hablante, la tableta solo muestra la frase: el alumno responde y usted marca la respuesta. Cada forma se domina por separado (Luciano et al., 2009).

Registro en la app (fase · posición origen → destino):
- Entrenamiento: B → A ("Toby es un perro. ¿Qué es Toby?"; la respuesta es A)
- Test de vínculo mutuo: A → B ("¿Cuál de estos es un perro?"; la respuesta es B)
- Transformación de funciones: A → B (de arriba abajo; «Sí» o «No») y B → A (de abajo arriba, «todos» / «alguno»; «Sí» o «No»)
Las sondas con los mismos estímulos en otro contexto o con otra persona se registran con las mismas posiciones, eligiendo "Sonda de generalización" como tipo de bloque una vez dominada la combinación.

Grupos de estímulos: los grupos y clases de este programa son un ejemplo. Cree en el PEI del alumno tantos grupos como considere oportuno, incluido un grupo de generalización con estímulos nuevos. En ese grupo, el primer bloque de entrenamiento realizado sin ayudas y sin reforzar diferencialmente funciona como sonda: si el alumno alcanza el criterio a la primera, hay generalización a estímulos nuevos (anótelo en las notas del bloque). Los tests de ese grupo se habilitan cuando su entrenamiento está dominado.

Registro: en este programa los datos se toman solo en la tableta, que presenta la frase y las opciones (como hablante, solo la frase; usted marca la respuesta). Para el alumno que no lee, léale usted la frase.

Fuera de la tableta (sin registro): con contenedores reales, "El BRIL es una fruta. Las frutas se guardan en el frutero. Guarda el BRIL" (con un objeto que haga de BRIL); y en el día a día, preguntas sobre categorías y miembros reales nuevos.$t$, $t$(Aplicables en la fase de entrenamiento, o en los tests solo después de un primer bloque sin ayudas que no alcance el criterio; la relación se registrará entonces como dominada, no derivada)

- Verbal parcial: repetir la pertenencia ("Toby es un perro") antes de la pregunta
- Visual: dibujar la categoría como un círculo con el miembro dentro y retirarlo antes de la pregunta
- Gestual: señalar la opción correcta en la pantalla (solo como oyente)
- Modelado: el terapeuta responde primero con otra clase como ejemplo, diciendo por qué ("porque los perros ladran"; "no todos: solo Toby es blanco")$t$,
  10, 3, 90, 'jerarquia', 'ensayo_discreto', 'mutuo', 'seleccion', null,
  '{"transformacion_funciones": {"tipo": "opciones", "opciones": ["Sí", "No"]}}'::jsonb, '[{"fase": "entrenamiento", "origen": "B", "destino": "A"}, {"fase": "test_mutuo", "origen": "A", "destino": "B"}, {"fase": "transformacion_funciones", "origen": "A", "destino": "B"}, {"fase": "transformacion_funciones", "origen": "B", "destino": "A"}]'::jsonb, true, true, pb.creado_por
from programas_base pb where pb.clinica_id is null and pb.nombre = 'Clasificar en Categorías'
and not exists (select 1 from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas');

with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), 'Clase 1', 'Grupo 1', 1, $j${"entrenamiento:B→A": "Toby es un perro. ¿Qué es Toby?", "test_mutuo:A→B": "Toby es un perro. ¿Cuál de estos es un perro?", "transformacion_funciones:A→B": "Los perros ladran. Toby es un perro. ¿Ladra Toby?", "transformacion_funciones:B→A": "Toby es un perro. Toby es blanco. ¿Todos los perros son blancos?"}$j$::jsonb, $j${"transformacion_funciones:A→B": "Sí", "transformacion_funciones:B→A": "No"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A1', 'A', 'Perro'), ('B1', 'B', 'Toby')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas') and nombre = 'Clase 1');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), 'Clase 2', 'Grupo 1', 2, $j${"entrenamiento:B→A": "Misi es un gato. ¿Qué es Misi?", "test_mutuo:A→B": "Misi es un gato. ¿Cuál de estos es un gato?", "transformacion_funciones:A→B": "Los gatos maúllan y los perros ladran. Misi es un gato. ¿Ladra Misi?", "transformacion_funciones:B→A": "Misi es un gato. Misi es negro. ¿Alguno de los gatos es negro?"}$j$::jsonb, $j${"transformacion_funciones:A→B": "No", "transformacion_funciones:B→A": "Sí"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A2', 'A', 'Gato'), ('B2', 'B', 'Misi')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas') and nombre = 'Clase 2');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), 'Clase 3', 'Grupo 1', 3, $j${"entrenamiento:B→A": "Pío es un pájaro. ¿Qué es Pío?", "test_mutuo:A→B": "Pío es un pájaro. ¿Cuál de estos es un pájaro?", "transformacion_funciones:A→B": "Los pájaros vuelan. Pío es un pájaro. ¿Vuela Pío?", "transformacion_funciones:B→A": "Pío es un pájaro. Pío es amarillo. ¿Todos los pájaros son amarillos?"}$j$::jsonb, $j${"transformacion_funciones:A→B": "Sí", "transformacion_funciones:B→A": "No"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A3', 'A', 'Pájaro'), ('B3', 'B', 'Pío')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas') and nombre = 'Clase 3');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), 'Clase 4', 'Grupo 2', 4, $j${"entrenamiento:B→A": "Burbuja es un pez. ¿Qué es Burbuja?", "test_mutuo:A→B": "Burbuja es un pez. ¿Cuál de estos es un pez?", "transformacion_funciones:A→B": "Los peces nadan y los pájaros vuelan. Burbuja es un pez. ¿Vuela Burbuja?", "transformacion_funciones:B→A": "Burbuja es un pez. Burbuja es naranja. ¿Alguno de los peces es naranja?"}$j$::jsonb, $j${"transformacion_funciones:A→B": "No", "transformacion_funciones:B→A": "Sí"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A4', 'A', 'Pez'), ('B4', 'B', 'Burbuja')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas') and nombre = 'Clase 4');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), 'Clase 5', 'Grupo 2', 5, $j${"entrenamiento:B→A": "Lola es una vaca. ¿Qué es Lola?", "test_mutuo:A→B": "Lola es una vaca. ¿Cuál de estos es una vaca?", "transformacion_funciones:A→B": "Las vacas dan leche. Lola es una vaca. ¿Da leche Lola?", "transformacion_funciones:B→A": "Lola es una vaca. Lola tiene manchas. ¿Todas las vacas tienen manchas?"}$j$::jsonb, $j${"transformacion_funciones:A→B": "Sí", "transformacion_funciones:B→A": "No"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A5', 'A', 'Vaca'), ('B5', 'B', 'Lola')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas') and nombre = 'Clase 5');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), 'Clase 6', 'Grupo 2', 6, $j${"entrenamiento:B→A": "Pita es una gallina. ¿Qué es Pita?", "test_mutuo:A→B": "Pita es una gallina. ¿Cuál de estos es una gallina?", "transformacion_funciones:A→B": "Las gallinas ponen huevos y las vacas dan leche. Pita es una gallina. ¿Da leche Pita?", "transformacion_funciones:B→A": "Pita es una gallina. Pita es marrón. ¿Alguna de las gallinas es marrón?"}$j$::jsonb, $j${"transformacion_funciones:A→B": "No", "transformacion_funciones:B→A": "Sí"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A6', 'A', 'Gallina'), ('B6', 'B', 'Pita')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas') and nombre = 'Clase 6');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), 'Clase 7', 'Grupo 3', 7, $j${"entrenamiento:B→A": "Rayo es un coche. ¿Qué es Rayo?", "test_mutuo:A→B": "Rayo es un coche. ¿Cuál de estos es un coche?", "transformacion_funciones:A→B": "Los coches van por la carretera. Rayo es un coche. ¿Va por la carretera Rayo?", "transformacion_funciones:B→A": "Rayo es un coche. Rayo es rojo. ¿Todos los coches son rojos?"}$j$::jsonb, $j${"transformacion_funciones:A→B": "Sí", "transformacion_funciones:B→A": "No"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A7', 'A', 'Coche'), ('B7', 'B', 'Rayo')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas') and nombre = 'Clase 7');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), 'Clase 8', 'Grupo 3', 8, $j${"entrenamiento:B→A": "Ola es un barco. ¿Qué es Ola?", "test_mutuo:A→B": "Ola es un barco. ¿Cuál de estos es un barco?", "transformacion_funciones:A→B": "Los barcos van por el mar y los aviones van por el aire. Ola es un barco. ¿Va por el aire Ola?", "transformacion_funciones:B→A": "Ola es un barco. Ola es azul. ¿Alguno de los barcos es azul?"}$j$::jsonb, $j${"transformacion_funciones:A→B": "No", "transformacion_funciones:B→A": "Sí"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A8', 'A', 'Barco'), ('B8', 'B', 'Ola')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas') and nombre = 'Clase 8');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), 'Clase 9', 'Grupo 3', 9, $j${"entrenamiento:B→A": "Nube es un avión. ¿Qué es Nube?", "test_mutuo:A→B": "Nube es un avión. ¿Cuál de estos es un avión?", "transformacion_funciones:A→B": "Los aviones van por el aire. Nube es un avión. ¿Va por el aire Nube?", "transformacion_funciones:B→A": "Nube es un avión. Nube es blanco. ¿Todos los aviones son blancos?"}$j$::jsonb, $j${"transformacion_funciones:A→B": "Sí", "transformacion_funciones:B→A": "No"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A9', 'A', 'Avión'), ('B9', 'B', 'Nube')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas') and nombre = 'Clase 9');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), 'Clase 10', 'Grupo 4', 10, $j${"entrenamiento:B→A": "El BRIL es una fruta. ¿Qué es el BRIL?", "test_mutuo:A→B": "El BRIL es una fruta. ¿Cuál de estos es una fruta?", "transformacion_funciones:A→B": "Las frutas se guardan en el frutero y los juguetes, en la caja de juguetes. El BRIL es una fruta. ¿Se guarda el BRIL en la caja de juguetes?", "transformacion_funciones:B→A": "El BRIL es una fruta. El BRIL tiene manchas azules. ¿Alguna de las frutas tiene manchas azules?"}$j$::jsonb, $j${"transformacion_funciones:A→B": "No", "transformacion_funciones:B→A": "Sí"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A10', 'A', 'Fruta'), ('B10', 'B', 'El BRIL')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas') and nombre = 'Clase 10');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), 'Clase 11', 'Grupo 4', 11, $j${"entrenamiento:B→A": "El MIRU es un juguete. ¿Qué es el MIRU?", "test_mutuo:A→B": "El MIRU es un juguete. ¿Cuál de estos es un juguete?", "transformacion_funciones:A→B": "Los juguetes se guardan en la caja de juguetes. El MIRU es un juguete. ¿Se guarda el MIRU en la caja de juguetes?", "transformacion_funciones:B→A": "El MIRU es un juguete. El MIRU hace un ruido raro. ¿Todos los juguetes hacen un ruido raro?"}$j$::jsonb, $j${"transformacion_funciones:A→B": "Sí", "transformacion_funciones:B→A": "No"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A11', 'A', 'Juguete'), ('B11', 'B', 'El MIRU')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas') and nombre = 'Clase 11');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), 'Clase 12', 'Grupo 4', 12, $j${"entrenamiento:B→A": "El FEB es un libro. ¿Qué es el FEB?", "test_mutuo:A→B": "El FEB es un libro. ¿Cuál de estos es un libro?", "transformacion_funciones:A→B": "Los libros se guardan en la estantería y los zapatos, en el zapatero. El FEB es un libro. ¿Se guarda el FEB en el zapatero?", "transformacion_funciones:B→A": "El FEB es un libro. El FEB huele a menta. ¿Alguno de los libros huele a menta?"}$j$::jsonb, $j${"transformacion_funciones:A→B": "No", "transformacion_funciones:B→A": "Sí"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A12', 'A', 'Libro'), ('B12', 'B', 'El FEB')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas') and nombre = 'Clase 12');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), 'Clase 13', 'Grupo 5', 13, $j${"entrenamiento:B→A": "El KOPI es un zapato. ¿Qué es el KOPI?", "test_mutuo:A→B": "El KOPI es un zapato. ¿Cuál de estos es un zapato?", "transformacion_funciones:A→B": "Los zapatos se guardan en el zapatero. El KOPI es un zapato. ¿Se guarda el KOPI en el zapatero?", "transformacion_funciones:B→A": "El KOPI es un zapato. El KOPI brilla en la oscuridad. ¿Todos los zapatos brillan en la oscuridad?"}$j$::jsonb, $j${"transformacion_funciones:A→B": "Sí", "transformacion_funciones:B→A": "No"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A13', 'A', 'Zapato'), ('B13', 'B', 'El KOPI')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas') and nombre = 'Clase 13');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), 'Clase 14', 'Grupo 5', 14, $j${"entrenamiento:B→A": "El MUF es un plato. ¿Qué es el MUF?", "test_mutuo:A→B": "El MUF es un plato. ¿Cuál de estos es un plato?", "transformacion_funciones:A→B": "Los platos se guardan en el armario de la cocina y las toallas, en el baño. El MUF es un plato. ¿Se guarda el MUF en el baño?", "transformacion_funciones:B→A": "El MUF es un plato. El MUF tiene rayas verdes. ¿Alguno de los platos tiene rayas verdes?"}$j$::jsonb, $j${"transformacion_funciones:A→B": "No", "transformacion_funciones:B→A": "Sí"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A14', 'A', 'Plato'), ('B14', 'B', 'El MUF')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas') and nombre = 'Clase 14');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), 'Clase 15', 'Grupo 5', 15, $j${"entrenamiento:B→A": "El FEKO es una toalla. ¿Qué es el FEKO?", "test_mutuo:A→B": "El FEKO es una toalla. ¿Cuál de estos es una toalla?", "transformacion_funciones:A→B": "Las toallas se guardan en el baño. El FEKO es una toalla. ¿Se guarda el FEKO en el baño?", "transformacion_funciones:B→A": "El FEKO es una toalla. El FEKO tiene puntos rojos. ¿Todas las toallas tienen puntos rojos?"}$j$::jsonb, $j${"transformacion_funciones:A→B": "Sí", "transformacion_funciones:B→A": "No"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A15', 'A', 'Toalla'), ('B15', 'B', 'El FEKO')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas') and nombre = 'Clase 15');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), 'Clase 16', 'Grupo 6', 16, $j${"entrenamiento:B→A": "El GAF es una herramienta. ¿Qué es el GAF?", "test_mutuo:A→B": "El GAF es una herramienta. ¿Cuál de estos es una herramienta?", "transformacion_funciones:A→B": "Las herramientas se guardan en la caja de herramientas y las medicinas, en el botiquín. El GAF es una herramienta. ¿Se guarda el GAF en el botiquín?", "transformacion_funciones:B→A": "El GAF es una herramienta. El GAF suena como una campana. ¿Alguna de las herramientas suena como una campana?"}$j$::jsonb, $j${"transformacion_funciones:A→B": "No", "transformacion_funciones:B→A": "Sí"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A16', 'A', 'Herramienta'), ('B16', 'B', 'El GAF')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas') and nombre = 'Clase 16');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), 'Clase 17', 'Grupo 6', 17, $j${"entrenamiento:B→A": "El ZOF es una medicina. ¿Qué es el ZOF?", "test_mutuo:A→B": "El ZOF es una medicina. ¿Cuál de estos es una medicina?", "transformacion_funciones:A→B": "Las medicinas se guardan en el botiquín. El ZOF es una medicina. ¿Se guarda el ZOF en el botiquín?", "transformacion_funciones:B→A": "El ZOF es una medicina. El ZOF sabe a fresa. ¿Todas las medicinas saben a fresa?"}$j$::jsonb, $j${"transformacion_funciones:A→B": "Sí", "transformacion_funciones:B→A": "No"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A17', 'A', 'Medicina'), ('B17', 'B', 'El ZOF')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas') and nombre = 'Clase 17');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), 'Clase 18', 'Grupo 6', 18, $j${"entrenamiento:B→A": "El LUF es un abrigo. ¿Qué es el LUF?", "test_mutuo:A→B": "El LUF es un abrigo. ¿Cuál de estos es un abrigo?", "transformacion_funciones:A→B": "Los abrigos se guardan en el perchero y los cubiertos, en el cajón. El LUF es un abrigo. ¿Se guarda el LUF en el cajón?", "transformacion_funciones:B→A": "El LUF es un abrigo. El LUF tiene estrellas dibujadas. ¿Alguno de los abrigos tiene estrellas dibujadas?"}$j$::jsonb, $j${"transformacion_funciones:A→B": "No", "transformacion_funciones:B→A": "Sí"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A18', 'A', 'Abrigo'), ('B18', 'B', 'El LUF')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas') and nombre = 'Clase 18');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), 'Clase 19', 'Grupo 7', 19, $j${"entrenamiento:B→A": "El RIKI es un cubierto. ¿Qué es el RIKI?", "test_mutuo:A→B": "El RIKI es un cubierto. ¿Cuál de estos es un cubierto?", "transformacion_funciones:A→B": "Los cubiertos se guardan en el cajón. El RIKI es un cubierto. ¿Se guarda el RIKI en el cajón?", "transformacion_funciones:B→A": "El RIKI es un cubierto. El RIKI es de color dorado. ¿Todos los cubiertos son de color dorado?"}$j$::jsonb, $j${"transformacion_funciones:A→B": "Sí", "transformacion_funciones:B→A": "No"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A19', 'A', 'Cubierto'), ('B19', 'B', 'El RIKI')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas') and nombre = 'Clase 19');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), 'Clase 20', 'Grupo 7', 20, $j${"entrenamiento:B→A": "El DIKI es un lápiz. ¿Qué es el DIKI?", "test_mutuo:A→B": "El DIKI es un lápiz. ¿Cuál de estos es un lápiz?", "transformacion_funciones:A→B": "Los lápices se guardan en el estuche y las flores, en el jarrón. El DIKI es un lápiz. ¿Se guarda el DIKI en el jarrón?", "transformacion_funciones:B→A": "El DIKI es un lápiz. El DIKI tiene la punta azul. ¿Alguno de los lápices tiene la punta azul?"}$j$::jsonb, $j${"transformacion_funciones:A→B": "No", "transformacion_funciones:B→A": "Sí"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A20', 'A', 'Lápiz'), ('B20', 'B', 'El DIKI')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas') and nombre = 'Clase 20');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), 'Clase 21', 'Grupo 7', 21, $j${"entrenamiento:B→A": "El NUFI es una flor. ¿Qué es el NUFI?", "test_mutuo:A→B": "El NUFI es una flor. ¿Cuál de estos es una flor?", "transformacion_funciones:A→B": "Las flores se guardan en el jarrón. El NUFI es una flor. ¿Se guarda el NUFI en el jarrón?", "transformacion_funciones:B→A": "El NUFI es una flor. El NUFI huele a limón. ¿Todas las flores huelen a limón?"}$j$::jsonb, $j${"transformacion_funciones:A→B": "Sí", "transformacion_funciones:B→A": "No"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A21', 'A', 'Flor'), ('B21', 'B', 'El NUFI')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas') and nombre = 'Clase 21');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), 'Clase 22', 'Grupo 8', 22, $j${"entrenamiento:B→A": "El TOFE es una manta. ¿Qué es el TOFE?", "test_mutuo:A→B": "El TOFE es una manta. ¿Cuál de estos es una manta?", "transformacion_funciones:A→B": "Las mantas se guardan en el armario de la habitación y los vasos, en el armario de la cocina. El TOFE es una manta. ¿Se guarda el TOFE en el armario de la cocina?", "transformacion_funciones:B→A": "El TOFE es una manta. El TOFE pica un poco. ¿Alguna de las mantas pica un poco?"}$j$::jsonb, $j${"transformacion_funciones:A→B": "No", "transformacion_funciones:B→A": "Sí"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A22', 'A', 'Manta'), ('B22', 'B', 'El TOFE')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas') and nombre = 'Clase 22');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), 'Clase 23', 'Grupo 8', 23, $j${"entrenamiento:B→A": "El PAKE es un vaso. ¿Qué es el PAKE?", "test_mutuo:A→B": "El PAKE es un vaso. ¿Cuál de estos es un vaso?", "transformacion_funciones:A→B": "Los vasos se guardan en el armario de la cocina. El PAKE es un vaso. ¿Se guarda el PAKE en el armario de la cocina?", "transformacion_funciones:B→A": "El PAKE es un vaso. El PAKE cambia de color. ¿Todos los vasos cambian de color?"}$j$::jsonb, $j${"transformacion_funciones:A→B": "Sí", "transformacion_funciones:B→A": "No"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A23', 'A', 'Vaso'), ('B23', 'B', 'El PAKE')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas') and nombre = 'Clase 23');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), 'Clase 24', 'Grupo 8', 24, $j${"entrenamiento:B→A": "El VOF es un gorro. ¿Qué es el VOF?", "test_mutuo:A→B": "El VOF es un gorro. ¿Cuál de estos es un gorro?", "transformacion_funciones:A→B": "Los gorros se guardan en la percha y las frutas, en el frutero. El VOF es un gorro. ¿Se guarda el VOF en el frutero?", "transformacion_funciones:B→A": "El VOF es un gorro. El VOF tiene orejas. ¿Alguno de los gorros tiene orejas?"}$j$::jsonb, $j${"transformacion_funciones:A→B": "No", "transformacion_funciones:B→A": "Sí"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, null from nueva, (values ('A24', 'A', 'Gorro'), ('B24', 'B', 'El VOF')) x(etiqueta, posicion, nombre)
where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas') and nombre = 'Clase 24');

-- Requisitos del nuevo: los de Clasificar en Categorías + Abstraer Claves de Clasificación
insert into requisitos_programa (programa_base_id, requisito_id)
select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), rq.requisito_id from requisitos_programa rq
where rq.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Clasificar en Categorías')
on conflict do nothing;
insert into requisitos_programa (programa_base_id, requisito_id)
select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'), id from programas_base where clinica_id is null and nombre = 'Abstraer Claves de Clasificación' on conflict do nothing;

-- Lo que pedía Clasificar o Transferir Jerárquicas pasa a pedir el nuevo
insert into requisitos_programa (programa_base_id, requisito_id)
select rq.programa_base_id, (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas')
from requisitos_programa rq join programas_base r on r.id = rq.requisito_id
where r.clinica_id is null and r.nombre in ('Clasificar en Categorías', 'Transferir Funciones a través de Relaciones Jerárquicas')
  and rq.programa_base_id <> (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas')
on conflict do nothing;
delete from requisitos_programa where requisito_id in (select id from programas_base where clinica_id is null and nombre in ('Clasificar en Categorías', 'Transferir Funciones a través de Relaciones Jerárquicas'));

update programas_base set activo = false, orden = null where clinica_id is null and nombre in ('Clasificar en Categorías', 'Transferir Funciones a través de Relaciones Jerárquicas');
update programas_base set orden = 3 where clinica_id is null and nombre = 'Derivar Relaciones Jerárquicas en Redes Combinatorias';

update programas_base set instrucciones_terapeuta = replace(instrucciones_terapeuta, '"Clasificar en Categorías"', '"Vincular Mutuamente Relaciones Jerárquicas"')
where clinica_id is null and activo and instrucciones_terapeuta like '%"Clasificar en Categorías"%';

commit;
