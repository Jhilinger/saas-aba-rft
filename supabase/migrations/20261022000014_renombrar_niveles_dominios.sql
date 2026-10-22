-- Nombres definitivos de niveles y dominios, y propagación del nombre del
-- dominio al campo "area" de los programas (antes solo se recalculaba al
-- cambiar el dominio de un programa, no al renombrar el dominio).
begin;

update niveles_curriculo set nombre = 'Fundamentos Operantes y Abstracción de Claves Relacionales de Coordinación' where numero = 1;

update dominios_curriculo d set nombre = v.nombre
from (values
  ('1.3', 'Repertorios de Correspondencia y Abstracción de Claves Relacionales de Coordinación'),
  ('2.1', 'Vinculación Mutua (A ↔ B)'),
  ('3.1', 'Marcos Relacionales de Distinción y Oposición'),
  ('3.2', 'Marcos Relacionales de Comparación (Magnitud y Cantidad)'),
  ('3.3', 'Marcos Relacionales Espaciales y Temporales'),
  ('3.4', 'Marcos Relacionales Jerárquicos, Categorización e Inclusión'),
  ('3.5', 'Marcos Relacionales Condicionales y Causales (Si... Entonces) / Comportamiento Guiado por Reglas')
) as v(codigo, nombre)
where d.codigo = v.codigo;

-- Al renombrar un dominio, actualizar el área de sus programas (plantillas y
-- copias en los PEI)
create or replace function dominios_curriculo_propagar_nombre()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update programas_base set area = new.codigo || ' · ' || new.nombre where dominio_id = new.id;
  update programas_alumno pa set area = new.codigo || ' · ' || new.nombre
  from programas_base pb
  where pa.programa_base_id = pb.id and pb.dominio_id = new.id;
  return new;
end;
$$;

create trigger dominios_curriculo_propagar_nombre
  after update of nombre on dominios_curriculo
  for each row execute function dominios_curriculo_propagar_nombre();

-- Áreas actuales (incluye los cambios de este mismo script, aplicados antes
-- de crear el trigger)
update programas_base pb set area = d.codigo || ' · ' || d.nombre
from dominios_curriculo d where pb.dominio_id = d.id;

update programas_alumno pa set area = d.codigo || ' · ' || d.nombre
from programas_base pb join dominios_curriculo d on d.id = pb.dominio_id
where pa.programa_base_id = pb.id;

commit;
