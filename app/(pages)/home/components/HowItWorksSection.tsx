'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'

// ── Data ──────────────────────────────────────────────────────────────────────

const steps = [
  {
    number: '01',
    label: 'A Medição',
    sublabel: 'Rápida e Intuitiva',
    image: '/pages/landingpage/como_funciona/card_01.jpg',
    alt: 'Aluno realizando avaliação por bioimpedância no equipamento Fitmass Bioscan',
    text: 'O aluno realiza a própria avaliação por bioimpedância de forma 100% autônoma no equipamento da academia (ou através do celular do Personal com o app Pocket). Em segundos, a leitura é concluída.',
  },
  {
    number: '02',
    label: 'O App Fitmass',
    sublabel: 'Dados Imediatos',
    image: '/pages/landingpage/como_funciona/card_02.png',
    alt: 'Smartphone com o aplicativo Fitmass exibindo resultados da avaliação corporal',
    text: 'Os resultados vão direto para o smartphone do aluno. Ele descobre, na hora, seu percentual de gordura, massa muscular, água corporal, taxa metabólica e muito mais.',
  },
  {
    number: '03',
    label: 'O Acompanhamento',
    sublabel: 'Evolução Visual',
    image: '/pages/landingpage/como_funciona/card_03.png',
    alt: 'Gráficos de evolução corporal mês a mês no aplicativo Fitmass',
    text: 'Com o histórico salvo no aplicativo, o aluno visualiza gráficos claros de seu progresso mês a mês, entendendo exatamente como o corpo está reagindo aos treinos.',
  },
  {
    number: '04',
    label: 'O Resultado',
    sublabel: 'Treino e Dieta Ajustados',
    image: '/pages/landingpage/como_funciona/card_04.jpg',
    alt: 'Aluno e profissional analisando resultados e ajustando o plano de treino',
    text: 'Munido de dados reais, o aluno e o profissional ajustam os treinos e a alimentação com precisão, garantindo metas alcançadas, motivação em alta e menos desistências.',
  },
]

const CARD_GRADIENT =
  'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.78) 58%, rgba(0,0,0,0.96) 100%)'

const SWIPE_THRESHOLD = 80
const FLY_DISTANCE = 520

// ── Component ─────────────────────────────────────────────────────────────────

