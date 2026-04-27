'use client'

import { useState } from 'react'

/* ─── Icons ──────────────────────────────────────────────────────────────── */

function BodyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 flex-shrink-0"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="5" r="3" />
      <path d="M8 12.5c0-2 1.5-3.5 4-3.5s4 1.5 4 3.5l1 7H7l1-7z" />
      <path d="M8 13l-3 4M16 13l3 4" />
    </svg>
  )
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 flex-shrink-0"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
      <polyline points="6,13 9,9 12,11 15,7 18,9" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 flex-shrink-0"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth={2.5} />
    </svg>
  )
}

/* ─── Types ──────────────────────────────────────────────────────────────── */

type Feature = {
  name: string
  availability: [boolean, boolean, boolean, boolean]
}

type Category = {
  name: string
  Icon: React.FC
  features: Feature[]
}

/* ─── Data ───────────────────────────────────────────────────────────────── */

const PLANS = ['Básico', 'Premium', 'ULTRA', 'Enterprise'] as const
const ULTRA_COL = 2

const categories: Category[] = [
  {
    name: 'Avaliação Corporal',
    Icon: BodyIcon,
    features: [
      { name: 'Peso',             availability: [true,  true,  true,  true]  },
      { name: 'IMC',              availability: [true,  true,  true,  true]  },
      { name: 'Massa Magra',      availability: [true,  true,  true,  true]  },
      { name: 'Gordura Corporal', availability: [true,  true,  true,  true]  },
      { name: 'Gordura Visceral', availability: [false, true,  true,  true]  },
      { name: 'Taxa Metabólica',  availability: [false, true,  true,  true]  },
      { name: 'Idade Corporal',   availability: [false, false, true,  true]  },
    ],
  },
  {
    name: 'Software e Gestão',
    Icon: DashboardIcon,
    features: [
      { name: 'Dashboard Admin',         availability: [true,  true,  true,  true]  },
      { name: 'Histórico Ilimitado',     availability: [false, true,  true,  true]  },
      { name: 'Exportação de PDF',       availability: [false, true,  true,  true]  },
      { name: 'Comparativo de Evolução', availability: [false, false, true,  true]  },
    ],
  },
  {
    name: 'Experiência do Aluno',
    Icon: PhoneIcon,
    features: [
      { name: 'Acesso via App',                      availability: [false, true,  true,  true]  },
      { name: 'Notificações Push',                   availability: [false, false, true,  true]  },
      { name: 'Personalização com Logo da Academia', availability: [false, false, true,  true]  },
    ],
  },
]

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-accent mx-auto" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="w-4 h-4 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24"
      stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function ComparisonAccordion() {
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  const toggle = (name: string) =>
    setOpenCategory((prev) => (prev === name ? null : name))

  return (
    <section
      id="comparativo"
      className="py-14 px-4 bg-white"
      aria-labelledby="comparativo-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-accent/10 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            Funcionalidades
          </span>
          <h2
            id="comparativo-heading"
            className="font-title text-4xl uppercase text-contrast tracking-wide mb-3"
          >
            Compare os Planos
          </h2>
          <p className="text-contrast/60 font-body">
            Expanda cada categoria para ver os detalhes de cada plano.
          </p>
        </div>

        {/* Cabeçalho desktop */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] mb-2 px-6">
          <div />
          {PLANS.map((plan, i) => (
            <div
              key={plan}
              className={`text-center font-title text-sm uppercase tracking-widest py-2 ${
                i === ULTRA_COL
                  ? 'text-accent font-bold'
                  : 'text-contrast/50'
              }`}
            >
              {plan}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {categories.map((category) => {
            const isOpen = openCategory === category.name

            return (
              <div
                key={category.name}
                className="rounded-2xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggle(category.name)}
                  className="w-full flex items-center justify-between px-6 py-5 bg-white hover:bg-surface transition-colors text-left group"
                  aria-expanded={isOpen}
                  aria-controls={`cat-${category.name.replace(/\s/g, '-')}`}
                >
                  <div className="flex items-center gap-3">
                    {/* Icon da categoria */}
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isOpen
                          ? 'bg-accent text-white'
                          : 'bg-accent/10 text-accent group-hover:bg-accent/20'
                      }`}
                    >
                      <category.Icon />
                    </span>
                    <span className="font-title text-xl uppercase tracking-wide text-contrast">
                      {category.name}
                    </span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-accent transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  id={`cat-${category.name.replace(/\s/g, '-')}`}
                  role="region"
                  aria-label={category.name}
                  className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                    isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {/* Cabeçalho mobile */}
                  <div className="md:hidden grid grid-cols-[2fr_1fr_1fr_1fr_1fr] bg-surface px-4 py-2 border-t border-gray-100">
                    <div />
                    {PLANS.map((plan, i) => (
                      <div
                        key={plan}
                        className={`text-center text-[10px] font-body font-bold uppercase leading-tight ${
                          i === ULTRA_COL ? 'text-accent' : 'text-contrast/50'
                        }`}
                      >
                        {plan}
                      </div>
                    ))}
                  </div>

                  <div className="divide-y divide-gray-50">
                    {category.features.map((feature) => (
                      <div
                        key={feature.name}
                        className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center px-4 md:px-6 py-3 hover:bg-surface/60 transition-colors"
                      >
                        <span className="font-body text-sm text-contrast pr-4">
                          {feature.name}
                        </span>
                        {feature.availability.map((available, i) => (
                          <div
                            key={i}
                            className={`flex justify-center py-1 ${
                              i === ULTRA_COL ? 'bg-accent/5 mx-0.5 rounded-md' : ''
                            }`}
                          >
                            {available ? <CheckIcon /> : <XIcon />}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
