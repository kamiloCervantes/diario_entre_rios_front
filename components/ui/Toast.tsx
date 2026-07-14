'use client'

import { useEffect, useRef } from 'react'
import { CheckCircle, X } from 'lucide-react'

export interface ToastProps {
  title: string
  message: string
  visible: boolean
  onHide: () => void
}

export default function Toast({ title, message, visible, onHide }: ToastProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (visible) {
      timerRef.current = setTimeout(onHide, 5000)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [visible, onHide])

  return (
    <div
      className={`toast fixed bottom-6 right-6 z-[200] flex items-start gap-3 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 max-w-xs ${
        visible ? 'show' : ''
      }`}
    >
      <div className="w-9 h-9 bg-verde-50 rounded-full flex items-center justify-center shrink-0">
        <CheckCircle className="w-5 h-5 text-verde-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5 leading-snug">{message}</p>
      </div>
      <button
        onClick={onHide}
        className="text-slate-400 hover:text-slate-600 transition-colors shrink-0 mt-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
