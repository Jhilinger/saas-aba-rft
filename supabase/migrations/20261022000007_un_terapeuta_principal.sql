-- Como mucho un terapeuta principal por alumno (antes solo lo garantizaba el
-- formulario de Alumnos; la pantalla de inicio y otras muestran "el" principal)
create unique index alumno_terapeuta_un_principal
  on alumno_terapeuta (alumno_id) where es_principal;
