-- «Abstraer Claves Temporales»: primer nivel en la tableta con el orden físico
-- en que aparecen dos imágenes sin relación («¿Cuál salió antes / después?»),
-- el nivel no arbitrario más limpio (Neufeld, Stewart y McElwee, 2023): no
-- depende de saber cómo suelen ocurrir las cosas.
begin;

update programas_base set
  actividad_tablet = '{"tipo": "temporal", "niveles": [{"modo": "orden_presentacion", "nombre": "Orden en que aparecen"}, {"modo": "primero_despues", "nombre": "Primero y después"}, {"modo": "antes_despues", "nombre": "Antes y después"}]}'::jsonb,
  instrucciones_terapeuta = replace(instrucciones_terapeuta,
    'Modo tableta: con viñetas de una secuencia,',
    'Modo tableta: primero, el orden en que aparecen: dos objetos sin relación entre sí aparecen uno tras otro en el centro de la pantalla y después salen los dos, en posiciones al azar, con "¿Cuál salió antes?" o "¿Cuál salió después?" alternados (el orden solo se sabe por cómo aparecieron, no por conocer el mundo). Después, con viñetas de una secuencia,')
where clinica_id is null and nombre = 'Abstraer Claves Temporales';

commit;
