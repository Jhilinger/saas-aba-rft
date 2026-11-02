-- Precios por país (utils/tarifas.ts): código ISO del país, escalón de precio,
-- plan (clínica o terapeuta independiente) y moneda de la suscripción.
alter table clinicas add column pais_codigo text;
alter table clinicas add column escalon text check (escalon in ('es', 'a', 'b', 'c'));
alter table clinicas add column plan text not null default 'clinica' check (plan in ('clinica', 'independiente'));
alter table clinicas add column moneda text not null default 'EUR';

update clinicas set pais_codigo = 'ES', escalon = 'es' where pais in ('España', 'ES', 'Espana');
