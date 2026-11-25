-- «Inferir Emociones de Otros» y «Falsa Creencia» con opciones: se pueden hacer en la tableta o con material, y se corrigen solos.
begin;
delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Inferir Emociones de Otros por la Situación'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Inferir Emociones de Otros por la Situación');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Inferir Emociones de Otros por la Situación'), 'Clase 1', 'Grupo 1', 1, $j${"entrenamiento:A→B": "A Luis se le rompe su juguete favorito. ¿Cómo se siente Luis?", "test_mutuo:B→A": "¿A quién le pasa algo que le hace sentirse triste?"}$j$::jsonb, $j${"entrenamiento:A→B": "Triste", "test_mutuo:B→A": "A Luis se le rompe su juguete favorito"}$j$::jsonb, $j${"entrenamiento:A→B": ["Contento", "Triste", "Asustado"], "test_mutuo:B→A": ["A Luis se le rompe su juguete favorito", "A Pablo le quitan el turno en el columpio", "Marta recibe el regalo que quería"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A1', 'A', $j$A Luis se le rompe su juguete favorito$j$, null from nueva union all select id, 'B1', 'B', $j$Triste$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Inferir Emociones de Otros por la Situación'), 'Clase 2', 'Grupo 1', 2, $j${"entrenamiento:A→B": "Marta recibe el regalo que quería. ¿Cómo se siente Marta?", "test_mutuo:B→A": "¿A quién le pasa algo que le hace sentirse contenta?"}$j$::jsonb, $j${"entrenamiento:A→B": "Contenta", "test_mutuo:B→A": "Marta recibe el regalo que quería"}$j$::jsonb, $j${"entrenamiento:A→B": ["Contenta", "Triste", "Asustada"], "test_mutuo:B→A": ["A Luis se le rompe su juguete favorito", "A Pablo le quitan el turno en el columpio", "Marta recibe el regalo que quería"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A2', 'A', $j$Marta recibe el regalo que quería$j$, null from nueva union all select id, 'B2', 'B', $j$Contenta$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Inferir Emociones de Otros por la Situación'), 'Clase 3', 'Grupo 1', 3, $j${"entrenamiento:A→B": "A Pablo le quitan el turno en el columpio. ¿Cómo se siente Pablo?", "test_mutuo:B→A": "¿A quién le pasa algo que le hace sentirse enfadado?"}$j$::jsonb, $j${"entrenamiento:A→B": "Enfadado", "test_mutuo:B→A": "A Pablo le quitan el turno en el columpio"}$j$::jsonb, $j${"entrenamiento:A→B": ["Contento", "Enfadado", "Asustado"], "test_mutuo:B→A": ["A Luis se le rompe su juguete favorito", "A Pablo le quitan el turno en el columpio", "Marta recibe el regalo que quería"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A3', 'A', $j$A Pablo le quitan el turno en el columpio$j$, null from nueva union all select id, 'B3', 'B', $j$Enfadado$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Inferir Emociones de Otros por la Situación'), 'Clase 4', 'Grupo 1', 4, $j${"entrenamiento:A→B": "Un perro muy grande le ladra a Eva. ¿Cómo se siente Eva?", "test_mutuo:B→A": "¿A quién le pasa algo que le hace sentirse asustada?"}$j$::jsonb, $j${"entrenamiento:A→B": "Asustada", "test_mutuo:B→A": "Un perro muy grande le ladra a Eva"}$j$::jsonb, $j${"entrenamiento:A→B": ["Contenta", "Enfadada", "Asustada"], "test_mutuo:B→A": ["A Luis se le rompe su juguete favorito", "Marta recibe el regalo que quería", "Un perro muy grande le ladra a Eva"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A4', 'A', $j$Un perro muy grande le ladra a Eva$j$, null from nueva union all select id, 'B4', 'B', $j$Asustada$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Inferir Emociones de Otros por la Situación'), 'Clase 5', 'Grupo 2', 5, $j${"entrenamiento:A→B": "A Ana no le gustan las fresas. De postre le dan fresas. ¿Cómo se siente Ana?", "test_mutuo:B→A": "¿A quién le pasa algo que le hace sentirse triste?"}$j$::jsonb, $j${"entrenamiento:A→B": "Triste", "test_mutuo:B→A": "A Ana no le gustan las fresas. De postre le dan fresas"}$j$::jsonb, $j${"entrenamiento:A→B": ["Contenta", "Triste"], "test_mutuo:B→A": ["A Ana no le gustan las fresas. De postre le dan fresas", "A Hugo le gustan mucho las arañas. Encuentra una araña en el jardín", "A Leo le encantan las espinacas. Hoy hay espinacas para comer"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A5', 'A', $j$A Ana no le gustan las fresas. De postre le dan fresas$j$, null from nueva union all select id, 'B5', 'B', $j$Triste$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Inferir Emociones de Otros por la Situación'), 'Clase 6', 'Grupo 2', 6, $j${"entrenamiento:A→B": "A Leo le encantan las espinacas. Hoy hay espinacas para comer. ¿Cómo se siente Leo?", "test_mutuo:B→A": "¿A quién le pasa algo que le hace sentirse contento?"}$j$::jsonb, $j${"entrenamiento:A→B": "Contento", "test_mutuo:B→A": "A Leo le encantan las espinacas. Hoy hay espinacas para comer"}$j$::jsonb, $j${"entrenamiento:A→B": ["Contento", "Triste"], "test_mutuo:B→A": ["A Ana no le gustan las fresas. De postre le dan fresas", "A Leo le encantan las espinacas. Hoy hay espinacas para comer", "A Sofía no le gusta bañarse en el mar. Su familia se va a la playa"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A6', 'A', $j$A Leo le encantan las espinacas. Hoy hay espinacas para comer$j$, null from nueva union all select id, 'B6', 'B', $j$Contento$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Inferir Emociones de Otros por la Situación'), 'Clase 7', 'Grupo 2', 7, $j${"entrenamiento:A→B": "A Sofía no le gusta bañarse en el mar. Su familia se va a la playa. ¿Cómo se siente Sofía?", "test_mutuo:B→A": "¿A quién le pasa algo que le hace sentirse triste?"}$j$::jsonb, $j${"entrenamiento:A→B": "Triste", "test_mutuo:B→A": "A Sofía no le gusta bañarse en el mar. Su familia se va a la playa"}$j$::jsonb, $j${"entrenamiento:A→B": ["Contenta", "Triste"], "test_mutuo:B→A": ["A Hugo le gustan mucho las arañas. Encuentra una araña en el jardín", "A Leo le encantan las espinacas. Hoy hay espinacas para comer", "A Sofía no le gusta bañarse en el mar. Su familia se va a la playa"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A7', 'A', $j$A Sofía no le gusta bañarse en el mar. Su familia se va a la playa$j$, null from nueva union all select id, 'B7', 'B', $j$Triste$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Inferir Emociones de Otros por la Situación'), 'Clase 8', 'Grupo 2', 8, $j${"entrenamiento:A→B": "A Hugo le gustan mucho las arañas. Encuentra una araña en el jardín. ¿Cómo se siente Hugo?", "test_mutuo:B→A": "¿A quién le pasa algo que le hace sentirse contento?"}$j$::jsonb, $j${"entrenamiento:A→B": "Contento", "test_mutuo:B→A": "A Hugo le gustan mucho las arañas. Encuentra una araña en el jardín"}$j$::jsonb, $j${"entrenamiento:A→B": ["Contento", "Asustado"], "test_mutuo:B→A": ["A Ana no le gustan las fresas. De postre le dan fresas", "A Hugo le gustan mucho las arañas. Encuentra una araña en el jardín", "A Sofía no le gusta bañarse en el mar. Su familia se va a la playa"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A8', 'A', $j$A Hugo le gustan mucho las arañas. Encuentra una araña en el jardín$j$, null from nueva union all select id, 'B8', 'B', $j$Contento$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Inferir Emociones de Otros por la Situación'), 'Clase 9', 'Grupo 3', 9, $j${"entrenamiento:A→B": "Pedro cree que en la caja cerrada hay chocolate. En realidad hay piedras, pero él todavía no lo sabe. ¿Cómo se siente Pedro?", "test_mutuo:B→A": "¿A quién le pasa algo que le hace sentirse contento?"}$j$::jsonb, $j${"entrenamiento:A→B": "Contento", "test_mutuo:B→A": "Pedro cree que en la caja cerrada hay chocolate. En realidad hay piedras, pero él todavía no lo sabe"}$j$::jsonb, $j${"entrenamiento:A→B": ["Contento", "Triste"], "test_mutuo:B→A": ["Irene cree que la tormenta va a romper la ventana. La ventana es muy fuerte, pero ella no lo sabe", "Lucía cree que su perro se ha perdido. En realidad está escondido en el jardín, pero ella no lo sabe", "Pedro cree que en la caja cerrada hay chocolate. En realidad hay piedras, pero él todavía no lo sabe"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A9', 'A', $j$Pedro cree que en la caja cerrada hay chocolate. En realidad hay piedras, pero él todavía no lo sabe$j$, null from nueva union all select id, 'B9', 'B', $j$Contento$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Inferir Emociones de Otros por la Situación'), 'Clase 10', 'Grupo 3', 10, $j${"entrenamiento:A→B": "Lucía cree que su perro se ha perdido. En realidad está escondido en el jardín, pero ella no lo sabe. ¿Cómo se siente Lucía?", "test_mutuo:B→A": "¿A quién le pasa algo que le hace sentirse triste?"}$j$::jsonb, $j${"entrenamiento:A→B": "Triste", "test_mutuo:B→A": "Lucía cree que su perro se ha perdido. En realidad está escondido en el jardín, pero ella no lo sabe"}$j$::jsonb, $j${"entrenamiento:A→B": ["Contenta", "Triste"], "test_mutuo:B→A": ["Lucía cree que su perro se ha perdido. En realidad está escondido en el jardín, pero ella no lo sabe", "Mario cree que mañana no hay cole porque es fiesta. Sí hay cole, pero él todavía no lo sabe", "Pedro cree que en la caja cerrada hay chocolate. En realidad hay piedras, pero él todavía no lo sabe"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A10', 'A', $j$Lucía cree que su perro se ha perdido. En realidad está escondido en el jardín, pero ella no lo sabe$j$, null from nueva union all select id, 'B10', 'B', $j$Triste$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Inferir Emociones de Otros por la Situación'), 'Clase 11', 'Grupo 3', 11, $j${"entrenamiento:A→B": "Mario cree que mañana no hay cole porque es fiesta. Sí hay cole, pero él todavía no lo sabe. ¿Cómo se siente Mario?", "test_mutuo:B→A": "¿A quién le pasa algo que le hace sentirse contento?"}$j$::jsonb, $j${"entrenamiento:A→B": "Contento", "test_mutuo:B→A": "Mario cree que mañana no hay cole porque es fiesta. Sí hay cole, pero él todavía no lo sabe"}$j$::jsonb, $j${"entrenamiento:A→B": ["Contento", "Triste"], "test_mutuo:B→A": ["Irene cree que la tormenta va a romper la ventana. La ventana es muy fuerte, pero ella no lo sabe", "Lucía cree que su perro se ha perdido. En realidad está escondido en el jardín, pero ella no lo sabe", "Mario cree que mañana no hay cole porque es fiesta. Sí hay cole, pero él todavía no lo sabe"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A11', 'A', $j$Mario cree que mañana no hay cole porque es fiesta. Sí hay cole, pero él todavía no lo sabe$j$, null from nueva union all select id, 'B11', 'B', $j$Contento$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Inferir Emociones de Otros por la Situación'), 'Clase 12', 'Grupo 3', 12, $j${"entrenamiento:A→B": "Irene cree que la tormenta va a romper la ventana. La ventana es muy fuerte, pero ella no lo sabe. ¿Cómo se siente Irene?", "test_mutuo:B→A": "¿A quién le pasa algo que le hace sentirse asustada?"}$j$::jsonb, $j${"entrenamiento:A→B": "Asustada", "test_mutuo:B→A": "Irene cree que la tormenta va a romper la ventana. La ventana es muy fuerte, pero ella no lo sabe"}$j$::jsonb, $j${"entrenamiento:A→B": ["Contenta", "Asustada"], "test_mutuo:B→A": ["Irene cree que la tormenta va a romper la ventana. La ventana es muy fuerte, pero ella no lo sabe", "Lucía cree que su perro se ha perdido. En realidad está escondido en el jardín, pero ella no lo sabe", "Pedro cree que en la caja cerrada hay chocolate. En realidad hay piedras, pero él todavía no lo sabe"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A12', 'A', $j$Irene cree que la tormenta va a romper la ventana. La ventana es muy fuerte, pero ella no lo sabe$j$, null from nueva union all select id, 'B12', 'B', $j$Asustada$j$, null from nueva;
update programas_base set materiales = $t$Grupos de 4 clases con 2 miembros:
1. Qué le pasa: situaciones que provocan contento, tristeza, enfado o miedo.
2. Lo que quiere el personaje, aunque el alumno quiera otra cosa (emoción según el deseo).
3. Lo que cree el personaje, aunque no sea verdad (emoción según la creencia). Hágalo cuando el alumno supere "Comprender Creencias de Otros (Falsa Creencia)".

