import { getDashboardCounts } from '@/lib/api/adminService'

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  )
}

export default async function AdminDashboardPage() {
  const counts = await getDashboardCounts()

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Panel</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Notas totales" value={counts.total} />
        <StatCard label="Publicadas" value={counts.published} />
        <StatCard label="Borradores" value={counts.draft} />
        <StatCard label="Ticker activo" value={counts.breakingNewsActive} />
      </div>
    </div>
  )
}
