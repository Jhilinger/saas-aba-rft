-- Se elimina la función de documentos legales / firma digital: Abacontext no
-- asume la custodia de documentos firmados. Las tablas estaban vacías.
-- Los 4 archivos del bucket "documentos-firmados" (una prueba del 2026-08-21
-- sin registro asociado) y el propio bucket se borraron antes con la Storage
-- API, porque Supabase no permite borrar de storage.objects por SQL.
begin;

drop policy if exists documentos_firmados_storage_select on storage.objects;
drop policy if exists documentos_firmados_storage_insert on storage.objects;

drop table documentos_firmados;
drop table tipos_documento_clinica;

commit;
