-- Piloto del banco de imágenes en 4 programas de vocabulario: el grupo 1 de
-- ejemplo recibe el concepto de imagen en su estímulo B y se añaden los
-- grupos 2 a 4 (3 clases cada uno), con A = nombre dicho y B = objeto.
-- Las copias ya importadas reciben el concepto en el grupo 1 y el aviso de
-- plantilla para añadir los grupos nuevos. Idempotente.
begin;

update estimulos_rft_base e set concepto_imagen = 'alimentos/agua' from clases_rft_base c where e.clase_base_id = c.id and c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Alimentos con sus Nombres') and c.grupo = 'Grupo 1' and e.posicion = 'B' and e.nombre = 'Agua';
update estimulos_rft_base e set concepto_imagen = 'alimentos/pan' from clases_rft_base c where e.clase_base_id = c.id and c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Alimentos con sus Nombres') and c.grupo = 'Grupo 1' and e.posicion = 'B' and e.nombre = 'Pan';
update estimulos_rft_base e set concepto_imagen = 'alimentos/platano' from clases_rft_base c where e.clase_base_id = c.id and c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Alimentos con sus Nombres') and c.grupo = 'Grupo 1' and e.posicion = 'B' and e.nombre = 'Plátano';
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Alimentos con sus Nombres'), 'Clase 1', 'Grupo 2'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Alimentos con sus Nombres') and grupo = 'Grupo 2' and nombre = 'Clase 1')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A1', '"Manzana"', 'A', null from nueva
union all select id, 'B1', 'Manzana', 'B', 'alimentos/manzana' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Alimentos con sus Nombres'), 'Clase 2', 'Grupo 2'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Alimentos con sus Nombres') and grupo = 'Grupo 2' and nombre = 'Clase 2')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A2', '"Leche"', 'A', null from nueva
union all select id, 'B2', 'Leche', 'B', 'alimentos/leche' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Alimentos con sus Nombres'), 'Clase 3', 'Grupo 2'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Alimentos con sus Nombres') and grupo = 'Grupo 2' and nombre = 'Clase 3')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A3', '"Galleta"', 'A', null from nueva
union all select id, 'B3', 'Galleta', 'B', 'alimentos/galleta' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Alimentos con sus Nombres'), 'Clase 1', 'Grupo 3'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Alimentos con sus Nombres') and grupo = 'Grupo 3' and nombre = 'Clase 1')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A1', '"Huevo"', 'A', null from nueva
union all select id, 'B1', 'Huevo', 'B', 'alimentos/huevo' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Alimentos con sus Nombres'), 'Clase 2', 'Grupo 3'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Alimentos con sus Nombres') and grupo = 'Grupo 3' and nombre = 'Clase 2')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A2', '"Queso"', 'A', null from nueva
union all select id, 'B2', 'Queso', 'B', 'alimentos/queso' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Alimentos con sus Nombres'), 'Clase 3', 'Grupo 3'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Alimentos con sus Nombres') and grupo = 'Grupo 3' and nombre = 'Clase 3')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A3', '"Naranja"', 'A', null from nueva
union all select id, 'B3', 'Naranja', 'B', 'alimentos/naranja' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Alimentos con sus Nombres'), 'Clase 1', 'Grupo 4'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Alimentos con sus Nombres') and grupo = 'Grupo 4' and nombre = 'Clase 1')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A1', '"Yogur"', 'A', null from nueva
union all select id, 'B1', 'Yogur', 'B', 'alimentos/yogur' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Alimentos con sus Nombres'), 'Clase 2', 'Grupo 4'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Alimentos con sus Nombres') and grupo = 'Grupo 4' and nombre = 'Clase 2')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A2', '"Fresa"', 'A', null from nueva
union all select id, 'B2', 'Fresa', 'B', 'alimentos/fresa' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Alimentos con sus Nombres'), 'Clase 3', 'Grupo 4'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Alimentos con sus Nombres') and grupo = 'Grupo 4' and nombre = 'Clase 3')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A3', '"Macarrones"', 'A', null from nueva
union all select id, 'B3', 'Macarrones', 'B', 'alimentos/macarrones' from nueva;
update programas_base set contenido_actualizado_at = now() where id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Alimentos con sus Nombres');

