-- Los programas de igualación salen de 1.3 y forman el nuevo dominio 2.1
-- «Abstracción de Claves Relacionales de Coordinación», igual que en el nivel 3
-- cada marco empieza abstrayendo su clave. El resto del nivel 2 se renumera
-- (2.1 → 2.2, 2.2 → 2.3, 2.3 → 2.4; el código se calcula del número) y 1.3
-- queda como imitación y copia.

begin;

update dominios_curriculo set numero = 4 where codigo = '2.3';
update dominios_curriculo set numero = 3 where codigo = '2.2';
update dominios_curriculo set numero = 2 where codigo = '2.1';
insert into dominios_curriculo (nivel, numero, nombre)
values (2, 1, 'Abstracción de Claves Relacionales de Coordinación');

update dominios_curriculo set nombre = 'Repertorios de Correspondencia (Imitación y Copia)' where codigo = '1.3';

-- Los 8 programas de igualación, en su orden actual
update programas_base p set dominio_id = (select id from dominios_curriculo where codigo = '2.1'), orden = x.orden
from (values ('Igualar Imágenes', 1), ('Igualar Objetos', 2), ('Igualar Imágenes y Objetos', 3), ('Igualar Sonidos', 4),
             ('Igualar Texturas', 5), ('Igualar Olores', 6), ('Igualar Sabores', 7), ('Igualación Intermodal', 8)) x(nombre, orden)
where p.clinica_id is null and p.nombre = x.nombre;

-- 1.3 sin huecos: trazos y copia pasan de 20–26 a 12–18
update programas_base set orden = orden - 8
where clinica_id is null and dominio_id = (select id from dominios_curriculo where codigo = '1.3') and orden > 19;

-- Referencias a dominios en los textos del currículo (con marcador § para que
-- una sustitución no pise a la siguiente)
create temporary table _ref(desde text, hasta text, paso int) on commit drop;
insert into _ref values
  ('dominios 2.2 o 2.3', 'dominios §2.3 o §2.4', 1),
  ('dominios 2.1 y 2.2', 'dominios §2.2 y §2.3', 1),
  ('dominio 2.3', 'dominio §2.4', 2),
  ('dominio 2.2', 'dominio §2.3', 3),
  ('dominio 2.1', 'dominio §2.2', 4),
  ('"Igualar Objetos" del dominio 1.3', '"Igualar Objetos" del dominio §2.1', 5),
  ('"Igualar Imágenes" del dominio 1.3', '"Igualar Imágenes" del dominio §2.1', 5),
  ('los programas de igualación, imitación y copia del dominio 1.3', 'los programas de igualación del dominio §2.1 y de imitación y copia del dominio 1.3', 5);

do $$
declare r record;
begin
  for r in select * from _ref order by paso loop
    update programas_base set
      instrucciones_terapeuta = replace(instrucciones_terapeuta, r.desde, r.hasta),
      materiales = replace(materiales, r.desde, r.hasta),
      objetivo = replace(objetivo, r.desde, r.hasta)
    where clinica_id is null;
  end loop;
end $$;

update programas_base set
  instrucciones_terapeuta = replace(instrucciones_terapeuta, '§', ''),
  materiales = replace(materiales, '§', ''),
  objetivo = replace(objetivo, '§', '')
where clinica_id is null;

commit;
