'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

const WHATSAPP_MYDAY =
  'https://api.whatsapp.com/send/?phone=5541984810567&text=Ol%C3%A1%2C+vim+do+site+e+gostaria+de+saber+mais+sobre+o+Fitmass+MyDay&type=phone_number&app_absent=0'

/* ─── Icons ──────────────────────────────────────────────────────────────── */

function GiftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true"
      stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="16" width="32" height="6" rx="2" />
      <rect x="7" y="22" width="26" height="14" rx="2" />
      <line x1="20" y1="16" x2="20" y2="36" />
      <path d="M20 16 C20 16 14 16 14 10 C14 7 16.5 5 20 8 C23.5 5 26 7 26 10 C26 16 20 16 20 16Z" />
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true"
      stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="9" width="30" height="26" rx="3" />
      <line x1="5" y1="18" x2="35" y2="18" />
      <line x1="13" y1="5" x2="13" y2="13" />
      <line x1="27" y1="5" x2="27" y2="13" />
      <rect x="12" y="23" width="4" height="4" rx="1" fill="currentColor" stroke="none" />
      <rect x="18" y="23" width="4" height="4" rx="1" fill="currentColor" stroke="none" />
      <rect x="24" y="23" width="4" height="4" rx="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true"
      stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 4 L34 10 L34 22 C34 30 20 36 20 36 C20 36 6 30 6 22 L6 10 Z" />
      <path d="M14 20 L18 24 L27 15" />
    </svg>
  )
}

/* ─── Check item ─────────────────────────────────────────────────────────── */

function CheckItem({ text, isDark }: { text: string; isDark: boolean }) {
  return (
    <li className="flex items-start gap-2.5">
      <svg
        className="w-4 h-4 mt-0.5 shrink-0 text-accent"
        fill="none" viewBox="0 0 24 24"
        stroke="currentColor" strokeWidth={2.5} aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <span className={`font-body text-sm leading-snug ${isDark ? 'text-white/80' : 'text-contrast/70'}`}>
        {text}
      </span>
    </li>
  )
}

/* ─── Plan data ──────────────────────────────────────────────────────────── */

type Plan = {
  id: string
  dark: boolean
  topBadge?: string
  topBadgeAccent?: boolean
  Icon: React.FC<{ className?: string }>
  name: string
  description: string
  priceMain: string
  priceCents?: string
  priceSuffix: string
  features: string[]
  footerNote?: string
  ctaLabel: string
  ctaHref: string
  ctaExternal?: boolean
  ctaVariant: 'filled' | 'outline'
}

const PLANS: Plan[] = [
  {
    id: 'anual',
    dark: true,
    topBadge: 'MELHOR VALOR · ECONOMIZE 25%',
    topBadgeAccent: true,
    Icon: ShieldIcon,
    name: 'Anual',
    description: 'O melhor custo-benefício para o ano todo.',
    priceMain: '269',
    priceCents: ',00',
    priceSuffix: 'em até 12x',
    features: [
      'Acesso completo ao MyDay',
      'Acesso garantido por 12 meses',
      'Renovação anual automática',
      'Economize 25% em relação ao mensal',
      'Cancele quando quiser',
    ],
    ctaLabel: 'Assinar plano anual',
    ctaHref: '/checkout?plan=myday&billing=annual',
    ctaVariant: 'filled',
  },
  {
    id: 'mensal',
    dark: false,
    Icon: CalendarIcon,
    name: 'Mensal',
    description: 'Flexibilidade total, renove todo mês.',
    priceMain: '29',
    priceCents: ',90',
    priceSuffix: '/mês',
    features: [
      'Acesso completo ao MyDay',
      'Renovação mensal automática',
      'Cancele quando quiser',
    ],
    ctaLabel: 'Assinar plano mensal',
    ctaHref: '/checkout?plan=myday&billing=monthly',
    ctaVariant: 'outline',
  },
  {
    id: 'trial',
    dark: false,
    topBadge: 'COMECE AQUI',
    topBadgeAccent: false,
    Icon: GiftIcon,
    name: 'Trial Gratuito',
    description: 'Experimente o MyDay sem compromisso.',
    priceMain: '0',
    priceSuffix: '/ 7 dias',
    features: ['Acesso completo ao MyDay por 7 dias'],
    footerNote: 'Sem cartão de crédito. Sem cobrança automática.',
    ctaLabel: 'Começar agora →',
    ctaHref: WHATSAPP_MYDAY,
    ctaExternal: true,
    ctaVariant: 'outline',
  },
]

