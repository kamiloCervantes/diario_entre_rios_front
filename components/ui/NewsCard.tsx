'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Clock, MessageCircle } from 'lucide-react'
import type { Article } from '@/types/news'
import CategoryTag from './CategoryTag'

interface NewsCardProps {
  article: Article
  variant?: 'vertical' | 'horizontal' | 'compact'
  onClick?: (article: Article) => void
}

export default function NewsCard({ article, variant = 'vertical', onClick }: NewsCardProps) {
  const handleClick = () => onClick?.(article)

  if (variant === 'compact') {
    return (
      <article
        className="news-card group cursor-pointer"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      >
        <div className="overflow-hidden rounded-xl mb-3">
          <Image
            src={article.image}
            alt={article.title}
            width={400}
            height={250}
            className="news-img w-full h-36 object-cover transition-transform duration-500"
          />
        </div>
        <CategoryTag label={article.category} colorClass={article.categoryColor} className="mb-2" />
        <h4 className="news-title text-sm font-semibold leading-snug line-clamp-2 transition-colors duration-300">
          {article.title}
        </h4>
      </article>
    )
  }

  if (variant === 'horizontal') {
    return (
      <article
        className="news-card group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      >
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-64 shrink-0 overflow-hidden">
            <Image
              src={article.image}
              alt={article.title}
              width={400}
              height={300}
              className="news-img w-full h-48 sm:h-full object-cover transition-transform duration-500"
            />
          </div>
          <div className="p-5 flex flex-col justify-center">
            <CategoryTag
              label={article.category}
              colorClass={article.categoryColorLight}
              className="mb-2 self-start"
            />
            <h3 className="news-title text-lg font-semibold leading-snug transition-colors duration-300">
              {article.title}
            </h3>
            <p className="text-sm text-slate-500 mt-2 line-clamp-2 font-light">{article.excerpt}</p>
            <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
              <span>{article.author.name}</span>
              <span>•</span>
              <span>{article.publishedAt}</span>
            </div>
          </div>
        </div>
      </article>
    )
  }

  // Vertical (default)
  return (
    <article
      className="news-card group cursor-pointer"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className="overflow-hidden rounded-2xl mb-4">
        <Image
          src={article.image}
          alt={article.title}
          width={800}
          height={500}
          className="news-img w-full h-52 object-cover transition-transform duration-500"
        />
      </div>
      <CategoryTag label={article.category} colorClass={article.categoryColor} className="mb-3" />
      <h3 className="news-title text-lg font-bold leading-snug mb-2 transition-colors duration-300">
        {article.title}
      </h3>
      <p className="text-sm text-slate-500 line-clamp-2 font-light leading-relaxed">
        {article.excerpt}
      </p>
      <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {article.publishedAt}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="w-3.5 h-3.5" />
          {article.commentsCount}
        </span>
      </div>
    </article>
  )
}
