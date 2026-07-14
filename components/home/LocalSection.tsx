'use client'

import { MapPin } from 'lucide-react'
import type { Article } from '@/types/news'
import SectionHeader from '@/components/ui/SectionHeader'
import NewsCard from '@/components/ui/NewsCard'

interface LocalSectionProps {
  articles: Article[]
  onArticleClick: (article: Article) => void
}

export default function LocalSection({ articles, onArticleClick }: LocalSectionProps) {
  const [featured, ...rest] = articles

  return (
    <section id="local" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader icon={MapPin} title="Noticias Locales" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main card */}
        {featured && (
          <div className="lg:col-span-1">
            <NewsCard article={featured} variant="vertical" onClick={onArticleClick} />
          </div>
        )}

        {/* Side cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {rest.map((article) => (
            <NewsCard key={article.id} article={article} variant="vertical" onClick={onArticleClick} />
          ))}
        </div>
      </div>
    </section>
  )
}
