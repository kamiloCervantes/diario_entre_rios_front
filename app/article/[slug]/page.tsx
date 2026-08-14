import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, MessageCircle, ArrowLeft, Link2, Share2, Bookmark, Printer } from 'lucide-react'
import { FiFacebook, FiTwitter } from 'react-icons/fi'
import type { Metadata } from 'next'

import TopBar from '@/components/layout/TopBar'
import BreakingTicker from '@/components/layout/BreakingTicker'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CategoryTag from '@/components/ui/CategoryTag'
import NewsCard from '@/components/ui/NewsCard'
import TrackView from '@/components/analytics/TrackView'

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
      <TrackView articleId={article.id} />
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16">
            <CategoryTag label={article.category} colorClass={article.categoryColor} className="mb-3" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight max-w-4xl">
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

        {/* Back button */}
        <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-verde-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
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
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">Compartir:</span>
                {[
                  { icon: FiFacebook, bg: 'bg-blue-50 hover:bg-blue-100 text-blue-600' },
                  { icon: FiTwitter,  bg: 'bg-sky-50 hover:bg-sky-100 text-sky-500' },
                  { icon: Link2,    bg: 'bg-slate-100 hover:bg-slate-200 text-slate-600' },
                  { icon: Share2,   bg: 'bg-green-50 hover:bg-green-100 text-green-600' },
                ].map(({ icon: Icon, bg }, i) => (
                  <button key={i} className={`w-9 h-9 ${bg} rounded-full flex items-center justify-center transition-colors`}>
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-full text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  <Bookmark className="w-4 h-4" /> Guardar
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-full text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  <Printer className="w-4 h-4" /> Imprimir
                </button>
              </div>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-bold text-slate-900 mb-5">Noticias relacionadas</h3>
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
