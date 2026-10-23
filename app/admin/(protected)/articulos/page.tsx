import Link from 'next/link'
import { Plus, Pencil, Newspaper } from 'lucide-react'

import { listAllArticles } from '@/lib/api/adminService'
import DeleteArticleButton from '@/components/admin/DeleteArticleButton'

const SECTION_LABELS: Record<string, string> = {
  destacada: 'Destacada',
  local: 'Local',
  nacional: 'Nacional',
  cronicas: 'Crónicas',
  mas_leidas: 'Más leídas',
}

export default async function ArticulosPage() {
  const articles = await listAllArticles()

  return (
    <div className="space-y-5 max-w-6xl">
      {/* ─── Encabezado ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Artículos</h1>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {articles.length} {articles.length === 1 ? 'nota' : 'notas'}
          </span>
        </div>

        <Link
          href="/admin/articulos/nuevo"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-verde-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-verde-700 active:scale-98 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva noticia</span>
        </Link>
      </div>

      {/* ─── Vista Móvil (Cards) ───────────────────────────────────────────── */}
      <div className="block md:hidden space-y-3">
        {articles.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3"
          >
            {/* Badges superiores */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {a.category}
                </span>
                {a.homepageSection && (
                  <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {SECTION_LABELS[a.homepageSection]}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  a.status === 'published'
                    ? 'bg-verde-50 text-verde-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {a.status === 'published' ? 'Publicada' : 'Borrador'}
              </span>
            </div>

            {/* Título de la nota */}
            <Link
              href={`/admin/articulos/${a.id}`}
              className="block text-sm font-bold text-slate-900 hover:text-verde-700 transition-colors leading-snug"
            >
              {a.title}
            </Link>

            {/* Acciones táctiles */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
              <span className="text-xs text-slate-400">
                {a.publishedAt
                  ? new Date(a.publishedAt).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: 'short',
                    })
                  : 'Sin publicar'}
              </span>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/articulos/${a.id}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </Link>
                <DeleteArticleButton articleId={a.id} />
              </div>
            </div>
          </div>
        ))}

        {articles.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Newspaper className="w-6 h-6" />
            </div>
            <p className="text-slate-600 font-medium">Todavía no hay notas creadas.</p>
            <Link
              href="/admin/articulos/nuevo"
              className="inline-flex items-center gap-2 rounded-full bg-verde-600 text-white px-4 py-2 text-sm font-semibold hover:bg-verde-700"
            >
              <Plus className="w-4 h-4" />
              Crear primera noticia
            </Link>
          </div>
        )}
      </div>

      {/* ─── Vista Desktop (Tabla) ─────────────────────────────────────────── */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left border-b border-slate-100">
            <tr>
              <th className="px-5 py-3.5 font-medium">Título</th>
              <th className="px-4 py-3.5 font-medium">Categoría</th>
              <th className="px-4 py-3.5 font-medium">Sección</th>
              <th className="px-4 py-3.5 font-medium">Estado</th>
              <th className="px-5 py-3.5 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {articles.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-5 py-3.5 text-slate-900 font-medium max-w-sm truncate" title={a.title}>
                  {a.title}
                </td>
                <td className="px-4 py-3.5 text-slate-600">{a.category}</td>
                <td className="px-4 py-3.5 text-slate-600">
                  {a.homepageSection ? SECTION_LABELS[a.homepageSection] : '—'}
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      a.status === 'published'
                        ? 'bg-verde-50 text-verde-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {a.status === 'published' ? 'Publicada' : 'Borrador'}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/articulos/${a.id}`}
                      className="inline-flex items-center gap-1 text-verde-600 hover:text-verde-700 hover:underline font-semibold"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </Link>
                    <DeleteArticleButton articleId={a.id} />
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                  Todavía no hay notas creadas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
