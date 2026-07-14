import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Diario Entre Ríos — Una corriente de periodismo independiente',
    template: '%s | Diario Entre Ríos',
  },
  description:
    'Diario Entre Ríos: noticias locales, nacionales y policiales de la provincia de Entre Ríos, Argentina. Periodismo independiente con cobertura en tiempo real.',
  keywords: ['Entre Ríos', 'noticias', 'periodismo', 'Paraná', 'Argentina', 'Concordia', 'Gualeguaychú'],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'Diario Entre Ríos',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-white font-sans text-slate-900 antialiased">
        {children}
      </body>
    </html>
  )
}
