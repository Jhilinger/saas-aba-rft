-- Dominio 4.4 según Luciano y colaboradores (Ruiz y Perete 2015; Luciano et al. 2011; Foody et al. 2013), revisado por el
-- usuario el 2026-11-24: ensayos deícticos, jerárquicos y de elección por valores, de experiencias neutras a molestas;
-- nervios suaves; alternativas a dibujar; economía de fichas de la app; requisitos y orden nuevos.
begin;
delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'), 'Clase 1', 'Grupo 1', 1, $j${"entrenamiento:A→B": "Hacer una postura difícil. ¿Qué notas? ¿Cómo es? Sácalo fuera (dibújalo o elige su forma). ¿Dónde está ahora? ¿Y tú? ¿Quién lo nota? ¿Quién es más grande, tú o la sensación?", "transformacion_funciones:A→C": "Hacer una postura difícil. Con la sensación todavía ahí, ¿qué eliges?"}$j$::jsonb, $j${"A→B": "«Yo» a quién lo nota y «Yo» a quién es más grande que la sensación", "transformacion_funciones:A→C": "Aguantar un poco más y ganar un chicle"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Aguantar un poco más y ganar un chicle", "Parar ya"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A1', 'A', $j$Hacer una postura difícil$j$, null from nueva union all select id, 'B1', 'B', $j$Yo lo noto y soy más grande$j$, null from nueva union all select id, 'C1', 'C', $j$Aguantar un poco más y ganar un chicle$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'), 'Clase 2', 'Grupo 1', 2, $j${"entrenamiento:A→B": "Una botella fría en el hombro. ¿Qué notas? ¿Cómo es? Sácalo fuera (dibújalo o elige su forma). ¿Dónde está ahora? ¿Y tú? ¿Quién lo nota? ¿Quién es más grande, tú o la sensación?", "transformacion_funciones:A→C": "Una botella fría en el hombro. Con la sensación todavía ahí, ¿qué eliges?"}$j$::jsonb, $j${"A→B": "«Yo» a quién lo nota y «Yo» a quién es más grande que la sensación", "transformacion_funciones:A→C": "Dejarla un ratito más y ganar una pegatina"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Quitarla ya", "Dejarla un ratito más y ganar una pegatina"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A2', 'A', $j$Una botella fría en el hombro$j$, null from nueva union all select id, 'B2', 'B', $j$Yo lo noto y soy más grande$j$, null from nueva union all select id, 'C2', 'C', $j$Dejarla un ratito más y ganar una pegatina$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'), 'Clase 3', 'Grupo 1', 3, $j${"entrenamiento:A→B": "Cosquillas con una pluma en el brazo. ¿Qué notas? ¿Cómo es? Sácalo fuera (dibújalo o elige su forma). ¿Dónde está ahora? ¿Y tú? ¿Quién lo nota? ¿Quién es más grande, tú o la sensación?", "transformacion_funciones:A→C": "Cosquillas con una pluma en el brazo. Con la sensación todavía ahí, ¿qué eliges?"}$j$::jsonb, $j${"A→B": "«Yo» a quién lo nota y «Yo» a quién es más grande que la sensación", "transformacion_funciones:A→C": "Quedarme quieto hasta contar cinco"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Quedarme quieto hasta contar cinco", "Apartar el brazo"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A3', 'A', $j$Cosquillas con una pluma en el brazo$j$, null from nueva union all select id, 'B3', 'B', $j$Yo lo noto y soy más grande$j$, null from nueva union all select id, 'C3', 'C', $j$Quedarme quieto hasta contar cinco$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'), 'Clase 4', 'Grupo 1', 4, $j${"entrenamiento:A→B": "Apretar una mano contra la otra con fuerza. ¿Qué notas? ¿Cómo es? Sácalo fuera (dibújalo o elige su forma). ¿Dónde está ahora? ¿Y tú? ¿Quién lo nota? ¿Quién es más grande, tú o la sensación?", "transformacion_funciones:A→C": "Apretar una mano contra la otra con fuerza. Con la sensación todavía ahí, ¿qué eliges?"}$j$::jsonb, $j${"A→B": "«Yo» a quién lo nota y «Yo» a quién es más grande que la sensación", "transformacion_funciones:A→C": "Aguantar hasta contar diez"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Soltar enseguida", "Aguantar hasta contar diez"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A4', 'A', $j$Apretar una mano contra la otra con fuerza$j$, null from nueva union all select id, 'B4', 'B', $j$Yo lo noto y soy más grande$j$, null from nueva union all select id, 'C4', 'C', $j$Aguantar hasta contar diez$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'), 'Clase 5', 'Grupo 2', 5, $j${"entrenamiento:A→B": "Ganas de comer una chuche que está en la mesa. ¿Qué notas? ¿Cómo es? Sácalo fuera (dibújalo o elige su forma). ¿Dónde está ahora? ¿Y tú? ¿Quién lo nota? ¿Quién es más grande, tú o las ganas?", "transformacion_funciones:A→C": "Ganas de comer una chuche que está en la mesa. Con las ganas todavía ahí, ¿qué eliges?"}$j$::jsonb, $j${"A→B": "«Yo» a quién lo nota y «Yo» a quién es más grande que las ganas", "transformacion_funciones:A→C": "Esperar y ganar dos"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Esperar y ganar dos", "Comérmela ya"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A5', 'A', $j$Ganas de comer una chuche que está en la mesa$j$, null from nueva union all select id, 'B5', 'B', $j$Yo lo noto y soy más grande$j$, null from nueva union all select id, 'C5', 'C', $j$Esperar y ganar dos$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'), 'Clase 6', 'Grupo 2', 6, $j${"entrenamiento:A→B": "Ganas de beber un zumo en mitad de la tarea. ¿Qué notas? ¿Cómo es? Sácalo fuera (dibújalo o elige su forma). ¿Dónde está ahora? ¿Y tú? ¿Quién lo nota? ¿Quién es más grande, tú o las ganas?", "transformacion_funciones:A→C": "Ganas de beber un zumo en mitad de la tarea. Con las ganas todavía ahí, ¿qué eliges?"}$j$::jsonb, $j${"A→B": "«Yo» a quién lo nota y «Yo» a quién es más grande que las ganas", "transformacion_funciones:A→C": "Terminar la tarea y beber"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Dejar la tarea y beber", "Terminar la tarea y beber"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A6', 'A', $j$Ganas de beber un zumo en mitad de la tarea$j$, null from nueva union all select id, 'B6', 'B', $j$Yo lo noto y soy más grande$j$, null from nueva union all select id, 'C6', 'C', $j$Terminar la tarea y beber$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'), 'Clase 7', 'Grupo 2', 7, $j${"entrenamiento:A→B": "Ganas de saltar en mitad de una tarea. ¿Qué notas? ¿Cómo es? Sácalo fuera (dibújalo o elige su forma). ¿Dónde está ahora? ¿Y tú? ¿Quién lo nota? ¿Quién es más grande, tú o las ganas?", "transformacion_funciones:A→C": "Ganas de saltar en mitad de una tarea. Con las ganas todavía ahí, ¿qué eliges?"}$j$::jsonb, $j${"A→B": "«Yo» a quién lo nota y «Yo» a quién es más grande que las ganas", "transformacion_funciones:A→C": "Terminar y saltar en el recreo"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Terminar y saltar en el recreo", "Levantarme a saltar"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A7', 'A', $j$Ganas de saltar en mitad de una tarea$j$, null from nueva union all select id, 'B7', 'B', $j$Yo lo noto y soy más grande$j$, null from nueva union all select id, 'C7', 'C', $j$Terminar y saltar en el recreo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'), 'Clase 8', 'Grupo 2', 8, $j${"entrenamiento:A→B": "Ganas de jugar al escondite antes de recoger. ¿Qué notas? ¿Cómo es? Sácalo fuera (dibújalo o elige su forma). ¿Dónde está ahora? ¿Y tú? ¿Quién lo nota? ¿Quién es más grande, tú o las ganas?", "transformacion_funciones:A→C": "Ganas de jugar al escondite antes de recoger. Con las ganas todavía ahí, ¿qué eliges?"}$j$::jsonb, $j${"A→B": "«Yo» a quién lo nota y «Yo» a quién es más grande que las ganas", "transformacion_funciones:A→C": "Recoger primero y jugar más rato"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Jugar sin recoger", "Recoger primero y jugar más rato"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A8', 'A', $j$Ganas de jugar al escondite antes de recoger$j$, null from nueva union all select id, 'B8', 'B', $j$Yo lo noto y soy más grande$j$, null from nueva union all select id, 'C8', 'C', $j$Recoger primero y jugar más rato$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'), 'Clase 9', 'Grupo 3', 9, $j${"entrenamiento:A→B": "Acordarme de jugar al fútbol con papá. ¿Qué notas? ¿Cómo es? Sácalo fuera (dibújalo o elige su forma). ¿Dónde está ahora? ¿Y tú? ¿Quién lo nota? ¿Quién es más grande, tú o el recuerdo?"}$j$::jsonb, $j${"A→B": "«Yo» a quién lo nota y «Yo» a quién es más grande que el recuerdo"}$j$::jsonb, $j${}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A9', 'A', $j$Acordarme de jugar al fútbol con papá$j$, null from nueva union all select id, 'B9', 'B', $j$Yo lo noto y soy más grande$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'), 'Clase 10', 'Grupo 3', 10, $j${"entrenamiento:A→B": "Acordarme del cumpleaños de un amigo. ¿Qué notas? ¿Cómo es? Sácalo fuera (dibújalo o elige su forma). ¿Dónde está ahora? ¿Y tú? ¿Quién lo nota? ¿Quién es más grande, tú o el recuerdo?"}$j$::jsonb, $j${"A→B": "«Yo» a quién lo nota y «Yo» a quién es más grande que el recuerdo"}$j$::jsonb, $j${}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A10', 'A', $j$Acordarme del cumpleaños de un amigo$j$, null from nueva union all select id, 'B10', 'B', $j$Yo lo noto y soy más grande$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'), 'Clase 11', 'Grupo 3', 11, $j${"entrenamiento:A→B": "Pensar en ir a la playa en vacaciones. ¿Qué notas? ¿Cómo es? Sácalo fuera (dibújalo o elige su forma). ¿Dónde está ahora? ¿Y tú? ¿Quién lo nota? ¿Quién es más grande, tú o el pensamiento?"}$j$::jsonb, $j${"A→B": "«Yo» a quién lo nota y «Yo» a quién es más grande que el pensamiento"}$j$::jsonb, $j${}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A11', 'A', $j$Pensar en ir a la playa en vacaciones$j$, null from nueva union all select id, 'B11', 'B', $j$Yo lo noto y soy más grande$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'), 'Clase 12', 'Grupo 3', 12, $j${"entrenamiento:A→B": "Acordarme del cuento de anoche. ¿Qué notas? ¿Cómo es? Sácalo fuera (dibújalo o elige su forma). ¿Dónde está ahora? ¿Y tú? ¿Quién lo nota? ¿Quién es más grande, tú o el recuerdo?"}$j$::jsonb, $j${"A→B": "«Yo» a quién lo nota y «Yo» a quién es más grande que el recuerdo"}$j$::jsonb, $j${}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A12', 'A', $j$Acordarme del cuento de anoche$j$, null from nueva union all select id, 'B12', 'B', $j$Yo lo noto y soy más grande$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'), 'Clase 13', 'Grupo 4', 13, $j${"entrenamiento:A→B": "Apagar el videojuego cuando está muy metido. ¿Qué notas? ¿Cómo es? Sácalo fuera (dibújalo o elige su forma). ¿Dónde está ahora? ¿Y tú? ¿Quién lo nota? ¿Quién es más grande, tú o el enfado?", "transformacion_funciones:A→C": "Apagar el videojuego cuando está muy metido. Con el enfado todavía ahí, ¿qué eliges?"}$j$::jsonb, $j${"A→B": "«Yo» a quién lo nota y «Yo» a quién es más grande que el enfado", "transformacion_funciones:A→C": "Dibujar el enfado y apagarlo"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Dibujar el enfado y apagarlo", "Enfadarme y gritar"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A13', 'A', $j$Apagar el videojuego cuando está muy metido$j$, null from nueva union all select id, 'B13', 'B', $j$Yo lo noto y soy más grande$j$, null from nueva union all select id, 'C13', 'C', $j$Dibujar el enfado y apagarlo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'), 'Clase 14', 'Grupo 4', 14, $j${"entrenamiento:A→B": "Recoger la construcción antes de terminarla. ¿Qué notas? ¿Cómo es? Sácalo fuera (dibújalo o elige su forma). ¿Dónde está ahora? ¿Y tú? ¿Quién lo nota? ¿Quién es más grande, tú o el enfado?", "transformacion_funciones:A→C": "Recoger la construcción antes de terminarla. Con el enfado todavía ahí, ¿qué eliges?"}$j$::jsonb, $j${"A→B": "«Yo» a quién lo nota y «Yo» a quién es más grande que el enfado", "transformacion_funciones:A→C": "Recogerla y seguir otro día"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Tirar las piezas", "Recogerla y seguir otro día"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A14', 'A', $j$Recoger la construcción antes de terminarla$j$, null from nueva union all select id, 'B14', 'B', $j$Yo lo noto y soy más grande$j$, null from nueva union all select id, 'C14', 'C', $j$Recogerla y seguir otro día$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'), 'Clase 15', 'Grupo 4', 15, $j${"entrenamiento:A→B": "Borrarle las letras que no están bien hechas. ¿Qué notas? ¿Cómo es? Sácalo fuera (dibújalo o elige su forma). ¿Dónde está ahora? ¿Y tú? ¿Quién lo nota? ¿Quién es más grande, tú o el enfado?", "transformacion_funciones:A→C": "Borrarle las letras que no están bien hechas. Con el enfado todavía ahí, ¿qué eliges?"}$j$::jsonb, $j${"A→B": "«Yo» a quién lo nota y «Yo» a quién es más grande que el enfado", "transformacion_funciones:A→C": "Volver a escribirlas"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Volver a escribirlas", "Romper la hoja"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A15', 'A', $j$Borrarle las letras que no están bien hechas$j$, null from nueva union all select id, 'B15', 'B', $j$Yo lo noto y soy más grande$j$, null from nueva union all select id, 'C15', 'C', $j$Volver a escribirlas$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'), 'Clase 16', 'Grupo 4', 16, $j${"entrenamiento:A→B": "Taparle la pantalla cuando va ganando. ¿Qué notas? ¿Cómo es? Sácalo fuera (dibújalo o elige su forma). ¿Dónde está ahora? ¿Y tú? ¿Quién lo nota? ¿Quién es más grande, tú o el enfado?", "transformacion_funciones:A→C": "Taparle la pantalla cuando va ganando. Con el enfado todavía ahí, ¿qué eliges?"}$j$::jsonb, $j${"A→B": "«Yo» a quién lo nota y «Yo» a quién es más grande que el enfado", "transformacion_funciones:A→C": "Esperar a que la destape"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Empujar la mano", "Esperar a que la destape"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A16', 'A', $j$Taparle la pantalla cuando va ganando$j$, null from nueva union all select id, 'B16', 'B', $j$Yo lo noto y soy más grande$j$, null from nueva union all select id, 'C16', 'C', $j$Esperar a que la destape$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'), 'Clase 17', 'Grupo 5', 17, $j${"entrenamiento:A→B": "Decir una frase delante de tres compañeros. ¿Qué notas? ¿Cómo es? Sácalo fuera (dibújalo o elige su forma). ¿Dónde está ahora? ¿Y tú? ¿Quién lo nota? ¿Quién es más grande, tú o los nervios?", "transformacion_funciones:A→C": "Decir una frase delante de tres compañeros. Con los nervios todavía ahí, ¿qué eliges?"}$j$::jsonb, $j${"A→B": "«Yo» a quién lo nota y «Yo» a quién es más grande que los nervios", "transformacion_funciones:A→C": "Decirla aunque esté nervioso"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Decirla aunque esté nervioso", "No decirla"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A17', 'A', $j$Decir una frase delante de tres compañeros$j$, null from nueva union all select id, 'B17', 'B', $j$Yo lo noto y soy más grande$j$, null from nueva union all select id, 'C17', 'C', $j$Decirla aunque esté nervioso$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'), 'Clase 18', 'Grupo 5', 18, $j${"entrenamiento:A→B": "Bajar la luz un momento con el terapeuta al lado. ¿Qué notas? ¿Cómo es? Sácalo fuera (dibújalo o elige su forma). ¿Dónde está ahora? ¿Y tú? ¿Quién lo nota? ¿Quién es más grande, tú o los nervios?", "transformacion_funciones:A→C": "Bajar la luz un momento con el terapeuta al lado. Con los nervios todavía ahí, ¿qué eliges?"}$j$::jsonb, $j${"A→B": "«Yo» a quién lo nota y «Yo» a quién es más grande que los nervios", "transformacion_funciones:A→C": "Quedarme quieto contando hasta cinco"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Salir corriendo", "Quedarme quieto contando hasta cinco"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A18', 'A', $j$Bajar la luz un momento con el terapeuta al lado$j$, null from nueva union all select id, 'B18', 'B', $j$Yo lo noto y soy más grande$j$, null from nueva union all select id, 'C18', 'C', $j$Quedarme quieto contando hasta cinco$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'), 'Clase 19', 'Grupo 5', 19, $j${"entrenamiento:A→B": "Probar una fruta nueva. ¿Qué notas? ¿Cómo es? Sácalo fuera (dibújalo o elige su forma). ¿Dónde está ahora? ¿Y tú? ¿Quién lo nota? ¿Quién es más grande, tú o los nervios?", "transformacion_funciones:A→C": "Probar una fruta nueva. Con los nervios todavía ahí, ¿qué eliges?"}$j$::jsonb, $j${"A→B": "«Yo» a quién lo nota y «Yo» a quién es más grande que los nervios", "transformacion_funciones:A→C": "Dar un mordisco pequeño"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Dar un mordisco pequeño", "Apartarla"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A19', 'A', $j$Probar una fruta nueva$j$, null from nueva union all select id, 'B19', 'B', $j$Yo lo noto y soy más grande$j$, null from nueva union all select id, 'C19', 'C', $j$Dar un mordisco pequeño$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'), 'Clase 20', 'Grupo 5', 20, $j${"entrenamiento:A→B": "Esperar el turno en el médico de juguete. ¿Qué notas? ¿Cómo es? Sácalo fuera (dibújalo o elige su forma). ¿Dónde está ahora? ¿Y tú? ¿Quién lo nota? ¿Quién es más grande, tú o los nervios?", "transformacion_funciones:A→C": "Esperar el turno en el médico de juguete. Con los nervios todavía ahí, ¿qué eliges?"}$j$::jsonb, $j${"A→B": "«Yo» a quién lo nota y «Yo» a quién es más grande que los nervios", "transformacion_funciones:A→C": "Sentarme y esperar"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Irme del cuarto", "Sentarme y esperar"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A20', 'A', $j$Esperar el turno en el médico de juguete$j$, null from nueva union all select id, 'B20', 'B', $j$Yo lo noto y soy más grande$j$, null from nueva union all select id, 'C20', 'C', $j$Sentarme y esperar$j$, null from nueva;
delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Diferenciar Pensamientos de Hechos'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Diferenciar Pensamientos de Hechos');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Pensamientos de Hechos'), 'Clase 1', 'Grupo 1', 1, $j${"entrenamiento:A→B": "«Soy tonto». ¿Es un pensamiento o un hecho?", "test_mutuo:A→B": "«Soy tonto». ¿Cómo lo dirías?", "transformacion_funciones:A→C": "Escribe «Soy tonto», mira quién lo ha pensado y guárdalo en la carpeta. La profe te pide resolver un problema en la pizarra. ¿Qué haces?"}$j$::jsonb, $j${"entrenamiento:A→B": "Es un pensamiento", "test_mutuo:A→B": "Estoy pensando que soy tonto", "transformacion_funciones:A→C": "Salgo aunque lo piense"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Salgo aunque lo piense", "No salgo"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A1', 'A', $j$«Soy tonto»$j$, null from nueva union all select id, 'B1', 'B', $j$«Estoy pensando que soy tonto»$j$, null from nueva union all select id, 'C1', 'C', $j$Salgo aunque lo piense$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Pensamientos de Hechos'), 'Clase 2', 'Grupo 1', 2, $j${"entrenamiento:A→B": "«Hoy he fallado dos sumas». ¿Es un pensamiento o un hecho?", "test_mutuo:A→B": "«Hoy he fallado dos sumas». ¿Cómo lo dirías?"}$j$::jsonb, $j${"entrenamiento:A→B": "Es un hecho", "test_mutuo:A→B": "Hoy he fallado dos sumas (es un hecho: se dice igual)"}$j$::jsonb, $j${}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A2', 'A', $j$«Hoy he fallado dos sumas»$j$, null from nueva union all select id, 'B2', 'B', $j$«Hoy he fallado dos sumas»$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Pensamientos de Hechos'), 'Clase 3', 'Grupo 1', 3, $j${"entrenamiento:A→B": "«No sé dibujar». ¿Es un pensamiento o un hecho?", "test_mutuo:A→B": "«No sé dibujar». ¿Cómo lo dirías?", "transformacion_funciones:A→C": "Escribe «No sé dibujar», mira quién lo ha pensado y guárdalo en la carpeta. En clase toca dibujar a tu familia. ¿Qué haces?"}$j$::jsonb, $j${"entrenamiento:A→B": "Es un pensamiento", "test_mutuo:A→B": "Estoy pensando que no sé dibujar", "transformacion_funciones:A→C": "Dibujo aunque lo piense"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Dejo la hoja en blanco", "Dibujo aunque lo piense"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A3', 'A', $j$«No sé dibujar»$j$, null from nueva union all select id, 'B3', 'B', $j$«Estoy pensando que no sé dibujar»$j$, null from nueva union all select id, 'C3', 'C', $j$Dibujo aunque lo piense$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Pensamientos de Hechos'), 'Clase 4', 'Grupo 1', 4, $j${"entrenamiento:A→B": "«Llevo gafas». ¿Es un pensamiento o un hecho?", "test_mutuo:A→B": "«Llevo gafas». ¿Cómo lo dirías?"}$j$::jsonb, $j${"entrenamiento:A→B": "Es un hecho", "test_mutuo:A→B": "Llevo gafas (es un hecho: se dice igual)"}$j$::jsonb, $j${}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A4', 'A', $j$«Llevo gafas»$j$, null from nueva union all select id, 'B4', 'B', $j$«Llevo gafas»$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Pensamientos de Hechos'), 'Clase 5', 'Grupo 1', 5, $j${"entrenamiento:A→B": "«Soy un desastre». ¿Es un pensamiento o un hecho?", "test_mutuo:A→B": "«Soy un desastre». ¿Cómo lo dirías?", "transformacion_funciones:A→C": "Escribe «Soy un desastre», mira quién lo ha pensado y guárdalo en la carpeta. Se te ha caído el estuche. ¿Qué haces?"}$j$::jsonb, $j${"entrenamiento:A→B": "Es un pensamiento", "test_mutuo:A→B": "Estoy pensando que soy un desastre", "transformacion_funciones:A→C": "Lo recojo y sigo"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Lo recojo y sigo", "Lo dejo en el suelo y me enfado"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A5', 'A', $j$«Soy un desastre»$j$, null from nueva union all select id, 'B5', 'B', $j$«Estoy pensando que soy un desastre»$j$, null from nueva union all select id, 'C5', 'C', $j$Lo recojo y sigo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Pensamientos de Hechos'), 'Clase 6', 'Grupo 2', 6, $j${"entrenamiento:A→B": "«Me va a salir mal». ¿Es un pensamiento o un hecho?", "test_mutuo:A→B": "«Me va a salir mal». ¿Cómo lo dirías?", "transformacion_funciones:A→C": "Escribe «Me va a salir mal», mira quién lo ha pensado y guárdalo en la carpeta. Toca leer en voz alta. ¿Qué haces?"}$j$::jsonb, $j${"entrenamiento:A→B": "Es un pensamiento", "test_mutuo:A→B": "Estoy pensando que me va a salir mal", "transformacion_funciones:A→C": "Leo aunque lo piense"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Digo que no quiero", "Leo aunque lo piense"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A6', 'A', $j$«Me va a salir mal»$j$, null from nueva union all select id, 'B6', 'B', $j$«Estoy pensando que me va a salir mal»$j$, null from nueva union all select id, 'C6', 'C', $j$Leo aunque lo piense$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Pensamientos de Hechos'), 'Clase 7', 'Grupo 2', 7, $j${"entrenamiento:A→B": "«Mañana hay excursión». ¿Es un pensamiento o un hecho?", "test_mutuo:A→B": "«Mañana hay excursión». ¿Cómo lo dirías?"}$j$::jsonb, $j${"entrenamiento:A→B": "Es un hecho", "test_mutuo:A→B": "Mañana hay excursión (es un hecho: se dice igual)"}$j$::jsonb, $j${}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A7', 'A', $j$«Mañana hay excursión»$j$, null from nueva union all select id, 'B7', 'B', $j$«Mañana hay excursión»$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Pensamientos de Hechos'), 'Clase 8', 'Grupo 2', 8, $j${"entrenamiento:A→B": "«Se van a reír de mí». ¿Es un pensamiento o un hecho?", "test_mutuo:A→B": "«Se van a reír de mí». ¿Cómo lo dirías?", "transformacion_funciones:A→C": "Escribe «Se van a reír de mí», mira quién lo ha pensado y guárdalo en la carpeta. Quieres preguntar una duda. ¿Qué haces?"}$j$::jsonb, $j${"entrenamiento:A→B": "Es un pensamiento", "test_mutuo:A→B": "Estoy pensando que se van a reír de mí", "transformacion_funciones:A→C": "Pregunto aunque lo piense"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Pregunto aunque lo piense", "Me quedo con la duda"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A8', 'A', $j$«Se van a reír de mí»$j$, null from nueva union all select id, 'B8', 'B', $j$«Estoy pensando que se van a reír de mí»$j$, null from nueva union all select id, 'C8', 'C', $j$Pregunto aunque lo piense$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Pensamientos de Hechos'), 'Clase 9', 'Grupo 2', 9, $j${"entrenamiento:A→B": "«Ha empezado a llover». ¿Es un pensamiento o un hecho?", "test_mutuo:A→B": "«Ha empezado a llover». ¿Cómo lo dirías?"}$j$::jsonb, $j${"entrenamiento:A→B": "Es un hecho", "test_mutuo:A→B": "Ha empezado a llover (es un hecho: se dice igual)"}$j$::jsonb, $j${}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A9', 'A', $j$«Ha empezado a llover»$j$, null from nueva union all select id, 'B9', 'B', $j$«Ha empezado a llover»$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Pensamientos de Hechos'), 'Clase 10', 'Grupo 2', 10, $j${"entrenamiento:A→B": "«No voy a poder». ¿Es un pensamiento o un hecho?", "test_mutuo:A→B": "«No voy a poder». ¿Cómo lo dirías?", "transformacion_funciones:A→C": "Escribe «No voy a poder», mira quién lo ha pensado y guárdalo en la carpeta. Te proponen subir al tobogán alto. ¿Qué haces?"}$j$::jsonb, $j${"entrenamiento:A→B": "Es un pensamiento", "test_mutuo:A→B": "Estoy pensando que no voy a poder", "transformacion_funciones:A→C": "Lo intento con cuidado"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Ni lo intento", "Lo intento con cuidado"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A10', 'A', $j$«No voy a poder»$j$, null from nueva union all select id, 'B10', 'B', $j$«Estoy pensando que no voy a poder»$j$, null from nueva union all select id, 'C10', 'C', $j$Lo intento con cuidado$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Pensamientos de Hechos'), 'Clase 11', 'Grupo 3', 11, $j${"entrenamiento:A→B": "«Nadie quiere jugar conmigo». ¿Es un pensamiento o un hecho?", "test_mutuo:A→B": "«Nadie quiere jugar conmigo». ¿Cómo lo dirías?", "transformacion_funciones:A→C": "Escribe «Nadie quiere jugar conmigo», mira quién lo ha pensado y guárdalo en la carpeta. En el recreo ves a unos niños jugando. ¿Qué haces?"}$j$::jsonb, $j${"entrenamiento:A→B": "Es un pensamiento", "test_mutuo:A→B": "Estoy pensando que nadie quiere jugar conmigo", "transformacion_funciones:A→C": "Les pregunto si puedo jugar"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Les pregunto si puedo jugar", "Me quedo solo en un rincón"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A11', 'A', $j$«Nadie quiere jugar conmigo»$j$, null from nueva union all select id, 'B11', 'B', $j$«Estoy pensando que nadie quiere jugar conmigo»$j$, null from nueva union all select id, 'C11', 'C', $j$Les pregunto si puedo jugar$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Pensamientos de Hechos'), 'Clase 12', 'Grupo 3', 12, $j${"entrenamiento:A→B": "«Hoy Pablo ha jugado con Luis». ¿Es un pensamiento o un hecho?", "test_mutuo:A→B": "«Hoy Pablo ha jugado con Luis». ¿Cómo lo dirías?"}$j$::jsonb, $j${"entrenamiento:A→B": "Es un hecho", "test_mutuo:A→B": "Hoy Pablo ha jugado con Luis (es un hecho: se dice igual)"}$j$::jsonb, $j${}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A12', 'A', $j$«Hoy Pablo ha jugado con Luis»$j$, null from nueva union all select id, 'B12', 'B', $j$«Hoy Pablo ha jugado con Luis»$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Pensamientos de Hechos'), 'Clase 13', 'Grupo 3', 13, $j${"entrenamiento:A→B": "«La profe me tiene manía». ¿Es un pensamiento o un hecho?", "test_mutuo:A→B": "«La profe me tiene manía». ¿Cómo lo dirías?", "transformacion_funciones:A→C": "Escribe «La profe me tiene manía», mira quién lo ha pensado y guárdalo en la carpeta. La profe te corrige un ejercicio. ¿Qué haces?"}$j$::jsonb, $j${"entrenamiento:A→B": "Es un pensamiento", "test_mutuo:A→B": "Estoy pensando que la profe me tiene manía", "transformacion_funciones:A→C": "Lo corrijo"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["No lo hago", "Lo corrijo"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A13', 'A', $j$«La profe me tiene manía»$j$, null from nueva union all select id, 'B13', 'B', $j$«Estoy pensando que la profe me tiene manía»$j$, null from nueva union all select id, 'C13', 'C', $j$Lo corrijo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Pensamientos de Hechos'), 'Clase 14', 'Grupo 3', 14, $j${"entrenamiento:A→B": "«La profe ha puesto deberes». ¿Es un pensamiento o un hecho?", "test_mutuo:A→B": "«La profe ha puesto deberes». ¿Cómo lo dirías?"}$j$::jsonb, $j${"entrenamiento:A→B": "Es un hecho", "test_mutuo:A→B": "La profe ha puesto deberes (es un hecho: se dice igual)"}$j$::jsonb, $j${}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A14', 'A', $j$«La profe ha puesto deberes»$j$, null from nueva union all select id, 'B14', 'B', $j$«La profe ha puesto deberes»$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Pensamientos de Hechos'), 'Clase 15', 'Grupo 3', 15, $j${"entrenamiento:A→B": "«Mi amigo está enfadado conmigo». ¿Es un pensamiento o un hecho?", "test_mutuo:A→B": "«Mi amigo está enfadado conmigo». ¿Cómo lo dirías?", "transformacion_funciones:A→C": "Escribe «Mi amigo está enfadado conmigo», mira quién lo ha pensado y guárdalo en la carpeta. Tu amigo no te ha saludado. ¿Qué haces?"}$j$::jsonb, $j${"entrenamiento:A→B": "Es un pensamiento", "test_mutuo:A→B": "Estoy pensando que mi amigo está enfadado conmigo", "transformacion_funciones:A→C": "Le pregunto qué le pasa"}$j$::jsonb, $j${"transformacion_funciones:A→C": ["Le pregunto qué le pasa", "Dejo de hablarle"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A15', 'A', $j$«Mi amigo está enfadado conmigo»$j$, null from nueva union all select id, 'B15', 'B', $j$«Estoy pensando que mi amigo está enfadado conmigo»$j$, null from nueva union all select id, 'C15', 'C', $j$Le pregunto qué le pasa$j$, null from nueva;
delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Identificar Valores'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Identificar Valores');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Identificar Valores'), 'Clase 1', 'Grupo 1', 1, $j${"entrenamiento:A→B": "Una chuche ahora o dos al terminar la tarea. ¿Qué eliges?", "test_mutuo:B→A": "Si eliges «Dos al terminar», ¿cuántas tendrás?", "transformacion_funciones:A→B": "Un cromo ahora o tres al final de la semana. ¿Qué eliges?"}$j$::jsonb, $j${"A→B": "Dos al terminar", "B→A": "Dos", "transformacion_funciones:A→B": "Tres al final de la semana"}$j$::jsonb, $j${"entrenamiento:A→B": ["Dos al terminar", "Una ahora"], "test_mutuo:B→A": ["Una", "Dos", "Ninguna"], "transformacion_funciones:A→B": ["Uno ahora", "Tres al final de la semana"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A1', 'A', $j$Una chuche ahora o dos al terminar la tarea$j$, null from nueva union all select id, 'B1', 'B', $j$Dos al terminar$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Identificar Valores'), 'Clase 2', 'Grupo 1', 2, $j${"entrenamiento:A→B": "Cinco minutos de tableta ahora o diez después de recoger. ¿Qué eliges?", "test_mutuo:B→A": "Si eliges «Diez después de recoger», ¿cuánto rato jugarás?", "transformacion_funciones:A→B": "Un trozo de bizcocho ahora o dos en la merienda. ¿Qué eliges?"}$j$::jsonb, $j${"A→B": "Diez después de recoger", "B→A": "Diez minutos", "transformacion_funciones:A→B": "Dos en la merienda"}$j$::jsonb, $j${"entrenamiento:A→B": ["Cinco ahora", "Diez después de recoger"], "test_mutuo:B→A": ["Cinco minutos", "Nada", "Diez minutos"], "transformacion_funciones:A→B": ["Dos en la merienda", "Uno ahora"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A2', 'A', $j$Cinco minutos de tableta ahora o diez después de recoger$j$, null from nueva union all select id, 'B2', 'B', $j$Diez después de recoger$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Identificar Valores'), 'Clase 3', 'Grupo 1', 3, $j${"entrenamiento:A→B": "Ver un dibujo ahora o dos después de bañarte. ¿Qué eliges?", "test_mutuo:B→A": "Si eliges «Dos después de bañarme», ¿cuántos verás?", "transformacion_funciones:A→B": "Jugar un rato ahora o una partida larga después de cenar. ¿Qué eliges?"}$j$::jsonb, $j${"A→B": "Dos después de bañarme", "B→A": "Dos", "transformacion_funciones:A→B": "Una partida larga después de cenar"}$j$::jsonb, $j${"entrenamiento:A→B": ["Dos después de bañarme", "Uno ahora"], "test_mutuo:B→A": ["Dos", "Uno", "Ninguno"], "transformacion_funciones:A→B": ["Un rato ahora", "Una partida larga después de cenar"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A3', 'A', $j$Ver un dibujo ahora o dos después de bañarte$j$, null from nueva union all select id, 'B3', 'B', $j$Dos después de bañarme$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Identificar Valores'), 'Clase 4', 'Grupo 2', 4, $j${"entrenamiento:A→B": "Te enfadas porque has perdido. Si no gritas, podrás contarle a la abuela que has mandado tú. ¿Qué eliges?", "test_mutuo:B→A": "Si aguantas, ¿qué podrás contarle a la abuela?", "transformacion_funciones:A→B": "Tu hermano te quita el sitio. Si no le empujas, papá verá que ya eres mayor. ¿Qué haces?"}$j$::jsonb, $j${"A→B": "Aguantar y contárselo", "B→A": "Que he mandado yo y no el enfado", "transformacion_funciones:A→B": "Pedirle el sitio con palabras"}$j$::jsonb, $j${"entrenamiento:A→B": ["Gritar", "Aguantar y contárselo"], "test_mutuo:B→A": ["Que he gritado mucho", "Que he mandado yo y no el enfado", "Nada"], "transformacion_funciones:A→B": ["Pedirle el sitio con palabras", "Empujarle"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A4', 'A', $j$Te enfadas porque has perdido. Si no gritas, podrás contarle a la abuela que has mandado tú$j$, null from nueva union all select id, 'B4', 'B', $j$Aguantar y contárselo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Identificar Valores'), 'Clase 5', 'Grupo 2', 5, $j${"entrenamiento:A→B": "Hay cola en el tobogán y tu hermano pequeño te mira. ¿Qué eliges?", "test_mutuo:B→A": "Si esperas tu turno, ¿qué verá tu hermano?", "transformacion_funciones:A→B": "En la fila del comedor hay un hueco delante. ¿Qué haces?"}$j$::jsonb, $j${"A→B": "Esperar mi turno", "B→A": "Que ya soy mayor", "transformacion_funciones:A→B": "Esperar en mi sitio"}$j$::jsonb, $j${"entrenamiento:A→B": ["Esperar mi turno", "Colarme"], "test_mutuo:B→A": ["Que me cuelo", "Nada", "Que ya soy mayor"], "transformacion_funciones:A→B": ["Colarme en el hueco", "Esperar en mi sitio"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A5', 'A', $j$Hay cola en el tobogán y tu hermano pequeño te mira$j$, null from nueva union all select id, 'B5', 'B', $j$Esperar mi turno$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Identificar Valores'), 'Clase 6', 'Grupo 2', 6, $j${"entrenamiento:A→B": "Tu amigo quiere jugar con tu juguete nuevo. ¿Qué eliges?", "test_mutuo:B→A": "Si se lo dejas, ¿cómo estará tu amigo?", "transformacion_funciones:A→B": "Tienes galletas y tu amigo no ha traído merienda. ¿Qué haces?"}$j$::jsonb, $j${"A→B": "Dejárselo un rato", "B→A": "Contento", "transformacion_funciones:A→B": "Darle una"}$j$::jsonb, $j${"entrenamiento:A→B": ["No dejárselo", "Dejárselo un rato"], "test_mutuo:B→A": ["Contento", "Enfadado", "Igual"], "transformacion_funciones:A→B": ["Darle una", "Comérmelas todas"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A6', 'A', $j$Tu amigo quiere jugar con tu juguete nuevo$j$, null from nueva union all select id, 'B6', 'B', $j$Dejárselo un rato$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Identificar Valores'), 'Clase 7', 'Grupo 3', 7, $j${"entrenamiento:A→B": "Quieres «ser buen amigo». ¿Qué haces?", "test_mutuo:B→A": "«Compartir mis juguetes». ¿Qué te importa cuando haces esto?", "transformacion_funciones:A→B": "Quieres ser buen amigo. Tu amigo está triste y tú quieres seguir jugando. ¿Qué haces?"}$j$::jsonb, $j${"A→B": "Compartir mis juguetes", "B→A": "Ser buen amigo", "transformacion_funciones:A→B": "Ir a ver qué le pasa"}$j$::jsonb, $j${"entrenamiento:A→B": ["Compartir mis juguetes", "Intentar la tarea difícil", "Ayudar a poner la mesa"], "test_mutuo:B→A": ["Aprender cosas nuevas", "Ser buen amigo", "Cuidar de mi familia"], "transformacion_funciones:A→B": ["Ir a ver qué le pasa", "Seguir jugando"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A7', 'A', $j$Ser buen amigo$j$, null from nueva union all select id, 'B7', 'B', $j$Compartir mis juguetes$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Identificar Valores'), 'Clase 8', 'Grupo 3', 8, $j${"entrenamiento:A→B": "Quieres «aprender cosas nuevas». ¿Qué haces?", "test_mutuo:B→A": "«Intentar la tarea difícil». ¿Qué te importa cuando haces esto?", "transformacion_funciones:A→B": "Quieres aprender cosas nuevas. La tarea es difícil y hay dibujos en la tele. ¿Qué haces?"}$j$::jsonb, $j${"A→B": "Intentar la tarea difícil", "B→A": "Aprender cosas nuevas", "transformacion_funciones:A→B": "Intentar la tarea"}$j$::jsonb, $j${"entrenamiento:A→B": ["Compartir mis juguetes", "Intentar la tarea difícil", "Ayudar a poner la mesa"], "test_mutuo:B→A": ["Ser buen amigo", "Cuidar de mi familia", "Aprender cosas nuevas"], "transformacion_funciones:A→B": ["Ver los dibujos", "Intentar la tarea"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A8', 'A', $j$Aprender cosas nuevas$j$, null from nueva union all select id, 'B8', 'B', $j$Intentar la tarea difícil$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Identificar Valores'), 'Clase 9', 'Grupo 3', 9, $j${"entrenamiento:A→B": "Quieres «cuidar de mi familia». ¿Qué haces?", "test_mutuo:B→A": "«Ayudar a poner la mesa». ¿Qué te importa cuando haces esto?", "transformacion_funciones:A→B": "Quieres cuidar de tu familia. Mamá pone la mesa y tú estás jugando. ¿Qué haces?"}$j$::jsonb, $j${"A→B": "Ayudar a poner la mesa", "B→A": "Cuidar de mi familia", "transformacion_funciones:A→B": "Ayudar a poner la mesa"}$j$::jsonb, $j${"entrenamiento:A→B": ["Compartir mis juguetes", "Intentar la tarea difícil", "Ayudar a poner la mesa"], "test_mutuo:B→A": ["Cuidar de mi familia", "Ser buen amigo", "Aprender cosas nuevas"], "transformacion_funciones:A→B": ["Ayudar a poner la mesa", "Seguir jugando"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A9', 'A', $j$Cuidar de mi familia$j$, null from nueva union all select id, 'B9', 'B', $j$Ayudar a poner la mesa$j$, null from nueva;
update programas_base set objetivo = $t$El alumno nota una experiencia (una sensación, unas ganas, un recuerdo, un enfado), la sitúa fuera de sí («está allí, y yo aquí»), responde que es él quien la nota y que es más grande que ella, y con la experiencia todavía presente elige lo que le conviene.$t$, materiales = $t$Con el terapeuta y en vivo (no en la tableta): la experiencia tiene que ser real. Grupos de 4 clases, de menos a más molestas:
1. Sensaciones neutras (postura difícil, botella fría, cosquillas, apretar las manos).
2. Ganas (una chuche, beber, saltar, jugar).
3. Recuerdos y pensamientos (solo notar y preguntas, sin elección).
4. Situaciones que enfadan, provocadas a propósito.
5. Nervios suaves (hablar delante de otros, bajar la luz con el terapeuta al lado, probar una fruta nueva).

