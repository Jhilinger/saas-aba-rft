-- Currículo organizado en Niveles → Dominios → Programas (código posicional nivel.dominio.posición).
-- Aplicado en producción el 2026-10-21 con 'supabase db query --linked'.

begin;

-- 1. Niveles y dominios (globales, fijos; solo lectura desde la app)
create table niveles_curriculo (
  numero smallint primary key,
  nombre text not null
);

create table dominios_curriculo (
  id uuid primary key default gen_random_uuid(),
  nivel smallint not null references niveles_curriculo(numero),
  numero smallint not null,
  nombre text not null,
  codigo text generated always as (nivel::text || '.' || numero::text) stored,
  unique (nivel, numero)
);

alter table niveles_curriculo enable row level security;
alter table dominios_curriculo enable row level security;
create policy niveles_curriculo_select on niveles_curriculo for select to authenticated using (true);
create policy dominios_curriculo_select on dominios_curriculo for select to authenticated using (true);

insert into niveles_curriculo (numero, nombre) values
  (1, 'Fundamentos Operantes y Abstracción de Claves (C_rel)'),
  (2, 'Redes de Coordinación y Equivalencia'),
  (3, 'Relaciones Complejas y Marcos No Equivalentes'),
  (4, 'Marcos Deícticos y Cognición Social Avanzada');

insert into dominios_curriculo (nivel, numero, nombre) values
  (1, 1, 'Atención Conjunta y Control de Estímulo'),
  (1, 2, 'Peticiones Directas (Mandos)'),
  (1, 3, 'Repertorios de Correspondencia y Abstracción de la Clave (C_rel)'),
  (1, 4, 'Operantes Automáticas y Rutinas'),
  (2, 1, 'Vinculación Mutua Arbitraria (A ↔ B)'),
  (2, 2, 'Vinculación Combinatoria (A ↔ B ↔ C) / Lectura Funcional'),
  (2, 3, 'Transformación de Funciones Estimulares Básicas'),
  (3, 1, 'Marcos de Diferencia y Oposición'),
  (3, 2, 'Marcos de Comparación (Magnitud y Cantidad)'),
  (3, 3, 'Marcos Espaciales y Temporales'),
  (3, 4, 'Marcos Jerárquicos, Categorización e Inclusión de Clase'),
  (3, 5, 'Marcos Condicionales y Causales (Si... Entonces) / Comportamiento Guiado por Reglas'),
  (4, 1, 'Toma de Perspectiva Deíctica (Teoría de la Mente desde RFT)'),
  (4, 2, 'Redes Relacionales (Analogías y Metáforas)'),
  (4, 3, 'Lenguaje Figurado y Flexibilidad Pragmática'),
  (4, 4, 'Integración con ACT (Aceptación y Compromiso) y Autorregulación');

-- 2. Programas: dominio + orden dentro del dominio
alter table programas_base
  add column dominio_id uuid references dominios_curriculo(id) on delete set null;
create index programas_base_dominio_idx on programas_base (dominio_id, clinica_id);

-- 'area' se mantiene (la usan informes, progreso, valoración, familia...) pero
-- pasa a derivarse del dominio: "1.3 · Repertorios de Correspondencia..."
create or replace function programas_base_area_desde_dominio()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.dominio_id is not null then
    select codigo || ' · ' || nombre into new.area from dominios_curriculo where id = new.dominio_id;
  end if;
  return new;
end;
$$;

create trigger programas_base_area_desde_dominio
  before insert or update of dominio_id on programas_base
  for each row execute function programas_base_area_desde_dominio();

-- Coloca un programa en un dominio y posición (1-based; null = al final) y
-- renumera el dominio destino y el de origen. Solo reordena programas del
-- mismo origen (global, o la misma clínica) y nunca los privados.
-- SECURITY INVOKER: RLS decide quién puede mover qué.
create or replace function colocar_programa_curriculo(p_id uuid, p_dominio_id uuid, p_posicion integer)
returns void language plpgsql security invoker set search_path = public as $$
declare
  v_clinica uuid;
  v_visibilidad visibilidad_programa;
  v_dominio_ant uuid;
  v_ids uuid[];
  v_pos integer;
