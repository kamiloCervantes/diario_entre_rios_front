'use client'

import React, { useState, useEffect } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { FiFacebook, FiTwitter } from 'react-icons/fi'
import { Link2, Check, Share2, Bookmark, Printer } from 'lucide-react'

interface ArticleShareBarProps {
  slug: string
  title: string
  subtitle?: string
}

export default function ArticleShareBar({ slug, title, subtitle }: ArticleShareBarProps) {
  const [copied, setCopied] = useState(false)
  const [directUrl, setDirectUrl] = useState('')
  const [canNativeShare, setCanNativeShare] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/article/${slug}`
      setDirectUrl(url)
      setCanNativeShare(typeof navigator !== 'undefined' && !!navigator.share)
    }
  }, [slug])

  const whatsappMessage = `${title}\n\n${directUrl}`
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(directUrl)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(directUrl)}`

  const handleCopyLink = async () => {
    try {
      if (directUrl) {
        await navigator.clipboard.writeText(directUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      }
    } catch {
      // fallback
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share && directUrl) {
      try {
        await navigator.share({
          title,
          text: subtitle || title,
          url: directUrl,
        })
      } catch {
        // user cancelled share
      }
    }
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  return (
    <div className="flex items-center justify-between flex-wrap gap-4 pt-6 border-t border-slate-200">
      {/* Botones de compartir */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
        <span className="text-xs sm:text-sm font-bold text-slate-700 mr-1">Compartir:</span>

        {/* Botón WhatsApp destacado */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartir en WhatsApp"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <FaWhatsapp className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>

        {/* Facebook */}
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartir en Facebook"
          title="Compartir en Facebook"
          className="w-9 h-9 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full flex items-center justify-center transition-colors cursor-pointer"
        >
          <FiFacebook className="w-4 h-4" />
        </a>

        {/* Twitter / X */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartir en X (Twitter)"
          title="Compartir en X"
          className="w-9 h-9 bg-sky-50 hover:bg-sky-100 text-sky-500 rounded-full flex items-center justify-center transition-colors cursor-pointer"
        >
          <FiTwitter className="w-4 h-4" />
        </a>

        {/* Copiar enlace */}
        <button
          type="button"
          onClick={handleCopyLink}
          aria-label="Copiar enlace directo"
          title="Copiar enlace directo"
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            copied
              ? 'bg-verde-100 text-verde-800 border border-verde-300'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5 text-verde-700" /> : <Link2 className="w-3.5 h-3.5" />}
          <span>{copied ? '¡Copiado!' : 'Copiar enlace'}</span>
        </button>

        {/* Native Mobile Share */}
        {canNativeShare && (
          <button
            type="button"
            onClick={handleNativeShare}
            aria-label="Más opciones para compartir"
            title="Más opciones de compartir"
            className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Utilidades: Guardar e Imprimir */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrint}
          aria-label="Imprimir noticia"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-full text-xs sm:text-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Imprimir</span>
        </button>
      </div>
    </div>
  )
}
