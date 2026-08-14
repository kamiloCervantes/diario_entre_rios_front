/**
 * Resolución de país de origen de la visita, ejecutada en el servidor
 * (Route Handler /api/track) para no depender de CORS ni exponer
 * llamadas externas en el navegador.
 *
 * Proveedores gratuitos sin API key, con reintento encadenado, timeout
 * corto y caché en memoria por IP para que solo la primera solicitud
 * de cada visitante pague la latencia del lookup.
 */

import 'server-only'

type GeoProvider = {
  url: string
  pick: (data: Record<string, unknown>) => unknown
}

const PROVIDERS: GeoProvider[] = [
  {
    url: 'https://ipwho.is/',
    pick: (d) => d.country,
  },
  {
    url: 'https://ipapi.co/json/',
    pick: (d) => d.country_name,
  },
]

const TIMEOUT_MS = 1200
const MAX_COUNTRY_LENGTH = 100
const CACHE_TTL_MS = 10 * 60 * 1000
const FALLBACK_TTL_MS = 60 * 1000
const MAX_CACHE_ENTRIES = 500

type CacheEntry = { country: string; expiresAt: number }

const cache = new Map<string, CacheEntry>()

function getCached(ip: string): string | undefined {
  const entry = cache.get(ip)
  if (!entry) return undefined
  if (Date.now() > entry.expiresAt) {
    cache.delete(ip)
    return undefined
  }
  return entry.country
}

function setCached(ip: string, country: string, ttlMs = CACHE_TTL_MS) {
  if (cache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = cache.keys().next().value
    if (oldestKey !== undefined) cache.delete(oldestKey)
  }
  cache.set(ip, { country, expiresAt: Date.now() + ttlMs })
}

export async function resolveCountry(ip?: string | null): Promise<string> {
  const cacheKey = ip?.trim() || 'default'

  const cached = getCached(cacheKey)
  if (cached) return cached

  for (const provider of PROVIDERS) {
    try {
      const res = await fetch(provider.url, {
        signal: AbortSignal.timeout(TIMEOUT_MS),
      })
      if (!res.ok) continue

      const data = (await res.json()) as Record<string, unknown>
      const country = provider.pick(data)

      if (typeof country === 'string' && country.trim()) {
        const normalized = country.trim().slice(0, MAX_COUNTRY_LENGTH)
        setCached(cacheKey, normalized)
        return normalized
      }
    } catch {
      // Proveedor no disponible o timeout: probar el siguiente
    }
  }

  // Los proveedores fallaron: cachear el fallback por un período corto
  // para no repetir los timeouts en cada visita.
  setCached(cacheKey, 'Desconocido', FALLBACK_TTL_MS)
  return 'Desconocido'
}