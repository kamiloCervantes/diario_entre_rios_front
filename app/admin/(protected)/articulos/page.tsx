import Link from 'next/link'
import { Plus } from 'lucide-react'

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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Artículos</h1>
        <Link
          href="/admin/articulos/nuevo"
          className="flex items-center gap-2 rounded-full bg-verde-600 text-white px-4 py-2 text-sm font-medium hover:bg-verde-700"
        >
          <Plus className="w-4 h-4" />
          Nueva noticia
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Sección</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {articles.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3 text-slate-900 font-medium max-w-xs truncate">{a.title}</td>
                <td className="px-4 py-3 text-slate-600">{a.category}</td>
                <td className="px-4 py-3 text-slate-600">
                  {a.homepageSection ? SECTION_LABELS[a.homepageSection] : '—'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      a.status === 'published' ? 'bg-verde-50 text-verde-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {a.status === 'published' ? 'Publicada' : 'Borrador'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/admin/articulos/${a.id}`} className="text-verde-600 hover:underline">
                      Editar
                    </Link>
                    <DeleteArticleButton articleId={a.id} />
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Todavía no hay notas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
