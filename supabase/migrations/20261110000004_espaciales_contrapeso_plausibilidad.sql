-- Relaciones espaciales verbales: contrapeso de plausibilidad. En el eje
-- encima/debajo el conocimiento del mundo predice la respuesta («el gato encima
-- de la mesa»), así que el test podría acertarse sin derivar la inversa. En 4
-- de las 8 clases verticales (2 en orden normal, 2 en orden invertido; 2 con
-- «encima» y 2 con «debajo») la relación es la contraria a la habitual: la
-- respuesta solo puede salir de lo dicho. Delante/detrás e izquierda/derecha
-- ya son neutras con estos pares.

begin;

-- Clase 4 (orden invertido): la silla debajo de la pelota.
update clases_rft_base set consignas = '{"entrenamiento:B→A": "Debajo de la pelota está la silla. ¿Qué está debajo de la pelota?", "test_mutuo:A→B": "Debajo de la pelota está la silla. ¿Qué está encima de la silla?"}'::jsonb where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales') and nombre = 'Clase 4';
update estimulos_rft_base e set nombre = 'La silla', concepto_imagen = 'muebles/silla' from clases_rft_base c where e.clase_base_id = c.id and c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales') and c.nombre = 'Clase 4' and e.posicion = 'A';
update estimulos_rft_base e set nombre = 'La pelota', concepto_imagen = 'objetos/pelota' from clases_rft_base c where e.clase_base_id = c.id and c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales') and c.nombre = 'Clase 4' and e.posicion = 'B';

-- Clase 7 (orden normal): la cama encima del libro.
update clases_rft_base set consignas = '{"entrenamiento:B→A": "La cama está encima del libro. ¿Qué está encima del libro?", "test_mutuo:A→B": "La cama está encima del libro. ¿Qué está debajo de la cama?"}'::jsonb where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales') and nombre = 'Clase 7';
update estimulos_rft_base e set nombre = 'La cama', concepto_imagen = 'muebles/cama' from clases_rft_base c where e.clase_base_id = c.id and c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales') and c.nombre = 'Clase 7' and e.posicion = 'A';
update estimulos_rft_base e set nombre = 'El libro', concepto_imagen = 'material-escolar/libro' from clases_rft_base c where e.clase_base_id = c.id and c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales') and c.nombre = 'Clase 7' and e.posicion = 'B';

-- Clase 16 (orden invertido): la estantería encima del globo.
update clases_rft_base set consignas = '{"entrenamiento:B→A": "Encima del globo está la estantería. ¿Qué está encima del globo?", "test_mutuo:A→B": "Encima del globo está la estantería. ¿Qué está debajo de la estantería?"}'::jsonb where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales') and nombre = 'Clase 16';
update estimulos_rft_base e set nombre = 'La estantería', concepto_imagen = 'muebles/estanteria' from clases_rft_base c where e.clase_base_id = c.id and c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales') and c.nombre = 'Clase 16' and e.posicion = 'A';
update estimulos_rft_base e set nombre = 'El globo', concepto_imagen = 'objetos/globo' from clases_rft_base c where e.clase_base_id = c.id and c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales') and c.nombre = 'Clase 16' and e.posicion = 'B';

-- Clase 19 (orden normal): la mesita de noche debajo de la muñeca.
update clases_rft_base set consignas = '{"entrenamiento:B→A": "La mesita de noche está debajo de la muñeca. ¿Qué está debajo de la muñeca?", "test_mutuo:A→B": "La mesita de noche está debajo de la muñeca. ¿Qué está encima de la mesita de noche?"}'::jsonb where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales') and nombre = 'Clase 19';
update estimulos_rft_base e set nombre = 'La mesita de noche', concepto_imagen = 'muebles/mesita-de-noche' from clases_rft_base c where e.clase_base_id = c.id and c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales') and c.nombre = 'Clase 19' and e.posicion = 'A';
update estimulos_rft_base e set nombre = 'La muñeca', concepto_imagen = 'objetos/muneca' from clases_rft_base c where e.clase_base_id = c.id and c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales') and c.nombre = 'Clase 19' and e.posicion = 'B';

update programas_base set
  materiales = replace(materiales,
    'En la mitad de las clases la frase va en orden invertido («Debajo de la silla está la pelota»), para que la respuesta no sea siempre el mismo nombre de la frase.',
    'En la mitad de las clases la frase va en orden invertido («Delante del coche está el perro»), para que la respuesta no sea siempre el mismo nombre de la frase. En la mitad de las relaciones encima/debajo la disposición es la contraria a la habitual («La cama está encima del libro»), para que la respuesta no pueda salir del conocimiento del mundo.'),
  instrucciones_terapeuta = replace(instrucciones_terapeuta,
    'En la mitad de las clases la relación se enuncia en orden invertido («Debajo de la silla está la pelota»).',
    'En la mitad de las clases la relación se enuncia en orden invertido («Delante del coche está el perro»). Las clases 4, 7, 16 y 19 enuncian relaciones contrarias a lo habitual («La cama está encima del libro»): enúncielas igual, sin corregirlas ni comentarlas. Si el alumno acierta el test en las relaciones habituales y falla en estas, está respondiendo por conocimiento del mundo y no está derivando la relación inversa.')
where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales';

commit;
