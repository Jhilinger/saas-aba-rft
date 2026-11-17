-- Derivar Relaciones Causales en Redes Combinatorias: 8 grupos de 3 clases con 3 miembros; las opciones son los tres
-- miembros de la clase, en audio; test combinatorio con las dos premisas en la clave.

begin;

delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias');

with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'), 'Clase 1', 'Grupo 1', '{"entrenamiento:A→B": "Si el pájaro Tiko canta, sale el sol. ¿Qué pasa si el pájaro Tiko canta?", "entrenamiento:B→C": "Si sale el sol, las flores se abren. ¿Qué pasa si sale el sol?", "test_mutuo:B→A": "Si el pájaro Tiko canta, sale el sol. ¿Por qué sale el sol?", "test_mutuo:C→B": "Si sale el sol, las flores se abren. ¿Por qué se abren las flores?", "test_combinatorio:A→C": "Si el pájaro Tiko canta, sale el sol. Si sale el sol, las flores se abren. Si el pájaro Tiko canta, ¿qué pasa al final?", "test_combinatorio:C→A": "Si el pájaro Tiko canta, sale el sol. Si sale el sol, las flores se abren. ¿Qué tiene que pasar primero para que se abran las flores?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A1', 'A', 'El pájaro Tiko canta', null),
  ('B1', 'B', 'Sale el sol', null),
  ('C1', 'C', 'Las flores se abren', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'), 'Clase 2', 'Grupo 1', '{"entrenamiento:A→B": "Cuando se pulsa el botón Rom, se enciende el ventilador. ¿Qué pasa cuando se pulsa el botón Rom?", "entrenamiento:B→C": "Cuando se enciende el ventilador, los papeles vuelan. ¿Qué pasa cuando se enciende el ventilador?", "test_mutuo:B→A": "Cuando se pulsa el botón Rom, se enciende el ventilador. ¿Por qué se enciende el ventilador?", "test_mutuo:C→B": "Cuando se enciende el ventilador, los papeles vuelan. ¿Por qué vuelan los papeles?", "test_combinatorio:A→C": "Cuando se pulsa el botón Rom, se enciende el ventilador. Cuando se enciende el ventilador, los papeles vuelan. Cuando se pulsa el botón Rom, ¿qué pasa al final?", "test_combinatorio:C→A": "Cuando se pulsa el botón Rom, se enciende el ventilador. Cuando se enciende el ventilador, los papeles vuelan. ¿Qué tiene que pasar primero para que vuelen los papeles?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A2', 'A', 'Se pulsa el botón Rom', null),
  ('B2', 'B', 'Se enciende el ventilador', null),
  ('C2', 'C', 'Los papeles vuelan', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'), 'Clase 3', 'Grupo 1', '{"entrenamiento:A→B": "El perro ladra si el gato Mifu maúlla. ¿Qué pasa si el gato Mifu maúlla?", "entrenamiento:B→C": "El bebé se despierta si el perro ladra. ¿Qué pasa si el perro ladra?", "test_mutuo:B→A": "El perro ladra si el gato Mifu maúlla. ¿Por qué ladra el perro?", "test_mutuo:C→B": "El bebé se despierta si el perro ladra. ¿Por qué se despierta el bebé?", "test_combinatorio:A→C": "El perro ladra si el gato Mifu maúlla. El bebé se despierta si el perro ladra. Si el gato Mifu maúlla, ¿qué pasa al final?", "test_combinatorio:C→A": "El perro ladra si el gato Mifu maúlla. El bebé se despierta si el perro ladra. ¿Qué tiene que pasar primero para que se despierte el bebé?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A3', 'A', 'El gato Mifu maúlla', null),
  ('B3', 'B', 'El perro ladra', null),
  ('C3', 'C', 'El bebé se despierta', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'), 'Clase 4', 'Grupo 2', '{"entrenamiento:A→B": "Empieza a llover cuando la rana Pipo salta. ¿Qué pasa cuando la rana Pipo salta?", "entrenamiento:B→C": "El suelo se moja cuando empieza a llover. ¿Qué pasa cuando empieza a llover?", "test_mutuo:B→A": "Empieza a llover cuando la rana Pipo salta. ¿Por qué empieza a llover?", "test_mutuo:C→B": "El suelo se moja cuando empieza a llover. ¿Por qué se moja el suelo?", "test_combinatorio:A→C": "Empieza a llover cuando la rana Pipo salta. El suelo se moja cuando empieza a llover. Cuando la rana Pipo salta, ¿qué pasa al final?", "test_combinatorio:C→A": "Empieza a llover cuando la rana Pipo salta. El suelo se moja cuando empieza a llover. ¿Qué tiene que pasar primero para que se moje el suelo?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A4', 'A', 'La rana Pipo salta', null),
  ('B4', 'B', 'Empieza a llover', null),
  ('C4', 'C', 'El suelo se moja', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'), 'Clase 5', 'Grupo 2', '{"entrenamiento:A→B": "Si suena la campana Tin, se apaga la luz. ¿Qué pasa si suena la campana Tin?", "entrenamiento:B→C": "Si se apaga la luz, la habitación se queda a oscuras. ¿Qué pasa si se apaga la luz?", "test_mutuo:B→A": "Si suena la campana Tin, se apaga la luz. ¿Por qué se apaga la luz?", "test_mutuo:C→B": "Si se apaga la luz, la habitación se queda a oscuras. ¿Por qué se queda a oscuras la habitación?", "test_combinatorio:A→C": "Si se apaga la luz, la habitación se queda a oscuras. Si suena la campana Tin, se apaga la luz. Si suena la campana Tin, ¿qué pasa al final?", "test_combinatorio:C→A": "Si se apaga la luz, la habitación se queda a oscuras. Si suena la campana Tin, se apaga la luz. ¿Qué tiene que pasar primero para que se quede a oscuras la habitación?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A5', 'A', 'Suena la campana Tin', null),
  ('B5', 'B', 'Se apaga la luz', null),
  ('C5', 'C', 'La habitación se queda a oscuras', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'), 'Clase 6', 'Grupo 2', '{"entrenamiento:A→B": "Cuando el robot Zak aplaude, se abre la puerta. ¿Qué pasa cuando el robot Zak aplaude?", "entrenamiento:B→C": "Cuando se abre la puerta, entra el frío. ¿Qué pasa cuando se abre la puerta?", "test_mutuo:B→A": "Cuando el robot Zak aplaude, se abre la puerta. ¿Por qué se abre la puerta?", "test_mutuo:C→B": "Cuando se abre la puerta, entra el frío. ¿Por qué entra el frío?", "test_combinatorio:A→C": "Cuando se abre la puerta, entra el frío. Cuando el robot Zak aplaude, se abre la puerta. Cuando el robot Zak aplaude, ¿qué pasa al final?", "test_combinatorio:C→A": "Cuando se abre la puerta, entra el frío. Cuando el robot Zak aplaude, se abre la puerta. ¿Qué tiene que pasar primero para que entre el frío?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A6', 'A', 'El robot Zak aplaude', null),
  ('B6', 'B', 'Se abre la puerta', null),
  ('C6', 'C', 'Entra el frío', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'), 'Clase 7', 'Grupo 3', '{"entrenamiento:A→B": "Sopla el viento si la tortuga Luma estornuda. ¿Qué pasa si la tortuga Luma estornuda?", "entrenamiento:B→C": "Las hojas se caen si sopla el viento. ¿Qué pasa si sopla el viento?", "test_mutuo:B→A": "Sopla el viento si la tortuga Luma estornuda. ¿Por qué sopla el viento?", "test_mutuo:C→B": "Las hojas se caen si sopla el viento. ¿Por qué se caen las hojas?", "test_combinatorio:A→C": "Las hojas se caen si sopla el viento. Sopla el viento si la tortuga Luma estornuda. Si la tortuga Luma estornuda, ¿qué pasa al final?", "test_combinatorio:C→A": "Las hojas se caen si sopla el viento. Sopla el viento si la tortuga Luma estornuda. ¿Qué tiene que pasar primero para que se caigan las hojas?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A7', 'A', 'La tortuga Luma estornuda', null),
  ('B7', 'B', 'Sopla el viento', null),
  ('C7', 'C', 'Las hojas se caen', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'), 'Clase 8', 'Grupo 3', '{"entrenamiento:A→B": "Sale agua del grifo cuando se gira la llave Bex. ¿Qué pasa cuando se gira la llave Bex?", "entrenamiento:B→C": "El vaso se llena cuando sale agua del grifo. ¿Qué pasa cuando sale agua del grifo?", "test_mutuo:B→A": "Sale agua del grifo cuando se gira la llave Bex. ¿Por qué sale agua del grifo?", "test_mutuo:C→B": "El vaso se llena cuando sale agua del grifo. ¿Por qué se llena el vaso?", "test_combinatorio:A→C": "El vaso se llena cuando sale agua del grifo. Sale agua del grifo cuando se gira la llave Bex. Cuando se gira la llave Bex, ¿qué pasa al final?", "test_combinatorio:C→A": "El vaso se llena cuando sale agua del grifo. Sale agua del grifo cuando se gira la llave Bex. ¿Qué tiene que pasar primero para que se llene el vaso?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A8', 'A', 'Se gira la llave Bex', null),
  ('B8', 'B', 'Sale agua del grifo', null),
  ('C8', 'C', 'El vaso se llena', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'), 'Clase 9', 'Grupo 3', '{"entrenamiento:A→B": "Si el mago Dori da una palmada, aparece un pastel. ¿Qué pasa si el mago Dori da una palmada?", "entrenamiento:B→C": "Si aparece un pastel, los niños se ponen contentos. ¿Qué pasa si aparece un pastel?", "test_mutuo:B→A": "Si el mago Dori da una palmada, aparece un pastel. ¿Por qué aparece un pastel?", "test_mutuo:C→B": "Si aparece un pastel, los niños se ponen contentos. ¿Por qué se ponen contentos los niños?", "test_combinatorio:A→C": "Si el mago Dori da una palmada, aparece un pastel. Si aparece un pastel, los niños se ponen contentos. Si el mago Dori da una palmada, ¿qué pasa al final?", "test_combinatorio:C→A": "Si el mago Dori da una palmada, aparece un pastel. Si aparece un pastel, los niños se ponen contentos. ¿Qué tiene que pasar primero para que se pongan contentos los niños?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A9', 'A', 'El mago Dori da una palmada', null),
  ('B9', 'B', 'Aparece un pastel', null),
  ('C9', 'C', 'Los niños se ponen contentos', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'), 'Clase 10', 'Grupo 4', '{"entrenamiento:A→B": "Cuando la vaca Nela canta, nieva. ¿Qué pasa cuando la vaca Nela canta?", "entrenamiento:B→C": "Cuando nieva, los niños se ponen los guantes. ¿Qué pasa cuando nieva?", "test_mutuo:B→A": "Cuando la vaca Nela canta, nieva. ¿Por qué nieva?", "test_mutuo:C→B": "Cuando nieva, los niños se ponen los guantes. ¿Por qué se ponen los guantes los niños?", "test_combinatorio:A→C": "Cuando la vaca Nela canta, nieva. Cuando nieva, los niños se ponen los guantes. Cuando la vaca Nela canta, ¿qué pasa al final?", "test_combinatorio:C→A": "Cuando la vaca Nela canta, nieva. Cuando nieva, los niños se ponen los guantes. ¿Qué tiene que pasar primero para que se pongan los guantes los niños?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A10', 'A', 'La vaca Nela canta', null),
  ('B10', 'B', 'Nieva', null),
  ('C10', 'C', 'Los niños se ponen los guantes', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'), 'Clase 11', 'Grupo 4', '{"entrenamiento:A→B": "El coche se para si el búho Tolo silba. ¿Qué pasa si el búho Tolo silba?", "entrenamiento:B→C": "El conductor se baja si el coche se para. ¿Qué pasa si el coche se para?", "test_mutuo:B→A": "El coche se para si el búho Tolo silba. ¿Por qué se para el coche?", "test_mutuo:C→B": "El conductor se baja si el coche se para. ¿Por qué se baja el conductor?", "test_combinatorio:A→C": "El coche se para si el búho Tolo silba. El conductor se baja si el coche se para. Si el búho Tolo silba, ¿qué pasa al final?", "test_combinatorio:C→A": "El coche se para si el búho Tolo silba. El conductor se baja si el coche se para. ¿Qué tiene que pasar primero para que se baje el conductor?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A11', 'A', 'El búho Tolo silba', null),
  ('B11', 'B', 'El coche se para', null),
  ('C11', 'C', 'El conductor se baja', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'), 'Clase 12', 'Grupo 4', '{"entrenamiento:A→B": "Suena la música cuando se pulsa el botón Kim. ¿Qué pasa cuando se pulsa el botón Kim?", "entrenamiento:B→C": "Todos bailan cuando suena la música. ¿Qué pasa cuando suena la música?", "test_mutuo:B→A": "Suena la música cuando se pulsa el botón Kim. ¿Por qué suena la música?", "test_mutuo:C→B": "Todos bailan cuando suena la música. ¿Por qué bailan todos?", "test_combinatorio:A→C": "Suena la música cuando se pulsa el botón Kim. Todos bailan cuando suena la música. Cuando se pulsa el botón Kim, ¿qué pasa al final?", "test_combinatorio:C→A": "Suena la música cuando se pulsa el botón Kim. Todos bailan cuando suena la música. ¿Qué tiene que pasar primero para que bailen todos?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A12', 'A', 'Se pulsa el botón Kim', null),
  ('B12', 'B', 'Suena la música', null),
  ('C12', 'C', 'Todos bailan', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'), 'Clase 13', 'Grupo 5', '{"entrenamiento:A→B": "Si el pez Rufo salta, se forma una ola. ¿Qué pasa si el pez Rufo salta?", "entrenamiento:B→C": "Si se forma una ola, el barco se mueve. ¿Qué pasa si se forma una ola?", "test_mutuo:B→A": "Si el pez Rufo salta, se forma una ola. ¿Por qué se forma una ola?", "test_mutuo:C→B": "Si se forma una ola, el barco se mueve. ¿Por qué se mueve el barco?", "test_combinatorio:A→C": "Si se forma una ola, el barco se mueve. Si el pez Rufo salta, se forma una ola. Si el pez Rufo salta, ¿qué pasa al final?", "test_combinatorio:C→A": "Si se forma una ola, el barco se mueve. Si el pez Rufo salta, se forma una ola. ¿Qué tiene que pasar primero para que se mueva el barco?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A13', 'A', 'El pez Rufo salta', null),
  ('B13', 'B', 'Se forma una ola', null),
  ('C13', 'C', 'El barco se mueve', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'), 'Clase 14', 'Grupo 5', '{"entrenamiento:A→B": "Cuando el ratón Fifi se ríe, se cae el vaso. ¿Qué pasa cuando el ratón Fifi se ríe?", "entrenamiento:B→C": "Cuando se cae el vaso, la mesa se moja. ¿Qué pasa cuando se cae el vaso?", "test_mutuo:B→A": "Cuando el ratón Fifi se ríe, se cae el vaso. ¿Por qué se cae el vaso?", "test_mutuo:C→B": "Cuando se cae el vaso, la mesa se moja. ¿Por qué se moja la mesa?", "test_combinatorio:A→C": "Cuando se cae el vaso, la mesa se moja. Cuando el ratón Fifi se ríe, se cae el vaso. Cuando el ratón Fifi se ríe, ¿qué pasa al final?", "test_combinatorio:C→A": "Cuando se cae el vaso, la mesa se moja. Cuando el ratón Fifi se ríe, se cae el vaso. ¿Qué tiene que pasar primero para que se moje la mesa?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A14', 'A', 'El ratón Fifi se ríe', null),
  ('B14', 'B', 'Se cae el vaso', null),
  ('C14', 'C', 'La mesa se moja', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'), 'Clase 15', 'Grupo 5', '{"entrenamiento:A→B": "El gallo canta si la estrella Nova brilla. ¿Qué pasa si la estrella Nova brilla?", "entrenamiento:B→C": "La granja se despierta si el gallo canta. ¿Qué pasa si el gallo canta?", "test_mutuo:B→A": "El gallo canta si la estrella Nova brilla. ¿Por qué canta el gallo?", "test_mutuo:C→B": "La granja se despierta si el gallo canta. ¿Por qué se despierta la granja?", "test_combinatorio:A→C": "La granja se despierta si el gallo canta. El gallo canta si la estrella Nova brilla. Si la estrella Nova brilla, ¿qué pasa al final?", "test_combinatorio:C→A": "La granja se despierta si el gallo canta. El gallo canta si la estrella Nova brilla. ¿Qué tiene que pasar primero para que se despierte la granja?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A15', 'A', 'La estrella Nova brilla', null),
  ('B15', 'B', 'El gallo canta', null),
  ('C15', 'C', 'La granja se despierta', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'), 'Clase 16', 'Grupo 6', '{"entrenamiento:A→B": "Se enciende el fuego cuando el dragón Polo tose. ¿Qué pasa cuando el dragón Polo tose?", "entrenamiento:B→C": "La sopa se calienta cuando se enciende el fuego. ¿Qué pasa cuando se enciende el fuego?", "test_mutuo:B→A": "Se enciende el fuego cuando el dragón Polo tose. ¿Por qué se enciende el fuego?", "test_mutuo:C→B": "La sopa se calienta cuando se enciende el fuego. ¿Por qué se calienta la sopa?", "test_combinatorio:A→C": "La sopa se calienta cuando se enciende el fuego. Se enciende el fuego cuando el dragón Polo tose. Cuando el dragón Polo tose, ¿qué pasa al final?", "test_combinatorio:C→A": "La sopa se calienta cuando se enciende el fuego. Se enciende el fuego cuando el dragón Polo tose. ¿Qué tiene que pasar primero para que se caliente la sopa?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A16', 'A', 'El dragón Polo tose', null),
  ('B16', 'B', 'Se enciende el fuego', null),
  ('C16', 'C', 'La sopa se calienta', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'), 'Clase 17', 'Grupo 6', '{"entrenamiento:A→B": "Si suena el tambor Bum, el perro se asusta. ¿Qué pasa si suena el tambor Bum?", "entrenamiento:B→C": "Si el perro se asusta, el perro se esconde. ¿Qué pasa si el perro se asusta?", "test_mutuo:B→A": "Si suena el tambor Bum, el perro se asusta. ¿Por qué se asusta el perro?", "test_mutuo:C→B": "Si el perro se asusta, el perro se esconde. ¿Por qué se esconde el perro?", "test_combinatorio:A→C": "Si suena el tambor Bum, el perro se asusta. Si el perro se asusta, el perro se esconde. Si suena el tambor Bum, ¿qué pasa al final?", "test_combinatorio:C→A": "Si suena el tambor Bum, el perro se asusta. Si el perro se asusta, el perro se esconde. ¿Qué tiene que pasar primero para que se esconda el perro?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A17', 'A', 'Suena el tambor Bum', null),
  ('B17', 'B', 'El perro se asusta', null),
  ('C17', 'C', 'El perro se esconde', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'), 'Clase 18', 'Grupo 6', '{"entrenamiento:A→B": "Cuando la mariquita Sisi vuela, se rompe el globo. ¿Qué pasa cuando la mariquita Sisi vuela?", "entrenamiento:B→C": "Cuando se rompe el globo, el niño llora. ¿Qué pasa cuando se rompe el globo?", "test_mutuo:B→A": "Cuando la mariquita Sisi vuela, se rompe el globo. ¿Por qué se rompe el globo?", "test_mutuo:C→B": "Cuando se rompe el globo, el niño llora. ¿Por qué llora el niño?", "test_combinatorio:A→C": "Cuando la mariquita Sisi vuela, se rompe el globo. Cuando se rompe el globo, el niño llora. Cuando la mariquita Sisi vuela, ¿qué pasa al final?", "test_combinatorio:C→A": "Cuando la mariquita Sisi vuela, se rompe el globo. Cuando se rompe el globo, el niño llora. ¿Qué tiene que pasar primero para que llore el niño?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A18', 'A', 'La mariquita Sisi vuela', null),
  ('B18', 'B', 'Se rompe el globo', null),
  ('C18', 'C', 'El niño llora', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'), 'Clase 19', 'Grupo 7', '{"entrenamiento:A→B": "Se acaba el día si el oso Tubo bosteza. ¿Qué pasa si el oso Tubo bosteza?", "entrenamiento:B→C": "Sale la luna si se acaba el día. ¿Qué pasa si se acaba el día?", "test_mutuo:B→A": "Se acaba el día si el oso Tubo bosteza. ¿Por qué se acaba el día?", "test_mutuo:C→B": "Sale la luna si se acaba el día. ¿Por qué sale la luna?", "test_combinatorio:A→C": "Se acaba el día si el oso Tubo bosteza. Sale la luna si se acaba el día. Si el oso Tubo bosteza, ¿qué pasa al final?", "test_combinatorio:C→A": "Se acaba el día si el oso Tubo bosteza. Sale la luna si se acaba el día. ¿Qué tiene que pasar primero para que salga la luna?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A19', 'A', 'El oso Tubo bosteza', null),
  ('B19', 'B', 'Se acaba el día', null),
  ('C19', 'C', 'Sale la luna', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'), 'Clase 20', 'Grupo 7', '{"entrenamiento:A→B": "Sale confeti cuando el payaso Piru se toca la nariz. ¿Qué pasa cuando el payaso Piru se toca la nariz?", "entrenamiento:B→C": "El suelo se llena de papelitos cuando sale confeti. ¿Qué pasa cuando sale confeti?", "test_mutuo:B→A": "Sale confeti cuando el payaso Piru se toca la nariz. ¿Por qué sale confeti?", "test_mutuo:C→B": "El suelo se llena de papelitos cuando sale confeti. ¿Por qué se llena de papelitos el suelo?", "test_combinatorio:A→C": "Sale confeti cuando el payaso Piru se toca la nariz. El suelo se llena de papelitos cuando sale confeti. Cuando el payaso Piru se toca la nariz, ¿qué pasa al final?", "test_combinatorio:C→A": "Sale confeti cuando el payaso Piru se toca la nariz. El suelo se llena de papelitos cuando sale confeti. ¿Qué tiene que pasar primero para que se llene de papelitos el suelo?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A20', 'A', 'El payaso Piru se toca la nariz', null),
  ('B20', 'B', 'Sale confeti', null),
  ('C20', 'C', 'El suelo se llena de papelitos', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'), 'Clase 21', 'Grupo 7', '{"entrenamiento:A→B": "Si el loro Kako grita, se despierta el abuelo. ¿Qué pasa si el loro Kako grita?", "entrenamiento:B→C": "Si se despierta el abuelo, el abuelo enciende la luz. ¿Qué pasa si se despierta el abuelo?", "test_mutuo:B→A": "Si el loro Kako grita, se despierta el abuelo. ¿Por qué se despierta el abuelo?", "test_mutuo:C→B": "Si se despierta el abuelo, el abuelo enciende la luz. ¿Por qué enciende la luz el abuelo?", "test_combinatorio:A→C": "Si se despierta el abuelo, el abuelo enciende la luz. Si el loro Kako grita, se despierta el abuelo. Si el loro Kako grita, ¿qué pasa al final?", "test_combinatorio:C→A": "Si se despierta el abuelo, el abuelo enciende la luz. Si el loro Kako grita, se despierta el abuelo. ¿Qué tiene que pasar primero para que encienda la luz el abuelo?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A21', 'A', 'El loro Kako grita', null),
  ('B21', 'B', 'Se despierta el abuelo', null),
  ('C21', 'C', 'El abuelo enciende la luz', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'), 'Clase 22', 'Grupo 8', '{"entrenamiento:A→B": "Cuando la ballena Maxi canta, sube el mar. ¿Qué pasa cuando la ballena Maxi canta?", "entrenamiento:B→C": "Cuando sube el mar, el castillo de arena se deshace. ¿Qué pasa cuando sube el mar?", "test_mutuo:B→A": "Cuando la ballena Maxi canta, sube el mar. ¿Por qué sube el mar?", "test_mutuo:C→B": "Cuando sube el mar, el castillo de arena se deshace. ¿Por qué se deshace el castillo de arena?", "test_combinatorio:A→C": "Cuando sube el mar, el castillo de arena se deshace. Cuando la ballena Maxi canta, sube el mar. Cuando la ballena Maxi canta, ¿qué pasa al final?", "test_combinatorio:C→A": "Cuando sube el mar, el castillo de arena se deshace. Cuando la ballena Maxi canta, sube el mar. ¿Qué tiene que pasar primero para que se deshaga el castillo de arena?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A22', 'A', 'La ballena Maxi canta', null),
  ('B22', 'B', 'Sube el mar', null),
  ('C22', 'C', 'El castillo de arena se deshace', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'), 'Clase 23', 'Grupo 8', '{"entrenamiento:A→B": "Se apagan las velas si el hada Lila sopla. ¿Qué pasa si el hada Lila sopla?", "entrenamiento:B→C": "Todos aplauden si se apagan las velas. ¿Qué pasa si se apagan las velas?", "test_mutuo:B→A": "Se apagan las velas si el hada Lila sopla. ¿Por qué se apagan las velas?", "test_mutuo:C→B": "Todos aplauden si se apagan las velas. ¿Por qué aplauden todos?", "test_combinatorio:A→C": "Todos aplauden si se apagan las velas. Se apagan las velas si el hada Lila sopla. Si el hada Lila sopla, ¿qué pasa al final?", "test_combinatorio:C→A": "Todos aplauden si se apagan las velas. Se apagan las velas si el hada Lila sopla. ¿Qué tiene que pasar primero para que aplaudan todos?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A23', 'A', 'El hada Lila sopla', null),
  ('B23', 'B', 'Se apagan las velas', null),
  ('C23', 'C', 'Todos aplauden', null)) x(etiqueta, posicion, nombre, concepto);
with nueva as (
  insert into clases_rft_base (programa_base_id, nombre, grupo, consignas)
  values ((select id from programas_base where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias'), 'Clase 24', 'Grupo 8', '{"entrenamiento:A→B": "Se derrite el helado cuando el caracol Bobo se ríe. ¿Qué pasa cuando el caracol Bobo se ríe?", "entrenamiento:B→C": "Las manos se manchan cuando se derrite el helado. ¿Qué pasa cuando se derrite el helado?", "test_mutuo:B→A": "Se derrite el helado cuando el caracol Bobo se ríe. ¿Por qué se derrite el helado?", "test_mutuo:C→B": "Las manos se manchan cuando se derrite el helado. ¿Por qué se manchan las manos?", "test_combinatorio:A→C": "Las manos se manchan cuando se derrite el helado. Se derrite el helado cuando el caracol Bobo se ríe. Cuando el caracol Bobo se ríe, ¿qué pasa al final?", "test_combinatorio:C→A": "Las manos se manchan cuando se derrite el helado. Se derrite el helado cuando el caracol Bobo se ríe. ¿Qué tiene que pasar primero para que se manchen las manos?"}'::jsonb) returning id)
insert into estimulos_rft_base (clase_base_id, etiqueta, posicion, nombre, concepto_imagen)
select id, x.etiqueta, x.posicion, x.nombre, x.concepto from nueva, (values
  ('A24', 'A', 'El caracol Bobo se ríe', null),
  ('B24', 'B', 'Se derrite el helado', null),
  ('C24', 'C', 'Las manos se manchan', null)) x(etiqueta, posicion, nombre, concepto);

update programas_base set
  opciones_clase = true,
  consignas = null,
  objetivo = 'A partir de dos relaciones causales encadenadas enunciadas verbalmente ("Si el pájaro Tiko canta, sale el sol"; "Si sale el sol, las flores se abren"), el alumno deriva la relación entre la primera causa y el último efecto, tanto hacia delante ("Si Tiko canta, ¿qué pasa al final?") como hacia atrás ("¿Qué tiene que pasar primero para que se abran las flores?").',
  materiales = 'Grupos de 3 (o más) clases con 3 miembros:

A: Primera causa (inventada: un personaje u objeto con nombre inventado)
B: Efecto intermedio
C: Efecto final

La primera causa es inventada para que el alumno no pueda responder por conocimiento previo; el segundo eslabón (B → C) es verosímil. Las opciones son los tres sucesos, dichos uno a uno y sin «porque» (en la tableta, tarjetas de audio). Contrapesos: la mitad de las clases se enuncian con «si» y la otra mitad con «cuando»; en la mitad la frase va en orden invertido («Sale el sol si el pájaro Tiko canta»); en el test combinatorio, la mitad de las clases dicen las premisas en orden inverso.',
  instrucciones_terapeuta = '
Requisito previo: el alumno ha superado "Responder a Preguntas ¿Por qué?" y "Vincular Mutuamente Relaciones Condicionales" (dominio 3.7).

Opciones de respuesta: en cada ensayo, diga uno a uno los tres miembros de la red («El pájaro Tiko canta», «Sale el sol», «Las flores se abren»); el alumno elige uno. Al estar siempre los tres, el miembro que no corresponde actúa como distractor y no hace falta añadir ninguno de otra clase.

Fase 1 - Entrenamiento (A–B y B–C por separado):

1. Enuncie una sola relación y pregunte por el efecto ("Si el pájaro Tiko canta, sale el sol. ¿Qué pasa si el pájaro Tiko canta?").
2. No mencione nunca A y C en la misma relación durante el entrenamiento.
3. Refuerce hasta alcanzar el criterio de dominio en ambas relaciones y realice después un bloque de mantenimiento con ambas mezcladas.

Fase 2 - Test de Vinculación Mutua (de cada efecto a su causa), sin entrenamiento directo: "Si el pájaro Tiko canta, sale el sol. ¿Por qué sale el sol?". No refuerce diferencialmente durante estos ensayos (evite dar pistas de si es correcto o incorrecto), pero registre la respuesta.

Fase 3 - Test de Vinculación Combinatoria (A ↔ C), sin entrenamiento directo:

1. Diga las dos premisas seguidas y pregunte hacia delante: "… Si el pájaro Tiko canta, ¿qué pasa al final?" (respuesta: "Las flores se abren").
2. Y hacia atrás: "… ¿Qué tiene que pasar primero para que se abran las flores?" (respuesta: "El pájaro Tiko canta").
3. No refuerce diferencialmente durante estos ensayos (evite dar pistas de si es correcto o incorrecto), pero registre la respuesta.
4. Elegir B (el efecto intermedio) indica que no integra las dos premisas o que responde solo al eslabón más próximo.

Generalización (sondas): cadenas causales reales nuevas, con respuesta oral libre (ej. "Si llueve, el suelo se moja; si el suelo está mojado, resbalamos. ¿Qué puede pasar si llueve?").

Realice el primer bloque de cada test sin ayudas. Si el alumno alcanza el criterio, la relación se considera DERIVADA; si se enseña con ayudas, quedará registrada como DOMINADA (no derivada), aunque el último bloque se realice sin ayudas.

Registro en la app (fase · posición origen → destino; el destino es la respuesta correcta):
- Entrenamiento: A → B ("¿Qué pasa si el pájaro Tiko canta?") y B → C ("¿Qué pasa si sale el sol?")
- Test de vínculo mutuo: B → A ("¿Por qué sale el sol?") y C → B ("¿Por qué se abren las flores?")
- Test de vínculo combinatorio: A → C ("Si el pájaro Tiko canta, ¿qué pasa al final?") y C → A ("¿Qué tiene que pasar primero para que se abran las flores?")
Las sondas con los mismos estímulos en otro contexto o con otra persona se registran con las mismas posiciones, eligiendo "Sonda de generalización" como tipo de bloque una vez dominada la combinación.

Grupos de estímulos: los grupos y clases de este programa son un ejemplo. Cree en el PEI del alumno tantos grupos como considere oportuno, incluido un grupo de generalización con estímulos nuevos. En ese grupo, el primer bloque de entrenamiento realizado sin ayudas y sin reforzar diferencialmente funciona como sonda: si el alumno alcanza el criterio a la primera, hay generalización a estímulos nuevos (anótelo en las notas del bloque). Los tests de ese grupo se habilitan cuando su entrenamiento está dominado. Las sondas con los mismos estímulos en otro contexto o con otra persona se registran como "Sonda de generalización" en el grupo ya dominado.'
where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias';

commit;
