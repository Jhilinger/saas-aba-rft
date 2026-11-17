-- Ordenar por Magnitud: 8 grupos; de 3 elementos muy diferentes a 5 con diferencias pequeñas; sentido alterno; anchura y grosor solo como dimensiones ya abstraídas.

begin;

delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud');

with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'), 'Clase 1', 'Grupo 1', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A1', 'A', '3 vasos de distinto tamaño (muy diferentes): «Ordénalos del más pequeño al más grande»', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'), 'Clase 2', 'Grupo 1', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A2', 'A', '3 cuerdas de distinta longitud (muy diferentes): «Ordénalas de la más larga a la más corta»', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'), 'Clase 3', 'Grupo 1', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A3', 'A', '3 torres de bloques de distinta altura (muy diferentes): «Ordénalas de la más baja a la más alta»', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'), 'Clase 4', 'Grupo 2', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A4', 'A', '3 botellas con distinta cantidad de agua (muy diferentes): «Ordénalas de la más llena a la más vacía»', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'), 'Clase 5', 'Grupo 2', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A5', 'A', '3 pelotas de distinto tamaño (muy diferentes): «Ordénalas de la más pequeña a la más grande»', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'), 'Clase 6', 'Grupo 2', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A6', 'A', '3 lápices de distinta longitud (muy diferentes): «Ordénalos del más largo al más corto»', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'), 'Clase 7', 'Grupo 3', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A7', 'A', '3 bolsas de distinto peso (con diferencias más pequeñas): «Ordénalas de la más ligera a la más pesada»', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'), 'Clase 8', 'Grupo 3', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A8', 'A', '3 cintas de distinta anchura (con diferencias más pequeñas): «Ordénalas de la más ancha a la más estrecha»', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'), 'Clase 9', 'Grupo 3', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A9', 'A', '3 muñecos de distinta altura (con diferencias más pequeñas): «Ordénalos del más bajo al más alto»', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'), 'Clase 10', 'Grupo 4', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A10', 'A', '4 platos con distinta cantidad de canicas (con diferencias más pequeñas): «Ordénalos del que tiene más canicas al que tiene menos canicas»', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'), 'Clase 11', 'Grupo 4', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A11', 'A', '4 cajas de distinto tamaño (con diferencias más pequeñas): «Ordénalas de la más pequeña a la más grande»', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'), 'Clase 12', 'Grupo 4', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A12', 'A', '4 libros de distinto grosor (con diferencias más pequeñas): «Ordénalos del más gordo al más fino»', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'), 'Clase 13', 'Grupo 5', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A13', 'A', '4 palos de distinta longitud (con diferencias más pequeñas): «Ordénalos del más corto al más largo»', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'), 'Clase 14', 'Grupo 5', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A14', 'A', '4 botes de distinto peso (con diferencias más pequeñas): «Ordénalos del más pesado al más ligero»', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'), 'Clase 15', 'Grupo 5', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A15', 'A', '4 velas de distinta altura (con diferencias más pequeñas): «Ordénalas de la más baja a la más alta»', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'), 'Clase 16', 'Grupo 6', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A16', 'A', '4 tazas con distinta cantidad de agua (con diferencias más pequeñas): «Ordénalas de la más llena a la más vacía»', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'), 'Clase 17', 'Grupo 6', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A17', 'A', '4 cucharas de distinto tamaño (con diferencias más pequeñas): «Ordénalas de la más pequeña a la más grande»', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'), 'Clase 18', 'Grupo 6', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A18', 'A', '4 trenes de piezas de distinta longitud (con diferencias más pequeñas): «Ordénalos del más largo al más corto»', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'), 'Clase 19', 'Grupo 7', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A19', 'A', '5 rotuladores de distinto grosor (con diferencias más pequeñas): «Ordénalos del más fino al más gordo»', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'), 'Clase 20', 'Grupo 7', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A20', 'A', '5 montones de fichas de distinta altura (con diferencias más pequeñas): «Ordénalos del más alto al más bajo»', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'), 'Clase 21', 'Grupo 7', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A21', 'A', '5 cajas de arena de distinto peso (con diferencias más pequeñas): «Ordénalas de la más ligera a la más pesada»', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'), 'Clase 22', 'Grupo 8', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A22', 'A', '5 tiras de papel de distinta anchura (con diferencias más pequeñas): «Ordénalas de la más ancha a la más estrecha»', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'), 'Clase 23', 'Grupo 8', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A23', 'A', '5 peluches de distinto tamaño (con diferencias más pequeñas): «Ordénalos del más pequeño al más grande»', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Ordenar por Magnitud'), 'Clase 24', 'Grupo 8', null) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A24', 'A', '5 vasos con distinta cantidad de agua (con diferencias más pequeñas): «Ordénalos del más lleno al más vacío»', null)) x(etiqueta, posicion, nombre, concepto);

commit;
