-- Bucket de Storage para las imágenes de portada y de autor que se suben
-- desde el formulario de /admin/articulos (antes se pedía pegar una URL
-- externa; ahora se sube el archivo y se guarda en este bucket público).

insert into storage.buckets (id, name, public)
values ('article-images', 'article-images', true)
on conflict (id) do nothing;

create policy "article-images: público puede ver"
  on storage.objects for select
  using (bucket_id = 'article-images');

create policy "article-images: admin sube"
  on storage.objects for insert
  with check (bucket_id = 'article-images' and public.is_admin());

create policy "article-images: admin actualiza"
  on storage.objects for update
  using (bucket_id = 'article-images' and public.is_admin())
  with check (bucket_id = 'article-images' and public.is_admin());

create policy "article-images: admin borra"
  on storage.objects for delete
  using (bucket_id = 'article-images' and public.is_admin());