begin
  select clinica_id, visibilidad, dominio_id into v_clinica, v_visibilidad, v_dominio_ant
  from programas_base where id = p_id;
  if not found then raise exception 'Programa no encontrado'; end if;

  -- Privados o sin dominio: no participan en el orden del currículo
  if p_dominio_id is null or (v_clinica is not null and v_visibilidad = 'privado') then
    update programas_base set dominio_id = p_dominio_id, orden = null where id = p_id;
  else
    select coalesce(array_agg(id order by orden nulls last, nombre), '{}') into v_ids
    from programas_base
    where dominio_id = p_dominio_id
      and clinica_id is not distinct from v_clinica
      and (clinica_id is null or visibilidad = 'clinica')
      and id <> p_id;

    v_pos := least(greatest(coalesce(p_posicion, cardinality(v_ids) + 1), 1), cardinality(v_ids) + 1);
    v_ids := v_ids[1:v_pos - 1] || p_id || v_ids[v_pos:];

    update programas_base p
    set orden = t.ord, dominio_id = p_dominio_id
    from unnest(v_ids) with ordinality as t(id, ord)
    where p.id = t.id and (p.orden is distinct from t.ord or p.dominio_id is distinct from p_dominio_id);
  end if;

  -- Cierra el hueco en el dominio de origen
  if v_dominio_ant is not null and v_dominio_ant is distinct from p_dominio_id then
    update programas_base p
    set orden = t.ord
    from (
      select id, row_number() over (order by orden nulls last, nombre) as ord
      from programas_base
      where dominio_id = v_dominio_ant
        and clinica_id is not distinct from v_clinica
        and (clinica_id is null or visibilidad = 'clinica')
    ) t
    where p.id = t.id and p.orden is distinct from t.ord;
  end if;
end;
$$;

-- 3. Datos: eliminar duplicado y repartir el currículo global
delete from programas_base where id = 'f466b198-71c2-4649-baea-fb66874b1a0d'; -- "Trazar Figuras Geométricas" (Habilidades Básicas), duplicado

do $$
declare
  r record;
begin
  for r in
    select d.id as dominio_id, x.nombres
    from (values
      ('1.1', array['Contacto visual','Seguir visualmente','Permanecer sentado','Esperar sin tocar','Esperar turno','Elegir entre varios estímulos','Seleccionar de un Conjunto']),
      ('1.2', array['Hacer Pedidos Utilizando Palabras']),
      ('1.3', array['Imitar un movimiento de motricidad gruesa','Imitar 2 o más Movimientos de Motricidad Gruesa','Imitar Movimientos con Objetos','Imitar Movimientos de Motricidad Fina','Imitar Movimientos Orofaciales','Imitar Vocales','Imitar Sílabas','Imitar Sonidos de Animales','Imitar Palabras','Imitar Frases y Oraciones','Imitar Volumen Vocal','Imitar Trazos Básicos','Trazar Figuras Geométricas','Colorear','Copiar Letras','Copiar Números','Igualar Imágenes','Igualar Objetos','Igualar Imágenes y Objetos']),
      ('1.4', array['Completar Canciones','Información Personal','Continuar el Alfabeto','Continuar conteo','Responder Sí o No']),
      ('2.1', array['Vincular Mutuamente Estímulos Preferidos con sus Nombres','Vincular Mutuamente Alimentos con sus Nombres','Vincular Mutuamente Personas Conocidas con sus Nombres','Vincular Mutuamente Animales de Granja con sus Nombres','Vincular Mutuamente Animales Salvajes con sus Nombres','Vincular Mutuamente Partes del Cuerpo con sus Nombres','Vincular Mutuamente Animales Marinos con sus Nombres','Vincular Mutuamente Colores con sus Nombres','Vincular Mutuamente Dibujos Animados con sus Nombres','Vincular Mutuamente Vehículos con sus Nombres','Vincular Mutuamente Utensilios de Cocina con sus Nombres','Vincular Mutuamente Prendas de Vestir con sus Nombres','Vincular Mutuamente Plantas con sus Nombres','Vincular Mutuamente Letras con sus Nombres','Vincular Mutuamente Números con sus Nombres','Vincular Mutuamente Materiales Escolares con sus Nombres','Vincular Mutuamente Dependencias de una Casa con sus Nombres','Vincular Mutuamente Herramientas con sus Nombres','Vincular Mutuamente Electrodomésticos con sus Nombres','Vincular Mutuamente Muebles con sus Nombres','Vincular Mutuamente Figuras Geométricas con sus Nombres','Vincular Mutuamente Acciones con sus Nombres','Seguir una Instrucción que Implica una Acción','Seguir Instrucciones para Dos Acciones']),
      ('2.2', array['Vincular Mutuamente Letras con sus Grafías','Vincular Mutuamente Números con sus Grafías'])
    ) as x(codigo, nombres)
    join dominios_curriculo d on d.codigo = x.codigo
  loop
    update programas_base p
    set dominio_id = r.dominio_id, orden = t.ord
    from unnest(r.nombres) with ordinality as t(nombre, ord)
    where p.nombre = t.nombre and p.clinica_id is null;
  end loop;

  if exists (select 1 from programas_base where clinica_id is null and dominio_id is null) then
    raise exception 'Quedan programas globales sin dominio';
  end if;