update estimulos_rft_base e set concepto_imagen = 'animales-de-granja/vaca' from clases_rft_base c where e.clase_base_id = c.id and c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Animales de Granja con sus Nombres') and c.grupo = 'Grupo 1' and e.posicion = 'B' and e.nombre = 'Vaca';
update estimulos_rft_base e set concepto_imagen = 'animales-de-granja/cerdo' from clases_rft_base c where e.clase_base_id = c.id and c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Animales de Granja con sus Nombres') and c.grupo = 'Grupo 1' and e.posicion = 'B' and e.nombre = 'Cerdo';
update estimulos_rft_base e set concepto_imagen = 'animales-de-granja/gallina' from clases_rft_base c where e.clase_base_id = c.id and c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Animales de Granja con sus Nombres') and c.grupo = 'Grupo 1' and e.posicion = 'B' and e.nombre = 'Gallina';
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Animales de Granja con sus Nombres'), 'Clase 1', 'Grupo 2'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Animales de Granja con sus Nombres') and grupo = 'Grupo 2' and nombre = 'Clase 1')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A1', '"Caballo"', 'A', null from nueva
union all select id, 'B1', 'Caballo', 'B', 'animales-de-granja/caballo' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Animales de Granja con sus Nombres'), 'Clase 2', 'Grupo 2'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Animales de Granja con sus Nombres') and grupo = 'Grupo 2' and nombre = 'Clase 2')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A2', '"Oveja"', 'A', null from nueva
union all select id, 'B2', 'Oveja', 'B', 'animales-de-granja/oveja' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Animales de Granja con sus Nombres'), 'Clase 3', 'Grupo 2'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Animales de Granja con sus Nombres') and grupo = 'Grupo 2' and nombre = 'Clase 3')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A3', '"Pato"', 'A', null from nueva
union all select id, 'B3', 'Pato', 'B', 'animales-de-granja/pato' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Animales de Granja con sus Nombres'), 'Clase 1', 'Grupo 3'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Animales de Granja con sus Nombres') and grupo = 'Grupo 3' and nombre = 'Clase 1')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A1', '"Conejo"', 'A', null from nueva
union all select id, 'B1', 'Conejo', 'B', 'animales-de-granja/conejo' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Animales de Granja con sus Nombres'), 'Clase 2', 'Grupo 3'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Animales de Granja con sus Nombres') and grupo = 'Grupo 3' and nombre = 'Clase 2')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A2', '"Burro"', 'A', null from nueva
union all select id, 'B2', 'Burro', 'B', 'animales-de-granja/burro' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Animales de Granja con sus Nombres'), 'Clase 3', 'Grupo 3'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Animales de Granja con sus Nombres') and grupo = 'Grupo 3' and nombre = 'Clase 3')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A3', '"Cabra"', 'A', null from nueva
union all select id, 'B3', 'Cabra', 'B', 'animales-de-granja/cabra' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Animales de Granja con sus Nombres'), 'Clase 1', 'Grupo 4'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Animales de Granja con sus Nombres') and grupo = 'Grupo 4' and nombre = 'Clase 1')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A1', '"Gallo"', 'A', null from nueva
union all select id, 'B1', 'Gallo', 'B', 'animales-de-granja/gallo' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Animales de Granja con sus Nombres'), 'Clase 2', 'Grupo 4'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Animales de Granja con sus Nombres') and grupo = 'Grupo 4' and nombre = 'Clase 2')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A2', '"Pavo"', 'A', null from nueva
union all select id, 'B2', 'Pavo', 'B', 'animales-de-granja/pavo' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Animales de Granja con sus Nombres'), 'Clase 3', 'Grupo 4'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Animales de Granja con sus Nombres') and grupo = 'Grupo 4' and nombre = 'Clase 3')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A3', '"Pollito"', 'A', null from nueva
union all select id, 'B3', 'Pollito', 'B', 'animales-de-granja/pollito' from nueva;
update programas_base set contenido_actualizado_at = now() where id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Animales de Granja con sus Nombres');

