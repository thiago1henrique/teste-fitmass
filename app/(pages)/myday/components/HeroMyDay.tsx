'use client'

import { useState, useEffect } from 'react'
import MyDayMockup from '@/app/(pages)/home/components/MyDayMockup'

const WHATSAPP_MYDAY =
  'https://api.whatsapp.com/send/?phone=5541984810567&text=Ol%C3%A1%2C+vim+do+site+e+gostaria+de+saber+mais+sobre+o+Fitmass+MyDay&type=phone_number&app_absent=0'

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

export default function HeroMyDay() {
  const scale = useMockupScale()
  const [interacting, setInteracting] = useState(false)

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center bg-contrast overflow-hidden"
      aria-label="Fitmass MyDay — IA no WhatsApp"
    >
      {/* Glow accent — topo direita */}
      <div
        className="absolute -top-40 -right-32 w-160 h-160 rounded-full bg-secondary/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      {/* Glow secondary — baixo esquerda */}
      <div
        className="absolute -bottom-20 -left-20 w-120 h-120 rounded-full bg-accent/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Grid de linhas sutil */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(37,182,235,1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,182,235,1) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
        aria-hidden="true"
        suppressHydrationWarning
      />

      {/* Barra vertical decorativa */}
      <div
        className="absolute top-0 right-32 w-px h-full bg-gradient-to-b from-transparent via-secondary/20 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 left-32 w-px h-full bg-gradient-to-b from-transparent via-accent/15 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Conteúdo */}
      <div className="relative max-w-6xl mx-auto w-full px-4 pt-28 pb-16 lg:pt-32 lg:pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Copy */}
        <div className="flex flex-col items-start">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-secondary/15 text-secondary font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" aria-hidden="true" />
            Fitmass MyDay
          </span>

          <h1 className="font-title text-3xl md:text-4xl lg:text-[2.625rem] uppercase text-white tracking-wide leading-[1.1] mb-6">
            <strong className="text-accent not-italic">Monetize</strong> o acompanhamento dos seus alunos.{' '}
            <strong className="text-secondary not-italic">IA no WhatsApp</strong> já inclusa no seu plano.
          </h1>

          <p className="font-body text-white/65 text-lg leading-relaxed mb-4 max-w-lg">
            O Fitmass MyDay é uma IA de acompanhamento que funciona no WhatsApp dos seus alunos, e a sua academia recebe uma parte de cada mensalidade paga.
          </p>

          <p className="font-body text-white/50 text-base leading-relaxed mb-10 max-w-lg">
            Quanto mais alunos usam, mais a academia fatura. E o melhor: eles ficam mais motivados, treinam mais e cancelam menos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a
              href={WHATSAPP_MYDAY}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-accent text-white font-body font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:bg-accent/90 active:scale-95 transition-[background-color,transform] duration-200 whitespace-nowrap"
            >
              Quero saber como funciona
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#planos"
              className="inline-flex items-center justify-center border border-secondary/40 text-secondary font-body font-semibold uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:border-secondary hover:bg-secondary/10 active:scale-95 transition-[border-color,background-color,transform] duration-200 whitespace-nowrap"
            >
              Ver planos
            </a>
          </div>
        </div>

        {/* Mockup do celular */}
        <div className="flex justify-center lg:justify-end items-center">
          <div className="flex flex-col items-center gap-5">
            <div className="relative">
              {/* Glow ambiente ao redor do celular */}
              <div
                className="absolute inset-0 -z-10 blur-3xl opacity-30 scale-110"
                style={{ background: 'radial-gradient(ellipse, #25B6EB 0%, transparent 65%)' }}
                aria-hidden="true"
              />
              <MyDayMockup scale={scale} onInteractChange={setInteracting} />
            </div>

            {/* Dica de interação */}
            <div
              className="flex items-center gap-2 pointer-events-none transition-all duration-500"
              style={{
                opacity: interacting ? 0 : 1,
                transform: interacting ? 'translateY(4px)' : 'translateY(0)',
              }}
              aria-hidden="true"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-70" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
              </span>
              <span className="font-body text-white/45 text-xs">Toque em uma refeição para experimentar</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
