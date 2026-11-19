-- Clases creadas por el generador de grupos (currículo o PEI): se guarda con qué
-- plantilla y semilla se generaron, para poder reproducirlas o revisarlas. Las
-- clases generadas no tienen voz grabada: las lee el alumno o el terapeuta.
alter table clases_rft add column if not exists generado jsonb;
alter table clases_rft_base add column if not exists generado jsonb;
