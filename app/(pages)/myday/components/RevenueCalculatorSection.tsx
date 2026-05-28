'use client'

import { useState } from 'react'

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
        <span className="font-title text-2xl text-accent">
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
          accentColor: 'var(--color-accent)',
          background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${sliderPct}%, #e5e7eb ${sliderPct}%, #e5e7eb 100%)`,
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

  const sliderPct = ((students - 1) / (500 - 1)) * 100
  const premiumRevenue = students * PREMIUM_PRICE
  const ultraRevenue = students * ULTRA_PRICE
  const monthlyDiff = ultraRevenue - premiumRevenue
  const yearlyDiff = monthlyDiff * 12
  const closestPreset = getClosestPreset(students)

  return (
    <section
      id="potencial-receita-myday"
      className="bg-surface"
      aria-labelledby="potencial-receita-heading"
    >
      {/* Cabeçalho centralizado */}
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-12 text-center">
        <span className="inline-flex items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
          Potencial de Receita
        </span>
        <h2
          id="potencial-receita-heading"
          className="font-title text-4xl md:text-5xl uppercase text-contrast tracking-wide mb-3"
        >
          Quanto sua academia pode faturar com o{' '}
          <span className="text-accent">MyDay?</span>
        </h2>
        <p className="text-contrast/60 font-body">
          Veja o potencial de receita mensal com base no número de alunos que aderirem ao serviço.
        </p>
      </div>

      {/* ── Slider sticky — APENAS MOBILE ─────────────────────────────
          Fica preso abaixo do header enquanto as tabelas rolam.
          No desktop este bloco fica oculto; o slider é renderizado
          dentro da coluna direita. ──────────────────────────────────── */}
      <div className="lg:hidden sticky top-16 z-10 bg-surface border-y border-gray-200 shadow-[0_4px_16px_rgba(0,0,0,0.06)] px-6 py-4">
        <SliderInput
          id="students-slider-mobile"
          students={students}
          sliderPct={sliderPct}
          onChange={setStudents}
        />
      </div>

      {/* ── Layout split full-width ────────────────────────────────────
          Mobile: flex-col — cards (order-1) acima, tabelas (order-2) abaixo.
          Desktop: grid 2 cols — tabelas à esquerda, calculadora à direita. ── */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 border-t border-gray-200">

        {/* ── ESQUERDA: Tabelas ───────────────────────────────────────── */}
        <div className="order-2 lg:order-1 min-w-0 px-6 lg:pl-10 xl:pl-20 lg:pr-12 py-8 lg:py-12 border-b lg:border-b-0 lg:border-r border-gray-200">
          <p className="font-body text-contrast/45 text-xs uppercase tracking-widest mb-6">
            Valores de referência — clique para selecionar
          </p>

          {/* Tabela Premium */}
          <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            <div className="bg-contrast px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-body font-bold text-white text-sm uppercase tracking-wide">Plano Premium</p>
                <p className="font-body text-white/45 text-xs">R$9,90/aluno/mês</p>
              </div>
            </div>
            <table className="w-full" role="table" aria-label="Tabela Plano Premium">
              <tbody>
                {PRESETS.map((n, i) => {
                  const active = n === closestPreset
                  return (
                    <tr
                      key={n}
                      onClick={() => setStudents(n)}
                      className={`cursor-pointer transition-colors duration-150 ${
                        active ? 'bg-accent/10' : i % 2 === 0 ? 'bg-white hover:bg-accent/5' : 'bg-gray-50 hover:bg-accent/5'
                      }`}
                    >
                      <td className={`px-4 py-2.5 font-body text-sm text-contrast/65 ${active ? 'border-l-2 border-accent font-semibold text-contrast' : ''}`}>
                        {n} alunos
                      </td>
                      <td className={`px-4 py-2.5 font-body text-sm text-right ${active ? 'text-accent font-bold' : 'text-contrast font-medium'}`}>
                        {formatBRL(n * PREMIUM_PRICE)}/mês
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Tabela Ultra */}
          <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            <div className="bg-contrast px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-body font-bold text-white text-sm uppercase tracking-wide">Plano Ultra</p>
                <p className="font-body text-white/45 text-xs">R$20/aluno/mês</p>
              </div>
              <span className="bg-accent text-white font-body font-bold text-xs uppercase tracking-wide px-2.5 py-1 rounded-full">
                Mais lucrativo
              </span>
            </div>
            <table className="w-full" role="table" aria-label="Tabela Plano Ultra">
              <tbody>
                {PRESETS.map((n, i) => {
                  const active = n === closestPreset
                  return (
                    <tr
                      key={n}
                      onClick={() => setStudents(n)}
                      className={`cursor-pointer transition-colors duration-150 ${
                        active ? 'bg-accent/10' : i % 2 === 0 ? 'bg-white hover:bg-accent/5' : 'bg-gray-50 hover:bg-accent/5'
                      }`}
                    >
                      <td className={`px-4 py-2.5 font-body text-sm text-contrast/65 ${active ? 'border-l-2 border-accent font-semibold text-contrast' : ''}`}>
                        {n} alunos
                      </td>
                      <td className={`px-4 py-2.5 font-body text-sm text-right ${active ? 'text-accent font-bold' : 'text-contrast font-medium'}`}>
                        {formatBRL(n * ULTRA_PRICE)}/mês
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── DIREITA: Calculadora ────────────────────────────────────── */}
        <div className="order-1 lg:order-2 min-w-0 px-6 lg:pl-12 lg:pr-10 xl:pr-10 py-8 lg:py-12 flex flex-col justify-center">

          {/* Slider — APENAS DESKTOP (mobile usa o sticky acima) */}
          <div className="hidden lg:block mb-10">
            <SliderInput
              id="students-slider-desktop"
              students={students}
              sliderPct={sliderPct}
              onChange={setStudents}
            />
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="min-w-0 bg-white border border-gray-200 rounded-2xl p-6" role="region" aria-label="Plano Premium">
              <p className="font-body font-bold text-contrast uppercase tracking-wider text-xs mb-1">Plano Premium</p>
              <p className="font-body text-contrast/45 text-xs mb-5">R$9,90/aluno/mês</p>
              <p
                className="font-title text-3xl lg:text-4xl 2xl:text-5xl text-accent leading-none"
                aria-live="polite"
                aria-label={`Receita Premium: ${formatBRL(premiumRevenue)} por mês`}
              >
                {formatBRL(premiumRevenue)}
              </p>
              <p className="font-body text-contrast/45 text-xs mt-2">
                /mês com {students} aluno{students !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="min-w-0 bg-accent/5 border-2 border-accent rounded-2xl p-6 relative" role="region" aria-label="Plano Ultra">
              <span className="absolute top-3 right-3 bg-accent text-white font-body font-bold text-xs uppercase px-2 py-0.5 rounded-full">
                Ultra
              </span>
              <p className="font-body font-bold text-contrast uppercase tracking-wider text-xs mb-1">Plano Ultra</p>
              <p className="font-body text-contrast/45 text-xs mb-5">R$20/aluno/mês</p>
              <p
                className="font-title text-3xl lg:text-4xl 2xl:text-5xl text-accent leading-none"
                aria-live="polite"
                aria-label={`Receita Ultra: ${formatBRL(ultraRevenue)} por mês`}
              >
                {formatBRL(ultraRevenue)}
              </p>
              <p className="font-body text-contrast/45 text-xs mt-2">
                /mês com {students} aluno{students !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Callout */}
          <div className="bg-accent/10 border border-accent/20 rounded-2xl px-6 py-4 text-center">
            <p className="font-body text-contrast/80 text-sm leading-relaxed">
              Com o <span className="font-bold text-accent">Ultra</span> você fatura{' '}
              <span
                className="font-title text-lg text-accent"
                aria-live="polite"
                aria-label={`${formatBRL(monthlyDiff)} por mês a mais`}
              >
                {formatBRL(monthlyDiff)}/mês
              </span>{' '}
              a mais —{' '}
              <span
                className="font-bold text-contrast"
                aria-live="polite"
                aria-label={`${formatBRL(yearlyDiff)} por ano`}
              >
                {formatBRL(yearlyDiff)}/ano
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
