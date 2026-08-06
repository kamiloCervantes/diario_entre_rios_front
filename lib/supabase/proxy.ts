import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

import type { Database } from '@/lib/supabase/database.types'

// Variante del cliente Supabase para usar dentro de proxy.ts (el archivo que en
// este fork de Next.js reemplaza a middleware.ts). Lee/escribe cookies sobre el
// NextRequest/NextResponse de la request en curso en vez de sobre next/headers.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value)
          }
          response = NextResponse.next({ request })
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options)
          }
        },
      },
    }
  )

  // getUser() revalida el JWT contra el servidor de Supabase Auth (a diferencia
  // de getSession(), que solo lee la cookie) — es el chequeo recomendado en proxy.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { response, user }
}
