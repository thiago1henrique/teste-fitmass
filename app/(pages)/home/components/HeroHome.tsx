'use client'

import { useState, useEffect } from 'react'

const METRICS = [
  { label: 'Massa Magra', value: '52.3 kg', pct: 72 },
  { label: 'Gordura',     value: '18.2%',   pct: 45 },
  { label: 'Hidratação',  value: '61.4%',   pct: 80 },
]

const ACCENT = '#88BD23'

export default function HeroHome() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => setTime(
      new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date())
    )
    tick()
    const id = setInterval(tick, 15_000)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center bg-contrast overflow-hidden"
      aria-label="Apresentação Fitmass"
    >
      {/* Radial glow — topo direita (accent) */}
      <div
        className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-accent/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      {/* Radial glow — baixo esquerda (secondary) */}
      <div
        className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Grid de linhas sutil */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(136,189,35,1) 1px, transparent 1px), linear-gradient(90deg, rgba(136,189,35,1) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
        aria-hidden="true"
      />

      {/* Barra vertical accent — direita */}
      <div
        className="absolute top-0 right-32 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      {/* Barra vertical secondary — esquerda */}
      <div
        className="absolute top-0 left-32 w-px h-full bg-linear-to-b from-transparent via-secondary/15 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Conteúdo */}
      <div className="relative max-w-6xl mx-auto w-full px-4 pt-32 pb-36 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-16 items-center">

        {/* Copy */}
        <div>
          <span className="inline-flex items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            Bioimpedância Profissional
          </span>

          <h1 className="font-title text-5xl md:text-6xl lg:text-7xl uppercase text-white tracking-wide leading-[1.05] mb-8">
            A TECNOLOGIA QUE TRANSFORMA SUA ACADEMIA{' '}
            <span className="text-accent">E FIDELIZA SEUS ALUNOS</span>
          </h1>

          <p className="font-body text-white/65 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
            Bioimpedância de precisão aliada a um software de gestão completo
            para elevar o nível do seu negócio.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/planos"
              className="inline-flex items-center justify-center gap-2 bg-accent text-white font-body font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:bg-accent/90 transition-colors"
            >
              Conhecer Planos
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#diferenciais"
              className="inline-flex items-center justify-center border border-secondary/40 text-secondary font-body font-semibold uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:border-secondary hover:bg-secondary/10 transition-colors"
            >
              Ver Diferenciais
            </a>
          </div>
        </div>

        {/* Phone Mockup */}
        <div
          className="flex justify-center lg:justify-end"
          role="img"
          aria-label="Preview do app Fitmass com dados de bioimpedância"
        >
          <div className="relative" style={{ width: 252, height: 516 }}>

            {/* Ambient glow */}
            <div
              className="absolute -inset-8 rounded-full blur-3xl -z-10 opacity-25"
              style={{ backgroundColor: ACCENT }}
              aria-hidden="true"
            />

            {/* Phone shell */}
            <div
              className="absolute inset-0 rounded-[2.8rem] bg-[#1c1c1e]"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1), 0 32px 80px rgba(0,0,0,0.85)' }}
            >
              {/* Side buttons */}
              <div className="absolute -left-[2px]  top-[96px]  w-[3px] h-[28px] bg-[#111] rounded-l-full" aria-hidden="true" />
              <div className="absolute -left-[2px]  top-[136px] w-[3px] h-[28px] bg-[#111] rounded-l-full" aria-hidden="true" />
              <div className="absolute -right-[2px] top-[116px] w-[3px] h-[44px] bg-[#111] rounded-r-full" aria-hidden="true" />

              {/* Screen */}
              <div className="absolute inset-[5px] rounded-[2.3rem] overflow-hidden flex flex-col bg-[#0d0d13]">

                {/* Status bar */}
                <div className="relative flex items-center justify-between px-5 pt-3.5 pb-0.5 flex-shrink-0">
                  <span suppressHydrationWarning className="text-white/55 text-[9px] font-semibold tabular-nums">
                    {time || '–:–'}
                  </span>

                  {/* Dynamic island */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[68px] h-[18px] bg-black rounded-full flex items-center justify-center" aria-hidden="true">
                    <div className="w-[6px] h-[6px] rounded-full bg-zinc-900 border border-zinc-700/60" />
                  </div>

                  {/* Battery */}
                  <svg viewBox="0 0 22 11" fill="none" className="w-[18px] h-[9px]" aria-hidden="true">
                    <rect x=".5" y=".5" width="18" height="10" rx="2" stroke="white" strokeOpacity=".45" />
                    <rect x="1.5" y="1.5" width="12" height="8" rx="1.2" fill="white" fillOpacity=".45" />
                    <path d="M20 3.5v4" stroke="white" strokeOpacity=".45" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>

                {/* App header */}
                <div
                  className="px-3 py-2.5 flex items-center justify-between flex-shrink-0"
                  style={{ backgroundColor: ACCENT }}
                >
                  <span className="text-white text-[10px] font-bold tracking-wider uppercase">Fitmass Pro</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/50 flex-shrink-0" />
                </div>

                {/* Profile row */}
                <div className="px-3 py-2 border-b border-white/[0.06] flex items-center gap-2 flex-shrink-0">
                  <div
                    className="w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: ACCENT + '30', border: `1px solid ${ACCENT}60` }}
                  >
                    <span className="text-[9px] font-bold" style={{ color: ACCENT }}>JD</span>
                  </div>
                  <div>
                    <div className="text-white text-[9px] font-semibold">João Dias</div>
                    <div className="text-white/35 text-[8px]">Avaliação #247</div>
                  </div>
                </div>

                {/* Main metric */}
                <div className="px-3 py-3 text-center border-b border-white/[0.06] flex-shrink-0">
                  <div className="text-white/40 text-[8px] uppercase tracking-widest mb-1">Peso Corporal</div>
                  <div className="font-title text-[2.5rem] leading-none uppercase" style={{ color: ACCENT }}>72.4</div>
                  <div className="text-white/40 text-[9px] mt-0.5">kg</div>
                </div>

                {/* IMC badge */}
                <div className="flex justify-center py-1.5 flex-shrink-0">
                  <span
                    className="text-[8px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                    style={{ backgroundColor: ACCENT + '20', color: ACCENT }}
                  >
                    IMC 22.8 — Normal
                  </span>
                </div>

                {/* Metrics */}
                <div className="px-3 pt-1 flex-1 flex flex-col gap-2">
                  {METRICS.map(({ label, value, pct }) => (
                    <div key={label}>
                      <div className="flex justify-between items-center mb-[3px]">
                        <span className="text-white/45 text-[8px]">{label}</span>
                        <span className="text-[8px] font-semibold" style={{ color: ACCENT }}>{value}</span>
                      </div>
                      <div className="h-[3px] rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: ACCENT }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="px-3 pb-2 pt-2 flex-shrink-0">
                  <div
                    className="h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: ACCENT }}
                  >
                    <span className="text-white text-[8px] font-bold uppercase tracking-wider">Ver Relatório Completo</span>
                  </div>
                </div>

                {/* Home indicator */}
                <div className="flex justify-center pb-2 pt-0.5 flex-shrink-0">
                  <div className="w-[60px] h-1 rounded-full bg-white/20" />
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div
              className="absolute top-6 -right-5 rounded-xl px-3 py-2 shadow-lg"
              style={{ backgroundColor: ACCENT, boxShadow: `0 8px 24px ${ACCENT}60` }}
              aria-hidden="true"
            >
              <div className="text-white/80 text-[9px] font-semibold uppercase tracking-wide">IMC</div>
              <div className="font-title text-white text-base uppercase">22.8</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-30 pointer-events-none select-none"
        aria-hidden="true"
      >
        <span className="font-body text-white text-[10px] uppercase tracking-[0.25em]">Desça a página</span>
        <svg className="w-4 h-4 text-white animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Diagonal → PainPointsSection (bg-surface) */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" className="w-full" style={{ height: 72, display: 'block' }}>
          <polygon fill="#F8F8F8" points="1440,0 1440,72 0,72" />
        </svg>
      </div>
    </section>
  )
}
