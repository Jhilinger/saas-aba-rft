-- Opciones de respuesta propias de una clase, por fase y combinación («test_combinatorio:D→E»:
-- [«Que nunca hablan de noche», «Que son tímidos», …]). Si la clase no las tiene, se usan las
-- del programa. Hace falta cuando las opciones dependen de la red (p. ej. la función dominante
-- en jerarquía, Villarroel y Luciano).
alter table clases_rft_base add column if not exists opciones_por_fase jsonb not null default '{}'::jsonb;
alter table clases_rft add column if not exists opciones_por_fase jsonb not null default '{}'::jsonb;
