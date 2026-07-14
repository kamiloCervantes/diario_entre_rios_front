/**
 * newsService.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Abstraction layer between components and data sources.
 * Currently returns mock data; swap the implementations below to call real APIs.
 *
 * Example future replacement for getArticles():
 *   const res = await fetch('https://api.diarioentrarios.com/v1/articles')
 *   return res.json()
 */

import {
  articles,
  featuredArticle,
  localArticles,
  nacionalArticles,
  cronicasArticles,
  masLeidasArticles,
  trendingItems,
  breakingNewsItems,
  getArticleBySlug,
} from '@/lib/data/articles'

import type { Article, BreakingNewsItem, TrendingItem } from '@/types/news'

// ─── Articles ─────────────────────────────────────────────────────────────────

export async function getAllArticles(): Promise<Article[]> {
  // TODO: replace with → await fetch('/api/articles').then(r => r.json())
  return articles
}

export async function getFeaturedArticle(): Promise<Article> {
  return featuredArticle
}

export async function getLocalArticles(): Promise<Article[]> {
  return localArticles
}

export async function getNacionalArticles(): Promise<Article[]> {
  return nacionalArticles
}

export async function getCronicasArticles(): Promise<Article[]> {
  return cronicasArticles
}

export async function getMostReadArticles(): Promise<Article[]> {
  return masLeidasArticles
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  // TODO: replace with → await fetch(`/api/articles/${slug}`).then(r => r.json())
  return getArticleBySlug(slug)
}

export async function getRelatedArticles(currentSlug: string, limit = 3): Promise<Article[]> {
  const all = articles.filter((a) => a.slug !== currentSlug)
  return all.sort(() => 0.5 - Math.random()).slice(0, limit)
}

// ─── Breaking news & trending ─────────────────────────────────────────────────

export async function getBreakingNews(): Promise<BreakingNewsItem[]> {
  // TODO: replace with → await fetch('/api/breaking-news').then(r => r.json())
  return breakingNewsItems
}

export async function getTrending(): Promise<TrendingItem[]> {
  // TODO: replace with → await fetch('/api/trending').then(r => r.json())
  return trendingItems
}
