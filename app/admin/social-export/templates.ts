// ─── Constants ───────────────────────────────────────────────────────────────

export const PLATFORMS = {
  instagram_post:  { width: 1080, height: 1080,  label: 'Instagram Post',  ratio: '1:1' },
  instagram_story: { width: 1080, height: 1920,  label: 'Instagram Story', ratio: '9:16' },
  linkedin:        { width: 1200, height: 628,   label: 'LinkedIn',        ratio: '1.91:1' },
} as const

export type Platform = keyof typeof PLATFORMS

const C = {
  accent:   '#88BD23',
  contrast: '#333333',
  surface:  '#F8F8F8',
  white:    '#FFFFFF',
  black:    '#000000',
  dark:     '#1a1a1a',
  secondary:'#25B6EB',
}

const F = {
  title: 'AeroMatics, Impact, "Arial Black", sans-serif',
  body:  '"Encode Sans", Arial, sans-serif',
}

const GAP_S = 8   // subtitle → title gap
const GAP_L = 18  // title → description gap

// ─── Overlay ─────────────────────────────────────────────────────────────────

export type OverlayId =
  | 'none'
  | 'gradient_bottom'
  | 'gradient_top'
  | 'gradient_both'
  | 'vignette'
  | 'verde_wash'
  | 'dark_30'
  | 'dark_50'
  | 'stripes'
  | 'dots'

export const OVERLAYS: { id: OverlayId; name: string; preview: string }[] = [
  { id: 'none',            name: 'Nenhum',           preview: 'transparent' },
  { id: 'gradient_bottom', name: 'Gradiente Baixo',  preview: 'linear-gradient(to top, #000 0%, transparent 60%)' },
  { id: 'gradient_top',    name: 'Gradiente Cima',   preview: 'linear-gradient(to bottom, #000 0%, transparent 60%)' },
  { id: 'gradient_both',   name: 'Gradiente Duplo',  preview: 'linear-gradient(to bottom, #000a, transparent 40%, transparent 60%, #000a)' },
  { id: 'vignette',        name: 'Vinheta',          preview: 'radial-gradient(ellipse, transparent 30%, #000 100%)' },
  { id: 'verde_wash',      name: 'Verde Fitmass',    preview: 'rgba(136,189,35,0.4)' },
  { id: 'dark_30',         name: 'Escuro 30%',       preview: 'rgba(0,0,0,0.3)' },
  { id: 'dark_50',         name: 'Escuro 50%',       preview: 'rgba(0,0,0,0.5)' },
  { id: 'stripes',         name: 'Listras',          preview: 'repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,.08) 10px,rgba(255,255,255,.08) 20px)' },
  { id: 'dots',            name: 'Bolinhas',         preview: 'radial-gradient(circle, rgba(255,255,255,.15) 1px, transparent 1px) 0 0 / 16px 16px' },
]

// ─── Templates ───────────────────────────────────────────────────────────────

export type TemplateId =
  | 'foto_gradiente'
  | 'quadro_escuro'
  | 'verde_fitmass'
  | 'branco_minimal'
  | 'split_half'
  | 'manchete'
  | 'citacao'
  | 'magazine'
  | 'moldura_dupla'
  | 'neon_line'
  | 'degradê'
  | 'story_vertical'
  | 'linkedin_clean'
  | 'polaroid'
  | 'fitness_stat'
  | 'dica_dia'
  | 'depoimento'
  | 'motivacional'
  | 'antes_depois'
  | 'cta_card'
  | 'editorial'
  | 'tira_noticia'

export interface TemplateInfo {
  id: TemplateId
  name: string
  description: string
  platforms: Platform[]
  // CSS for the thumbnail swatch
  thumbBg: string
  thumbAccent: string
}

export const TEMPLATES: TemplateInfo[] = [
  {
    id: 'foto_gradiente',
    name: 'Foto + Gradiente',
    description: 'Foto de fundo com gradiente inferior e texto em destaque',
    platforms: ['instagram_post', 'instagram_story', 'linkedin'],
    thumbBg: 'linear-gradient(to top, #1a1a1a 40%, #444 100%)',
    thumbAccent: C.accent,
  },
  {
    id: 'quadro_escuro',
    name: 'Quadro Escuro',
    description: 'Fundo escuro com texto em branco e acento verde',
    platforms: ['instagram_post', 'instagram_story', 'linkedin'],
    thumbBg: C.contrast,
    thumbAccent: C.accent,
  },
  {
    id: 'verde_fitmass',
    name: 'Verde Fitmass',
    description: 'Fundo na cor da marca com texto branco centralizado',
    platforms: ['instagram_post', 'instagram_story', 'linkedin'],
    thumbBg: C.accent,
    thumbAccent: C.white,
  },
  {
    id: 'branco_minimal',
    name: 'Minimalista',
    description: 'Fundo branco, barra verde à esquerda e tipografia limpa',
    platforms: ['instagram_post', 'linkedin'],
    thumbBg: C.surface,
    thumbAccent: C.accent,
  },
  {
    id: 'split_half',
    name: 'Split',
    description: 'Metade imagem, metade fundo escuro com texto',
    platforms: ['instagram_post', 'instagram_story'],
    thumbBg: `linear-gradient(to right, #555 50%, ${C.contrast} 50%)`,
    thumbAccent: C.accent,
  },
  {
    id: 'manchete',
    name: 'Manchete',
    description: 'Imagem com overlay pesado e título gigante centralizado',
    platforms: ['instagram_post', 'linkedin'],
    thumbBg: 'linear-gradient(135deg, #222 0%, #444 100%)',
    thumbAccent: C.accent,
  },
  {
    id: 'citacao',
    name: 'Citação',
    description: 'Fundo claro com aspas decorativas em destaque',
    platforms: ['instagram_post'],
    thumbBg: C.surface,
    thumbAccent: C.accent,
  },
  {
    id: 'magazine',
    name: 'Magazine',
    description: 'Imagem no topo, faixa branca com texto embaixo',
    platforms: ['instagram_post', 'linkedin'],
    thumbBg: `linear-gradient(to bottom, #555 55%, ${C.surface} 55%)`,
    thumbAccent: C.contrast,
  },
  {
    id: 'moldura_dupla',
    name: 'Moldura Dupla',
    description: 'Imagem de fundo com moldura dupla e texto centralizado',
    platforms: ['instagram_post'],
    thumbBg: 'linear-gradient(135deg, #3a3a3a 0%, #555 100%)',
    thumbAccent: C.accent,
  },
  {
    id: 'neon_line',
    name: 'Neon',
    description: 'Fundo escuro com linhas neon verdes e tipografia impactante',
    platforms: ['instagram_post', 'instagram_story'],
    thumbBg: C.dark,
    thumbAccent: C.accent,
  },
  {
    id: 'degradê',
    name: 'Degradê',
    description: 'Gradiente da marca (verde para escuro) com texto branco',
    platforms: ['instagram_post', 'instagram_story', 'linkedin'],
    thumbBg: `linear-gradient(135deg, ${C.accent} 0%, ${C.contrast} 100%)`,
    thumbAccent: C.white,
  },
  {
    id: 'story_vertical',
    name: 'Story Vertical',
    description: 'Layout específico para stories com foto no topo',
    platforms: ['instagram_story'],
    thumbBg: `linear-gradient(to bottom, #444 60%, ${C.contrast} 60%)`,
    thumbAccent: C.accent,
  },
  {
    id: 'linkedin_clean',
    name: 'LinkedIn Clean',
    description: 'Layout horizontal profissional para LinkedIn',
    platforms: ['linkedin'],
    thumbBg: '#0A66C2',
    thumbAccent: C.white,
  },
  {
    id: 'polaroid',
    name: 'Polaroid',
    description: 'Moldura estilo polaroid com texto manuscrito embaixo',
    platforms: ['instagram_post'],
    thumbBg: C.white,
    thumbAccent: C.contrast,
  },
  {
    id: 'fitness_stat',
    name: 'Fitness Stat',
    description: 'Número ou estatística em destaque total — ideal para "30 dias", "10 dicas"',
    platforms: ['instagram_post', 'instagram_story'],
    thumbBg: C.contrast,
    thumbAccent: C.accent,
  },
  {
    id: 'dica_dia',
    name: 'Dica do Dia',
    description: 'Badge "Dica do Dia" em destaque com conteúdo abaixo',
    platforms: ['instagram_post', 'instagram_story', 'linkedin'],
    thumbBg: `linear-gradient(135deg, #f0f7e0 0%, ${C.surface} 100%)`,
    thumbAccent: C.accent,
  },
  {
    id: 'depoimento',
    name: 'Depoimento',
    description: 'Card de testemunho com foto do cliente e aspas',
    platforms: ['instagram_post', 'instagram_story'],
    thumbBg: C.surface,
    thumbAccent: C.secondary,
  },
  {
    id: 'motivacional',
    name: 'Motivacional',
    description: 'Tipografia maximalista — sem imagem, só impacto',
    platforms: ['instagram_post', 'instagram_story', 'linkedin'],
    thumbBg: C.dark,
    thumbAccent: C.accent,
  },
  {
    id: 'antes_depois',
    name: 'Antes & Depois',
    description: 'Layout split com rótulos "Antes / Depois" — perfeito para transformações',
    platforms: ['instagram_post'],
    thumbBg: `linear-gradient(to right, #ccc 50%, ${C.accent} 50%)`,
    thumbAccent: C.white,
  },
  {
    id: 'cta_card',
    name: 'CTA Card',
    description: 'Card de chamada para ação com botão em destaque e urgência',
    platforms: ['instagram_post', 'linkedin'],
    thumbBg: C.accent,
    thumbAccent: C.white,
  },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Layout estilo revista com tipografia grande e bloco de cor lateral',
    platforms: ['instagram_post', 'linkedin'],
    thumbBg: `linear-gradient(to right, ${C.contrast} 35%, ${C.surface} 35%)`,
    thumbAccent: C.accent,
  },
  {
    id: 'tira_noticia',
    name: 'Tira Notícia',
    description: 'Estilo jornal/notícia com data em destaque e linha divisória',
    platforms: ['instagram_post', 'linkedin'],
    thumbBg: C.white,
    thumbAccent: C.contrast,
  },
]

