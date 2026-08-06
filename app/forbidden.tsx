import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'

export default function Forbidden() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-slate-50">
      <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Acceso denegado</h1>
      <p className="text-slate-500 mb-6 max-w-sm">
        No tenés permisos de administrador para acceder a esta sección.
      </p>
      <Link
        href="/"
        className="rounded-full bg-verde-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-verde-700"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
