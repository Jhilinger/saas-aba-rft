-- «Completar Analogías Verbales» rehecho tras revisar Ruiz y Luciano (2011) y Carpentier et al. (2004):
-- en las analogías de cuatro términos la respuesta puede salir solo del último término («pez → nadar»)
-- sin mirar el par base. Cada grupo usa el mismo par de términos con tres relaciones distintas, y las
-- opciones son siempre las tres respuestas del grupo: solo acierta quien relaciona las relaciones.
begin;
delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales');
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'), 'Clase 1', 'Grupo 1', 1, $j${"entrenamiento:A→B": "Pájaro es a volar como pez es a…", "test_mutuo:B→A": "Pez es a nadar como pájaro es a…"}$j$::jsonb, $j${"A→B": "nadar", "B→A": "volar"}$j$::jsonb, $j${"entrenamiento:A→B": ["nadar", "pecera", "escamas"], "test_mutuo:B→A": ["plumas", "volar", "nido"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A1', 'A', $j$Pájaro : volar$j$, null from nueva union all select id, 'B1', 'B', $j$Pez : nadar$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'), 'Clase 2', 'Grupo 1', 2, $j${"entrenamiento:A→B": "Pájaro es a nido como pez es a…", "test_mutuo:B→A": "Pez es a pecera como pájaro es a…"}$j$::jsonb, $j${"A→B": "pecera", "B→A": "nido"}$j$::jsonb, $j${"entrenamiento:A→B": ["escamas", "pecera", "nadar"], "test_mutuo:B→A": ["volar", "plumas", "nido"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A2', 'A', $j$Pájaro : nido$j$, null from nueva union all select id, 'B2', 'B', $j$Pez : pecera$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'), 'Clase 3', 'Grupo 1', 3, $j${"entrenamiento:A→B": "Pájaro es a plumas como pez es a…", "test_mutuo:B→A": "Pez es a escamas como pájaro es a…"}$j$::jsonb, $j${"A→B": "escamas", "B→A": "plumas"}$j$::jsonb, $j${"entrenamiento:A→B": ["nadar", "pecera", "escamas"], "test_mutuo:B→A": ["plumas", "nido", "volar"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A3', 'A', $j$Pájaro : plumas$j$, null from nueva union all select id, 'B3', 'B', $j$Pez : escamas$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'), 'Clase 4', 'Grupo 2', 4, $j${"entrenamiento:A→B": "Perro es a ladrar como gato es a…", "test_mutuo:B→A": "Gato es a maullar como perro es a…"}$j$::jsonb, $j${"A→B": "maullar", "B→A": "ladrar"}$j$::jsonb, $j${"entrenamiento:A→B": ["pescado", "maullar", "gatito"], "test_mutuo:B→A": ["cachorro", "hueso", "ladrar"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A4', 'A', $j$Perro : ladrar$j$, null from nueva union all select id, 'B4', 'B', $j$Gato : maullar$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'), 'Clase 5', 'Grupo 2', 5, $j${"entrenamiento:A→B": "Perro es a hueso como gato es a…", "test_mutuo:B→A": "Gato es a pescado como perro es a…"}$j$::jsonb, $j${"A→B": "pescado", "B→A": "hueso"}$j$::jsonb, $j${"entrenamiento:A→B": ["gatito", "maullar", "pescado"], "test_mutuo:B→A": ["hueso", "ladrar", "cachorro"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A5', 'A', $j$Perro : hueso$j$, null from nueva union all select id, 'B5', 'B', $j$Gato : pescado$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'), 'Clase 6', 'Grupo 2', 6, $j${"entrenamiento:A→B": "Perro es a cachorro como gato es a…", "test_mutuo:B→A": "Gato es a gatito como perro es a…"}$j$::jsonb, $j${"A→B": "gatito", "B→A": "cachorro"}$j$::jsonb, $j${"entrenamiento:A→B": ["gatito", "maullar", "pescado"], "test_mutuo:B→A": ["hueso", "cachorro", "ladrar"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A6', 'A', $j$Perro : cachorro$j$, null from nueva union all select id, 'B6', 'B', $j$Gato : gatito$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'), 'Clase 7', 'Grupo 3', 7, $j${"entrenamiento:A→B": "Vaca es a leche como gallina es a…", "test_mutuo:B→A": "Gallina es a huevos como vaca es a…"}$j$::jsonb, $j${"A→B": "huevos", "B→A": "leche"}$j$::jsonb, $j${"entrenamiento:A→B": ["cacarear", "pollito", "huevos"], "test_mutuo:B→A": ["leche", "ternero", "mugir"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A7', 'A', $j$Vaca : leche$j$, null from nueva union all select id, 'B7', 'B', $j$Gallina : huevos$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'), 'Clase 8', 'Grupo 3', 8, $j${"entrenamiento:A→B": "Vaca es a mugir como gallina es a…", "test_mutuo:B→A": "Gallina es a cacarear como vaca es a…"}$j$::jsonb, $j${"A→B": "cacarear", "B→A": "mugir"}$j$::jsonb, $j${"entrenamiento:A→B": ["cacarear", "pollito", "huevos"], "test_mutuo:B→A": ["leche", "mugir", "ternero"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A8', 'A', $j$Vaca : mugir$j$, null from nueva union all select id, 'B8', 'B', $j$Gallina : cacarear$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'), 'Clase 9', 'Grupo 3', 9, $j${"entrenamiento:A→B": "Vaca es a ternero como gallina es a…", "test_mutuo:B→A": "Gallina es a pollito como vaca es a…"}$j$::jsonb, $j${"A→B": "pollito", "B→A": "ternero"}$j$::jsonb, $j${"entrenamiento:A→B": ["huevos", "pollito", "cacarear"], "test_mutuo:B→A": ["mugir", "leche", "ternero"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A9', 'A', $j$Vaca : ternero$j$, null from nueva union all select id, 'B9', 'B', $j$Gallina : pollito$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'), 'Clase 10', 'Grupo 4', 10, $j${"entrenamiento:A→B": "Pie es a zapato como mano es a…", "test_mutuo:B→A": "Mano es a guante como pie es a…"}$j$::jsonb, $j${"A→B": "guante", "B→A": "zapato"}$j$::jsonb, $j${"entrenamiento:A→B": ["guante", "brazo", "lanzar"], "test_mutuo:B→A": ["chutar", "zapato", "pierna"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A10', 'A', $j$Pie : zapato$j$, null from nueva union all select id, 'B10', 'B', $j$Mano : guante$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'), 'Clase 11', 'Grupo 4', 11, $j${"entrenamiento:A→B": "Pie es a pierna como mano es a…", "test_mutuo:B→A": "Mano es a brazo como pie es a…"}$j$::jsonb, $j${"A→B": "brazo", "B→A": "pierna"}$j$::jsonb, $j${"entrenamiento:A→B": ["lanzar", "brazo", "guante"], "test_mutuo:B→A": ["zapato", "chutar", "pierna"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A11', 'A', $j$Pie : pierna$j$, null from nueva union all select id, 'B11', 'B', $j$Mano : brazo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'), 'Clase 12', 'Grupo 4', 12, $j${"entrenamiento:A→B": "Pie es a chutar como mano es a…", "test_mutuo:B→A": "Mano es a lanzar como pie es a…"}$j$::jsonb, $j${"A→B": "lanzar", "B→A": "chutar"}$j$::jsonb, $j${"entrenamiento:A→B": ["guante", "brazo", "lanzar"], "test_mutuo:B→A": ["chutar", "pierna", "zapato"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A12', 'A', $j$Pie : chutar$j$, null from nueva union all select id, 'B12', 'B', $j$Mano : lanzar$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'), 'Clase 13', 'Grupo 5', 13, $j${"entrenamiento:A→B": "Coche es a carretera como barco es a…", "test_mutuo:B→A": "Barco es a mar como coche es a…"}$j$::jsonb, $j${"A→B": "mar", "B→A": "carretera"}$j$::jsonb, $j${"entrenamiento:A→B": ["puerto", "mar", "capitán"], "test_mutuo:B→A": ["conductor", "garaje", "carretera"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A13', 'A', $j$Coche : carretera$j$, null from nueva union all select id, 'B13', 'B', $j$Barco : mar$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'), 'Clase 14', 'Grupo 5', 14, $j${"entrenamiento:A→B": "Coche es a garaje como barco es a…", "test_mutuo:B→A": "Barco es a puerto como coche es a…"}$j$::jsonb, $j${"A→B": "puerto", "B→A": "garaje"}$j$::jsonb, $j${"entrenamiento:A→B": ["capitán", "mar", "puerto"], "test_mutuo:B→A": ["garaje", "carretera", "conductor"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A14', 'A', $j$Coche : garaje$j$, null from nueva union all select id, 'B14', 'B', $j$Barco : puerto$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'), 'Clase 15', 'Grupo 5', 15, $j${"entrenamiento:A→B": "Coche es a conductor como barco es a…", "test_mutuo:B→A": "Barco es a capitán como coche es a…"}$j$::jsonb, $j${"A→B": "capitán", "B→A": "conductor"}$j$::jsonb, $j${"entrenamiento:A→B": ["capitán", "mar", "puerto"], "test_mutuo:B→A": ["garaje", "conductor", "carretera"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A15', 'A', $j$Coche : conductor$j$, null from nueva union all select id, 'B15', 'B', $j$Barco : capitán$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'), 'Clase 16', 'Grupo 6', 16, $j${"entrenamiento:A→B": "Médico es a hospital como profesor es a…", "test_mutuo:B→A": "Profesor es a colegio como médico es a…"}$j$::jsonb, $j${"A→B": "colegio", "B→A": "hospital"}$j$::jsonb, $j${"entrenamiento:A→B": ["alumno", "enseñar", "colegio"], "test_mutuo:B→A": ["hospital", "curar", "paciente"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A16', 'A', $j$Médico : hospital$j$, null from nueva union all select id, 'B16', 'B', $j$Profesor : colegio$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'), 'Clase 17', 'Grupo 6', 17, $j${"entrenamiento:A→B": "Médico es a paciente como profesor es a…", "test_mutuo:B→A": "Profesor es a alumno como médico es a…"}$j$::jsonb, $j${"A→B": "alumno", "B→A": "paciente"}$j$::jsonb, $j${"entrenamiento:A→B": ["alumno", "enseñar", "colegio"], "test_mutuo:B→A": ["hospital", "paciente", "curar"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A17', 'A', $j$Médico : paciente$j$, null from nueva union all select id, 'B17', 'B', $j$Profesor : alumno$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'), 'Clase 18', 'Grupo 6', 18, $j${"entrenamiento:A→B": "Médico es a curar como profesor es a…", "test_mutuo:B→A": "Profesor es a enseñar como médico es a…"}$j$::jsonb, $j${"A→B": "enseñar", "B→A": "curar"}$j$::jsonb, $j${"entrenamiento:A→B": ["colegio", "enseñar", "alumno"], "test_mutuo:B→A": ["paciente", "hospital", "curar"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A18', 'A', $j$Médico : curar$j$, null from nueva union all select id, 'B18', 'B', $j$Profesor : enseñar$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'), 'Clase 19', 'Grupo 7', 19, $j${"entrenamiento:A→B": "Día es a sol como noche es a…", "test_mutuo:B→A": "Noche es a luna como día es a…"}$j$::jsonb, $j${"A→B": "luna", "B→A": "sol"}$j$::jsonb, $j${"entrenamiento:A→B": ["luna", "cena", "oscuro"], "test_mutuo:B→A": ["claro", "sol", "desayuno"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A19', 'A', $j$Día : sol$j$, null from nueva union all select id, 'B19', 'B', $j$Noche : luna$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'), 'Clase 20', 'Grupo 7', 20, $j${"entrenamiento:A→B": "Día es a desayuno como noche es a…", "test_mutuo:B→A": "Noche es a cena como día es a…"}$j$::jsonb, $j${"A→B": "cena", "B→A": "desayuno"}$j$::jsonb, $j${"entrenamiento:A→B": ["oscuro", "cena", "luna"], "test_mutuo:B→A": ["sol", "claro", "desayuno"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A20', 'A', $j$Día : desayuno$j$, null from nueva union all select id, 'B20', 'B', $j$Noche : cena$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'), 'Clase 21', 'Grupo 7', 21, $j${"entrenamiento:A→B": "Día es a claro como noche es a…", "test_mutuo:B→A": "Noche es a oscuro como día es a…"}$j$::jsonb, $j${"A→B": "oscuro", "B→A": "claro"}$j$::jsonb, $j${"entrenamiento:A→B": ["luna", "cena", "oscuro"], "test_mutuo:B→A": ["claro", "desayuno", "sol"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A21', 'A', $j$Día : claro$j$, null from nueva union all select id, 'B21', 'B', $j$Noche : oscuro$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'), 'Clase 22', 'Grupo 8', 22, $j${"entrenamiento:A→B": "Tren es a vía como avión es a…", "test_mutuo:B→A": "Avión es a cielo como tren es a…"}$j$::jsonb, $j${"A→B": "cielo", "B→A": "vía"}$j$::jsonb, $j${"entrenamiento:A→B": ["aeropuerto", "cielo", "piloto"], "test_mutuo:B→A": ["maquinista", "estación", "vía"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A22', 'A', $j$Tren : vía$j$, null from nueva union all select id, 'B22', 'B', $j$Avión : cielo$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'), 'Clase 23', 'Grupo 8', 23, $j${"entrenamiento:A→B": "Tren es a estación como avión es a…", "test_mutuo:B→A": "Avión es a aeropuerto como tren es a…"}$j$::jsonb, $j${"A→B": "aeropuerto", "B→A": "estación"}$j$::jsonb, $j${"entrenamiento:A→B": ["piloto", "cielo", "aeropuerto"], "test_mutuo:B→A": ["estación", "vía", "maquinista"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A23', 'A', $j$Tren : estación$j$, null from nueva union all select id, 'B23', 'B', $j$Avión : aeropuerto$j$, null from nueva;
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, orden, consignas, respuestas_esperadas, opciones_por_fase)
  values ((select id from programas_base where clinica_id is null and nombre = 'Completar Analogías Verbales'), 'Clase 24', 'Grupo 8', 24, $j${"entrenamiento:A→B": "Tren es a maquinista como avión es a…", "test_mutuo:B→A": "Avión es a piloto como tren es a…"}$j$::jsonb, $j${"A→B": "piloto", "B→A": "maquinista"}$j$::jsonb, $j${"entrenamiento:A→B": ["piloto", "cielo", "aeropuerto"], "test_mutuo:B→A": ["estación", "maquinista", "vía"]}$j$::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, 'A24', 'A', $j$Tren : maquinista$j$, null from nueva union all select id, 'B24', 'B', $j$Avión : piloto$j$, null from nueva;
update programas_base set objetivo = $t$El alumno completa analogías verbales eligiendo el término que mantiene la misma relación que el par base («Pájaro es a volar como pez es a…» → «nadar») y cambia su respuesta cuando cambia la relación del par base con el mismo término final («Pájaro es a nido como pez es a…» → «pecera»).$t$, materiales = $t$Grupos de 3 clases con 2 miembros. En cada grupo los dos términos son siempre los mismos (p. ej. pájaro y pez) y cada clase usa una relación distinta entre ellos (acción, casa, cubierta…):

A: Par base (ej. Pájaro : volar)
B: Par análogo (ej. Pez : nadar)

Las opciones de cada ensayo son las tres respuestas del grupo (nadar, pecera, escamas): todas tienen que ver con el término final, así que solo la relación del par base decide cuál es la correcta. Se dicen en voz alta (en la tableta, en audio y como botones de texto).$t$, instrucciones_terapeuta = $t$Requisito previo: el alumno ha superado "Abstraer Claves de Analogía" (dominio 4.2) y conoce las relaciones utilizadas: acciones y funciones (dominio 2.2), partes y lugares (ver "Vincular Mutuamente Relaciones Jerárquicas" del dominio 3.6) y opuestos (ver "Vincular Mutuamente Relaciones de Oposición" del dominio 3.2).

Por qué se hace así: una analogía de cuatro términos se puede «acertar» mirando solo el último término (Carpentier, Smeets, Barnes-Holmes y Stewart, 2004): ante «pez es a…», «nadar» sale por asociación sin relacionar nada. Por eso cada grupo repite los mismos términos con tres relaciones distintas y las tres respuestas aparecen siempre como opciones: elegir bien exige relacionar la relación del par base con la del par análogo, que es lo que define la analogía en RFT (Ruiz y Luciano, 2011).

Fase 1 - Entrenamiento directo (completar el par análogo):

1. Diga la analogía incompleta de la clase ("Pájaro es a volar como pez es a…") y las tres opciones del grupo.
2. Alterne las tres clases del grupo dentro del bloque: el mismo término final pide respuestas distintas según el par base.
3. Si el alumno elige otra respuesta del grupo, responde al término final sin atender al par base (anótelo en las notas del bloque). Ayuda: repetir el par base resaltando la relación ("El pájaro VUELA. ¿Y el pez?").
4. Refuerce las respuestas correctas hasta alcanzar el criterio de dominio.

Fase 2 - Test de Vinculación Mutua (orden invertido), sin entrenamiento directo:

1. Invierta los pares ("Pez es a nadar como pájaro es a…") con las tres respuestas del par base como opciones.
2. No refuerce diferencialmente durante estos ensayos, pero registre la respuesta.

Generalización (sondas): grupos nuevos con otros términos y preguntas por la relación compartida ("¿Qué tienen en común pájaro–volar y pez–nadar?").

Realice el primer bloque de cada test sin ayudas. Si el alumno alcanza el criterio, la relación se considera DERIVADA; si se enseña con ayudas, quedará registrada como DOMINADA (no derivada), aunque el último bloque se realice sin ayudas.

Registro en la app (fase · posición origen → destino):
- Entrenamiento: A → B (completar el par análogo)
- Test de vínculo mutuo: B → A (completar el par base con el orden invertido)
Las sondas con los mismos estímulos en otro contexto o con otra persona se registran con las mismas posiciones, eligiendo "Sonda de generalización" como tipo de bloque una vez dominada la combinación.$t$, tipo_respuesta = 'opciones', opciones_respuesta = null, respuesta_por_fase = '{}'::jsonb, contenido_actualizado_at = now() where clinica_id is null and nombre = 'Completar Analogías Verbales';
commit;
