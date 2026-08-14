import Link from 'next/link'
import { AlertTriangle, BarChart3, Globe2, Newspaper, TrendingUp, Clock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import TopBar from '@/components/layout/TopBar'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import DashboardFilters from '@/components/analytics/DashboardFilters'

import { createClient } from '@/lib/supabase/server'
import {
  computeWindow,
  buildRanking,
  aggregateByHour,
  aggregateByCountry,
  formatNumber,
  formatDateTime,
  type AnalyticsView,
  type AnalyticsArticle,
  type RangePreset,
} from '@/lib/analytics'

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const RANKING_LIMIT = 100

function parseParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0]
  return value
}

function buildHref(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value)
  }
  const qs = search.toString()
  return qs ? `/dashboard?${qs}` : '/dashboard'
}

function StatCard({
  icon: Icon,
  iconClass,
  label,
  value,
}: {
  icon: LucideIcon
  iconClass: string
  label: string
  value: string
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconClass}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  )
}

export default async function DashboardPage({ searchParams }: Props) {
  const sp = await searchParams

  const range = parseParam(sp.range) as RangePreset | undefined
  const from = parseParam(sp.from)
  const to = parseParam(sp.to)
  const category = parseParam(sp.category)
  const sort = parseParam(sp.sort)
  const dir = parseParam(sp.dir)
  const tzOffsetMin = Number(parseParam(sp.tz)) || 0

  const window = computeWindow(range, from, to, tzOffsetMin)

  const supabase = await createClient()

  const [{ data: views, error }, { data: articlesData }] = await Promise.all([
    supabase
      .from('article_views')
      .select('id, article_id, country, created_at')
      .gte('created_at', window.fromIso)
      .lte('created_at', window.toIso),
    supabase.from('articles').select('id, title, slug, category'),
  ])

  const articles: AnalyticsArticle[] = (articlesData ?? []).map((a) => ({
    id: Number(a.id) || 0,
    title: a.title,
    slug: a.slug,
    category: a.category,
  }))

  const viewRows: AnalyticsView[] = (views ?? []).map((v) => ({
    article_id: v.article_id,
    country: v.country,
    created_at: v.created_at,
  }))

  const ranking = buildRanking(viewRows, articles, { sort, dir, category })
  const hours = aggregateByHour(viewRows, tzOffsetMin)
  const countries = aggregateByCountry(viewRows)

  const totalViews = viewRows.length
  const uniqueArticles = ranking.length
  const topCountry = countries[0]?.country ?? '—'
  const topHour = hours.reduce((max, b) => (b.count > max.count ? b : max), hours[0])
  const maxHourCount = Math.max(...hours.map((h) => h.count), 1)
  const maxCountryCount = countries[0]?.count ?? 0
  const categories = Array.from(new Set(articles.map((a) => a.category))).sort()

  const baseParams: Record<string, string | undefined> = {
    range,
    from,
    to,
    tz: String(tzOffsetMin),
    category,
  }

  function sortHref(key: 'views' | 'title') {
    const nextDir = sort === key && dir === 'desc' ? 'asc' : 'desc'
    return buildHref({ ...baseParams, sort: key, dir: nextDir })
  }

  const sortArrow = (key: 'views' | 'title') =>
    sort === key ? (dir === 'desc' ? ' ↓' : ' ↑') : ''

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopBar />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-verde-600" />
            Panel Analítico de Visitas
          </h1>
          <p className="text-slate-600 mt-1">
            Métricas de lecturas del Diario Entre Ríos · {window.label} ·{' '}
            {new Date(window.fromIso).toLocaleDateString('es-AR')} —{' '}
            {new Date(window.toIso).toLocaleDateString('es-AR')}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-semibold text-sm">No se pudieron cargar las métricas</p>
              <p className="text-sm text-red-600">{error.message}</p>
            </div>
          </div>
        )}

        <DashboardFilters current={{ range, from, to, category, sort, dir }} categories={categories} />

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 mb-8">
          <StatCard
            icon={TrendingUp}
            iconClass="bg-verde-50 text-verde-600"
            label="Total de visitas"
            value={formatNumber(totalViews)}
          />
          <StatCard
            icon={Newspaper}
            iconClass="bg-blue-50 text-blue-600"
            label="Noticias leídas"
            value={formatNumber(uniqueArticles)}
          />
          <StatCard
            icon={Globe2}
            iconClass="bg-amber-50 text-amber-600"
            label="País principal"
            value={topCountry}
          />
          <StatCard
            icon={Clock}
            iconClass="bg-purple-50 text-purple-600"
            label="Hora pico"
            value={totalViews > 0 ? `${topHour.hour}:00 (${formatNumber(topHour.count)})` : '—'}
          />
        </div>

        {totalViews === 0 && !error && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center mb-8">
            <p className="text-slate-500">
              No hay visitas registradas en el período seleccionado. Cuando los lectores abran una
              noticia, sus visitas aparecerán aquí.
            </p>
          </div>
        )}

        {totalViews > 0 && (
          <>
            {/* Ranking de noticias */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
              <div className="px-6 py-5 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">Ranking de noticias más leídas</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Haz clic en los encabezados para ordenar la tabla.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold w-12">#</th>
                      <th className="px-6 py-4 font-semibold">
                        <Link href={sortHref('title')} className="hover:text-verde-600">
                          Noticia{sortArrow('title')}
                        </Link>
                      </th>
                      <th className="px-6 py-4 font-semibold">Categoría</th>
                      <th className="px-6 py-4 font-semibold">
                        <Link href={sortHref('views')} className="hover:text-verde-600">
                          Visitas{sortArrow('views')}
                        </Link>
                      </th>
                      <th className="px-6 py-4 font-semibold">Última visita</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                    {ranking.slice(0, RANKING_LIMIT).map((entry, index) => (
                      <tr key={entry.articleId} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 text-slate-400 font-semibold">{index + 1}</td>
                        <td className="px-6 py-4 max-w-md">
                          {entry.slug ? (
                            <Link
                              href={`/article/${entry.slug}`}
                              className="font-medium text-slate-900 hover:text-verde-600 line-clamp-2"
                            >
                              {entry.title}
                            </Link>
                          ) : (
                            <span className="text-slate-400">{entry.title}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {entry.category ? (
                            <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                              {entry.category}
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-bold text-verde-700">{formatNumber(entry.views)}</td>
                        <td className="px-6 py-4 text-slate-500">{formatDateTime(entry.lastViewAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {ranking.length > RANKING_LIMIT && (
                  <p className="px-6 py-3 text-xs text-slate-400">
                    Mostrando las {RANKING_LIMIT} noticias más leídas de {formatNumber(ranking.length)}.
                  </p>
                )}
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Horas pico */}
              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-1">Horas pico de tráfico</h2>
                <p className="text-sm text-slate-500 mb-6">
                  Distribución de visitas por hora del día (hora local del lector).
                </p>
                <div className="flex items-end gap-1 h-40">
                  {hours.map((bucket) => {
                    const height = bucket.count > 0 ? Math.max((bucket.count / maxHourCount) * 100, 4) : 0
                    return (
                      <div key={bucket.hour} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className={`w-full rounded-t-md ${bucket.count > 0 ? 'bg-verde-600' : 'bg-slate-100'}`}
                          style={{ height: `${height}%` }}
                          title={`${bucket.hour}:00 — ${bucket.count} visitas`}
                        />
                        {bucket.hour % 3 === 0 && (
                          <span className="text-[10px] text-slate-400">{bucket.hour}</span>
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>00:00</span>
                  <span>12:00</span>
                  <span>23:00</span>
                </div>
              </section>

              {/* Distribución geográfica */}
              <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-1">Distribución geográfica</h2>
                <p className="text-sm text-slate-500 mb-6">
                  Lecturas agrupadas por país de origen del lector.
                </p>
                <div className="space-y-3">
                  {countries.slice(0, 8).map((country) => {
                    const pct = maxCountryCount > 0 ? (country.count / maxCountryCount) * 100 : 0
                    const share = totalViews > 0 ? (country.count / totalViews) * 100 : 0
                    return (
                      <div key={country.country}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-medium text-slate-700">{country.country}</span>
                          <span className="text-slate-500">
                            {formatNumber(country.count)} ({share.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-verde-600 rounded-full"
                            style={{ width: `${Math.max(pct, 2)}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}