A: La experiencia
B: «Yo lo noto y soy más grande» (respuesta a las preguntas)
C: La elección que le conviene

Para sacar la experiencia fuera: papel y colores, o las alternativas de abajo.$t$, instrucciones_terapeuta = $t$Requisito previo: el alumno ha superado "Vincular Mutuamente Relaciones Jerárquicas" (dominio 3.6), que incluye la inclusión de clase ("¿Hay más caballos o más juguetes?"), "Relaciones Deícticas Simples" (dominio 4.1) y "Nombrar Emociones y Sensaciones Propias" (dominio 4.1).

Por qué se hace así: según Luciano y colaboradores, la flexibilidad psicológica consiste en enmarcar la propia experiencia con relaciones deícticas (yo AQUÍ, la experiencia ALLÍ) y jerárquicas (yo la contengo, soy más grande que ella), lo que le quita fuerza y deja elegir según lo que importa (Luciano, Valdivia-Salas y Ruiz, 2012). En adolescentes, solo el protocolo con los tres tipos de ensayo (deíctico, jerárquico y elección por valores) produjo cambios (Luciano et al., 2011), y en adultos el yo jerárquico redujo más el malestar que el yo por distinción (Foody et al., 2013). Con un niño de 5 años bastaron cuatro sesiones de 20 minutos (Ruiz y Perete, 2015). Se avanza de experiencias neutras a molestas para aprender sin error.

