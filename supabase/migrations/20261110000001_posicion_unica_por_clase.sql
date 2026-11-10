-- Una clase RFT no puede tener dos estímulos en la misma posición (ej. dos
-- A5). Antes de añadir la restricción se unen los duplicados que había en un
-- PEI de prueba: se conserva el que tiene etiqueta y se le pasan los ensayos
-- y relaciones entrenadas del otro.

begin;

create temp table duplicados on commit drop as
select e.id as sobra, k.id as queda
from estimulos_rft e
join lateral (
  select id from estimulos_rft k
  where k.clase_id = e.clase_id and k.posicion = e.posicion
  order by (k.etiqueta is not null and k.etiqueta <> '') desc, k.id
  limit 1
) k on true
where e.posicion is not null and e.id <> k.id;

update ensayos_rft_detalle d set estimulo_origen_id = x.queda from duplicados x where d.estimulo_origen_id = x.sobra;
update ensayos_rft_detalle d set estimulo_destino_id = x.queda from duplicados x where d.estimulo_destino_id = x.sobra;

-- Relaciones entrenadas: se borran las que quedarían repetidas y se pasan las demás
delete from relaciones_entrenadas_rft r
using duplicados x
where (r.estimulo_origen_id = x.sobra or r.estimulo_destino_id = x.sobra)
  and exists (
    select 1 from relaciones_entrenadas_rft r2
    where r2.clase_id = r.clase_id
      and r2.estimulo_origen_id = case when r.estimulo_origen_id = x.sobra then x.queda else r.estimulo_origen_id end
      and r2.estimulo_destino_id = case when r.estimulo_destino_id = x.sobra then x.queda else r.estimulo_destino_id end
  );
update relaciones_entrenadas_rft r set estimulo_origen_id = x.queda from duplicados x where r.estimulo_origen_id = x.sobra;
update relaciones_entrenadas_rft r set estimulo_destino_id = x.queda from duplicados x where r.estimulo_destino_id = x.sobra;

delete from estimulos_rft e using duplicados x where e.id = x.sobra;

create unique index if not exists estimulos_rft_posicion_unica on estimulos_rft (clase_id, posicion) where posicion is not null;
create unique index if not exists estimulos_rft_base_posicion_unica on estimulos_rft_base (clase_base_id, posicion) where posicion is not null;

commit;
