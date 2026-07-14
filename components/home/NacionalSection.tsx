'use client'

import { Globe } from 'lucide-react'
import type { Article, TrendingItem } from '@/types/news'
import SectionHeader from '@/components/ui/SectionHeader'
import NewsCard from '@/components/ui/NewsCard'
import TrendingList from '@/components/ui/TrendingList'

interface NacionalSectionProps {
  articles: Article[]
  trending: TrendingItem[]
  onArticleClick: (article: Article) => void
  onTrendingClick?: (item: TrendingItem) => void
}

export default function NacionalSection({
  articles,
  trending,
  onArticleClick,
  onTrendingClick,
}: NacionalSectionProps) {
  return (
    <section id="nacional" className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeader icon={Globe} title="Nacional" accentColor="bg-azul-600" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article list */}
          <div className="lg:col-span-2 space-y-5">
            {articles.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                variant="horizontal"
                onClick={onArticleClick}
              />
            ))}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <TrendingList items={trending} onItemClick={onTrendingClick} />

            {/* Weather widget */}
            <div className="bg-gradient-to-br from-azul-600 to-azul-800 rounded-2xl p-6 text-white">
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-azul-200">
                Tiempo en Paraná
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-5xl font-black">28°</p>
                  <p className="text-sm text-azul-200 mt-1">Parcialmente nublado</p>
                </div>
                <div className="text-6xl opacity-80">⛅</div>
              </div>
              <div className="border-t border-white/20 mt-4 pt-4 grid grid-cols-3 gap-2 text-center text-xs text-azul-200">
                <div><p className="font-semibold text-white">Hum.</p><p>65%</p></div>
                <div><p className="font-semibold text-white">Viento</p><p>18 km/h</p></div>
                <div><p className="font-semibold text-white">UV</p><p>Moderado</p></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