Antes de empezar: "Vamos a jugar a unos juegos que te ayudarán a mandar tú." En el grupo 4: "A veces te voy a fastidiar un poco; puedes enfadarte o sacar el enfado fuera y mandar tú." En el grupo 5, solo situaciones suaves y con permiso de la familia.

Fase 1 - Entrenamiento (notar, sacar fuera y preguntas jerárquicas):
1. Provoque la experiencia de la clase y pregunte: "¿Qué notas? ¿Cómo es: grande o pequeño, de qué color, de qué forma?"
2. Sáquela fuera: "Dibújalo." Si el alumno no dibuja, use una alternativa:
   - Elegir su forma entre tarjetas (una nube, una piedra, un fuego, una ola, un nudo, unos pinchos) y su color.
   - Señalar en una silueta del cuerpo dónde la nota y poner allí una pegatina.
   - Mostrar con las manos lo grande que es ("¿así o así?").
   - Hacerla con plastilina.
   - Escribir una palabra en un papel (alumnos que leen).
3. "¿Dónde está ahora?" (en el papel, en la tarjeta) "¿Y tú, dónde estás?" (aquí).
4. "¿Quién lo nota? ¿Quién es más grande, tú o la sensación? ¿Quién puede hacer más cosas?" Correcto: "Yo" y "Yo".
5. Ayudas: señalar al alumno y al papel; con la silueta, comparar el tamaño de la pegatina con el del cuerpo entero.

