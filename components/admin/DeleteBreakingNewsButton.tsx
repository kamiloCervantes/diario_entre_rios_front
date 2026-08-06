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
      <button type="submit" className="text-red-600 hover:underline">
        <Trash2 className="w-4 h-4" />
      </button>
    </form>
  )
}
