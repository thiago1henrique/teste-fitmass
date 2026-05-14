'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'

type ImageItem = { src: string; alt: string }
type Coords = { top: number; left: number; arrowLeft: string }

const BG = '#111827'
const TOOLTIP_REM = 26  // 26rem = 416px

export function ImageTooltip({ images, ariaLabel }: { images: ImageItem[]; ariaLabel: string }) {
  const [open, setOpen] = useState(false)
  const [zoomed, setZoomed] = useState<ImageItem | null>(null)
  const [coords, setCoords] = useState<Coords>({ top: 0, left: 0, arrowLeft: '50%' })
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const updateCoords = useCallback(() => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize)
    const tooltipW = Math.min(TOOLTIP_REM * remPx, window.innerWidth - 16)
    const halfW = tooltipW / 2
    const GAP = 8

    const idealLeft = rect.left + rect.width / 2
    const clampedLeft = Math.max(halfW + GAP, Math.min(idealLeft, window.innerWidth - halfW - GAP))

    // Arrow must point at the button center even when tooltip is clamped
    const arrowPct = Math.max(10, Math.min(90,
      ((idealLeft - clampedLeft + halfW) / tooltipW) * 100
    ))

    setCoords({ top: rect.top, left: clampedLeft, arrowLeft: `${arrowPct}%` })
  }, [])

  function handleToggle() {
    if (!open) updateCoords()
    setOpen(o => !o)
    setZoomed(null)
  }

  useEffect(() => {
    if (!open) return
    function onOutsideClick(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
        setZoomed(null)
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') { setOpen(false); setZoomed(null) }
    }
    window.addEventListener('scroll', updateCoords, { passive: true })
    document.addEventListener('mousedown', onOutsideClick)
    document.addEventListener('keydown', onEscape)
    return () => {
      window.removeEventListener('scroll', updateCoords)
      document.removeEventListener('mousedown', onOutsideClick)
      document.removeEventListener('keydown', onEscape)
    }
  }, [open, updateCoords])

  const firstRow = images.length <= 2 ? images : images.slice(0, 3)
  const secondRow = images.length <= 2 ? [] : images.slice(3)
  const firstCols = firstRow.length === 2 ? 'grid-cols-2' : 'grid-cols-3'

  const panel = open ? (
    <div
      ref={panelRef}
      role="dialog"
      aria-label={ariaLabel}
      style={{
        position: 'fixed',
        top: coords.top,
        left: coords.left,
        transform: 'translate(-50%, calc(-100% - 12px))',
        zIndex: 9999,
        width: `min(${TOOLTIP_REM}rem, calc(100vw - 16px))`,
        backgroundColor: BG,
      }}
      className="rounded-xl shadow-2xl border border-white/15 overflow-hidden"
    >
      {/* arrow pointing to button */}
      <div
        className="absolute top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent"
        style={{ left: coords.arrowLeft, borderTopColor: BG, transform: 'translateX(-50%)' }}
      />

      {zoomed ? (
        <div className="p-5">
          <button
            onClick={() => setZoomed(null)}
            className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-body mb-3 transition-colors"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 12L6 8l4-4" />
            </svg>
            Voltar
          </button>
          <div className="relative w-full h-72">
            <Image src={zoomed.src} alt={zoomed.alt} fill className="object-contain" sizes="416px" />
          </div>
        </div>
      ) : (
        <div className="p-5">
          <p className="text-white/60 text-xs font-body text-center mb-3 tracking-wide">
            Clique para ampliar
          </p>
          <div className={`grid ${firstCols} gap-3 ${secondRow.length > 0 ? 'mb-3' : ''}`}>
            {firstRow.map((img) => (
              <button
                key={img.src}
                onClick={() => setZoomed(img)}
                className="rounded-lg p-2 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div className="relative w-full h-32">
                  <Image src={img.src} alt={img.alt} fill className="object-contain" sizes="112px" />
                </div>
              </button>
            ))}
          </div>
          {secondRow.length > 0 && (
            <div className="grid grid-cols-2 gap-3 px-10">
              {secondRow.map((img) => (
                <button
                  key={img.src}
                  onClick={() => setZoomed(img)}
                  className="rounded-lg p-2 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <div className="relative w-full h-32">
                    <Image src={img.src} alt={img.alt} fill className="object-contain" sizes="112px" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  ) : null

  return (
    <span className="relative inline-flex items-center ml-1.5 align-middle">
      <button
        ref={btnRef}
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={handleToggle}
        className="w-4 h-4 rounded-full bg-accent/20 text-accent hover:bg-accent/30 flex items-center justify-center transition-colors duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-2.5 h-2.5" aria-hidden="true">
          <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm.75 12h-1.5V7h1.5v5zm0-6.5h-1.5v-1.5h1.5v1.5z" />
        </svg>
      </button>
      {typeof window !== 'undefined' && createPortal(panel, document.body)}
    </span>
  )
}