Fase 2 - Transformación de funciones (elección), sin ayudas: con la experiencia todavía presente, ofrezca las dos opciones de la clase ("¿Qué eliges: esperar y ganar dos o comértela ya?") y cumpla lo prometido. Después pregunte: "¿Quién ha elegido? ¿Quién mandaba, tú o las ganas?"

Generalización: situaciones reales del día (enfados, esperas, nervios), haciendo las mismas preguntas en el momento.

Economía de fichas: use la de la app (estrellas, premio y «Continuar», en Ajustes de refuerzo) para dar la regla «si no me enfado, gano una ficha», y retírela poco a poco hacia consecuencias más lejanas y simbólicas (ver «Identificar Valores»).

Registro en la app (fase · posición origen → destino):
- Entrenamiento: A → B (preguntas jerárquicas)
- Transformación de funciones: A → C (elección)$t$, secuencia_rft = $j$[{"fase": "entrenamiento", "origen": "A", "destino": "B"}, {"fase": "transformacion_funciones", "origen": "A", "destino": "C"}]$j$::jsonb, tipo_respuesta = 'abierta', opciones_respuesta = null, respuesta_por_fase = $j${"transformacion_funciones": {"tipo": "opciones", "opciones": []}}$j$::jsonb, opciones_clase = false, orden = 3, contenido_actualizado_at = now() where clinica_id is null and nombre = 'Distinguir el Yo que Observa';
update programas_base set objetivo = $t$El alumno distingue un pensamiento de un hecho («Soy tonto» frente a «Hoy he fallado dos sumas»), dice el pensamiento como pensamiento («Estoy pensando que soy tonto»), lo contiene (lo escribe, ve que es él quien lo tiene y lo guarda en la carpeta) y actúa aunque el pensamiento siga ahí.$t$, materiales = $t$Grupos de 5 clases: 3 pensamientos y 2 hechos de control mezclados (sobre uno mismo, predicciones, sobre los demás).

