import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import ArticleForm from '@/components/admin/ArticleForm'

export default function NuevaNotaPage() {
  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <Link
          href="/admin/articulos"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a artículos</span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Nueva noticia
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Completá los campos y el contenido para redactar la noticia.
        </p>
      </div>

      <ArticleForm mode="create" />
    </div>
  )
}
