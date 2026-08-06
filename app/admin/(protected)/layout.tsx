import Link from 'next/link'
import { LayoutDashboard, Newspaper, Radio, LogOut } from 'lucide-react'

import { requireAdmin } from '@/lib/dal'
import { logoutAction } from '@/app/admin/login/actions'

const NAV_ITEMS = [
  { href: '/admin', label: 'Panel', icon: LayoutDashboard },
  { href: '/admin/articulos', label: 'Artículos', icon: Newspaper },
  { href: '/admin/breaking-news', label: 'Ticker', icon: Radio },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin()

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-60 shrink-0 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-5 border-b border-slate-200">
          <p className="font-bold text-slate-900">Panel administrativo</p>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{user.email}</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-3 py-2 rounded-full text-sm text-slate-600 hover:bg-slate-50 hover:text-verde-700 transition-colors"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <form action={logoutAction} className="p-3 border-t border-slate-200">
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-full text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </form>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
