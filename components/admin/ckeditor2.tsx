'use client'

import { useEffect, useRef, useState } from 'react'

export interface CKEditor2Props {
  id?: string
  name?: string
  defaultValue?: string
  value?: string
  placeholder?: string
  onChange?: (data: string) => void
  disabled?: boolean
}

let ckeditorScriptPromise: Promise<any> | null = null

function loadCKEditorScript(): Promise<any> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window not available'))
  }

  if ((window as any).ClassicEditor) {
    return Promise.resolve((window as any).ClassicEditor)
  }

  if (!ckeditorScriptPromise) {
    ckeditorScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://cdn.ckeditor.com/ckeditor5/41.4.2/classic/ckeditor.js'
      script.async = true
      script.onload = () => {
        if ((window as any).ClassicEditor) {
          resolve((window as any).ClassicEditor)
        } else {
          reject(new Error('ClassicEditor not found on window'))
        }
      }
      script.onerror = () => {
        ckeditorScriptPromise = null
        reject(new Error('Failed to load CKEditor script'))
      }
      document.body.appendChild(script)
    })
  }

  return ckeditorScriptPromise
}

export default function CKEditor2({
  id = 'body',
  name = 'body',
  defaultValue = '',
  value,
  placeholder = 'Escribe el contenido de la noticia...',
  onChange,
  disabled = false,
}: CKEditor2Props) {
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const editorInstanceRef = useRef<any>(null)
  const [content, setContent] = useState<string>(value ?? defaultValue ?? '')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const isUpdatingRef = useRef<boolean>(false)

  // Sincronizar contenido si la prop value cambia externamente
  useEffect(() => {
    if (value !== undefined && value !== content) {
      setContent(value)
      if (editorInstanceRef.current && !isUpdatingRef.current) {
        editorInstanceRef.current.setData(value)
      }
    }
  }, [value, content])

  useEffect(() => {
    let isMounted = true

    loadCKEditorScript()
      .then((ClassicEditor) => {
        if (!isMounted || !editorContainerRef.current) return

        if (editorInstanceRef.current) {
          editorInstanceRef.current.destroy().catch(() => {})
          editorInstanceRef.current = null
        }

        return ClassicEditor.create(editorContainerRef.current, {
          placeholder: placeholder,
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            '|',
            'blockQuote',
            'insertTable',
            'undo',
            'redo',
          ],
          heading: {
            options: [
              { model: 'paragraph', title: 'Párrafo', class: 'ck-heading_paragraph' },
              { model: 'heading2', view: 'h2', title: 'Subtítulo (H2)', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h3', title: 'Encabezado (H3)', class: 'ck-heading_heading3' },
            ],
          },
          table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
          },
        })
      })
      .then((editor) => {
        if (!isMounted) {
          editor?.destroy().catch(() => {})
          return
        }

        if (editor) {
          editorInstanceRef.current = editor
          setIsLoading(false)

          const initialVal = value ?? defaultValue ?? ''
          if (initialVal) {
            editor.setData(initialVal)
          }

          if (disabled) {
            editor.enableReadOnlyMode('ckeditor2-disabled')
          }

          editor.model.document.on('change:data', () => {
            isUpdatingRef.current = true
            const data = editor.getData()
            setContent(data)
            onChange?.(data)
            isUpdatingRef.current = false
          })
        }
      })
      .catch((err) => {
        console.error('Error initializing CKEditor2:', err)
        setIsLoading(false)
      })

    return () => {
      isMounted = false
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy().catch((err: any) => {
          console.warn('Error destroying CKEditor instance:', err)
        })
        editorInstanceRef.current = null
      }
    }
  }, [placeholder, disabled])

  return (
    <div className="ckeditor-wrapper relative w-full">
      {isLoading && (
        <div className="flex items-center gap-2 py-4 px-3 text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-lg animate-pulse mb-2">
          <div className="w-4 h-4 border-2 border-verde-600 border-t-transparent rounded-full animate-spin" />
          <span>Cargando editor de texto...</span>
        </div>
      )}

      <div
        ref={editorContainerRef}
        style={{ display: isLoading ? 'none' : 'block' }}
      />

      {/* Hidden textarea to submit with form data and Next.js Server Actions */}
      <textarea
        id={id}
        name={name}
        value={content}
        onChange={(e) => {
          setContent(e.target.value)
          onChange?.(e.target.value)
        }}
        style={{ display: 'none' }}
        readOnly
      />
    </div>
  )
}
