-- Ayudas de menor a mayor dentro del ensayo (tableta): nivel de ayuda con que
-- se acertó un ensayo tras uno o más errores (1 repetir la muestra, 2 quitar
-- un distractor, 3 atenuar distractores, 4 resaltar la correcta, 5 solo la
-- correcta) y ensayos de transferencia (el mismo ensayo sin ayuda tras un
-- acierto con ayuda), que se guardan aparte y no cuentan para el %.

alter table ensayos_rft_detalle drop constraint if exists ensayos_rft_detalle_tipo_ensayo_check;
alter table ensayos_rft_detalle add constraint ensayos_rft_detalle_tipo_ensayo_check
  check (tipo_ensayo = any (array['principal', 'control', 'transferencia']));

alter table ensayos_rft_detalle add column if not exists nivel_ayuda smallint
  check (nivel_ayuda between 1 and 5);

comment on column ensayos_rft_detalle.nivel_ayuda is 'Ayudas de menor a mayor: nivel con que acertó tras fallar (1 repetir muestra, 2 quitar un distractor, 3 atenuar distractores, 4 resaltar la correcta, 5 solo la correcta)';
