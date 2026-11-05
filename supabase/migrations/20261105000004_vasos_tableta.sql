-- Modo tableta para «Seguir visualmente»: el juego de los vasos. Cada conjunto
-- de estímulos es un nivel (número de vasos, intercambios y velocidad) y sus
-- estímulos son los objetos preferidos que se esconden, con imagen del banco
-- o propia del centro. Los bloques guardan si se hicieron con material o en
-- la tableta.

alter table conjuntos_estimulos_base add column if not exists actividad_tablet jsonb;
alter table conjuntos_estimulos_alumno add column if not exists actividad_tablet jsonb;
alter table estimulos_base add column if not exists concepto_imagen text;
alter table estimulos_alumno add column if not exists concepto_imagen text;
alter table bloques_ensayo add column if not exists modo text not null default 'material'
  check (modo in ('material', 'tableta'));

comment on column conjuntos_estimulos_base.actividad_tablet is 'Actividad de tableta del conjunto: {tipo: "vasos", vasos: 2|3, intercambios: 0-8, velocidad: "lenta"|"media"|"rapida"} (ver app/dashboard/vasos.ts)';
comment on column conjuntos_estimulos_alumno.actividad_tablet is 'Copia editable de conjuntos_estimulos_base.actividad_tablet';

-- Niveles iniciales del programa en el currículo global
do $$
declare
  v_programa uuid := (select id from programas_base where clinica_id is null and nombre = 'Seguir visualmente');
  v_conjunto uuid;
  v_nivel record;
begin
  if v_programa is null or exists (select 1 from conjuntos_estimulos_base where programa_base_id = v_programa) then
    return;
  end if;
  for v_nivel in
    select * from (values
      (1, '2 vasos, sin intercambios', 2, 0, 'lenta'),
      (2, '2 vasos, 1 intercambio lento', 2, 1, 'lenta'),
      (3, '2 vasos, 3 intercambios lentos', 2, 3, 'lenta'),
      (4, '3 vasos, 1 intercambio lento', 3, 1, 'lenta'),
      (5, '3 vasos, 3 intercambios', 3, 3, 'media'),
      (6, '3 vasos, 5 intercambios rápidos', 3, 5, 'rapida')
    ) as n(orden, nombre, vasos, intercambios, velocidad)
  loop
    insert into conjuntos_estimulos_base (programa_base_id, nombre, orden, actividad_tablet)
    values (v_programa, v_nivel.nombre, v_nivel.orden,
      jsonb_build_object('tipo', 'vasos', 'vasos', v_nivel.vasos, 'intercambios', v_nivel.intercambios, 'velocidad', v_nivel.velocidad))
    returning id into v_conjunto;
    insert into estimulos_base (conjunto_id, nombre, descripcion, orden, concepto_imagen) values
      (v_conjunto, 'Pelota', 'Sustitúyalo por un objeto preferido del alumno', 1, 'objetos/pelota'),
      (v_conjunto, 'Peluche', 'Sustitúyalo por un objeto preferido del alumno', 2, 'objetos/peluche'),
      (v_conjunto, 'Coche de juguete', 'Sustitúyalo por un objeto preferido del alumno', 3, 'objetos/coche-de-juguete');
  end loop;

  update programas_base
  set instrucciones_terapeuta = instrucciones_terapeuta || E'\n\nModo tableta: cada conjunto es un nivel (número de vasos, intercambios y velocidad). La tableta muestra el objeto, lo esconde bajo un vaso, mueve los vasos y pregunta "¿Dónde está?"; el alumno toca un vaso y este se levanta. Se registra la primera elección y la latencia. Sustituya los objetos por los preferidos del alumno, con una foto propia si es posible, y entregue el reforzador real tras cada acierto.'
  where id = v_programa and instrucciones_terapeuta not like '%Modo tableta:%';
end $$;
