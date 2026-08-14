/**
 * trackArticleView: registra la visita a una noticia.
 *
 * Se ejecuta desde el navegador (TrackView) y delega en la API route
 * POST /api/track, que valida la noticia, deduplica y guarda la
 * interacción en Supabase con los datos técnicos (país y user agent).
 *
 * Deduplicación por sesión: cada artículo solo se registra una vez
 * por sesión de navegador (sessionStorage).
 */

export async function trackArticleView(articleId: string | number): Promise<void> {
  const id = String(articleId)

  if (typeof window === 'undefined') return

  const sessionKey = `der_viewed_article_${id}`
  if (sessionStorage.getItem(sessionKey)) {
    return
  }

  try {
    const res = await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId: id }),
      keepalive: true,
    })

    if (res.ok) {
      const data = (await res.json()) as { ok: boolean; duplicated?: boolean }
      if (data.ok) {
        sessionStorage.setItem(sessionKey, 'true')
      }
    }
  } catch {
    // El tracking nunca debe interrumpir la navegación del usuario:
    // si falla (offline, timeout), se reintentará en la próxima visita.
  }
}