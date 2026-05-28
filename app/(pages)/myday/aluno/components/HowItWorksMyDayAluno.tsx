'use client'

import { useEffect, useRef, useState } from 'react'
import { ExternalLink, MessageCircle, TrendingUp, type LucideIcon } from 'lucide-react'

const WHATSAPP_MYDAY =
  'https://api.whatsapp.com/send/?phone=5541984810567&text=Ol%C3%A1%2C+vim+do+site+e+quero+come%C3%A7ar+a+usar+o+Fitmass+MyDay&type=phone_number&app_absent=0'

const STEPS: {
  number: string
  Icon: LucideIcon
  title: string
  description: string
  cta?: { label: string; href: string }
}[] = [
  {
    number: '01',
    Icon: ExternalLink,
    title: 'Clica no link e abre o WhatsApp',
    description:
      'Sem download. Sem cadastro demorado. Você clica no link, o WhatsApp já abre com a IA do MyDay pronta para falar com você.',
    cta: { label: 'Abrir no WhatsApp', href: WHATSAPP_MYDAY },
  },
  {
    number: '02',
    Icon: MessageCircle,
    title: 'Conta seu objetivo para a IA',
    description:
      'A IA faz algumas perguntas rápidas: objetivo, rotina, se sua academia tem Bioscan. Em minutos, ela já tem um plano personalizado para você.',
  },
  {
    number: '03',
    Icon: TrendingUp,
    title: 'Manda mensagem. Recebe orientação. Evolui.',
    description:
      'Registre o que comeu, o que treinou, peça seu progresso. A IA te responde, te lembra e acompanha cada dia, sem você precisar pensar nisso.',
  },
]

export default function HowItWorksMyDayAluno() {
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
  const [mobileVisible, setMobileVisible] = useState<boolean[]>([false, false, false])

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
      id="como-funciona-myday"
      className="py-20 px-4 bg-surface"
      aria-labelledby="como-funciona-myday-heading"
    >
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-[#FF6A00]/10 text-[#FF6A00] font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" aria-hidden="true" />
            Como Funciona
          </span>
          <h2
            id="como-funciona-myday-heading"
            className="font-title text-4xl md:text-5xl uppercase text-contrast tracking-wide leading-tight"
          >
            Mais simples do que parece.
          </h2>
        </div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line — fica atrás dos círculos */}
          <div
            className="absolute top-5 left-0 right-0 h-px pointer-events-none"
            style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}
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
                {/* Círculo com bg opaco para cobrir a linha */}
                <span className="relative z-10 font-body text-xs font-bold text-[#FF6A00] bg-surface border border-[#FF6A00]/40 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                  {step.number}
                </span>
                <step.Icon className="w-7 h-7 text-[#FF6A00]" aria-hidden="true" />
                <div>
                  <h3 className="font-body font-semibold text-contrast text-sm leading-snug mb-2">
                    {step.title}
                  </h3>
                  <p className="font-body text-contrast/55 text-xs leading-relaxed mb-3">
                    {step.description}
                  </p>
                  {step.cta && (
                    <a
                      href={step.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-body font-semibold text-xs uppercase tracking-widest text-[#FF6A00] border border-[#FF6A00]/40 px-3 py-1.5 rounded-lg hover:bg-[#FF6A00]/10 hover:border-[#FF6A00] transition-[background-color,border-color] duration-150"
                    >
                      {step.cta.label}
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  )}
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
              background: 'linear-gradient(to bottom, rgba(255,106,0,0.5) 0%, rgba(255,106,0,0.15) 70%, rgba(255,106,0,0.03) 100%)',
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
                {/* Círculo com bg opaco para cobrir a linha */}
                <span className="relative z-10 shrink-0 font-body text-xs font-bold text-[#FF6A00] bg-surface border border-[#FF6A00]/40 rounded-full w-10 h-10 flex items-center justify-center">
                  {step.number}
                </span>
                <div className="pt-1">
                  <step.Icon className="w-6 h-6 text-[#FF6A00] mb-2" aria-hidden="true" />
                  <h3 className="font-body font-semibold text-contrast text-sm leading-snug mb-1">
                    {step.title}
                  </h3>
                  <p className="font-body text-contrast/55 text-xs leading-relaxed mb-3">
                    {step.description}
                  </p>
                  {step.cta && (
                    <a
                      href={step.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-body font-semibold text-xs uppercase tracking-widest text-[#FF6A00] border border-[#FF6A00]/40 px-3 py-1.5 rounded-lg hover:bg-[#FF6A00]/10 hover:border-[#FF6A00] transition-[background-color,border-color] duration-150"
                    >
                      {step.cta.label}
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
