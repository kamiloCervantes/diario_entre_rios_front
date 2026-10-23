'use client'

import { Trash2 } from 'lucide-react'

import { deleteBreakingNewsAction } from '@/app/admin/(protected)/breaking-news/actions'

export default function DeleteBreakingNewsButton({ id }: { id: string }) {
  return (
    <form
      action={deleteBreakingNewsAction}
      onSubmit={(e) => {
        if (!confirm('¿Borrar este item del ticker?')) e.preventDefault()
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label="Borrar item del ticker"
        className="p-2.5 sm:p-2 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center justify-center cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </form>
  )
}
