-- Esquema inicial: perfiles con rol, artículos y ticker de última hora.
--
-- Cómo crear tu primer administrador (una vez aplicada esta migración):
--   1. Andá al Dashboard de Supabase → Authentication → Users → "Add user"
--      y creá un usuario con tu email y una contraseña.
--   2. Corré en el SQL Editor:
--        update public.profiles set role = 'admin'
--        where id = (select id from auth.users where email = 'tu-email@ejemplo.com');
--   3. Ya podés loguearte en /admin/login con ese usuario.

-- ─── profiles ──────────────────────────────────────────────────────────────

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

-- Crea automáticamente una fila en profiles cuando se registra un usuario nuevo.
-- security definer + search_path fijo: recomendación estándar de Supabase para
-- evitar hijacking del search_path en funciones que corren con privilegios elevados.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── helper: is_admin() ─────────────────────────────────────────────────────
-- security definer para poder leer profiles sin importar la política RLS de
-- profiles (que solo deja ver la fila propia) — evita recursión de políticas.
-- Debe crearse antes de las políticas RLS de profiles, que la usan.

create function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;

create policy "profiles: ver propio perfil o ser admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

-- ─── articles ────────────────────────────────────────────────────────────

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text not null default '',
  excerpt text not null default '',
  body text not null default '',
  image_url text not null,
  category text not null check (
    category in (
      'Local', 'Nacional', 'Policial', 'Deportes', 'Cultura', 'Economía',
      'Tecnología', 'Salud', 'Ambiente', 'Empleo', 'Ciencia', 'Opinión'
    )
  ),
  author_name text not null,
  author_image_url text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  -- Dónde aparece la nota en la portada. Independiente de "category": una nota
  -- puede tener category='Cultura' y homepage_section='local' a la vez.
  homepage_section text check (
    homepage_section in ('destacada', 'local', 'nacional', 'cronicas', 'mas_leidas')
  ),
  trending_rank smallint check (trending_rank between 1 and 5),
  comments_count integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Garantiza a nivel de base que solo una nota sea la "destacada" (hero) y que
-- no haya dos con la misma posición de tendencia.
create unique index articles_one_destacada
  on public.articles (homepage_section)
  where homepage_section = 'destacada';

create unique index articles_unique_trending_rank
  on public.articles (trending_rank)
  where trending_rank is not null;

create index articles_homepage_section_idx on public.articles (homepage_section);
create index articles_status_idx on public.articles (status);

alter table public.articles enable row level security;

create policy "articles: público ve publicadas"
  on public.articles for select
  using (status = 'published');

create policy "articles: admin ve todas"
  on public.articles for select
  using (public.is_admin());

create policy "articles: admin inserta"
  on public.articles for insert
  with check (public.is_admin());

create policy "articles: admin actualiza"
  on public.articles for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "articles: admin borra"
  on public.articles for delete
  using (public.is_admin());

-- Asigna homepage_section='destacada' a target_id y se la saca a cualquier otra
-- fila que la tuviera, en un solo round-trip (evita la carrera contra el índice
-- único de arriba que ocurriría con dos updates separados desde la aplicación).
create function public.set_homepage_destacada(target_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  update public.articles set homepage_section = null
    where homepage_section = 'destacada' and id != target_id;
  update public.articles set homepage_section = 'destacada'
    where id = target_id;
end;
$$;

-- ─── breaking_news ───────────────────────────────────────────────────────

create table public.breaking_news (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.breaking_news enable row level security;

create policy "breaking_news: público ve activas"
  on public.breaking_news for select
  using (is_active = true);

create policy "breaking_news: admin ve todas"
  on public.breaking_news for select
  using (public.is_admin());

create policy "breaking_news: admin inserta"
  on public.breaking_news for insert
  with check (public.is_admin());

create policy "breaking_news: admin actualiza"
  on public.breaking_news for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "breaking_news: admin borra"
  on public.breaking_news for delete
  using (public.is_admin());

-- ─── updated_at automático ──────────────────────────────────────────────

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger articles_set_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

create trigger breaking_news_set_updated_at
  before update on public.breaking_news
  for each row execute function public.set_updated_at();