A: Situación vivida por un personaje
B: Emoción del personaje

En la tableta, la situación se lee en voz alta y el alumno elige la emoción. Con material, cuéntela o represéntela con muñecos o viñetas y toque la respuesta que dé el alumno. Imágenes de caras como apoyo (opcional).$t$, instrucciones_terapeuta = $t$Requisito previo: el alumno nombra emociones en imágenes (ver "Vincular Mutuamente Emociones con sus Nombres" del dominio 2.2) y nombra sus propias emociones (ver "Nombrar Emociones y Sensaciones Propias" del dominio 4.1).

Por qué se hace así: entender las emociones de otros es una forma de toma de perspectiva (relaciones deícticas: lo que siente él, no yo). Primero se comprende la emoción por la situación, después por lo que quiere la persona y por último por lo que cree, aunque no sea verdad (secuencia clásica del desarrollo; Wellman y Harris). En los grupos 2 y 3 la trampa es responder desde lo que quiere o sabe el alumno.

Fase 1 - Entrenamiento (situación → emoción): lea o cuente la situación sin mostrar la cara del personaje y pregunte "¿Cómo se siente…?". El alumno elige entre las opciones (en la tableta, las toca; con material, usted toca la que diga). Si falla en el grupo 2, ayude: "¿A Ana le gustan las fresas? Entonces, ¿cómo se siente?". En el grupo 3: "¿Pedro sabe que hay piedras? ¿Qué cree que hay?". Adapte el grupo 2 a las preferencias del alumno: lo mejor es que el personaje quiera lo contrario que él.

