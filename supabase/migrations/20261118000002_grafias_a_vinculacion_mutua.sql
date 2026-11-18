-- Los cinco programas «Vincular Mutuamente … con sus Grafías» son de vinculación
-- mutua (A → B, test B → A): pasan de 2.3 a 2.2, cada uno detrás de su pareja
-- «con sus Nombres». En 2.3 quedan los combinatorios.

begin;

-- 2.2: abrir hueco (los programas a partir de Materiales Escolares, orden 22, bajan 5)
update programas_base set orden = orden + 5
where clinica_id is null and dominio_id = (select id from dominios_curriculo where codigo = '2.2') and orden >= 22;

update programas_base p set orden = x.orden
from (values ('Vincular Mutuamente Letras con sus Nombres', 18), ('Vincular Mutuamente Números con sus Nombres', 20),
             ('Vincular Mutuamente Sílabas con sus Nombres', 22), ('Vincular Mutuamente Palabras Impresas con sus Nombres', 24)) x(nombre, orden)
where p.clinica_id is null and p.nombre = x.nombre;

update programas_base p set dominio_id = (select id from dominios_curriculo where codigo = '2.2'), orden = x.orden
from (values ('Vincular Mutuamente Letras con sus Grafías', 19), ('Vincular Mutuamente Números con sus Grafías', 21),
             ('Vincular Mutuamente Sílabas con sus Grafías', 23), ('Vincular Mutuamente Palabras con sus Grafías', 25),
             ('Vincular Mutuamente Oraciones y Textos con sus Grafías', 26)) x(nombre, orden)
where p.clinica_id is null and p.nombre = x.nombre;

-- 2.3 sin huecos
update programas_base p set orden = x.orden
from (values ('Vincular Números, Grafías y Cantidades', 1), ('Leer Oraciones y Textos', 2),
             ('Responder a Preguntas sobre Características', 3), ('Responder a Preguntas sobre Funciones de los Objetos', 4),
             ('Responder a Preguntas ¿Quién?', 5), ('Responder a Preguntas ¿Dónde?', 6),
             ('Responder a Preguntas ¿Cuándo?', 7), ('Responder a Preguntas ¿Cómo?', 8)) x(nombre, orden)
where p.clinica_id is null and p.nombre = x.nombre;

-- Referencias en los textos
update programas_base set
  instrucciones_terapeuta = regexp_replace(instrucciones_terapeuta, '(con sus Grafías" del dominio )2\.3', '\12.2', 'g'),
  materiales = regexp_replace(materiales, '(con sus Grafías" del dominio )2\.3', '\12.2', 'g')
where clinica_id is null;

commit;
