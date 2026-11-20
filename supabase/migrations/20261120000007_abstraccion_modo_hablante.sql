-- Abstracción con ensayos generados: modo hablante (Luciano et al., 2009: oyente
-- y hablante). Línea en las fichas, antes de «Fuera de la tableta».
update programas_base set instrucciones_terapeuta = replace(instrucciones_terapeuta,
  E'\n\nFuera de la tableta (sin registro):',
  E'\n\nHablante: en «Respuesta», elija «Hablante» para que el alumno diga la relación en vez de tocarla. La tableta muestra los estímulos (y marca el que usted señala); usted hace la pregunta que aparece abajo (p. ej. «¿Son iguales o contrarios?») y marca si la respuesta es correcta. Cada nivel como hablante se registra y se domina aparte, con su propia curva en la evolución (Luciano et al., 2009: oyente y hablante).\n\nFuera de la tableta (sin registro):')
where clinica_id is null and actividad_tablet is not null and instrucciones_terapeuta not like '%Hablante: en «Respuesta»%';
update programas_alumno pa set instrucciones_terapeuta = pb.instrucciones_terapeuta
from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.actividad_tablet is not null;
