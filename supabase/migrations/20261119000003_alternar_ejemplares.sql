-- Por defecto un grupo se trabaja solo con la foto 1 de cada concepto (la de la
-- ficha). Excepción: en «Vincular Mutuamente … con sus Nombres» (2.2) se
-- alternan la foto 1 y la 2 en entrenamiento y tests, como múltiples ejemplares
-- del mismo nombre. La opción se guarda en el programa y se copia al PEI.

begin;

alter table programas_base add column if not exists alternar_ejemplares boolean not null default false;
alter table programas_alumno add column if not exists alternar_ejemplares boolean not null default false;

update programas_base p set alternar_ejemplares = true
where p.clinica_id is null
  and p.dominio_id = (select id from dominios_curriculo where codigo = '2.2')
  and p.nombre like 'Vincular Mutuamente % con sus Nombres';

update programas_alumno pa set alternar_ejemplares = true
where pa.programa_base_id in (select id from programas_base where clinica_id is null and alternar_ejemplares);

commit;
