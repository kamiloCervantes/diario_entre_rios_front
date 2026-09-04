'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { requireAdmin } from '@/lib/dal'
import { CATEGORIES } from '@/lib/constants/categories'
import { slugify } from '@/lib/utils'
import {
  deleteArticleRow,
  insertArticle,
  setArticlePlacement,
  updateArticleRow,
  uploadArticleImage,
} from '@/lib/api/adminService'
import type { HomepageSection } from '@/lib/supabase/database.types'

export interface ArticleFormState {
  error?: string
}

const HOMEPAGE_SECTION_VALUES: HomepageSection[] = [
  'destacada',
  'local',
  'nacional',
  'cronicas',
  'mas_leidas',
]

async function parseArticleForm(formData: FormData, existingPublishedAt: string | null) {
  const title = String(formData.get('title') ?? '').trim()
  const category = String(formData.get('category') ?? '')
  const authorName = String(formData.get('author_name') ?? '').trim()

  if (!title) return { error: 'El título es obligatorio.' } as const
  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
    return { error: 'Elegí una categoría válida.' } as const
  }
  if (!authorName) return { error: 'El nombre del autor es obligatorio.' } as const

  // Si se sube un archivo nuevo, reemplaza la imagen; si no, se conserva la
  // que ya tenía la nota (llega en el campo oculto existing_image_url, vacío
  // en modo creación — ahí sí hace falta un archivo).
  const imageFile = formData.get('image_file')
  const existingImageUrl = String(formData.get('existing_image_url') ?? '').trim()
  let imageUrl = existingImageUrl

  if (imageFile instanceof File && imageFile.size > 0) {
    imageUrl = await uploadArticleImage(imageFile, 'covers')
  } else if (!existingImageUrl) {
    return { error: 'La imagen de portada es obligatoria.' } as const
  }

  const authorImageFile = formData.get('author_image_file')
  const existingAuthorImageUrl = String(formData.get('existing_author_image_url') ?? '').trim()
  let authorImageUrl = existingAuthorImageUrl

  if (authorImageFile instanceof File && authorImageFile.size > 0) {
    authorImageUrl = await uploadArticleImage(authorImageFile, 'authors')
  }

  const rawSlug = String(formData.get('slug') ?? '').trim()
  const slug = slugify(rawSlug || title)
  if (!slug) return { error: 'No se pudo generar un slug válido a partir del título.' } as const

  const status = formData.get('status') === 'published' ? 'published' : 'draft'

  const rawSection = String(formData.get('homepage_section') ?? '')
  const homepageSection = (
    HOMEPAGE_SECTION_VALUES.includes(rawSection as HomepageSection) ? rawSection : null
  ) as HomepageSection | null

  const rawRank = String(formData.get('trending_rank') ?? '')
  const trendingRank = rawRank ? Number(rawRank) : null

  const commentsCount = Number(formData.get('existing_comments_count') ?? 0) || 0

  const publishedAt =
    status === 'published' ? existingPublishedAt ?? new Date().toISOString() : existingPublishedAt

  return {
    slug,
    homepageSection,
    trendingRank,
    fields: {
      slug,
      title,
      subtitle: String(formData.get('subtitle') ?? '').trim(),
      excerpt: String(formData.get('excerpt') ?? '').trim(),
      body: String(formData.get('body') ?? ''),
      image_url: imageUrl,
      category,
      author_name: authorName,
      author_image_url: authorImageUrl,
      status,
      comments_count: commentsCount,
      published_at: publishedAt,
    },
  } as const
}

export async function createArticleAction(
  _prevState: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  await requireAdmin()

  const parsed = await parseArticleForm(formData, null)
  if ('error' in parsed) return { error: parsed.error }

  const { id } = await insertArticle(parsed.fields)
  await setArticlePlacement(id, parsed.homepageSection, parsed.trendingRank)

  revalidatePath('/')
  revalidatePath('/admin/articulos')
  revalidatePath(`/article/${parsed.slug}`)
  redirect('/admin/articulos')
}

export async function updateArticleAction(
  _prevState: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  await requireAdmin()

  const id = String(formData.get('id') ?? '')
  if (!id) return { error: 'Falta el identificador de la nota.' }

  const oldSlug = String(formData.get('old_slug') ?? '')
  const existingPublishedAt = (formData.get('existing_published_at') as string) || null

  const parsed = await parseArticleForm(formData, existingPublishedAt)
  if ('error' in parsed) return { error: parsed.error }

  await updateArticleRow(id, parsed.fields)
  await setArticlePlacement(id, parsed.homepageSection, parsed.trendingRank)

  revalidatePath('/')
  revalidatePath('/admin/articulos')
  if (oldSlug) revalidatePath(`/article/${oldSlug}`)
  revalidatePath(`/article/${parsed.slug}`)
  redirect('/admin/articulos')
}

export async function deleteArticleAction(formData: FormData): Promise<void> {
  await requireAdmin()

  const id = String(formData.get('id') ?? '')
  if (!id) return

  const deleted = await deleteArticleRow(id)

  revalidatePath('/')
  revalidatePath('/admin/articulos')
  if (deleted?.slug) revalidatePath(`/article/${deleted.slug}`)
  redirect('/admin/articulos')
}
