// Tipos escritos a mano porque todavía no existe un proyecto Supabase real del
// que generarlos. Deben reflejar exactamente las columnas de
// supabase/migrations/20260727120000_init_schema.sql.
//
// Una vez que el proyecto exista, se pueden regenerar (y luego diffear contra
// este archivo) con:
//   npx supabase gen types typescript --project-id <tu-project-id> > lib/supabase/database.types.ts
//
// Nota: se usan "type" en vez de "interface" para los Row a propósito — las
// interfaces no tienen firma de índice implícita y no satisfacen el
// Record<string, unknown> que exige el tipo GenericTable de @supabase/postgrest-js,
// lo que hace que TypeScript infiera "never" en los resultados de .select().

export type ArticleStatus = 'draft' | 'published'

export type HomepageSection = 'destacada' | 'local' | 'nacional' | 'cronicas' | 'mas_leidas'

export type ArticleRow = {
  id: string
  slug: string
  title: string
  subtitle: string
  excerpt: string
  body: string
  image_url: string
  category: string
  author_name: string
  author_image_url: string
  status: ArticleStatus
  homepage_section: HomepageSection | null
  trending_rank: number | null
  comments_count: number
  published_at: string | null
  created_at: string
  updated_at: string
}

export type ArticleInsert = Partial<
  Pick<
    ArticleRow,
    | 'id'
    | 'status'
    | 'homepage_section'
    | 'trending_rank'
    | 'comments_count'
    | 'published_at'
    | 'created_at'
    | 'updated_at'
  >
> &
  Pick<
    ArticleRow,
    | 'slug'
    | 'title'
    | 'subtitle'
    | 'excerpt'
    | 'body'
    | 'image_url'
    | 'category'
    | 'author_name'
    | 'author_image_url'
  >

export type ArticleUpdate = Partial<ArticleInsert>

export type BreakingNewsRow = {
  id: string
  text: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export type BreakingNewsInsert = Partial<
  Pick<BreakingNewsRow, 'id' | 'is_active' | 'sort_order' | 'created_at' | 'updated_at'>
> &
  Pick<BreakingNewsRow, 'text'>

export type BreakingNewsUpdate = Partial<BreakingNewsInsert>

export type ProfileRow = {
  id: string
  role: 'admin' | 'editor'
  created_at: string
}

export type ArticleViewRow = {
  id: number
  article_id: string
  country: string | null
  user_agent: string | null
  created_at: string
}

export type ArticleViewInsert = Pick<ArticleViewRow, 'article_id'> &
  Partial<Pick<ArticleViewRow, 'country' | 'user_agent'>>

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: ArticleRow
        Insert: ArticleInsert
        Update: ArticleUpdate
        Relationships: []
      }
      breaking_news: {
        Row: BreakingNewsRow
        Insert: BreakingNewsInsert
        Update: BreakingNewsUpdate
        Relationships: []
      }
      profiles: {
        Row: ProfileRow
        Insert: Pick<ProfileRow, 'id'> & Partial<Pick<ProfileRow, 'role' | 'created_at'>>
        Update: Partial<Pick<ProfileRow, 'role'>>
        Relationships: []
      }
      article_views: {
        Row: ArticleViewRow
        Insert: ArticleViewInsert
        Update: Partial<ArticleViewInsert>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      set_homepage_destacada: {
        Args: { target_id: string }
        Returns: undefined
      }
    }
  }
}
