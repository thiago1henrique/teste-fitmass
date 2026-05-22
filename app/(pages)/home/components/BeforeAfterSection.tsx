'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ReactCompareSlider, ReactCompareSliderImage, useReactCompareSliderContext } from 'react-compare-slider'

const NEUTRAL = [51, 51, 51] as const
const GREEN   = [136, 189, 35] as const
const BLUE    = [37, 182, 235] as const
const MAX_TINT  = 0.18
const THRESHOLD = 88 // >= 88 → Fitmass; <= 12 → Custom

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t)
}

function SliderHandle({
  isAnimatingRef,
  userInteractedRef,
}: {
  isAnimatingRef: React.MutableRefObject<boolean>
  userInteractedRef: React.MutableRefObject<boolean>
}) {
  const { setPosition } = useReactCompareSliderContext()
  const [pulse, setPulse] = useState(true)
  const animFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    const DURATION = 3200
    const AMPLITUDE = 10

    const delay = setTimeout(() => {
      if (userInteractedRef.current) return
      isAnimatingRef.current = true

      const animate = (ts: number) => {
        if (userInteractedRef.current) {
          isAnimatingRef.current = false
          setPulse(false)
          return
        }
        if (!startTimeRef.current) startTimeRef.current = ts
        const p = Math.min((ts - startTimeRef.current) / DURATION, 1)

        let pos: number
        if      (p < 0.2) pos = 50 + AMPLITUDE * easeInOut(p / 0.2)
        else if (p < 0.4) pos = 50 + AMPLITUDE - 2 * AMPLITUDE * easeInOut((p - 0.2) / 0.2)
        else if (p < 0.6) pos = 50 - AMPLITUDE + 2 * AMPLITUDE * easeInOut((p - 0.4) / 0.2)
        else if (p < 0.8) pos = 50 + AMPLITUDE - 2 * AMPLITUDE * easeInOut((p - 0.6) / 0.2)
        else              pos = 50 - AMPLITUDE + AMPLITUDE * easeInOut((p - 0.8) / 0.2)

        setPosition(pos)

        if (p < 1) {
          animFrameRef.current = requestAnimationFrame(animate)
        } else {
          isAnimatingRef.current = false
          setPulse(false)
        }
      }
      animFrameRef.current = requestAnimationFrame(animate)
    }, 800)

    return () => {
      clearTimeout(delay)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      isAnimatingRef.current = false
    }
  }, [setPosition, isAnimatingRef, userInteractedRef])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', pointerEvents: 'none' }}>
      <div style={{ flexGrow: 1 }} />
      <div className="relative flex items-center justify-center" style={{ pointerEvents: 'auto' }}>
        {pulse && (
          <span
            className="absolute w-16 h-16 rounded-full bg-accent/40 animate-ping pointer-events-none"
            style={{ animationDuration: '1.2s' }}
          />
        )}
        <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-accent shadow-lg shadow-accent/40 ring-2 ring-white/20 cursor-grab active:cursor-grabbing">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
            <path d="M8.5 12l-4-4v3H2v2h2.5v3l4-4zM15.5 12l4 4v-3H22v-2h-2.5V8l-4 4z" />
          </svg>
        </div>
      </div>
      <div style={{ flexGrow: 1 }} />
    </div>
  )
}

// ── Panel content ────────────────────────────────────────────────────────────

const FITMASS_ITEMS = [
  { name: 'Bioscan',         desc: 'Balança de bioimpedância com análise completa em menos de 1 minuto.' },
  { name: 'App do Aluno',    desc: 'Histórico, metas e evolução sempre na palma da mão do aluno.' },
  { name: 'Fitmass System',  desc: 'Gestão de avaliações e relatórios para professor e academia.' },
  { name: 'Pocket',          desc: 'Avaliação pelo celular do personal, em qualquer lugar.' },
]

