import { NextResponse, type NextRequest } from 'next/server'

import { updateSession } from '@/lib/supabase/proxy'

// En este fork de Next.js, "middleware" fue renombrado a "proxy" — ver
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request)

  // Dejar pasar siempre el login, si no nadie podría loguearse.
  if (request.nextUrl.pathname === '/admin/login') {
    return response
  }

  // Chequeo optimista: solo verifica que haya sesión. El chequeo real de rol
  // ('admin' vs 'editor') ocurre en lib/dal.ts (requireAdmin), más cerca de los
  // datos, como recomienda la guía de autenticación de Next.js.
  if (!user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
