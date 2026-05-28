'use client'

import { useState, useEffect } from 'react'
import MyDayMockup from '@/app/(pages)/home/components/MyDayMockup'

interface CtaConfig {
  label: string
  href: string
  variant: 'primary' | 'secondary'
}

interface HeroMyDayBaseProps {
  ariaLabel: string
  badge: {
    icon?: string
    label: string
  }
  heading: React.ReactNode
  description: string
  complement: string
  ctas: CtaConfig[]
  microcopy?: string
  mockupView?: 'aluno' | 'dono'
}

function useMockupScale() {
  const [scale, setScale] = useState(0.88)

  useEffect(() => {
    function update() {
      if (window.innerWidth < 640) setScale(0.72)
      else if (window.innerWidth < 1024) setScale(0.82)
      else if (window.innerWidth < 1280) setScale(1.05)
      else setScale(1.15)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return scale
}

export default function HeroMyDayBase({
  ariaLabel,
  badge,
  heading,
  description,
  complement,
  ctas,
  microcopy,
  mockupView = 'aluno',
}: HeroMyDayBaseProps) {
  const scale = useMockupScale()
  const [interacting, setInteracting] = useState(false)

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center bg-contrast overflow-hidden"
      aria-label={ariaLabel}
    >
      {/* Glow secundário — topo direita */}
      <div
        className="absolute -top-40 -right-32 w-160 h-160 rounded-full bg-[#FF6A00]/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      {/* Glow accent — baixo esquerda */}
      <div
        className="absolute -bottom-20 -left-20 w-120 h-120 rounded-full bg-[#FF6A00]/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Grid de linhas sutil */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,106,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,106,0,1) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
        aria-hidden="true"
        suppressHydrationWarning
      />

      {/* Barras verticais decorativas */}
      <div
        className="absolute top-0 right-32 w-px h-full bg-gradient-to-b from-transparent via-[#FF6A00]/20 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 left-32 w-px h-full bg-gradient-to-b from-transparent via-[#FF6A00]/15 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Conteúdo */}
      <div className="relative max-w-6xl mx-auto w-full px-4 pt-28 pb-16 lg:pt-32 lg:pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Copy */}
        <div className="flex flex-col items-start">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-[#FF6A00]/15 text-[#FF6A00] border border-[#FF6A00]/25 font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-8">
            {badge.icon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={badge.icon} alt="" aria-hidden="true" className="w-4 h-4 object-contain" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" aria-hidden="true" />
            )}
            {badge.label}
          </span>

          <h1 className="font-title text-3xl md:text-4xl lg:text-[2.625rem] uppercase text-white tracking-wide leading-[1.1] mb-6">
            {heading}
          </h1>

          <p className="font-body text-white/65 text-lg leading-relaxed mb-4 max-w-lg">
            {description}
          </p>

          <p className="font-body text-white/50 text-base leading-relaxed mb-10 max-w-lg">
            {complement}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {ctas.map((cta) =>
              cta.variant === 'primary' ? (
                <a
                  key={cta.label}
                  href={cta.href}
                  target={cta.href.startsWith('http') ? '_blank' : undefined}
                  rel={cta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center justify-center gap-2 bg-[#FF6A00] text-white font-body font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:bg-[#FF6A00]/90 active:scale-95 transition-[background-color,transform] duration-200 whitespace-nowrap"
                >
                  {cta.label}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              ) : (
                <a
                  key={cta.label}
                  href={cta.href}
                  className="inline-flex items-center justify-center border border-[#FF6A00]/40 text-[#FF6A00] font-body font-semibold uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:border-[#FF6A00] hover:bg-[#FF6A00]/10 active:scale-95 transition-[border-color,background-color,transform] duration-200 whitespace-nowrap"
                >
                  {cta.label}
                </a>
              )
            )}
          </div>

          {microcopy && (
            <p className="font-body text-white/35 text-xs mt-4 flex items-center gap-1.5">
              <svg className="w-3 h-3 shrink-0 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {microcopy}
            </p>
          )}
        </div>

        {/* Mockup do celular */}
        <div className="flex justify-center lg:justify-end items-center">
          <div className="flex flex-col items-center gap-5">
            <div className="relative">
              <div
                className="absolute inset-0 -z-10 blur-3xl opacity-30 scale-110"
                style={{ background: 'radial-gradient(ellipse, #FF6A00 0%, transparent 65%)' }}
                aria-hidden="true"
              />
              <MyDayMockup scale={scale} onInteractChange={setInteracting} view={mockupView} />
            </div>

            <div
              className="flex items-center gap-2 pointer-events-none transition-all duration-500"
              style={{
                opacity: interacting ? 0 : 1,
                transform: interacting ? 'translateY(4px)' : 'translateY(0)',
              }}
              aria-hidden="true"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6A00] opacity-70" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6A00]" />
              </span>
              <span className="font-body text-white/45 text-xs">
                {mockupView === 'aluno'
                  ? 'Toque em uma refeição para experimentar'
                  : 'Toque em uma refeição para experimentar'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
