-- Numeración continua de las clases RFT del currículo: el Grupo 2 sigue con
-- la Clase 4, 5 y 6 (no vuelve a empezar en la Clase 1) y las etiquetas de
-- los estímulos van a juego (A4, B4…). Las copias de los PEI se renombran con
-- el mismo mapa (por grupo y nombre antiguo), para que la sincronización con
-- la plantilla las siga reconociendo; las clases propias de un PEI no se tocan.

begin;

create temp table mapa_clases on commit drop as
select c.id, c.programa_base_id, c.grupo, c.nombre as viejo,
  row_number() over (
    partition by c.programa_base_id
    order by substring(c.grupo from '[0-9]+')::int, substring(c.nombre from '[0-9]+')::int
  ) as numero
from clases_rft_base c
join programas_base p on p.id = c.programa_base_id
where p.clinica_id is null and p.tipo = 'rft'
  and c.nombre ~ '^Clase [0-9]+$' and c.grupo ~ '^Grupo [0-9]+$';

-- Copias en los PEI (primero las etiquetas, que se localizan por el nombre antiguo)
update estimulos_rft e
set etiqueta = regexp_replace(e.etiqueta, '[0-9]+$', m.numero::text)
from clases_rft cr, programas_alumno pa, mapa_clases m
where e.clase_id = cr.id and cr.programa_alumno_id = pa.id
  and m.programa_base_id = pa.programa_base_id and m.grupo = cr.grupo and m.viejo = cr.nombre
  and e.etiqueta ~ '^[A-Z][0-9]+$';

update clases_rft cr
set nombre = 'Clase ' || m.numero
from programas_alumno pa, mapa_clases m
where cr.programa_alumno_id = pa.id
  and m.programa_base_id = pa.programa_base_id and m.grupo = cr.grupo and m.viejo = cr.nombre;

-- Currículo
update estimulos_rft_base e
set etiqueta = regexp_replace(e.etiqueta, '[0-9]+$', m.numero::text)
from mapa_clases m
where e.clase_base_id = m.id and e.etiqueta ~ '^[A-Z][0-9]+$';

update clases_rft_base c
set nombre = 'Clase ' || m.numero
from mapa_clases m
where c.id = m.id;

commit;
