'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Flame, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Article } from '@/types/news'
import CategoryTag from '@/components/ui/CategoryTag'
import SectionHeader from '@/components/ui/SectionHeader'

interface MasLeidasProps {
  articles: Article[]
  onArticleClick: (article: Article) => void
}

export default function MasLeidas({ articles, onArticleClick }: MasLeidasProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' })
  }

  return (
    <section className="bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <SectionHeader icon={Flame} title="Las Más Leídas" accentColor="bg-orange-500" />
          <div className="flex items-center gap-2">
            <button
              id="scrollLeft"
              onClick={() => scroll('left')}
              className="w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-verde-50 hover:text-verde-600 transition-colors shadow-sm"
              aria-label="Scroll izquierda"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="scrollRight"
              onClick={() => scroll('right')}
              className="w-9 h-9 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-verde-50 hover:text-verde-600 transition-colors shadow-sm"
              aria-label="Scroll derecha"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          id="masLeidas"
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto no-scrollbar pb-2"
        >
          {articles.map((article, i) => (
            <div
              key={article.id}
              className="shrink-0 w-72 sm:w-80 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group"
              onClick={() => onArticleClick(article)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onArticleClick(article)}
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="news-img object-cover transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {/* Rank badge */}
                <div className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-sm font-black text-slate-900">{i + 1}</span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <CategoryTag label={article.category} colorClass={article.categoryColor} />
                </div>
              </div>
              <div className="p-4">
                <h4 className="news-title text-sm font-bold leading-snug line-clamp-3 transition-colors duration-300">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                  <span>{article.author.name}</span>
                  <span>•</span>
                  <span>{article.publishedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
