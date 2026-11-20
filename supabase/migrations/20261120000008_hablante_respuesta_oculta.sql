-- Modo hablante: la respuesta esperada queda oculta (se ve manteniendo pulsado «👁 Respuesta»)
update programas_base set instrucciones_terapeuta = replace(instrucciones_terapeuta,
  'usted hace la pregunta que aparece abajo (p. ej. «¿Son iguales o contrarios?») y marca si la respuesta es correcta.',
  'usted hace la pregunta que aparece abajo (p. ej. «¿Son iguales o contrarios?») y marca si la respuesta es correcta. La respuesta esperada está oculta para que no la lea el alumno: se ve manteniendo pulsado «👁 Respuesta».')
where clinica_id is null and actividad_tablet is not null;
update programas_alumno pa set instrucciones_terapeuta = pb.instrucciones_terapeuta
from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.actividad_tablet is not null;
