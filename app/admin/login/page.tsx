'use client'

import { useActionState } from 'react'

import { loginAction, type LoginState } from './actions'

const initialState: LoginState = {}

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <form
        action={formAction}
        className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
      >
        <h1 className="text-xl font-bold text-slate-900 mb-1">Panel administrativo</h1>
        <p className="text-sm text-slate-500 mb-6">Diario Entre Ríos</p>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-verde-500/40 focus:border-verde-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-verde-500/40 focus:border-verde-500"
            />
          </div>
        </div>

        {state?.error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-full bg-verde-600 text-white py-2.5 text-sm font-medium hover:bg-verde-700 disabled:opacity-60"
        >
          {pending ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  )
}