end;
$$;

-- Programas de clínica sin dominio: sin orden hasta que se clasifiquen
update programas_base set orden = null where clinica_id is not null and dominio_id is null;

commit;

-- Cierre de huecos al borrar
-- Al borrar un programa con posición en el currículo, cierra el hueco de su
-- dominio para que los códigos (dominio.posición) sigan siendo correlativos.
create or replace function programas_base_cerrar_hueco()
returns trigger language plpgsql set search_path = public as $$
begin
  if old.dominio_id is not null and old.orden is not null then
    update programas_base
    set orden = orden - 1
    where dominio_id = old.dominio_id
      and clinica_id is not distinct from old.clinica_id
      and (clinica_id is null or visibilidad = 'clinica')
      and orden > old.orden;
  end if;
  return old;
end;
$$;

create trigger programas_base_cerrar_hueco
  after delete on programas_base
  for each row execute function programas_base_cerrar_hueco();

-- v2 de colocar_programa_curriculo: renumera también el dominio de origen al salir del orden
create or replace function colocar_programa_curriculo(p_id uuid, p_dominio_id uuid, p_posicion integer)
returns void language plpgsql security invoker set search_path = public as $$
declare
  v_clinica uuid;
  v_visibilidad visibilidad_programa;
  v_dominio_ant uuid;
  v_ids uuid[];
  v_pos integer;
begin
  select clinica_id, visibilidad, dominio_id into v_clinica, v_visibilidad, v_dominio_ant
  from programas_base where id = p_id;
  if not found then raise exception 'Programa no encontrado'; end if;

  -- Privados o sin dominio: no participan en el orden del currículo
  if p_dominio_id is null or (v_clinica is not null and v_visibilidad = 'privado') then
    update programas_base set dominio_id = p_dominio_id, orden = null where id = p_id;
  else
    select coalesce(array_agg(id order by orden nulls last, nombre), '{}') into v_ids
    from programas_base
    where dominio_id = p_dominio_id
      and clinica_id is not distinct from v_clinica
      and (clinica_id is null or visibilidad = 'clinica')
      and id <> p_id;

    v_pos := least(greatest(coalesce(p_posicion, cardinality(v_ids) + 1), 1), cardinality(v_ids) + 1);
    v_ids := v_ids[1:v_pos - 1] || p_id || v_ids[v_pos:];

    update programas_base p
    set orden = t.ord, dominio_id = p_dominio_id
    from unnest(v_ids) with ordinality as t(id, ord)
    where p.id = t.id and (p.orden is distinct from t.ord or p.dominio_id is distinct from p_dominio_id);
  end if;

  -- Renumera el dominio de origen (cierra el hueco si el programa cambió de
  -- dominio o salió del orden, p. ej. al pasar de clínica a privado)
  if v_dominio_ant is not null then
    update programas_base p
    set orden = t.ord
    from (
      select id, row_number() over (order by orden nulls last, nombre) as ord
      from programas_base
      where dominio_id = v_dominio_ant
        and clinica_id is not distinct from v_clinica
        and (clinica_id is null or visibilidad = 'clinica')
    ) t
    where p.id = t.id and p.orden is distinct from t.ord;
  end if;
end;
$$;
