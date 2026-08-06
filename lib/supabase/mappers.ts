import { CATEGORY_STYLES } from '@/lib/constants/categories'
import { formatRelativeTime } from '@/lib/utils'
import type { ArticleRow, BreakingNewsRow } from '@/lib/supabase/database.types'
import type { Article, BreakingNewsItem, Category, TrendingItem } from '@/types/news'

export function mapArticleRow(row: ArticleRow): Article {
  const category = row.category as Category
  const styles = CATEGORY_STYLES[category] ?? {
    color: 'bg-slate-600 text-white',
    colorLight: 'bg-slate-50 text-slate-700',
  }

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    excerpt: row.excerpt,
    body: row.body,
    image: row.image_url,
    category,
    categoryColor: styles.color,
    categoryColorLight: styles.colorLight,
    author: { name: row.author_name, image: row.author_image_url },
    publishedAt: formatRelativeTime(row.published_at),
    commentsCount: row.comments_count,
    featured: row.homepage_section === 'destacada',
  }
}

export function mapTrendingRow(row: ArticleRow, rank: number): TrendingItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    publishedAt: formatRelativeTime(row.published_at),
    rank,
  }
}

export function mapBreakingNewsRow(row: BreakingNewsRow): BreakingNewsItem {
  return { id: row.id, text: row.text }
}
