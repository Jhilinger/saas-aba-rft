-- Sondas de generalización: «Señala {muestra}» en lugar de «¿Dónde está
-- {muestra}?», que quedaba sin artículo («¿Dónde está agua?»)
update programas_base set consignas = replace(consignas::text, '¿Dónde está {muestra}?', 'Señala {muestra}')::jsonb
  where consignas::text like '%¿Dónde está {muestra}?%';
update programas_alumno set consignas = replace(consignas::text, '¿Dónde está {muestra}?', 'Señala {muestra}')::jsonb
  where consignas::text like '%¿Dónde está {muestra}?%';
