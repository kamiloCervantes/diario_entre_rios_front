import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'

import { getArticleById } from '@/lib/api/adminService'
import ArticleForm from '@/components/admin/ArticleForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarNotaPage({ params }: Props) {
  const { id } = await params
  const article = await getArticleById(id)

  if (!article) notFound()

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Link
            href="/admin/articulos"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a artículos</span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Editar noticia
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate max-w-xl">
            {article.title}
          </p>
        </div>

        {article.status === 'published' && (
          <Link
            href={`/article/${article.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm font-medium hover:bg-slate-50 transition-colors shadow-2xs self-start sm:self-auto"
          >
            <ExternalLink className="w-4 h-4 text-slate-400" />
            <span>Ver nota en vivo</span>
          </Link>
        )}
      </div>

      <ArticleForm mode="edit" article={article} />
    </div>
  )
}
