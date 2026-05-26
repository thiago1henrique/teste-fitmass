'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

// Sticky active for scrolled 0 → 1×vh — all VH_* must be ≤ 1.0
const VH_IN_START  = 0.09
const VH_IN_END    = 0.42
const VH_OUT_START = 0.70
const VH_OUT_END   = 0.92

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v))
}

export default function BioscanOutro() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled]     = useState(0)
  const [vh, setVh]                 = useState(900)
  const [fillStarted, setFillStarted] = useState(false)

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return
      setScrolled(Math.max(0, -containerRef.current.getBoundingClientRect().top))
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  const fadeIn  = clamp01((scrolled - vh * VH_IN_START)  / (vh * (VH_IN_END  - VH_IN_START)))
  const fadeOut = 1 - clamp01((scrolled - vh * VH_OUT_START) / (vh * (VH_OUT_END - VH_OUT_START)))
  const opacity    = fadeIn * fadeOut
  const translateY = (1 - fadeIn) * 28

  // Trigger water-fill once text is clearly visible — plays once and stays
  useEffect(() => {
    if (fadeIn <= 0.35 || fillStarted) return
    const raf = requestAnimationFrame(() => setFillStarted(true))
    return () => cancelAnimationFrame(raf)
  }, [fadeIn, fillStarted])

  return (
    <div ref={containerRef} style={{ height: '200vh' }} className="bg-black">
      <div className="sticky top-0 h-screen bg-black overflow-hidden flex flex-col items-center justify-center gap-10 px-6">

        {/* Hero effects — same opacity as content */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity }}
          aria-hidden="true"
        >
          <div className="absolute -top-40 -right-40 w-175 h-175 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-125 h-125 rounded-full bg-secondary/10 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(136,189,35,1) 1px, transparent 1px), linear-gradient(90deg, rgba(136,189,35,1) 1px, transparent 1px)',
              backgroundSize: '72px 72px',
            }}
          />
          <div className="absolute top-0 right-32 w-px h-full bg-linear-to-b from-transparent via-accent/20 to-transparent" />
          <div className="absolute top-0 left-32 w-px h-full bg-linear-to-b from-transparent via-secondary/15 to-transparent" />
        </div>

        {/* Permanent edge vignettes */}
        <div
          className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to bottom, #000000, transparent)' }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to top, #000000, transparent)' }}
          aria-hidden="true"
        />

        {/* Headline */}
        <div
          className="text-center relative z-20"
          style={{ opacity, transform: `translateY(${translateY}px)` }}
        >
          <p
            className="font-title uppercase text-white leading-tight max-w-3xl mx-auto"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 4.25rem)', letterSpacing: '0.06em' }}
          >
            A tecnologia que vai transformar{' '}
            {/* Water-fill effect on "sua academia" */}
            <span className="relative inline-block whitespace-nowrap">
              {/* Base layer — white */}
              <span>sua academia</span>
              {/* Accent layer — fills like water from bottom to top */}
              <span
                aria-hidden="true"
                className="absolute inset-0 text-accent"
                style={
                  fillStarted
                    ? { animation: 'water-fill 2s cubic-bezier(0.33, 0, 0.66, 1) forwards' }
                    : { clipPath: 'polygon(0% 110%, 100% 110%, 100% 110%, 0% 110%)' }
                }
              >
                sua academia
              </span>
            </span>
          </p>
        </div>

        {/* CTA */}
        <div
          className="relative z-20"
          style={{
            opacity,
            transform: `translateY(${translateY * 0.55}px)`,
            pointerEvents: opacity > 0.25 ? 'auto' : 'none',
          }}
        >
          <Link
            href="https://api.whatsapp.com/send/?phone=5541984810567&text=Ol%C3%A1%2C+vim+do+site+e+gostaria+de+mais+informa%C3%A7%C3%B5es+sobre+o+Fitmass&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 bg-accent hover:bg-accent/90 active:scale-95 text-black font-body font-bold text-xs sm:text-sm uppercase tracking-wide sm:tracking-wider px-5 sm:px-8 py-4 rounded-full transition-all duration-200 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Entrar em contato agora
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
  )
}
