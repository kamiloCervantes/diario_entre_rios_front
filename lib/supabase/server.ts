import 'server-only'

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

import type { Database } from '@/lib/supabase/database.types'

// Cliente Supabase para usar en Server Components, Server Actions y Route Handlers.
// No usar en componentes cliente ('use client') — el import 'server-only' hace
// fallar el build si eso llega a pasar.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options)
            }
          } catch {
            // Se llama desde un Server Component (no una Server Action ni un
            // Route Handler): no se pueden escribir cookies acá. La sesión se
            // refresca igual en proxy.ts, así que esto es seguro de ignorar.
          }
        },
      },
    }
  )
}
