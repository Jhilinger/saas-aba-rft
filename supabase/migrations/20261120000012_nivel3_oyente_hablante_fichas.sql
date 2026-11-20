-- Programas verbales del nivel 3 (vínculo mutuo, combinatorio y transformación):
-- oyente y hablante, y fichas iguales como puente de lo no arbitrario a lo
-- arbitrario (Luciano et al., 2009). También en las copias de los PEI.
update programas_base pb set instrucciones_terapeuta = replace(pb.instrucciones_terapeuta,
  E'\nRegistro en la app',
  E'\nOyente y hablante: elija la forma en cada bloque al tomar datos. Como oyente, el alumno elige entre las opciones; como hablante, no se presentan opciones: el alumno responde y usted marca la respuesta. Cada forma se domina por separado (Luciano et al., 2009).\n\nRegistro en la app')
from dominios_curriculo d
where d.id = pb.dominio_id and d.codigo like '3.%' and pb.clinica_id is null and pb.nivel_rft in ('mutuo', 'combinatorio')
  and pb.instrucciones_terapeuta not like '%Oyente y hablante:%' and pb.instrucciones_terapeuta like E'%\nRegistro en la app%';

update programas_base pb set instrucciones_terapeuta = replace(pb.instrucciones_terapeuta,
  E'\nRegistro en la app',
  E'\nDe lo no arbitrario a lo arbitrario: si al alumno le cuesta pasar de las relaciones físicas a las frases, practique primero «Con fichas iguales»: una ficha igual por cada nombre de la red, que se ve y se señala al decirlo (como las monedas idénticas de Barnes-Holmes et al., 2004). Esos bloques no cuentan para el dominio: retire las fichas en cuanto pueda (Luciano et al., 2009).\n\nRegistro en la app')
from dominios_curriculo d
where d.id = pb.dominio_id and d.codigo like '3.%' and pb.clinica_id is null and pb.nivel_rft in ('mutuo', 'combinatorio')
  and pb.instrucciones_terapeuta not like '%Con fichas iguales%' and pb.instrucciones_terapeuta like E'%\nRegistro en la app%';

update programas_alumno pa set instrucciones_terapeuta = pb.instrucciones_terapeuta
from programas_base pb join dominios_curriculo d on d.id = pb.dominio_id
where pa.programa_base_id = pb.id and d.codigo like '3.%' and pb.clinica_id is null and pb.nivel_rft in ('mutuo', 'combinatorio');
