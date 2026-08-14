'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Menu, X, Waves } from 'lucide-react'

const navLinks = [
  { label: 'Local',        href: '#local' },
  { label: 'Nacional',     href: '#nacional' },
  { label: 'Policiales',   href: '#cronicas' },
  { label: 'Deportes',     href: '#deportes' },
  { label: 'Cultura',      href: '#cultura' },
  { label: 'Economía',     href: '#economia' },
  { label: 'Tecnología',   href: '#tecnologia' },
  { label: 'Opinión',      href: '#opinion' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main row */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-verde-600 rounded-lg flex items-center justify-center">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <span className="block text-base font-black text-slate-900 tracking-tight uppercase">
                Diario<span className="text-verde-600"> Entre Ríos</span>
              </span>
              <span className="block text-[9px] text-slate-400 tracking-[0.18em]">
                Periodismo Independiente
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-verde-600 hover:bg-verde-50 rounded-lg transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/dashboard"
              className="px-3 py-1.5 text-sm font-medium text-verde-700 hover:text-verde-600 hover:bg-verde-50 rounded-lg transition-colors duration-200"
            >
              Analíticas
            </Link>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              id="searchToggle"
              onClick={() => setSearchOpen((o) => !o)}
              className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-verde-600 hover:bg-verde-50 rounded-lg transition-colors"
              aria-label="Buscar"
            >
              <Search className="w-4.5 h-4.5 w-5 h-5" />
            </button>
            <button
              id="menuToggle"
              onClick={() => setMenuOpen((o) => !o)}
              className="lg:hidden w-9 h-9 flex items-center justify-center text-slate-600 hover:text-verde-600 hover:bg-verde-50 rounded-lg transition-colors"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link
              href="#newsletter"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-verde-600 hover:bg-verde-700 text-white text-sm font-semibold rounded-lg transition-colors duration-200"
            >
              Suscribirse
            </Link>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div id="searchBar" className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                placeholder="Buscar noticias en Diario Entre Ríos..."
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-verde-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      <div
        id="mobileMenu"
        className={`mobile-menu lg:hidden border-t border-slate-100 ${menuOpen ? 'open' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-verde-600 hover:bg-verde-50 rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-2.5 text-sm font-medium text-verde-700 hover:text-verde-600 hover:bg-verde-50 rounded-lg transition-colors"
          >
            Analíticas
          </Link>
          <Link
            href="#newsletter"
            onClick={() => setMenuOpen(false)}
            className="mt-2 px-3 py-2.5 bg-verde-600 text-white text-sm font-semibold rounded-lg text-center"
          >
            Suscribirse al boletín
          </Link>
        </div>
      </div>
    </nav>
  )
}
