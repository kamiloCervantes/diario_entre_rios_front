'use client'

import { useEffect, useState } from 'react'
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi'

export default function TopBar() {
  const [date, setDate] = useState('')

  useEffect(() => {
    setDate(
      new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    )
  }, [])

  return (
    <div className="bg-azul-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9 text-xs">
        <div className="flex items-center gap-4">
          {date && (
            <span className="hidden sm:inline text-slate-300 capitalize">{date}</span>
          )}
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300">Entre Ríos — Tu voz informativa</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="#" aria-label="Facebook" className="text-slate-300 hover:text-white transition-colors">
            <FiFacebook className="w-3.5 h-3.5" />
          </a>
          <a href="#" aria-label="Twitter" className="text-slate-300 hover:text-white transition-colors">
            <FiTwitter className="w-3.5 h-3.5" />
          </a>
          <a href="#" aria-label="Instagram" className="text-slate-300 hover:text-white transition-colors">
            <FiInstagram className="w-3.5 h-3.5" />
          </a>
          <a href="#" aria-label="YouTube" className="text-slate-300 hover:text-white transition-colors">
            <FiYoutube className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
