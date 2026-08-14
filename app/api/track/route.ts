import { NextResponse, type NextRequest } from 'next/server'

import { createClient } from '@/lib/supabase/server'
import { resolveCountry } from '@/lib/geo'

export const runtime = 'nodejs'

const DEDUPE_WINDOW_MS = 2 * 60 * 1000
const MAX_USER_AGENT_LENGTH = 500

function readArticleId(body: unknown): string | null {
  if (body == null || typeof body !== 'object') return null

  const candidate = (body as Record<string, unknown>).articleId ?? (body as Record<string, unknown>).article_id
  if (candidate == null) return null

  const id = String(candidate).trim()
  return id.length > 0 ? id : null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    const articleId = readArticleId(body)

    if (!articleId) {
      return NextResponse.json(
        { ok: false, error: 'articleId es requerido' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Las tres lecturas son independientes: se ejecutan en paralelo
    // para minimizar la latencia del registro (Supabase puede tardar
    // ~0.5s por consulta en proyectos free tier).
    const cutoff = new Date(Date.now() - DEDUPE_WINDOW_MS).toISOString()
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0] ?? request.headers.get('x-real-ip')

    const [articleCheck, recentCheck, country] = await Promise.all([
      // La noticia debe existir: integridad de datos, ya que article_id
      // es texto y no tiene restricción de clave foránea en el esquema real.
      supabase.from('articles').select('id').eq('id', articleId).maybeSingle(),
      // Deduplicación server-side: evita registros duplicados cuando el
      // mismo navegador dispara la visita más de una vez en pocos
      // segundos (StrictMode, reintentos, doble clic). La deduplicación
      // por sesión se maneja en el cliente con sessionStorage.
      supabase.from('article_views').select('id').eq('article_id', articleId).gte('created_at', cutoff).limit(1),
      resolveCountry(clientIp),
    ])

    if (!articleCheck.data) {
      return NextResponse.json(
        { ok: false, error: 'La noticia no existe' },
        { status: 404 }
      )
    }

    if (recentCheck.data && recentCheck.data.length > 0) {
      return NextResponse.json({ ok: true, duplicated: true })
    }

    const userAgent = (request.headers.get('user-agent') ?? '').slice(0, MAX_USER_AGENT_LENGTH) || null

    const { error } = await supabase.from('article_views').insert({
      article_id: articleId,
      country,
      user_agent: userAgent,
    })

    if (error) {
      return NextResponse.json(
        { ok: false, error: 'No se pudo registrar la visita' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true, duplicated: false })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}