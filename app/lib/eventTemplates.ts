import type { EventTemplate, FitmassEventData, FitmassEventThemeColors, PromoSection } from '@/app/types/events'

function promo(
  text: string,
  linkText: string,
  link: string,
  bgColor: string,
  textColor: string,
  countdownEnd: string,
): PromoSection {
  return { text, linkText, link, bgColor, textColor, countdownEnd }
}

const y = new Date().getFullYear()

export const EVENT_TEMPLATES: Record<
  EventTemplate,
  Omit<FitmassEventData, 'id' | 'active' | 'startDate' | 'endDate' | 'createdAt' | 'banners'>
> = {
  'black-friday': {
    name: 'Black Friday',
    template: 'black-friday',
    theme: { accent: '234 88 12', secondary: '249 115 22', surface: '255 250 245' },
    promoStrip: promo(
      '🔥 Black Friday Fitmass — até 50% OFF nos planos!',
      'Ver Planos',
      '/planos',
      '#EA580C',
      '#FFFFFF',
      `${y}-11-30T23:59:59`,
    ),
  },
  natal: {
    name: 'Natal',
    template: 'natal',
    theme: { accent: '185 28 28', secondary: '220 38 38', surface: '255 250 250' },
    promoStrip: promo(
      '🎄 Presente de Natal: plano com desconto especial!',
      'Aproveitar',
      '/planos',
      '#B91C1C',
      '#FFFFFF',
      `${y}-12-25T23:59:59`,
    ),
  },
  'ano-novo': {
    name: 'Ano Novo',
    template: 'ano-novo',
    theme: { accent: '202 138 4', secondary: '161 98 7', surface: '250 250 240' },
    promoStrip: promo(
      '✨ Ano Novo, corpo novo! Comece 2025 com a Fitmass.',
      'Quero começar',
      '/planos',
      '#CA8A04',
      '#FFFFFF',
      `${y + 1}-01-07T23:59:59`,
    ),
  },
  verao: {
    name: 'Verão',
    template: 'verao',
    theme: { accent: '14 165 233', secondary: '56 189 248', surface: '240 249 255' },
    promoStrip: promo(
      '☀️ Corpo de verão com a Fitmass — comece agora!',
      'Ver Planos',
      '/planos',
      '#0EA5E9',
      '#FFFFFF',
      `${y}-02-28T23:59:59`,
    ),
  },
  lancamento: {
    name: 'Lançamento',
    template: 'lancamento',
    theme: { accent: '136 189 35', secondary: '37 182 235', surface: '242 242 247' },
    promoStrip: promo(
      '🚀 Novidade! Conheça o novo plano MyDay.',
      'Conhecer',
      '/myday',
      '#88BD23',
      '#FFFFFF',
      `${y}-12-31T23:59:59`,
    ),
  },
  custom: {
    name: 'Evento Personalizado',
    template: 'custom',
    theme: { accent: '136 189 35', secondary: '37 182 235', surface: '248 248 248' },
    promoStrip: promo(
      '🎉 Promoção especial — aproveite!',
      'Saiba mais',
      '/planos',
      '#333333',
      '#FFFFFF',
      `${y}-12-31T23:59:59`,
    ),
  },
}

export const TEMPLATE_LABELS: Record<EventTemplate, string> = {
  'black-friday': 'Black Friday',
  natal: 'Natal',
  'ano-novo': 'Ano Novo',
  verao: 'Verão',
  lancamento: 'Lançamento',
  custom: 'Personalizado',
}

export const TEMPLATE_PREVIEW_COLOR: Record<EventTemplate, string> = {
  'black-friday': '#EA580C',
  natal: '#B91C1C',
  'ano-novo': '#CA8A04',
  verao: '#0EA5E9',
  lancamento: '#88BD23',
  custom: '#333333',
}

export function rgbToHex(rgb: string): string {
  const [r, g, b] = rgb.trim().split(/\s+/).map(Number)
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

export function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `${r} ${g} ${b}`
}

export function getThemeFromTemplate(template: EventTemplate): FitmassEventThemeColors {
  return { ...EVENT_TEMPLATES[template].theme }
}
