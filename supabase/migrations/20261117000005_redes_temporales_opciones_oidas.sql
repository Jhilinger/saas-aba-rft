-- Derivar Relaciones Temporales en Redes Combinatorias: 8 grupos de 3 clases con 3 miembros; las opciones son los tres
-- miembros de la clase, en audio; test combinatorio con las dos premisas en la clave.

begin;

delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias');

with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'), 'Clase 1', 'Grupo 1', '{"entrenamiento:B→A": "Pim recorta antes de leer. ¿Qué hace Pim antes de leer?", "entrenamiento:C→B": "Pim lee antes de abrazar. ¿Qué hace Pim antes de abrazar?", "test_mutuo:A→B": "Pim recorta antes de leer. ¿Qué hace Pim después de recortar?", "test_mutuo:B→C": "Pim lee antes de abrazar. ¿Qué hace Pim después de leer?", "test_combinatorio:C→A": "Pim recorta antes de leer. Pim lee antes de abrazar. ¿Qué hace Pim antes, recortar o abrazar?", "test_combinatorio:A→C": "Pim recorta antes de leer. Pim lee antes de abrazar. ¿Qué hace Pim después, recortar o abrazar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A1', 'A', 'Recorta', 'acciones/cortar'),
  ('B1', 'B', 'Lee', 'acciones/leer'),
  ('C1', 'C', 'Abraza', 'acciones/abrazar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'), 'Clase 2', 'Grupo 1', '{"entrenamiento:B→A": "Tok se peina después de correr. ¿Qué hace Tok después de correr?", "entrenamiento:C→B": "Tok corre después de montar en bici. ¿Qué hace Tok después de montar en bici?", "test_mutuo:A→B": "Tok se peina después de correr. ¿Qué hace Tok antes de peinarse?", "test_mutuo:B→C": "Tok corre después de montar en bici. ¿Qué hace Tok antes de correr?", "test_combinatorio:C→A": "Tok se peina después de correr. Tok corre después de montar en bici. ¿Qué hace Tok después, peinarse o montar en bici?", "test_combinatorio:A→C": "Tok se peina después de correr. Tok corre después de montar en bici. ¿Qué hace Tok antes, peinarse o montar en bici?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A2', 'A', 'Se peina', 'acciones/peinarse'),
  ('B2', 'B', 'Corre', 'acciones/correr'),
  ('C2', 'C', 'Monta en bici', 'acciones/montar-en-bici')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'), 'Clase 3', 'Grupo 1', '{"entrenamiento:B→A": "Antes de jugar, Lu barre. ¿Qué hace Lu antes de jugar?", "entrenamiento:C→B": "Antes de saltar, Lu juega. ¿Qué hace Lu antes de saltar?", "test_mutuo:A→B": "Antes de jugar, Lu barre. ¿Qué hace Lu después de barrer?", "test_mutuo:B→C": "Antes de saltar, Lu juega. ¿Qué hace Lu después de jugar?", "test_combinatorio:C→A": "Antes de jugar, Lu barre. Antes de saltar, Lu juega. ¿Qué hace Lu antes, saltar o barrer?", "test_combinatorio:A→C": "Antes de jugar, Lu barre. Antes de saltar, Lu juega. ¿Qué hace Lu después, saltar o barrer?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A3', 'A', 'Barre', 'acciones/barrer'),
  ('B3', 'B', 'Juega', 'acciones/jugar'),
  ('C3', 'C', 'Salta', 'acciones/saltar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'), 'Clase 4', 'Grupo 2', '{"entrenamiento:B→A": "Después de abrazar, Mo corre. ¿Qué hace Mo después de abrazar?", "entrenamiento:C→B": "Después de cocinar, Mo abraza. ¿Qué hace Mo después de cocinar?", "test_mutuo:A→B": "Después de abrazar, Mo corre. ¿Qué hace Mo antes de correr?", "test_mutuo:B→C": "Después de cocinar, Mo abraza. ¿Qué hace Mo antes de abrazar?", "test_combinatorio:C→A": "Después de abrazar, Mo corre. Después de cocinar, Mo abraza. ¿Qué hace Mo después, cocinar o correr?", "test_combinatorio:A→C": "Después de abrazar, Mo corre. Después de cocinar, Mo abraza. ¿Qué hace Mo antes, cocinar o correr?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A4', 'A', 'Corre', 'acciones/correr'),
  ('B4', 'B', 'Abraza', 'acciones/abrazar'),
  ('C4', 'C', 'Cocina', 'acciones/cocinar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'), 'Clase 5', 'Grupo 2', '{"entrenamiento:B→A": "Kiri salta antes de beber. ¿Qué hace Kiri antes de beber?", "entrenamiento:C→B": "Kiri bebe antes de bailar. ¿Qué hace Kiri antes de bailar?", "test_mutuo:A→B": "Kiri salta antes de beber. ¿Qué hace Kiri después de saltar?", "test_mutuo:B→C": "Kiri bebe antes de bailar. ¿Qué hace Kiri después de beber?", "test_combinatorio:C→A": "Kiri bebe antes de bailar. Kiri salta antes de beber. ¿Qué hace Kiri antes, saltar o bailar?", "test_combinatorio:A→C": "Kiri bebe antes de bailar. Kiri salta antes de beber. ¿Qué hace Kiri después, saltar o bailar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A5', 'A', 'Salta', 'acciones/saltar'),
  ('B5', 'B', 'Bebe', 'acciones/beber'),
  ('C5', 'C', 'Baila', 'acciones/bailar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'), 'Clase 6', 'Grupo 2', '{"entrenamiento:B→A": "Dax pinta después de montar en bici. ¿Qué hace Dax después de montar en bici?", "entrenamiento:C→B": "Dax monta en bici después de aplaudir. ¿Qué hace Dax después de aplaudir?", "test_mutuo:A→B": "Dax pinta después de montar en bici. ¿Qué hace Dax antes de pintar?", "test_mutuo:B→C": "Dax monta en bici después de aplaudir. ¿Qué hace Dax antes de montar en bici?", "test_combinatorio:C→A": "Dax monta en bici después de aplaudir. Dax pinta después de montar en bici. ¿Qué hace Dax después, pintar o aplaudir?", "test_combinatorio:A→C": "Dax monta en bici después de aplaudir. Dax pinta después de montar en bici. ¿Qué hace Dax antes, pintar o aplaudir?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A6', 'A', 'Pinta', 'acciones/pintar'),
  ('B6', 'B', 'Monta en bici', 'acciones/montar-en-bici'),
  ('C6', 'C', 'Aplaude', 'acciones/aplaudir')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'), 'Clase 7', 'Grupo 3', '{"entrenamiento:B→A": "Antes de pintar, Bo bebe. ¿Qué hace Bo antes de pintar?", "entrenamiento:C→B": "Antes de subir las escaleras, Bo pinta. ¿Qué hace Bo antes de subir las escaleras?", "test_mutuo:A→B": "Antes de pintar, Bo bebe. ¿Qué hace Bo después de beber?", "test_mutuo:B→C": "Antes de subir las escaleras, Bo pinta. ¿Qué hace Bo después de pintar?", "test_combinatorio:C→A": "Antes de subir las escaleras, Bo pinta. Antes de pintar, Bo bebe. ¿Qué hace Bo antes, subir las escaleras o beber?", "test_combinatorio:A→C": "Antes de subir las escaleras, Bo pinta. Antes de pintar, Bo bebe. ¿Qué hace Bo después, subir las escaleras o beber?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A7', 'A', 'Bebe', 'acciones/beber'),
  ('B7', 'B', 'Pinta', 'acciones/pintar'),
  ('C7', 'C', 'Sube las escaleras', 'acciones/subir-escaleras')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'), 'Clase 8', 'Grupo 3', '{"entrenamiento:B→A": "Después de abrazar, Fi baila. ¿Qué hace Fi después de abrazar?", "entrenamiento:C→B": "Después de peinarse, Fi abraza. ¿Qué hace Fi después de peinarse?", "test_mutuo:A→B": "Después de abrazar, Fi baila. ¿Qué hace Fi antes de bailar?", "test_mutuo:B→C": "Después de peinarse, Fi abraza. ¿Qué hace Fi antes de abrazar?", "test_combinatorio:C→A": "Después de peinarse, Fi abraza. Después de abrazar, Fi baila. ¿Qué hace Fi después, peinarse o bailar?", "test_combinatorio:A→C": "Después de peinarse, Fi abraza. Después de abrazar, Fi baila. ¿Qué hace Fi antes, peinarse o bailar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A8', 'A', 'Baila', 'acciones/bailar'),
  ('B8', 'B', 'Abraza', 'acciones/abrazar'),
  ('C8', 'C', 'Se peina', 'acciones/peinarse')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'), 'Clase 9', 'Grupo 3', '{"entrenamiento:B→A": "Pim barre antes de leer. ¿Qué hace Pim antes de leer?", "entrenamiento:C→B": "Pim lee antes de soplar. ¿Qué hace Pim antes de soplar?", "test_mutuo:A→B": "Pim barre antes de leer. ¿Qué hace Pim después de barrer?", "test_mutuo:B→C": "Pim lee antes de soplar. ¿Qué hace Pim después de leer?", "test_combinatorio:C→A": "Pim barre antes de leer. Pim lee antes de soplar. ¿Qué hace Pim antes, soplar o barrer?", "test_combinatorio:A→C": "Pim barre antes de leer. Pim lee antes de soplar. ¿Qué hace Pim después, soplar o barrer?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A9', 'A', 'Barre', 'acciones/barrer'),
  ('B9', 'B', 'Lee', 'acciones/leer'),
  ('C9', 'C', 'Sopla', 'acciones/soplar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'), 'Clase 10', 'Grupo 4', '{"entrenamiento:B→A": "Tok baila después de jugar. ¿Qué hace Tok después de jugar?", "entrenamiento:C→B": "Tok juega después de escribir. ¿Qué hace Tok después de escribir?", "test_mutuo:A→B": "Tok baila después de jugar. ¿Qué hace Tok antes de bailar?", "test_mutuo:B→C": "Tok juega después de escribir. ¿Qué hace Tok antes de jugar?", "test_combinatorio:C→A": "Tok baila después de jugar. Tok juega después de escribir. ¿Qué hace Tok después, escribir o bailar?", "test_combinatorio:A→C": "Tok baila después de jugar. Tok juega después de escribir. ¿Qué hace Tok antes, escribir o bailar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A10', 'A', 'Baila', 'acciones/bailar'),
  ('B10', 'B', 'Juega', 'acciones/jugar'),
  ('C10', 'C', 'Escribe', 'acciones/escribir')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'), 'Clase 11', 'Grupo 4', '{"entrenamiento:B→A": "Antes de saltar, Lu se peina. ¿Qué hace Lu antes de saltar?", "entrenamiento:C→B": "Antes de pintar, Lu salta. ¿Qué hace Lu antes de pintar?", "test_mutuo:A→B": "Antes de saltar, Lu se peina. ¿Qué hace Lu después de peinarse?", "test_mutuo:B→C": "Antes de pintar, Lu salta. ¿Qué hace Lu después de saltar?", "test_combinatorio:C→A": "Antes de saltar, Lu se peina. Antes de pintar, Lu salta. ¿Qué hace Lu antes, peinarse o pintar?", "test_combinatorio:A→C": "Antes de saltar, Lu se peina. Antes de pintar, Lu salta. ¿Qué hace Lu después, peinarse o pintar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A11', 'A', 'Se peina', 'acciones/peinarse'),
  ('B11', 'B', 'Salta', 'acciones/saltar'),
  ('C11', 'C', 'Pinta', 'acciones/pintar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'), 'Clase 12', 'Grupo 4', '{"entrenamiento:B→A": "Después de montar en bici, Mo abraza. ¿Qué hace Mo después de montar en bici?", "entrenamiento:C→B": "Después de cantar, Mo monta en bici. ¿Qué hace Mo después de cantar?", "test_mutuo:A→B": "Después de montar en bici, Mo abraza. ¿Qué hace Mo antes de abrazar?", "test_mutuo:B→C": "Después de cantar, Mo monta en bici. ¿Qué hace Mo antes de montar en bici?", "test_combinatorio:C→A": "Después de montar en bici, Mo abraza. Después de cantar, Mo monta en bici. ¿Qué hace Mo después, abrazar o cantar?", "test_combinatorio:A→C": "Después de montar en bici, Mo abraza. Después de cantar, Mo monta en bici. ¿Qué hace Mo antes, abrazar o cantar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A12', 'A', 'Abraza', 'acciones/abrazar'),
  ('B12', 'B', 'Monta en bici', 'acciones/montar-en-bici'),
  ('C12', 'C', 'Canta', 'acciones/cantar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'), 'Clase 13', 'Grupo 5', '{"entrenamiento:B→A": "Kiri pinta antes de escribir. ¿Qué hace Kiri antes de escribir?", "entrenamiento:C→B": "Kiri escribe antes de leer. ¿Qué hace Kiri antes de leer?", "test_mutuo:A→B": "Kiri pinta antes de escribir. ¿Qué hace Kiri después de pintar?", "test_mutuo:B→C": "Kiri escribe antes de leer. ¿Qué hace Kiri después de escribir?", "test_combinatorio:C→A": "Kiri escribe antes de leer. Kiri pinta antes de escribir. ¿Qué hace Kiri antes, leer o pintar?", "test_combinatorio:A→C": "Kiri escribe antes de leer. Kiri pinta antes de escribir. ¿Qué hace Kiri después, leer o pintar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A13', 'A', 'Pinta', 'acciones/pintar'),
  ('B13', 'B', 'Escribe', 'acciones/escribir'),
  ('C13', 'C', 'Lee', 'acciones/leer')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'), 'Clase 14', 'Grupo 5', '{"entrenamiento:B→A": "Dax canta después de beber. ¿Qué hace Dax después de beber?", "entrenamiento:C→B": "Dax bebe después de jugar. ¿Qué hace Dax después de jugar?", "test_mutuo:A→B": "Dax canta después de beber. ¿Qué hace Dax antes de cantar?", "test_mutuo:B→C": "Dax bebe después de jugar. ¿Qué hace Dax antes de beber?", "test_combinatorio:C→A": "Dax bebe después de jugar. Dax canta después de beber. ¿Qué hace Dax después, jugar o cantar?", "test_combinatorio:A→C": "Dax bebe después de jugar. Dax canta después de beber. ¿Qué hace Dax antes, jugar o cantar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A14', 'A', 'Canta', 'acciones/cantar'),
  ('B14', 'B', 'Bebe', 'acciones/beber'),
  ('C14', 'C', 'Juega', 'acciones/jugar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'), 'Clase 15', 'Grupo 5', '{"entrenamiento:B→A": "Antes de cocinar, Bo sube las escaleras. ¿Qué hace Bo antes de cocinar?", "entrenamiento:C→B": "Antes de saltar, Bo cocina. ¿Qué hace Bo antes de saltar?", "test_mutuo:A→B": "Antes de cocinar, Bo sube las escaleras. ¿Qué hace Bo después de subir las escaleras?", "test_mutuo:B→C": "Antes de saltar, Bo cocina. ¿Qué hace Bo después de cocinar?", "test_combinatorio:C→A": "Antes de saltar, Bo cocina. Antes de cocinar, Bo sube las escaleras. ¿Qué hace Bo antes, subir las escaleras o saltar?", "test_combinatorio:A→C": "Antes de saltar, Bo cocina. Antes de cocinar, Bo sube las escaleras. ¿Qué hace Bo después, subir las escaleras o saltar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A15', 'A', 'Sube las escaleras', 'acciones/subir-escaleras'),
  ('B15', 'B', 'Cocina', 'acciones/cocinar'),
  ('C15', 'C', 'Salta', 'acciones/saltar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'), 'Clase 16', 'Grupo 6', '{"entrenamiento:B→A": "Después de cocinar, Fi pinta. ¿Qué hace Fi después de cocinar?", "entrenamiento:C→B": "Después de soplar, Fi cocina. ¿Qué hace Fi después de soplar?", "test_mutuo:A→B": "Después de cocinar, Fi pinta. ¿Qué hace Fi antes de pintar?", "test_mutuo:B→C": "Después de soplar, Fi cocina. ¿Qué hace Fi antes de cocinar?", "test_combinatorio:C→A": "Después de soplar, Fi cocina. Después de cocinar, Fi pinta. ¿Qué hace Fi después, pintar o soplar?", "test_combinatorio:A→C": "Después de soplar, Fi cocina. Después de cocinar, Fi pinta. ¿Qué hace Fi antes, pintar o soplar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A16', 'A', 'Pinta', 'acciones/pintar'),
  ('B16', 'B', 'Cocina', 'acciones/cocinar'),
  ('C16', 'C', 'Sopla', 'acciones/soplar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'), 'Clase 17', 'Grupo 6', '{"entrenamiento:B→A": "Pim bebe antes de peinarse. ¿Qué hace Pim antes de peinarse?", "entrenamiento:C→B": "Pim se peina antes de barrer. ¿Qué hace Pim antes de barrer?", "test_mutuo:A→B": "Pim bebe antes de peinarse. ¿Qué hace Pim después de beber?", "test_mutuo:B→C": "Pim se peina antes de barrer. ¿Qué hace Pim después de peinarse?", "test_combinatorio:C→A": "Pim bebe antes de peinarse. Pim se peina antes de barrer. ¿Qué hace Pim antes, beber o barrer?", "test_combinatorio:A→C": "Pim bebe antes de peinarse. Pim se peina antes de barrer. ¿Qué hace Pim después, beber o barrer?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A17', 'A', 'Bebe', 'acciones/beber'),
  ('B17', 'B', 'Se peina', 'acciones/peinarse'),
  ('C17', 'C', 'Barre', 'acciones/barrer')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'), 'Clase 18', 'Grupo 6', '{"entrenamiento:B→A": "Tok sube las escaleras después de recortar. ¿Qué hace Tok después de recortar?", "entrenamiento:C→B": "Tok recorta después de jugar. ¿Qué hace Tok después de jugar?", "test_mutuo:A→B": "Tok sube las escaleras después de recortar. ¿Qué hace Tok antes de subir las escaleras?", "test_mutuo:B→C": "Tok recorta después de jugar. ¿Qué hace Tok antes de recortar?", "test_combinatorio:C→A": "Tok sube las escaleras después de recortar. Tok recorta después de jugar. ¿Qué hace Tok después, subir las escaleras o jugar?", "test_combinatorio:A→C": "Tok sube las escaleras después de recortar. Tok recorta después de jugar. ¿Qué hace Tok antes, subir las escaleras o jugar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A18', 'A', 'Sube las escaleras', 'acciones/subir-escaleras'),
  ('B18', 'B', 'Recorta', 'acciones/cortar'),
  ('C18', 'C', 'Juega', 'acciones/jugar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'), 'Clase 19', 'Grupo 7', '{"entrenamiento:B→A": "Antes de jugar, Lu cocina. ¿Qué hace Lu antes de jugar?", "entrenamiento:C→B": "Antes de montar en bici, Lu juega. ¿Qué hace Lu antes de montar en bici?", "test_mutuo:A→B": "Antes de jugar, Lu cocina. ¿Qué hace Lu después de cocinar?", "test_mutuo:B→C": "Antes de montar en bici, Lu juega. ¿Qué hace Lu después de jugar?", "test_combinatorio:C→A": "Antes de jugar, Lu cocina. Antes de montar en bici, Lu juega. ¿Qué hace Lu antes, montar en bici o cocinar?", "test_combinatorio:A→C": "Antes de jugar, Lu cocina. Antes de montar en bici, Lu juega. ¿Qué hace Lu después, montar en bici o cocinar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A19', 'A', 'Cocina', 'acciones/cocinar'),
  ('B19', 'B', 'Juega', 'acciones/jugar'),
  ('C19', 'C', 'Monta en bici', 'acciones/montar-en-bici')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'), 'Clase 20', 'Grupo 7', '{"entrenamiento:B→A": "Después de aplaudir, Mo canta. ¿Qué hace Mo después de aplaudir?", "entrenamiento:C→B": "Después de leer, Mo aplaude. ¿Qué hace Mo después de leer?", "test_mutuo:A→B": "Después de aplaudir, Mo canta. ¿Qué hace Mo antes de cantar?", "test_mutuo:B→C": "Después de leer, Mo aplaude. ¿Qué hace Mo antes de aplaudir?", "test_combinatorio:C→A": "Después de aplaudir, Mo canta. Después de leer, Mo aplaude. ¿Qué hace Mo después, leer o cantar?", "test_combinatorio:A→C": "Después de aplaudir, Mo canta. Después de leer, Mo aplaude. ¿Qué hace Mo antes, leer o cantar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A20', 'A', 'Canta', 'acciones/cantar'),
  ('B20', 'B', 'Aplaude', 'acciones/aplaudir'),
  ('C20', 'C', 'Lee', 'acciones/leer')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'), 'Clase 21', 'Grupo 7', '{"entrenamiento:B→A": "Kiri recorta antes de pintar. ¿Qué hace Kiri antes de pintar?", "entrenamiento:C→B": "Kiri pinta antes de barrer. ¿Qué hace Kiri antes de barrer?", "test_mutuo:A→B": "Kiri recorta antes de pintar. ¿Qué hace Kiri después de recortar?", "test_mutuo:B→C": "Kiri pinta antes de barrer. ¿Qué hace Kiri después de pintar?", "test_combinatorio:C→A": "Kiri pinta antes de barrer. Kiri recorta antes de pintar. ¿Qué hace Kiri antes, recortar o barrer?", "test_combinatorio:A→C": "Kiri pinta antes de barrer. Kiri recorta antes de pintar. ¿Qué hace Kiri después, recortar o barrer?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A21', 'A', 'Recorta', 'acciones/cortar'),
  ('B21', 'B', 'Pinta', 'acciones/pintar'),
  ('C21', 'C', 'Barre', 'acciones/barrer')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'), 'Clase 22', 'Grupo 8', '{"entrenamiento:B→A": "Dax barre después de bailar. ¿Qué hace Dax después de bailar?", "entrenamiento:C→B": "Dax baila después de cocinar. ¿Qué hace Dax después de cocinar?", "test_mutuo:A→B": "Dax barre después de bailar. ¿Qué hace Dax antes de barrer?", "test_mutuo:B→C": "Dax baila después de cocinar. ¿Qué hace Dax antes de bailar?", "test_combinatorio:C→A": "Dax baila después de cocinar. Dax barre después de bailar. ¿Qué hace Dax después, barrer o cocinar?", "test_combinatorio:A→C": "Dax baila después de cocinar. Dax barre después de bailar. ¿Qué hace Dax antes, barrer o cocinar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A22', 'A', 'Barre', 'acciones/barrer'),
  ('B22', 'B', 'Baila', 'acciones/bailar'),
  ('C22', 'C', 'Cocina', 'acciones/cocinar')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'), 'Clase 23', 'Grupo 8', '{"entrenamiento:B→A": "Antes de cantar, Bo sube las escaleras. ¿Qué hace Bo antes de cantar?", "entrenamiento:C→B": "Antes de peinarse, Bo canta. ¿Qué hace Bo antes de peinarse?", "test_mutuo:A→B": "Antes de cantar, Bo sube las escaleras. ¿Qué hace Bo después de subir las escaleras?", "test_mutuo:B→C": "Antes de peinarse, Bo canta. ¿Qué hace Bo después de cantar?", "test_combinatorio:C→A": "Antes de peinarse, Bo canta. Antes de cantar, Bo sube las escaleras. ¿Qué hace Bo antes, peinarse o subir las escaleras?", "test_combinatorio:A→C": "Antes de peinarse, Bo canta. Antes de cantar, Bo sube las escaleras. ¿Qué hace Bo después, peinarse o subir las escaleras?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A23', 'A', 'Sube las escaleras', 'acciones/subir-escaleras'),
  ('B23', 'B', 'Canta', 'acciones/cantar'),
  ('C23', 'C', 'Se peina', 'acciones/peinarse')) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias'), 'Clase 24', 'Grupo 8', '{"entrenamiento:B→A": "Después de correr, Fi sopla. ¿Qué hace Fi después de correr?", "entrenamiento:C→B": "Después de aplaudir, Fi corre. ¿Qué hace Fi después de aplaudir?", "test_mutuo:A→B": "Después de correr, Fi sopla. ¿Qué hace Fi antes de soplar?", "test_mutuo:B→C": "Después de aplaudir, Fi corre. ¿Qué hace Fi antes de correr?", "test_combinatorio:C→A": "Después de aplaudir, Fi corre. Después de correr, Fi sopla. ¿Qué hace Fi después, aplaudir o soplar?", "test_combinatorio:A→C": "Después de aplaudir, Fi corre. Después de correr, Fi sopla. ¿Qué hace Fi antes, aplaudir o soplar?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A24', 'A', 'Sopla', 'acciones/soplar'),
  ('B24', 'B', 'Corre', 'acciones/correr'),
  ('C24', 'C', 'Aplaude', 'acciones/aplaudir')) x(etiqueta, posicion, nombre, concepto);

update programas_base set
  opciones_clase = true,
  consignas = null,
  objetivo = 'A partir de dos relaciones temporales encadenadas enunciadas verbalmente ("Pim recorta antes de leer"; "Pim lee antes de abrazar"), el alumno deriva la relación entre los extremos ("¿Qué hace Pim antes, recortar o abrazar?" → Recorta), tanto si las relaciones se enuncian con «antes» como con «después».',
  materiales = 'Grupos de 3 (o más) clases con 3 miembros:

A: La acción hacia la que apunta la relación enunciada (la primera si se dice «antes», la última si se dice «después»)
B: La acción intermedia
C: La otra acción del extremo

Personajes inventados (Pim, Tok, Lu…) y acciones sin orden habitual entre ellas, de forma que la respuesta no pueda basarse en rutinas conocidas; ningún par de acciones se repite en dos clases. Las imágenes de las acciones sirven al terapeuta; la relación se presenta solo de forma verbal. Las opciones son las tres acciones, dichas una a una (en la tableta, tarjetas de audio). Contrapesos: la mitad de las clases se enuncian con «antes» y la otra mitad con «después»; en la mitad la frase va en orden invertido («Antes de leer, Pim recorta»); en el test combinatorio, la mitad de las clases dicen las premisas en orden inverso y se alterna el orden de los extremos en la pregunta.',
  instrucciones_terapeuta = '
Requisito previo: el alumno ha superado "Vincular Mutuamente Relaciones Temporales" (dominio 3.5).

Opciones de respuesta: en cada ensayo, diga uno a uno los tres miembros de la red («Recorta», «Lee», «Abraza»); el alumno elige uno. Al estar siempre los tres, el miembro que no corresponde actúa como distractor y no hace falta añadir ninguno de otra clase.

Fase 1 - Entrenamiento (A–B y B–C por separado):

1. Enuncie una sola relación y pregunte en el sentido enunciado ("Pim recorta antes de leer. ¿Qué hace Pim antes de leer?").
2. No mencione nunca A y C en la misma relación durante el entrenamiento.
3. Refuerce hasta alcanzar el criterio de dominio en ambas relaciones y realice después un bloque de mantenimiento con ambas mezcladas.

Fase 2 - Test de Vinculación Mutua (sentido inverso de cada par), sin entrenamiento directo: "Pim recorta antes de leer. ¿Qué hace Pim después de recortar?". No refuerce diferencialmente durante estos ensayos (evite dar pistas de si es correcto o incorrecto), pero registre la respuesta.

Fase 3 - Test de Vinculación Combinatoria (A ↔ C), sin entrenamiento directo:

1. Diga las dos premisas seguidas y pregunte por los extremos: "Pim recorta antes de leer. Pim lee antes de abrazar. ¿Qué hace Pim antes, recortar o abrazar?" y "… ¿Qué hace Pim después, recortar o abrazar?".
2. Si quiere, pregunte también "¿Qué hace primero de todo?" y "¿Qué hace al final?", y regístrelas con "+ Ensayo de control" (no cuentan para el porcentaje ni el dominio).
3. No refuerce diferencialmente durante estos ensayos (evite dar pistas de si es correcto o incorrecto), pero registre la respuesta.
4. Elegir B (la intermedia) indica que no integra las dos premisas.

Generalización (sondas): tras la respuesta verbal, pida al alumno que ordene las tres acciones con viñetas.

Realice el primer bloque de cada test sin ayudas. Si el alumno alcanza el criterio, la relación se considera DERIVADA; si se enseña con ayudas, quedará registrada como DOMINADA (no derivada), aunque el último bloque se realice sin ayudas.

Registro en la app (fase · posición origen → destino; el destino es la respuesta correcta):
- Entrenamiento: B → A ("¿Qué hace Pim antes de leer?") y C → B ("¿Qué hace Pim antes de abrazar?")
- Test de vínculo mutuo: A → B ("¿Qué hace Pim después de recortar?") y B → C ("¿Qué hace Pim después de leer?")
- Test de vínculo combinatorio: C → A ("¿Qué hace Pim antes, recortar o abrazar?") y A → C ("¿Qué hace Pim después, recortar o abrazar?")
Las sondas con los mismos estímulos en otro contexto o con otra persona se registran con las mismas posiciones, eligiendo "Sonda de generalización" como tipo de bloque una vez dominada la combinación.

Grupos de estímulos: los grupos y clases de este programa son un ejemplo. Cree en el PEI del alumno tantos grupos como considere oportuno, incluido un grupo de generalización con estímulos nuevos. En ese grupo, el primer bloque de entrenamiento realizado sin ayudas y sin reforzar diferencialmente funciona como sonda: si el alumno alcanza el criterio a la primera, hay generalización a estímulos nuevos (anótelo en las notas del bloque). Los tests de ese grupo se habilitan cuando su entrenamiento está dominado. Las sondas con los mismos estímulos en otro contexto o con otra persona se registran como "Sonda de generalización" en el grupo ya dominado.'
where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias';

commit;
