/**
 * newsService.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Capa de lectura pública (solo notas publicadas). Consultado por los Server
 * Components de app/page.tsx y app/article/[slug]/page.tsx — mantiene las
 * mismas firmas/formas de retorno que antes tenía con datos mock.
 * Las lecturas que necesita el panel admin (borradores incluidos, mutaciones)
 * viven en lib/api/adminService.ts.
 */

import { createClient } from '@/lib/supabase/server'
import { mapArticleRow, mapBreakingNewsRow, mapTrendingRow } from '@/lib/supabase/mappers'
import type { HomepageSection } from '@/lib/supabase/database.types'

import type { Article, BreakingNewsItem, TrendingItem } from '@/types/news'

// ─── Articles ─────────────────────────────────────────────────────────────────

export async function getAllArticles(): Promise<Article[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return (data ?? []).map(mapArticleRow)
}

export async function getFeaturedArticle(): Promise<Article> {
  const supabase = await createClient()

  const { data: destacada } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .eq('homepage_section', 'destacada')
    .limit(1)
    .maybeSingle()

  if (destacada) return mapArticleRow(destacada)

  // Fallback: si ningún admin marcó todavía una nota como destacada, mostrar
  // la más reciente publicada para que la home nunca se quede sin hero.
  const { data: fallback } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!fallback) {
    throw new Error('No hay notas publicadas todavía.')
  }

  return mapArticleRow(fallback)
}

async function getArticlesBySection(section: HomepageSection): Promise<Article[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .eq('homepage_section', section)
    .order('published_at', { ascending: false })

  return (data ?? []).map(mapArticleRow)
}

export async function getLocalArticles(): Promise<Article[]> {
  return getArticlesBySection('local')
}

export async function getNacionalArticles(): Promise<Article[]> {
  return getArticlesBySection('nacional')
}

export async function getCronicasArticles(): Promise<Article[]> {
  return getArticlesBySection('cronicas')
}

export async function getMostReadArticles(): Promise<Article[]> {
  return getArticlesBySection('mas_leidas')
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  return data ? mapArticleRow(data) : undefined
}

export async function getRelatedArticles(currentSlug: string, limit = 3): Promise<Article[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .neq('slug', currentSlug)
    .order('published_at', { ascending: false })
    .limit(limit)

  return (data ?? []).map(mapArticleRow)
}

// ─── Breaking news & trending ─────────────────────────────────────────────────

export async function getBreakingNews(): Promise<BreakingNewsItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('breaking_news')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  return (data ?? []).map(mapBreakingNewsRow)
}

export async function getTrending(): Promise<TrendingItem[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .not('trending_rank', 'is', null)
    .order('trending_rank', { ascending: true })
    .limit(5)

  return (data ?? []).map((row) => mapTrendingRow(row, row.trending_rank!))
}
