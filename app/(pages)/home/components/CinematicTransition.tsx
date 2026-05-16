'use client'

import { useState, useEffect, useRef } from 'react'

// Milestones as multiples of viewport height so timing scales on every screen.
// Section is 2×vh tall; exit point = 2.0.
const VH_GRADIENT_FULL   = 0.78
const VH_TITLE_IN_START  = 0.09
const VH_TITLE_IN_END    = 0.36
const VH_BANDS_IN_START  = 0.31
const VH_BANDS_IN_END    = 0.65
const VH_TITLE_OUT_START = 1.25
const VH_TITLE_OUT_END   = 1.88   // fades out just before section exits

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v))
}

function progress(scrolled: number, from: number, to: number) {
  return clamp01((scrolled - from) / (to - from))
}

export default function CinematicTransition() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(0)
  const [vh, setVh]             = useState(900)

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

  // Derived thresholds — all in absolute px, scaled to the current viewport
  const gradientFull  = vh * VH_GRADIENT_FULL
  const titleInStart  = vh * VH_TITLE_IN_START
  const titleInEnd    = vh * VH_TITLE_IN_END
  const bandsInStart  = vh * VH_BANDS_IN_START
  const bandsInEnd    = vh * VH_BANDS_IN_END
  const titleOutStart = vh * VH_TITLE_OUT_START
  const titleOutEnd   = vh * VH_TITLE_OUT_END

  // Background: #f8f8f8 (248,248,248) → #000 (0,0,0)
  const bgV     = Math.round(248 * (1 - clamp01(scrolled / gradientFull)))
  const bgColor = `rgb(${bgV},${bgV},${bgV})`

  // "Apresentamos" — fade in then fade out
  const titleIn      = progress(scrolled, titleInStart, titleInEnd)
  const titleOut     = 1 - progress(scrolled, titleOutStart, titleOutEnd)
  const titleOpacity = titleIn * titleOut
  const titleY       = (1 - titleIn) * 20

  // Reveal bands — grow proportionally, fade with title
  const bandsIn      = progress(scrolled, bandsInStart, bandsInEnd)
  const bandsOpacity = titleOut

  return (
    // aria-hidden: purely decorative cinematic transition, not navigable content
    <div ref={containerRef} style={{ height: '200vh' }} aria-hidden="true">
      <div
        className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center gap-5"
        style={{ backgroundColor: bgColor }}
      >
        {/* "Apresentamos" */}
        <div
          className="px-6 text-center select-none pointer-events-none"
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <p
            className="font-title uppercase text-white leading-none"
            style={{ fontSize: 'clamp(1.1rem, 3vw, 2.25rem)', letterSpacing: '0.38em' }}
          >
            Apresentamos
          </p>
        </div>

        {/* Horizontal reveal bands — primary enters from left, secondary from right */}
        <div
          className="w-full flex flex-col gap-1 select-none pointer-events-none"
          style={{ opacity: bandsOpacity }}
        >
          <div
            className="h-4 w-full bg-accent origin-left"
            style={{ transform: `scaleX(${bandsIn})` }}
          />
          <div
            className="h-4 w-full bg-secondary origin-right"
            style={{ transform: `scaleX(${bandsIn})` }}
          />
        </div>
      </div>
    </div>
  )
}
