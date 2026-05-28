'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

import Image from 'next/image'
import MyDayMockup from './MyDayMockup'

const INTERVAL = 5000

const PRODUCTS = [
  {
    id: 0,
    name: 'Fitmass Bioscan 3.0',
    tagline: 'A nova geração da bioimpedância',
    description:
      'A balança de bioimpedância de última geração. Análise corporal completa em segundos, com precisão clínica.',
    label: 'Bioimpedância',
    badge: 'NOVA GERAÇÃO',
    accent: '#88BD23',
    bgFrom: '#0a150a',
    bgTo: '#1a3308',
    image: '/pages/landingpage/bioscan-3.png',
  },
  {
    id: 1,
    name: 'Fitmass Bioscan 2.0',
    tagline: 'Avaliação corporal acessível',
    description:
      'Tecnologia Fitmass de avaliação física com ótimo custo-benefício. Ideal para academias em expansão, studios e clínicas.',
    label: 'Bioimpedância',
    accent: '#25B6EB',
    bgFrom: '#061522',
    bgTo: '#0c2840',
    image: '/pages/landingpage/produtos/bioscan-2.png',
  },
  {
    id: 2,
    name: 'Fitmass MyDay',
    tagline: 'Nutrição inteligente no dia a dia',
    description:
      'O assistente de nutrição com IA que analisa refeições por foto e retorna macronutrientes em segundos — integrado ao app com a sua marca.',
    label: 'Nutrição IA',
    badge: 'NOVIDADE',
    accent: '#FF6A00',
    bgFrom: '#140800',
    bgTo: '#2a1200',
    image: '/pages/landingpage/aiSection/MyDay-icone.svg',
    isInteractive: true,
  },
  {
    id: 3,
    name: 'Fitmass System',
    tagline: 'Gestão completa da sua academia',
    description:
      'O software de gestão integrado à bioimpedância. Gerencie avaliações, alunos e relatórios em uma plataforma completa.',
    label: 'Software',
    accent: '#F33433',
    bgFrom: '#141614',
    bgTo: '#212422',
    image: '/pages/landingpage/produtos/System.png',
  },
  {
    id: 4,
    name: 'Fitmass App',
    tagline: 'Tudo no smartphone do aluno',
    description:
      'O app que conecta o aluno à sua avaliação física. Resultados, histórico e metas direto no celular.',
    label: 'Aplicativo',
    accent: '#88BD23',
    bgFrom: '#080808',
    bgTo: '#131313',
    image: '/pages/landingpage/produtos/App.png',
  },
]

const SCALE_MOBILE = 0.62
const SCALE_SM = 0.85
const SCALE_LG = 0.82

