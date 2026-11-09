-- Versión para familias y escuelas: el tipo de cuenta decide si se entra al
-- panel profesional (centro) o a la app infantil por módulos (familia,
-- escuela). Los niños son alumnos de la cuenta, con un avatar para que se
-- reconozcan sin fotos ni nombres completos.

alter table clinicas add column if not exists tipo text not null default 'centro'
  check (tipo in ('centro', 'familia', 'escuela'));
alter table alumnos add column if not exists avatar text;

comment on column clinicas.tipo is 'centro: panel profesional; familia o escuela: app infantil por módulos (/app)';
comment on column alumnos.avatar is 'Avatar del niño en la app infantil (clave de un animal, ver app/app/avatares.ts)';
