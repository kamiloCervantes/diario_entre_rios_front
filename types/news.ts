export type Category =
  | 'Local'
  | 'Nacional'
  | 'Policial'
  | 'Deportes'
  | 'Cultura'
  | 'Economía'
  | 'Tecnología'
  | 'Salud'
  | 'Ambiente'
  | 'Empleo'
  | 'Ciencia'
  | 'Opinión'

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

export interface MostReadItem {
  id: string
  slug: string
  title: string
  category: Category
  categoryColor: string
  image: string
  excerpt: string
  author: string
  publishedAt: string
}

// API service shape for future replacement
export interface NewsApiResponse<T> {
  data: T
  total?: number
  page?: number
}
