-- «Abstraer Claves Temporales»: nivel nuevo con secuencias de tres viñetas («¿Qué pasó primero?» / «¿Qué pasó lo último?»),
-- pendiente de la revisión de Stewart y Neufeld (2026-11-20). Aprobado por el usuario el 2026-11-25.
begin;
update programas_base set
  actividad_tablet = jsonb_set(actividad_tablet, '{niveles}', (actividad_tablet->'niveles') || '[{"modo": "primero_ultimo", "nombre": "Primero y último (tres)"}]'::jsonb),
  instrucciones_terapeuta = instrucciones_terapeuta || $t$

Primero y último con tres viñetas (último nivel): las tres viñetas de una secuencia salen desordenadas y se pregunta «¿Qué pasó primero?» o «¿Qué pasó lo último?», alternando. La viñeta del medio nunca es la respuesta, así que no basta con descartar un extremo: hay que ordenar las tres. Es el paso a secuencias más largas que las parejas de antes/después (Neufeld y Stewart, 2023) y prepara «Derivar Relaciones Temporales en Redes Combinatorias».$t$,
  contenido_actualizado_at = now()
where clinica_id is null and nombre = 'Abstraer Claves Temporales'
  and not (actividad_tablet->'niveles') @> '[{"modo": "primero_ultimo"}]'::jsonb;
commit;
