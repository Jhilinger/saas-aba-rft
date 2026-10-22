-- Datos clínicos ampliados del alumno. fecha_inicio_intervencion es la base
-- para medir velocidad de aprendizaje (no tiene por qué coincidir con el
-- alta en la app). modalidad_comunicacion usa valores fijos para poder
-- agrupar en análisis.
alter table alumnos
  add column fecha_inicio_intervencion date,
  add column modalidad_comunicacion text
    check (modalidad_comunicacion in ('vocal', 'signos', 'pictogramas', 'saac', 'mixta', 'no_funcional')),
  add column idiomas_entorno text,
  add column medicacion text,
  add column otras_terapias text,
  add column conductas_riesgo text;
