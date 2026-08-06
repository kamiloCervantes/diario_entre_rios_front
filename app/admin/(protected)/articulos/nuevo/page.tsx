import ArticleForm from '@/components/admin/ArticleForm'

export default function NuevaNotaPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Nueva noticia</h1>
      <ArticleForm mode="create" />
    </div>
  )
}
