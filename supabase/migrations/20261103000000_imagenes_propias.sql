-- Imágenes propias de cada centro para sus estímulos. Se registran en
-- biblioteca_imagenes como las del banco, con clinica_id (null = banco común),
-- y el archivo va a un bucket privado con una carpeta por centro: pueden ser
-- fotos del entorno real del alumno. La tableta las recibe con URLs firmadas.
begin;

alter table biblioteca_imagenes add column clinica_id uuid references clinicas(id) on delete cascade;
create index biblioteca_imagenes_clinica_idx on biblioteca_imagenes (clinica_id) where clinica_id is not null;

drop policy biblioteca_imagenes_select on biblioteca_imagenes;
create policy biblioteca_imagenes_select on biblioteca_imagenes for select to authenticated
  using (clinica_id is null or clinica_id = auth_clinica_id() or auth_rol() = 'superadmin');

create policy biblioteca_imagenes_insert_clinica on biblioteca_imagenes for insert to authenticated
  with check (clinica_id = auth_clinica_id() and auth_puede_disenar());
create policy biblioteca_imagenes_delete_clinica on biblioteca_imagenes for delete to authenticated
  using (clinica_id = auth_clinica_id() and auth_puede_disenar());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('imagenes-clinica', 'imagenes-clinica', false, 512000, array['image/webp', 'image/jpeg'])
on conflict (id) do nothing;

-- Ruta: <clinica_id>/<archivo>.webp (o .jpg: Safari no codifica webp)
create policy imagenes_clinica_select on storage.objects for select to authenticated
  using (bucket_id = 'imagenes-clinica' and (storage.foldername(name))[1] = auth_clinica_id()::text);
create policy imagenes_clinica_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'imagenes-clinica' and (storage.foldername(name))[1] = auth_clinica_id()::text and auth_puede_disenar());
create policy imagenes_clinica_delete on storage.objects for delete to authenticated
  using (bucket_id = 'imagenes-clinica' and (storage.foldername(name))[1] = auth_clinica_id()::text and auth_puede_disenar());

commit;
