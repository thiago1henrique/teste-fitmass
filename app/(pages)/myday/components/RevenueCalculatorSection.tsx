'use client'

import { useState, useRef, useEffect } from 'react'

const PREMIUM_PRICE = 9.9
const ULTRA_PRICE = 20
const PRESETS = [10, 50, 100, 200, 500]

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function getClosestPreset(n: number) {
  return PRESETS.reduce((prev, curr) =>
    Math.abs(curr - n) < Math.abs(prev - n) ? curr : prev
  )
}

interface SliderProps {
  id: string
  students: number
  sliderPct: number
  onChange: (n: number) => void
}

function SliderInput({ id, students, sliderPct, onChange }: SliderProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <label htmlFor={id} className="font-body font-semibold text-contrast text-sm">
          Número de alunos
        </label>
        <span className="font-title text-2xl text-[#FF6A00]">
          {students} aluno{students !== 1 ? 's' : ''}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={1}
        max={500}
        step={1}
        value={students}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          accentColor: 'var(--color-myday)',
          background: `linear-gradient(to right, var(--color-myday) 0%, var(--color-myday) ${sliderPct}%, #e5e7eb ${sliderPct}%, #e5e7eb 100%)`,
        }}
        aria-label="Número de alunos aderindo ao serviço"
        aria-valuemin={1}
        aria-valuemax={500}
        aria-valuenow={students}
      />
      <div className="flex justify-between mt-2">
        {[1, 100, 200, 300, 400, 500].map((n) => (
          <span key={n} className="font-body text-xs text-contrast/35">{n}</span>
        ))}
      </div>
    </>
  )
}

