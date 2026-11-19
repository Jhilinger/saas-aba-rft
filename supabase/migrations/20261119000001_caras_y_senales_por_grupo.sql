-- Cada grupo de «Transferir Funciones Emocionales…» y «Transferir Funciones
-- Discriminativas…» (simples y en redes) tiene sus propias imágenes: antes todos
-- los grupos usaban el mismo concepto del banco, que alterna niña y hombre, y la
-- «otra persona», el «niño», la «abuela» o el «dibujo» no existían.

begin;

update estimulos_rft_base e set concepto_imagen = e.concepto_imagen || '-' || x.persona
from clases_rft_base c, programas_base p,
     (values ('Grupo 2', 'mujer'), ('Grupo 3', 'nino'), ('Grupo 4', 'abuela'), ('Grupo 5', 'dibujo'),
             ('Grupo 7', 'mujer'), ('Grupo 8', 'nino')) x(grupo, persona)
where e.clase_base_id = c.id and c.programa_base_id = p.id and c.grupo = x.grupo
  and p.clinica_id is null
  and p.nombre in ('Transferir Funciones Emocionales a Estímulos Arbitrarios', 'Transferir Funciones Emocionales a Estímulos Arbitrarios en Redes Combinatorias')
  and e.posicion = 'A' and e.concepto_imagen ~ '^emociones/(contento|triste|enfadado|asustado|sorprendido|asco)$';

update estimulos_rft_base e set concepto_imagen = x.nuevo, nombre = coalesce(x.nombre, e.nombre)
from clases_rft_base c, programas_base p,
     (values ('Grupo 2', 'senales/gesto-de-ven', 'senales/gesto-de-ven-mujer', null),
             ('Grupo 3', 'senales/gesto-de-ven', 'senales/gesto-de-ven-hombre-mayor', null),
             ('Grupo 2', 'senales/pictograma-de-sientate', 'senales/pictograma-de-sientate-sillon', 'Pictograma de "siéntate" (sillón)')) x(grupo, antes, nuevo, nombre)
where e.clase_base_id = c.id and c.programa_base_id = p.id and c.grupo = x.grupo
  and p.clinica_id is null
  and p.nombre in ('Transferir Funciones Discriminativas a Estímulos Arbitrarios', 'Transferir Funciones Discriminativas a Estímulos Arbitrarios en Redes Combinatorias')
  and e.posicion = 'A' and e.concepto_imagen = x.antes;

commit;
