import TopBar from '@/components/layout/TopBar'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { BarChart3 } from 'lucide-react'

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopBar />
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-slate-300" />
            <div className="h-8 w-64 bg-slate-200 animate-pulse rounded-lg" />
          </div>
          <div className="h-4 w-96 max-w-full bg-slate-200 animate-pulse rounded mt-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200">
              <div className="h-4 w-24 bg-slate-200 animate-pulse rounded" />
              <div className="h-8 w-16 bg-slate-200 animate-pulse rounded mt-3" />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="h-5 w-52 bg-slate-200 animate-pulse rounded mb-6" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-slate-100 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}