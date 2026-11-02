-- Precios solo por alumno (utils/tarifas.ts): escalones A-D (España pasa al A)
-- y sin plan de terapeuta independiente.
alter table clinicas drop constraint clinicas_escalon_check;
update clinicas set escalon = 'a' where escalon = 'es';
alter table clinicas add constraint clinicas_escalon_check check (escalon in ('a', 'b', 'c', 'd'));
alter table clinicas drop column plan;
