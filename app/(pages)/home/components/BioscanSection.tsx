'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useCallback } from 'react'

const slides = [
  {
    image: '/pages/landingpage/bio/bio.jpg',
    number: '01',
    title: 'Fitmass Bioscan',
    subtitle: 'Avaliação Corporal Completa',
    description:
      'Nossa balança de bioimpedância profissional realiza medições precisas de composição corporal em menos de 1 minuto. Peso, gordura, massa muscular, hidratação e muito mais — com precisão laboratorial ao alcance de qualquer pessoa.',
    tag: 'Produto Destaque',
  },
  {
    image: '/pages/landingpage/bio/20250108_150757.jpg',
    number: '02',
    title: 'Interface Intuitiva',
    subtitle: 'Operação Autônoma',
    description:
      'A tela touchscreen guia o usuário passo a passo durante toda a avaliação. Sem necessidade de treinamento técnico — qualquer pessoa realiza a própria avaliação de forma completamente autônoma.',
    tag: 'Tecnologia',
  },
  {
    image: '/pages/landingpage/bio/FITMASS-ESTIVADORES-33.jpg',
    number: '03',
    title: 'Avaliação Assistida',
    subtitle: 'Resultados em Tempo Real',
    description:
      'Profissionais de saúde e personal trainers utilizam o Bioscan para conduzir avaliações e interpretar resultados na hora, personalizando treinos com base em dados reais de composição corporal.',
    tag: 'Na Prática',
  },
  {
    image: '/pages/landingpage/bio/FITMASS-ESTIVADORES-102.jpg',
    number: '04',
    title: 'Presente nas Melhores',
    subtitle: 'Da Academia ao Consultório',
    description:
      'De boxes de CrossFit a clínicas médicas e programas de saúde corporativa, o Bioscan se encaixa naturalmente em qualquer ambiente profissional que valorize saúde baseada em dados.',
    tag: 'Versatilidade',
  },
]

export default function BioscanSection() {
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(true)

  const handleSelect = useCallback(
    (index: number) => {
      if (index === active) return
      setVisible(false)
      setTimeout(() => {
        setActive(index)
        setVisible(true)
      }, 220)
    },
    [active],
  )

  const current = slides[active]
  const thumbSlides = slides.filter((_, i) => i !== active)

  return (
    <section
      className="relative w-full bg-black overflow-hidden"
      aria-labelledby="bioscan-heading"
    >
      {/* Top entry fade — masks the hard start coming from CinematicTransition */}
      <div
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, #000000, transparent)' }}
        aria-hidden="true"
      />

      {/* ── Ambient background blobs ──────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 -left-40 w-[480px] h-[480px] rounded-full bg-accent opacity-[0.07] blur-[80px] animate-blob-1 motion-reduce:animate-none" />
        <div className="absolute bottom-1/3 -right-32 w-[400px] h-[400px] rounded-full bg-secondary opacity-[0.05] blur-[80px] animate-blob-2 motion-reduce:animate-none" />
        <div className="absolute top-2/3 left-1/3 w-[320px] h-[320px] rounded-full bg-accent opacity-[0.04] blur-[60px] animate-blob-3 motion-reduce:animate-none" />
      </div>

      <div className="relative px-4 lg:px-16 py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start lg:items-center">

          {/* ── Image area ─────────────────────────────────────────────── */}
          <div className="w-full lg:w-[50%] lg:shrink-0 flex flex-col lg:flex-row gap-3">

            {/* Thumbnail strip:
                mobile  → row below main image (order-2, horizontal scroll)
                desktop → column left of main image (order-1, vertical) */}
            <div className="order-2 lg:order-1 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible no-scrollbar pb-0.5 lg:pb-0 lg:justify-center">
              {thumbSlides.map((s) => {
                const idx = slides.indexOf(s)
                return (
                  <button
                    key={s.image}
                    onClick={() => handleSelect(idx)}
                    aria-label={`Ver: ${s.title}`}
                    className="group relative flex-shrink-0 w-16 lg:w-[68px] aspect-4/5 rounded-xl overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="80px"
                    />
                    <div
                      className="absolute inset-0 transition-colors duration-200 group-hover:bg-black/20"
                      style={{ background: 'rgba(0,0,0,0.48)' }}
                      aria-hidden="true"
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ background: 'rgba(136,189,35,0.12)' }}
                      aria-hidden="true"
                    />
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
                      aria-hidden="true"
                    />
                  </button>
                )
              })}
            </div>

            {/* Main image — vertical 4:5 */}
            <div
              className="order-1 lg:order-2 relative w-full lg:flex-1 aspect-4/5 lg:max-h-[85vh] rounded-2xl overflow-hidden"
              style={{ transition: 'opacity 0.22s ease', opacity: visible ? 1 : 0 }}
            >
              <Image
                src={current.image}
                alt={current.title}
                fill
                className="object-cover"
                priority={active === 0}
                sizes="(max-width: 1024px) 100vw, 320px"
              />
              {/* Bottom vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)' }}
                aria-hidden="true"
              />
              {/* Watermark number */}
              <span
                className="absolute bottom-4 right-4 font-title text-white/15 leading-none select-none pointer-events-none"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 700 }}
                aria-hidden="true"
              >
                {current.number}
              </span>
            </div>
          </div>

          {/* ── Text content ───────────────────────────────────────────── */}
          <div
            className="flex-1 flex flex-col gap-5"
            style={{
              transition: 'opacity 0.22s ease, transform 0.22s ease',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(10px)',
            }}
          >
            {/* Tag chip */}
            <span className="inline-flex w-fit items-center gap-2 border border-accent/30 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" aria-hidden="true" />
              {current.tag}
            </span>

            {/* Heading */}
            <h2
              id="bioscan-heading"
              className="font-title text-4xl md:text-5xl xl:text-6xl uppercase text-white tracking-wide leading-tight"
            >
              {current.title}
            </h2>

            {/* Subtitle */}
            <p className="font-body text-sm font-semibold text-accent uppercase tracking-widest">
              {current.subtitle}
            </p>

            {/* Divider */}
            <div className="h-px bg-white/10" aria-hidden="true" />

            {/* Description */}
            <p className="font-body text-white/60 text-base leading-relaxed">
              {current.description}
            </p>

            {/* Progress dots + counter */}
            <div
              className="flex items-center gap-2 pt-1"
              role="tablist"
              aria-label="Navegar entre imagens"
            >
              {slides.map((s, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Slide ${i + 1}: ${s.title}`}
                  onClick={() => handleSelect(i)}
                  className="h-0.5 rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                  style={{
                    width: i === active ? '2rem' : '1rem',
                    background: i === active ? 'rgb(136,189,35)' : 'rgba(255,255,255,0.2)',
                  }}
                />
              ))}
              <span
                className="font-body text-white/25 text-xs tabular-nums ml-auto select-none"
                aria-hidden="true"
              >
                {current.number} / 04
              </span>
            </div>

            {/* CTA */}
            <div className="pt-1">
              <Link
                href="/contato"
                className="group inline-flex items-center gap-3 bg-accent hover:bg-accent/90 active:scale-95 text-black font-body font-bold text-sm uppercase tracking-wider px-7 py-4 rounded-full transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Solicitar Demonstração
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
