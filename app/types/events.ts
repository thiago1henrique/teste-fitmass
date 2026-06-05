export type EventTemplate =
  | 'black-friday'
  | 'natal'
  | 'ano-novo'
  | 'verao'
  | 'lancamento'
  | 'custom'

export type BannerPosition =
  | 'after-hero'
  | 'after-bioscan'
  | 'after-how-it-works'
  | 'after-testimonials'
  | 'before-cta'
  | 'after-plans-hero'
  | 'after-plan-cards'

export type BannerType = 'horizontal' | 'divider'

export interface FitmassEventThemeColors {
  accent: string     // "R G B" — sobreposição de --color-accent
  secondary: string  // "R G B" — sobreposição de --color-secondary
  surface: string    // "R G B" — sobreposição de --color-surface
}

export interface PromoSection {
  text: string
  linkText: string
  link: string
  bgColor: string       // hex — inline style
  textColor: string     // hex — inline style
  countdownEnd: string  // ISO 8601
}

export interface BannerSection {
  id: string
  position: BannerPosition
  type: BannerType
  imageUrl?: string
  link?: string
  altText?: string
  text?: string     // tipo divider
  bgColor?: string  // tipo divider — hex
  textColor?: string // tipo divider — hex
}

export interface FitmassEventData {
  id: string
  name: string
  template: EventTemplate
  active: boolean
  startDate: string   // ISO 8601
  endDate: string     // ISO 8601
  theme: FitmassEventThemeColors
  promoStrip: PromoSection
  banners: BannerSection[]
  createdAt: string
}
