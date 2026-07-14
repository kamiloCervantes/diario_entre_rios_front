import Link from 'next/link'
import { Waves, Mail, Phone, MapPin } from 'lucide-react'
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi'

const sections = [
  { label: 'Local',      href: '#local' },
  { label: 'Nacional',   href: '#nacional' },
  { label: 'Policiales', href: '#cronicas' },
  { label: 'Deportes',   href: '#deportes' },
  { label: 'Cultura',    href: '#cultura' },
  { label: 'Economía',   href: '#economia' },
]

export default function Footer() {
  return (
    <footer className="bg-azul-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-verde-600 rounded-lg flex items-center justify-center">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black tracking-tight">
                Diario <span className="text-verde-400">Entre Ríos</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Una corriente de periodismo independiente. Informando a Entre Ríos desde 1998 con compromiso, rigor y cercanía.
            </p>
            <div className="flex items-center gap-3">
              {[FiFacebook, FiTwitter, FiInstagram, FiYoutube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-white/5 hover:bg-verde-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Secciones */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-verde-400 mb-4">Secciones</h4>
            <ul className="space-y-2">
              {sections.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Institución */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-verde-400 mb-4">Institución</h4>
            <ul className="space-y-2">
              {['Sobre nosotros', 'Equipo periodístico', 'Política editorial', 'Publicidad', 'Contacto', 'Términos y privacidad'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-verde-400 mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <MapPin className="w-4 h-4 shrink-0 text-verde-500" />
                Av. Urquiza 1250, Paraná, Entre Ríos
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <Phone className="w-4 h-4 shrink-0 text-verde-500" />
                (0343) 431-2000
              </li>
              <li className="flex items-center gap-2.5 text-sm text-slate-400">
                <Mail className="w-4 h-4 shrink-0 text-verde-500" />
                redaccion@diarioentreries.com.ar
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Diario Entre Ríos. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Términos</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
