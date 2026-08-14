'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Calendar, ChevronDown, SlidersHorizontal } from 'lucide-react'

export type DashboardFilterState = {
  range?: string
  from?: string
  to?: string
  category?: string
  sort?: string
  dir?: string
}

interface DashboardFiltersProps {
  current: DashboardFilterState
  categories: string[]
}

const PRESETS = [
  { key: 'hoy', label: 'Hoy' },
  { key: 'semana', label: 'Última semana' },
  { key: 'mes', label: 'Último mes' },
  { key: 'custom', label: 'Rango personalizado' },
]

function toLocalDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function DashboardFilters({ current, categories }: DashboardFiltersProps) {
  const router = useRouter()
  const tzOffsetMin = new Date().getTimezoneOffset()

  const [customFrom, setCustomFrom] = useState(() => {
    if (current.range === 'custom' && current.from) {
      return current.from.slice(0, 10)
    }
    const d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - tzOffsetMin * 60 * 1000)
    return toLocalDateString(d)
  })
  const [customTo, setCustomTo] = useState(() => {
    if (current.range === 'custom' && current.to) {
      return current.to.slice(0, 10)
    }
    return toLocalDateString(new Date())
  })

  function navigate(params: Record<string, string | undefined>) {
    const search = new URLSearchParams()
    for (const [key, value] of Object.entries({ ...current, ...params })) {
      if (value) search.set(key, value)
    }
    const qs = search.toString()
    router.replace(qs ? `/dashboard?${qs}` : '/dashboard')
  }

  function localMidnightIso(dateStr: string): string {
    const [y, m, d] = dateStr.split('-').map(Number)
    return new Date(Date.UTC(y, m - 1, d) + tzOffsetMin * 60 * 1000).toISOString()
  }

  function applyPreset(key: string) {
    const now = new Date()
    const tzMs = tzOffsetMin * 60 * 1000

    if (key === 'hoy') {
      const today = new Date(now.getTime() - tzMs)
      navigate({ range: 'hoy', from: localMidnightIso(toLocalDateString(today)), to: now.toISOString() })
      return
    }

    if (key === 'mes') {
      navigate({ range: 'mes', from: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), to: now.toISOString() })
      return
    }

    if (key === 'semana') {
      navigate({ range: 'semana', from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), to: now.toISOString() })
      return
    }

    navigate({ range: 'custom', from: localMidnightIso(customFrom), to: new Date(Date.parse(`${customTo}T23:59:59`) + tzMs).toISOString() })
  }

  const activeRange = current.range ?? 'semana'

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-slate-600">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-semibold">Filtros</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.key}
              onClick={() => applyPreset(preset.key)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeRange === preset.key
                  ? 'bg-verde-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-verde-50 hover:text-verde-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-verde-500 focus:border-transparent"
              aria-label="Fecha desde"
            />
          </div>
          <span className="text-slate-400 text-sm">a</span>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-verde-500 focus:border-transparent"
              aria-label="Fecha hasta"
            />
          </div>
          <button
            onClick={() => applyPreset('custom')}
            className="px-4 py-2 bg-verde-600 hover:bg-verde-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Aplicar
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-slate-600">
          <ChevronDown className="w-4 h-4" />
          <span className="text-sm font-semibold">Categoría</span>
        </div>
        <select
          value={current.category ?? 'todas'}
          onChange={(e) => navigate({ category: e.target.value === 'todas' ? undefined : e.target.value })}
          className="px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-verde-500"
        >
          <option value="todas">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}