// ─── Rich Text ───────────────────────────────────────────────────────────────

export interface TextSegment {
  text: string
  bold: boolean
  italic: boolean
  size?: number  // px override (undefined = use field default)
}

type RWord = { w: string; bold: boolean; italic: boolean; size: number }

function segToWords(segs: TextSegment[], defaultSize: number): RWord[] {
  const words: RWord[] = []
  for (const seg of segs) {
    for (const part of seg.text.split(/\s+/)) {
      if (part) words.push({ w: part, bold: seg.bold, italic: seg.italic, size: seg.size ?? defaultSize })
    }
  }
  return words
}

function richFont(rw: RWord, isTitle: boolean, baseStyle: string, sizeScale = 1): string {
  const family = isTitle ? F.title : F.body
  const size = Math.round(rw.size * sizeScale)
  const weight = rw.bold ? 'bold' : (isTitle ? 'bold' : (baseStyle || ''))
  const style = rw.italic ? 'italic' : ''
  return [style, weight, `${size}px`, family].filter(Boolean).join(' ')
}

function richWordW(ctx: CanvasRenderingContext2D, rw: RWord, isTitle: boolean, baseStyle: string, sizeScale = 1): number {
  ctx.font = richFont(rw, isTitle, baseStyle, sizeScale)
  return ctx.measureText(rw.w).width
}

function richSpaceW(ctx: CanvasRenderingContext2D, rw: RWord, isTitle: boolean, baseStyle: string, sizeScale = 1): number {
  ctx.font = richFont(rw, isTitle, baseStyle, sizeScale)
  return ctx.measureText(' ').width
}

function estimateRichH(
  ctx: CanvasRenderingContext2D,
  segs: TextSegment[],
  maxW: number,
  lineH: number,
  isTitle: boolean,
  defaultSize: number,
  baseStyle: string,
  sizeScale = 1,
): number {
  const words = segToWords(segs, defaultSize)
  if (!words.length) return 0
  let lines = 1, lw = 0
  for (const rw of words) {
    const ww = richWordW(ctx, rw, isTitle, baseStyle, sizeScale)
    const sw = lw > 0 ? richSpaceW(ctx, rw, isTitle, baseStyle, sizeScale) : 0
    if (lw > 0 && lw + sw + ww > maxW) { lines++; lw = ww }
    else { lw += (lw > 0 ? sw : 0) + ww }
  }
  return lines * lineH
}

function wrapRich(
  ctx: CanvasRenderingContext2D,
  segs: TextSegment[],
  leftX: number,
  y: number,
  maxW: number,
  lineH: number,
  align: 'left'|'center'|'right',
  canvasW: number,
  rightPad: number,
  color: string,
  isTitle: boolean,
  defaultSize: number,
  baseStyle = '',
  sizeScale = 1,
): number {
  const words = segToWords(segs, defaultSize)
  if (!words.length) return y

  // Build lines
  const lines: RWord[][] = []
  let line: RWord[] = [], lw = 0
  for (const rw of words) {
    const ww = richWordW(ctx, rw, isTitle, baseStyle, sizeScale)
    const sw = line.length > 0 ? richSpaceW(ctx, line[line.length - 1], isTitle, baseStyle, sizeScale) : 0
    if (line.length > 0 && lw + sw + ww > maxW) { lines.push(line); line = [rw]; lw = ww }
    else { if (line.length > 0) lw += sw; line.push(rw); lw += ww }
  }
  if (line.length) lines.push(line)

  ctx.textBaseline = 'top'
  let cy = y
  for (const lineWords of lines) {
    let totalW = 0
    for (let i = 0; i < lineWords.length; i++) {
      totalW += richWordW(ctx, lineWords[i], isTitle, baseStyle, sizeScale)
      if (i < lineWords.length - 1) totalW += richSpaceW(ctx, lineWords[i], isTitle, baseStyle, sizeScale)
    }
    let cx = align === 'center' ? canvasW / 2 - totalW / 2
           : align === 'right'  ? canvasW - rightPad - totalW
           : leftX
    for (let i = 0; i < lineWords.length; i++) {
      const rw = lineWords[i]
      ctx.font = richFont(rw, isTitle, baseStyle, sizeScale)
      ctx.fillStyle = color
      ctx.fillText(rw.w, cx, cy)
      cx += richWordW(ctx, rw, isTitle, baseStyle, sizeScale)
      if (i < lineWords.length - 1) cx += richSpaceW(ctx, rw, isTitle, baseStyle, sizeScale)
    }
    cy += lineH
  }
  return cy - lineH
}

// ─── Render Data ─────────────────────────────────────────────────────────────

export interface RenderData {
  width: number
  height: number
  image: HTMLImageElement | null
  overlayId: OverlayId
  subtitle: string
  subtitleSize: number
  subtitleColor: string
  subtitleRich: TextSegment[]
  title: string
  titleSize: number
  titleColor: string
  titleRich: TextSegment[]
  description: string
  descriptionSize: number
  descColor: string
  descRich: TextSegment[]
  subtitleAlign: 'left' | 'center' | 'right'
  titleAlign: 'left' | 'center' | 'right'
  descAlign: 'left' | 'center' | 'right'
  // Logo
  showLogo: boolean
  logoEl: HTMLImageElement | null
  // Author
  showAuthor: boolean
  authorName: string
  authorPhoto: HTMLImageElement | null
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number, y: number, w: number, h: number,
) {
  const scale = Math.max(w / img.width, h / img.height)
  const sw = img.width * scale
  const sh = img.height * scale
  const sx = x + (w - sw) / 2
  const sy = y + (h - sh) / 2
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()
  ctx.drawImage(img, sx, sy, sw, sh)
  ctx.restore()
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number, y: number,
  maxWidth: number,
  lineH: number,
): number {
  const words = text.split(/\s+/).filter(Boolean)
  let line = ''
  let cy = y
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cy)
      cy += lineH
      line = word
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, cy)
  return cy
}

function estimateTextHeight(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  lineH: number,
): number {
  if (!text.trim()) return 0
  const words = text.split(/\s+/).filter(Boolean)
  let line = ''
  let lines = 1
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines++
      line = word
    } else {
      line = test
    }
  }
  return lines * lineH
}

