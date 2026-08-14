-- ============================================================
-- article_views: registro de visitas a noticias
-- ============================================================
-- NOTA: la tabla ya fue creada manualmente en el entorno de
-- Supabase (Supabase UI / SQL editor) con este esquema. Esta
-- migración documenta el esquema real, habilita RLS, crea las
-- políticas de inserción/lectura pública y agrega índices de
-- soporte para las consultas del dashboard analítico.
-- Es idempotente: puede ejecutarse varias veces sin errores.
-- ============================================================

create table if not exists public.article_views (
  id bigint generated always as identity primary key,
  article_id text not null,
  country text default 'Desconocido',
  user_agent text,
  created_at timestamptz not null default now()
);

-- Índices para las consultas del dashboard (rango de fechas,
-- ranking por artículo y agrupación por país)
create index if not exists article_views_created_at_idx
  on public.article_views (created_at);

create index if not exists article_views_article_id_idx
  on public.article_views (article_id);

create index if not exists article_views_country_idx
  on public.article_views (country);

-- RLS: cualquier visitante anónimo puede insertar y leer
alter table public.article_views enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'article_views'
      and policyname = 'permitir insercion publica de visitas'
  ) then
    create policy "permitir insercion publica de visitas"
      on public.article_views for insert
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'article_views'
      and policyname = 'permitir lectura de visitas'
  ) then
    create policy "permitir lectura de visitas"
      on public.article_views for select
      using (true);
  end if;
end $$;