-- 3.3 "Marcos Relacionales Espaciales y Temporales" se separa en dos dominios:
-- 3.3 Espaciales y 3.4 Temporales. Los dominios 3.4 y 3.5 pasan a 3.5 y 3.6.
begin;

-- Renumerar de mayor a menor para no chocar con unique (nivel, numero)
update dominios_curriculo set numero = 6 where nivel = 3 and numero = 5;
update dominios_curriculo set numero = 5 where nivel = 3 and numero = 4;

update dominios_curriculo set nombre = 'Marcos Relacionales Espaciales' where nivel = 3 and numero = 3;

insert into dominios_curriculo (nivel, numero, nombre)
values (3, 4, 'Marcos Relacionales Temporales');

-- El área de los programas incluye el código del dominio y el trigger de
-- propagación solo salta al cambiar el nombre, no el número
update programas_base pb set area = d.codigo || ' · ' || d.nombre
from dominios_curriculo d where pb.dominio_id = d.id and d.nivel = 3;

update programas_alumno pa set area = d.codigo || ' · ' || d.nombre
from programas_base pb join dominios_curriculo d on d.id = pb.dominio_id
where pa.programa_base_id = pb.id and d.nivel = 3;

commit;
