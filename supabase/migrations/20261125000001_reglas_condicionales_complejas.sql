-- «Seguir Reglas Condicionales»: dos grupos de reglas más complejas (2026-11-25, aprobado por el usuario):
-- grupo 9 con «si no» (la tarjeta morada nunca se nombra) y grupo 10 con dos condiciones (color y figura).
begin;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 25', 'Grupo 9', 25, $j${"entrenamiento:A→B": "Ha salido la tarjeta azul. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar el gato?"}$j$::jsonb, '{}'::jsonb, '{}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, 'A25', 'A', $j$Tarjeta azul$j$, null, $j${"color": "#3B82F6"}$j$::jsonb from nueva union all select id, 'B25', 'B', $j$El gato$j$, $j$animales-de-granja/gato$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 26', 'Grupo 9', 26, $j${"entrenamiento:A→B": "Ha salido la tarjeta verde. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar el caballo?"}$j$::jsonb, '{}'::jsonb, '{}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, 'A26', 'A', $j$Tarjeta verde$j$, null, $j${"color": "#22C55E"}$j$::jsonb from nueva union all select id, 'B26', 'B', $j$El caballo$j$, $j$animales-de-granja/caballo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 27', 'Grupo 9', 27, $j${"entrenamiento:A→B": "Ha salido la tarjeta morada. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar la oveja?"}$j$::jsonb, '{}'::jsonb, '{}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, 'A27', 'A', $j$Tarjeta morada$j$, null, $j${"color": "#A855F7"}$j$::jsonb from nueva union all select id, 'B27', 'B', $j$La oveja$j$, $j$animales-de-granja/oveja$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 28', 'Grupo 10', 28, $j${"entrenamiento:A→B": "Ha salido la tarjeta roja con una estrella. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar el autobús?"}$j$::jsonb, '{}'::jsonb, '{}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, 'A28', 'A', $j$Tarjeta roja con estrella$j$, null, $j${"par": [{"color": "#EF4444"}, {"fig": "geometrica", "s": "estrella"}]}$j$::jsonb from nueva union all select id, 'B28', 'B', $j$El autobús$j$, $j$vehiculos/autobus$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 29', 'Grupo 10', 29, $j${"entrenamiento:A→B": "Ha salido la tarjeta roja con un círculo. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar la bicicleta?"}$j$::jsonb, '{}'::jsonb, '{}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, 'A29', 'A', $j$Tarjeta roja con círculo$j$, null, $j${"par": [{"color": "#EF4444"}, {"fig": "geometrica", "s": "circulo"}]}$j$::jsonb from nueva union all select id, 'B29', 'B', $j$La bicicleta$j$, $j$vehiculos/bicicleta$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Seguir Reglas Condicionales'), 'Clase 30', 'Grupo 10', 30, $j${"entrenamiento:A→B": "Ha salido la tarjeta azul con una estrella. ¿Qué tienes que tocar?", "test_mutuo:B→A": "¿Cuándo tienes que tocar el tren?"}$j$::jsonb, '{}'::jsonb, '{}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen, pantalla)
select id, 'A30', 'A', $j$Tarjeta azul con estrella$j$, null, $j${"par": [{"color": "#3B82F6"}, {"fig": "geometrica", "s": "estrella"}]}$j$::jsonb from nueva union all select id, 'B30', 'B', $j$El tren$j$, $j$vehiculos/tren$j$, null from nueva;
update programas_base set instrucciones_terapeuta = regexp_replace(instrucciones_terapeuta, 'Fase 2 -', $j$Reglas más complejas (grupos 9 y 10), cuando el alumno sigue sin error las reglas simples y los cambios de regla:
- Grupo 9, con «si no»: "Si sale la azul, toca el gato; si sale la verde, toca el caballo; si no sale ni la azul ni la verde, toca la oveja." La tarjeta morada no se nombra nunca: el alumno tiene que derivar su respuesta del «si no» (el «no» lógico que también aparece en la falsa creencia, McHugh et al., 2004).
- Grupo 10, con dos condiciones: "Si la tarjeta es roja y tiene una estrella, toca el autobús; si es roja y tiene un círculo, toca la bicicleta; si es azul y tiene una estrella, toca el tren." Ni el color solo ni la figura sola deciden la respuesta: hay que atender a las dos.
Diga las tres reglas del grupo una sola vez antes del bloque, como en los demás grupos.

Fase 2 -$j$), materiales = materiales || $j$

Grupos 9 y 10, reglas más complejas: el 9 con «si no» (tarjetas azul, verde y morada; la morada no se nombra en la regla) y el 10 con dos condiciones (tarjetas de color con una figura: roja con estrella, roja con círculo, azul con estrella).$j$, contenido_actualizado_at = now() where clinica_id is null and nombre = 'Seguir Reglas Condicionales' and position('Grupo 9, con' in instrucciones_terapeuta) = 0;
commit;
