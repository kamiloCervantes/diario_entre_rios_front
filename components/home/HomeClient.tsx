'use client'

import { useState, useCallback } from 'react'
import type { Article, TrendingItem } from '@/types/news'
import ArticleOverlay from '@/components/ui/ArticleOverlay'
import HeroSection from '@/components/home/HeroSection'
import LocalSection from '@/components/home/LocalSection'
import NacionalSection from '@/components/home/NacionalSection'
import CronicasSection from '@/components/home/CronicasSection'
import MasLeidas from '@/components/home/MasLeidas'
import Newsletter from '@/components/home/Newsletter'

interface HomeClientProps {
  featured: Article
  local: Article[]
  nacional: Article[]
  cronicas: Article[]
  masLeidas: Article[]
  trending: TrendingItem[]
  all: Article[]
}

export default function HomeClient({
  featured,
  local,
  nacional,
  cronicas,
  masLeidas,
  trending,
  all,
}: HomeClientProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])

  const openArticle = useCallback(
    (article: Article) => {
      const related = all
        .filter((a) => a.slug !== article.slug)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
      setRelatedArticles(related)
      setSelectedArticle(article)
      window.scrollTo(0, 0)
    },
    [all]
  )

  const closeArticle = useCallback(() => {
    setSelectedArticle(null)
  }, [])

  const handleTrendingClick = useCallback(
    (item: TrendingItem) => {
      const article = all.find((a) => a.slug === item.slug)
      if (article) openArticle(article)
    },
    [all, openArticle]
  )

  return (
    <>
      <ArticleOverlay
        article={selectedArticle}
        related={relatedArticles}
        onClose={closeArticle}
        onArticleSelect={openArticle}
      />

      <HeroSection article={featured} onArticleClick={openArticle} />
      <LocalSection articles={local} onArticleClick={openArticle} />
      <MasLeidas articles={masLeidas} onArticleClick={openArticle} />
      <NacionalSection
        articles={nacional}
        trending={trending}
        onArticleClick={openArticle}
        onTrendingClick={handleTrendingClick}
      />
      <CronicasSection articles={cronicas} onArticleClick={openArticle} />
      <Newsletter />
    </>
  )
}
