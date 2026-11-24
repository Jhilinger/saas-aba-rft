-- «Usar Autoinstrucciones» pasa detrás de «Distinguir el Yo que Observa» (decisión del usuario 2026-11-24): la autorregla
-- funciona mejor cuando el alumno se relaciona con su conducta desde el yo (Törneke, Luciano, Barnes-Holmes y Bond, 2016).
begin;
select colocar_programa_curriculo(
  (select id from programas_base where clinica_id is null and nombre = 'Usar Autoinstrucciones'),
  (select id from dominios_curriculo where codigo = '4.4'),
  (select orden from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'));
insert into requisitos_programa (programa_base_id, requisito_id)
select (select id from programas_base where clinica_id is null and nombre = 'Usar Autoinstrucciones'),
       (select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa')
where not exists (select 1 from requisitos_programa where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Usar Autoinstrucciones')
  and requisito_id = (select id from programas_base where clinica_id is null and nombre = 'Distinguir el Yo que Observa'));
commit;
