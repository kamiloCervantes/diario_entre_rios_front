'use client'

import type { BreakingNewsItem } from '@/types/news'

interface BreakingTickerProps {
  items: BreakingNewsItem[]
}

export default function BreakingTicker({ items }: BreakingTickerProps) {
  const text = items.map((i) => i.text).join('  •  ')

  return (
    <div className="bg-verde-700 text-white overflow-hidden h-8 flex items-center relative">
      {/* Label */}
      <div className="bg-verde-900 px-4 h-full flex items-center shrink-0 z-10">
        <span className="text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          Última hora
        </span>
      </div>
      {/* Ticker */}
      <div className="overflow-hidden flex-1 ml-4">
        <div className="ticker-animate text-sm font-light">
          {text}
        </div>
      </div>
    </div>
  )
}
