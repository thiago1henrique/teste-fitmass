'use client'

import { useEffect, useRef, useState } from 'react'

const WITHOUT = [
  'Déficit calórico calculado no chute, baseado em fórmulas genéricas',
  'Treina meses sem saber se está no caminho certo',
  'Esquece de registrar o que comeu, perde o controle',
  'Faz nova avaliação na balança e não sabe o que fazer com os dados',
  'Precisa baixar app, criar conta, aprender a usar uma nova ferramenta',
]

const WITH = [
  'Déficit calculado com sua composição corporal e rotina real',
  'Relatório semanal automático mostra se você está evoluindo',
  'IA manda lembrete diário e registra com uma mensagem no WhatsApp',
  <>A IA recebe os dados da medição e <em>recalibra</em> seu plano automaticamente</>,
  'Funciona no WhatsApp que você já usa, sem baixar nada',
]

export default function ComparisonMyDayAluno() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        obs.disconnect()
        setVisible(true)
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="comparativo-myday-aluno"
      className="py-20 px-4 bg-white"
      aria-labelledby="comparativo-myday-aluno-heading"
    >
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div
          className="text-center mb-12"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 600ms ease, transform 600ms ease',
          }}
        >
          <span className="inline-flex items-center gap-2 bg-[#FF6A00]/10 text-[#FF6A00] font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" aria-hidden="true" />
            Comparativo
          </span>
          <h2
            id="comparativo-myday-aluno-heading"
            className="font-title text-4xl md:text-5xl uppercase text-contrast tracking-wide leading-tight mb-4"
          >
            O que muda quando você para de adivinhar
          </h2>
          <p className="font-body text-contrast/60 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Veja lado a lado o que muda quando você usa dados reais para tomar decisões sobre seu corpo.
          </p>
        </div>

        {/* Comparison table */}
        <div
          className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 700ms 150ms ease, transform 700ms 150ms ease',
          }}
        >
          {/* Column headers */}
          <div className="grid grid-cols-2">
            <div className="bg-red-50 border-b border-r border-gray-200 px-5 py-4 flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0" aria-hidden="true">
                <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
              <span className="font-body font-bold text-red-600 text-sm uppercase tracking-wide">Sem MyDay</span>
            </div>
            <div className="bg-[#FF6A00]/5 border-b border-gray-200 px-5 py-4 flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#FF6A00]/15 flex items-center justify-center shrink-0" aria-hidden="true">
                <svg className="w-3.5 h-3.5 text-[#FF6A00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="font-body font-bold text-[#FF6A00] text-sm uppercase tracking-wide">Com Fitmass MyDay</span>
            </div>
          </div>

          {/* Rows */}
          {WITHOUT.map((withoutItem, i) => (
            <div
              key={i}
              className={`grid grid-cols-2 ${i < WITHOUT.length - 1 ? 'border-b border-gray-200' : ''}`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(12px)',
                transition: `opacity 500ms ${200 + i * 80}ms ease, transform 500ms ${200 + i * 80}ms ease`,
              }}
            >
              {/* Without */}
              <div className="px-5 py-4 border-r border-gray-200 bg-white">
                <p className="font-body text-contrast/55 text-sm leading-relaxed">{withoutItem}</p>
              </div>

              {/* With */}
              <div className="px-5 py-4 bg-[#FF6A00]/[0.02]">
                <p className="font-body text-contrast text-sm leading-relaxed">{WITH[i]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
