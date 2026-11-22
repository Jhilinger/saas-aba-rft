-- «Seguir Reglas Condicionales» en la tableta: la condición es una tarjeta de color y la acción,
-- tocar una imagen (tocar es seguir la regla). Reglas nuevas en los grupos impares y cambio de regla
-- en los pares (O'Hora et al., 2004; Tarbox et al., 2011). Las acciones reales, fuera de la tableta.
begin;
delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 1', 'Grupo 1', 1, $j${"entrenamiento:A→B": "Ha salido la tarjeta azul. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar el perro?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto, x.pantalla::jsonb from nueva, (values
  ('A1', 'A', 'Tarjeta azul', null, '{"color": "#3B82F6"}'),
  ('B1', 'B', 'El perro', 'animales-de-granja/perro', null)) x(etiqueta, posicion, nombre, concepto, pantalla);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 2', 'Grupo 1', 2, $j${"entrenamiento:A→B": "Ha salido la tarjeta roja. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar la vaca?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto, x.pantalla::jsonb from nueva, (values
  ('A2', 'A', 'Tarjeta roja', null, '{"color": "#EF4444"}'),
  ('B2', 'B', 'La vaca', 'animales-de-granja/vaca', null)) x(etiqueta, posicion, nombre, concepto, pantalla);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 3', 'Grupo 1', 3, $j${"entrenamiento:A→B": "Ha salido la tarjeta amarilla. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar el pato?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto, x.pantalla::jsonb from nueva, (values
  ('A3', 'A', 'Tarjeta amarilla', null, '{"color": "#FACC15"}'),
  ('B3', 'B', 'El pato', 'animales-de-granja/pato', null)) x(etiqueta, posicion, nombre, concepto, pantalla);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 4', 'Grupo 2', 4, $j${"entrenamiento:A→B": "Ha salido la tarjeta azul. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar la vaca?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto, x.pantalla::jsonb from nueva, (values
  ('A4', 'A', 'Tarjeta azul', null, '{"color": "#3B82F6"}'),
  ('B4', 'B', 'La vaca', 'animales-de-granja/vaca', null)) x(etiqueta, posicion, nombre, concepto, pantalla);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 5', 'Grupo 2', 5, $j${"entrenamiento:A→B": "Ha salido la tarjeta roja. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar el pato?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto, x.pantalla::jsonb from nueva, (values
  ('A5', 'A', 'Tarjeta roja', null, '{"color": "#EF4444"}'),
  ('B5', 'B', 'El pato', 'animales-de-granja/pato', null)) x(etiqueta, posicion, nombre, concepto, pantalla);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 6', 'Grupo 2', 6, $j${"entrenamiento:A→B": "Ha salido la tarjeta amarilla. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar el perro?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto, x.pantalla::jsonb from nueva, (values
  ('A6', 'A', 'Tarjeta amarilla', null, '{"color": "#FACC15"}'),
  ('B6', 'B', 'El perro', 'animales-de-granja/perro', null)) x(etiqueta, posicion, nombre, concepto, pantalla);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 7', 'Grupo 3', 7, $j${"entrenamiento:A→B": "Ha salido la tarjeta verde. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar el tambor?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto, x.pantalla::jsonb from nueva, (values
  ('A7', 'A', 'Tarjeta verde', null, '{"color": "#22C55E"}'),
  ('B7', 'B', 'El tambor', 'instrumentos-musicales/tambor', null)) x(etiqueta, posicion, nombre, concepto, pantalla);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 8', 'Grupo 3', 8, $j${"entrenamiento:A→B": "Ha salido la tarjeta naranja. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar la guitarra?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto, x.pantalla::jsonb from nueva, (values
  ('A8', 'A', 'Tarjeta naranja', null, '{"color": "#F97316"}'),
  ('B8', 'B', 'La guitarra', 'instrumentos-musicales/guitarra', null)) x(etiqueta, posicion, nombre, concepto, pantalla);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 9', 'Grupo 3', 9, $j${"entrenamiento:A→B": "Ha salido la tarjeta morada. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar el piano?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto, x.pantalla::jsonb from nueva, (values
  ('A9', 'A', 'Tarjeta morada', null, '{"color": "#A855F7"}'),
  ('B9', 'B', 'El piano', 'instrumentos-musicales/piano', null)) x(etiqueta, posicion, nombre, concepto, pantalla);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 10', 'Grupo 4', 10, $j${"entrenamiento:A→B": "Ha salido la tarjeta verde. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar la guitarra?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto, x.pantalla::jsonb from nueva, (values
  ('A10', 'A', 'Tarjeta verde', null, '{"color": "#22C55E"}'),
  ('B10', 'B', 'La guitarra', 'instrumentos-musicales/guitarra', null)) x(etiqueta, posicion, nombre, concepto, pantalla);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 11', 'Grupo 4', 11, $j${"entrenamiento:A→B": "Ha salido la tarjeta naranja. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar el piano?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto, x.pantalla::jsonb from nueva, (values
  ('A11', 'A', 'Tarjeta naranja', null, '{"color": "#F97316"}'),
  ('B11', 'B', 'El piano', 'instrumentos-musicales/piano', null)) x(etiqueta, posicion, nombre, concepto, pantalla);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 12', 'Grupo 4', 12, $j${"entrenamiento:A→B": "Ha salido la tarjeta morada. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar el tambor?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto, x.pantalla::jsonb from nueva, (values
  ('A12', 'A', 'Tarjeta morada', null, '{"color": "#A855F7"}'),
  ('B12', 'B', 'El tambor', 'instrumentos-musicales/tambor', null)) x(etiqueta, posicion, nombre, concepto, pantalla);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 13', 'Grupo 5', 13, $j${"entrenamiento:A→B": "Ha salido la tarjeta azul. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar el coche?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto, x.pantalla::jsonb from nueva, (values
  ('A13', 'A', 'Tarjeta azul', null, '{"color": "#3B82F6"}'),
  ('B13', 'B', 'El coche', 'vehiculos/coche', null)) x(etiqueta, posicion, nombre, concepto, pantalla);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 14', 'Grupo 5', 14, $j${"entrenamiento:A→B": "Ha salido la tarjeta verde. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar el avión?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto, x.pantalla::jsonb from nueva, (values
  ('A14', 'A', 'Tarjeta verde', null, '{"color": "#22C55E"}'),
  ('B14', 'B', 'El avión', 'vehiculos/avion', null)) x(etiqueta, posicion, nombre, concepto, pantalla);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 15', 'Grupo 5', 15, $j${"entrenamiento:A→B": "Ha salido la tarjeta roja. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar el barco?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto, x.pantalla::jsonb from nueva, (values
  ('A15', 'A', 'Tarjeta roja', null, '{"color": "#EF4444"}'),
  ('B15', 'B', 'El barco', 'vehiculos/barco', null)) x(etiqueta, posicion, nombre, concepto, pantalla);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 16', 'Grupo 6', 16, $j${"entrenamiento:A→B": "Ha salido la tarjeta azul. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar el avión?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto, x.pantalla::jsonb from nueva, (values
  ('A16', 'A', 'Tarjeta azul', null, '{"color": "#3B82F6"}'),
  ('B16', 'B', 'El avión', 'vehiculos/avion', null)) x(etiqueta, posicion, nombre, concepto, pantalla);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 17', 'Grupo 6', 17, $j${"entrenamiento:A→B": "Ha salido la tarjeta verde. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar el barco?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto, x.pantalla::jsonb from nueva, (values
  ('A17', 'A', 'Tarjeta verde', null, '{"color": "#22C55E"}'),
  ('B17', 'B', 'El barco', 'vehiculos/barco', null)) x(etiqueta, posicion, nombre, concepto, pantalla);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 18', 'Grupo 6', 18, $j${"entrenamiento:A→B": "Ha salido la tarjeta roja. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar el coche?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto, x.pantalla::jsonb from nueva, (values
  ('A18', 'A', 'Tarjeta roja', null, '{"color": "#EF4444"}'),
  ('B18', 'B', 'El coche', 'vehiculos/coche', null)) x(etiqueta, posicion, nombre, concepto, pantalla);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 19', 'Grupo 7', 19, $j${"entrenamiento:A→B": "Ha salido la tarjeta amarilla. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar el león?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto, x.pantalla::jsonb from nueva, (values
  ('A19', 'A', 'Tarjeta amarilla', null, '{"color": "#FACC15"}'),
  ('B19', 'B', 'El león', 'animales-salvajes/leon', null)) x(etiqueta, posicion, nombre, concepto, pantalla);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 20', 'Grupo 7', 20, $j${"entrenamiento:A→B": "Ha salido la tarjeta morada. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar el elefante?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto, x.pantalla::jsonb from nueva, (values
  ('A20', 'A', 'Tarjeta morada', null, '{"color": "#A855F7"}'),
  ('B20', 'B', 'El elefante', 'animales-salvajes/elefante', null)) x(etiqueta, posicion, nombre, concepto, pantalla);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 21', 'Grupo 7', 21, $j${"entrenamiento:A→B": "Ha salido la tarjeta naranja. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar la jirafa?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto, x.pantalla::jsonb from nueva, (values
  ('A21', 'A', 'Tarjeta naranja', null, '{"color": "#F97316"}'),
  ('B21', 'B', 'La jirafa', 'animales-salvajes/jirafa', null)) x(etiqueta, posicion, nombre, concepto, pantalla);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 22', 'Grupo 8', 22, $j${"entrenamiento:A→B": "Ha salido la tarjeta amarilla. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar el elefante?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto, x.pantalla::jsonb from nueva, (values
  ('A22', 'A', 'Tarjeta amarilla', null, '{"color": "#FACC15"}'),
  ('B22', 'B', 'El elefante', 'animales-salvajes/elefante', null)) x(etiqueta, posicion, nombre, concepto, pantalla);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 23', 'Grupo 8', 23, $j${"entrenamiento:A→B": "Ha salido la tarjeta morada. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar la jirafa?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto, x.pantalla::jsonb from nueva, (values
  ('A23', 'A', 'Tarjeta morada', null, '{"color": "#A855F7"}'),
  ('B23', 'B', 'La jirafa', 'animales-salvajes/jirafa', null)) x(etiqueta, posicion, nombre, concepto, pantalla);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 24', 'Grupo 8', 24, $j${"entrenamiento:A→B": "Ha salido la tarjeta naranja. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar el león?"}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto, x.pantalla::jsonb from nueva, (values
  ('A24', 'A', 'Tarjeta naranja', null, '{"color": "#F97316"}'),
  ('B24', 'B', 'El león', 'animales-salvajes/leon', null)) x(etiqueta, posicion, nombre, concepto, pantalla);
