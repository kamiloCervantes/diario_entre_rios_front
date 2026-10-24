import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, MessageCircle, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

import TopBar from '@/components/layout/TopBar'
import BreakingTicker from '@/components/layout/BreakingTicker'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CategoryTag from '@/components/ui/CategoryTag'
import NewsCard from '@/components/ui/NewsCard'
import ArticleShareBar from '@/components/ui/ArticleShareBar'
import WhatsAppShareButton from '@/components/ui/WhatsAppShareButton'

import { getArticle, getRelatedArticles, getBreakingNews } from '@/lib/api/newsService'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return { title: 'Artículo no encontrado' }

  return {
    title: article.title,
    description: article.subtitle,
    openGraph: {
      title: article.title,
      description: article.subtitle,
      images: [article.image],
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const [article, breaking] = await Promise.all([
    getArticle(slug),
    getBreakingNews(),
  ])

  if (!article) notFound()

  const related = await getRelatedArticles(slug)

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <BreakingTicker items={breaking} />
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <div className="relative h-[45vh] sm:h-[55vh] lg:h-[65vh] overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16">
            <CategoryTag label={article.category} colorClass={article.categoryColor} className="mb-3" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight max-w-4xl">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-sm text-slate-300">
              <span className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-600 overflow-hidden relative">
                  <Image src={article.author.image} alt={article.author.name} fill className="object-cover" />
                </div>
                <span className="font-medium text-white">{article.author.name}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {article.publishedAt}
              </span>
              <span className="flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5" />
                {article.commentsCount} comentarios
              </span>
            </div>
          </div>
        </div>

        {/* Back button & quick WhatsApp share */}
        <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-6 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-verde-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al inicio</span>
          </Link>

          <WhatsAppShareButton
            slug={article.slug}
            title={article.title}
            variant="button"
            size="sm"
            label="Compartir en WhatsApp"
            className="shadow-sm"
          />
        </div>

        {/* Article body */}
        <article className="max-w-3xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
          <div className="text-lg sm:text-xl text-slate-600 font-light leading-relaxed mb-8 border-l-2 border-verde-500 pl-5">
            {article.subtitle}
          </div>

          <div
            className="article-body text-base sm:text-[17px]"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

          {/* Share / save */}
          <div className="mt-12">
            <ArticleShareBar
              slug={article.slug}
              title={article.title}
              subtitle={article.subtitle}
            />
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-14 pt-8 border-t border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Noticias relacionadas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {related.map((rel) => (
                  <Link key={rel.id} href={`/article/${rel.slug}`}>
                    <NewsCard article={rel} variant="compact" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  )
}