update estimulos_rft_base e set concepto_imagen = 'vehiculos/coche' from clases_rft_base c where e.clase_base_id = c.id and c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Vehículos con sus Nombres') and c.grupo = 'Grupo 1' and e.posicion = 'B' and e.nombre = 'Coche';
update estimulos_rft_base e set concepto_imagen = 'vehiculos/avion' from clases_rft_base c where e.clase_base_id = c.id and c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Vehículos con sus Nombres') and c.grupo = 'Grupo 1' and e.posicion = 'B' and e.nombre = 'Avión';
update estimulos_rft_base e set concepto_imagen = 'vehiculos/barco' from clases_rft_base c where e.clase_base_id = c.id and c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Vehículos con sus Nombres') and c.grupo = 'Grupo 1' and e.posicion = 'B' and e.nombre = 'Barco';
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Vehículos con sus Nombres'), 'Clase 1', 'Grupo 2'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Vehículos con sus Nombres') and grupo = 'Grupo 2' and nombre = 'Clase 1')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A1', '"Autobús"', 'A', null from nueva
union all select id, 'B1', 'Autobús', 'B', 'vehiculos/autobus' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Vehículos con sus Nombres'), 'Clase 2', 'Grupo 2'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Vehículos con sus Nombres') and grupo = 'Grupo 2' and nombre = 'Clase 2')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A2', '"Tren"', 'A', null from nueva
union all select id, 'B2', 'Tren', 'B', 'vehiculos/tren' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Vehículos con sus Nombres'), 'Clase 3', 'Grupo 2'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Vehículos con sus Nombres') and grupo = 'Grupo 2' and nombre = 'Clase 3')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A3', '"Moto"', 'A', null from nueva
union all select id, 'B3', 'Moto', 'B', 'vehiculos/moto' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Vehículos con sus Nombres'), 'Clase 1', 'Grupo 3'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Vehículos con sus Nombres') and grupo = 'Grupo 3' and nombre = 'Clase 1')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A1', '"Bicicleta"', 'A', null from nueva
union all select id, 'B1', 'Bicicleta', 'B', 'vehiculos/bicicleta' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Vehículos con sus Nombres'), 'Clase 2', 'Grupo 3'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Vehículos con sus Nombres') and grupo = 'Grupo 3' and nombre = 'Clase 2')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A2', '"Camión"', 'A', null from nueva
union all select id, 'B2', 'Camión', 'B', 'vehiculos/camion' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Vehículos con sus Nombres'), 'Clase 3', 'Grupo 3'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Vehículos con sus Nombres') and grupo = 'Grupo 3' and nombre = 'Clase 3')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A3', '"Helicóptero"', 'A', null from nueva
union all select id, 'B3', 'Helicóptero', 'B', 'vehiculos/helicoptero' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Vehículos con sus Nombres'), 'Clase 1', 'Grupo 4'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Vehículos con sus Nombres') and grupo = 'Grupo 4' and nombre = 'Clase 1')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A1', '"Ambulancia"', 'A', null from nueva
union all select id, 'B1', 'Ambulancia', 'B', 'vehiculos/ambulancia' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Vehículos con sus Nombres'), 'Clase 2', 'Grupo 4'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Vehículos con sus Nombres') and grupo = 'Grupo 4' and nombre = 'Clase 2')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A2', '"Tractor"', 'A', null from nueva
union all select id, 'B2', 'Tractor', 'B', 'vehiculos/tractor' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Vehículos con sus Nombres'), 'Clase 3', 'Grupo 4'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Vehículos con sus Nombres') and grupo = 'Grupo 4' and nombre = 'Clase 3')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A3', '"Camión de bomberos"', 'A', null from nueva
union all select id, 'B3', 'Camión de bomberos', 'B', 'vehiculos/camion-de-bomberos' from nueva;
update programas_base set contenido_actualizado_at = now() where id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Vehículos con sus Nombres');

