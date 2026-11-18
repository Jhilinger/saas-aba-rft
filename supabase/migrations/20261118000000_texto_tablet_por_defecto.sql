-- La clave y las opciones se muestran en texto en la tableta por defecto: el
-- alumno lector las tiene presentes más tiempo y, si no lee, el terapeuta se
-- las lee. Se puede desactivar por programa del alumno (solo audio); cada
-- bloque sigue registrando si se hizo con texto.

alter table programas_alumno alter column texto_tablet set default true;
update programas_alumno set texto_tablet = true where texto_tablet = false;