update programas_base set objetivo = $t$El alumno sigue reglas condicionales nuevas que solo ha oído una vez («Si sale la tarjeta azul, toca el perro; si sale la roja, toca la vaca»), sin entrenamiento directo de cada respuesta, y ajusta su conducta cuando la regla cambia: la regla transforma la función de cada tarjeta (O'Hora et al., 2004; Tarbox et al., 2011).$t$, materiales = $t$Grupos de 3 clases con 2 miembros. Cada grupo es un conjunto de tres reglas nuevas:

A: La condición: una tarjeta de color
B: Lo que manda la regla: tocar una imagen (un animal, un instrumento, un vehículo)

Los grupos impares son reglas nuevas y cada grupo par usa los mismos estímulos con las reglas cambiadas («Ahora cambia: si sale la azul, toca la vaca»), para probar si el alumno sigue la regla nueva o la anterior. En la tableta, la tarjeta sale arriba y las tres imágenes del grupo abajo; tocar la imagen es seguir la regla.$t$, instrucciones_terapeuta = $t$
Requisito previo: el alumno ha superado "Vincular Mutuamente Relaciones Condicionales" (dominio 3.7).

Seguir una regla nueva es responder a una red de relaciones que nunca se ha entrenado: la regla transforma la función de cada condición (O'Hora, Barnes-Holmes, Roche y Smeets, 2004; Tarbox et al., 2011, con niños con TEA y reglas «si… entonces»).

Fase 1 - Seguimiento de reglas nuevas (A → B):

1. Antes del bloque, diga las tres reglas del grupo una sola vez, sin práctica (las ve en «Revisión de grupos»: cada tarjeta con lo que manda): "Si sale la tarjeta azul, toca el perro; si sale la roja, toca la vaca; si sale la amarilla, toca el pato".
2. En la tableta salen las tarjetas en orden aleatorio ("Ha salido la tarjeta azul. ¿Qué tienes que tocar?"), sin repetir la regla. El alumno toca la imagen.
3. El primer bloque con un grupo nuevo, sin ayudas y sin reforzar diferencialmente, es la prueba principal: si alcanza el criterio, su conducta está bajo control de la regla y no de un entrenamiento directo (anótelo en las notas del bloque). Si no, continúe con refuerzo y ayudas hasta el criterio y pruebe después con el grupo siguiente de reglas nuevas.
4. Cambio de regla: los grupos pares usan los mismos estímulos con las reglas cambiadas. Dígalo antes del bloque ("Ahora cambia: si sale la azul, toca la vaca…"). Seguir la regla anterior indica insensibilidad al cambio de la regla.

Fase 2 - Test de Vinculación Mutua (comprensión de la regla, B → A), sin entrenamiento directo: "¿Cuándo tienes que tocar el perro?" (el alumno toca la tarjeta). No refuerce diferencialmente durante estos ensayos, pero registre la respuesta.

Generalización (sondas): reglas con otras condiciones y otras acciones, y reglas del aula y de casa.

La diferencia entre seguir una regla por quién la da y seguirla por las consecuencias que describe se trabaja en el dominio 4.4.

Realice el primer bloque de cada test sin ayudas. Si el alumno alcanza el criterio, la relación se considera DERIVADA; si se enseña con ayudas, quedará registrada como DOMINADA (no derivada), aunque el último bloque se realice sin ayudas.

Oyente y hablante: elija la forma en cada bloque al tomar datos. Como oyente, el alumno toca la imagen; como hablante, dice qué tiene que hacer y usted marca la respuesta. Cada forma se domina por separado (Luciano et al., 2009).

Registro en la app (fase · posición origen → destino):
- Entrenamiento: A → B ("Ha salido la tarjeta azul. ¿Qué tienes que tocar?"; la respuesta es B)
- Test de vínculo mutuo: B → A ("¿Cuándo tienes que tocar el perro?"; la respuesta es A)

Grupos de estímulos: los grupos y clases de este programa son un ejemplo. Cree en el PEI del alumno tantos grupos de reglas nuevas como considere oportuno.

Registro: en este programa los datos se toman solo en la tableta. Para el alumno que no lee, léale usted la frase.

Fuera de la tableta (sin registro): reglas con acciones de verdad ("Si te enseño la tarjeta azul, aplaude; si te enseño la roja, salta"), con cambios de regla, y reglas del aula y de casa ("Si terminas la ficha, puedes coger un cuento").$t$, ayudas_posibles = $t$(Aplicables solo después de un primer bloque sin ayudas que no alcance el criterio; la relación se registrará entonces como dominada, no derivada)

- Verbal parcial: repetir la regla de esa tarjeta ("Si sale la azul…")
- Visual: dejar a la vista un cartel con las reglas (tarjeta → imagen) y retirarlo poco a poco
- Gestual: señalar la imagen correcta en la pantalla
- Modelado: el terapeuta sigue primero la regla con otra tarjeta$t$,
  tipo_respuesta = 'seleccion', respuesta_por_fase = '{}'::jsonb, opciones_clase = false
where clinica_id is null and nombre = 'Seguir Reglas Condicionales';
commit;
