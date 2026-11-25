-- Corrección del error en la tableta en todas las abstracciones (antes solo en Abstraer Claves Temporales)
update programas_base set instrucciones_terapeuta = rtrim(instrucciones_terapeuta, E' \r\n') || $t$

Corrección del error (entrenamiento): tras un error, la tableta deja solo la respuesta correcta para que el alumno la toque y repite el ensayo sin ayuda. El ensayo cuenta como error; la repetición se guarda aparte y no cuenta para el porcentaje (Barry, Neufeld y Stewart, 2024). No se aplica en los tests, como hablante ni cuando se eligen ayudas de menor a mayor.$t$, contenido_actualizado_at = now()
where clinica_id is null and activo and actividad_tablet is not null and actividad_tablet->>'tipo' <> 'temporal'
  and position('Corrección del error' in instrucciones_terapeuta) = 0;
