'use client'

import React, { useState, useEffect } from 'react'
import { FaWhatsapp } from 'react-icons/fa'

interface WhatsAppShareButtonProps {
  slug: string
  title: string
  variant?: 'icon' | 'badge' | 'button' | 'hero'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

export default function WhatsAppShareButton({
  slug,
  title,
  variant = 'icon',
  size = 'md',
  className = '',
  label,
}: WhatsAppShareButtonProps) {
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin
      const directUrl = `${origin}/article/${slug}`
      const message = `${title}\n\n${directUrl}`
      setShareUrl(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`)
    }
  }, [slug, title])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!shareUrl && typeof window !== 'undefined') {
      const origin = window.location.origin
      const directUrl = `${origin}/article/${slug}`
      const message = `${title}\n\n${directUrl}`
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  if (variant === 'button' || variant === 'hero') {
    return (
      <a
        href={shareUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label="Compartir en WhatsApp"
        title="Compartir por WhatsApp"
        className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all shadow-sm active:scale-95 cursor-pointer ${
          variant === 'hero'
            ? 'bg-[#25D366] text-white hover:bg-[#20ba59] px-4 py-2 text-xs sm:text-sm backdrop-blur-xs'
            : 'bg-[#25D366] text-white hover:bg-[#20ba59] px-5 py-2.5 text-sm'
        } ${className}`}
      >
        <FaWhatsapp className={iconSizes[size]} />
        <span>{label || 'WhatsApp'}</span>
      </a>
    )
  }

  if (variant === 'badge') {
    return (
      <a
        href={shareUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label="Compartir en WhatsApp"
        title="Compartir por WhatsApp"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-[#25D366] hover:text-white border border-emerald-200/80 transition-colors shadow-2xs cursor-pointer ${className}`}
      >
        <FaWhatsapp className="w-3.5 h-3.5" />
        <span>{label || 'Compartir'}</span>
      </a>
    )
  }

  // Default: variant === 'icon'
  const buttonDimensions = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-9 h-9',
  }

  return (
    <a
      href={shareUrl || '#'}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label="Compartir en WhatsApp"
      title="Compartir en WhatsApp"
      className={`inline-flex items-center justify-center rounded-full bg-emerald-50 hover:bg-[#25D366] text-emerald-700 hover:text-white transition-all shadow-2xs hover:shadow-xs active:scale-90 cursor-pointer ${buttonDimensions[size]} ${className}`}
    >
      <FaWhatsapp className={iconSizes[size]} />
    </a>
  )
}