update estimulos_rft_base e set concepto_imagen = 'prendas-de-vestir/camiseta' from clases_rft_base c where e.clase_base_id = c.id and c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Prendas de Vestir con sus Nombres') and c.grupo = 'Grupo 1' and e.posicion = 'B' and e.nombre = 'Camiseta';
update estimulos_rft_base e set concepto_imagen = 'prendas-de-vestir/pantalon' from clases_rft_base c where e.clase_base_id = c.id and c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Prendas de Vestir con sus Nombres') and c.grupo = 'Grupo 1' and e.posicion = 'B' and e.nombre = 'Pantalón';
update estimulos_rft_base e set concepto_imagen = 'prendas-de-vestir/zapatos' from clases_rft_base c where e.clase_base_id = c.id and c.programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Prendas de Vestir con sus Nombres') and c.grupo = 'Grupo 1' and e.posicion = 'B' and e.nombre = 'Zapatos';
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Prendas de Vestir con sus Nombres'), 'Clase 1', 'Grupo 2'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Prendas de Vestir con sus Nombres') and grupo = 'Grupo 2' and nombre = 'Clase 1')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A1', '"Calcetines"', 'A', null from nueva
union all select id, 'B1', 'Calcetines', 'B', 'prendas-de-vestir/calcetines' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Prendas de Vestir con sus Nombres'), 'Clase 2', 'Grupo 2'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Prendas de Vestir con sus Nombres') and grupo = 'Grupo 2' and nombre = 'Clase 2')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A2', '"Chaqueta"', 'A', null from nueva
union all select id, 'B2', 'Chaqueta', 'B', 'prendas-de-vestir/chaqueta' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Prendas de Vestir con sus Nombres'), 'Clase 3', 'Grupo 2'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Prendas de Vestir con sus Nombres') and grupo = 'Grupo 2' and nombre = 'Clase 3')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A3', '"Gorro"', 'A', null from nueva
union all select id, 'B3', 'Gorro', 'B', 'prendas-de-vestir/gorro' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Prendas de Vestir con sus Nombres'), 'Clase 1', 'Grupo 3'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Prendas de Vestir con sus Nombres') and grupo = 'Grupo 3' and nombre = 'Clase 1')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A1', '"Vestido"', 'A', null from nueva
union all select id, 'B1', 'Vestido', 'B', 'prendas-de-vestir/vestido' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Prendas de Vestir con sus Nombres'), 'Clase 2', 'Grupo 3'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Prendas de Vestir con sus Nombres') and grupo = 'Grupo 3' and nombre = 'Clase 2')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A2', '"Falda"', 'A', null from nueva
union all select id, 'B2', 'Falda', 'B', 'prendas-de-vestir/falda' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Prendas de Vestir con sus Nombres'), 'Clase 3', 'Grupo 3'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Prendas de Vestir con sus Nombres') and grupo = 'Grupo 3' and nombre = 'Clase 3')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A3', '"Bufanda"', 'A', null from nueva
union all select id, 'B3', 'Bufanda', 'B', 'prendas-de-vestir/bufanda' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Prendas de Vestir con sus Nombres'), 'Clase 1', 'Grupo 4'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Prendas de Vestir con sus Nombres') and grupo = 'Grupo 4' and nombre = 'Clase 1')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A1', '"Pijama"', 'A', null from nueva
union all select id, 'B1', 'Pijama', 'B', 'prendas-de-vestir/pijama' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Prendas de Vestir con sus Nombres'), 'Clase 2', 'Grupo 4'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Prendas de Vestir con sus Nombres') and grupo = 'Grupo 4' and nombre = 'Clase 2')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A2', '"Guantes"', 'A', null from nueva
union all select id, 'B2', 'Guantes', 'B', 'prendas-de-vestir/guantes' from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo)
  select (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Prendas de Vestir con sus Nombres'), 'Clase 3', 'Grupo 4'
  where not exists (select 1 from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Prendas de Vestir con sus Nombres') and grupo = 'Grupo 4' and nombre = 'Clase 3')
  returning id
)
insert into estimulos_rft_base (clase_base_id, etiqueta, nombre, posicion, concepto_imagen)
select id, 'A3', '"Botas"', 'A', null from nueva
union all select id, 'B3', 'Botas', 'B', 'prendas-de-vestir/botas' from nueva;
update programas_base set contenido_actualizado_at = now() where id = (select id from programas_base where clinica_id is null and nombre = 'Vincular Mutuamente Prendas de Vestir con sus Nombres');

-- Copias del PEI: concepto de imagen en los estímulos B del grupo 1
update estimulos_rft e set concepto_imagen = eb.concepto_imagen
from clases_rft c, programas_alumno pa, clases_rft_base cb, estimulos_rft_base eb
where e.clase_id = c.id and c.programa_alumno_id = pa.id
  and cb.programa_base_id = pa.programa_base_id and cb.grupo = c.grupo and cb.nombre = c.nombre
  and eb.clase_base_id = cb.id and eb.posicion = e.posicion and eb.nombre = e.nombre
  and eb.concepto_imagen is not null and e.concepto_imagen is null;

commit;
