'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

import Image from 'next/image'

const INTERVAL = 5000

const PRODUCTS = [
  {
    id: 0,
    name: 'Bioscan',
    tagline: 'Avaliação corporal completa',
    description:
      'A balança inteligente que transforma dados em retenção de alunos com avaliação de bioimpedância em menos de 1 minuto.',
    label: 'Bioimpedância',
    accent: '#88BD23',
    bgFrom: '#0a150a',
    bgTo: '#1a3308',
    image: '/pages/landingpage/bioscan-2.png',
  },
  {
    id: 1,
    name: 'Scanner 3D',
    tagline: 'Visão tridimensional do corpo',
    description:
      'Escâner corporal 3D para avaliações detalhadas que impressionam e engajam seus alunos em cada sessão.',
    label: 'Escâner Corporal',
    accent: '#25B6EB',
    bgFrom: '#061522',
    bgTo: '#0c2840',
    image: '/pages/landingpage/bio/FITMASS-ESTIVADORES-33.jpg',
  },
  {
    id: 2,
    name: 'Pwrscan',
    tagline: 'Força e performance muscular',
    description:
      'Avaliação de força integrada ao ecossistema Fitmass para monitorar a evolução dos alunos de alta performance.',
    label: 'Performance',
    accent: '#F97316',
    bgFrom: '#1a0800',
    bgTo: '#2d1400',
    image: '/pages/landingpage/bio/FITMASS-ESTIVADORES-102.jpg',
  },
  {
    id: 3,
    name: 'Pocket',
    tagline: 'Mobilidade total',
    description:
      'A versão compacta da Bioscan para avaliações rápidas em qualquer espaço da sua academia.',
    label: 'Portátil',
    accent: '#A78BFA',
    bgFrom: '#0d0a1a',
    bgTo: '#1a1433',
    image: '/pages/planos/cardsSection/recursos/bio-01.png',
  },
  {
    id: 4,
    name: 'Fitmass App',
    tagline: 'Tudo no smartphone do aluno',
    description:
      'O aplicativo que conecta academia, profissional e aluno em um só lugar, com histórico completo de evolução.',
    label: 'Aplicativo',
    accent: '#88BD23',
    bgFrom: '#080808',
    bgTo: '#131313',
    image: '/pages/landingpage/Holding-Phone.png',
  },
]

export default function ProductsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [progressKey, setProgressKey] = useState(0)
  const [timerTrigger, setTimerTrigger] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  // Entry animation via Intersection Observer
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Auto-advance — pauses when hovered, restarts when timerTrigger changes (thumb interaction)
  useEffect(() => {
    if (isHovered) return
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PRODUCTS.length)
      setProgressKey((k) => k + 1)
    }, INTERVAL)
    return () => clearInterval(id)
  }, [isHovered, timerTrigger])

  // Called on thumbnail hover or click — immediately switches and resets the timer
  const goTo = useCallback((index: number) => {
    setActiveIndex(index)
    setProgressKey((k) => k + 1)
    setTimerTrigger((k) => k + 1)
  }, [])

  const active = PRODUCTS[activeIndex]

  return (
    <section
      id="produtos"
      ref={sectionRef}
      className={`relative w-full overflow-hidden flex flex-col transition-all duration-1000 ease-out lg:h-[80vh] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ minHeight: 650, background: '#000' }}
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

      {/* Ambient accent glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-[120px] pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: active.accent }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 justify-between px-6 sm:px-10 lg:px-24 py-16">
        {/* Top Content: Text + Featured Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center flex-1">
          <div className="max-w-2xl order-2 lg:order-1">
            <span
              className="inline-flex items-center gap-2 text-xs font-body font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6 transition-all duration-500"
              style={{ backgroundColor: `${active.accent}22`, color: active.accent }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: active.accent }}
                aria-hidden="true"
              />
              {active.label}
            </span>

            <h2 className="font-title text-5xl sm:text-7xl lg:text-[6rem] uppercase text-white tracking-wide leading-[0.9] mb-6">
              {active.name}
            </h2>

            <p className="font-body text-base sm:text-xl text-white/70 leading-relaxed max-w-lg mb-8">
              {active.description}
            </p>

            <a
              href="/planos"
              className="inline-flex items-center gap-3 font-body font-semibold text-sm uppercase tracking-widest transition-all duration-300 hover:gap-5 group"
              style={{ color: active.accent }}
            >
              Conhecer produto
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
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
          <div className="relative h-65 sm:h-95 lg:h-137.5 flex items-center justify-center order-1 lg:order-2">
            {/* Ambient Glow behind image */}
            <div
              className="absolute w-[120%] h-[120%] rounded-full blur-[100px] opacity-30 transition-colors duration-1000 animate-pulse"
              style={{ backgroundColor: active.accent }}
            />
            
            {PRODUCTS.map((p, i) => (
              <div
                key={`img-${p.id}`}
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
                    className="object-contain drop-shadow-[0_35px_60px_rgba(0,0,0,0.6)]"
                    priority={i === 0}
                  />
                </div>
              </div>
            ))}
            
            {/* Decorative large ordinal (background) */}
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
        <div className="mt-12 lg:mt-0">
          <div className="flex gap-4 mb-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {PRODUCTS.map((product, i) => (
              <button
                key={product.id}
                onMouseEnter={() => goTo(i)}
                onClick={() => goTo(i)}
                className={`flex-shrink-0 flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 cursor-pointer text-left ${
                  i === activeIndex
                    ? 'border-white/30 bg-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
                    : 'border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/[0.16]'
                }`}
                style={{ minWidth: 220 }}
                aria-label={`Produto: ${product.name}`}
                aria-pressed={i === activeIndex}
              >
                {/* Thumbnail Image */}
                <div className="relative w-12 h-12 flex-shrink-0 bg-white/[0.05] rounded-lg overflow-hidden">
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    className={`object-cover transition-all duration-500 ${
                      i === activeIndex ? 'scale-110' : 'grayscale opacity-60'
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
          <div className="w-full h-[2px] bg-white/10 overflow-hidden rounded-full">
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
  )
}
