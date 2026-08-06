/**
 * adminService.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Acceso a datos para /admin: lecturas que necesitan ver TODAS las notas (sin
 * filtrar por status), no solo las publicadas. Cada función arranca validando
 * que quien la llama sea admin. Las mutaciones (crear/editar/borrar) están en
 * los archivos actions.ts de cada ruta admin, que usan el cliente Supabase
 * directamente (ahí es donde se parsea el FormData).
 */

import { requireAdmin } from '@/lib/dal'
import { createClient } from '@/lib/supabase/server'
import type {
  ArticleInsert,
  ArticleRow,
  ArticleUpdate,
  BreakingNewsRow,
  HomepageSection,
} from '@/lib/supabase/database.types'

export interface AdminArticleListItem {
  id: string
  slug: string
  title: string
  category: string
  status: ArticleRow['status']
  homepageSection: ArticleRow['homepage_section']
  publishedAt: string | null
}

export async function listAllArticles(): Promise<AdminArticleListItem[]> {
  await requireAdmin()
  const supabase = await createClient()

  const { data } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    status: row.status,
    homepageSection: row.homepage_section,
    publishedAt: row.published_at,
  }))
}

export async function getArticleById(id: string): Promise<ArticleRow | null> {
  await requireAdmin()
  const supabase = await createClient()

  const { data } = await supabase.from('articles').select('*').eq('id', id).maybeSingle()
  return data
}

export interface DashboardCounts {
  total: number
  published: number
  draft: number
  breakingNewsActive: number
}

export async function getDashboardCounts(): Promise<DashboardCounts> {
  await requireAdmin()
  const supabase = await createClient()

  const [total, published, draft, breakingNewsActive] = await Promise.all([
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase
      .from('breaking_news')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true),
  ])

  return {
    total: total.count ?? 0,
    published: published.count ?? 0,
    draft: draft.count ?? 0,
    breakingNewsActive: breakingNewsActive.count ?? 0,
  }
}

export async function listBreakingNews(): Promise<BreakingNewsRow[]> {
  await requireAdmin()
  const supabase = await createClient()

  const { data } = await supabase
    .from('breaking_news')
    .select('*')
    .order('sort_order', { ascending: true })

  return data ?? []
}

// ─── Storage: imágenes de artículos ─────────────────────────────────────────

// Sube un archivo al bucket público "article-images" y devuelve su URL
// pública. El nombre se genera acá (no se usa el del archivo original) para
// evitar colisiones y problemas con caracteres especiales.
export async function uploadArticleImage(
  file: File,
  folder: 'covers' | 'authors'
): Promise<string> {
  await requireAdmin()
  const supabase = await createClient()

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${folder}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from('article-images')
    .upload(path, file, { contentType: file.type || undefined })

  if (error) throw new Error(`No se pudo subir la imagen: ${error.message}`)

  const { data } = supabase.storage.from('article-images').getPublicUrl(path)
  return data.publicUrl
}

// ─── Mutaciones de artículos ────────────────────────────────────────────────
// La validación de FormData vive en app/admin/articulos/actions.ts; estas son
// las operaciones de base de datos que esa Server Action orquesta.

export async function insertArticle(
  data: Omit<ArticleInsert, 'homepage_section' | 'trending_rank'>
): Promise<{ id: string; slug: string }> {
  await requireAdmin()
  const supabase = await createClient()

  // homepage_section='destacada' y trending_rank se aplican después del insert
  // (ver setArticlePlacement) para no chocar contra los índices únicos
  // parciales si otra nota ya ocupaba ese lugar.
  const { data: row, error } = await supabase
    .from('articles')
    .insert({ ...data, homepage_section: null, trending_rank: null })
    .select('*')
    .single()

  if (error || !row) throw new Error(error?.message ?? 'No se pudo crear la nota.')
  return { id: row.id, slug: row.slug }
}

export async function updateArticleRow(
  id: string,
  data: Omit<ArticleUpdate, 'homepage_section' | 'trending_rank'>
): Promise<{ slug: string }> {
  await requireAdmin()
  const supabase = await createClient()

  const { data: row, error } = await supabase
    .from('articles')
    .update(data)
    .eq('id', id)
    .select('*')
    .single()

  if (error || !row) throw new Error(error?.message ?? 'No se pudo actualizar la nota.')
  return { slug: row.slug }
}

export async function deleteArticleRow(id: string): Promise<{ slug: string } | null> {
  await requireAdmin()
  const supabase = await createClient()

  const { data: row } = await supabase.from('articles').select('*').eq('id', id).maybeSingle()
  await supabase.from('articles').delete().eq('id', id)
  return row ? { slug: row.slug } : null
}

// Aplica la sección de portada y la posición de tendencia respetando los
// índices únicos parciales definidos en la migración (solo una "destacada",
// trending_rank sin repetir).
export async function setArticlePlacement(
  id: string,
  homepageSection: HomepageSection | null,
  trendingRank: number | null
): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()

  if (homepageSection === 'destacada') {
    await supabase.rpc('set_homepage_destacada', { target_id: id })
  } else {
    await supabase.from('articles').update({ homepage_section: homepageSection }).eq('id', id)
  }

  if (trendingRank !== null) {
    await supabase
      .from('articles')
      .update({ trending_rank: null })
      .eq('trending_rank', trendingRank)
      .neq('id', id)
    await supabase.from('articles').update({ trending_rank: trendingRank }).eq('id', id)
  } else {
    await supabase.from('articles').update({ trending_rank: null }).eq('id', id)
  }
}

// ─── Mutaciones de breaking news ────────────────────────────────────────────

export async function createBreakingNewsRow(text: string, sortOrder: number): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()
  await supabase.from('breaking_news').insert({ text, sort_order: sortOrder })
}

export async function toggleBreakingNewsActiveRow(id: string, isActive: boolean): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()
  await supabase.from('breaking_news').update({ is_active: isActive }).eq('id', id)
}

export async function deleteBreakingNewsRow(id: string): Promise<void> {
  await requireAdmin()
  const supabase = await createClient()
  await supabase.from('breaking_news').delete().eq('id', id)
}
