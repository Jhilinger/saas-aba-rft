-- Nivel 1: «Esperar sin tocar», «Permanecer sentado», «Contacto visual» y «Elegir entre varios estímulos» estaban
-- marcados como duración o tasa (registros de conducta, sin conjuntos), pero sus objetivos e instrucciones son de
-- ensayo discreto («en el 90 % de las oportunidades», conjuntos, línea base y sondas). Pasan a ensayo discreto, y el
-- tiempo se trabaja por escalones: un conjunto por escalón, con el tiempo en el nombre (la pantalla de registro
-- muestra un cronómetro con ese tiempo).
begin;
update programas_base set formato_recogida = 'ensayo_discreto', contenido_actualizado_at = now()
where clinica_id is null and nombre in ('Esperar sin tocar', 'Permanecer sentado', 'Contacto visual', 'Elegir entre varios estímulos');

update programas_base set instrucciones_terapeuta = replace(instrucciones_terapeuta,
  'Registre la duración del contacto visual según el sistema de registro correspondiente.',
  'Registre como correcto el ensayo si mantiene la mirada el tiempo del escalón que se está trabajando.')
where clinica_id is null and nombre = 'Contacto visual';

update programas_base set instrucciones_terapeuta = rtrim(instrucciones_terapeuta, E' \r\n') || $t$

Escalones de tiempo: cree en el PEI del alumno un conjunto por escalón, con el tiempo en el nombre, y los objetos o alimentos como estímulos (por ejemplo «Esperar 3 s», «Esperar 5 s», «Esperar 10 s»). Empiece por un tiempo que el alumno ya consiga casi siempre. Al tomar datos, la pantalla le ofrece un cronómetro con el tiempo del conjunto: marque «Lo hace» si espera sin tocar hasta que se cumpla. Cuando domine un escalón, pase al siguiente.$t$, contenido_actualizado_at = now()
where clinica_id is null and nombre = 'Esperar sin tocar' and position('Escalones de tiempo' in instrucciones_terapeuta) = 0;

update programas_base set instrucciones_terapeuta = rtrim(instrucciones_terapeuta, E' \r\n') || $t$

Escalones de tiempo: cree en el PEI del alumno un conjunto por escalón, con el tiempo en el nombre, y las actividades como estímulos (por ejemplo «Sentado 30 s», «Sentado 1 min», «Sentado 3 min»). Empiece por un tiempo que el alumno ya consiga casi siempre. Al tomar datos, la pantalla le ofrece un cronómetro con el tiempo del conjunto: marque «Lo hace» si permanece sentado hasta que se cumpla. Cuando domine un escalón, pase al siguiente.$t$, contenido_actualizado_at = now()
where clinica_id is null and nombre = 'Permanecer sentado' and position('Escalones de tiempo' in instrucciones_terapeuta) = 0;

update programas_base set instrucciones_terapeuta = rtrim(instrucciones_terapeuta, E' \r\n') || $t$

Escalones de tiempo: cree en el PEI del alumno un conjunto por escalón, con el tiempo en el nombre, y las formas de pedir la mirada o los contextos como estímulos (por ejemplo «Mirar 1 s», «Mirar 2 s», «Mirar 3 s», con estímulos como «Su nombre», «Mírame», «Durante el juego»). Al tomar datos, la pantalla le ofrece un cronómetro con el tiempo del conjunto. Cuando domine un escalón, pase al siguiente.$t$, contenido_actualizado_at = now()
where clinica_id is null and nombre = 'Contacto visual' and position('Escalones de tiempo' in instrucciones_terapeuta) = 0;

update programas_base set instrucciones_terapeuta = rtrim(instrucciones_terapeuta, E' \r\n') || $t$

Conjuntos: cree en el PEI del alumno un conjunto por cada grupo de opciones (por ejemplo «3 opciones: comida», «3 opciones: juguetes», «4 opciones»), con los estímulos que se presentan juntos. Marque «Lo hace» si elige alguno, sea cual sea; si no elige, ayúdele a tomar uno.$t$, contenido_actualizado_at = now()
where clinica_id is null and nombre = 'Elegir entre varios estímulos' and position('Conjuntos: cree en el PEI' in instrucciones_terapeuta) = 0;

-- Copias de los alumnos (solo datos de prueba en producción)
update programas_alumno pa set formato_recogida = 'ensayo_discreto', instrucciones_terapeuta = pb.instrucciones_terapeuta
from programas_base pb
where pa.programa_base_id = pb.id and pb.clinica_id is null
  and pb.nombre in ('Esperar sin tocar', 'Permanecer sentado', 'Contacto visual', 'Elegir entre varios estímulos');
commit;
