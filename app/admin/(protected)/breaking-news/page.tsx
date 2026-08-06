import { listBreakingNews } from '@/lib/api/adminService'
import { addBreakingNewsAction, toggleActiveAction } from './actions'
import DeleteBreakingNewsButton from '@/components/admin/DeleteBreakingNewsButton'

export default async function BreakingNewsPage() {
  const items = await listBreakingNews()

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Ticker de última hora</h1>

      <form
        action={addBreakingNewsAction}
        className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 flex flex-col sm:flex-row gap-3"
      >
        <input
          name="text"
          required
          placeholder="Texto del ticker…"
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-verde-500/40 focus:border-verde-500"
        />
        <input
          name="sort_order"
          type="number"
          defaultValue={items.length}
          className="w-full sm:w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-verde-500/40 focus:border-verde-500"
          placeholder="Orden"
        />
        <button
          type="submit"
          className="rounded-full bg-verde-600 text-white px-5 py-2 text-sm font-medium hover:bg-verde-700"
        >
          Agregar
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 px-4 py-3">
            <span className="text-xs text-slate-400 w-8 shrink-0">#{item.sort_order}</span>
            <p className="flex-1 text-sm text-slate-800">{item.text}</p>

            <form action={toggleActiveAction}>
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="is_active" value={String(item.is_active)} />
              <button
                type="submit"
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  item.is_active ? 'bg-verde-50 text-verde-700' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {item.is_active ? 'Activo' : 'Inactivo'}
              </button>
            </form>

            <DeleteBreakingNewsButton id={item.id} />
          </div>
        ))}

        {items.length === 0 && (
          <p className="px-4 py-8 text-center text-slate-400 text-sm">Todavía no hay items en el ticker.</p>
        )}
      </div>
    </div>
  )
}
