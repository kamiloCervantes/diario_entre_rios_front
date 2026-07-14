'use client'

import { useState } from 'react'
import { Mail, Send } from 'lucide-react'
import Toast from '@/components/ui/Toast'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [toast, setToast] = useState({ visible: false, title: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setToast({
      visible: true,
      title: '¡Suscripción exitosa!',
      message: `Te enviaremos el boletín de Diario Entre Ríos a ${email}`,
    })
    setEmail('')
  }

  return (
    <>
      <section
        id="newsletter"
        className="bg-gradient-to-br from-verde-700 via-verde-800 to-azul-900 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Mail className="w-7 h-7 text-verde-200" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Recibí las noticias más importantes
            </h2>
            <p className="text-verde-100 text-base font-light mb-8 leading-relaxed">
              Suscribite a nuestro boletín gratuito y recibí cada mañana un resumen con lo más relevante de Entre Ríos y el país.
            </p>

            <form
              id="newsletterForm"
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                id="emailInput"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="flex-1 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-verde-200 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-verde-800 font-semibold rounded-xl hover:bg-verde-50 transition-colors text-sm"
              >
                <Send className="w-4 h-4" />
                Suscribirse
              </button>
            </form>

            <p className="mt-4 text-xs text-verde-300">
              Sin spam. Podés cancelar tu suscripción cuando quieras.
            </p>
          </div>
        </div>
      </section>

      <Toast
        title={toast.title}
        message={toast.message}
        visible={toast.visible}
        onHide={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </>
  )
}
