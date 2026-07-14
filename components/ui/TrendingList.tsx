'use client'

import { TrendingUp } from 'lucide-react'
import type { TrendingItem } from '@/types/news'

interface TrendingListProps {
  items: TrendingItem[]
  onItemClick?: (item: TrendingItem) => void
}

export default function TrendingList({ items, onItemClick }: TrendingListProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp className="w-5 h-5 text-verde-600" />
        <h3 className="text-lg font-bold text-slate-900">Tendencias</h3>
      </div>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={item.id}>
            <button
              className="flex gap-3 group w-full text-left"
              onClick={() => onItemClick?.(item)}
            >
              <span className="text-3xl font-black text-verde-100 group-hover:text-verde-200 transition-colors leading-none">
                {String(item.rank).padStart(2, '0')}
              </span>
              <div>
                <h4 className="text-sm font-semibold text-slate-800 group-hover:text-verde-600 transition-colors leading-snug">
                  {item.title}
                </h4>
                <span className="text-xs text-slate-400 mt-1 block">{item.publishedAt}</span>
              </div>
            </button>
            {idx < items.length - 1 && <div className="border-t border-slate-100 mt-4" />}
          </div>
        ))}
      </div>
    </div>
  )
}
