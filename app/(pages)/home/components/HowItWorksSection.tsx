'use client'

import { useEffect, useRef, useState } from 'react'
import { Scale, Database, Smartphone, TrendingUp, type LucideIcon } from 'lucide-react'

const STEPS: { number: string; Icon: LucideIcon; title: string; description: string }[] = [
  {
    number: '01',
    Icon: Scale,
    title: 'Avaliação no Bioscan',
    description:
      'O aluno sobe na balança de bioimpedância Bioscan. Em menos de 1 minuto, o equipamento realiza a análise completa.',
  },
  {
    number: '02',
    Icon: Database,
    title: 'Dados processados em tempo real',
    description:
      'Os dados são automaticamente processados e armazenados no Fitmass System, acessível para o professor e para a gestão da academia.',
  },
  {
    number: '03',
    Icon: Smartphone,
    title: 'Resultado no app do aluno',
    description:
      'O aluno recebe os resultados no Fitmass App: histórico, metas e evolução na palma da mão.',
  },
  {
    number: '04',
    Icon: TrendingUp,
    title: 'Aluno retido. Academia crescendo.',
    description:
      'Com dados concretos de evolução, o aluno se engaja e permanece na academia. Você retém mais, e vende mais.',
  },
]

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null)

  // Desktop: staggered reveal
  const [visibleCount, setVisibleCount] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        obs.disconnect()
        setVisibleCount(1)
        timerRef.current = setInterval(() => {
          setVisibleCount(prev => {
            if (prev >= STEPS.length) {
              clearInterval(timerRef.current!)
              return prev
            }
            return prev + 1
          })
        }, 150)
      },
      { threshold: 0.3 }
    )
    obs.observe(el)

    return () => {
      obs.disconnect()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // Mobile: per-item scroll reveal
  const mobileItemRefs = useRef<(HTMLDivElement | null)[]>([])
  const [mobileVisible, setMobileVisible] = useState<boolean[]>([false, false, false, false])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    mobileItemRefs.current.forEach((item, i) => {
      if (!item) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          obs.disconnect()
          setMobileVisible(prev => {
            const next = [...prev]
            next[i] = true
            return next
          })
        },
        { threshold: 0.12 }
      )
      obs.observe(item)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  return (
    <section
      ref={sectionRef}
      id="como-funciona"
      className="py-20 px-4 bg-[#0a0a0a]"
      aria-labelledby="como-funciona-heading"
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            Como Funciona
          </span>
          <h2
            id="como-funciona-heading"
            className="font-title text-4xl md:text-5xl uppercase text-white tracking-wide leading-tight"
          >
            Da bioimpedância ao resultado:{' '}
            <span className="text-accent">entenda o fluxo</span>
          </h2>
          <p className="font-body text-white/60 mt-4 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Em 4 passos, sua academia oferece avaliação física de ponta e seus alunos acompanham cada resultado.
          </p>
        </div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden md:grid md:grid-cols-4 gap-6 relative">
          {/* Connecting line at circle level */}
          <div
            className="absolute top-5 left-0 right-0 h-px"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
            aria-hidden="true"
          />
          {STEPS.map((step, i) => {
            const isVisible = i < visibleCount
            return (
              <div
                key={step.number}
                className="flex flex-col gap-4"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
                  transition: 'opacity 600ms ease, transform 600ms ease',
                }}
              >
                <span className="font-body text-xs font-bold text-accent bg-accent/10 border border-accent/30 rounded-full w-10 h-10 flex items-center justify-center shrink-0 z-10">
                  {step.number}
                </span>
                <step.Icon className="w-7 h-7 text-accent" aria-hidden="true" />
                <div>
                  <h3 className="font-body font-semibold text-white text-sm leading-snug mb-2">
                    {step.title}
                  </h3>
                  <p className="font-body text-white/50 text-xs leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile: vertical timeline */}
        <div className="md:hidden relative">
          {/* Vertical connecting line */}
          <div
            className="absolute top-0 bottom-0 w-px pointer-events-none"
            style={{
              left: '19px',
              background: 'linear-gradient(to bottom, rgba(136,189,35,0.5) 0%, rgba(136,189,35,0.15) 70%, rgba(136,189,35,0.03) 100%)',
            }}
            aria-hidden="true"
          />
          <div className="flex flex-col gap-10">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                ref={el => { mobileItemRefs.current[i] = el }}
                className="relative flex items-start gap-5"
                style={{
                  opacity: mobileVisible[i] ? 1 : 0,
                  transform: mobileVisible[i] ? 'translateX(0)' : 'translateX(-16px)',
                  transition: 'opacity 600ms ease, transform 600ms ease',
                }}
              >
                {/* Number circle */}
                <span className="relative z-10 shrink-0 font-body text-xs font-bold text-accent bg-accent/10 border border-accent/30 rounded-full w-10 h-10 flex items-center justify-center">
                  {step.number}
                </span>
                {/* Content */}
                <div className="pt-1">
                  <step.Icon className="w-6 h-6 text-accent mb-2" aria-hidden="true" />
                  <h3 className="font-body font-semibold text-white text-sm leading-snug mb-1">
                    {step.title}
                  </h3>
                  <p className="font-body text-white/50 text-xs leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
