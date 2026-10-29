-- 3.1 "Marcos Relacionales de Distinción y Oposición" se separa en dos
-- dominios: 3.1 Distinción y 3.2 Oposición. Los dominios 3.2-3.6 pasan a
-- 3.3-3.7.
begin;

-- Renumerar de mayor a menor para no chocar con unique (nivel, numero)
update dominios_curriculo set numero = 7 where nivel = 3 and numero = 6;
update dominios_curriculo set numero = 6 where nivel = 3 and numero = 5;
update dominios_curriculo set numero = 5 where nivel = 3 and numero = 4;
update dominios_curriculo set numero = 4 where nivel = 3 and numero = 3;
update dominios_curriculo set numero = 3 where nivel = 3 and numero = 2;

update dominios_curriculo set nombre = 'Marcos Relacionales de Distinción' where nivel = 3 and numero = 1;

insert into dominios_curriculo (nivel, numero, nombre)
values (3, 2, 'Marcos Relacionales de Oposición');

-- Los programas de oposición pasan al nuevo dominio, en su orden actual
select colocar_programa_curriculo(pb.id, d.id, t.pos)
from (values
  ('Abstraer Claves de Oposición', 1),
  ('Vincular Mutuamente Opuestos', 2),
  ('Derivar Relaciones de Oposición en Redes Combinatorias', 3)
) t(nombre, pos)
join programas_base pb on pb.nombre = t.nombre and pb.clinica_id is null
cross join dominios_curriculo d
where d.nivel = 3 and d.numero = 2
order by t.pos;

-- El área incluye el código del dominio, que ha cambiado
update programas_base pb set area = d.codigo || ' · ' || d.nombre
from dominios_curriculo d where pb.dominio_id = d.id and d.nivel = 3;

update programas_alumno pa set area = d.codigo || ' · ' || d.nombre
from programas_base pb join dominios_curriculo d on d.id = pb.dominio_id
where pa.programa_base_id = pb.id and d.nivel = 3;

commit;
