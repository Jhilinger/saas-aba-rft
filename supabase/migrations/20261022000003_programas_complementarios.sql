-- Los programas creados por una clínica o un terapeuta (clinica_id no nulo)
-- son "complementarios": no forman parte del currículo (sin dominio ni
-- posición), no cuentan en los porcentajes ni bloquean la secuencia del PEI.
-- Solo los programas globales (superadmin) tienen nivel/dominio/código.
update programas_base set dominio_id = null, orden = null
where clinica_id is not null and (dominio_id is not null or orden is not null);

alter table programas_base
  add constraint programas_base_complementarios_sin_dominio
  check (clinica_id is null or (dominio_id is null and orden is null));