function drawOverlay(ctx: CanvasRenderingContext2D, id: OverlayId, w: number, h: number) {
  switch (id) {
    case 'gradient_bottom': {
      const g = ctx.createLinearGradient(0, h * 0.3, 0, h)
      g.addColorStop(0, 'rgba(0,0,0,0)')
      g.addColorStop(1, 'rgba(0,0,0,0.88)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
      break
    }
    case 'gradient_top': {
      const g = ctx.createLinearGradient(0, 0, 0, h * 0.65)
      g.addColorStop(0, 'rgba(0,0,0,0.75)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
      break
    }
    case 'gradient_both': {
      const g = ctx.createLinearGradient(0, 0, 0, h)
      g.addColorStop(0, 'rgba(0,0,0,0.72)')
      g.addColorStop(0.4, 'rgba(0,0,0,0)')
      g.addColorStop(0.6, 'rgba(0,0,0,0)')
      g.addColorStop(1, 'rgba(0,0,0,0.72)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
      break
    }
    case 'vignette': {
      const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.15, w / 2, h / 2, Math.max(w, h) * 0.75)
      g.addColorStop(0, 'rgba(0,0,0,0)')
      g.addColorStop(1, 'rgba(0,0,0,0.72)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
      break
    }
    case 'verde_wash':
      ctx.fillStyle = 'rgba(136,189,35,0.38)'
      ctx.fillRect(0, 0, w, h)
      break
    case 'dark_30':
      ctx.fillStyle = 'rgba(0,0,0,0.30)'
      ctx.fillRect(0, 0, w, h)
      break
    case 'dark_50':
      ctx.fillStyle = 'rgba(0,0,0,0.50)'
      ctx.fillRect(0, 0, w, h)
      break
    case 'stripes': {
      ctx.save()
      ctx.globalAlpha = 0.14
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 22
      const step = 64
      for (let i = -h; i < w + h; i += step) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i + h, h)
        ctx.stroke()
      }
      ctx.restore()
      break
    }
    case 'dots': {
      ctx.save()
      ctx.globalAlpha = 0.13
      ctx.fillStyle = '#fff'
      const step = 44
      for (let gy = step / 2; gy < h; gy += step) {
        for (let gx = step / 2; gx < w; gx += step) {
          ctx.beginPath()
          ctx.arc(gx, gy, 4, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.restore()
      break
    }
    default: break
  }
}

// Rounded rect helper
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// ─── Template Renderers ───────────────────────────────────────────────────────

function renderFotoGradiente(ctx: CanvasRenderingContext2D, d: RenderData) {
  const { width: W, height: H } = d
  const pad = Math.round(W * 0.065)

  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(0, 0, W, H)

  if (d.image) drawCover(ctx, d.image, 0, 0, W, H)

  if (d.overlayId === 'none') {
    const g = ctx.createLinearGradient(0, H * 0.32, 0, H)
    g.addColorStop(0, 'rgba(0,0,0,0)')
    g.addColorStop(1, 'rgba(0,0,0,0.90)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
  } else {
    drawOverlay(ctx, d.overlayId, W, H)
  }

  // Subtitle badge top-left
  if (d.subtitle?.trim()) {
    ctx.font = `600 ${d.subtitleSize}px ${F.body}`
    ctx.fillStyle = C.accent
    ctx.fillRect(pad, pad, 5, d.subtitleSize * 1.3)
    ctx.fillStyle = d.subtitleColor
    ctx.textAlign = d.subtitleAlign
    ctx.textBaseline = 'top'
    ctx.fillText(d.subtitle.toUpperCase(), alignX(d.subtitleAlign, pad + 18, W, pad), pad + 2)
  }

  // Calculate bottom text block
  const maxW = W - pad * 2
  let bottomY = H - pad

  if (d.description?.trim()) {
    const dLineH = d.descriptionSize * 1.45
    const dH = estimateRichH(ctx, d.descRich, maxW, dLineH, false, d.descriptionSize, '')
    bottomY -= dH
    wrapRich(ctx, d.descRich, pad, bottomY, maxW, dLineH, d.descAlign, W, pad, d.descColor, false, d.descriptionSize)
    bottomY -= 20
  }

  if (d.title?.trim()) {
    const tLineH = d.titleSize * 1.22
    const tH = estimateRichH(ctx, d.titleRich, maxW, tLineH, true, d.titleSize, 'bold')
    bottomY -= tH
    wrapRich(ctx, d.titleRich, pad, bottomY, maxW, tLineH, d.titleAlign, W, pad, d.titleColor, true, d.titleSize, 'bold')
  }

  drawLogo(ctx, d, 'br')
}

function renderQuadroEscuro(ctx: CanvasRenderingContext2D, d: RenderData) {
  const { width: W, height: H } = d
  const pad = Math.round(W * 0.07)

  ctx.fillStyle = C.contrast
  ctx.fillRect(0, 0, W, H)

  // Image in top-right, slightly transparent
  if (d.image) {
    const imgW = W * 0.44
    const imgH = H * 0.44
    ctx.save()
    ctx.globalAlpha = 0.22
    drawCover(ctx, d.image, W - imgW, 0, imgW, imgH)
    ctx.restore()
    // Gradient to blend image into dark bg
    const g = ctx.createLinearGradient(W - imgW, 0, W, 0)
    g.addColorStop(0, 'rgba(51,51,51,0.9)')
    g.addColorStop(1, 'rgba(51,51,51,0)')
    ctx.fillStyle = g
    ctx.fillRect(W - imgW, 0, imgW, imgH)
    const gv = ctx.createLinearGradient(0, 0, 0, imgH * 0.9)
    gv.addColorStop(0.5, 'rgba(51,51,51,0)')
    gv.addColorStop(1, 'rgba(51,51,51,1)')
    ctx.fillStyle = gv
    ctx.fillRect(W - imgW, 0, imgW, imgH)
  }

  drawOverlay(ctx, d.overlayId, W, H)

  // Vertical accent bar
  ctx.fillStyle = C.accent
  ctx.fillRect(pad, H * 0.12, 5, H * 0.76)

  const textX = pad + 24
  const maxW = W - textX - pad

  let textY = H * 0.18

  if (d.subtitle?.trim()) {
    ctx.font = `600 ${d.subtitleSize}px ${F.body}`
    ctx.fillStyle = d.subtitleColor
    ctx.textAlign = d.subtitleAlign
    ctx.textBaseline = 'top'
    ctx.fillText(d.subtitle.toUpperCase(), alignX(d.subtitleAlign, textX, W, pad), textY)
    textY += d.subtitleSize * 1.6
  }

  if (d.title?.trim()) {
    const tLineH = d.titleSize * 1.22
    textY = wrapRich(ctx, d.titleRich, textX, textY, maxW, tLineH, d.titleAlign, W, pad, d.titleColor, true, d.titleSize, 'bold') + tLineH + 12
  }

  if (d.description?.trim()) {
    wrapRich(ctx, d.descRich, textX, textY, maxW, d.descriptionSize * 1.5, d.descAlign, W, pad, d.descColor, false, d.descriptionSize)
  }

  drawLogo(ctx, d, 'br')
}

function renderVerdeFitmass(ctx: CanvasRenderingContext2D, d: RenderData) {
  const { width: W, height: H } = d
  const pad = Math.round(W * 0.08)

  ctx.fillStyle = C.accent
  ctx.fillRect(0, 0, W, H)

  // Decorative circles
  ctx.save()
  ctx.globalAlpha = 0.12
  ctx.fillStyle = C.white
  ctx.beginPath(); ctx.arc(W * 0.85, H * 0.15, W * 0.28, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(W * 0.1, H * 0.88, W * 0.18, 0, Math.PI * 2); ctx.fill()
  ctx.restore()

  // Image circle
  if (d.image) {
    const r = Math.min(W, H) * 0.28
    const cx = W / 2
    const cy = H * 0.34
    ctx.save()
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip()
    drawCover(ctx, d.image, cx - r, cy - r, r * 2, r * 2)
    ctx.restore()
    // Circle border
    ctx.save()
    ctx.globalAlpha = 0.4
    ctx.strokeStyle = C.white
    ctx.lineWidth = 6
    ctx.beginPath(); ctx.arc(cx, cy, r + 3, 0, Math.PI * 2); ctx.stroke()
    ctx.restore()
  }

  drawOverlay(ctx, d.overlayId, W, H)

  const textStartY = d.image ? H * 0.66 : H * 0.25
  let textY = textStartY

  if (d.subtitle?.trim()) {
    ctx.font = `600 ${d.subtitleSize}px ${F.body}`
    ctx.fillStyle = d.subtitleColor
    ctx.textAlign = d.subtitleAlign
    ctx.textBaseline = 'top'
    ctx.fillText(d.subtitle.toUpperCase(), alignX(d.subtitleAlign, pad, W, pad), textY)
    textY += d.subtitleSize * 1.6
  }

  if (d.title?.trim()) {
    const tLineH = d.titleSize * 1.2
    // First pass to measure — then redo from textStartY to handle alignment properly
    ctx.clearRect(0, textStartY - 10, W, H)
    ctx.fillStyle = C.accent
    ctx.fillRect(0, textStartY - 10, W, H - textStartY + 10)
    ctx.save()
    ctx.globalAlpha = 0.12
    ctx.fillStyle = C.white
    ctx.beginPath(); ctx.arc(W * 0.1, H * 0.88, W * 0.18, 0, Math.PI * 2); ctx.fill()
    ctx.restore()

    textY = textStartY
    if (d.subtitle?.trim()) {
      ctx.font = `600 ${d.subtitleSize}px ${F.body}`
      ctx.fillStyle = d.subtitleColor
      ctx.textAlign = d.subtitleAlign
      ctx.textBaseline = 'top'
      ctx.fillText(d.subtitle.toUpperCase(), alignX(d.subtitleAlign, pad, W, pad), textY)
      textY += d.subtitleSize * 1.6
    }
    const tH = estimateRichH(ctx, d.titleRich, W - pad * 2, d.titleSize * 1.22, true, d.titleSize, 'bold')
    const lastY = wrapRich(ctx, d.titleRich, pad, textY, W - pad * 2, d.titleSize * 1.22, d.titleAlign, W, pad, d.titleColor, true, d.titleSize, 'bold')
    textY = lastY
    textY += tH > d.titleSize * 1.22 ? 16 : d.titleSize * 1.22 + 16
  }

  if (d.description?.trim()) {
    wrapRich(ctx, d.descRich, pad, textY, W - pad * 2, d.descriptionSize * 1.45, d.descAlign, W, pad, d.descColor, false, d.descriptionSize)
  }

  drawLogo(ctx, d, 'br')
}

function wrapTextCenter(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  maxWidth: number,
  lineH: number,
  font: string,
  color: string,
): number {
  ctx.font = font
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  const words = text.split(/\s+/).filter(Boolean)
  let line = ''
  let cy = y
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, cx, cy)
      cy += lineH
      line = word
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, cx, cy)
  return cy
}

function alignX(align: 'left'|'center'|'right', left: number, W: number, right: number): number {
  if (align === 'center') return W / 2
  if (align === 'right') return W - right
  return left
}

function renderBrancoMinimal(ctx: CanvasRenderingContext2D, d: RenderData) {
  const { width: W, height: H } = d
  const pad = Math.round(W * 0.075)
  const barW = 7

  ctx.fillStyle = C.surface
  ctx.fillRect(0, 0, W, H)

  if (d.image) {
    const imgX = W * 0.52
    const imgW = W * 0.44
    ctx.save()
    ctx.beginPath()
    ctx.rect(imgX, 0, imgW, H)
    ctx.clip()
    drawCover(ctx, d.image, imgX, 0, imgW, H)
    ctx.restore()
    const g = ctx.createLinearGradient(imgX, 0, imgX + imgW * 0.55, 0)
    g.addColorStop(0, C.surface)
    g.addColorStop(1, 'rgba(248,248,248,0)')
    ctx.fillStyle = g
    ctx.fillRect(imgX, 0, imgW, H)
  }

  drawOverlay(ctx, d.overlayId, W, H)

  // Green accent bar
  ctx.fillStyle = C.accent
  ctx.fillRect(pad, H * 0.1, barW, H * 0.8)

  const textX = pad + barW + 24
  const maxW = W * 0.46 - pad - 24
  let textY = H * 0.15

  if (d.subtitle?.trim()) {
    ctx.font = `600 ${d.subtitleSize}px ${F.body}`
    ctx.fillStyle = d.subtitleColor
    ctx.textAlign = d.subtitleAlign
    ctx.textBaseline = 'top'
    ctx.fillText(d.subtitle.toUpperCase(), alignX(d.subtitleAlign, textX, W, pad), textY)
    textY += d.subtitleSize * 1.55
  }

  if (d.title?.trim()) {
    const tLineH = d.titleSize * 1.22
    textY = wrapRich(ctx, d.titleRich, textX, textY, maxW, tLineH, d.titleAlign, W, pad, d.titleColor, true, d.titleSize, 'bold') + tLineH + 12
  }

  if (d.description?.trim()) {
    wrapRich(ctx, d.descRich, textX, textY, maxW, d.descriptionSize * 1.5, d.descAlign, W, pad, d.descColor, false, d.descriptionSize)
  }

  // Accent dot bottom-left
  ctx.fillStyle = C.accent
  ctx.beginPath()
  ctx.arc(pad + barW / 2, H - pad, 5, 0, Math.PI * 2)
  ctx.fill()

  drawLogo(ctx, d, 'br')
}

function renderSplitHalf(ctx: CanvasRenderingContext2D, d: RenderData) {
  const { width: W, height: H } = d
  const pad = Math.round(W * 0.07)
  const isStory = H > W

  const imgX = 0, imgY = 0
  let imgW = W, imgH = H
  let textBgX = 0, textBgY = 0, textBgW = W, textBgH = H

  if (isStory) {
    imgH = Math.round(H * 0.55)
    textBgY = imgH
    textBgH = H - imgH
  } else {
    imgW = Math.round(W * 0.50)
    textBgX = imgW
    textBgW = W - imgW
  }

  // Image half
  ctx.fillStyle = '#333'
  ctx.fillRect(imgX, imgY, imgW, imgH)
  if (d.image) drawCover(ctx, d.image, imgX, imgY, imgW, imgH)
  if (d.overlayId !== 'none') drawOverlay(ctx, d.overlayId, imgW, imgH)

  // Text half
  ctx.fillStyle = C.contrast
  ctx.fillRect(textBgX, textBgY, textBgW, textBgH)

  // Accent bar
  if (!isStory) {
    ctx.fillStyle = C.accent
    ctx.fillRect(textBgX, textBgY, 5, textBgH)
  } else {
    ctx.fillStyle = C.accent
    ctx.fillRect(textBgX, textBgY, textBgW, 5)
  }

  const tX = textBgX + pad
  const maxW = textBgW - pad * 2
  let textY = textBgY + (isStory ? pad * 0.9 : textBgH * 0.18)

  if (d.subtitle?.trim()) {
    ctx.font = `600 ${d.subtitleSize}px ${F.body}`
    ctx.fillStyle = d.subtitleColor
    ctx.textAlign = d.subtitleAlign
    ctx.textBaseline = 'top'
    ctx.fillText(d.subtitle.toUpperCase(), alignX(d.subtitleAlign, tX, W, pad), textY)
    textY += d.subtitleSize * 1.6
  }
  if (d.title?.trim()) {
    const tLineH = d.titleSize * 1.22
    textY = wrapRich(ctx, d.titleRich, tX, textY, maxW, tLineH, d.titleAlign, W, pad, d.titleColor, true, d.titleSize, 'bold') + tLineH + 12
  }
  if (d.description?.trim()) {
    wrapRich(ctx, d.descRich, tX, textY, maxW, d.descriptionSize * 1.45, d.descAlign, W, pad, d.descColor, false, d.descriptionSize)
  }

  drawLogo(ctx, d, 'br')
}

function renderManchete(ctx: CanvasRenderingContext2D, d: RenderData) {
  const { width: W, height: H } = d
  const pad = Math.round(W * 0.07)

  ctx.fillStyle = '#111'
  ctx.fillRect(0, 0, W, H)
  if (d.image) drawCover(ctx, d.image, 0, 0, W, H)

  // Heavy dark overlay always
  ctx.fillStyle = 'rgba(0,0,0,0.65)'
  ctx.fillRect(0, 0, W, H)
  if (d.overlayId !== 'none') drawOverlay(ctx, d.overlayId, W, H)

  // Subtitle pill
  if (d.subtitle?.trim()) {
    const s = d.subtitleSize
    const text = d.subtitle.toUpperCase()
    ctx.font = `700 ${s}px ${F.body}`
    const tw = ctx.measureText(text).width
    const pillX = (W - tw - s * 2) / 2
    const pillY = H * 0.12
    ctx.fillStyle = C.accent
    roundRect(ctx, pillX, pillY, tw + s * 2, s * 1.8, s * 0.4)
    ctx.fill()
    ctx.fillStyle = C.white
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(text, pillX + s, pillY + s * 0.4)
  }

  // Big title centered
  if (d.title?.trim()) {
    const tSize = d.titleSize * 1.05
    const tLineH = tSize * 1.2
    const tH = estimateRichH(ctx, d.titleRich, W - pad * 2, tLineH, true, d.titleSize, 'bold', 1.05)
    wrapRich(ctx, d.titleRich, pad, H / 2 - tH / 2, W - pad * 2, tLineH, d.titleAlign, W, pad, d.titleColor, true, d.titleSize, 'bold', 1.05)
  }

  // Description bottom
  if (d.description?.trim()) {
    ctx.font = `${d.descriptionSize}px ${F.body}`
    ctx.fillStyle = d.descColor
    ctx.textAlign = d.descAlign
    ctx.textBaseline = 'bottom'
    ctx.fillText(d.description.slice(0, 80) + (d.description.length > 80 ? '…' : ''), alignX(d.descAlign, pad, W, pad), H - pad)
  }

  // Bottom accent line
  ctx.fillStyle = C.accent
  ctx.fillRect(pad * 2, H - pad - 4, W - pad * 4, 4)

  drawLogo(ctx, d, 'br')
}

function renderCitacao(ctx: CanvasRenderingContext2D, d: RenderData) {
  const { width: W, height: H } = d
  const pad = Math.round(W * 0.09)

  ctx.fillStyle = '#FAFAF8'
  ctx.fillRect(0, 0, W, H)
  if (d.overlayId !== 'none') drawOverlay(ctx, d.overlayId, W, H)

  // Large opening quote
  ctx.font = `bold ${Math.round(W * 0.38)}px Georgia, serif`
  ctx.fillStyle = C.accent
  ctx.globalAlpha = 0.12
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText('“', pad * 0.5, -W * 0.04)
  ctx.globalAlpha = 1

  // Closing quote bottom-right
  ctx.font = `bold ${Math.round(W * 0.25)}px Georgia, serif`
  ctx.fillStyle = C.accent
  ctx.globalAlpha = 0.10
  ctx.textAlign = 'right'
  ctx.textBaseline = 'bottom'
  ctx.fillText('”', W - pad * 0.5, H + W * 0.02)
  ctx.globalAlpha = 1

  // Accent bar
  ctx.fillStyle = C.accent
  ctx.fillRect(pad, H * 0.42, W - pad * 2, 4)

  // Subtitle above bar
  if (d.subtitle?.trim()) {
    ctx.font = `600 ${d.subtitleSize}px ${F.body}`
    ctx.fillStyle = C.accent
    ctx.textAlign = 'left'
    ctx.textBaseline = 'bottom'
    ctx.fillText(d.subtitle.toUpperCase(), pad, H * 0.42 - 16)
  }

  // Title as the quote text
  if (d.title?.trim()) {
    wrapRich(ctx, d.titleRich, pad, H * 0.46, W - pad * 2, d.titleSize * 1.25, d.titleAlign, W, pad, d.titleColor, true, d.titleSize, 'bold')
  }

  // Description as attribution
  if (d.description?.trim()) {
    ctx.font = `italic ${d.descriptionSize}px ${F.body}`
    ctx.fillStyle = d.descColor
    ctx.textAlign = 'left'
    ctx.textBaseline = 'bottom'
    ctx.fillText('— ' + d.description.slice(0, 60), pad, H - pad)
  }

  drawLogo(ctx, d, 'br')
}

function renderMagazine(ctx: CanvasRenderingContext2D, d: RenderData) {
  const { width: W, height: H } = d
  const splitY = Math.round(H * 0.55)
  const pad = Math.round(W * 0.07)

  // Image top
  ctx.fillStyle = '#444'
  ctx.fillRect(0, 0, W, splitY)
  if (d.image) drawCover(ctx, d.image, 0, 0, W, splitY)
  if (d.overlayId !== 'none') {
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, W, splitY)
    ctx.clip()
    drawOverlay(ctx, d.overlayId, W, splitY)
    ctx.restore()
  }

  // Subtitle over image
  if (d.subtitle?.trim()) {
    ctx.font = `700 ${d.subtitleSize}px ${F.body}`
    const tw = ctx.measureText(d.subtitle.toUpperCase()).width
    const pH = d.subtitleSize * 1.7
    const pW = tw + d.subtitleSize * 1.4
    ctx.fillStyle = C.accent
    roundRect(ctx, pad, pad, pW, pH, 6)
    ctx.fill()
    ctx.fillStyle = C.white
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(d.subtitle.toUpperCase(), pad + d.subtitleSize * 0.7, pad + d.subtitleSize * 0.35)
  }

  // White/light bottom
  ctx.fillStyle = C.white
  ctx.fillRect(0, splitY, W, H - splitY)

  // Accent bar
  ctx.fillStyle = C.accent
  ctx.fillRect(pad, splitY + 30, 5, H - splitY - 60)

  const tX = pad + 22
  const maxW = W - tX - pad
  let textY = splitY + 44

  if (d.title?.trim()) {
    const tLineH = d.titleSize * 1.22
    textY = wrapRich(ctx, d.titleRich, tX, textY, maxW, tLineH, d.titleAlign, W, pad, d.titleColor, true, d.titleSize, 'bold') + tLineH + GAP_L
  }

  if (d.description?.trim()) {
    wrapRich(ctx, d.descRich, tX, textY + 10, maxW, d.descriptionSize * 1.5, d.descAlign, W, pad, d.descColor, false, d.descriptionSize)
  }

  drawLogo(ctx, d, 'br')
}

function renderMolduraDupla(ctx: CanvasRenderingContext2D, d: RenderData) {
  const { width: W, height: H } = d
  const pad = Math.round(W * 0.065)

  ctx.fillStyle = '#222'
  ctx.fillRect(0, 0, W, H)
  if (d.image) drawCover(ctx, d.image, 0, 0, W, H)

  ctx.fillStyle = 'rgba(0,0,0,0.55)'
  ctx.fillRect(0, 0, W, H)
  if (d.overlayId !== 'none') drawOverlay(ctx, d.overlayId, W, H)

  // Outer border
  ctx.strokeStyle = C.white
  ctx.globalAlpha = 0.9
  ctx.lineWidth = 4
  ctx.strokeRect(pad, pad, W - pad * 2, H - pad * 2)

  // Inner border
  ctx.globalAlpha = 0.5
  ctx.lineWidth = 2
  ctx.strokeRect(pad + 14, pad + 14, W - (pad + 14) * 2, H - (pad + 14) * 2)
  ctx.globalAlpha = 1

  // Accent corner marks
  const cm = 30
  ctx.strokeStyle = C.accent
  ctx.lineWidth = 4
  ;[
    [pad + 14, pad + 14],
    [W - pad - 14, pad + 14],
    [pad + 14, H - pad - 14],
    [W - pad - 14, H - pad - 14],
  ].forEach(([cx, cy]) => {
    const dx = cx < W / 2 ? 1 : -1
    const dy = cy < H / 2 ? 1 : -1
    ctx.beginPath()
    ctx.moveTo(cx, cy + dy * cm)
    ctx.lineTo(cx, cy)
    ctx.lineTo(cx + dx * cm, cy)
    ctx.stroke()
  })

  // Text centered bottom
  const maxW = W - (pad + 28) * 2
  let textY = H * 0.55

  if (d.subtitle?.trim()) {
    ctx.font = `600 ${d.subtitleSize}px ${F.body}`
    ctx.fillStyle = d.subtitleColor
    ctx.textAlign = d.subtitleAlign
    ctx.textBaseline = 'top'
    ctx.fillText(d.subtitle.toUpperCase(), alignX(d.subtitleAlign, pad, W, pad), textY)
    textY += d.subtitleSize * 1.5
  }
  if (d.title?.trim()) {
    const tLineH = d.titleSize * 1.2
    const tH = estimateRichH(ctx, d.titleRich, maxW, tLineH, true, d.titleSize, 'bold')
    wrapRich(ctx, d.titleRich, pad, textY, maxW, tLineH, d.titleAlign, W, pad, d.titleColor, true, d.titleSize, 'bold')
    textY += tH + 14
  }
  if (d.description?.trim()) {
    ctx.font = `${d.descriptionSize}px ${F.body}`
    ctx.fillStyle = d.descColor
    ctx.textAlign = d.descAlign
    ctx.textBaseline = 'top'
    ctx.fillText(d.description.slice(0, 70) + (d.description.length > 70 ? '…' : ''), alignX(d.descAlign, pad, W, pad), textY)
  }

  drawLogo(ctx, d, 'br')
}

function renderNeonLine(ctx: CanvasRenderingContext2D, d: RenderData) {
  const { width: W, height: H } = d
  const pad = Math.round(W * 0.07)

  ctx.fillStyle = '#0f0f0f'
  ctx.fillRect(0, 0, W, H)
  if (d.image) {
    ctx.save()
    ctx.globalAlpha = 0.18
    drawCover(ctx, d.image, 0, 0, W, H)
    ctx.restore()
  }
  if (d.overlayId !== 'none') drawOverlay(ctx, d.overlayId, W, H)

  // Neon horizontal lines
  const neon = C.accent
  const linePositions = [0.22, 0.78]
  for (const pos of linePositions) {
    ctx.save()
    ctx.shadowColor = neon
    ctx.shadowBlur = 18
    ctx.strokeStyle = neon
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(pad, H * pos)
    ctx.lineTo(W - pad, H * pos)
    ctx.stroke()
    ctx.restore()
  }

  // Left neon bar
  ctx.save()
  ctx.shadowColor = neon
  ctx.shadowBlur = 14
  ctx.fillStyle = neon
  ctx.fillRect(pad, H * 0.22, 4, H * 0.56)
  ctx.restore()

  let textY = H * 0.28

  if (d.subtitle?.trim()) {
    ctx.font = `600 ${d.subtitleSize}px ${F.body}`
    ctx.save()
    ctx.shadowColor = neon
    ctx.shadowBlur = 12
    ctx.fillStyle = neon
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(d.subtitle.toUpperCase(), pad + 20, textY)
    ctx.restore()
    textY += d.subtitleSize * 1.6
  }

  if (d.title?.trim()) {
    const tLineH = d.titleSize * 1.22
    textY = wrapRich(ctx, d.titleRich, pad + 20, textY, W - pad * 2 - 20, tLineH, d.titleAlign, W, pad, d.titleColor, true, d.titleSize, 'bold') + tLineH + GAP_L
  }

  if (d.description?.trim()) {
    wrapRich(ctx, d.descRich, pad + 20, textY + 12, W - pad * 2 - 20, d.descriptionSize * 1.45, d.descAlign, W, pad, d.descColor, false, d.descriptionSize)
  }

  drawLogo(ctx, d, 'br')
}

function renderDegradê(ctx: CanvasRenderingContext2D, d: RenderData) {
  const { width: W, height: H } = d
  const pad = Math.round(W * 0.08)

  // Brand gradient
  const g = ctx.createLinearGradient(0, 0, W, H)
  g.addColorStop(0, C.accent)
  g.addColorStop(0.55, '#5a8a10')
  g.addColorStop(1, C.contrast)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  if (d.image) {
    ctx.save()
    ctx.globalAlpha = 0.15
    drawCover(ctx, d.image, 0, 0, W, H)
    ctx.restore()
    ctx.save()
    ctx.globalAlpha = 0.6
    const gg = ctx.createLinearGradient(0, 0, W, H)
    gg.addColorStop(0, C.accent)
    gg.addColorStop(1, C.contrast)
    ctx.fillStyle = gg
    ctx.fillRect(0, 0, W, H)
    ctx.restore()
  }

  if (d.overlayId !== 'none') drawOverlay(ctx, d.overlayId, W, H)

  // Diagonal accent line
  ctx.save()
  ctx.globalAlpha = 0.20
  ctx.strokeStyle = C.white
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(0, H * 0.62)
  ctx.lineTo(W, H * 0.38)
  ctx.stroke()
  ctx.restore()

  const centerY = H * 0.48
  let textY = centerY - (d.title ? d.titleSize * 2 : 0)

  if (d.subtitle?.trim()) {
    ctx.font = `600 ${d.subtitleSize}px ${F.body}`
    ctx.fillStyle = d.subtitleColor
    ctx.textAlign = d.subtitleAlign
    ctx.textBaseline = 'top'
    ctx.fillText(d.subtitle.toUpperCase(), alignX(d.subtitleAlign, pad, W, pad), textY)
    textY += d.subtitleSize * 1.6
  }

  if (d.title?.trim()) {
    const tLineH = d.titleSize * 1.22
    const tH = estimateRichH(ctx, d.titleRich, W - pad * 2, tLineH, true, d.titleSize, 'bold')
    wrapRich(ctx, d.titleRich, pad, textY, W - pad * 2, tLineH, d.titleAlign, W, pad, d.titleColor, true, d.titleSize, 'bold')
    textY += tH + 18
  }

  if (d.description?.trim()) {
    const dLineH = d.descriptionSize * 1.45
    wrapRich(ctx, d.descRich, pad, textY, W - pad * 2, dLineH, d.descAlign, W, pad, d.descColor, false, d.descriptionSize)
  }

  drawLogo(ctx, d, 'br')
}

function renderStoryVertical(ctx: CanvasRenderingContext2D, d: RenderData) {
  const { width: W, height: H } = d
  const splitY = Math.round(H * 0.62)
  const pad = Math.round(W * 0.07)

  // Image
  ctx.fillStyle = '#222'
  ctx.fillRect(0, 0, W, H)
  if (d.image) drawCover(ctx, d.image, 0, 0, W, splitY)
  if (d.overlayId !== 'none') {
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, W, splitY)
    ctx.clip()
    drawOverlay(ctx, d.overlayId, W, splitY)
    ctx.restore()
  }

  // Transition gradient
  const g = ctx.createLinearGradient(0, splitY - H * 0.15, 0, splitY + H * 0.08)
  g.addColorStop(0, 'rgba(20,20,20,0)')
  g.addColorStop(1, 'rgba(20,20,20,1)')
  ctx.fillStyle = g
  ctx.fillRect(0, splitY - H * 0.15, W, H * 0.25)

  // Bottom text area
  ctx.fillStyle = '#141414'
  ctx.fillRect(0, splitY, W, H - splitY)

  // Accent line
  ctx.fillStyle = C.accent
  ctx.fillRect(pad, splitY + 28, W - pad * 2, 3)

  let textY = splitY + 46

  if (d.subtitle?.trim()) {
    ctx.font = `600 ${d.subtitleSize}px ${F.body}`
    ctx.fillStyle = d.subtitleColor
    ctx.textAlign = d.subtitleAlign
    ctx.textBaseline = 'top'
    ctx.fillText(d.subtitle.toUpperCase(), alignX(d.subtitleAlign, pad, W, pad), textY)
    textY += d.subtitleSize * 1.55
  }
  if (d.title?.trim()) {
    const tLineH = d.titleSize * 1.22
    textY = wrapRich(ctx, d.titleRich, pad, textY, W - pad * 2, tLineH, d.titleAlign, W, pad, d.titleColor, true, d.titleSize, 'bold') + tLineH + GAP_L
  }
  if (d.description?.trim()) {
    wrapRich(ctx, d.descRich, pad, textY + 10, W - pad * 2, d.descriptionSize * 1.45, d.descAlign, W, pad, d.descColor, false, d.descriptionSize)
  }

  drawLogo(ctx, d, 'tr')
}

function renderLinkedinClean(ctx: CanvasRenderingContext2D, d: RenderData) {
  const { width: W, height: H } = d
  const pad = Math.round(W * 0.06)

  ctx.fillStyle = '#0A66C2'
  ctx.fillRect(0, 0, W, H)

  if (d.image) {
    ctx.save()
    ctx.globalAlpha = 0.18
    drawCover(ctx, d.image, 0, 0, W, H)
    ctx.restore()
    const g = ctx.createLinearGradient(0, 0, W * 0.6, 0)
    g.addColorStop(0, 'rgba(10,102,194,1)')
    g.addColorStop(1, 'rgba(10,102,194,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W * 0.6, H)
  }

  if (d.overlayId !== 'none') drawOverlay(ctx, d.overlayId, W, H)

  // White panel left
  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  ctx.fillRect(0, 0, W * 0.55, H)

  ctx.fillStyle = C.white
  ctx.fillRect(pad, H * 0.12, 5, H * 0.76)

  const tX = pad + 22
  const maxW = W * 0.5 - pad * 2
  let textY = H * 0.20

  if (d.subtitle?.trim()) {
    ctx.font = `600 ${d.subtitleSize}px ${F.body}`
    ctx.fillStyle = d.subtitleColor
    ctx.textAlign = d.subtitleAlign
    ctx.textBaseline = 'top'
    ctx.fillText(d.subtitle.toUpperCase(), alignX(d.subtitleAlign, tX, W, pad), textY)
    textY += d.subtitleSize * 1.5
  }
  if (d.title?.trim()) {
    const tLineH = d.titleSize * 1.22
    textY = wrapRich(ctx, d.titleRich, tX, textY, maxW, tLineH, d.titleAlign, W, pad, d.titleColor, true, d.titleSize, 'bold') + tLineH + GAP_L
  }
  if (d.description?.trim()) {
    wrapRich(ctx, d.descRich, tX, textY + 12, maxW, d.descriptionSize * 1.45, d.descAlign, W, pad, d.descColor, false, d.descriptionSize)
  }

  drawLogo(ctx, d, 'br')
}

function renderPolaroid(ctx: CanvasRenderingContext2D, d: RenderData) {
  const { width: W, height: H } = d

  ctx.fillStyle = '#E8E8E2'
  ctx.fillRect(0, 0, W, H)

  // Subtle texture dots
  ctx.save()
  ctx.globalAlpha = 0.05
  ctx.fillStyle = C.contrast
  for (let gy = 30; gy < H; gy += 30) {
    for (let gx = 30; gx < W; gx += 30) {
      ctx.beginPath()
      ctx.arc(gx, gy, 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.restore()

  if (d.overlayId !== 'none') drawOverlay(ctx, d.overlayId, W, H)

  // Polaroid frame
  const frameX = W * 0.08
  const frameY = H * 0.06
  const frameW = W * 0.84
  const imgH = frameW * 0.82
  const bottomH = H * 0.22

  // Shadow
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.22)'
  ctx.shadowBlur = 30
  ctx.shadowOffsetY = 10
  ctx.fillStyle = C.white
  ctx.fillRect(frameX, frameY, frameW, imgH + bottomH + 16)
  ctx.restore()

  // White frame
  ctx.fillStyle = C.white
  ctx.fillRect(frameX, frameY, frameW, imgH + bottomH + 16)

  // Image
  ctx.fillStyle = '#ccc'
  ctx.fillRect(frameX + 16, frameY + 16, frameW - 32, imgH)
  if (d.image) drawCover(ctx, d.image, frameX + 16, frameY + 16, frameW - 32, imgH)

  // Bottom text area
  const textAreaY = frameY + imgH + 16
  const textAreaH = bottomH
  let textY = textAreaY + textAreaH * 0.18

  if (d.subtitle?.trim()) {
    ctx.font = `600 ${d.subtitleSize * 0.85}px ${F.body}`
    ctx.fillStyle = d.subtitleColor
    ctx.textAlign = d.subtitleAlign
    ctx.textBaseline = 'top'
    ctx.fillText(d.subtitle.toUpperCase(), alignX(d.subtitleAlign, frameX + 20, W, frameX + 20), textY)
    textY += d.subtitleSize * 1.3
  }
  if (d.title?.trim()) {
    const tSize = Math.round(d.titleSize * 0.75)
    const tLineH = tSize * 1.22
    wrapRich(ctx, d.titleRich, frameX + 20, textY, frameW - 40, tLineH, d.titleAlign, W, frameX + 20, d.titleColor, true, d.titleSize, 'bold', 0.75)
  }

  drawLogo(ctx, d, 'br')
}

// ─── Shared: logo + author overlays ─────────────────────────────────────────

function drawLogo(ctx: CanvasRenderingContext2D, d: RenderData, corner: 'tl'|'tr'|'bl'|'br' = 'br') {
  if (!d.showLogo) return
  const W = d.width, H = d.height
  const pad = Math.round(W * 0.055)
  const logoW = Math.round(W * 0.08)

  if (d.logoEl) {
    const aspect = d.logoEl.naturalWidth / d.logoEl.naturalHeight || (d.logoEl.width / d.logoEl.height) || 4
    const logoH = Math.round(logoW / aspect)
    let lx = 0, ly = 0
    if (corner === 'tl') { lx = pad; ly = pad }
    else if (corner === 'tr') { lx = W - pad - logoW; ly = pad }
    else if (corner === 'bl') { lx = pad; ly = H - pad - logoH }
    else { lx = W - pad - logoW; ly = H - pad - logoH }
    ctx.save()
    ctx.globalAlpha = 0.82
    ctx.drawImage(d.logoEl, lx, ly, logoW, logoH)
    ctx.restore()
  } else {
    // Text fallback
    const fs = Math.round(W * 0.038)
    ctx.save()
    ctx.font = `bold ${fs}px ${F.title}`
    ctx.fillStyle = C.white
    ctx.globalAlpha = 0.55
    ctx.textBaseline = corner.startsWith('b') ? 'bottom' : 'top'
    ctx.textAlign   = corner.endsWith('r') ? 'right' : 'left'
    const tx = corner.endsWith('r') ? W - pad : pad
    const ty = corner.startsWith('b') ? H - pad : pad
    ctx.fillText('FITMASS', tx, ty)
    ctx.restore()
  }
}

function drawAuthorBar(ctx: CanvasRenderingContext2D, d: RenderData, textColor = 'rgba(255,255,255,0.9)') {
  if (!d.showAuthor || (!d.authorName && !d.authorPhoto)) return
  const W = d.width, H = d.height
  const pad = Math.round(W * 0.06)
  const r   = Math.round(W * 0.045)    // avatar radius
  const barY = H - pad - r             // avatar center Y

  if (d.authorPhoto) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(pad + r, barY, r, 0, Math.PI * 2)
    ctx.clip()
    drawCover(ctx, d.authorPhoto, pad, barY - r, r * 2, r * 2)
    ctx.restore()
    ctx.save()
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(pad + r, barY, r + 2, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  } else if (d.authorName) {
    // Initials circle
    ctx.fillStyle = C.accent
    ctx.beginPath()
    ctx.arc(pad + r, barY, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.font = `bold ${Math.round(r * 1.1)}px ${F.title}`
    ctx.fillStyle = C.white
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(d.authorName.charAt(0).toUpperCase(), pad + r, barY)
  }

  if (d.authorName) {
    ctx.font = `600 ${Math.round(W * 0.03)}px ${F.body}`
    ctx.fillStyle = textColor
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(d.authorName, pad + r * 2 + 14, barY)
  }
}

// ─── New template renderers ───────────────────────────────────────────────────

function renderFitnessStat(ctx: CanvasRenderingContext2D, d: RenderData) {
  const { width: W, height: H } = d
  const pad = Math.round(W * 0.08)

  ctx.fillStyle = C.contrast
  ctx.fillRect(0, 0, W, H)

  if (d.image) {
    ctx.save()
    ctx.globalAlpha = 0.12
    drawCover(ctx, d.image, 0, 0, W, H)
    ctx.restore()
  }

  // Large accent circle (decorative)
  ctx.save()
  ctx.globalAlpha = 0.07
  ctx.fillStyle = C.accent
  ctx.beginPath()
  ctx.arc(W * 0.85, -H * 0.1, H * 0.55, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  drawOverlay(ctx, d.overlayId, W, H)

  // Subtitle pill
  if (d.subtitle?.trim()) {
    const fs = d.subtitleSize
    ctx.font = `700 ${fs}px ${F.body}`
    const tw = ctx.measureText(d.subtitle.toUpperCase()).width
    const pX = pad
    ctx.fillStyle = C.accent
    roundRect(ctx, pX, pad, tw + fs * 1.6, fs * 1.9, fs * 0.4)
    ctx.fill()
    ctx.fillStyle = C.white
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(d.subtitle.toUpperCase(), pX + fs * 0.8, pad + fs * 0.95)
  }

  // Big number/title
  if (d.title?.trim()) {
    const tSize = d.titleSize * 1.6
    const tLineH = tSize * 1.1
    const tH = estimateRichH(ctx, d.titleRich, W - pad * 2, tLineH, true, d.titleSize, 'bold', 1.6)
    const ty = (H - tH) / 2 - tLineH * 0.3
    wrapRich(ctx, d.titleRich, pad, ty, W - pad * 2, tLineH, d.titleAlign, W, pad, d.titleColor, true, d.titleSize, 'bold', 1.6)
  }

  // Description bottom
  if (d.description?.trim()) {
    ctx.font = `${d.descriptionSize}px ${F.body}`
    ctx.fillStyle = d.descColor
    ctx.textAlign = d.descAlign
    ctx.textBaseline = 'bottom'
    ctx.fillText(d.description.slice(0, 80) + (d.description.length > 80 ? '…' : ''), alignX(d.descAlign, pad, W, pad), H - pad - (d.showAuthor ? W * 0.12 : 0))
  }

  // Bottom accent line
  ctx.fillStyle = C.accent
  ctx.fillRect(pad, H - pad * 0.6, W - pad * 2, 3)

  drawAuthorBar(ctx, d)
  drawLogo(ctx, d, 'tr')
}

function renderDicaDia(ctx: CanvasRenderingContext2D, d: RenderData) {
  const { width: W, height: H } = d
  const pad = Math.round(W * 0.07)

  ctx.fillStyle = '#F4FAE8'
  ctx.fillRect(0, 0, W, H)

  // Subtle green corner accent
  ctx.save()
  ctx.globalAlpha = 0.12
  ctx.fillStyle = C.accent
  ctx.beginPath()
  ctx.arc(0, 0, W * 0.55, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  if (d.image) {
    const imgR = Math.round(W * 0.22)
    const cx = W - pad - imgR
    const cy = pad + imgR
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, imgR, 0, Math.PI * 2)
    ctx.clip()
    drawCover(ctx, d.image, cx - imgR, cy - imgR, imgR * 2, imgR * 2)
    ctx.restore()
    ctx.save()
    ctx.strokeStyle = C.accent
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.arc(cx, cy, imgR + 4, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }

  drawOverlay(ctx, d.overlayId, W, H)

  // "DICA DO DIA" badge
  const badgeFs = d.subtitleSize
  const badgeText = d.subtitle?.trim() ? d.subtitle.toUpperCase() : 'DICA DO DIA'
  ctx.font = `700 ${badgeFs}px ${F.body}`
  const bW = ctx.measureText(badgeText).width + badgeFs * 1.6
  const bH = badgeFs * 1.9
  ctx.fillStyle = C.accent
  roundRect(ctx, pad, pad * 1.2, bW, bH, bH / 2)
  ctx.fill()
  ctx.fillStyle = C.white
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(badgeText, pad + badgeFs * 0.8, pad * 1.2 + bH / 2)

  const textStartY = pad * 1.2 + bH + pad * 0.9
  let textY = textStartY

  if (d.title?.trim()) {
    const tLineH = d.titleSize * 1.22
    textY = wrapRich(ctx, d.titleRich, pad, textY, W - pad * 2.5, tLineH, d.titleAlign, W, pad, d.titleColor, true, d.titleSize, 'bold') + tLineH + GAP_L
  }

  if (d.description?.trim()) {
    wrapRich(ctx, d.descRich, pad, textY + 8, W - pad * 2.5, d.descriptionSize * 1.5, d.descAlign, W, pad, d.descColor, false, d.descriptionSize)
  }

  drawAuthorBar(ctx, d, 'rgba(51,51,51,0.7)')
  drawLogo(ctx, d, 'br')
}

function renderDepoimento(ctx: CanvasRenderingContext2D, d: RenderData) {
  const { width: W, height: H } = d
  const pad = Math.round(W * 0.08)

  ctx.fillStyle = C.white
  ctx.fillRect(0, 0, W, H)

  // Top accent stripe
  ctx.fillStyle = C.accent
  ctx.fillRect(0, 0, W, Math.round(H * 0.005) + 6)

  // Blue accent (secondary color)
  ctx.save()
  ctx.globalAlpha = 0.06
  ctx.fillStyle = C.secondary
  ctx.beginPath()
  ctx.arc(W, H, H * 0.75, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // Client photo circle (use main image as the client photo)
  const avatarR = Math.round(W * 0.14)
  const avatarCX = pad + avatarR
  const avatarCY = pad + avatarR * 1.5

  if (d.image) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(avatarCX, avatarCY, avatarR, 0, Math.PI * 2)
    ctx.clip()
    drawCover(ctx, d.image, avatarCX - avatarR, avatarCY - avatarR, avatarR * 2, avatarR * 2)
    ctx.restore()
    ctx.save()
    ctx.strokeStyle = C.accent
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(avatarCX, avatarCY, avatarR + 4, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }

  // Client name (subtitle) and role (small)
  if (d.subtitle?.trim()) {
    ctx.font = `700 ${d.subtitleSize}px ${F.body}`
    ctx.fillStyle = d.subtitleColor
    ctx.textAlign = d.subtitleAlign
    ctx.textBaseline = 'top'
    ctx.fillText(d.subtitle, alignX(d.subtitleAlign, avatarCX * 2 + 14, W, pad), avatarCY - d.subtitleSize * 0.8)
  }

  // Large opening quote
  ctx.font = `bold ${Math.round(W * 0.30)}px Georgia, serif`
  ctx.fillStyle = C.accent
  ctx.globalAlpha = 0.12
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText('"', pad * 0.5, H * 0.25)
  ctx.globalAlpha = 1

  // Testimonial text (description as the quote body)
  const quoteY = H * 0.32
  if (d.title?.trim()) {
    const quoteSegs = d.titleRich.map(s => ({ ...s, italic: true }))
    wrapRich(ctx, quoteSegs, pad, quoteY, W - pad * 2, d.titleSize * 1.5, d.titleAlign, W, pad, d.titleColor, false, d.titleSize, '600')
  }

  if (d.description?.trim()) {
    const dY = quoteY + d.titleSize * 3
    wrapRich(ctx, d.descRich, pad, dY, W - pad * 2, d.descriptionSize * 1.5, d.descAlign, W, pad, d.descColor, false, d.descriptionSize)
  }

  drawOverlay(ctx, d.overlayId, W, H)
  drawAuthorBar(ctx, d, 'rgba(51,51,51,0.65)')
  drawLogo(ctx, d, 'br')
}

function renderMotivacional(ctx: CanvasRenderingContext2D, d: RenderData) {
  const { width: W, height: H } = d
  const pad = Math.round(W * 0.07)

  ctx.fillStyle = '#0d0d0d'
  ctx.fillRect(0, 0, W, H)

  // Accent shapes
  ctx.save()
  ctx.globalAlpha = 0.15
  ctx.fillStyle = C.accent
  ctx.beginPath(); ctx.arc(-W * 0.1, H, W * 0.55, 0, Math.PI * 2); ctx.fill()
  ctx.globalAlpha = 0.08
  ctx.beginPath(); ctx.arc(W * 1.1, 0, W * 0.45, 0, Math.PI * 2); ctx.fill()
  ctx.restore()

  drawOverlay(ctx, d.overlayId, W, H)

  const centerY = H * 0.48
  let textY = centerY - (d.title ? d.titleSize * 2.5 : 0)

  if (d.subtitle?.trim()) {
    ctx.font = `700 ${d.subtitleSize}px ${F.body}`
    ctx.fillStyle = C.accent
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(d.subtitle.toUpperCase(), W / 2, textY)
    textY += d.subtitleSize * 1.8
  }

  if (d.title?.trim()) {
    const tSize = d.titleSize * 1.15
    const tLineH = tSize * 1.18
    const tH = estimateRichH(ctx, d.titleRich, W - pad * 2, tLineH, true, d.titleSize, 'bold', 1.15)
    wrapRich(ctx, d.titleRich, pad, textY, W - pad * 2, tLineH, d.titleAlign, W, pad, d.titleColor, true, d.titleSize, 'bold', 1.15)
    textY += tH + tLineH * 0.4
  }

  // Thin accent divider
  ctx.fillStyle = C.accent
  ctx.fillRect(W / 2 - 40, textY, 80, 3)
  textY += 24

  if (d.description?.trim()) {
    wrapRich(ctx, d.descRich, pad, textY, W - pad * 2, d.descriptionSize * 1.6, d.descAlign, W, pad, d.descColor, false, d.descriptionSize, '300')
  }

  drawAuthorBar(ctx, d)
  drawLogo(ctx, d, 'tr')
}

function renderAntesDepois(ctx: CanvasRenderingContext2D, d: RenderData) {
  const { width: W, height: H } = d
  const pad = Math.round(W * 0.06)
  const mid = Math.round(W / 2)

  // Left (Antes) — gray desaturated
  ctx.fillStyle = '#bbb'
  ctx.fillRect(0, 0, mid, H)
  if (d.image) {
    ctx.save()
    ctx.filter = 'grayscale(100%) brightness(0.75)'
    drawCover(ctx, d.image, 0, 0, mid, H)
    ctx.restore()
  }

  // Right (Depois) — full color
  ctx.fillStyle = '#444'
  ctx.fillRect(mid, 0, W - mid, H)
  if (d.image) drawCover(ctx, d.image, mid, 0, W - mid, H)

  // Diagonal divider line
  ctx.save()
  ctx.strokeStyle = C.white
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.moveTo(mid - 40, 0)
  ctx.lineTo(mid + 40, H)
  ctx.stroke()
  ctx.restore()

  drawOverlay(ctx, d.overlayId, W, H)

  // Labels
  const lfs = Math.round(W * 0.045)
  ctx.font = `bold ${lfs}px ${F.title}`
  ctx.textBaseline = 'middle'

  // "ANTES" left
  ctx.save()
  ctx.fillStyle = 'rgba(0,0,0,0.6)'
  roundRect(ctx, pad, H * 0.08, lfs * 4, lfs * 1.8, 6); ctx.fill()
  ctx.fillStyle = C.white; ctx.textAlign = 'left'
  ctx.fillText('ANTES', pad + lfs * 0.6, H * 0.08 + lfs * 0.9)
  ctx.restore()

  // "DEPOIS" right
  ctx.save()
  ctx.fillStyle = C.accent
  const dw = lfs * 5
  roundRect(ctx, W - pad - dw, H * 0.08, dw, lfs * 1.8, 6); ctx.fill()
  ctx.fillStyle = C.white; ctx.textAlign = 'left'
  ctx.fillText('DEPOIS', W - pad - dw + lfs * 0.6, H * 0.08 + lfs * 0.9)
  ctx.restore()

  // Bottom title over full width
  if (d.subtitle?.trim() || d.title?.trim()) {
    const bgH = H * 0.22
    ctx.fillStyle = 'rgba(0,0,0,0.72)'
    ctx.fillRect(0, H - bgH, W, bgH)
    let ty = H - bgH + pad * 0.6
    if (d.subtitle?.trim()) {
      ctx.font = `600 ${d.subtitleSize}px ${F.body}`
      ctx.fillStyle = d.subtitleColor
      ctx.textAlign = d.subtitleAlign
      ctx.textBaseline = 'top'
      ctx.fillText(d.subtitle.toUpperCase(), alignX(d.subtitleAlign, pad, W, pad), ty)
      ty += d.subtitleSize * 1.4
    }
    if (d.title?.trim()) {
      wrapRich(ctx, d.titleRich, pad, ty, W - pad * 2, d.titleSize * 1.2, d.titleAlign, W, pad, d.titleColor, true, d.titleSize, 'bold')
    }
  }

  drawLogo(ctx, d, 'br')
  drawAuthorBar(ctx, d)
}

function renderCtaCard(ctx: CanvasRenderingContext2D, d: RenderData) {
  const { width: W, height: H } = d
  const pad = Math.round(W * 0.08)

  ctx.fillStyle = C.accent
  ctx.fillRect(0, 0, W, H)

  // White circle large (decorative)
  ctx.save()
  ctx.globalAlpha = 0.10
  ctx.fillStyle = C.white
  ctx.beginPath(); ctx.arc(W * 0.9, H * 0.18, W * 0.45, 0, Math.PI * 2); ctx.fill()
  ctx.globalAlpha = 0.06
  ctx.beginPath(); ctx.arc(W * 0.1, H * 0.82, W * 0.35, 0, Math.PI * 2); ctx.fill()
  ctx.restore()

  if (d.image) {
    ctx.save()
    ctx.globalAlpha = 0.18
    drawCover(ctx, d.image, 0, 0, W, H)
    ctx.restore()
    ctx.save()
    const g = ctx.createLinearGradient(0, 0, W, H)
    g.addColorStop(0, `${C.accent}ff`)
    g.addColorStop(0.6, `${C.accent}88`)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
    ctx.restore()
  }

  drawOverlay(ctx, d.overlayId, W, H)

  let textY = H * 0.22

  if (d.subtitle?.trim()) {
    ctx.font = `700 ${d.subtitleSize}px ${F.body}`
    ctx.fillStyle = d.subtitleColor
    ctx.textAlign = d.subtitleAlign
    ctx.textBaseline = 'top'
    ctx.fillText(d.subtitle.toUpperCase(), alignX(d.subtitleAlign, pad, W, pad), textY)
    textY += d.subtitleSize * 1.6
  }

  if (d.title?.trim()) {
    const tLineH = d.titleSize * 1.2
    const tH = estimateRichH(ctx, d.titleRich, W - pad * 2, tLineH, true, d.titleSize, 'bold')
    wrapRich(ctx, d.titleRich, pad, textY, W - pad * 2, tLineH, d.titleAlign, W, pad, d.titleColor, true, d.titleSize, 'bold')
    textY += tH + 28
  }

  if (d.description?.trim()) {
    wrapRich(ctx, d.descRich, pad, textY, W - pad * 2, d.descriptionSize * 1.5, d.descAlign, W, pad, d.descColor, false, d.descriptionSize)
    textY += d.descriptionSize * 3
  }

  // CTA "button" drawn on canvas
  const btnW = Math.round(W * 0.55)
  const btnH = Math.round(W * 0.10)
  const btnX = (W - btnW) / 2
  const btnY = Math.min(textY + 20, H - pad - btnH - (d.showAuthor ? W * 0.12 : 0))
  ctx.fillStyle = C.white
  roundRect(ctx, btnX, btnY, btnW, btnH, btnH / 2)
  ctx.fill()
  ctx.font = `bold ${Math.round(W * 0.038)}px ${F.body}`
  ctx.fillStyle = C.accent
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('SAIBA MAIS →', W / 2, btnY + btnH / 2)

  drawAuthorBar(ctx, d)
  drawLogo(ctx, d, 'bl')
}

function renderEditorial(ctx: CanvasRenderingContext2D, d: RenderData) {
  const { width: W, height: H } = d
  const pad = Math.round(W * 0.07)
  const colW = Math.round(W * 0.38)

  // Dark left column
  ctx.fillStyle = C.contrast
  ctx.fillRect(0, 0, colW, H)

  // Light right area
  ctx.fillStyle = C.surface
  ctx.fillRect(colW, 0, W - colW, H)

  // Image in right area
  if (d.image) {
    ctx.save()
    ctx.beginPath()
    ctx.rect(colW, 0, W - colW, H)
    ctx.clip()
    drawCover(ctx, d.image, colW, 0, W - colW, H)
    ctx.restore()
    const g = ctx.createLinearGradient(colW, 0, W, 0)
    g.addColorStop(0, 'rgba(248,248,248,0.4)')
    g.addColorStop(0.5, 'rgba(248,248,248,0)')
    ctx.fillStyle = g
    ctx.fillRect(colW, 0, W - colW, H)
  }

  drawOverlay(ctx, d.overlayId, W, H)

  // Accent bar on left col top
  ctx.fillStyle = C.accent
  ctx.fillRect(0, 0, colW, 8)

  const maxW = colW - pad * 1.4
  let textY = H * 0.18

  if (d.subtitle?.trim()) {
    ctx.font = `700 ${d.subtitleSize}px ${F.body}`
    ctx.fillStyle = d.subtitleColor
    ctx.textAlign = d.subtitleAlign
    ctx.textBaseline = 'top'
    ctx.fillText(d.subtitle.toUpperCase(), alignX(d.subtitleAlign, pad, W, pad), textY)
    textY += d.subtitleSize * 1.6
  }

  if (d.title?.trim()) {
    const tLineH = d.titleSize * 1.22
    textY = wrapRich(ctx, d.titleRich, pad, textY, maxW, tLineH, d.titleAlign, W, pad, d.titleColor, true, d.titleSize, 'bold') + tLineH + GAP_L
  }

  // Divider
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.fillRect(pad, textY, maxW, 2)
  textY += 16

  if (d.description?.trim()) {
    wrapRich(ctx, d.descRich, pad, textY, maxW, d.descriptionSize * 1.5, d.descAlign, W, pad, d.descColor, false, d.descriptionSize)
  }

  drawAuthorBar(ctx, d)
  drawLogo(ctx, d, 'br')
}

function renderTiraNoticia(ctx: CanvasRenderingContext2D, d: RenderData) {
  const { width: W, height: H } = d
  const pad = Math.round(W * 0.07)
  const isLandscape = W > H

  ctx.fillStyle = C.white
  ctx.fillRect(0, 0, W, H)

  // Image (top 50% for square, right 45% for landscape)
  if (d.image) {
    if (isLandscape) {
      const imgX = Math.round(W * 0.55)
      ctx.save()
      ctx.beginPath()
      ctx.rect(imgX, 0, W - imgX, H)
      ctx.clip()
      drawCover(ctx, d.image, imgX, 0, W - imgX, H)
      ctx.restore()
      const g = ctx.createLinearGradient(imgX, 0, W, 0)
      g.addColorStop(0, C.white)
      g.addColorStop(0.5, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.fillRect(imgX, 0, W * 0.2, H)
    } else {
      const imgH = Math.round(H * 0.48)
      drawCover(ctx, d.image, 0, 0, W, imgH)
      const g = ctx.createLinearGradient(0, imgH - 60, 0, imgH + 10)
      g.addColorStop(0, 'rgba(255,255,255,0)')
      g.addColorStop(1, C.white)
      ctx.fillStyle = g
      ctx.fillRect(0, imgH - 60, W, 70)
    }
  }

  drawOverlay(ctx, d.overlayId, W, H)

  // Accent header bar
  ctx.fillStyle = C.contrast
  ctx.fillRect(0, 0, W, Math.round(H * 0.06))
  ctx.font = `bold ${Math.round(H * 0.028)}px ${F.body}`
  ctx.fillStyle = C.white
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('FITMASS NEWS', pad, H * 0.03)

  // Date right
  const now = new Date()
  const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
  ctx.textAlign = 'right'
  ctx.fillText(dateStr, W - pad, H * 0.03)

  const textAreaY = isLandscape ? H * 0.12 : H * 0.52
  let textY = textAreaY

  const maxW = isLandscape ? W * 0.52 : W - pad * 2

  if (d.subtitle?.trim()) {
    ctx.font = `600 ${d.subtitleSize}px ${F.body}`
    ctx.fillStyle = d.subtitleColor
    ctx.textAlign = d.subtitleAlign
    ctx.textBaseline = 'top'
    ctx.fillText(d.subtitle.toUpperCase(), alignX(d.subtitleAlign, pad, W, pad), textY)
    textY += d.subtitleSize * 1.5
  }

  // Horizontal rule
  ctx.fillStyle = C.accent
  ctx.fillRect(pad, textY, Math.round(maxW * 0.25), 3)
  textY += 16

  if (d.title?.trim()) {
    const tLineH = d.titleSize * 1.22
    textY = wrapRich(ctx, d.titleRich, pad, textY, maxW, tLineH, d.titleAlign, W, pad, d.titleColor, true, d.titleSize, 'bold') + tLineH + GAP_L
  }

  if (d.description?.trim()) {
    wrapRich(ctx, d.descRich, pad, textY, maxW, d.descriptionSize * 1.5, d.descAlign, W, pad, d.descColor, false, d.descriptionSize)
  }

  drawAuthorBar(ctx, d, 'rgba(51,51,51,0.7)')
  drawLogo(ctx, d, 'br')
}

// ─── Main render dispatcher ───────────────────────────────────────────────────

export function renderCanvas(
  ctx: CanvasRenderingContext2D,
  data: RenderData,
  templateId: TemplateId,
) {
  ctx.clearRect(0, 0, data.width, data.height)
  ctx.textBaseline = 'alphabetic'

  switch (templateId) {
    case 'foto_gradiente':   return renderFotoGradiente(ctx, data)
    case 'quadro_escuro':    return renderQuadroEscuro(ctx, data)
    case 'verde_fitmass':    return renderVerdeFitmass(ctx, data)
    case 'branco_minimal':   return renderBrancoMinimal(ctx, data)
    case 'split_half':       return renderSplitHalf(ctx, data)
    case 'manchete':         return renderManchete(ctx, data)
    case 'citacao':          return renderCitacao(ctx, data)
    case 'magazine':         return renderMagazine(ctx, data)
    case 'moldura_dupla':    return renderMolduraDupla(ctx, data)
    case 'neon_line':        return renderNeonLine(ctx, data)
    case 'degradê':          return renderDegradê(ctx, data)
    case 'story_vertical':   return renderStoryVertical(ctx, data)
    case 'linkedin_clean':   return renderLinkedinClean(ctx, data)
    case 'polaroid':         return renderPolaroid(ctx, data)
    case 'fitness_stat':     return renderFitnessStat(ctx, data)
    case 'dica_dia':         return renderDicaDia(ctx, data)
    case 'depoimento':       return renderDepoimento(ctx, data)
    case 'motivacional':     return renderMotivacional(ctx, data)
    case 'antes_depois':     return renderAntesDepois(ctx, data)
    case 'cta_card':         return renderCtaCard(ctx, data)
    case 'editorial':        return renderEditorial(ctx, data)
    case 'tira_noticia':     return renderTiraNoticia(ctx, data)
    default:                 return renderFotoGradiente(ctx, data)
  }
}
