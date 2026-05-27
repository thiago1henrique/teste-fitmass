'use client'

import { useTransition, useState, useCallback, useRef } from 'react'
import DOMPurify from 'dompurify'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapImage from '@tiptap/extension-image'
import TiptapLink from '@tiptap/extension-link'

/* ─── Types ──────────────────────────────────────────────────────────────── */

const CATEGORIES = ['Saúde', 'Bioscan', 'Profissionais', 'System', 'Corporativo', 'Estabelecimentos', 'App', 'Scanner']

type Post = {
  id: string
  title: string
  summary: string
  content: string
  coverUrl: string | null
  status: 'DRAFT' | 'PUBLISHED'
  categories: string[]
}

type Props = {
  post?: Post
  action: (formData: FormData) => Promise<void | { error: string }>
}

/* ─── Image insert modal ─────────────────────────────────────────────────── */

function ImageInsertModal({
  onInsert,
  onClose,
}: {
  onInsert: (url: string) => void
  onClose: () => void
}) {
  const [tab, setTab]       = useState<'url' | 'file'>('url')
  const [url, setUrl]       = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    const fd = new FormData()
    fd.set('file', file)
    const res  = await fetch('/api/upload', { method: 'POST', body: fd })
    let data: { url?: string; error?: string } = {}
    try {
      data = await res.json()
    } catch {
      setUploading(false)
      setUploadError('Resposta inválida do servidor. Tente novamente.')
      return
    }
    setUploading(false)
    if (data.error) { setUploadError(data.error); return }
    if (!data.url) { setUploadError('URL não retornada pelo servidor.'); return }
    onInsert(data.url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-title text-lg uppercase text-contrast tracking-wide">Inserir imagem</h3>
          <button type="button" onClick={onClose} className="text-contrast/30 hover:text-contrast transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border border-gray-200 rounded-xl overflow-hidden mb-5">
          {(['url', 'file'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 font-body text-sm font-semibold transition-colors ${
                tab === t ? 'bg-accent text-white' : 'text-contrast/50 hover:text-contrast'
              }`}
            >
              {t === 'url' ? 'Link / URL' : 'Upload do dispositivo'}
            </button>
          ))}
        </div>

        {tab === 'url' ? (
          <div className="space-y-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
              autoFocus
            />
            <button
              type="button"
              disabled={!url}
              onClick={() => url && onInsert(url)}
              className="w-full bg-accent text-white font-body font-bold uppercase tracking-widest text-sm py-3 rounded-xl hover:bg-accent/90 transition disabled:opacity-50"
            >
              Inserir
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {uploadError && (
              <p className="text-red-600 font-body text-sm">{uploadError}</p>
            )}
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-200 hover:border-accent rounded-xl py-10 flex flex-col items-center gap-3 transition-colors disabled:opacity-60 cursor-pointer"
            >
              {uploading ? (
                <span className="font-body text-sm text-contrast/50">Enviando…</span>
              ) : (
                <>
                  <svg className="w-10 h-10 text-accent/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span className="font-body text-sm text-contrast/50">Clique para selecionar ou arraste a imagem aqui</span>
                  <span className="font-body text-xs text-contrast/30">PNG, JPG, WebP, GIF · máx. 5 MB</span>
                </>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Cover image input ──────────────────────────────────────────────────── */

function CoverInput({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const [tab, setTab]       = useState<'url' | 'file'>(value ? 'url' : 'url')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    const fd = new FormData()
    fd.set('file', file)
    const res  = await fetch('/api/upload', { method: 'POST', body: fd })
    let data: { url?: string; error?: string } = {}
    try {
      data = await res.json()
    } catch {
      setUploading(false)
      setUploadError('Resposta inválida do servidor. Tente novamente.')
      return
    }
    setUploading(false)
    if (data.error) { setUploadError(data.error); return }
    if (!data.url) { setUploadError('URL não retornada pelo servidor.'); return }
    onChange(data.url)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="font-body text-sm font-medium text-contrast/70">Imagem de Capa</label>
        <div className="flex border border-gray-200 rounded-lg overflow-hidden text-xs">
          {(['url', 'file'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-3 py-1 font-body font-semibold transition-colors ${
                tab === t ? 'bg-accent text-white' : 'text-contrast/40 hover:text-contrast'
              }`}
            >
              {t === 'url' ? 'URL' : 'Upload'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'url' ? (
        <input
          type="url"
          name="coverUrl"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 font-body text-sm text-contrast placeholder-contrast/30 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          placeholder="https://..."
        />
      ) : (
        <div>
          {uploadError && <p className="text-red-600 font-body text-xs mb-2">{uploadError}</p>}
          <input name="coverUrl" type="hidden" value={value} />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-200 hover:border-accent rounded-xl py-6 flex flex-col items-center gap-2 transition-colors disabled:opacity-60 cursor-pointer"
          >
            {uploading ? (
              <span className="font-body text-sm text-contrast/50">Enviando…</span>
            ) : value ? (
              <span className="font-body text-sm text-accent font-semibold">✓ Imagem carregada — clique para trocar</span>
            ) : (
              <>
                <svg className="w-7 h-7 text-accent/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="font-body text-sm text-contrast/50">Clique para selecionar uma imagem</span>
              </>
            )}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      )}
    </div>
  )
}

/* ─── Toolbar button ─────────────────────────────────────────────────────── */

function Btn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      className={`px-2.5 py-1.5 rounded-lg font-body text-sm transition-colors select-none ${
        active
          ? 'bg-white/20 text-white font-semibold'
          : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  )
}

function ToolDivider() {
  return <div className="w-px h-5 bg-white/20 mx-1 shrink-0" />
}

/* ─── Live preview ───────────────────────────────────────────────────────── */

function LivePreview({
  title,
  summary,
  coverUrl,
  html,
}: {
  title: string
  summary: string
  coverUrl: string
  html: string
}) {
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="flex items-center justify-between w-full px-1">
        <span className="font-body text-[10px] font-semibold text-contrast/30 uppercase tracking-widest">
          Preview mobile
        </span>
        <span className="font-body text-[10px] text-contrast/20">Role para ver o conteúdo</span>
      </div>

      {/* Phone frame */}
      <div style={{ width: 340 }}>
        <div
          className="rounded-[2.4rem] border-[5px] border-gray-800 bg-gray-800 overflow-hidden shadow-2xl relative"
          style={{ height: 620 }}
        >
          {/* Notch */}
          <div className="absolute top-0 inset-x-0 flex justify-center z-10 pointer-events-none">
            <div className="w-24 h-5 bg-gray-800 rounded-b-2xl" />
          </div>

          {/* Scrollable post content */}
          <div className="w-full h-full overflow-y-auto bg-white" style={{ paddingTop: 20 }}>

            {/* Simulated site nav bar */}
            <div className="bg-contrast px-4 py-2.5 flex items-center justify-between">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-white.svg" alt="Fitmass" className="h-4 w-auto opacity-90" />
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
              </div>
            </div>

            {/* Cover */}
            {coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverUrl} alt="" className="w-full object-cover" style={{ height: 170 }} />
            ) : (
              <div
                className="w-full bg-gradient-to-br from-accent/15 to-secondary/10 flex items-center justify-center"
                style={{ height: 170 }}
              >
                <svg className="w-10 h-10 text-accent/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Post body */}
            <div className="px-4 pt-4 pb-8">
              <h1 className="font-title text-lg uppercase text-contrast tracking-wide leading-tight mb-2">
                {title || (
                  <span className="text-contrast/20 italic normal-case font-body font-normal text-sm">
                    Título do post
                  </span>
                )}
              </h1>

              {summary && (
                <p className="font-body text-xs text-contrast/60 leading-relaxed mb-4 border-l-2 border-accent pl-2.5">
                  {summary}
                </p>
              )}

              {html && html !== '<p></p>' ? (
                <div
                  className="prose-content"
                  style={{ fontSize: '12px' }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(html, { USE_PROFILES: { html: true } }),
                  }}
                />
              ) : (
                <p className="font-body text-xs text-contrast/20 italic">O conteúdo aparecerá aqui…</p>
              )}
            </div>
          </div>

          {/* Bottom home bar */}
          <div className="absolute bottom-1.5 inset-x-0 flex justify-center pointer-events-none">
            <div className="w-16 h-1 bg-gray-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function PostForm({ post, action }: Props) {
  const [isPending, startTransition] = useTransition()
  const [error, setError]     = useState<string | null>(null)
  const [title, setTitle]     = useState(post?.title ?? '')
  const [summary, setSummary] = useState(post?.summary ?? '')
  const [coverUrl, setCoverUrl] = useState(post?.coverUrl ?? '')
  const [categories, setCategories] = useState<string[]>(post?.categories ?? [])
  const [customInput, setCustomInput] = useState('')
  const customRef = useRef<HTMLInputElement>(null)

  function toggleCategory(cat: string) {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    )
  }

  function addCustom() {
    const val = customInput.trim()
    if (!val || categories.includes(val)) { setCustomInput(''); return }
    setCategories((prev) => [...prev, val])
    setCustomInput('')
    customRef.current?.focus()
  }

  function removeCategory(cat: string) {
    setCategories((prev) => prev.filter((c) => c !== cat))
  }

  const [editorHtml, setEditorHtml] = useState(post?.content ?? '')
  const [showImageModal, setShowImageModal] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TiptapImage.configure({ inline: false, allowBase64: false }),
      TiptapLink.configure({ openOnClick: false, autolink: true }),
    ],
    content: post?.content ?? '',
    onUpdate: ({ editor }) => setEditorHtml(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose-content min-h-90 px-6 py-5 focus:outline-none text-sm',
      },
    },
  })

  const insertImage = useCallback((url: string) => {
    editor?.chain().focus().setImage({ src: url }).run()
    setShowImageModal(false)
  }, [editor])

  const toggleLink = useCallback(() => {
    if (editor?.isActive('link')) {
      editor.chain().focus().unsetLink().run()
    } else {
      const url = window.prompt('URL do link:')
      if (url) editor?.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!editor) return
    const formData = new FormData(e.currentTarget)
    formData.set('content', editor.getHTML())
    setError(null)
    startTransition(async () => {
      const result = await action(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <>
      {showImageModal && (
        <ImageInsertModal onInsert={insertImage} onClose={() => setShowImageModal(false)} />
      )}

      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* ── Sticky formatting toolbar ─────────────────────────────────── */}
        <div className="sticky top-0 z-20 bg-contrast border-b border-white/10 px-8 py-2.5 flex flex-wrap items-center gap-1 shadow-lg shadow-black/10">
          <Btn title="Negrito" onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')}>
            <strong className="font-bold">B</strong>
          </Btn>
          <Btn title="Itálico" onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')}>
            <em>I</em>
          </Btn>
          <Btn title="Tachado" onClick={() => editor?.chain().focus().toggleStrike().run()} active={editor?.isActive('strike')}>
            <s>S</s>
          </Btn>

          <ToolDivider />

          <Btn title="Título H2" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive('heading', { level: 2 })}>
            H2
          </Btn>
          <Btn title="Título H3" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive('heading', { level: 3 })}>
            H3
          </Btn>

          <ToolDivider />

          <Btn title="Lista com marcadores" onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')}>
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="2" cy="4" r="1.2" /><rect x="5" y="3" width="9" height="2" rx="1" />
              <circle cx="2" cy="8" r="1.2" /><rect x="5" y="7" width="9" height="2" rx="1" />
              <circle cx="2" cy="12" r="1.2" /><rect x="5" y="11" width="9" height="2" rx="1" />
            </svg>
          </Btn>
          <Btn title="Lista numerada" onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive('orderedList')}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
              <path d="M1 2.5h2.5M2.25 2.5v3M1 7.5h3M3.5 7.5c0-1-2.5-.5-2.5-1.5S3.5 5 3.5 5M1 12.5h3M3.5 14.5h-3M3.5 12.5v2M6 4h8M6 8h8M6 12h8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Btn>

          <ToolDivider />

          <Btn title="Citação" onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive('blockquote')}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3 6h3l-2 4H2zm5 0h3l-2 4H7z" opacity=".7" />
            </svg>
          </Btn>
          <Btn title="Código inline" onClick={() => editor?.chain().focus().toggleCode().run()} active={editor?.isActive('code')}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 4L1 8l4 4M11 4l4 4-4 4" />
            </svg>
          </Btn>

          <ToolDivider />

          <Btn title={editor?.isActive('link') ? 'Remover link' : 'Inserir link'} onClick={toggleLink} active={editor?.isActive('link')}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 9.5a3.5 3.5 0 004.95 0l2-2a3.5 3.5 0 00-4.95-4.95l-1 1M9.5 6.5a3.5 3.5 0 00-4.95 0l-2 2a3.5 3.5 0 004.95 4.95l1-1" />
            </svg>
          </Btn>
          <Btn title="Inserir imagem" onClick={() => setShowImageModal(true)}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
              <rect x="1" y="2" width="14" height="12" rx="1.5" />
              <circle cx="5.5" cy="6" r="1.2" fill="currentColor" stroke="none" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M1 11l3.5-3.5 2.5 2.5 2.5-2.5 4.5 4.5" />
            </svg>
          </Btn>

          {/* Right side: status + save */}
          <div className="ml-auto flex items-center gap-3">
            <select
              name="status"
              defaultValue={post?.status ?? 'DRAFT'}
              className="border border-white/20 bg-white/10 text-white rounded-lg px-3 py-1.5 font-body text-xs focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              <option value="DRAFT" className="text-contrast bg-white">Rascunho</option>
              <option value="PUBLISHED" className="text-contrast bg-white">Publicado</option>
            </select>
            <button
              type="submit"
              disabled={isPending}
              className="bg-accent text-white font-body font-bold uppercase tracking-widest text-xs px-5 py-1.5 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-60 whitespace-nowrap"
            >
              {isPending ? 'Salvando…' : post ? 'Salvar' : 'Publicar'}
            </button>
          </div>
        </div>

        {/* ── Main content ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-0 flex-1">

          {/* Left column — form fields */}
          <div className="p-8 space-y-5 border-r border-gray-100">
            {error && (
              <p className="bg-red-50 border border-red-200 text-red-700 font-body text-sm px-4 py-3 rounded-xl">
                {error}
              </p>
            )}

            {/* Título */}
            <div>
              <label className="block font-body text-xs font-semibold text-contrast/50 uppercase tracking-widest mb-1.5">
                Título <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 font-title text-xl text-contrast placeholder-contrast/20 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
                placeholder="Título do post"
              />
            </div>

            {/* Resumo */}
            <div>
              <label className="block font-body text-xs font-semibold text-contrast/50 uppercase tracking-widest mb-1.5">
                Resumo <span className="text-red-400">*</span>
              </label>
              <textarea
                name="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 font-body text-sm text-contrast placeholder-contrast/30 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition resize-none"
                placeholder="Breve descrição (aparece nos cards do blog)"
              />
            </div>

            {/* Capa */}
            <CoverInput value={coverUrl} onChange={setCoverUrl} />
            {/* hidden input so formData contains coverUrl */}
            {coverUrl && <input type="hidden" name="coverUrl" value={coverUrl} />}

            {/* Categorias */}
            <div>
              <label className="block font-body text-xs font-semibold text-contrast/50 uppercase tracking-widest mb-2">
                Categorias
              </label>

              {/* Chips predefinidos */}
              <div className="flex flex-wrap gap-2 mb-3">
                {CATEGORIES.map((cat) => {
                  const checked = categories.includes(cat)
                  return (
                    <label
                      key={cat}
                      className={`inline-flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg border text-sm font-body font-semibold transition-colors select-none ${
                        checked
                          ? 'bg-accent/10 border-accent text-accent'
                          : 'border-gray-200 text-contrast/50 hover:border-accent/50 hover:text-contrast'
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="categories"
                        value={cat}
                        checked={checked}
                        onChange={() => toggleCategory(cat)}
                        className="sr-only"
                      />
                      <span
                        className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                          checked ? 'bg-accent border-accent' : 'border-gray-300'
                        }`}
                        aria-hidden="true"
                      >
                        {checked && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 5l2.5 2.5 4.5-4.5" />
                          </svg>
                        )}
                      </span>
                      {cat}
                    </label>
                  )
                })}
              </div>

              {/* Categorias personalizadas (fora da lista predefinida) */}
              {categories.filter((c) => !CATEGORIES.includes(c)).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {categories.filter((c) => !CATEGORIES.includes(c)).map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-accent bg-accent/10 text-accent text-sm font-body font-semibold"
                    >
                      <input type="hidden" name="categories" value={cat} />
                      {cat}
                      <button
                        type="button"
                        onClick={() => removeCategory(cat)}
                        className="text-accent/60 hover:text-accent transition-colors ml-0.5"
                        aria-label={`Remover ${cat}`}
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2 2l8 8M10 2L2 10" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Input para nova categoria */}
              <div className="flex items-center gap-2">
                <input
                  ref={customRef}
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom() } }}
                  placeholder="Nova categoria…"
                  className="flex-1 border border-dashed border-gray-300 rounded-lg px-3 py-1.5 font-body text-sm text-contrast placeholder-contrast/30 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
                />
                <button
                  type="button"
                  onClick={addCustom}
                  disabled={!customInput.trim()}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 font-body text-sm font-semibold text-contrast/50 hover:border-accent hover:text-accent transition-colors disabled:opacity-40 shrink-0"
                >
                  + Adicionar
                </button>
              </div>
              <p className="font-body text-[11px] text-contrast/30 mt-1.5">
                Pressione Enter ou clique em + Adicionar para criar uma categoria nova.
              </p>
            </div>

            {/* Editor */}
            <div>
              <label className="block font-body text-xs font-semibold text-contrast/50 uppercase tracking-widest mb-1.5">
                Conteúdo <span className="text-red-400">*</span>
              </label>
              <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-accent/40 focus-within:border-accent transition">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>

          {/* Right column — live preview (sticky: sticks in <main> scroll container) */}
          <div
            className="hidden xl:flex flex-col items-center justify-start self-start sticky bg-gray-50/60 border-l border-gray-100 overflow-hidden pt-6"
            style={{ top: 49, height: 'calc(100vh - 49px)' }}
          >
            <LivePreview
              title={title}
              summary={summary}
              coverUrl={coverUrl}
              html={editorHtml}
            />
          </div>
        </div>
      </form>
    </>
  )
}
