import { notFound } from 'next/navigation'

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
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Editar noticia</h1>
      <ArticleForm mode="edit" article={article} />
    </div>
  )
}
