-- Reduce las categorías de 12 a 4: Noticias, Historias, Investigación, Opinión.
-- Primero borra el check constraint viejo (si no, el UPDATE de abajo viola el
-- constraint de 12 categorías al escribir valores que todavía no son válidos
-- para él), después remapea las notas existentes y por último agrega el
-- constraint nuevo.

-- Encuentra y borra el check constraint existente de la columna category sin
-- depender de adivinar su nombre autogenerado.
do $$
declare
  existing_constraint text;
begin
  select conname into existing_constraint
  from pg_constraint
  where conrelid = 'public.articles'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) ilike '%category%';

  if existing_constraint is not null then
    execute format('alter table public.articles drop constraint %I', existing_constraint);
  end if;
end $$;

update public.articles set category = case category
  when 'Local'       then 'Noticias'
  when 'Nacional'    then 'Noticias'
  when 'Deportes'    then 'Noticias'
  when 'Economía'    then 'Noticias'
  when 'Tecnología'  then 'Noticias'
  when 'Salud'       then 'Noticias'
  when 'Ambiente'    then 'Noticias'
  when 'Empleo'      then 'Noticias'
  when 'Cultura'     then 'Historias'
  when 'Policial'    then 'Investigación'
  when 'Ciencia'     then 'Investigación'
  when 'Opinión'     then 'Opinión'
  else category
end
where category not in ('Noticias', 'Historias', 'Investigación', 'Opinión');

alter table public.articles
  add constraint articles_category_check
  check (category in ('Noticias', 'Historias', 'Investigación', 'Opinión'));
