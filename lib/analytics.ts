/**
 * lib/analytics.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Funciones puras de agregación para el dashboard analítico de visitas.
 * No dependen de Next.js ni de Supabase: se pueden testear de forma aislada.
 * Se usan únicamente desde Server Components (import 'server-only').
 */

import 'server-only'

export type AnalyticsView = {
  article_id: string
  country: string | null
  created_at: string
}

export type AnalyticsArticle = {
  id: number
  title: string
  slug: string
  category: string
}

export type RangePreset = 'hoy' | 'semana' | 'mes' | 'custom'

export type AnalyticsWindow = {
  fromIso: string
  toIso: string
  label: string
}

export type RankingEntry = {
  articleId: string
  title: string
  slug: string | null
  category: string | null
  views: number
  lastViewAt: string | null
}

export type HourBucket = {
  hour: number
  count: number
}

export type CountryStat = {
  country: string
  count: number
}

export type SortKey = 'views' | 'title'
export type SortDir = 'asc' | 'desc'

// ─── Ventanas de tiempo ──────────────────────────────────────────────────────

const DAY_MS = 24 * 60 * 60 * 1000

function isValidIsoDate(value: string | undefined | null): value is string {
  if (!value) return false
  const parsed = new Date(value)
  return !Number.isNaN(parsed.getTime())
}

/**
 * Calcula la ventana [from, to] en UTC para un rango dado.
 * `tzOffsetMin` es el offset del visitante en minutos OESTE de UTC
 * (equivalente a Date.getTimezoneOffset()), usado para que "Hoy" y
 * las horas pico coincidan con la hora local del usuario.
 */
export function computeWindow(
  range: RangePreset | undefined,
  from?: string | null,
  to?: string | null,
  tzOffsetMin = 0
): AnalyticsWindow {
  const now = new Date()
  const safeTz = Number.isFinite(tzOffsetMin) ? tzOffsetMin : 0

  const wantsCustom = range === 'custom' || isValidIsoDate(from) && isValidIsoDate(to)
  if (wantsCustom) {
    if (isValidIsoDate(from) && isValidIsoDate(to)) {
      return {
        fromIso: new Date(from).toISOString(),
        toIso: new Date(to).toISOString(),
        label: 'Rango personalizado',
      }
    }
    // Rango custom inválido: caer en la ventana por defecto.
    return {
      fromIso: new Date(now.getTime() - 7 * DAY_MS).toISOString(),
      toIso: now.toISOString(),
      label: 'Última semana',
    }
  }

  if (range === 'hoy') {
    const localNow = new Date(now.getTime() - safeTz * 60 * 1000)
    const localMidnight = new Date(localNow)
    localMidnight.setUTCHours(0, 0, 0, 0)
    const start = new Date(localMidnight.getTime() + safeTz * 60 * 1000)
    return {
      fromIso: start.toISOString(),
      toIso: now.toISOString(),
      label: 'Hoy',
    }
  }

  if (range === 'mes') {
    return {
      fromIso: new Date(now.getTime() - 30 * DAY_MS).toISOString(),
      toIso: now.toISOString(),
      label: 'Último mes',
    }
  }

  return {
    fromIso: new Date(now.getTime() - 7 * DAY_MS).toISOString(),
    toIso: now.toISOString(),
    label: 'Última semana',
  }
}

// ─── Ranking de noticias ─────────────────────────────────────────────────────

export function buildRanking(
  views: AnalyticsView[],
  articles: AnalyticsArticle[],
  opts: { sort?: string; dir?: string; category?: string } = {}
): RankingEntry[] {
  const byArticle = new Map<string, { count: number; lastViewAt: string | null }>()
  for (const view of views) {
    const entry = byArticle.get(view.article_id) ?? { count: 0, lastViewAt: null }
    entry.count += 1
    if (!entry.lastViewAt || view.created_at > entry.lastViewAt) {
      entry.lastViewAt = view.created_at
    }
    byArticle.set(view.article_id, entry)
  }

  const articleById = new Map(articles.map((a) => [String(a.id), a]))

  let ranking: RankingEntry[] = Array.from(byArticle.entries()).map(([articleId, stats]) => {
    const article = articleById.get(articleId)
    return {
      articleId,
      title: article?.title ?? `Artículo no disponible (${articleId})`,
      slug: article?.slug ?? null,
      category: article?.category ?? null,
      views: stats.count,
      lastViewAt: stats.lastViewAt,
    }
  })

  const category = opts.category?.trim()
  if (category && category !== 'todas') {
    ranking = ranking.filter((entry) => entry.category === category)
  }

  const dir = opts.dir === 'asc' ? 'asc' : 'desc'
  const sort = opts.sort === 'title' ? 'title' : 'views'

  ranking.sort((a, b) => {
    if (sort === 'title') {
      const cmp = a.title.localeCompare(b.title, 'es')
      return dir === 'asc' ? cmp : -cmp
    }
    return dir === 'asc' ? a.views - b.views : b.views - a.views
  })

  return ranking
}

// ─── Horas pico ──────────────────────────────────────────────────────────────

export function aggregateByHour(views: AnalyticsView[], tzOffsetMin = 0): HourBucket[] {
  const buckets: HourBucket[] = Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 }))
  const safeTz = Number.isFinite(tzOffsetMin) ? tzOffsetMin : 0

  for (const view of views) {
    const date = new Date(view.created_at)
    if (Number.isNaN(date.getTime())) continue
    const local = new Date(date.getTime() - safeTz * 60 * 1000)
    buckets[local.getUTCHours()].count += 1
  }

  return buckets
}

// ─── Distribución geográfica ─────────────────────────────────────────────────

export function aggregateByCountry(views: AnalyticsView[]): CountryStat[] {
  const byCountry = new Map<string, number>()
  for (const view of views) {
    const country = view.country?.trim() || 'Desconocido'
    byCountry.set(country, (byCountry.get(country) ?? 0) + 1)
  }

  return Array.from(byCountry.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
}

// ─── Utilidades de presentación ──────────────────────────────────────────────

export function formatNumber(value: number): string {
  return value.toLocaleString('es-AR')
}

export function formatDateTime(iso: string | null): string {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('es-AR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
