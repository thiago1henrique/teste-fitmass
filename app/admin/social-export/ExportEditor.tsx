'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import RichTextField from './RichTextField'
import {
  PLATFORMS,
  TEMPLATES,
  OVERLAYS,
  renderCanvas,
  type Platform,
  type TemplateId,
  type OverlayId,
  type TextSegment,
} from './templates'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TextField {
  html: string
  size: number
}

interface InitialPost {
  title: string
  summary: string | null
  coverUrl: string | null
  categories: string[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  if (typeof document === 'undefined') return html.replace(/<[^>]+>/g, '')
  const d = document.createElement('div')
  d.innerHTML = html
  return d.textContent ?? d.innerText ?? ''
}

// Parse contenteditable HTML into rich text segments for canvas rendering
function parseRichHtml(html: string): TextSegment[] {
  if (typeof document === 'undefined') {
    return [{ text: html.replace(/<[^>]+>/g, ''), bold: false, italic: false }]
  }
  const div = document.createElement('div')
  div.innerHTML = html
  const segs: TextSegment[] = []

  function walk(node: Node, bold: boolean, italic: boolean, size?: number) {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent ?? ''
      if (t) segs.push({ text: t, bold, italic, size })
      return
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement
      const tag = el.tagName.toLowerCase()
      let b = bold, i = italic, s = size
      if (tag === 'b' || tag === 'strong') b = true
      if (tag === 'i' || tag === 'em') i = true
      if (el.style?.fontSize) { const px = parseInt(el.style.fontSize); if (px) s = px }
      for (const child of Array.from(el.childNodes)) walk(child, b, i, s)
    }
  }

  for (const child of Array.from(div.childNodes)) walk(child, false, false, undefined)
  return segs.filter((s) => s.text.trim() || s.text.includes(' '))
}

