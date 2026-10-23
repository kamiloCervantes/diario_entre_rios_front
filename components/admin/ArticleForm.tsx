'use client'

import { useActionState } from 'react'
import { Save, Image as ImageIcon, User, Sparkles } from 'lucide-react'

import { CATEGORIES, HOMEPAGE_SECTIONS } from '@/lib/constants/categories'
import {
  createArticleAction,
  updateArticleAction,
  type ArticleFormState,
} from '@/app/admin/(protected)/articulos/actions'
import type { ArticleRow } from '@/lib/supabase/database.types'
import CKEditor2 from '@/components/admin/ckeditor2'

const initialState: ArticleFormState = {}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-verde-500/40 focus:border-verde-500 shadow-2xs transition-all'

const fileInputClass =
  'w-full text-base sm:text-sm text-slate-500 file:mr-3 file:py-2 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-verde-50 file:text-verde-700 hover:file:bg-verde-100 cursor-pointer border border-slate-200 rounded-xl px-3 py-2 bg-white'

const labelClass = 'block text-xs sm:text-sm font-bold text-slate-700 mb-1.5'

interface Props {
  mode: 'create' | 'edit'
  article?: ArticleRow
}

export default function ArticleForm({ mode, article }: Props) {
  const action = mode === 'create' ? createArticleAction : updateArticleAction
  const [state, formAction, pending] = useActionState(action, initialState)

  return (
    <form
      action={formAction}
      className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 lg:p-8 shadow-xs space-y-6"
    >
      {mode === 'edit' && article && (
        <>
          <input type="hidden" name="id" value={article.id} />
          <input type="hidden" name="old_slug" value={article.slug} />
          <input type="hidden" name="existing_published_at" value={article.published_at ?? ''} />
          <input type="hidden" name="existing_image_url" value={article.image_url} />
          <input
            type="hidden"
            name="existing_author_image_url"
            value={article.author_image_url ?? ''}
          />
          <input
            type="hidden"
            name="existing_comments_count"
            value={article.comments_count ?? 0}
          />
        </>
      )}

      {/* ─── Título y Slug ───────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="title">
            Título de la noticia <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            defaultValue={article?.title}
            required
            placeholder="Ej: Nuevas obras viales en Paraná transformarán el acceso este"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="slug">
            Slug / Identificador URL
            <span className="text-slate-400 font-normal ml-1.5 text-xs block sm:inline">
              (Se autogenera si se deja vacío)
            </span>
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={article?.slug}
            className={inputClass}
            placeholder="nuevas-obras-viales-parana"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="subtitle">
            Subtítulo / Bajada
          </label>
          <input
            id="subtitle"
            name="subtitle"
            defaultValue={article?.subtitle}
            placeholder="Breve ampliación de la noticia"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="excerpt">
            Extracto (resumen para portada y redes)
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            defaultValue={article?.excerpt}
            rows={2}
            placeholder="Resumen conciso del contenido..."
            className={inputClass}
          />
        </div>
      </div>

      {/* ─── Cuerpo / Editor enriquecido ─────────────────────────────────── */}
      <div>
        <label className={labelClass} htmlFor="body">
          Cuerpo del artículo <span className="text-red-500">*</span>
        </label>
        <div className="rounded-xl overflow-hidden border border-slate-200">
          <CKEditor2 id="body" name="body" defaultValue={article?.body ?? ''} />
        </div>
      </div>

      {/* ─── Multimedia y Categoría ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
        <div>
          <label className={labelClass} htmlFor="image_file">
            Imagen de portada {mode === 'create' && <span className="text-red-500">*</span>}
          </label>
          {article?.image_url && (
            <div className="mb-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.image_url}
                alt="Portada actual"
                className="h-28 w-auto max-w-full rounded-xl object-cover border border-slate-200 shadow-2xs"
              />
              <p className="mt-1 text-[11px] text-slate-500">Imagen actual</p>
            </div>
          )}
          <input
            id="image_file"
            name="image_file"
            type="file"
            accept="image/*"
            required={mode === 'create'}
            className={fileInputClass}
          />
          {mode === 'edit' && (
            <p className="mt-1 text-xs text-slate-400">
              Dejá vacío para conservar la imagen actual.
            </p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="category">
            Categoría <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            defaultValue={article?.category ?? ''}
            required
            className={inputClass}
          >
            <option value="" disabled>
              Elegir categoría…
            </option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── Autor ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
        <div>
          <label className={labelClass} htmlFor="author_name">
            Nombre del autor <span className="text-red-500">*</span>
          </label>
          <input
            id="author_name"
            name="author_name"
            defaultValue={article?.author_name}
            required
            placeholder="Ej: Redacción Entre Ríos"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="author_image_file">
            Foto del autor
          </label>
          {article?.author_image_url && (
            <div className="mb-2 flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.author_image_url}
                alt="Autor"
                className="h-12 w-12 rounded-full object-cover border border-slate-200 shadow-2xs"
              />
              <span className="text-xs text-slate-500">Foto actual</span>
            </div>
          )}
          <input
            id="author_image_file"
            name="author_image_file"
            type="file"
            accept="image/*"
            className={fileInputClass}
          />
          {mode === 'edit' && (
            <p className="mt-1 text-xs text-slate-400">
              Dejá vacío para conservar la foto actual.
            </p>
          )}
        </div>
      </div>

      {/* ─── Estado y Ubicación en Portada ────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2 border-t border-slate-100">
        <div>
          <label className={labelClass} htmlFor="status">
            Estado de publicación
          </label>
          <select
            id="status"
            name="status"
            defaultValue={article?.status ?? 'draft'}
            className={inputClass}
          >
            <option value="draft">Borrador (no visible al público)</option>
            <option value="published">Publicada (visible)</option>
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="homepage_section">
            Sección en la portada
          </label>
          <select
            id="homepage_section"
            name="homepage_section"
            defaultValue={article?.homepage_section ?? ''}
            className={inputClass}
          >
            <option value="">Ninguna sección fija</option>
            {HOMEPAGE_SECTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="trending_rank">
            Ranking en tendencias
          </label>
          <select
            id="trending_rank"
            name="trending_rank"
            defaultValue={article?.trending_rank?.toString() ?? ''}
            className={inputClass}
          >
            <option value="">Sin destacar en tendencias</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                Posición #{n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── Mensaje de error ──────────────────────────────────────────────── */}
      {state?.error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start gap-2">
          <span>⚠️</span>
          <span>{state.error}</span>
        </div>
      )}

      {/* ─── Botón de guardado (móvil full width, desktop auto) ───────────── */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
        <button
          type="submit"
          disabled={pending}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-verde-600 text-white px-7 py-3 sm:py-2.5 text-base sm:text-sm font-semibold hover:bg-verde-700 disabled:opacity-60 shadow-md active:scale-98 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>
            {pending
              ? 'Guardando nota…'
              : mode === 'create'
              ? 'Crear y guardar nota'
              : 'Guardar cambios'}
          </span>
        </button>
      </div>
    </form>
  )
}
