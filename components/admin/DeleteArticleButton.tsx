'use client'

import { Trash2 } from 'lucide-react'

import { deleteArticleAction } from '@/app/admin/(protected)/articulos/actions'

export default function DeleteArticleButton({ articleId }: { articleId: string }) {
  return (
    <form
      action={deleteArticleAction}
      onSubmit={(e) => {
        if (!confirm('¿Borrar esta nota? Esta acción no se puede deshacer.')) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name="id" value={articleId} />
      <button
        type="submit"
        aria-label="Borrar nota"
        className="flex items-center justify-center gap-1.5 px-3 py-2 sm:px-2.5 sm:py-1 rounded-xl text-red-600 hover:bg-red-50 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
      >
        <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
        <span>Borrar</span>
      </button>
    </form>
  )
}