const CUSTOM_ITEMS = [
  { name: 'White Label',       desc: 'Logo e identidade visual da academia em cada relatório.' },
  { name: 'App com sua marca', desc: 'O aluno vê sua academia — não um aplicativo genérico.' },
  { name: 'Retenção real',     desc: 'Dados de evolução que mantêm o aluno engajado e motivado.' },
]

function FitmassPanel() {
  return (
    <div className="flex flex-col gap-5">
      <span className="inline-flex items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full self-start">
        <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
        Ecossistema Fitmass
      </span>
      <h3 className="font-title text-xl uppercase text-white tracking-wide leading-tight">
        Tecnologia que transforma{' '}
        <span className="text-accent">dados em resultados</span>
      </h3>
      <div className="flex flex-col gap-4">
        {FITMASS_ITEMS.map(item => (
          <div key={item.name}>
            <p className="font-body font-semibold text-accent text-sm mb-0.5">{item.name}</p>
            <p className="font-body text-white/55 text-xs leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function CustomPanel() {
  return (
    <div className="flex flex-col gap-5">
      <span className="inline-flex items-center gap-2 bg-secondary/15 text-secondary font-body font-semibold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full self-start">
        <span className="w-1.5 h-1.5 rounded-full bg-secondary" aria-hidden="true" />
        Personalização
      </span>
      <h3 className="font-title text-xl uppercase text-white tracking-wide leading-tight">
        Sua marca,{' '}
        <span className="text-secondary">sua identidade</span>
      </h3>
      <div className="flex flex-col gap-4">
        {CUSTOM_ITEMS.map(item => (
          <div key={item.name}>
            <p className="font-body font-semibold text-secondary text-sm mb-0.5">{item.name}</p>
            <p className="font-body text-white/55 text-xs leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export default function BeforeAfterSection() {
  const [mounted, setMounted] = useState(false)
  const [position, setPositionState] = useState(50)
  const isAnimatingRef = useRef<boolean>(false)
  const userInteractedRef = useRef<boolean>(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  const handlePositionChange = useCallback((pos: number) => {
    setPositionState(pos)
    if (!isAnimatingRef.current && !userInteractedRef.current) {
      userInteractedRef.current = true
    }
  }, [])

  const bgColor = (() => {
    if (position >= 50) {
      const t = ((position - 50) / 50) * MAX_TINT
      return `rgb(${lerp(NEUTRAL[0], GREEN[0], t)}, ${lerp(NEUTRAL[1], GREEN[1], t)}, ${lerp(NEUTRAL[2], GREEN[2], t)})`
    }
    const t = ((50 - position) / 50) * MAX_TINT
    return `rgb(${lerp(NEUTRAL[0], BLUE[0], t)}, ${lerp(NEUTRAL[1], BLUE[1], t)}, ${lerp(NEUTRAL[2], BLUE[2], t)})`
  })()

  const showFitmass = position >= THRESHOLD
  const showCustom  = position <= (100 - THRESHOLD)

  return (
    <section
      className="py-20 px-4"
      style={{ backgroundColor: bgColor, transition: 'background-color 150ms ease' }}
      aria-labelledby="comparativo-heading"
    >
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            Comparativo
          </span>
          <h2
            id="comparativo-heading"
            className="font-title text-4xl md:text-5xl uppercase text-white tracking-wide leading-tight"
          >
            VEJA A DIFERENÇA{' '}
            <span className="text-accent">NA PRÁTICA</span>
          </h2>
          <p className="font-body text-white/60 mt-4 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Arraste o divisor e compare — relatórios Fitmass com precisão clínica versus o padrão do mercado.
          </p>
        </div>
      </div>

      {/* Slider + two side panels */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* LEFT panel: Customização — aparece quando slider vai à esquerda */}
          <div
            className="hidden lg:block shrink-0 overflow-hidden"
            style={{
              width: showCustom ? '260px' : '0px',
              transition: 'width 450ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div style={{ width: '260px', minHeight: '320px', position: 'relative' }}>
              <div
                style={{
                  opacity: showCustom ? 1 : 0,
                  transform: showCustom ? 'translateX(0)' : 'translateX(-20px)',
                  transition: 'opacity 350ms 80ms ease, transform 350ms 80ms ease',
                  pointerEvents: showCustom ? 'auto' : 'none',
                }}
              >
                <CustomPanel />
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 flex-1 min-w-0">
            {mounted ? (
              <ReactCompareSlider
                handle={
                  <SliderHandle
                    isAnimatingRef={isAnimatingRef}
                    userInteractedRef={userInteractedRef}
                  />
                }
                onPositionChange={handlePositionChange}
                itemOne={
                  <ReactCompareSliderImage
                    src="/pages/landingpage/sliderSection/Fitmass.png"
                    alt="Relatório de avaliação física Fitmass"
                  />
                }
                itemTwo={
                  <ReactCompareSliderImage
                    src="/pages/landingpage/sliderSection/Bluefit.png"
                    alt="Relatório de avaliação física padrão de mercado"
                  />
                }
                style={{ width: '100%' }}
              />
            ) : (
              <div className="w-full aspect-video bg-white/5" aria-hidden="true" />
            )}
            <div
              className="absolute top-4 left-4 bg-accent/90 backdrop-blur-sm text-white font-body font-semibold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full pointer-events-none select-none"
              aria-hidden="true"
            >
              Fitmass
            </div>
            <div
              className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white/80 font-body font-semibold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full pointer-events-none select-none"
              aria-hidden="true"
            >
              Bluefit
            </div>
          </div>

          {/* RIGHT panel: Ecossistema Fitmass — aparece quando slider vai à direita */}
          <div
            className="hidden lg:block shrink-0 overflow-hidden"
            style={{
              width: showFitmass ? '260px' : '0px',
              transition: 'width 450ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div style={{ width: '260px', minHeight: '320px', position: 'relative' }}>
              <div
                style={{
                  opacity: showFitmass ? 1 : 0,
                  transform: showFitmass ? 'translateX(0)' : 'translateX(20px)',
                  transition: 'opacity 350ms 80ms ease, transform 350ms 80ms ease',
                  pointerEvents: showFitmass ? 'auto' : 'none',
                }}
              >
                <FitmassPanel />
              </div>
            </div>
          </div>

        </div>

        {/* Mobile: painéis abaixo do slider */}
        <div className="lg:hidden mt-6 flex flex-col">
          {/* Painel Customização — desliza da esquerda */}
          <div
            style={{
              maxHeight: showCustom ? '500px' : '0px',
              overflow: 'hidden',
              transition: 'max-height 450ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div
              style={{
                opacity: showCustom ? 1 : 0,
                transform: showCustom ? 'translateX(0)' : 'translateX(-24px)',
                transition: 'opacity 350ms 80ms ease, transform 350ms 80ms ease',
                paddingBottom: '16px',
                pointerEvents: showCustom ? 'auto' : 'none',
              }}
            >
              <div className="p-5 rounded-xl bg-white/5 ring-1 ring-white/10">
                <CustomPanel />
              </div>
            </div>
          </div>

          {/* Painel Fitmass — desliza da direita */}
          <div
            style={{
              maxHeight: showFitmass ? '500px' : '0px',
              overflow: 'hidden',
              transition: 'max-height 450ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div
              style={{
                opacity: showFitmass ? 1 : 0,
                transform: showFitmass ? 'translateX(0)' : 'translateX(24px)',
                transition: 'opacity 350ms 80ms ease, transform 350ms 80ms ease',
                paddingBottom: '16px',
                pointerEvents: showFitmass ? 'auto' : 'none',
              }}
            >
              <div className="p-5 rounded-xl bg-white/5 ring-1 ring-white/10">
                <FitmassPanel />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
