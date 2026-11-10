-- Clave y opciones también en texto en la tableta (alumnos lectores): se
-- recuerda por programa del alumno y queda registrado en cada bloque, porque
-- con el texto a la vista la tarea carga menos la memoria y los resultados no
-- son directamente comparables con los de solo audio.

alter table programas_alumno add column if not exists texto_tablet boolean not null default false;
alter table bloques_ensayo_rft add column if not exists con_texto boolean not null default false;
