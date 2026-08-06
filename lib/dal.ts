import 'server-only'

import { cache } from 'react'
import { redirect } from 'next/navigation'
import { forbidden } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export interface CurrentUser {
  id: string
  email: string | undefined
  role: 'admin' | 'editor'
}

// cache() evita repetir la consulta a Supabase si getCurrentUser() se llama
// varias veces durante el mismo render (layout + page + acciones).
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) return null

  return { id: user.id, email: user.email, role: profile.role }
})

// Chequeo "seguro" (a diferencia del chequeo optimista en proxy.ts): además de
// verificar sesión, valida el rol contra la base. Se usa en app/admin/layout.tsx
// y en cada Server Action de mutación, porque las Server Actions son alcanzables
// directamente sin pasar por el layout.
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/admin/login')
  }

  if (user.role !== 'admin') {
    forbidden()
  }

  return user
}
