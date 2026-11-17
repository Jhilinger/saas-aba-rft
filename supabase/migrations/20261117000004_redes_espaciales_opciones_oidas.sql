-- Derivar Relaciones Espaciales en Redes Combinatorias: 8 grupos de 3 clases con 3 miembros; las opciones son los tres
-- miembros de la clase, en audio; test combinatorio con las dos premisas en la clave.

begin;

delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias');

with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'), 'Clase 1', 'Grupo 1', '{"entrenamiento:B→A": "La muñeca está encima del plato. ¿Qué está encima del plato?", "entrenamiento:C→B": "El plato está encima de la pelota. ¿Qué está encima de la pelota?", "test_mutuo:A→B": "La muñeca está encima del plato. ¿Qué está debajo de la muñeca?", "test_mutuo:B→C": "El plato está encima de la pelota. ¿Qué está debajo del plato?", "test_combinatorio:C→A": "La muñeca está encima del plato. El plato está encima de la pelota. ¿Qué está más arriba, la muñeca o la pelota?", "test_combinatorio:A→C": "La muñeca está encima del plato. El plato está encima de la pelota. ¿Qué está más abajo, la muñeca o la pelota?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A1', 'A', 'La muñeca', 'objetos/muneca'),
  ('B1', 'B', 'El plato', 'utensilios-de-cocina/plato'),
  ('C1', 'C', 'La pelota', 'objetos/pelota')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'), 'Clase 2', 'Grupo 1', '{"entrenamiento:B→A": "El tractor está detrás del gorro. ¿Qué está detrás del gorro?", "entrenamiento:C→B": "El gorro está detrás del tenedor. ¿Qué está detrás del tenedor?", "test_mutuo:A→B": "El tractor está detrás del gorro. ¿Qué está delante del tractor?", "test_mutuo:B→C": "El gorro está detrás del tenedor. ¿Qué está delante del gorro?", "test_combinatorio:C→A": "El tractor está detrás del gorro. El gorro está detrás del tenedor. ¿Qué está más atrás, el tractor o el tenedor?", "test_combinatorio:A→C": "El tractor está detrás del gorro. El gorro está detrás del tenedor. ¿Qué está más adelante, el tractor o el tenedor?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A2', 'A', 'El tractor', 'vehiculos/tractor'),
  ('B2', 'B', 'El gorro', 'prendas-de-vestir/gorro'),
  ('C2', 'C', 'El tenedor', 'utensilios-de-cocina/tenedor')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'), 'Clase 3', 'Grupo 1', '{"entrenamiento:B→A": "A la izquierda de la oveja está el pato. ¿Qué está a la izquierda de la oveja?", "entrenamiento:C→B": "A la izquierda del autobús está la oveja. ¿Qué está a la izquierda del autobús?", "test_mutuo:A→B": "A la izquierda de la oveja está el pato. ¿Qué está a la derecha del pato?", "test_mutuo:B→C": "A la izquierda del autobús está la oveja. ¿Qué está a la derecha de la oveja?", "test_combinatorio:C→A": "A la izquierda de la oveja está el pato. A la izquierda del autobús está la oveja. ¿Qué está más a la izquierda, el autobús o el pato?", "test_combinatorio:A→C": "A la izquierda de la oveja está el pato. A la izquierda del autobús está la oveja. ¿Qué está más a la derecha, el autobús o el pato?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A3', 'A', 'El pato', 'animales-de-granja/pato'),
  ('B3', 'B', 'La oveja', 'animales-de-granja/oveja'),
  ('C3', 'C', 'El autobús', 'vehiculos/autobus')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'), 'Clase 4', 'Grupo 2', '{"entrenamiento:B→A": "Debajo del autobús está el peluche. ¿Qué está debajo del autobús?", "entrenamiento:C→B": "Debajo de la ambulancia está el autobús. ¿Qué está debajo de la ambulancia?", "test_mutuo:A→B": "Debajo del autobús está el peluche. ¿Qué está encima del peluche?", "test_mutuo:B→C": "Debajo de la ambulancia está el autobús. ¿Qué está encima del autobús?", "test_combinatorio:C→A": "Debajo del autobús está el peluche. Debajo de la ambulancia está el autobús. ¿Qué está más abajo, la ambulancia o el peluche?", "test_combinatorio:A→C": "Debajo del autobús está el peluche. Debajo de la ambulancia está el autobús. ¿Qué está más arriba, la ambulancia o el peluche?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A4', 'A', 'El peluche', 'objetos/peluche'),
  ('B4', 'B', 'El autobús', 'vehiculos/autobus'),
  ('C4', 'C', 'La ambulancia', 'vehiculos/ambulancia')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'), 'Clase 5', 'Grupo 2', '{"entrenamiento:B→A": "La oveja está delante del caballo. ¿Qué está delante del caballo?", "entrenamiento:C→B": "El caballo está delante de la muñeca. ¿Qué está delante de la muñeca?", "test_mutuo:A→B": "La oveja está delante del caballo. ¿Qué está detrás de la oveja?", "test_mutuo:B→C": "El caballo está delante de la muñeca. ¿Qué está detrás del caballo?", "test_combinatorio:C→A": "El caballo está delante de la muñeca. La oveja está delante del caballo. ¿Qué está más adelante, la oveja o la muñeca?", "test_combinatorio:A→C": "El caballo está delante de la muñeca. La oveja está delante del caballo. ¿Qué está más atrás, la oveja o la muñeca?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A5', 'A', 'La oveja', 'animales-de-granja/oveja'),
  ('B5', 'B', 'El caballo', 'animales-de-granja/caballo'),
  ('C5', 'C', 'La muñeca', 'objetos/muneca')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'), 'Clase 6', 'Grupo 2', '{"entrenamiento:B→A": "El rotulador está a la derecha de la gallina. ¿Qué está a la derecha de la gallina?", "entrenamiento:C→B": "La gallina está a la derecha del burro. ¿Qué está a la derecha del burro?", "test_mutuo:A→B": "El rotulador está a la derecha de la gallina. ¿Qué está a la izquierda del rotulador?", "test_mutuo:B→C": "La gallina está a la derecha del burro. ¿Qué está a la izquierda de la gallina?", "test_combinatorio:C→A": "La gallina está a la derecha del burro. El rotulador está a la derecha de la gallina. ¿Qué está más a la derecha, el rotulador o el burro?", "test_combinatorio:A→C": "La gallina está a la derecha del burro. El rotulador está a la derecha de la gallina. ¿Qué está más a la izquierda, el rotulador o el burro?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A6', 'A', 'El rotulador', 'material-escolar/rotulador'),
  ('B6', 'B', 'La gallina', 'animales-de-granja/gallina'),
  ('C6', 'C', 'El burro', 'animales-de-granja/burro')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'), 'Clase 7', 'Grupo 3', '{"entrenamiento:B→A": "Encima del autobús está la cuchara. ¿Qué está encima del autobús?", "entrenamiento:C→B": "Encima del pan está el autobús. ¿Qué está encima del pan?", "test_mutuo:A→B": "Encima del autobús está la cuchara. ¿Qué está debajo de la cuchara?", "test_mutuo:B→C": "Encima del pan está el autobús. ¿Qué está debajo del autobús?", "test_combinatorio:C→A": "Encima del pan está el autobús. Encima del autobús está la cuchara. ¿Qué está más arriba, el pan o la cuchara?", "test_combinatorio:A→C": "Encima del pan está el autobús. Encima del autobús está la cuchara. ¿Qué está más abajo, el pan o la cuchara?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A7', 'A', 'La cuchara', 'utensilios-de-cocina/cuchara'),
  ('B7', 'B', 'El autobús', 'vehiculos/autobus'),
  ('C7', 'C', 'El pan', 'alimentos/pan')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'), 'Clase 8', 'Grupo 3', '{"entrenamiento:B→A": "Detrás de la silla está el vaso. ¿Qué está detrás de la silla?", "entrenamiento:C→B": "Detrás de la muñeca está la silla. ¿Qué está detrás de la muñeca?", "test_mutuo:A→B": "Detrás de la silla está el vaso. ¿Qué está delante del vaso?", "test_mutuo:B→C": "Detrás de la muñeca está la silla. ¿Qué está delante de la silla?", "test_combinatorio:C→A": "Detrás de la muñeca está la silla. Detrás de la silla está el vaso. ¿Qué está más atrás, la muñeca o el vaso?", "test_combinatorio:A→C": "Detrás de la muñeca está la silla. Detrás de la silla está el vaso. ¿Qué está más adelante, la muñeca o el vaso?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A8', 'A', 'El vaso', 'utensilios-de-cocina/vaso'),
  ('B8', 'B', 'La silla', 'muebles/silla'),
  ('C8', 'C', 'La muñeca', 'objetos/muneca')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'), 'Clase 9', 'Grupo 3', '{"entrenamiento:B→A": "El gato está a la izquierda de la galleta. ¿Qué está a la izquierda de la galleta?", "entrenamiento:C→B": "La galleta está a la izquierda del bol. ¿Qué está a la izquierda del bol?", "test_mutuo:A→B": "El gato está a la izquierda de la galleta. ¿Qué está a la derecha del gato?", "test_mutuo:B→C": "La galleta está a la izquierda del bol. ¿Qué está a la derecha de la galleta?", "test_combinatorio:C→A": "El gato está a la izquierda de la galleta. La galleta está a la izquierda del bol. ¿Qué está más a la izquierda, el bol o el gato?", "test_combinatorio:A→C": "El gato está a la izquierda de la galleta. La galleta está a la izquierda del bol. ¿Qué está más a la derecha, el bol o el gato?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A9', 'A', 'El gato', 'animales-de-granja/gato'),
  ('B9', 'B', 'La galleta', 'alimentos/galleta'),
  ('C9', 'C', 'El bol', 'utensilios-de-cocina/bol')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'), 'Clase 10', 'Grupo 4', '{"entrenamiento:B→A": "El queso está debajo del plátano. ¿Qué está debajo del plátano?", "entrenamiento:C→B": "El plátano está debajo del pan. ¿Qué está debajo del pan?", "test_mutuo:A→B": "El queso está debajo del plátano. ¿Qué está encima del queso?", "test_mutuo:B→C": "El plátano está debajo del pan. ¿Qué está encima del plátano?", "test_combinatorio:C→A": "El queso está debajo del plátano. El plátano está debajo del pan. ¿Qué está más abajo, el pan o el queso?", "test_combinatorio:A→C": "El queso está debajo del plátano. El plátano está debajo del pan. ¿Qué está más arriba, el pan o el queso?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A10', 'A', 'El queso', 'alimentos/queso'),
  ('B10', 'B', 'El plátano', 'alimentos/platano'),
  ('C10', 'C', 'El pan', 'alimentos/pan')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'), 'Clase 11', 'Grupo 4', '{"entrenamiento:B→A": "Delante de la goma está el pato. ¿Qué está delante de la goma?", "entrenamiento:C→B": "Delante del vaso está la goma. ¿Qué está delante del vaso?", "test_mutuo:A→B": "Delante de la goma está el pato. ¿Qué está detrás del pato?", "test_mutuo:B→C": "Delante del vaso está la goma. ¿Qué está detrás de la goma?", "test_combinatorio:C→A": "Delante de la goma está el pato. Delante del vaso está la goma. ¿Qué está más adelante, el pato o el vaso?", "test_combinatorio:A→C": "Delante de la goma está el pato. Delante del vaso está la goma. ¿Qué está más atrás, el pato o el vaso?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A11', 'A', 'El pato', 'animales-de-granja/pato'),
  ('B11', 'B', 'La goma', 'material-escolar/goma'),
  ('C11', 'C', 'El vaso', 'utensilios-de-cocina/vaso')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'), 'Clase 12', 'Grupo 4', '{"entrenamiento:B→A": "A la derecha de la pelota está la manzana. ¿Qué está a la derecha de la pelota?", "entrenamiento:C→B": "A la derecha del armario está la pelota. ¿Qué está a la derecha del armario?", "test_mutuo:A→B": "A la derecha de la pelota está la manzana. ¿Qué está a la izquierda de la manzana?", "test_mutuo:B→C": "A la derecha del armario está la pelota. ¿Qué está a la izquierda de la pelota?", "test_combinatorio:C→A": "A la derecha de la pelota está la manzana. A la derecha del armario está la pelota. ¿Qué está más a la derecha, la manzana o el armario?", "test_combinatorio:A→C": "A la derecha de la pelota está la manzana. A la derecha del armario está la pelota. ¿Qué está más a la izquierda, la manzana o el armario?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A12', 'A', 'La manzana', 'alimentos/manzana'),
  ('B12', 'B', 'La pelota', 'objetos/pelota'),
  ('C12', 'C', 'El armario', 'muebles/armario')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'), 'Clase 13', 'Grupo 5', '{"entrenamiento:B→A": "La muñeca está encima del tenedor. ¿Qué está encima del tenedor?", "entrenamiento:C→B": "El tenedor está encima del pato. ¿Qué está encima del pato?", "test_mutuo:A→B": "La muñeca está encima del tenedor. ¿Qué está debajo de la muñeca?", "test_mutuo:B→C": "El tenedor está encima del pato. ¿Qué está debajo del tenedor?", "test_combinatorio:C→A": "El tenedor está encima del pato. La muñeca está encima del tenedor. ¿Qué está más arriba, el pato o la muñeca?", "test_combinatorio:A→C": "El tenedor está encima del pato. La muñeca está encima del tenedor. ¿Qué está más abajo, el pato o la muñeca?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A13', 'A', 'La muñeca', 'objetos/muneca'),
  ('B13', 'B', 'El tenedor', 'utensilios-de-cocina/tenedor'),
  ('C13', 'C', 'El pato', 'animales-de-granja/pato')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'), 'Clase 14', 'Grupo 5', '{"entrenamiento:B→A": "El bol está detrás de la vaca. ¿Qué está detrás de la vaca?", "entrenamiento:C→B": "La vaca está detrás de la regla. ¿Qué está detrás de la regla?", "test_mutuo:A→B": "El bol está detrás de la vaca. ¿Qué está delante del bol?", "test_mutuo:B→C": "La vaca está detrás de la regla. ¿Qué está delante de la vaca?", "test_combinatorio:C→A": "La vaca está detrás de la regla. El bol está detrás de la vaca. ¿Qué está más atrás, la regla o el bol?", "test_combinatorio:A→C": "La vaca está detrás de la regla. El bol está detrás de la vaca. ¿Qué está más adelante, la regla o el bol?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A14', 'A', 'El bol', 'utensilios-de-cocina/bol'),
  ('B14', 'B', 'La vaca', 'animales-de-granja/vaca'),
  ('C14', 'C', 'La regla', 'material-escolar/regla')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'), 'Clase 15', 'Grupo 5', '{"entrenamiento:B→A": "A la izquierda de la galleta está el reloj. ¿Qué está a la izquierda de la galleta?", "entrenamiento:C→B": "A la izquierda del burro está la galleta. ¿Qué está a la izquierda del burro?", "test_mutuo:A→B": "A la izquierda de la galleta está el reloj. ¿Qué está a la derecha del reloj?", "test_mutuo:B→C": "A la izquierda del burro está la galleta. ¿Qué está a la derecha de la galleta?", "test_combinatorio:C→A": "A la izquierda del burro está la galleta. A la izquierda de la galleta está el reloj. ¿Qué está más a la izquierda, el reloj o el burro?", "test_combinatorio:A→C": "A la izquierda del burro está la galleta. A la izquierda de la galleta está el reloj. ¿Qué está más a la derecha, el reloj o el burro?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A15', 'A', 'El reloj', 'objetos/reloj'),
  ('B15', 'B', 'La galleta', 'alimentos/galleta'),
  ('C15', 'C', 'El burro', 'animales-de-granja/burro')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'), 'Clase 16', 'Grupo 6', '{"entrenamiento:B→A": "Debajo del camión está la pelota. ¿Qué está debajo del camión?", "entrenamiento:C→B": "Debajo del libro está el camión. ¿Qué está debajo del libro?", "test_mutuo:A→B": "Debajo del camión está la pelota. ¿Qué está encima de la pelota?", "test_mutuo:B→C": "Debajo del libro está el camión. ¿Qué está encima del camión?", "test_combinatorio:C→A": "Debajo del libro está el camión. Debajo del camión está la pelota. ¿Qué está más abajo, la pelota o el libro?", "test_combinatorio:A→C": "Debajo del libro está el camión. Debajo del camión está la pelota. ¿Qué está más arriba, la pelota o el libro?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A16', 'A', 'La pelota', 'objetos/pelota'),
  ('B16', 'B', 'El camión', 'vehiculos/camion'),
  ('C16', 'C', 'El libro', 'material-escolar/libro')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'), 'Clase 17', 'Grupo 6', '{"entrenamiento:B→A": "El sofá está delante del plato. ¿Qué está delante del plato?", "entrenamiento:C→B": "El plato está delante del burro. ¿Qué está delante del burro?", "test_mutuo:A→B": "El sofá está delante del plato. ¿Qué está detrás del sofá?", "test_mutuo:B→C": "El plato está delante del burro. ¿Qué está detrás del plato?", "test_combinatorio:C→A": "El sofá está delante del plato. El plato está delante del burro. ¿Qué está más adelante, el sofá o el burro?", "test_combinatorio:A→C": "El sofá está delante del plato. El plato está delante del burro. ¿Qué está más atrás, el sofá o el burro?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A17', 'A', 'El sofá', 'muebles/sofa'),
  ('B17', 'B', 'El plato', 'utensilios-de-cocina/plato'),
  ('C17', 'C', 'El burro', 'animales-de-granja/burro')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'), 'Clase 18', 'Grupo 6', '{"entrenamiento:B→A": "El lápiz está a la derecha del armario. ¿Qué está a la derecha del armario?", "entrenamiento:C→B": "El armario está a la derecha de la vaca. ¿Qué está a la derecha de la vaca?", "test_mutuo:A→B": "El lápiz está a la derecha del armario. ¿Qué está a la izquierda del lápiz?", "test_mutuo:B→C": "El armario está a la derecha de la vaca. ¿Qué está a la izquierda del armario?", "test_combinatorio:C→A": "El lápiz está a la derecha del armario. El armario está a la derecha de la vaca. ¿Qué está más a la derecha, el lápiz o la vaca?", "test_combinatorio:A→C": "El lápiz está a la derecha del armario. El armario está a la derecha de la vaca. ¿Qué está más a la izquierda, el lápiz o la vaca?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A18', 'A', 'El lápiz', 'material-escolar/lapiz'),
  ('B18', 'B', 'El armario', 'muebles/armario'),
  ('C18', 'C', 'La vaca', 'animales-de-granja/vaca')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'), 'Clase 19', 'Grupo 7', '{"entrenamiento:B→A": "Encima de la regla está el gorro. ¿Qué está encima de la regla?", "entrenamiento:C→B": "Encima de la manzana está la regla. ¿Qué está encima de la manzana?", "test_mutuo:A→B": "Encima de la regla está el gorro. ¿Qué está debajo del gorro?", "test_mutuo:B→C": "Encima de la manzana está la regla. ¿Qué está debajo de la regla?", "test_combinatorio:C→A": "Encima de la regla está el gorro. Encima de la manzana está la regla. ¿Qué está más arriba, la manzana o el gorro?", "test_combinatorio:A→C": "Encima de la regla está el gorro. Encima de la manzana está la regla. ¿Qué está más abajo, la manzana o el gorro?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A19', 'A', 'El gorro', 'prendas-de-vestir/gorro'),
  ('B19', 'B', 'La regla', 'material-escolar/regla'),
  ('C19', 'C', 'La manzana', 'alimentos/manzana')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'), 'Clase 20', 'Grupo 7', '{"entrenamiento:B→A": "Detrás de la taza está el queso. ¿Qué está detrás de la taza?", "entrenamiento:C→B": "Detrás del caballo está la taza. ¿Qué está detrás del caballo?", "test_mutuo:A→B": "Detrás de la taza está el queso. ¿Qué está delante del queso?", "test_mutuo:B→C": "Detrás del caballo está la taza. ¿Qué está delante de la taza?", "test_combinatorio:C→A": "Detrás de la taza está el queso. Detrás del caballo está la taza. ¿Qué está más atrás, el caballo o el queso?", "test_combinatorio:A→C": "Detrás de la taza está el queso. Detrás del caballo está la taza. ¿Qué está más adelante, el caballo o el queso?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A20', 'A', 'El queso', 'alimentos/queso'),
  ('B20', 'B', 'La taza', 'utensilios-de-cocina/taza'),
  ('C20', 'C', 'El caballo', 'animales-de-granja/caballo')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'), 'Clase 21', 'Grupo 7', '{"entrenamiento:B→A": "La silla está a la izquierda de la ambulancia. ¿Qué está a la izquierda de la ambulancia?", "entrenamiento:C→B": "La ambulancia está a la izquierda de la moto. ¿Qué está a la izquierda de la moto?", "test_mutuo:A→B": "La silla está a la izquierda de la ambulancia. ¿Qué está a la derecha de la silla?", "test_mutuo:B→C": "La ambulancia está a la izquierda de la moto. ¿Qué está a la derecha de la ambulancia?", "test_combinatorio:C→A": "La ambulancia está a la izquierda de la moto. La silla está a la izquierda de la ambulancia. ¿Qué está más a la izquierda, la silla o la moto?", "test_combinatorio:A→C": "La ambulancia está a la izquierda de la moto. La silla está a la izquierda de la ambulancia. ¿Qué está más a la derecha, la silla o la moto?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A21', 'A', 'La silla', 'muebles/silla'),
  ('B21', 'B', 'La ambulancia', 'vehiculos/ambulancia'),
  ('C21', 'C', 'La moto', 'vehiculos/moto')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'), 'Clase 22', 'Grupo 8', '{"entrenamiento:B→A": "La mesa está debajo del queso. ¿Qué está debajo del queso?", "entrenamiento:C→B": "El queso está debajo de la manzana. ¿Qué está debajo de la manzana?", "test_mutuo:A→B": "La mesa está debajo del queso. ¿Qué está encima de la mesa?", "test_mutuo:B→C": "El queso está debajo de la manzana. ¿Qué está encima del queso?", "test_combinatorio:C→A": "El queso está debajo de la manzana. La mesa está debajo del queso. ¿Qué está más abajo, la mesa o la manzana?", "test_combinatorio:A→C": "El queso está debajo de la manzana. La mesa está debajo del queso. ¿Qué está más arriba, la mesa o la manzana?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A22', 'A', 'La mesa', 'muebles/mesa'),
  ('B22', 'B', 'El queso', 'alimentos/queso'),
  ('C22', 'C', 'La manzana', 'alimentos/manzana')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'), 'Clase 23', 'Grupo 8', '{"entrenamiento:B→A": "Delante del perro está la galleta. ¿Qué está delante del perro?", "entrenamiento:C→B": "Delante del autobús está el perro. ¿Qué está delante del autobús?", "test_mutuo:A→B": "Delante del perro está la galleta. ¿Qué está detrás de la galleta?", "test_mutuo:B→C": "Delante del autobús está el perro. ¿Qué está detrás del perro?", "test_combinatorio:C→A": "Delante del autobús está el perro. Delante del perro está la galleta. ¿Qué está más adelante, el autobús o la galleta?", "test_combinatorio:A→C": "Delante del autobús está el perro. Delante del perro está la galleta. ¿Qué está más atrás, el autobús o la galleta?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A23', 'A', 'La galleta', 'alimentos/galleta'),
  ('B23', 'B', 'El perro', 'animales-de-granja/perro'),
  ('C23', 'C', 'El autobús', 'vehiculos/autobus')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias'), 'Clase 24', 'Grupo 8', '{"entrenamiento:B→A": "A la derecha del peluche está el plátano. ¿Qué está a la derecha del peluche?", "entrenamiento:C→B": "A la derecha del tractor está el peluche. ¿Qué está a la derecha del tractor?", "test_mutuo:A→B": "A la derecha del peluche está el plátano. ¿Qué está a la izquierda del plátano?", "test_mutuo:B→C": "A la derecha del tractor está el peluche. ¿Qué está a la izquierda del peluche?", "test_combinatorio:C→A": "A la derecha del tractor está el peluche. A la derecha del peluche está el plátano. ¿Qué está más a la derecha, el tractor o el plátano?", "test_combinatorio:A→C": "A la derecha del tractor está el peluche. A la derecha del peluche está el plátano. ¿Qué está más a la izquierda, el tractor o el plátano?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A24', 'A', 'El plátano', 'alimentos/platano'),
  ('B24', 'B', 'El peluche', 'objetos/peluche'),
  ('C24', 'C', 'El tractor', 'vehiculos/tractor')) x(etiqueta, posicion, nombre, concepto);

update programas_base set
  opciones_clase = true,
  consignas = null,
  objetivo = 'A partir de dos relaciones espaciales encadenadas enunciadas verbalmente ("La muñeca está encima del plato"; "El plato está encima de la pelota"), el alumno deriva la relación entre los extremos ("¿Qué está más arriba, la muñeca o la pelota?" → la muñeca), con encima/debajo, delante/detrás e izquierda/derecha.',
  materiales = 'Grupos de 3 (o más) clases con 3 miembros:

A: El extremo hacia el que apunta la relación enunciada (ej. el de más arriba si se dice «encima»)
B: El elemento intermedio
C: El otro extremo

Objetos del banco de imágenes combinados al azar, sin escena: la relación se presenta solo de forma verbal (las imágenes sirven al terapeuta y van sueltas a propósito). Al mezclar objetos de categorías distintas, la relación no es ni habitual ni absurda, de modo que el alumno no puede responder por lo que conoce del mundo; ningún par de objetos se repite en dos clases. Solo se usan los tres marcos trabajados: encima/debajo, delante/detrás e izquierda/derecha, rotando entre clases. Las opciones son los tres objetos, dichos uno a uno (en la tableta, tarjetas de audio). Contrapesos: la mitad de las clases enuncian un polo («encima») y la otra mitad el contrario («debajo»); en la mitad la frase va en orden invertido («Encima del plato está la muñeca»); en el test combinatorio, la mitad de las clases dicen las premisas en orden inverso y se alterna el orden de los extremos en la pregunta.',
  instrucciones_terapeuta = '
Requisito previo: el alumno ha superado "Vincular Mutuamente Relaciones Espaciales" (dominio 3.4).

Opciones de respuesta: en cada ensayo, diga uno a uno los tres miembros de la red («La muñeca», «El plato», «La pelota»); el alumno elige uno. Al estar siempre los tres, el miembro que no corresponde actúa como distractor y no hace falta añadir ninguno de otra clase.

Fase 1 - Entrenamiento (A–B y B–C por separado):

1. Enuncie una sola relación y pregunte en el sentido enunciado ("La muñeca está encima del plato. ¿Qué está encima del plato?").
2. No mencione nunca A y C en la misma relación durante el entrenamiento.
3. Refuerce hasta alcanzar el criterio de dominio en ambas relaciones y realice después un bloque de mantenimiento con ambas mezcladas.

Fase 2 - Test de Vinculación Mutua (sentido inverso de cada par), sin entrenamiento directo:

1. Enuncie la relación y pregunte en sentido inverso ("La muñeca está encima del plato. ¿Qué está debajo de la muñeca?").
2. No refuerce diferencialmente durante estos ensayos (evite dar pistas de si es correcto o incorrecto), pero registre la respuesta.

Fase 3 - Test de Vinculación Combinatoria (A ↔ C), sin entrenamiento directo:

1. Diga las dos premisas seguidas y pregunte por los extremos: "La muñeca está encima del plato. El plato está encima de la pelota. ¿Qué está más arriba, la muñeca o la pelota?" y "… ¿Qué está más abajo, la muñeca o la pelota?" (con delante/detrás: "más adelante"/"más atrás"; con izquierda/derecha: "más a la izquierda"/"más a la derecha").
2. Si quiere, pregunte también "¿Qué está más abajo de todo?" y regístrelo con "+ Ensayo de control" (no cuenta para el porcentaje ni el dominio).
3. No refuerce diferencialmente durante estos ensayos (evite dar pistas de si es correcto o incorrecto), pero registre la respuesta.
4. Elegir B (el intermedio) indica que no integra las dos premisas.

Generalización (sondas): tras la respuesta verbal, pida al alumno que construya la escena con objetos reales a partir de las dos relaciones.

Realice el primer bloque de cada test sin ayudas. Si el alumno alcanza el criterio, la relación se considera DERIVADA; si se enseña con ayudas, quedará registrada como DOMINADA (no derivada), aunque el último bloque se realice sin ayudas.

Registro en la app (fase · posición origen → destino; el destino es la respuesta correcta):
- Entrenamiento: B → A ("¿Qué está encima del plato?") y C → B ("¿Qué está encima de la pelota?")
- Test de vínculo mutuo: A → B ("¿Qué está debajo de la muñeca?") y B → C ("¿Qué está debajo del plato?")
- Test de vínculo combinatorio: C → A ("¿Qué está más arriba, la muñeca o la pelota?") y A → C ("¿Qué está más abajo, la muñeca o la pelota?")
Las sondas con los mismos estímulos en otro contexto o con otra persona se registran con las mismas posiciones, eligiendo "Sonda de generalización" como tipo de bloque una vez dominada la combinación.

Grupos de estímulos: los grupos y clases de este programa son un ejemplo. Cree en el PEI del alumno tantos grupos como considere oportuno, incluido un grupo de generalización con estímulos nuevos. En ese grupo, el primer bloque de entrenamiento realizado sin ayudas y sin reforzar diferencialmente funciona como sonda: si el alumno alcanza el criterio a la primera, hay generalización a estímulos nuevos (anótelo en las notas del bloque). Los tests de ese grupo se habilitan cuando su entrenamiento está dominado. Las sondas con los mismos estímulos en otro contexto o con otra persona se registran como "Sonda de generalización" en el grupo ya dominado.'
where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias';

commit;