Fase 2 - Test de Vinculación Mutua (emoción → situación), sin consecuencias: "¿A quién le pasa algo que le hace sentirse triste?". El alumno elige la situación.

Generalización (sondas): situaciones reales de compañeros y personajes de cuentos ("¿Cómo crees que se siente Pablo, que no ha podido jugar?").

Realice el primer bloque de cada test sin ayudas. Si el alumno alcanza el criterio, la relación se considera DERIVADA; si se enseña con ayudas, quedará registrada como DOMINADA (no derivada), aunque el último bloque se realice sin ayudas.

Registro en la app (fase · posición origen → destino):
- Entrenamiento: A → B (situación → emoción)
- Test de vínculo mutuo: B → A (emoción → situación)$t$, secuencia_rft = $j$[{"fase": "entrenamiento", "origen": "A", "destino": "B"}, {"fase": "test_mutuo", "origen": "B", "destino": "A"}]$j$::jsonb, tipo_respuesta = 'opciones', opciones_respuesta = null, respuesta_por_fase = '{}'::jsonb, opciones_clase = false, contenido_actualizado_at = now() where clinica_id is null and nombre = 'Inferir Emociones de Otros por la Situación';
delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Comprender Creencias de Otros (Falsa Creencia)'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Comprender Creencias de Otros (Falsa Creencia)');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Comprender Creencias de Otros (Falsa Creencia)'), 'Clase 1', 'Grupo 1', 1, $j${"entrenamiento:A→B": "Sara guarda la pelota en la caja azul y se va a jugar fuera. Mientras no está, Luis cambia la pelota a la caja roja. Sara vuelve a por su pelota. ¿Dónde la buscará?"}$j$::jsonb, $j${"entrenamiento:A→B": "En la caja azul"}$j$::jsonb, $j${"entrenamiento:A→B": ["En la caja azul", "En la caja roja"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A1', 'A', $j$Sara guarda la pelota en la caja azul y se va a jugar fuera. Mientras no está, Luis cambia la pelota a la caja roja. Sara vuelve a por su pelota.$j$, null from nueva union all select id, 'B1', 'B', $j$En la caja azul$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Comprender Creencias de Otros (Falsa Creencia)'), 'Clase 2', 'Grupo 1', 2, $j${"entrenamiento:A→B": "Leo deja el coche en la mochila y sale al recreo. Su hermana lo saca y lo pone en el cajón. Leo vuelve. ¿Dónde buscará el coche?"}$j$::jsonb, $j${"entrenamiento:A→B": "En la mochila"}$j$::jsonb, $j${"entrenamiento:A→B": ["En el cajón", "En la mochila"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A2', 'A', $j$Leo deja el coche en la mochila y sale al recreo. Su hermana lo saca y lo pone en el cajón. Leo vuelve.$j$, null from nueva union all select id, 'B2', 'B', $j$En la mochila$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Comprender Creencias de Otros (Falsa Creencia)'), 'Clase 3', 'Grupo 1', 3, $j${"entrenamiento:A→B": "Mamá guarda las galletas en el armario y se va a trabajar. Papá las cambia a la nevera. Mamá vuelve con hambre. ¿Dónde buscará las galletas?"}$j$::jsonb, $j${"entrenamiento:A→B": "En el armario"}$j$::jsonb, $j${"entrenamiento:A→B": ["En el armario", "En la nevera"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A3', 'A', $j$Mamá guarda las galletas en el armario y se va a trabajar. Papá las cambia a la nevera. Mamá vuelve con hambre.$j$, null from nueva union all select id, 'B3', 'B', $j$En el armario$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Comprender Creencias de Otros (Falsa Creencia)'), 'Clase 4', 'Grupo 1', 4, $j${"entrenamiento:A→B": "Hugo esconde su cromo debajo de la almohada y se va al cole. Su abuela lo pone en la estantería al hacer la cama. Hugo vuelve. ¿Dónde buscará el cromo?"}$j$::jsonb, $j${"entrenamiento:A→B": "Debajo de la almohada"}$j$::jsonb, $j${"entrenamiento:A→B": ["Debajo de la almohada", "En la estantería"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A4', 'A', $j$Hugo esconde su cromo debajo de la almohada y se va al cole. Su abuela lo pone en la estantería al hacer la cama. Hugo vuelve.$j$, null from nueva union all select id, 'B4', 'B', $j$Debajo de la almohada$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Comprender Creencias de Otros (Falsa Creencia)'), 'Clase 5', 'Grupo 2', 5, $j${"entrenamiento:A→B": "Esta es una caja de galletas. La abrimos y dentro hay lápices. La cerramos. Luis no la ha visto nunca. ¿Qué pensará Luis que hay dentro?"}$j$::jsonb, $j${"entrenamiento:A→B": "Galletas"}$j$::jsonb, $j${"entrenamiento:A→B": ["Galletas", "Lápices"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A5', 'A', $j$Esta es una caja de galletas. La abrimos y dentro hay lápices. La cerramos. Luis no la ha visto nunca.$j$, null from nueva union all select id, 'B5', 'B', $j$Galletas$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Comprender Creencias de Otros (Falsa Creencia)'), 'Clase 6', 'Grupo 2', 6, $j${"entrenamiento:A→B": "En un bote de tiritas hay canicas. Ana no lo ha abierto nunca. ¿Qué pensará Ana que hay dentro?"}$j$::jsonb, $j${"entrenamiento:A→B": "Tiritas"}$j$::jsonb, $j${"entrenamiento:A→B": ["Canicas", "Tiritas"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A6', 'A', $j$En un bote de tiritas hay canicas. Ana no lo ha abierto nunca.$j$, null from nueva union all select id, 'B6', 'B', $j$Tiritas$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Comprender Creencias de Otros (Falsa Creencia)'), 'Clase 7', 'Grupo 2', 7, $j${"entrenamiento:A→B": "En una caja de zapatos hay un gatito dormido. Pablo no la ha abierto. ¿Qué pensará Pablo que hay dentro?"}$j$::jsonb, $j${"entrenamiento:A→B": "Zapatos"}$j$::jsonb, $j${"entrenamiento:A→B": ["Un gatito", "Zapatos"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A7', 'A', $j$En una caja de zapatos hay un gatito dormido. Pablo no la ha abierto.$j$, null from nueva union all select id, 'B7', 'B', $j$Zapatos$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Comprender Creencias de Otros (Falsa Creencia)'), 'Clase 8', 'Grupo 2', 8, $j${"entrenamiento:A→B": "Antes de abrir la caja de galletas, tú no sabías lo que había. ¿Qué pensabas tú que había dentro?"}$j$::jsonb, $j${"entrenamiento:A→B": "Galletas"}$j$::jsonb, $j${"entrenamiento:A→B": ["Galletas", "Lápices"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A8', 'A', $j$Antes de abrir la caja de galletas, tú no sabías lo que había.$j$, null from nueva union all select id, 'B8', 'B', $j$Galletas$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Comprender Creencias de Otros (Falsa Creencia)'), 'Clase 9', 'Grupo 3', 9, $j${"entrenamiento:A→B": "Esto parece una piedra. Lo tocas y es blando: es una esponja. ¿Qué parece?"}$j$::jsonb, $j${"entrenamiento:A→B": "Una piedra"}$j$::jsonb, $j${"entrenamiento:A→B": ["Una esponja", "Una piedra"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A9', 'A', $j$Esto parece una piedra. Lo tocas y es blando: es una esponja.$j$, null from nueva union all select id, 'B9', 'B', $j$Una piedra$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Comprender Creencias de Otros (Falsa Creencia)'), 'Clase 10', 'Grupo 3', 10, $j${"entrenamiento:A→B": "Esto parece una manzana. Lo miras de cerca y es una vela. ¿Qué es de verdad?"}$j$::jsonb, $j${"entrenamiento:A→B": "Una vela"}$j$::jsonb, $j${"entrenamiento:A→B": ["Una manzana", "Una vela"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A10', 'A', $j$Esto parece una manzana. Lo miras de cerca y es una vela.$j$, null from nueva union all select id, 'B10', 'B', $j$Una vela$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Comprender Creencias de Otros (Falsa Creencia)'), 'Clase 11', 'Grupo 3', 11, $j${"entrenamiento:A→B": "Esto parece una fresa. Lo tocas y es una goma de borrar. ¿Qué parece?"}$j$::jsonb, $j${"entrenamiento:A→B": "Una fresa"}$j$::jsonb, $j${"entrenamiento:A→B": ["Una fresa", "Una goma de borrar"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A11', 'A', $j$Esto parece una fresa. Lo tocas y es una goma de borrar.$j$, null from nueva union all select id, 'B11', 'B', $j$Una fresa$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Comprender Creencias de Otros (Falsa Creencia)'), 'Clase 12', 'Grupo 3', 12, $j${"entrenamiento:A→B": "Esto parece un huevo. Lo coges y es una piedra pintada. ¿Qué es de verdad?"}$j$::jsonb, $j${"entrenamiento:A→B": "Una piedra pintada"}$j$::jsonb, $j${"entrenamiento:A→B": ["Un huevo", "Una piedra pintada"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A12', 'A', $j$Esto parece un huevo. Lo coges y es una piedra pintada.$j$, null from nueva union all select id, 'B12', 'B', $j$Una piedra pintada$j$, null from nueva;
update programas_base set materiales = $t$Grupos de 4 historias (clases con 2 miembros):
1. Cambio de lugar: el personaje no ve que cambian el objeto de sitio.
2. Contenido inesperado: una caja conocida con otra cosa dentro (la última historia pregunta por lo que pensaba el propio alumno).
3. Apariencia y realidad: objetos que parecen una cosa y son otra.