export default function ProductsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isMyDayInteracting, setIsMyDayInteracting] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  // Persistent viewport tracking — drives the mobile tab bar slide-in
  const [isSectionActive, setIsSectionActive] = useState(false)
  const [progressKey, setProgressKey] = useState(0)
  const [timerTrigger, setTimerTrigger] = useState(0)
  const [phoneScale, setPhoneScale] = useState(SCALE_MOBILE)
  const [myDayView, setMyDayView] = useState<'aluno' | 'dono'>('aluno')
  const [imageContainerH, setImageContainerH] = useState(0)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setPhoneScale(SCALE_LG)
      else if (window.innerWidth >= 640) setPhoneScale(SCALE_SM)
      else setPhoneScale(SCALE_MOBILE)
    }
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const el = imageContainerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setImageContainerH(entry.contentRect.height))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // One observer handles both the entry animation (one-shot) and the tab bar
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
        setIsSectionActive(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isHovered || isMyDayInteracting) return
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PRODUCTS.length)
      setProgressKey((k) => k + 1)
    }, INTERVAL)
    return () => clearInterval(id)
  }, [isHovered, isMyDayInteracting, timerTrigger])

  const goTo = useCallback((index: number) => {
    setActiveIndex(index)
    setProgressKey((k) => k + 1)
    setTimerTrigger((k) => k + 1)
  }, [])

  const active = PRODUCTS[activeIndex]

  // Scale the phone mockup to never exceed the available container height
  const PHONE_H = 548
  const mobilePhoneScale = imageContainerH > 0
    ? Math.min(phoneScale, (imageContainerH / PHONE_H) * 0.86)
    : phoneScale

  return (
    <>
      {/*
        ── Mobile product tab bar ──────────────────────────────────────────────
        Must live OUTSIDE the <section>: the section uses CSS transforms for
        its entry animation, which creates a stacking context that breaks
        `position: fixed` for any descendant. As a Fragment sibling the bar
        is always positioned relative to the viewport.

        Slides down from behind the fixed global header (top-16 = 64 px) when
        the section enters the viewport; reverses on exit.
      */}
      <div
        className="fixed top-16 left-0 right-0 z-45 lg:hidden"
        style={{
          transform: isSectionActive ? 'translateY(0)' : 'translateY(-200%)',
          transition: `transform 500ms ${
            isSectionActive
              ? 'cubic-bezier(0.32,0.72,0,1)'
              : 'cubic-bezier(0.4,0,1,1)'
          }`,
          background: 'rgba(6,6,6,0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
        aria-hidden="true"
      >
        <div className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-2">
          {PRODUCTS.map((product, i) => (
            <button
              key={product.id}
              onClick={() => goTo(i)}
              className="shrink-0 relative flex items-center px-3 py-2.75 cursor-pointer"
            >
              <span
                className="font-title text-[10px] uppercase whitespace-nowrap transition-opacity duration-300"
                style={{
                  letterSpacing: '0.1em',
                  color: product.accent,
                  opacity: i === activeIndex ? 1 : 0.32,
                }}
              >
                {product.name}
              </span>
              {/* Active bottom underline */}
              <span
                className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full origin-center transition-all duration-300"
                style={{
                  backgroundColor: product.accent,
                  transform: i === activeIndex ? 'scaleX(1)' : 'scaleX(0)',
                  opacity: i === activeIndex ? 1 : 0,
                }}
              />
            </button>
          ))}
        </div>
      </div>

      <section
        id="produtos"
        ref={sectionRef}
        className={`relative w-full overflow-hidden flex flex-col transition-all duration-1000 ease-out h-svh lg:h-[95vh] ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
        style={{ background: '#000' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Linha de produtos Fitmass"
      >
        {/* Background panels — crossfade on activeIndex change */}
        {PRODUCTS.map((p, i) => (
          <div
            key={p.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ background: `linear-gradient(135deg, ${p.bgFrom} 0%, ${p.bgTo} 100%)` }}
            aria-hidden="true"
          />
        ))}

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
          aria-hidden="true"
        />

        {/* Ambient accent glow — shared by both layouts */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 rounded-full opacity-20 blur-[120px] pointer-events-none transition-colors duration-1000"
          style={{ backgroundColor: active.accent }}
          aria-hidden="true"
        />

        {/*
          ══ MOBILE — 3-row layout (lg:hidden) ════════════════════════════════

          Row 1 [Título]  — shrink-0, natural content height
          Row 2 [Foto]    — flex-1 + min-h-0, fills all remaining space
          Row 3 [CTA]     — shrink-0, natural content height

          pt-28 (112 px) clears the fixed header (~64 px) + fixed tab bar (~44 px).
          lg:py-16 on the desktop layout overrides this at the lg breakpoint.
        */}
        <div className="lg:hidden relative z-10 flex flex-col flex-1 px-6 pt-28 pb-5">

          {/* Section context */}
          <div className="shrink-0 mb-3">
            <p className="font-bold text-[10px] text-accent uppercase tracking-[0.15em]">
              Produtos Fitmass
            </p>
            <p className="font-body text-xs text-white/40 mt-1 leading-relaxed">
              Do equipamento ao app, cada produto foi desenvolvido para elevar o nível de avaliação física da sua academia.
            </p>
          </div>

          {/* ① Título */}
          <div className="shrink-0">
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-body font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2 transition-all duration-500"
              style={{ backgroundColor: `${active.accent}22`, color: active.accent }}
            >
              <span
                className="w-1 h-1 rounded-full animate-pulse"
                style={{ backgroundColor: active.accent }}
                aria-hidden="true"
              />
              {'badge' in active && active.badge ? active.badge : active.label}
            </span>
            <h3 className="font-title text-4xl uppercase text-white tracking-wide leading-[0.9]">
              {active.name}
            </h3>
          </div>

          {'isInteractive' in active && active.isInteractive && (
            <div className="shrink-0 flex items-center mb-1">
              <div
                className="flex items-center rounded-full p-0.5"
                style={{ backgroundColor: 'rgba(255,106,0,0.15)' }}
              >
                {(['aluno', 'dono'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setMyDayView(v)}
                    className="px-3 py-1 rounded-full font-body font-semibold uppercase tracking-wide transition-all duration-300 cursor-pointer text-[10px]"
                    style={{
                      backgroundColor: myDayView === v ? '#FF6A00' : 'transparent',
                      color: myDayView === v ? '#fff' : 'rgba(255,255,255,0.45)',
                    }}
                  >
                    {v === 'aluno' ? 'Aluno' : 'Dono Academia'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ② Foto — grows to fill remaining vertical space */}
          <div ref={imageContainerRef} className="relative flex-1 min-h-0 my-3 overflow-hidden">
            {/* Localised ambient glow */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              aria-hidden="true"
            >
              <div
                className="w-3/4 h-3/4 rounded-full blur-[60px] opacity-40 transition-colors duration-1000 animate-pulse"
                style={{ backgroundColor: active.accent }}
              />
            </div>

            {/* Static product images */}
            {PRODUCTS.map((p, i) => {
              if ('isInteractive' in p && p.isInteractive) return null
              return (
                <div
                  key={`mob-img-${p.id}`}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    i === activeIndex
                      ? 'opacity-100 scale-100 translate-y-0'
                      : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
                  }`}
                >
                  {/* Next.js Image fill requires a `position: relative` parent
                      with explicit CSS dimensions — this wrapper provides both */}
                  <div className="relative w-full h-full animate-float">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.7)]"
                      priority={i === 0}
                    />
                  </div>
                </div>
              )
            })}

            {/* MyDay interactive mockup */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out ${
                'isInteractive' in active && active.isInteractive
                  ? 'opacity-100 scale-100 pointer-events-auto'
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <MyDayMockup scale={mobilePhoneScale} onInteractChange={setIsMyDayInteracting} view={myDayView} />
            </div>
          </div>

          {/* ③ CTA */}
          <div className="shrink-0">
            <p className="font-body text-sm text-white/70 leading-relaxed mb-4">
              {active.description}
            </p>
            <a
              href="/planos"
              className="inline-flex items-center justify-center gap-2 font-body font-semibold text-sm uppercase tracking-widest px-6 py-3 rounded-full transition-all duration-300 hover:opacity-90 active:scale-95 group"
              style={{ backgroundColor: active.accent, color: '#fff' }}
            >
              Saiba mais
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>

        {/*
          ══ DESKTOP — original layout (hidden lg:flex) ════════════════════════
          Completely unchanged from the original design.
        */}
        <div className="hidden lg:flex flex-col flex-1 justify-between px-16 xl:px-24 py-6 xl:py-12 relative z-10">
          {/* Section intro */}
          <div className="mb-2">
            <span className="inline-flex items-center gap-2 bg-white/8 text-white/50 font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/30" aria-hidden="true" />
              Produtos
            </span>
            <h2
              id="produtos-heading"
              className="font-title text-3xl xl:text-4xl uppercase text-white tracking-wide leading-tight"
            >
              Conheça o ecossistema{' '}
              <span
                className="transition-colors duration-1000"
                style={{ color: active.accent }}
              >
                Fitmass
              </span>
            </h2>
            <p className="font-body text-white/50 text-xs xl:text-sm mt-1.5 max-w-xl">
              Do equipamento ao app, cada produto foi desenvolvido para elevar o nível de avaliação física da sua academia.
            </p>
          </div>

          {/* Grid: Text + Featured Image */}
          <div className="grid grid-cols-2 gap-8 xl:gap-12 items-center flex-1 min-h-0">
            <div className="max-w-2xl">
              <span
                className="inline-flex items-center gap-2 text-xs font-body font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-3 transition-all duration-500"
                style={{ backgroundColor: `${active.accent}22`, color: active.accent }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: active.accent }}
                  aria-hidden="true"
                />
                {'badge' in active && active.badge ? active.badge : active.label}
              </span>

              <h3
                className="font-title uppercase text-white tracking-wide leading-[0.9] mb-3 xl:mb-5"
                style={{ fontSize: 'clamp(2.5rem, 8vh, 5rem)' }}
              >
                {active.name}
              </h3>

              {'isInteractive' in active && active.isInteractive && (
                <div className="flex items-center mb-4 xl:mb-5">
                  <div
                    className="flex items-center rounded-full p-0.5"
                    style={{ backgroundColor: 'rgba(255,106,0,0.15)' }}
                  >
                    {(['aluno', 'dono'] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => setMyDayView(v)}
                        className="px-4 py-1.5 rounded-full font-body font-semibold uppercase tracking-wide transition-all duration-300 cursor-pointer text-xs"
                        style={{
                          backgroundColor: myDayView === v ? '#FF6A00' : 'transparent',
                          color: myDayView === v ? '#fff' : 'rgba(255,255,255,0.45)',
                        }}
                      >
                        {v === 'aluno' ? 'Aluno' : 'Dono Academia'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <p className="font-body text-sm xl:text-base text-white/70 leading-relaxed max-w-lg mb-4 xl:mb-6">
                {active.description}
              </p>

              <a
                href="/planos"
                className="inline-flex items-center justify-center gap-2 font-body font-semibold text-sm uppercase tracking-widest px-7 py-3.5 rounded-full transition-all duration-300 hover:opacity-90 hover:scale-105 group"
                style={{ backgroundColor: active.accent, color: '#fff' }}
              >
                Saiba mais
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>

            {/* Featured Image Container */}
            <div className="relative flex items-start justify-center h-[calc(95vh-360px)] self-start transition-all duration-700">
              {/* Ambient Glow behind image */}
              <div
                className="absolute w-[120%] h-[120%] rounded-full blur-[100px] opacity-30 transition-colors duration-1000 animate-pulse"
                style={{ backgroundColor: active.accent }}
              />

              {/* Static product images */}
              {PRODUCTS.map((p, i) => {
                if ('isInteractive' in p && p.isInteractive) return null
                return (
                  <div
                    key={`desk-img-${p.id}`}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                      i === activeIndex
                        ? 'opacity-100 scale-100 translate-y-0 rotate-0'
                        : 'opacity-0 scale-90 translate-y-8 rotate-3 pointer-events-none'
                    }`}
                  >
                    <div className="relative w-full h-full animate-float">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain drop-shadow-[0_35px_60px_rgba(0,0,0,0.6)]"
                        priority={i === 0}
                      />
                    </div>
                  </div>
                )
              })}

              {/* MyDay interactive mockup */}
              <div
                className={`absolute inset-x-0 top-0 bottom-0 flex items-start justify-center transition-all duration-1000 ease-in-out ${
                  'isInteractive' in active && active.isInteractive
                    ? 'opacity-100 scale-100 pointer-events-auto'
                    : 'opacity-0 scale-90 pointer-events-none'
                }`}
              >
                <MyDayMockup scale={SCALE_LG} onInteractChange={setIsMyDayInteracting} view={myDayView} />
              </div>

              {/* Decorative large ordinal */}
              <div
                className="absolute -right-12 -bottom-8 hidden xl:block text-[22rem] font-title leading-none select-none opacity-[0.07] transition-all duration-700 z-[-1] blur-[2px]"
                style={{ color: active.accent }}
                aria-hidden="true"
              >
                0{activeIndex + 1}
              </div>
            </div>
          </div>

          {/* Bottom: Thumbnails + progress bar */}
          <div>
            <div className="flex gap-3 mb-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {PRODUCTS.map((product, i) => (
                <button
                  key={product.id}
                  onMouseEnter={() => goTo(i)}
                  onClick={() => goTo(i)}
                  className={`shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer text-left ${
                    i === activeIndex
                      ? 'border-white/30 bg-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
                      : 'border-white/8 bg-white/4 hover:bg-white/8 hover:border-white/16'
                  }`}
                  style={{ minWidth: 190 }}
                  aria-label={`Produto: ${product.name}`}
                  aria-pressed={i === activeIndex}
                >
                  <div className="relative w-9 h-9 shrink-0 bg-white/5 rounded-lg overflow-hidden p-1">
                    <Image
                      src={product.image}
                      alt=""
                      fill
                      sizes="36px"
                      className={`object-contain transition-all duration-500 ${
                        i === activeIndex ? 'scale-100' : 'grayscale opacity-60'
                      }`}
                    />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span
                      className="font-title text-sm uppercase tracking-wide leading-tight transition-colors duration-300"
                      style={{ color: i === activeIndex ? 'white' : 'rgba(255,255,255,0.5)' }}
                    >
                      {product.name}
                    </span>
                    <span
                      className="font-body text-[10px] uppercase tracking-wider leading-tight opacity-40"
                      style={{ color: 'white' }}
                    >
                      {product.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Progress bar — resets via key, pauses via animationPlayState */}
            <div className="w-full h-0.5 bg-white/10 overflow-hidden rounded-full">
              <div
                key={progressKey}
                className="h-full"
                style={{
                  backgroundColor: active.accent,
                  animation: `products-progress ${INTERVAL}ms linear forwards`,
                  animationPlayState: isHovered ? 'paused' : 'running',
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
