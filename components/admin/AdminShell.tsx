'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Newspaper,
  Radio,
  LogOut,
  Menu,
  X,
  PlusCircle,
  ExternalLink,
  Globe,
} from 'lucide-react'

import { logoutAction } from '@/app/admin/login/actions'

const NAV_ITEMS = [
  { href: '/admin', label: 'Panel', icon: LayoutDashboard },
  { href: '/admin/articulos', label: 'Artículos', icon: Newspaper },
  { href: '/admin/articulos/nuevo', label: 'Nueva noticia', icon: PlusCircle },
  { href: '/admin/breaking-news', label: 'Ticker de última hora', icon: Radio },
]

interface AdminShellProps {
  user: {
    email?: string
    role?: string
  }
  children: React.ReactNode
}

export default function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Cerrar drawer al cambiar de ruta
  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  // Evitar scroll del body cuando el drawer está abierto en móvil
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900">
      {/* ─── Top Mobile Header (md:hidden) ────────────────────────────────── */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menú de navegación"
            className="p-2 -ml-1 text-slate-700 hover:text-verde-700 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-verde-500/40"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-base tracking-tight">Diario Entre Ríos</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-verde-100 text-verde-800">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate max-w-[170px]">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="Ver sitio público"
            className="p-2 text-slate-600 hover:text-verde-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Globe className="w-5 h-5" />
          </Link>
          <Link
            href="/admin/articulos/nuevo"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-verde-600 text-white text-xs font-semibold hover:bg-verde-700 shadow-sm transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Crear</span>
          </Link>
        </div>
      </header>

      {/* ─── Mobile Drawer Overlay & Sidebar ─────────────────────────────── */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="relative w-72 max-w-[82vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div>
                <p className="font-bold text-slate-900 text-base">Panel de Control</p>
                <p className="text-xs text-slate-500 truncate max-w-[190px]">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Cerrar menú"
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav links inside drawer */}
            <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
              <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Menú Principal
              </div>
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = isActive(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-verde-50 text-verde-700 font-semibold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${active ? 'text-verde-600' : 'text-slate-400'}`} />
                      <span>{label}</span>
                    </div>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-verde-600" />}
                  </Link>
                )
              })}

              <div className="pt-3 mt-3 border-t border-slate-100">
                <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Acceso Rápido
                </div>
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ExternalLink className="w-5 h-5 text-slate-400" />
                    <span>Ver diario en vivo</span>
                  </div>
                </Link>
              </div>
            </nav>

            {/* Drawer Logout */}
            <div className="p-3 border-t border-slate-200 bg-slate-50/50">
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar sesión</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─── Desktop Sidebar (hidden on mobile, visible md:flex) ─────────── */}
      <aside className="hidden md:flex w-64 shrink-0 border-r border-slate-200 bg-white flex-col sticky top-0 h-screen">
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <p className="font-bold text-slate-900 text-base tracking-tight">Diario Entre Ríos</p>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm bg-verde-100 text-verde-800">
              Admin
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 truncate" title={user.email}>
            {user.email}
          </p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navegación
          </div>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-verde-50 text-verde-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-verde-600' : 'text-slate-400'}`} />
                  <span>{label}</span>
                </div>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-verde-600" />}
              </Link>
            )
          })}

          <div className="pt-3 mt-3 border-t border-slate-100">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ExternalLink className="w-4 h-4 text-slate-400" />
                <span>Ver diario en vivo</span>
              </div>
            </Link>
          </div>
        </nav>

        <form action={logoutAction} className="p-3 border-t border-slate-200">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </form>
      </aside>

      {/* ─── Main Content ─────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 w-full overflow-x-hidden p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
        {children}
      </main>

      {/* ─── Mobile Bottom Navigation (md:hidden) ─────────────────────────── */}
      <nav
        aria-label="Navegación inferior móvil"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 flex justify-around items-center shadow-lg"
      >
        <Link
          href="/admin"
          className={`flex flex-col items-center py-1 px-2 text-[11px] font-medium transition-colors ${
            pathname === '/admin' ? 'text-verde-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Panel</span>
        </Link>

        <Link
          href="/admin/articulos"
          className={`flex flex-col items-center py-1 px-2 text-[11px] font-medium transition-colors ${
            pathname === '/admin/articulos' ? 'text-verde-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Newspaper className="w-5 h-5 mb-0.5" />
          <span>Artículos</span>
        </Link>

        <Link
          href="/admin/articulos/nuevo"
          className="flex flex-col items-center -mt-4 py-1 px-2"
        >
          <div className="w-11 h-11 rounded-full bg-verde-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-verde-700 mt-0.5">Nueva</span>
        </Link>

        <Link
          href="/admin/breaking-news"
          className={`flex flex-col items-center py-1 px-2 text-[11px] font-medium transition-colors ${
            pathname === '/admin/breaking-news' ? 'text-verde-600 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Radio className="w-5 h-5 mb-0.5" />
          <span>Ticker</span>
        </Link>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center py-1 px-2 text-[11px] font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>Más</span>
        </button>
      </nav>
    </div>
  )
}
