'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { X, ArrowLeft, Clock, MessageCircle } from 'lucide-react'
import type { Article } from '@/types/news'
import CategoryTag from '@/components/ui/CategoryTag'
import NewsCard from '@/components/ui/NewsCard'
import ArticleShareBar from '@/components/ui/ArticleShareBar'
import WhatsAppShareButton from '@/components/ui/WhatsAppShareButton'

interface ArticleOverlayProps {
  article: Article | null
  related: Article[]
  onClose: () => void
  onArticleSelect: (article: Article) => void
}

export default function ArticleOverlay({
  article,
  related,
  onClose,
  onArticleSelect,
}: ArticleOverlayProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && article) onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [article, onClose])

  // Lock body scroll
  useEffect(() => {
    if (article) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [article])

  return (
    <div className={`article-overlay ${article ? 'active' : ''}`} id="articleOverlay">
      {article && (
        <div className="relative">
          {/* Controls */}
          <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[110] flex items-center gap-2">
            <WhatsAppShareButton
              slug={article.slug}
              title={article.title}
              variant="button"
              size="sm"
              label="Compartir en WhatsApp"
              className="hidden sm:inline-flex shadow-lg"
            />
            <button
              id="closeArticle"
              onClick={onClose}
              className="w-10 h-10 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-lg"
              aria-label="Cerrar artículo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <button
            id="backArticle"
            onClick={onClose}
            className="fixed top-4 left-4 sm:top-6 sm:left-6 z-[110] flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white rounded-full text-sm font-medium transition-colors cursor-pointer shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver</span>
          </button>

          {/* Hero image */}
          <div className="relative h-[45vh] sm:h-[55vh] lg:h-[65vh] overflow-hidden">
            <Image
              id="articleImg"
              src={article.image}
              alt={article.title}
              fill
              className="article-hero-img object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16">
              <CategoryTag label={article.category} colorClass={article.categoryColor} className="mb-3" />
              <h1
                id="articleTitle"
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight max-w-4xl"
              >
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-600 overflow-hidden relative">
                    <Image src={article.author.image} alt={article.author.name} fill className="object-cover" />
                  </div>
                  <span id="articleAuthor" className="font-medium text-white">
                    {article.author.name}
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span id="articleTime">{article.publishedAt}</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span id="articleComments">{article.commentsCount} comentarios</span>
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
            <div
              id="articleSubtitle"
              className="text-lg sm:text-xl text-slate-600 font-light leading-relaxed mb-8 border-l-2 border-verde-500 pl-5"
            >
              {article.subtitle}
            </div>
            <div
              id="articleBody"
              className="article-body text-base sm:text-[17px]"
              dangerouslySetInnerHTML={{ __html: article.body }}
            />

            {/* Actions / Share Bar */}
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
                <div id="articleRelated" className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {related.map((rel) => (
                    <NewsCard
                      key={rel.id}
                      article={rel}
                      variant="compact"
                      onClick={(a) => {
                        const overlay = document.getElementById('articleOverlay')
                        if (overlay) overlay.scrollTop = 0
                        onArticleSelect(a)
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
