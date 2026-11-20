-- Temporales según Barry, Neufeld y Stewart (2024) y Clark (1971):
-- 1) «Abstraer Claves Temporales»: ensayos de sí/no en «Orden en que aparecen»
--    y corrección del error en la tableta.
-- 2) Vincular y Redes: la evolución separa el orden de mención de las premisas.
update programas_base set instrucciones_terapeuta = replace(instrucciones_terapeuta,
  '(el orden solo se sabe por cómo aparecieron, no por conocer el mundo).',
  '(el orden solo se sabe por cómo aparecieron, no por conocer el mundo). Un tercio de estos ensayos son de sí/no («¿Este salió antes?», con uno de los dos objetos como muestra; la mitad con respuesta «sí»), para variar la forma de respuesta.')
where clinica_id is null and nombre = 'Abstraer Claves Temporales';

update programas_base set instrucciones_terapeuta = replace(instrucciones_terapeuta,
  'Las sondas de generalización usan secuencias que no salen en el entrenamiento.',
  E'Las sondas de generalización usan secuencias que no salen en el entrenamiento.\n\nCorrección del error (entrenamiento): tras un error, la tableta vuelve a presentar la secuencia con los rótulos «Antes» y «Después» (o resalta la respuesta correcta), deja solo la correcta para que el alumno la toque y repite el ensayo sin ayuda. El ensayo cuenta como error; la repetición se guarda aparte y no cuenta para el porcentaje (Barry, Neufeld y Stewart, 2024).')
where clinica_id is null and nombre = 'Abstraer Claves Temporales';

update programas_base set instrucciones_terapeuta = replace(instrucciones_terapeuta,
  'dé más ejemplares con esa clave antes de pasar de fase.',
  'dé más ejemplares con esa clave antes de pasar de fase. La evolución separa también las premisas que nombran los hechos en el orden en que ocurren («Pim salta antes de cantar», «Después de saltar, Pim canta») de las que los nombran al revés («Pim canta después de saltar», «Antes de cantar, Pim salta»): sin dominar la clave, el niño tiende a responder por el orden de las palabras (Clark, 1971). Si falla sobre todo con el orden inverso, dé más ejemplares de ese tipo.')
where clinica_id is null and nombre in ('Vincular Mutuamente Relaciones Temporales', 'Derivar Relaciones Temporales en Redes Combinatorias');
