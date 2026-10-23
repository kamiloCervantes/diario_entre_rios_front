import { Radio, Plus } from 'lucide-react'

import { listBreakingNews } from '@/lib/api/adminService'
import { addBreakingNewsAction, toggleActiveAction } from './actions'
import DeleteBreakingNewsButton from '@/components/admin/DeleteBreakingNewsButton'

export default async function BreakingNewsPage() {
  const items = await listBreakingNews()

  return (
    <div className="space-y-6 max-w-4xl">
      {/* ─── Encabezado ────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Ticker de última hora
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Mensajes y alertas urgentes que se desplazan en la barra superior del sitio web.
        </p>
      </div>

      {/* ─── Formulario de creación ────────────────────────────────────────── */}
      <form
        action={addBreakingNewsAction}
        className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3"
      >
        <div className="flex-1">
          <label htmlFor="ticker_text" className="sr-only">
            Texto del ticker
          </label>
          <input
            id="ticker_text"
            name="text"
            required
            placeholder="Escribí una alerta o noticia urgente…"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-verde-500/40 focus:border-verde-500"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-24 shrink-0">
            <label htmlFor="sort_order" className="sr-only">
              Orden
            </label>
            <input
              id="sort_order"
              name="sort_order"
              type="number"
              defaultValue={items.length + 1}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-base sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-verde-500/40 focus:border-verde-500 text-center"
              placeholder="Orden"
              title="Prioridad de orden"
            />
          </div>

          <button
            type="submit"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-full bg-verde-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-verde-700 active:scale-98 shadow-sm transition-all whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar</span>
          </button>
        </div>
      </form>

      {/* ─── Listado de items del ticker ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Items activos en cinta ({items.length})</span>
          <span>Acciones</span>
        </div>

        {items.map((item) => (
          <div
            key={item.id}
            className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
          >
            <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md shrink-0">
                #{item.sort_order}
              </span>
              <p className="text-sm font-medium text-slate-800 leading-snug break-words">
                {item.text}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-50">
              <form action={toggleActiveAction}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="is_active" value={String(item.is_active)} />
                <button
                  type="submit"
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    item.is_active
                      ? 'bg-verde-50 text-verde-700 border border-verde-200/80 hover:bg-verde-100'
                      : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                  }`}
                  title="Cambiar estado en el ticker"
                >
                  {item.is_active ? '● Activo' : '○ Inactivo'}
                </button>
              </form>

              <DeleteBreakingNewsButton id={item.id} />
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-sm">
            Todavía no hay mensajes en el ticker. Agregá uno usando el formulario superior.
          </div>
        )}
      </div>
    </div>
  )
}