A: La frase
B: Cómo se dice («Estoy pensando que…» si es un pensamiento; igual si es un hecho)
C: La elección (solo en los pensamientos)

La primera fase se puede hacer en la tableta (opciones «Es un pensamiento» / «Es un hecho»). Para la tercera: papel, lápiz y una carpeta o caja de «los pensamientos».$t$, instrucciones_terapeuta = $t$Requisito previo: el alumno ha superado "Distinguir el Yo que Observa" (dominio 4.4) y "Nombrar Emociones y Sensaciones Propias" (dominio 4.1).

Por qué se hace así: según Luciano y colaboradores, la flexibilidad psicológica consiste en enmarcar la propia experiencia con relaciones deícticas (yo AQUÍ, la experiencia ALLÍ) y jerárquicas (yo la contengo, soy más grande que ella), lo que le quita fuerza y deja elegir según lo que importa (Luciano, Valdivia-Salas y Ruiz, 2012). En adolescentes, solo el protocolo con los tres tipos de ensayo (deíctico, jerárquico y elección por valores) produjo cambios (Luciano et al., 2011), y en adultos el yo jerárquico redujo más el malestar que el yo por distinción (Foody et al., 2013). Con un niño de 5 años bastaron cuatro sesiones de 20 minutos (Ruiz y Perete, 2015). Se avanza de experiencias neutras a molestas para aprender sin error.