export default function RevenueCalculatorSection() {
  const [students, setStudents] = useState(100)
  const [fixedVisible, setFixedVisible] = useState(false)

  const sliderRef  = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(min-width: 1024px)').matches) return

    const HEADER_H = 64

    const update = () => {
      const slider  = sliderRef.current
      const section = sectionRef.current
      if (!slider || !section) return
      const sliderBottom  = slider.getBoundingClientRect().bottom
      const sectionBottom = section.getBoundingClientRect().bottom
      setFixedVisible(sliderBottom < HEADER_H && sectionBottom > HEADER_H)
    }

    window.addEventListener('scroll', update, { passive: true })
    document.addEventListener('scroll', update, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', update)
      document.removeEventListener('scroll', update)
    }
  }, [])

  const sliderPct = ((students - 1) / (500 - 1)) * 100
  const premiumRevenue = students * PREMIUM_PRICE
  const ultraRevenue = students * ULTRA_PRICE
  const monthlyDiff = ultraRevenue - premiumRevenue
  const yearlyDiff = monthlyDiff * 12
  const closestPreset = getClosestPreset(students)

  /* ── JSX partials (evita duplicação entre mobile e desktop) ─────────── */
  const calcCards = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div className="min-w-0 bg-white border border-gray-200 rounded-2xl p-6" role="region" aria-label="Plano Premium">
        <p className="font-body font-bold text-contrast uppercase tracking-wider text-xs mb-1">Plano Premium</p>
        <p className="font-body text-contrast/45 text-xs mb-5">R$9,90/aluno/mês</p>
        <p className="font-title text-3xl text-[#FF6A00] leading-none" aria-live="polite">
          {formatBRL(premiumRevenue)}
        </p>
        <p className="font-body text-contrast/45 text-xs mt-2">/mês com {students} aluno{students !== 1 ? 's' : ''}</p>
      </div>
      <div className="min-w-0 bg-[#FF6A00]/5 border-2 border-[#FF6A00] rounded-2xl p-6 relative" role="region" aria-label="Plano Ultra">
        <span className="absolute top-3 right-3 bg-[#FF6A00] text-white font-body font-bold text-xs uppercase px-2 py-0.5 rounded-full">Ultra</span>
        <p className="font-body font-bold text-contrast uppercase tracking-wider text-xs mb-1">Plano Ultra</p>
        <p className="font-body text-contrast/45 text-xs mb-5">R$20/aluno/mês</p>
        <p className="font-title text-3xl text-[#FF6A00] leading-none" aria-live="polite">
          {formatBRL(ultraRevenue)}
        </p>
        <p className="font-body text-contrast/45 text-xs mt-2">/mês com {students} aluno{students !== 1 ? 's' : ''}</p>
      </div>
    </div>
  )

  const calcCallout = (
    <div className="bg-[#FF6A00]/10 border border-[#FF6A00]/20 rounded-2xl px-6 py-4 text-center">
      <p className="font-body text-contrast/80 text-sm leading-relaxed">
        Com o <span className="font-bold text-[#FF6A00]">Ultra</span> você fatura{' '}
        <span className="font-title text-lg text-[#FF6A00]" aria-live="polite">{formatBRL(monthlyDiff)}/mês</span>{' '}
        a mais — <span className="font-bold text-contrast" aria-live="polite">{formatBRL(yearlyDiff)}/ano</span>
      </p>
    </div>
  )

  const refTables = (
    <>
      <p className="font-body text-contrast/45 text-xs uppercase tracking-widest mb-6">
        Valores de referência — clique para selecionar
      </p>
      <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <div className="bg-contrast px-4 py-3">
          <p className="font-body font-bold text-white text-sm uppercase tracking-wide">Plano Premium</p>
          <p className="font-body text-white/45 text-xs">R$9,90/aluno/mês</p>
        </div>
        <table className="w-full" role="table" aria-label="Tabela Plano Premium">
          <tbody>
            {PRESETS.map((n, i) => {
              const active = n === closestPreset
              return (
                <tr key={n} onClick={() => setStudents(n)} className={`cursor-pointer transition-colors duration-150 ${active ? 'bg-[#FF6A00]/10' : i % 2 === 0 ? 'bg-white hover:bg-[#FF6A00]/5' : 'bg-gray-50 hover:bg-[#FF6A00]/5'}`}>
                  <td className={`px-4 py-2.5 font-body text-sm text-contrast/65 ${active ? 'border-l-2 border-[#FF6A00] font-semibold text-contrast' : ''}`}>{n} alunos</td>
                  <td className={`px-4 py-2.5 font-body text-sm text-right ${active ? 'text-[#FF6A00] font-bold' : 'text-contrast font-medium'}`}>{formatBRL(n * PREMIUM_PRICE)}/mês</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <div className="bg-contrast px-4 py-3 flex items-center justify-between">
          <div>
            <p className="font-body font-bold text-white text-sm uppercase tracking-wide">Plano Ultra</p>
            <p className="font-body text-white/45 text-xs">R$20/aluno/mês</p>
          </div>
          <span className="bg-[#FF6A00] text-white font-body font-bold text-xs uppercase tracking-wide px-2.5 py-1 rounded-full">Mais lucrativo</span>
        </div>
        <table className="w-full" role="table" aria-label="Tabela Plano Ultra">
          <tbody>
            {PRESETS.map((n, i) => {
              const active = n === closestPreset
              return (
                <tr key={n} onClick={() => setStudents(n)} className={`cursor-pointer transition-colors duration-150 ${active ? 'bg-[#FF6A00]/10' : i % 2 === 0 ? 'bg-white hover:bg-[#FF6A00]/5' : 'bg-gray-50 hover:bg-[#FF6A00]/5'}`}>
                  <td className={`px-4 py-2.5 font-body text-sm text-contrast/65 ${active ? 'border-l-2 border-[#FF6A00] font-semibold text-contrast' : ''}`}>{n} alunos</td>
                  <td className={`px-4 py-2.5 font-body text-sm text-right ${active ? 'text-[#FF6A00] font-bold' : 'text-contrast font-medium'}`}>{formatBRL(n * ULTRA_PRICE)}/mês</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )

  return (
    <section
      ref={sectionRef}
      id="potencial-receita-myday"
      className="bg-surface"
      aria-labelledby="potencial-receita-heading"
    >
      {/* Cabeçalho */}
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
        <span className="inline-flex items-center gap-2 bg-[#FF6A00]/15 text-[#FF6A00] font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" aria-hidden="true" />
          Potencial de Receita
        </span>
        <h2
          id="potencial-receita-heading"
          className="font-title text-4xl md:text-5xl uppercase text-contrast tracking-wide mb-3"
        >
          Quanto sua academia pode faturar com o{' '}
          <span className="text-[#FF6A00]">MyDay?</span>
        </h2>
        <p className="text-contrast/60 font-body">
          Veja o potencial de receita mensal com base no número de alunos que aderirem ao serviço.
        </p>
      </div>

      {/* ── MOBILE ─────────────────────────────────────────────────────────
          overflow-x:hidden em html/body quebra CSS sticky no Safari/iOS.
          Solução: slider original no fluxo normal + cópia fixed que aparece
          via JS quando o original sai da tela e a section ainda é visível. ── */}
      <div className="lg:hidden">

        {/* Slider original — mantém o espaço no layout */}
        <div ref={sliderRef} className="border-y border-gray-200 px-6 py-5 bg-surface">
          <SliderInput id="students-slider-mobile" students={students} sliderPct={sliderPct} onChange={setStudents} />
        </div>

        {/* Slider fixed — desliza de cima com fade ao entrar, some com fade ao sair */}
        <div
          className={`fixed top-16 left-0 right-0 z-30 bg-surface border-b border-gray-200 px-6 py-5 shadow-md ${!fixedVisible && 'pointer-events-none'}`}
          style={{
            opacity: fixedVisible ? 1 : 0,
            transform: fixedVisible ? 'translateY(0)' : 'translateY(-8px)',
            transition: 'opacity 220ms ease-out, transform 220ms ease-out',
          }}
        >
          <SliderInput id="students-slider-mobile-fixed" students={students} sliderPct={sliderPct} onChange={setStudents} />
        </div>

        {/* Resultados — scrollam abaixo do slider */}
        <div className="px-6 pt-6 pb-2">
          {calcCards}
          {calcCallout}
        </div>

        {/* Tabelas de referência */}
        <div className="px-6 py-8">
          {refTables}
        </div>
      </div>

      {/* ── DESKTOP ───────────────────────────────────────────────────────
          Grid 2 colunas — tabelas à esquerda, calculadora sticky à direita. ── */}
      <div className="hidden lg:grid lg:grid-cols-2 border-t border-gray-200">

        {/* Esquerda: tabelas */}
        <div className="min-w-0 px-6 lg:pl-10 xl:pl-20 lg:pr-12 py-12 border-r border-gray-200">
          {refTables}
        </div>

        {/* Direita: calculadora sticky */}
        <div className="min-w-0 px-6 lg:pl-12 lg:pr-10 xl:pr-10 py-12 flex flex-col justify-center sticky top-16 self-start bg-surface">
          <div className="mb-10">
            <SliderInput id="students-slider-desktop" students={students} sliderPct={sliderPct} onChange={setStudents} />
          </div>
          {calcCards}
          {calcCallout}
        </div>

      </div>
    </section>
  )
}
