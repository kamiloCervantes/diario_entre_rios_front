export type Category = 'Noticias' | 'Historias' | 'Investigación' | 'Opinión'

export interface Author {
  name: string
  image: string
}

export interface Article {
  id: string
  slug: string
  title: string
  subtitle: string
  excerpt: string
  body: string
  image: string
  category: Category
  categoryColor: string      // Tailwind classes e.g. "bg-verde-600 text-white"
  categoryColorLight: string // Light variant e.g. "bg-verde-50 text-verde-700"
  author: Author
  publishedAt: string        // ISO string or relative like "Hace 1 hora"
  commentsCount: number
  featured?: boolean
}

export interface BreakingNewsItem {
  id: string
  text: string
}

export interface TrendingItem {
  id: string
  slug: string
  title: string
  publishedAt: string
  rank: number
}

// API service shape for future replacement
export interface NewsApiResponse<T> {
  data: T
  total?: number
  page?: number
}
