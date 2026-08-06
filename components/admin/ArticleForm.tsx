'use client'

import { useActionState } from 'react'

import { CATEGORIES, HOMEPAGE_SECTIONS } from '@/lib/constants/categories'
import { createArticleAction, updateArticleAction, type ArticleFormState } from '@/app/admin/(protected)/articulos/actions'
import type { ArticleRow } from '@/lib/supabase/database.types'

const initialState: ArticleFormState = {}

const inputClass =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-verde-500/40 focus:border-verde-500'

const labelClass = 'block text-sm font-medium text-slate-700 mb-1'

interface Props {
  mode: 'create' | 'edit'
  article?: ArticleRow
}

export default function ArticleForm({ mode, article }: Props) {
  const action = mode === 'create' ? createArticleAction : updateArticleAction
  const [state, formAction, pending] = useActionState(action, initialState)

  return (
    <form action={formAction} className="max-w-3xl space-y-5">
      {mode === 'edit' && article && (
        <>
          <input type="hidden" name="id" value={article.id} />
          <input type="hidden" name="old_slug" value={article.slug} />
          <input type="hidden" name="existing_published_at" value={article.published_at ?? ''} />
        </>
      )}

      <div>
        <label className={labelClass} htmlFor="title">Título</label>
        <input id="title" name="title" defaultValue={article?.title} required className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="slug">
          Slug <span className="text-slate-400 font-normal">(se genera automáticamente del título si se deja vacío)</span>
        </label>
        <input id="slug" name="slug" defaultValue={article?.slug} className={inputClass} placeholder="mi-nota-de-ejemplo" />
      </div>

      <div>
        <label className={labelClass} htmlFor="subtitle">Subtítulo</label>
        <input id="subtitle" name="subtitle" defaultValue={article?.subtitle} className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="excerpt">Extracto</label>
        <textarea id="excerpt" name="excerpt" defaultValue={article?.excerpt} rows={2} className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="body">
          Cuerpo <span className="text-slate-400 font-normal">(HTML simple: &lt;p&gt;, &lt;blockquote&gt;)</span>
        </label>
        <textarea id="body" name="body" defaultValue={article?.body} rows={10} className={`${inputClass} font-mono text-xs`} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass} htmlFor="image_url">URL de imagen</label>
          <input id="image_url" name="image_url" defaultValue={article?.image_url} required placeholder="https://..." className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="category">Categoría</label>
          <select id="category" name="category" defaultValue={article?.category ?? ''} required className={inputClass}>
            <option value="" disabled>Elegir categoría…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass} htmlFor="author_name">Autor</label>
          <input id="author_name" name="author_name" defaultValue={article?.author_name} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="author_image_url">URL de foto del autor</label>
          <input id="author_image_url" name="author_image_url" defaultValue={article?.author_image_url} placeholder="https://..." className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label className={labelClass} htmlFor="status">Estado</label>
          <select id="status" name="status" defaultValue={article?.status ?? 'draft'} className={inputClass}>
            <option value="draft">Borrador</option>
            <option value="published">Publicada</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="homepage_section">Sección de portada</label>
          <select id="homepage_section" name="homepage_section" defaultValue={article?.homepage_section ?? ''} className={inputClass}>
            <option value="">Ninguna</option>
            {HOMEPAGE_SECTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="trending_rank">Posición en tendencias</label>
          <select id="trending_rank" name="trending_rank" defaultValue={article?.trending_rank?.toString() ?? ''} className={inputClass}>
            <option value="">Ninguna</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="comments_count">Cantidad de comentarios</label>
        <input
          id="comments_count"
          name="comments_count"
          type="number"
          min={0}
          defaultValue={article?.comments_count ?? 0}
          className={`${inputClass} max-w-[10rem]`}
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-verde-600 text-white px-6 py-2.5 text-sm font-medium hover:bg-verde-700 disabled:opacity-60"
      >
        {pending ? 'Guardando…' : mode === 'create' ? 'Crear nota' : 'Guardar cambios'}
      </button>
    </form>
  )
}