Fase 1 - Entrenamiento (pensamiento o hecho): diga la frase y "¿Es un pensamiento o un hecho?". Un hecho se puede comprobar (lo ve cualquiera); un pensamiento es algo que se dice uno por dentro. Ayuda: "¿Lo podemos ver o comprobar?"

Fase 2 - Test de Vinculación Mutua (decirlo como pensamiento), sin entrenamiento: "¿Cómo lo dirías?". En los pensamientos se espera "Estoy pensando que…"; en los hechos, la misma frase. Respuesta de hablante: el terapeuta puntúa.

Fase 3 - Transformación de funciones (contener y elegir), sin ayudas:
1. El alumno escribe el pensamiento en un papel. "¿Quién lo ha pensado? ¿Quién lo ha escrito? ¿Cabe en ti? ¿Quién es más grande, tú o el pensamiento?"
2. Guardan el papel en la carpeta de los pensamientos: "Ahí guardamos todos los pensamientos que tengas; caben todos."
3. Plantee la situación de la clase y las dos opciones ("Salgo aunque lo piense" / "No salgo").

Generalización: pensamientos reales del alumno, escritos y guardados en su carpeta en el momento en que aparecen.

Registro en la app (fase · posición origen → destino):
- Entrenamiento: A → B (pensamiento o hecho)
- Test de vínculo mutuo: A → B (decirlo como pensamiento)
- Transformación de funciones: A → C (contener y elegir)$t$, secuencia_rft = $j$[{"fase": "entrenamiento", "origen": "A", "destino": "B"}, {"fase": "test_mutuo", "origen": "A", "destino": "B"}, {"fase": "transformacion_funciones", "origen": "A", "destino": "C"}]$j$::jsonb, tipo_respuesta = 'opciones', opciones_respuesta = array[$j$Es un pensamiento$j$,$j$Es un hecho$j$], respuesta_por_fase = $j${"test_mutuo": {"tipo": "abierta", "opciones": []}}$j$::jsonb, opciones_clase = false, orden = 4, contenido_actualizado_at = now() where clinica_id is null and nombre = 'Diferenciar Pensamientos de Hechos';
update programas_base set objetivo = $t$El alumno elige la conducta que lleva a consecuencias más lejanas y simbólicas frente a la alternativa inmediata, primero con premios concretos, después con consecuencias sociales y por último con lo que le importa (sus valores), también en situaciones nuevas con conflicto.$t$, materiales = $t$Grupos de 3 clases, de lo concreto a lo abstracto:
1. Algo pequeño ahora o más después.
2. Consecuencias sociales y simbólicas (contárselo a la abuela, que el hermano vea que ya es mayor, que el amigo esté contento).
3. Valores (ser buen amigo, aprender cosas nuevas, cuidar de la familia) ↔ acciones.