A: La historia
B: La respuesta desde lo que sabe el personaje (o lo que parece / lo que es)

Para hacerlo en vivo: muñecos, cajas y objetos para representar las historias, una caja de galletas con lápices dentro y objetos engañosos (una esponja con forma de piedra, una vela con forma de manzana…). En la tableta, la historia se lee en voz alta y el alumno elige entre las dos opciones.$t$, instrucciones_terapeuta = $t$Requisito previo: el alumno ha superado "Relaciones Deícticas Simples" e "Inferir Emociones de Otros por la Situación" (grupos 1 y 2) del dominio 4.1.

Por qué se hace así: entender que otro puede creer algo que no es verdad exige separar lo que sé yo de lo que sabe él (relaciones deícticas). Las tres tareas clásicas son el cambio de lugar, el contenido inesperado y la apariencia y realidad. La trampa en todas es la misma: responder con lo que es verdad (lo que sabe el alumno) en vez de con lo que sabe o ve el personaje. En las opciones siempre están las dos: la respuesta correcta y la «realista».

Empiece en vivo: las primeras veces represente las historias con muñecos y objetos de verdad, y pase a la tableta (o a contarlas sin objetos) cuando el alumno las siga sin problema.

Fase 1 - Entrenamiento:
1. Cuente la historia (en la tableta se lee sola) y, antes de la pregunta de la clase, haga la pregunta de control ("¿Dónde está la pelota de verdad?", "¿Qué hay dentro de verdad?"). Regístrela con "+ Ensayo de control". Si la falla, vuelva a contar la historia: el error no es de creencia sino de memoria o atención.
2. Haga la pregunta de la clase. El alumno elige entre las dos opciones.
3. En la corrección, explique la respuesta desde el personaje: "Sara no lo vio; ella la dejó en la azul".
4. Refuerce las respuestas correctas hasta alcanzar el criterio de dominio.

Generalización (sondas): historias y personajes nuevos, y situaciones reales ("Tu hermano no sabe que hemos cambiado los juguetes de sitio. ¿Dónde los buscará?").

Registro en la app (fase · posición origen → destino):
- Entrenamiento: A → B (historia → respuesta)$t$, secuencia_rft = $j$[{"fase": "entrenamiento", "origen": "A", "destino": "B"}]$j$::jsonb, tipo_respuesta = 'opciones', opciones_respuesta = null, respuesta_por_fase = '{}'::jsonb, opciones_clase = false, contenido_actualizado_at = now() where clinica_id is null and nombre = 'Comprender Creencias de Otros (Falsa Creencia)';
commit;
