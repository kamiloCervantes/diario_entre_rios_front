/**
 * Resolución de país de origen de la visita, ejecutada en el servidor
 * (Route Handler /api/track) para no depender de CORS ni exponer
 * llamadas externas en el navegador.
 *
 * Proveedores gratuitos sin API key, con reintento encadenado y
 * timeout corto para no degradar la respuesta del tracking.
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

const TIMEOUT_MS = 2500
const MAX_COUNTRY_LENGTH = 100

export async function resolveCountry(): Promise<string> {
  for (const provider of PROVIDERS) {
    try {
      const res = await fetch(provider.url, {
        signal: AbortSignal.timeout(TIMEOUT_MS),
      })
      if (!res.ok) continue

      const data = (await res.json()) as Record<string, unknown>
      const country = provider.pick(data)

      if (typeof country === 'string' && country.trim()) {
        return country.trim().slice(0, MAX_COUNTRY_LENGTH)
      }
    } catch {
      // Proveedor no disponible o timeout: probar el siguiente
    }
  }

  return 'Desconocido'
}