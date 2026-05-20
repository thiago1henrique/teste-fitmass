'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

// ── Constants ─────────────────────────────────────────────────────────────────

const ACCENT = '#88BD23'

const STATE_NAMES: Record<string, string> = {
  AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia',
  CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás',
  MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais',
  PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí',
  RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul',
  RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina', SP: 'São Paulo',
  SE: 'Sergipe', TO: 'Tocantins',
}

const GYMS: Record<string, string[]> = {
  SP: ['IronWorks Paulista', 'FitMax Academia', 'Corpo em Forma SP', 'Prime Fitness'],
  RJ: ['Carioca Fit', 'Orla Gym', 'Ipanema Health Club'],
  MG: ['BH Sports Club', 'Atlético Fitness', 'Savassi Gym'],
  RS: ['Gaúcho Fitness', 'Porto Alegre Gym', 'Sul Fit Academia'],
  PR: ['Curitiba Sports', 'Paraná Fitness Center'],
  SC: ['Floripa Gym', 'Blumenau Fit'],
  BA: ['Salvador Fit', 'Bahia Sports Club', 'Costa Atlântica Gym'],
  CE: ['Fortaleza Fit', 'Nordeste Gym'],
  PE: ['Recife Sports', 'Boa Viagem Fit'],
  GO: ['Goiânia Fitness', 'Centro-Oeste Gym'],
  DF: ['Plano Piloto Fit', 'Brasília Sports Club'],
  AM: ['Manaus Gym', 'Amazônia Fitness'],
  PA: ['Belém Fit', 'Pará Sports'],
  MA: ['São Luís Gym'],
  RN: ['Natal Fit', 'Potiguar Sports'],
  PB: ['João Pessoa Gym'],
  AL: ['Maceió Fit'],
  SE: ['Aracaju Sports'],
  PI: ['Teresina Gym'],
  MT: ['Cuiabá Fitness'],
  MS: ['Campo Grande Fit'],
  ES: ['Vitória Gym'],
  RO: ['Porto Velho Fit'],
  AC: ['Rio Branco Gym'],
  RR: ['Boa Vista Sports'],
  AP: ['Macapá Fit'],
  TO: ['Palmas Gym'],
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
      <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7 text-accent" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
      </div>
      <p className="font-body text-contrast/50 text-sm leading-relaxed max-w-50">
        Passe o mouse sobre um estado para ver as academias parceiras
      </p>
    </div>
  )
}

function GymList({ uf }: { uf: string }) {
  const stateName = STATE_NAMES[uf] ?? uf
  const gyms = GYMS[uf] ?? []

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-14 h-9 rounded-lg overflow-hidden shrink-0 border border-gray-200 bg-gray-100">
          <Image
            src={`/flags/br-states/${uf.toLowerCase()}.svg`}
            alt={`Bandeira ${stateName}`}
            width={56}
            height={36}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
        <div>
          <p className="font-title text-contrast text-base uppercase tracking-wide leading-tight">{stateName}</p>
          <p className="font-body text-contrast/50 text-xs">
            {gyms.length} {gyms.length === 1 ? 'academia parceira' : 'academias parceiras'}
          </p>
        </div>
      </div>

      {gyms.length > 0 ? (
        <ul className="space-y-2">
          {gyms.map(gym => (
            <li key={gym} className="flex items-center gap-2.5 font-body text-sm text-contrast/70">
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
              {gym}
            </li>
          ))}
        </ul>
      ) : (
        <p className="font-body text-contrast/40 text-sm italic">Em breve nesta região.</p>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

interface Props {
  svgHtml: string
}

const DEFAULT_FILL = '#e5e7eb'

export default function BrazilMapClient({ svgHtml }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoverUF, setHoverUF] = useState<string | null>(null)
  const [pinnedUF, setPinnedUF] = useState<string | null>(null)

  const activeUF = hoverUF ?? pinnedUF

  // Update path fills whenever the active state changes
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const svg = el.querySelector('svg')
    if (!svg) return
    svg.querySelectorAll('path[id^="BR"]').forEach(p => {
      const path = p as SVGPathElement
      path.style.fill = path.id.slice(2) === activeUF ? ACCENT : DEFAULT_FILL
    })
  }, [activeUF])

  const ufFromTarget = (e: React.PointerEvent | React.MouseEvent): string | null => {
    const t = e.target as SVGElement | null
    if (t?.tagName !== 'path') return null
    return t.id?.startsWith('BR') ? t.id.slice(2) : null
  }

  const onPointerMove = (e: React.PointerEvent) => {
    setHoverUF(ufFromTarget(e))
  }

  const onPointerLeave = () => {
    setHoverUF(null)
  }

  const onClick = (e: React.MouseEvent) => {
    const uf = ufFromTarget(e)
    if (!uf) return
    setPinnedUF(prev => prev === uf ? null : uf)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

      {/* Map */}
      <div className="relative">
        <div
          className="absolute inset-0 rounded-3xl bg-accent/5 blur-3xl -z-10 opacity-60"
          aria-hidden="true"
        />
        <div
          ref={containerRef}
          dangerouslySetInnerHTML={{ __html: svgHtml }}
          className="w-full [&_svg]:w-full [&_svg]:h-auto [&_circle]:pointer-events-none [&_path[id^='BR']]:cursor-pointer"
          aria-label="Mapa interativo do Brasil — passe o mouse sobre um estado"
          role="img"
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          onClick={onClick}
        />
      </div>

      {/* Info panel */}
      <div className="lg:sticky lg:top-28">
        <div className="bg-surface border border-gray-100 rounded-2xl p-6 min-h-65 flex flex-col justify-center shadow-sm">
          {activeUF ? <GymList uf={activeUF} /> : <EmptyState />}
        </div>
        <p className="mt-3 text-center font-body text-xs text-contrast/40 lg:hidden">
          Toque em um estado para ver as academias
        </p>
      </div>
    </div>
  )
}
