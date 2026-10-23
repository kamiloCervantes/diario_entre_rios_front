'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react'

import { loginAction, type LoginState } from './actions'

const initialState: LoginState = {}

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Enlace de regreso al diario */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al diario</span>
        </Link>

        {/* Formulario de Login */}
        <form
          action={formAction}
          className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-verde-100 text-verde-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Panel Editorial</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Diario Entre Ríos · Acceso administrativo
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                placeholder="editor@diarioentrerios.com"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-verde-500/40 focus:border-verde-500 shadow-2xs transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-verde-500/40 focus:border-verde-500 shadow-2xs transition-all"
              />
            </div>
          </div>

          {state?.error && (
            <div className="text-xs sm:text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-verde-600 text-white py-3 sm:py-2.5 text-base sm:text-sm font-semibold hover:bg-verde-700 disabled:opacity-60 shadow-md active:scale-98 transition-all cursor-pointer"
          >
            {pending ? 'Ingresando…' : 'Ingresar al panel'}
          </button>
        </form>
      </div>
    </div>
  )
}
