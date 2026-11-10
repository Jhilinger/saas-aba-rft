-- Abstraer Claves de Comparación: peso y velocidad pasan de sondas de
-- generalización a dimensiones entrenadas (solo con material: el peso hay que
-- sentirlo y la velocidad verla en movimiento), para poder usarlas después en
-- las relaciones verbales de comparación. Las sondas pasan a anchura y grosor.

begin;

with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  values ((select id from programas_base where clinica_id is null and nombre = 'Abstraer Claves de Comparación'), 'Clase 5', 'Grupo 1') returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre)
select id, 'A5', 'A', 'Caja pesada ↔ caja ligera (peso)' from nueva;

with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  values ((select id from programas_base where clinica_id is null and nombre = 'Abstraer Claves de Comparación'), 'Clase 6', 'Grupo 1') returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre)
select id, 'A6', 'A', 'Coche rápido ↔ coche lento (velocidad)' from nueva;

update programas_base set
  materiales = replace(materiales,
    '(tamaño, longitud, altura, cantidad)',
    '(tamaño, longitud, altura, cantidad, peso, velocidad)') || '

Peso y velocidad, solo con material: para el peso, cajas o botes iguales por fuera con distinto relleno (arena, canicas), que el alumno levanta; para la velocidad, coches de juguete iguales que bajan por rampas de distinta inclinación.',
  instrucciones_terapeuta = replace(replace(instrucciones_terapeuta,
    '4. Alterne las dimensiones entre ensayos (tamaño, longitud, altura, cantidad) y no nombre ninguna medida: utilice únicamente la clave comparativa.',
    '4. Alterne las dimensiones entre ensayos (tamaño, longitud, altura, cantidad, peso y velocidad) y no nombre ninguna medida: utilice únicamente la clave comparativa. El peso y la velocidad se trabajan solo con material: el alumno levanta las dos cajas antes de responder ("¿Cuál pesa más?", "¿Cuál pesa menos?"), o mira cómo bajan los dos coches por sus rampas ("¿Cuál va más rápido?", "¿Cuál va más lento?").'),
    '1. Presente dimensiones no entrenadas: peso ("¿Cuál pesa más?", con dos cajas iguales de distinto peso que el alumno puede levantar) y velocidad ("¿Cuál va más rápido?", con dos coches de juguete).',
    '1. Presente dimensiones no entrenadas: anchura ("¿Cuál es más ancha?", "¿Cuál es más estrecha?", con dos cintas iguales salvo en la anchura) y grosor ("¿Qué libro es más gordo?", "¿Cuál es más fino?").')
where clinica_id is null and nombre = 'Abstraer Claves de Comparación';

commit;