A: La situación o el valor
B: La elección valiosa o la acción

Las fichas acumulables se trabajan con la economía de fichas de la app (ver abajo).$t$, instrucciones_terapeuta = $t$Requisito previo: el alumno ha superado "Seguir Reglas Condicionales" (dominio 3.7) y "Distinguir el Yo que Observa" (dominio 4.4).

Por qué se hace así: según Luciano y colaboradores, la flexibilidad psicológica consiste en enmarcar la propia experiencia con relaciones deícticas (yo AQUÍ, la experiencia ALLÍ) y jerárquicas (yo la contengo, soy más grande que ella), lo que le quita fuerza y deja elegir según lo que importa (Luciano, Valdivia-Salas y Ruiz, 2012). En adolescentes, solo el protocolo con los tres tipos de ensayo (deíctico, jerárquico y elección por valores) produjo cambios (Luciano et al., 2011), y en adultos el yo jerárquico redujo más el malestar que el yo por distinción (Foody et al., 2013). Con un niño de 5 años bastaron cuatro sesiones de 20 minutos (Ruiz y Perete, 2015). Se avanza de experiencias neutras a molestas para aprender sin error.

Fase 1 - Entrenamiento: plantee la situación y "¿Qué eliges?" (en el grupo 3: "Quieres ser buen amigo. ¿Qué haces?"). Ayuda: describir las dos consecuencias ("Si te la comes ahora, tienes una; si esperas, dos") y, en el grupo 2, preguntar "¿Qué es más importante para ti?".

