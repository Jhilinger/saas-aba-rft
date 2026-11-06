-- Conceptos básicos en la tableta: espaciales y temporales (escenas y
-- secuencias generadas con scripts/imagenes/escenas-conceptos.mjs)

update programas_base set actividad_tablet = '{"tipo": "espacial", "niveles": [
  {"nombre": "Encima y debajo", "pares": ["encima_debajo"]},
  {"nombre": "Dentro y fuera", "pares": ["dentro_fuera"]},
  {"nombre": "Delante y detrás", "pares": ["delante_detras"]},
  {"nombre": "Todas mezcladas", "pares": ["encima_debajo", "dentro_fuera", "delante_detras"]}
]}'::jsonb
where clinica_id is null and nombre = 'Abstraer Claves Espaciales';

update programas_base set actividad_tablet = '{"tipo": "temporal", "niveles": [
  {"nombre": "Primero y después", "modo": "primero_despues"},
  {"nombre": "Antes y después", "modo": "antes_despues"}
]}'::jsonb
where clinica_id is null and nombre = 'Abstraer Claves Temporales';

update programas_base set instrucciones_terapeuta = instrucciones_terapeuta || E'\n\nModo tableta: la tableta presenta dos escenas con los mismos objetos en los dos polos de un par (encima/debajo, dentro/fuera, delante/detrás) y pide "Toca donde la pelota está encima de la caja", alternando las claves de cada par. Es una respuesta de selección: la colocación (receptiva) y la descripción (expresiva) siguen con material. Las sondas de generalización usan otros objetos.'
where clinica_id is null and nombre = 'Abstraer Claves Espaciales' and instrucciones_terapeuta not like '%Modo tableta:%';

update programas_base set instrucciones_terapeuta = instrucciones_terapeuta || E'\n\nModo tableta: con viñetas de una secuencia, "¿Qué pasó primero?" y "¿Qué pasó después?" alternados entre dos viñetas seguidas; después, con una viñeta como muestra, "¿Qué pasó antes?" y "¿Qué pasó después?". Los acontecimientos vividos y la ordenación de la historia siguen con material. Las sondas de generalización usan secuencias que no salen en el entrenamiento.'
where clinica_id is null and nombre = 'Abstraer Claves Temporales' and instrucciones_terapeuta not like '%Modo tableta:%';
