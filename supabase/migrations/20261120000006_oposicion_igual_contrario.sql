-- Abstraer Claves de Oposición: «Toca el igual» y «Toca el contrario» alternados
-- ante las mismas opciones (la misma imagen y su opuesto), como propone
-- Luciano et al. (2009): la respuesta depende de la clave y no de elegir «el
-- que no es igual». Niveles renombrados y ficha actualizada (también en las copias).
update programas_base set actividad_tablet = '{"tipo": "oposicion", "niveles": [{"nombre": "Igual o contrario entre dos", "opciones": 2}, {"nombre": "Igual o contrario entre tres", "opciones": 3}]}'::jsonb
where clinica_id is null and nombre = 'Abstraer Claves de Oposición';
update programas_alumno pa set actividad_tablet = pb.actividad_tablet
from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Abstraer Claves de Oposición';

update programas_base set
  objetivo = 'El alumno responde a las claves «igual» y «contrario» ante el mismo objeto: elige la misma imagen o la del polo opuesto (la caja abierta ante la cerrada) según la clave que se le da, y generaliza esa respuesta a dimensiones físicas no entrenadas.',
  instrucciones_terapeuta = replace(replace(instrucciones_terapeuta,
    E'1. El contrario entre dos.\n2. El contrario entre tres (con un distractor diferente pero no opuesto).',
    E'1. Igual o contrario entre dos: la misma imagen que la muestra y su opuesto, con «Toca el igual» o «Toca el contrario».\n2. Igual o contrario entre tres: se añade un objeto de otro par, que no es ni igual ni opuesto.'),
    'Hay una sola clave: mire la curva y, en los errores, si elige el distractor (diferente pero no opuesto).',
    'Compare «igual» con «contrario». Si una clave queda 20 puntos o más por debajo de otra, puede estar respondiendo por una sola clave (p. ej. elegir siempre el que no es igual) y no por la relación: no dé el nivel por dominado aunque llegue al 90 %. Las dos claves alternadas siguen a Luciano et al. (2009).')
where clinica_id is null and nombre = 'Abstraer Claves de Oposición';
update programas_alumno pa set objetivo = pb.objetivo, instrucciones_terapeuta = pb.instrucciones_terapeuta
from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Abstraer Claves de Oposición';
