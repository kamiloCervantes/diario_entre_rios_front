'use client'

import { ShieldAlert } from 'lucide-react'
import type { Article } from '@/types/news'
import SectionHeader from '@/components/ui/SectionHeader'
import NewsCard from '@/components/ui/NewsCard'

interface CronicasSectionProps {
  articles: Article[]
  onArticleClick: (article: Article) => void
}

export default function CronicasSection({ articles, onArticleClick }: CronicasSectionProps) {
  return (
    <section id="cronicas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader icon={ShieldAlert} title="Crónicas Policiales" accentColor="bg-red-600" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            variant="vertical"
            onClick={onArticleClick}
          />
        ))}
      </div>
    </section>
  )
}
