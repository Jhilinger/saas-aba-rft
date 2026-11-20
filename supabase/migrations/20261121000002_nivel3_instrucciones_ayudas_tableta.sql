-- Programas verbales del nivel 3 que se registran solo en la tableta: instrucciones
-- y ayudas sin tarjetas ni opciones dichas una a una (eran de cuando había audio).
-- También en las copias de los PEI.
create temporary table solo_tableta as
select id from programas_base where clinica_id is null and instrucciones_terapeuta like '%los datos se toman solo en la tableta, que presenta la frase%';

update programas_base set instrucciones_terapeuta = regexp_replace(instrucciones_terapeuta,
  'Opciones de respuesta: en cada ensayo, diga (uno a uno|una a una) ', 'Opciones de respuesta: en la tableta, las opciones son ', 'g')
where id in (select id from solo_tableta);

update programas_base set instrucciones_terapeuta = replace(instrucciones_terapeuta, 'ofreciendo las tres tarjetas de respuesta:', 'con las tres opciones:')
where id in (select id from solo_tableta);
update programas_base set instrucciones_terapeuta = replace(replace(instrucciones_terapeuta,
  'Como oyente, el alumno elige entre las tarjetas (LO MISMO / DIFERENTE; SÍ / NO).', 'Como oyente, el alumno elige entre las opciones (Lo mismo / Diferente; Sí / No).'),
  'Como hablante, no presente las tarjetas: el alumno responde y usted marca la respuesta.', 'Como hablante, la tableta solo muestra la frase: el alumno responde y usted marca la respuesta.')
where id in (select id from solo_tableta);

update programas_base set ayudas_posibles = replace(ayudas_posibles, E'- Visual: mostrar las tarjetas IGUAL y DIFERENTE como opciones de respuesta\n', '')
where id in (select id from solo_tableta);
update programas_base set ayudas_posibles = replace(ayudas_posibles, '- Gestual: señalar la tarjeta de la relación correcta', '- Gestual: señalar la opción correcta en la pantalla (solo como oyente)') where id in (select id from solo_tableta);
update programas_base set ayudas_posibles = replace(ayudas_posibles, '- Gestual: señalar las tarjetas de respuesta', '- Gestual: señalar las opciones de respuesta en la pantalla') where id in (select id from solo_tableta);
update programas_base set ayudas_posibles = replace(ayudas_posibles, '- Gestual: señalar la tarjeta de la respuesta correcta (solo como oyente)', '- Gestual: señalar la opción correcta en la pantalla (solo como oyente)') where id in (select id from solo_tableta);
update programas_base set ayudas_posibles = replace(ayudas_posibles, '- Visual: resaltar el estímulo correcto o la tarjeta de la clave', '- Visual: resaltar el estímulo correcto') where id in (select id from solo_tableta);
update programas_base set ayudas_posibles = replace(ayudas_posibles, '- Gestual: señalar la tarjeta del estímulo por el que se pregunta', '- Gestual: señalar en la pantalla el estímulo por el que se pregunta') where id in (select id from solo_tableta);
update programas_base set ayudas_posibles = replace(ayudas_posibles, '- Gestual: señalar la bandeja o tarjeta de la categoría correcta', '- Gestual: señalar en la pantalla la categoría correcta') where id in (select id from solo_tableta);
update programas_base set ayudas_posibles = replace(ayudas_posibles, '- Visual: mostrar la tarjeta de la condición junto a un pictograma del consecuente y retirarlos antes de la pregunta', '- Visual: dibujar la condición y el consecuente unidos por una flecha y retirarlo antes de la pregunta') where id in (select id from solo_tableta);
update programas_base set ayudas_posibles = replace(ayudas_posibles, '- Gestual: señalar la tarjeta de la condición', '- Gestual: señalar en la pantalla la acción de la condición') where id in (select id from solo_tableta);

update programas_alumno pa set instrucciones_terapeuta = pb.instrucciones_terapeuta, ayudas_posibles = pb.ayudas_posibles
from programas_base pb where pa.programa_base_id = pb.id and pb.id in (select id from solo_tableta);

update programas_base set ayudas_posibles = regexp_replace(ayudas_posibles, '- Visual: mostrar las tarjetas IGUAL y DIFERENTE como opciones de respuesta\s*', '')
where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Distinción';
update programas_alumno pa set ayudas_posibles = pb.ayudas_posibles
from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Vincular Mutuamente Relaciones de Distinción';
