import Link from 'next/link'
import {
  Newspaper,
  CheckCircle2,
  FileText,
  Radio,
  PlusCircle,
  ExternalLink,
  ChevronRight,
  Pencil,
  Sparkles,
} from 'lucide-react'

import { getDashboardCounts, listAllArticles } from '@/lib/api/adminService'

const SECTION_LABELS: Record<string, string> = {
  destacada: 'Destacada',
  local: 'Local',
  nacional: 'Nacional',
  cronicas: 'Crónicas',
  mas_leidas: 'Más leídas',
}

function StatCard({
  label,
  value,
  icon: Icon,
  colorClass,
  bgClass,
}: {
  label: string
  value: number
  icon: any
  colorClass: string
  bgClass: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs sm:text-sm font-medium text-slate-500">{label}</span>
        <div className={`w-8 h-8 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
    </div>
  )
}

export default async function AdminDashboardPage() {
  const [counts, allArticles] = await Promise.all([
    getDashboardCounts(),
    listAllArticles(),
  ])

  const recentArticles = allArticles.slice(0, 5)

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl">
      {/* ─── Encabezado ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Panel de Control</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Gestión editorial y métricas de Diario Entre Ríos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/articulos/nuevo"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-verde-600 text-white text-sm font-semibold hover:bg-verde-700 shadow-sm active:scale-98 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nueva noticia</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Ver sitio</span>
          </Link>
        </div>
      </div>

      {/* ─── Métricas Principales ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Total de notas"
          value={counts.total}
          icon={Newspaper}
          colorClass="text-blue-600"
          bgClass="bg-blue-50"
        />
        <StatCard
          label="Publicadas"
          value={counts.published}
          icon={CheckCircle2}
          colorClass="text-verde-600"
          bgClass="bg-verde-50"
        />
        <StatCard
          label="Borradores"
          value={counts.draft}
          icon={FileText}
          colorClass="text-amber-600"
          bgClass="bg-amber-50"
        />
        <StatCard
          label="Ticker activo"
          value={counts.breakingNewsActive}
          icon={Radio}
          colorClass="text-emerald-600"
          bgClass="bg-emerald-50"
        />
      </div>

      {/* ─── Acciones Rápidas (Optimizado para móvil) ──────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/admin/articulos/nuevo"
            className="flex items-center gap-3.5 p-3.5 rounded-xl border border-verde-200 bg-verde-50/60 hover:bg-verde-50 text-verde-900 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-verde-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-verde-950">Redactar noticia</p>
              <p className="text-xs text-verde-700 truncate">Crear y publicar contenido</p>
            </div>
          </Link>

          <Link
            href="/admin/articulos"
            className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 text-slate-900 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Newspaper className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">Gestionar artículos</p>
              <p className="text-xs text-slate-500 truncate">Ver listado, editar o borrar</p>
            </div>
          </Link>

          <Link
            href="/admin/breaking-news"
            className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 text-slate-900 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Radio className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">Ticker de última hora</p>
              <p className="text-xs text-slate-500 truncate">Alertas en vivo del sitio</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ─── Últimos artículos ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Artículos recientes</h2>
            <p className="text-xs text-slate-500">Últimas noticias agregadas o modificadas</p>
          </div>
          <Link
            href="/admin/articulos"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-verde-600 hover:text-verde-700 hover:underline"
          >
            <span>Ver todos</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Lista móvil (block sm:hidden) */}
        <div className="divide-y divide-slate-100 sm:hidden">
          {recentArticles.map((article) => (
            <div key={article.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {article.category}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    article.status === 'published'
                      ? 'bg-verde-50 text-verde-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {article.status === 'published' ? 'Publicada' : 'Borrador'}
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug">
                {article.title}
              </p>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-slate-400">
                  {article.homepageSection ? SECTION_LABELS[article.homepageSection] : 'Sin sección'}
                </span>
                <Link
                  href={`/admin/articulos/${article.id}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-verde-50 text-verde-700 font-semibold hover:bg-verde-100 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </Link>
              </div>
            </div>
          ))}

          {recentArticles.length === 0 && (
            <p className="p-6 text-center text-slate-400 text-sm">Todavía no hay notas cargadas.</p>
          )}
        </div>

        {/* Tabla desktop (hidden sm:block) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left border-b border-slate-100">
              <tr>
                <th className="px-5 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Sección</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentArticles.map((article) => (
                <tr key={article.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5 text-slate-900 font-medium max-w-sm truncate">
                    {article.title}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{article.category}</td>
                  <td className="px-4 py-3.5 text-slate-500">
                    {article.homepageSection ? SECTION_LABELS[article.homepageSection] : '—'}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        article.status === 'published'
                          ? 'bg-verde-50 text-verde-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {article.status === 'published' ? 'Publicada' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/articulos/${article.id}`}
                      className="inline-flex items-center gap-1 text-verde-600 font-semibold hover:text-verde-700 hover:underline"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </Link>
                  </td>
                </tr>
              ))}
              {recentArticles.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                    Todavía no hay notas cargadas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