export default function HowItWorksSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  // Disabled for one frame when resetting so the new card appears at center
  const [noTransition, setNoTransition] = useState(false)

  const startX = useRef(0)
  const startY = useRef(0)
  const isHorizontal = useRef<boolean | null>(null)
  const leaving = useRef(false)

  const advance = useCallback((dir: 1 | -1) => {
    if (leaving.current) return
    leaving.current = true
    setIsLeaving(true)
    setDragX(dir * FLY_DISTANCE)

    setTimeout(() => {
      // Disable transition so the position reset doesn't animate the new card
      setNoTransition(true)
      setActiveIndex(prev => (prev + 1) % steps.length)
      setDragX(0)
      setIsLeaving(false)
      leaving.current = false

      // Re-enable transition after browser has painted the new position
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setNoTransition(false))
      )
    }, 340)
  }, [])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (leaving.current) return
    startX.current = e.clientX
    startY.current = e.clientY
    isHorizontal.current = null
    setIsDragging(true)
    ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || leaving.current) return
    const dx = e.clientX - startX.current
    const dy = e.clientY - startY.current

    if (isHorizontal.current === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
      isHorizontal.current = Math.abs(dx) > Math.abs(dy)
    }

    if (isHorizontal.current) setDragX(dx)
  }

  const onPointerUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    isHorizontal.current = null

    if (Math.abs(dragX) >= SWIPE_THRESHOLD) {
      advance(dragX > 0 ? 1 : -1)
    } else {
      setDragX(0)
    }
  }

  const nextIndex = (activeIndex + 1) % steps.length
  const active = steps[activeIndex]
  const next = steps[nextIndex]

  const dragProgress = Math.min(Math.abs(dragX) / SWIPE_THRESHOLD, 1)
  const bgScale = 0.93 + dragProgress * 0.07
  const rotation = dragX * 0.055
  const hintOpacity = Math.min(Math.max((Math.abs(dragX) - 30) / 60, 0), 1)

  const activeTransition = noTransition
    ? 'none'
    : isDragging
      ? 'none'
      : isLeaving
        ? 'transform 340ms cubic-bezier(0.32,0.72,0,1)'
        : 'transform 400ms cubic-bezier(0.34,1.56,0.64,1)'

  return (
    <section
      id="como-funciona"
      className="relative pt-20 pb-28 px-4 bg-surface overflow-hidden"
      aria-labelledby="como-funciona-heading"
    >
      {/* Subtle background accent */}
      <div
        className="absolute top-0 right-0 w-150 h-150 rounded-full blur-3xl pointer-events-none opacity-[0.04]"
        style={{ backgroundColor: '#88BD23', transform: 'translate(30%, -30%)' }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto">

        {/* ── Heading ─────────────────────────────────────────────────────────── */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            Como Funciona
          </span>
          <h2
            id="como-funciona-heading"
            className="font-title text-4xl md:text-5xl uppercase text-contrast tracking-wide leading-tight mb-4"
          >
            A EVOLUÇÃO NA PALMA DA MÃO:{' '}
            <span className="text-accent">COMO O FITMASS FUNCIONA</span>{' '}
            PARA O SEU ALUNO
          </h2>
          <p className="font-body text-contrast/55 text-lg max-w-2xl mx-auto leading-relaxed">
            Uma jornada simples, rápida e autônoma que transforma dados em motivação diária.
          </p>
        </div>

        {/*
          ══ MOBILE — Tinder card stack ══════════════════════════════════════════
        */}
        <div className="lg:hidden">
          <div className="relative h-125 select-none">

            {/* Background card — next in queue */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden bg-[#111]"
              style={{
                transform: `scale(${bgScale})`,
                transition: isDragging ? 'none' : 'transform 340ms ease-out',
                zIndex: 1,
              }}
              aria-hidden="true"
            >
              <Image
                src={next.image}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0" style={{ background: CARD_GRADIENT }} />
              <div className="absolute top-4 left-4">
                <span className="font-title text-[11px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white/90 leading-none border border-white/15">
                  {next.number}
                </span>
              </div>
            </div>

            {/* Active card — draggable */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden bg-[#111] cursor-grab active:cursor-grabbing"
              style={{
                transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
                transformOrigin: '50% 110%',
                transition: activeTransition,
                zIndex: 10,
                willChange: 'transform',
              }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <Image
                src={active.image}
                alt={active.alt}
                fill
                sizes="100vw"
                className="object-cover"
                priority
                draggable={false}
              />
              <div className="absolute inset-0" style={{ background: CARD_GRADIENT }} />

              {/* Swipe hint badge */}
              {hintOpacity > 0 && (
                <div
                  className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body font-bold text-xs uppercase tracking-wider"
                  style={{
                    opacity: hintOpacity,
                    backgroundColor: 'rgba(136,189,35,0.9)',
                    color: '#000',
                    backdropFilter: 'blur(8px)',
                  }}
                  aria-hidden="true"
                >
                  Próximo
                  <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </div>
              )}

              {/* Step badge */}
              <div className="absolute top-4 left-4">
                <span className="font-title text-[11px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white/90 leading-none border border-white/15">
                  {active.number}
                </span>
              </div>

              {/* Text overlay */}
              <div className="absolute inset-x-0 bottom-0 px-5 pb-6 pt-4">
                <h3 className="font-title text-xl uppercase text-white tracking-wide leading-tight">
                  {active.label}
                </h3>
                <p className="font-body text-accent text-xs font-semibold uppercase tracking-widest mt-0.5 mb-3">
                  {active.sublabel}
                </p>
                <p className="font-body text-white/70 text-sm leading-relaxed">
                  {active.text}
                </p>
              </div>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex flex-col items-center gap-3 mt-5">
            <div className="flex gap-2" role="tablist" aria-label="Passos">
              {steps.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === activeIndex}
                  aria-label={`Passo ${i + 1}`}
                  onClick={() => !leaving.current && setActiveIndex(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activeIndex ? 24 : 8,
                    height: 8,
                    backgroundColor: i === activeIndex ? '#88BD23' : 'rgba(0,0,0,0.15)',
                  }}
                />
              ))}
            </div>
            <p className="font-body text-contrast/35 text-xs">
              Arraste para ver o próximo
            </p>
          </div>
        </div>

        {/*
          ══ DESKTOP — grid ══════════════════════════════════════════════════════
        */}
        <div className="hidden lg:grid grid-cols-4 gap-6">
          {steps.map(({ number, label, sublabel, text, image, alt }, idx) => (
            <div key={number} className="relative">

              {/* Connector arrow */}
              {idx < steps.length - 1 && (
                <div
                  className="absolute top-1/3 left-[calc(100%+0.25rem)] w-5 z-10 -translate-y-1/2"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 16" fill="none" className="w-5 h-4 text-white/60 drop-shadow">
                    <path d="M0 8h20M14 2l6 6-6 6" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}

              <div className="group relative overflow-hidden rounded-2xl bg-[#111] aspect-3/4 shadow-md hover:shadow-xl transition-shadow duration-300">
                <Image
                  src={image}
                  alt={alt}
                  fill
                  sizes="25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  priority={idx === 0}
                />
                <div className="absolute inset-0" style={{ background: CARD_GRADIENT }} />

                <div className="absolute top-4 left-4">
                  <span className="font-title text-[11px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white/90 leading-none border border-white/15">
                    {number}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 px-5 pb-6 pt-4">
                  <h3 className="font-title text-lg uppercase text-white tracking-wide leading-tight">
                    {label}
                  </h3>
                  <p className="font-body text-accent text-xs font-semibold uppercase tracking-widest mt-0.5 mb-3">
                    {sublabel}
                  </p>
                  <p className="font-body text-white/70 text-sm leading-relaxed">
                    {text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Diagonal → AiFitSimulator */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="w-full" style={{ height: 48, display: 'block' }}>
          <polygon fill="rgba(136,189,35,0.06)" points="0,48 1440,48 1440,0" />
        </svg>
      </div>
    </section>
  )
}
