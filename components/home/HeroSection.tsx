'use client'

import Image from 'next/image'
import { Clock, MessageCircle } from 'lucide-react'
import type { Article } from '@/types/news'
import CategoryTag from '@/components/ui/CategoryTag'
import WhatsAppShareButton from '@/components/ui/WhatsAppShareButton'

interface HeroSectionProps {
  article: Article
  onArticleClick: (article: Article) => void
}

export default function HeroSection({ article, onArticleClick }: HeroSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div
        className="relative rounded-3xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-shadow"
        onClick={() => onArticleClick(article)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onArticleClick(article)}
      >
        {/* Background image */}
        <div className="relative h-[55vh] sm:h-[65vh] lg:h-[75vh]">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Top-right quick share badge */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
            <WhatsAppShareButton
              slug={article.slug}
              title={article.title}
              variant="button"
              size="sm"
              label="Compartir"
              className="backdrop-blur-sm bg-[#25D366]/90 hover:bg-[#25D366] text-white shadow-md text-xs sm:text-sm py-1.5 px-3.5"
            />
          </div>

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-14">
            <div className="max-w-4xl">
              <CategoryTag label={article.category} colorClass={article.categoryColor} className="mb-4" />
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-3">
                {article.title}
              </h1>
              <p className="text-slate-200 text-base sm:text-lg font-light leading-relaxed mb-6 max-w-2xl line-clamp-2">
                {article.subtitle}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/20">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-300">
                  <span className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-600 relative shrink-0">
                      <Image
                        src={article.author.image}
                        alt={article.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium text-white">{article.author.name}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {article.publishedAt}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4" />
                    {article.commentsCount} comentarios
                  </span>
                </div>

                <div className="hidden sm:block">
                  <WhatsAppShareButton
                    slug={article.slug}
                    title={article.title}
                    variant="hero"
                    label="Compartir en WhatsApp"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