Fase 2 - Test de Vinculación Mutua, sin entrenamiento: de la elección a su consecuencia ("Si esperas tu turno, ¿qué verá tu hermano?") y, en el grupo 3, de la acción al valor ("Compartes tus juguetes. ¿Qué te importa cuando haces esto?").

Fase 3 - Transformación de funciones, sin ayudas: una situación nueva con conflicto ("Quieres ser buen amigo. Tu amigo está triste y tú quieres seguir jugando. ¿Qué haces?").

Generalización: elecciones reales del día, cumpliendo siempre la consecuencia prometida.

Economía de fichas: use la de la app (estrellas, premio y «Continuar», en Ajustes de refuerzo) para dar la regla «si no me enfado, gano una ficha», y retírela poco a poco hacia consecuencias más lejanas y simbólicas (ver «Identificar Valores»).

Registro en la app (fase · posición origen → destino):
- Entrenamiento: A → B (elegir)
- Test de vínculo mutuo: B → A (de la elección a su consecuencia o valor)
- Transformación de funciones: A → B (situación nueva)$t$, secuencia_rft = $j$[{"fase": "entrenamiento", "origen": "A", "destino": "B"}, {"fase": "test_mutuo", "origen": "B", "destino": "A"}, {"fase": "transformacion_funciones", "origen": "A", "destino": "B"}]$j$::jsonb, tipo_respuesta = 'opciones', opciones_respuesta = null, respuesta_por_fase = $j${}$j$::jsonb, opciones_clase = false, orden = 5, contenido_actualizado_at = now() where clinica_id is null and nombre = 'Identificar Valores';
delete from requisitos_programa where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa');
insert into requisitos_programa (programa_base_id, requisito_id) values ((select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'), (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas'));
insert into requisitos_programa (programa_base_id, requisito_id) values ((select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'), (select id from programas_base where clinica_id is null and nombre = 'Relaciones Deícticas Simples'));
insert into requisitos_programa (programa_base_id, requisito_id) values ((select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'), (select id from programas_base where clinica_id is null and nombre = 'Nombrar Emociones y Sensaciones Propias'));
delete from requisitos_programa where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Diferenciar Pensamientos de Hechos');
insert into requisitos_programa (programa_base_id, requisito_id) values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Pensamientos de Hechos'), (select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'));
insert into requisitos_programa (programa_base_id, requisito_id) values ((select id from programas_base where clinica_id is null and nombre = 'Diferenciar Pensamientos de Hechos'), (select id from programas_base where clinica_id is null and nombre = 'Nombrar Emociones y Sensaciones Propias'));
delete from requisitos_programa where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Identificar Valores');
insert into requisitos_programa (programa_base_id, requisito_id) values ((select id from programas_base where clinica_id is null and nombre = 'Identificar Valores'), (select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'));
insert into requisitos_programa (programa_base_id, requisito_id) values ((select id from programas_base where clinica_id is null and nombre = 'Identificar Valores'), (select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'));
commit;
