import type { Category } from '@/types/news'

// Clases de Tailwind por categoría. La base de datos solo guarda el nombre de
// la categoría (texto); estas clases se resuelven acá, en un archivo fuente,
// porque Tailwind v4 escanea archivos del repo para generar CSS — clases que
// solo existieran como texto en la base de datos nunca se generarían.
export const CATEGORY_STYLES: Record<Category, { color: string; colorLight: string }> = {
  Noticias: { color: 'bg-verde-600 text-white', colorLight: 'bg-verde-50 text-verde-700' },
  Historias: { color: 'bg-amber-500 text-white', colorLight: 'bg-amber-50 text-amber-700' },
  Investigación: { color: 'bg-red-700 text-white', colorLight: 'bg-red-50 text-red-700' },
  Opinión: { color: 'bg-purple-600 text-white', colorLight: 'bg-purple-50 text-purple-700' },
}

export const CATEGORIES = Object.keys(CATEGORY_STYLES) as Category[]

export const HOMEPAGE_SECTIONS = [
  { value: 'destacada', label: 'Destacada (hero)' },
  { value: 'local', label: 'Local' },
  { value: 'nacional', label: 'Nacional' },
  { value: 'cronicas', label: 'Crónicas policiales' },
  { value: 'mas_leidas', label: 'Más leídas' },
] as const