// Route external image URLs through the server-side proxy so the canvas stays clean
function proxyUrl(url: string): string {
  if (url.startsWith('blob:') || url.startsWith('data:') || url.startsWith('/')) return url
  return `/api/proxy-image?url=${encodeURIComponent(url)}`
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PlatformBtn({
  id,
  label,
  ratio,
  active,
  onClick,
}: {
  id: Platform
  label: string
  ratio: string
  active: boolean
  onClick: () => void
}) {
  const aspectClass: Record<Platform, string> = {
    instagram_post:  'aspect-square',
    instagram_story: 'aspect-[9/16]',
    linkedin:        'aspect-[1.91/1]',
  }
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all ${
        active
          ? 'border-accent bg-accent/8 shadow-sm'
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      <div className={`w-8 rounded bg-gray-200 ${aspectClass[id]} ${active ? 'bg-accent/20' : ''}`} />
      <span className={`font-body text-xs font-semibold leading-tight text-center ${active ? 'text-accent' : 'text-contrast/60'}`}>
        {label}
        <span className="block text-[10px] font-normal opacity-60">{ratio}</span>
      </span>
    </button>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-body text-xs font-bold uppercase tracking-widest text-contrast/40 mb-3">
      {children}
    </h3>
  )
}

// ─── Main Editor ─────────────────────────────────────────────────────────────

export default function ExportEditor({ initialPost }: { initialPost: InitialPost | null }) {
  // Platform
  const [platform, setPlatform] = useState<Platform>('instagram_post')

  // Template & overlay
  const [templateId, setTemplateId] = useState<TemplateId>('foto_gradiente')
  const [overlayId,  setOverlayId]  = useState<OverlayId>('gradient_bottom')

  // Image
  const [imageUrl,   setImageUrl]   = useState<string | null>(initialPost?.coverUrl ?? null)
  const [imageState, setImageState] = useState<{ el: HTMLImageElement | null; error: boolean }>({ el: null, error: false })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageEl    = imageState.el
  const imageError = imageState.error

  // Logo
  const [showLogo, setShowLogo] = useState(true)
  const [logoState, setLogoState] = useState<{ el: HTMLImageElement | null }>({ el: null })


  // Text fields
  const defaultSubtitle = initialPost?.categories?.[0] ?? ''
  const [subtitle, setSubtitle] = useState<TextField>({ html: defaultSubtitle, size: 36 })
  const [title,    setTitle]    = useState<TextField>({ html: initialPost?.title ?? '', size: 72 })
  const [desc,     setDesc]     = useState<TextField>({ html: initialPost?.summary ?? '', size: 30 })

  // Text colors
  const [subtitleColor, setSubtitleColor] = useState('#FFFFFF')
  const [titleColor,    setTitleColor]    = useState('#FFFFFF')
  const [descColor,     setDescColor]     = useState('rgba(255,255,255,0.75)')

  // Text alignment
  const [subtitleAlign, setSubtitleAlign] = useState<'left'|'center'|'right'>('left')
  const [titleAlign,    setTitleAlign]    = useState<'left'|'center'|'right'>('left')
  const [descAlign,     setDescAlign]     = useState<'left'|'center'|'right'>('left')

  // Canvas
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const renderTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [downloading, setDownloading] = useState(false)

  // ─── Image loading ──────────────────────────────────────────────────────────
  // All setState calls are inside async callbacks so the linter rule is satisfied.

  useEffect(() => {
    let cancelled = false

    if (!imageUrl) {
      const id = requestAnimationFrame(() => {
        if (!cancelled) setImageState({ el: null, error: false })
      })
      return () => { cancelled = true; cancelAnimationFrame(id) }
    }

    // Always route through the server proxy so the canvas stays clean for toDataURL()
    const url = proxyUrl(imageUrl)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload  = () => { if (!cancelled) setImageState({ el: img, error: false }) }
    img.onerror = () => { if (!cancelled) setImageState({ el: null, error: true }) }
    img.src = url

    return () => { cancelled = true }
  }, [imageUrl])

  // ─── Logo loading ───────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.onload  = () => { if (!cancelled) setLogoState({ el: img }) }
    img.onerror = () => { if (!cancelled) setLogoState({ el: null }) }
    img.src = '/fitmass_icon.svg'
    return () => { cancelled = true }
  }, [])

  // ─── Canvas render ──────────────────────────────────────────────────────────

  const doRender = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const plt = PLATFORMS[platform]
    if (canvas.width !== plt.width || canvas.height !== plt.height) {
      canvas.width  = plt.width
      canvas.height = plt.height
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    document.fonts.ready.then(() => {
      renderCanvas(ctx, {
        width:           plt.width,
        height:          plt.height,
        image:           imageEl,
        overlayId,
        subtitle:        stripHtml(subtitle.html),
        subtitleSize:    subtitle.size,
        subtitleColor,
        subtitleRich:    parseRichHtml(subtitle.html),
        title:           stripHtml(title.html),
        titleSize:       title.size,
        titleColor,
        titleRich:       parseRichHtml(title.html),
        description:     stripHtml(desc.html),
        descriptionSize: desc.size,
        descColor,
        descRich:        parseRichHtml(desc.html),
        subtitleAlign,
        titleAlign,
        descAlign,
        showLogo,
        logoEl:          logoState.el,
        showAuthor:      false,
        authorName:      '',
        authorPhoto:     null,
      }, templateId)
    })
  }, [platform, templateId, overlayId, imageEl, subtitle, title, desc, subtitleColor, titleColor, descColor, subtitleAlign, titleAlign, descAlign, showLogo, logoState])

  useEffect(() => {
    clearTimeout(renderTimer.current)
    renderTimer.current = setTimeout(doRender, 60)
  }, [doRender])

  // ─── Image upload ───────────────────────────────────────────────────────────

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setImageUrl(url)
  }

  // ─── Download ───────────────────────────────────────────────────────────────

  async function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    setDownloading(true)
    try {
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `fitmass-${platform}-${templateId}.png`
      link.href = dataUrl
      link.click()
    } catch {
      alert('Não foi possível exportar — tente fazer upload local da imagem.')
    } finally {
      setDownloading(false)
    }
  }

  // ─── Smart color defaults per template ─────────────────────────────────────

  useEffect(() => {
    const lightBg = ['branco_minimal', 'dica_dia', 'depoimento', 'polaroid', 'citacao', 'tira_noticia', 'magazine']
    const brandBg = ['verde_fitmass', 'cta_card', 'degradê']
    if (lightBg.includes(templateId)) {
      setSubtitleColor('#88BD23')
      setTitleColor('#333333')
      setDescColor('#555555')
    } else if (brandBg.includes(templateId)) {
      setSubtitleColor('#ffffff')
      setTitleColor('#ffffff')
      setDescColor('rgba(255,255,255,0.85)')
    } else {
      setSubtitleColor('#88BD23')
      setTitleColor('#ffffff')
      setDescColor('rgba(255,255,255,0.75)')
    }
  }, [templateId])

  // ─── Filtered templates ─────────────────────────────────────────────────────

  const visibleTemplates = TEMPLATES.filter((t) => t.platforms.includes(platform))

  function changePlatform(p: Platform) {
    setPlatform(p)
    const stillValid = TEMPLATES.find((t) => t.id === templateId)?.platforms.includes(p)
    if (!stillValid) {
      const first = TEMPLATES.find((t) => t.platforms.includes(p))
      if (first) setTemplateId(first.id)
    }
  }

  // ─── Canvas preview dimensions ──────────────────────────────────────────────

  const plt        = PLATFORMS[platform]
  const previewW   = 420
  const previewH   = Math.round((previewW * plt.height) / plt.width)

  // ─── UI ────────────────────────────────────────────────────────────────────

  return (
    <div className="p-4 sm:p-8 max-w-350 mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <a href="/admin/posts" className="font-body text-sm text-contrast/40 hover:text-accent transition-colors">
            ← Posts
          </a>
        </div>
        <h1 className="font-title text-3xl uppercase text-contrast tracking-wide">
          Exportar para Redes Sociais
        </h1>
        <p className="font-body text-sm text-contrast/50 mt-1">
          Monte a arte, edite os textos e baixe pronto para publicar.
        </p>
      </div>

      {/* Two-column layout: form left, sticky preview right */}
      {/* NOTE: no items-start on parent — right col must stretch to left col height for sticky to work */}
      <div className="flex gap-10">

        {/* ── LEFT COLUMN ───────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-10 self-start">

          {/* 1. Platform */}
          <section>
            <SectionTitle>Plataforma</SectionTitle>
            <div className="flex gap-3">
              {(Object.entries(PLATFORMS) as [Platform, typeof PLATFORMS[Platform]][]).map(([id, info]) => (
                <PlatformBtn
                  key={id}
                  id={id}
                  label={info.label}
                  ratio={info.ratio}
                  active={platform === id}
                  onClick={() => changePlatform(id)}
                />
              ))}
            </div>
          </section>

          {/* 2. Image */}
          <section>
            <SectionTitle>Imagem</SectionTitle>
            <div className="flex items-start gap-4">
              {/* Thumb preview */}
              <div
                className="w-20 h-20 rounded-xl bg-gray-100 border border-gray-200 shrink-0 overflow-hidden flex items-center justify-center"
              >
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="font-body text-sm px-4 py-2 rounded-xl border border-gray-200 bg-white hover:border-accent/50 hover:bg-accent/5 transition-colors"
                >
                  {imageUrl ? 'Trocar imagem' : 'Selecionar imagem'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {imageUrl && (
                  <button
                    onClick={() => setImageUrl(null)}
                    className="block font-body text-xs text-contrast/40 hover:text-red-500 transition-colors"
                  >
                    Remover imagem
                  </button>
                )}
                {imageError && (
                  <p className="font-body text-xs text-red-500">
                    Não foi possível carregar a imagem. Tente fazer upload de um arquivo local.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 3. Logo */}
          <section>
            <SectionTitle>Logo</SectionTitle>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                className={`relative w-10 h-5 rounded-full transition-colors ${showLogo ? 'bg-accent' : 'bg-gray-200'}`}
                onClick={() => setShowLogo((v) => !v)}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${showLogo ? 'translate-x-5' : ''}`}
                />
              </div>
              <span className="font-body text-sm text-contrast/70">Exibir logo Fitmass na arte</span>
            </label>
          </section>

          {/* 4. Templates */}
          <section>
            <SectionTitle>Modelo de postagem ({visibleTemplates.length})</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {visibleTemplates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setTemplateId(tpl.id)}
                  className={`flex flex-col rounded-xl overflow-hidden border-2 transition-all text-left ${
                    templateId === tpl.id
                      ? 'border-accent shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Visual swatch */}
                  <div
                    className="h-16 w-full relative flex items-end p-2"
                    style={{ background: tpl.thumbBg }}
                  >
                    {/* Simulated text lines */}
                    <div className="space-y-1 w-full">
                      <div className="h-1.5 rounded" style={{ background: tpl.thumbAccent, width: '40%', opacity: 0.8 }} />
                      <div className="h-2.5 rounded bg-white/90" style={{ width: '75%' }} />
                      <div className="h-1.5 rounded bg-white/50" style={{ width: '55%' }} />
                    </div>
                  </div>
                  <div className={`px-2.5 py-2 ${templateId === tpl.id ? 'bg-accent/5' : 'bg-white'}`}>
                    <p className={`font-body text-xs font-semibold leading-tight ${templateId === tpl.id ? 'text-accent' : 'text-contrast'}`}>
                      {tpl.name}
                    </p>
                    <p className="font-body text-[10px] text-contrast/40 mt-0.5 leading-tight">
                      {tpl.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* 5. Overlays */}
          <section>
            <SectionTitle>Overlay / Efeito</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {OVERLAYS.map((ov) => (
                <button
                  key={ov.id}
                  onClick={() => setOverlayId(ov.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${
                    overlayId === ov.id
                      ? 'border-accent bg-accent/8'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {/* Color swatch */}
                  <span
                    className="w-5 h-5 rounded border border-gray-300 shrink-0"
                    style={{ background: ov.preview }}
                  />
                  <span className={`font-body text-xs font-medium ${overlayId === ov.id ? 'text-accent' : 'text-contrast/70'}`}>
                    {ov.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* 6. Text fields */}
          <section>
            <SectionTitle>Textos</SectionTitle>
            <p className="font-body text-xs text-contrast/45 mb-6">
              Selecione palavras para aplicar negrito, itálico ou mudar tamanho individualmente.
            </p>

            <div className="space-y-8">
              {/* Subtitle */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-body text-xs font-semibold text-contrast/60 uppercase tracking-wide">
                    Subtítulo
                  </label>
                  <FontSizeControl value={subtitle.size} onChange={(s) => setSubtitle((p) => ({ ...p, size: s }))} />
                </div>
                <RichTextField
                  value={subtitle.html}
                  onChange={(h) => setSubtitle((p) => ({ ...p, html: h }))}
                  placeholder="Ex: Nutrição · Dica do dia"
                />
                <div className="flex items-center gap-3 mt-2">
                  <AlignControl value={subtitleAlign} onChange={setSubtitleAlign} />
                  <ColorControl value={subtitleColor} onChange={setSubtitleColor} />
                </div>
              </div>

              {/* Title */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-body text-xs font-semibold text-contrast/60 uppercase tracking-wide">
                    Título
                  </label>
                  <FontSizeControl value={title.size} onChange={(s) => setTitle((p) => ({ ...p, size: s }))} />
                </div>
                <RichTextField
                  value={title.html}
                  onChange={(h) => setTitle((p) => ({ ...p, html: h }))}
                  placeholder="Título principal da arte"
                  minHeight={88}
                />
                <div className="flex items-center gap-3 mt-2">
                  <AlignControl value={titleAlign} onChange={setTitleAlign} />
                  <ColorControl value={titleColor} onChange={setTitleColor} />
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-body text-xs font-semibold text-contrast/60 uppercase tracking-wide">
                    Descrição
                  </label>
                  <FontSizeControl value={desc.size} onChange={(s) => setDesc((p) => ({ ...p, size: s }))} />
                </div>
                <RichTextField
                  value={desc.html}
                  onChange={(h) => setDesc((p) => ({ ...p, html: h }))}
                  placeholder="Texto complementar (aparece na arte)"
                  minHeight={96}
                />
                <div className="flex items-center gap-3 mt-2">
                  <AlignControl value={descAlign} onChange={setDescAlign} />
                  <ColorControl value={descColor} onChange={setDescColor} />
                </div>
              </div>
            </div>
          </section>

          {/* Bottom spacer */}
          <div className="h-16" />
        </div>

        {/* ── RIGHT COLUMN — sticky preview ─────────────────────────────────── */}
        <div className="hidden lg:block shrink-0" style={{ width: previewW }}>
          <div className="sticky top-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-body text-xs font-bold uppercase tracking-widest text-contrast/40">
                Preview
              </h3>
              <span className="font-body text-[10px] text-contrast/30">
                {plt.width} × {plt.height}px
              </span>
            </div>

            {/* Canvas */}
            <div
              className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-gray-100"
              style={{ width: previewW, height: previewH }}
            >
              <canvas
                ref={canvasRef}
                width={plt.width}
                height={plt.height}
                style={{ width: previewW, height: previewH, display: 'block' }}
              />
            </div>

            {/* Download button */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2 bg-accent text-white font-body font-bold text-sm py-3 px-6 rounded-xl hover:bg-accent/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {downloading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Exportando…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Baixar PNG
                </>
              )}
            </button>

            {/* Platform info */}
            <p className="font-body text-[11px] text-center text-contrast/30">
              {plt.label} · {plt.ratio} · PNG 72 dpi
            </p>
          </div>
        </div>
      </div>

      {/* Mobile download bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3">
        <div className="flex-1">
          <p className="font-body text-xs text-contrast/50">
            {plt.label} — {plt.width}×{plt.height}px
          </p>
        </div>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 bg-accent text-white font-body font-semibold text-sm py-2.5 px-5 rounded-xl disabled:opacity-60"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Baixar PNG
        </button>
      </div>
    </div>
  )
}

// ─── Font size control (field-level) ─────────────────────────────────────────

const SIZES = [
  { label: 'S',   value: 24 },
  { label: 'M',   value: 36 },
  { label: 'L',   value: 56 },
  { label: 'XL',  value: 72 },
  { label: 'XXL', value: 96 },
]

const SWATCHES = ['#ffffff', '#333333', '#88BD23', '#25B6EB', '#000000', '#FFD600']

function ColorControl({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      {SWATCHES.map((c) => (
        <button
          key={c}
          title={c}
          onClick={() => onChange(c)}
          className={`w-5 h-5 rounded-full border-2 transition-all ${value === c ? 'border-accent scale-110' : 'border-gray-300 hover:border-gray-400'}`}
          style={{ background: c }}
        />
      ))}
      <label className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-dashed border-gray-300 hover:border-accent cursor-pointer" title="Cor personalizada">
        <span className="block w-full h-full" style={{ background: value }} />
        <input
          type="color"
          value={value.startsWith('rgba') ? '#ffffff' : value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </label>
    </div>
  )
}

function AlignControl({ value, onChange }: { value: 'left'|'center'|'right'; onChange: (v: 'left'|'center'|'right') => void }) {
  const opts: { v: 'left'|'center'|'right'; icon: string; title: string }[] = [
    { v: 'left',   icon: '⇤', title: 'Esquerda' },
    { v: 'center', icon: '⇔', title: 'Centro' },
    { v: 'right',  icon: '⇥', title: 'Direita' },
  ]
  return (
    <div className="flex items-center gap-0.5">
      {opts.map((o) => (
        <button
          key={o.v}
          title={o.title}
          onClick={() => onChange(o.v)}
          className={`w-6 h-6 flex items-center justify-center rounded text-[11px] font-bold transition-colors ${
            value === o.v ? 'bg-accent text-white' : 'bg-gray-100 text-contrast/50 hover:bg-gray-200'
          }`}
        >
          {o.icon}
        </button>
      ))}
    </div>
  )
}

function FontSizeControl({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [custom, setCustom] = useState(false)

  return (
    <div className="flex items-center gap-1">
      {SIZES.map((s) => (
        <button
          key={s.label}
          onClick={() => { onChange(s.value); setCustom(false) }}
          className={`w-7 h-6 flex items-center justify-center rounded text-[10px] font-bold transition-colors ${
            value === s.value && !custom
              ? 'bg-accent text-white'
              : 'bg-gray-100 text-contrast/50 hover:bg-gray-200'
          }`}
        >
          {s.label}
        </button>
      ))}
      {/* Custom px input */}
      <input
        type="number"
        min={8}
        max={200}
        value={value}
        onChange={(e) => { onChange(Number(e.target.value) || value); setCustom(true) }}
        className="w-12 h-6 text-center font-body text-[10px] border border-gray-200 rounded bg-white focus:outline-none focus:border-accent/50"
        title="Tamanho customizado (px no canvas)"
      />
    </div>
  )
}
