-- Las copias de los PEI de «Transferir Funciones Emocionales…» y «…Discriminativas…»
-- (simples y en redes) reciben las imágenes propias de cada grupo, como la
-- plantilla (20261119000001). Solo cambia la imagen (y el nombre del sillón);
-- los ensayos registrados no se tocan.

begin;

update estimulos_rft e set concepto_imagen = e.concepto_imagen || '-' || x.persona
from clases_rft c, programas_alumno pa,
     (values ('Grupo 2', 'mujer'), ('Grupo 3', 'nino'), ('Grupo 4', 'abuela'), ('Grupo 5', 'dibujo'),
             ('Grupo 7', 'mujer'), ('Grupo 8', 'nino')) x(grupo, persona)
where e.clase_id = c.id and c.programa_alumno_id = pa.id and c.grupo = x.grupo
  and pa.nombre in ('Transferir Funciones Emocionales a Estímulos Arbitrarios', 'Transferir Funciones Emocionales a Estímulos Arbitrarios en Redes Combinatorias')
  and e.posicion = 'A' and e.concepto_imagen ~ '^emociones/(contento|triste|enfadado|asustado|sorprendido|asco)$';

update estimulos_rft e set concepto_imagen = x.nuevo, nombre = coalesce(x.nombre, e.nombre)
from clases_rft c, programas_alumno pa,
     (values ('Grupo 2', 'senales/gesto-de-ven', 'senales/gesto-de-ven-mujer', null),
             ('Grupo 3', 'senales/gesto-de-ven', 'senales/gesto-de-ven-hombre-mayor', null),
             ('Grupo 2', 'senales/pictograma-de-sientate', 'senales/pictograma-de-sientate-sillon', 'Pictograma de "siéntate" (sillón)')) x(grupo, antes, nuevo, nombre)
where e.clase_id = c.id and c.programa_alumno_id = pa.id and c.grupo = x.grupo
  and pa.nombre in ('Transferir Funciones Discriminativas a Estímulos Arbitrarios', 'Transferir Funciones Discriminativas a Estímulos Arbitrarios en Redes Combinatorias')
  and e.posicion = 'A' and e.concepto_imagen = x.antes;

commit;