/* ─── Card inner content (shared between mobile deck and desktop grid) ───── */

function CardInner({ plan }: { plan: Plan }) {
  const ctaBase =
    'mt-8 block text-center font-body font-semibold text-sm uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent'
  const ctaClass =
    plan.ctaVariant === 'filled'
      ? `${ctaBase} bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/30`
      : `${ctaBase} border-2 border-accent/50 text-accent hover:border-accent hover:bg-accent hover:text-white`

  return (
    <>
      {plan.topBadge && (
        <div
          className={`font-body font-bold text-xs uppercase tracking-widest text-center py-2 rounded-t-[14px] ${
            plan.topBadgeAccent
              ? 'bg-accent text-white'
              : 'bg-accent/15 text-accent border-b border-accent/20'
          }`}
        >
          {plan.topBadge}
        </div>
      )}
      <div className="flex flex-col flex-1 p-8">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shrink-0 ${
            plan.dark ? 'bg-accent/20 text-accent' : 'bg-accent/10 text-accent'
          }`}
        >
          <plan.Icon className="w-8 h-8" />
        </div>
        <h3
          className={`font-title text-3xl uppercase tracking-wide mb-1 ${
            plan.dark ? 'text-accent' : 'text-contrast'
          }`}
        >
          {plan.name}
        </h3>
        <p
          className={`font-body text-sm leading-snug mb-6 ${
            plan.dark ? 'text-white/55' : 'text-contrast/55'
          }`}
        >
          {plan.description}
        </p>
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span
              className={`font-body text-sm font-medium ${
                plan.dark ? 'text-white/50' : 'text-contrast/40'
              }`}
            >
              R$
            </span>
            <span
              className={`font-title text-5xl tabular-nums leading-none ${
                plan.dark ? 'text-accent' : 'text-contrast'
              }`}
            >
              {plan.priceMain}
            </span>
            {plan.priceCents && (
              <span
                className={`font-body text-2xl font-semibold ${
                  plan.dark ? 'text-white/60' : 'text-contrast/70'
                }`}
              >
                {plan.priceCents}
              </span>
            )}
          </div>
          <span
            className={`font-body text-xs mt-0.5 inline-block ${
              plan.dark ? 'text-white/40' : 'text-contrast/40'
            }`}
          >
            {plan.priceSuffix}
          </span>
        </div>
        <hr className={`mb-6 ${plan.dark ? 'border-white/10' : 'border-gray-100'}`} />
        <ul className="space-y-3 flex-1" aria-label={`Recursos do plano ${plan.name}`}>
          {plan.features.map((f, i) => (
            <CheckItem key={i} text={f} isDark={plan.dark} />
          ))}
        </ul>
        {plan.footerNote && (
          <p
            className={`font-body text-xs mt-4 leading-relaxed ${
              plan.dark ? 'text-white/40' : 'text-contrast/40'
            }`}
          >
            {plan.footerNote}
          </p>
        )}
        {plan.ctaExternal ? (
          <a href={plan.ctaHref} target="_blank" rel="noopener noreferrer" className={ctaClass}>
            {plan.ctaLabel}
          </a>
        ) : (
          <Link href={plan.ctaHref} className={ctaClass}>
            {plan.ctaLabel}
          </Link>
        )}
      </div>
    </>
  )
}

/* ─── Section ────────────────────────────────────────────────────────────── */

export default function MyDayPlanSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const startX = useRef(0)
  const startY = useRef(0)
  const gestureDir = useRef<'h' | 'v' | null>(null)
  const captured = useRef(false)

  const total = PLANS.length
  const THRESHOLD = 75

  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX
    startY.current = e.clientY
    gestureDir.current = null
    captured.current = false
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const dx = e.clientX - startX.current
    const dy = e.clientY - startY.current

    if (gestureDir.current === null) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return
      gestureDir.current = Math.abs(dx) >= Math.abs(dy) ? 'h' : 'v'
      if (gestureDir.current === 'h') {
        e.currentTarget.setPointerCapture(e.pointerId)
        captured.current = true
        setIsDragging(true)
      }
    }

    if (gestureDir.current !== 'h') return

    // Rubber band at edges
    const canLeft = activeIndex < total - 1
    const canRight = activeIndex > 0
    let effective = dx
    if (dx < 0 && !canLeft) effective = dx * 0.2
    if (dx > 0 && !canRight) effective = dx * 0.2
    setDragX(effective)
  }

  const onPointerUp = () => {
    if (!captured.current) return
    setIsDragging(false)
    gestureDir.current = null
    captured.current = false

    const goLeft = dragX < -THRESHOLD && activeIndex < total - 1
    const goRight = dragX > THRESHOLD && activeIndex > 0

    if (goLeft || goRight) {
      const flyTo = goLeft ? -600 : 600
      const next = goLeft ? activeIndex + 1 : activeIndex - 1
      setDragX(flyTo)
      setTimeout(() => {
        setActiveIndex(next)
        setDragX(0)
      }, 280)
    } else {
      setDragX(0)
    }
  }

  return (
    <section
      id="planos-myday"
      className="py-20 px-4 bg-surface"
      aria-labelledby="myday-planos-heading"
    >
      <div className="max-w-5xl mx-auto">

        {/* Cabeçalho */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            Planos
          </span>
          <h2
            id="myday-planos-heading"
            className="font-title text-4xl md:text-5xl text-contrast uppercase tracking-wide mb-4"
          >
            Comece grátis.<br className="hidden sm:block" /> Continue quando quiser.
          </h2>
          <p className="font-body text-contrast/60 text-lg max-w-xl mx-auto">
            7 dias para experimentar tudo. Sem cartão. Sem compromisso.
          </p>
        </div>

        {/* ── Mobile: swipe deck ── */}
        <div className="md:hidden">
          <div className="relative h-[560px] overflow-hidden">
            {PLANS.map((plan, i) => {
              const offset = i - activeIndex
              // render active card + up to 2 behind it
              if (offset < 0 || offset > 2) return null

              const isActive = offset === 0
              const tx = isActive ? dragX : 0
              const rot = isActive && isDragging ? dragX / 22 : 0
              // Behind cards: scale down from top-center, peek slightly
              const scale = isActive ? 1 : 1 - offset * 0.04
              const ty = isActive ? 0 : offset * 14
              const opacity = offset > 1 ? 0.55 : 1

              return (
                <div
                  key={plan.id}
                  className={`absolute inset-x-0 top-0 ${isActive ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
                  style={{
                    transform: `translateX(${tx}px) rotate(${rot}deg) scale(${scale}) translateY(${ty}px)`,
                    transformOrigin: 'top center',
                    zIndex: 10 - offset,
                    opacity,
                    transition:
                      isDragging && isActive
                        ? 'none'
                        : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease',
                    willChange: 'transform',
                    userSelect: 'none',
                  }}
                  onPointerDown={isActive ? onPointerDown : undefined}
                  onPointerMove={isActive ? onPointerMove : undefined}
                  onPointerUp={isActive ? onPointerUp : undefined}
                  onPointerCancel={isActive ? onPointerUp : undefined}
                >
                  <article
                    className={`flex flex-col rounded-2xl ${
                      plan.dark
                        ? 'bg-contrast border-2 border-accent shadow-2xl shadow-accent/25'
                        : 'bg-white border border-gray-200 shadow-md'
                    }`}
                    aria-label={`Plano ${plan.name}`}
                    draggable={false}
                  >
                    <CardInner plan={plan} />
                  </article>
                </div>
              )
            })}
          </div>

          {/* Indicadores */}
          <div className="mt-5 flex flex-col items-center gap-2" aria-hidden="true">
            <div className="flex items-center justify-center gap-2">
              {PLANS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (!isDragging) { setActiveIndex(i); setDragX(0) }
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIndex ? 'w-5 h-1.5 bg-accent' : 'w-1.5 h-1.5 bg-contrast/20'
                  }`}
                  aria-label={`Ver plano ${PLANS[i].name}`}
                />
              ))}
            </div>
            <p className="font-body text-xs text-contrast/35">
              ← arraste para ver outros planos →
            </p>
          </div>
        </div>

        {/* ── Desktop: grid (unchanged) ── */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-6 items-start">
          {PLANS.map((plan) => (
            <article
              key={plan.id}
              className={`relative flex flex-col rounded-2xl transition-all duration-300 ${
                plan.dark
                  ? 'bg-contrast border-2 border-accent shadow-2xl shadow-accent/25 md:scale-105 md:-translate-y-3 z-10'
                  : 'bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1'
              }`}
              aria-label={`Plano ${plan.name}`}
            >
              <CardInner plan={plan} />
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}
