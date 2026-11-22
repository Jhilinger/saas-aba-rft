-- «Ordenar por Magnitud» pasa a ser dos niveles de «Abstraer Claves de Comparación» en la tableta
-- (tocar en orden): series de 3 y de 4 o 5 elementos, alternando el sentido. Es el combinatorio no
-- arbitrario de la comparación (Luciano et al., 2009, 6.4.1; Dunne et al., 2014, estudio 4). Se retira
-- el programa; las redes de comparación pasan a pedir la abstracción.
begin;
update programas_base set actividad_tablet = jsonb_set(actividad_tablet, '{niveles}', (actividad_tablet->'niveles') || '[
  {"nombre": "Ordenar 3", "dimensiones": ["tamano", "cantidad", "longitud", "altura"], "proporcion": 0.6, "orden": [3]},
  {"nombre": "Ordenar 4 y 5", "dimensiones": ["tamano", "cantidad", "longitud", "altura"], "proporcion": 0.75, "orden": [4, 5]}
]'::jsonb)
where clinica_id is null and nombre = 'Abstraer Claves de Comparación' and not (actividad_tablet::text like '%Ordenar 3%');

update programas_base set instrucciones_terapeuta = replace(replace(instrucciones_terapeuta,
  E'4. Diferencias pequeñas.',
  E'4. Diferencias pequeñas.\n5. Ordenar 3: «Toca del más pequeño al más grande» (o al revés): el alumno toca los tres en orden y salen numerados; es correcto solo si el orden completo lo es.\n6. Ordenar 4 y 5: lo mismo con series de 4 o 5 elementos más parecidos.'),
  'Fuera de la tableta (sin registro):', 'Fuera de la tableta (sin registro): ordenar objetos reales (botellas con distinta cantidad de agua, objetos de distinto peso, los niños de la fila de más alto a más bajo);')
where clinica_id is null and nombre = 'Abstraer Claves de Comparación' and instrucciones_terapeuta not like '%5. Ordenar 3%';
update programas_alumno pa set actividad_tablet = pb.actividad_tablet, instrucciones_terapeuta = pb.instrucciones_terapeuta
from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Abstraer Claves de Comparación';

-- Retirar Ordenar por Magnitud y cerrar el hueco en 3.3
update programas_base pb set orden = pb.orden - 1
from programas_base q where q.clinica_id is null and q.nombre = 'Ordenar por Magnitud' and q.orden is not null
  and pb.clinica_id is null and pb.dominio_id = q.dominio_id and pb.orden > q.orden;
insert into requisitos_programa (programa_base_id, requisito_id)
select rq.programa_base_id, (select id from programas_base where clinica_id is null and nombre = 'Abstraer Claves de Comparación')
from requisitos_programa rq where rq.requisito_id = (select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud')
on conflict do nothing;
delete from requisitos_programa where requisito_id = (select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud');
update programas_base set activo = false, orden = null where clinica_id is null and nombre = 'Ordenar por Magnitud';
update programas_base set instrucciones_terapeuta = replace(instrucciones_terapeuta, '"Ordenar por Magnitud"', '"Abstraer Claves de Comparación" (niveles de ordenar)')
where clinica_id is null and activo and instrucciones_terapeuta like '%"Ordenar por Magnitud"%';
update programas_alumno pa set instrucciones_terapeuta = pb.instrucciones_terapeuta
from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias';
commit;
