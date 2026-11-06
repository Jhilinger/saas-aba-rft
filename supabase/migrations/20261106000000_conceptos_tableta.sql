-- Conceptos básicos en la tableta: los programas de abstracción de claves
-- (distinción, comparación; después oposición, espaciales y temporales)
-- generan los ensayos a partir del banco de imágenes en lugar de usar clases
-- fijas. Cada nivel se registra como un grupo (A → A) y cada ensayo guarda lo
-- que se presentó, porque no hay estímulo ni clase fijos.

alter table programas_base add column if not exists actividad_tablet jsonb;
alter table programas_alumno add column if not exists actividad_tablet jsonb;
alter table ensayos_rft_detalle alter column estimulo_origen_id drop not null;
alter table ensayos_rft_detalle add column if not exists generado jsonb;

comment on column programas_base.actividad_tablet is 'Actividad generada en la tableta: {tipo: "distincion"|"comparacion"|..., niveles: [...]} (ver app/dashboard/conceptos.ts)';
comment on column programas_alumno.actividad_tablet is 'Copia de programas_base.actividad_tablet';
comment on column ensayos_rft_detalle.generado is 'Ensayo generado en la tableta: {nivel, clave, muestra, opciones, correcta, elegida} (sin estímulo ni clase fijos)';

-- Un cambio de la actividad en la plantilla también avisa a las copias
create or replace function programas_base_marcar_contenido()
returns trigger language plpgsql set search_path = public as $$
begin
  if (new.nombre, new.objetivo, new.materiales, new.instrucciones_terapeuta, new.ayudas_posibles,
      new.ensayos_por_bloque, new.bloques_para_dominio, new.porcentaje_dominio,
      new.tipo_respuesta, new.opciones_respuesta, new.respuesta_por_fase, new.secuencia_rft, new.consignas, new.actividad_tablet)
     is distinct from
     (old.nombre, old.objetivo, old.materiales, old.instrucciones_terapeuta, old.ayudas_posibles,
      old.ensayos_por_bloque, old.bloques_para_dominio, old.porcentaje_dominio,
      old.tipo_respuesta, old.opciones_respuesta, old.respuesta_por_fase, old.secuencia_rft, old.consignas, old.actividad_tablet) then
    new.contenido_actualizado_at := now();
  end if;
  return new;
end;
$$;

update programas_base set actividad_tablet = '{"tipo": "distincion", "niveles": [
  {"nombre": "Igual y diferente", "modo": "igual_diferente", "opciones": 2},
  {"nombre": "Cuál es diferente", "modo": "intruso", "opciones": 4},
  {"nombre": "Diferencias sutiles", "modo": "sutil", "opciones": 2}
]}'::jsonb
where clinica_id is null and nombre = 'Abstraer Claves de Distinción';

update programas_base set actividad_tablet = '{"tipo": "comparacion", "niveles": [
  {"nombre": "Tamaño y cantidad", "dimensiones": ["tamano", "cantidad"], "proporcion": 0.5},
  {"nombre": "Cuatro dimensiones", "dimensiones": ["tamano", "cantidad", "longitud", "altura"], "proporcion": 0.5},
  {"nombre": "El mismo, más y menos", "dimensiones": ["tamano", "cantidad", "longitud", "altura"], "proporcion": 0.5, "intermedio": true},
  {"nombre": "Diferencias pequeñas", "dimensiones": ["tamano", "cantidad", "longitud", "altura"], "proporcion": 0.72, "intermedio": true}
]}'::jsonb
where clinica_id is null and nombre = 'Abstraer Claves de Comparación';

update programas_base set instrucciones_terapeuta = instrucciones_terapeuta || E'\n\nModo tableta: la tableta genera los ensayos con imágenes del banco y alterna las claves en cada bloque. Cada nivel se registra como un grupo. Las sondas de generalización usan objetos que no han salido en el entrenamiento.'
where clinica_id is null and nombre in ('Abstraer Claves de Distinción', 'Abstraer Claves de Comparación')
  and instrucciones_terapeuta not like '%Modo tableta:%';

update programas_base set actividad_tablet = '{"tipo": "oposicion", "niveles": [
  {"nombre": "El contrario entre dos", "opciones": 2},
  {"nombre": "El contrario entre tres", "opciones": 3}
]}'::jsonb
where clinica_id is null and nombre = 'Abstraer Claves de Oposición';

update programas_base set instrucciones_terapeuta = instrucciones_terapeuta || E'\n\nModo tableta: la tableta presenta el mismo objeto en los dos polos (la misma caja abierta y cerrada) con distractores diferentes no opuestos, solo con la clave "Toca el contrario" y alternando las dimensiones (abierto/cerrado, lleno/vacío, encendido/apagado). Las sondas de generalización usan dimensiones no entrenadas: mojado/seco, limpio/sucio y caliente/frío.'
where clinica_id is null and nombre = 'Abstraer Claves de Oposición'
  and instrucciones_terapeuta not like '%Modo tableta:%';
