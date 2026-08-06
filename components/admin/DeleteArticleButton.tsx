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
      <button type="submit" className="flex items-center gap-1 text-red-600 hover:underline text-sm">
        <Trash2 className="w-3.5 h-3.5" />
        Borrar
      </button>
    </form>
  )
}
