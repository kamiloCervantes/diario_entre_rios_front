// Simple utility to merge class names without adding a dep on clsx
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

// Genera un slug a partir de un título, sacando tildes/ñ correctamente
// (ej. "Última hora: Camión volcó" -> "ultima-hora-camion-volco").
export function slugify(title: string): string {
  return title
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Formatea una fecha ISO como texto relativo en español ("Hace 5 minutos"),
// igual que los strings hardcodeados que tenían los datos mock, pero calculado
// en el momento de la lectura a partir de un timestamp real.
export function formatRelativeTime(iso: string | null): string {
  if (!iso) return ''

  const diffMs = Date.now() - new Date(iso).getTime()
  const diffMinutes = Math.round(diffMs / 60_000)

  if (diffMinutes < 1) return 'Hace un momento'
  if (diffMinutes < 60) return `Hace ${diffMinutes} minuto${diffMinutes === 1 ? '' : 's'}`

  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours === 1 ? '' : 's'}`

  const diffDays = Math.round(diffHours / 24)
  if (diffDays < 7) return `Hace ${diffDays} día${diffDays === 1 ? '' : 's'}`

  return new Date(iso).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
