'use client'

import { useState } from 'react'
import data from '@/public/json-precos.json'

/* ─── Formatters ─────────────────────────────────────────────────────────── */

const SPECIAL: Record<string, string> = {
  bioscan: 'Bioscan',
  pdf: 'PDF',
  api: 'API',
  erp: 'ERP',
  qr: 'QR Code',
  whatsapp: 'WhatsApp',
  app: 'App',
  coach: 'Coach',
  pocket: 'Pocket',
  scanner: 'Scanner',
  timeline: 'Timeline',
}

function formatKey(key: string): string {
  return key
    .split('_')
    .map((w) => SPECIAL[w.toLowerCase()] ?? (w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
}

/* ─── Data ───────────────────────────────────────────────────────────────── */

const PLANS = ['gratis', 'premium', 'ultra'] as const
type PlanKey = (typeof PLANS)[number]

const PLAN_LABELS: Record<PlanKey, string> = { gratis: 'Grátis', premium: 'Premium', ultra: 'Ultra' }
const ULTRA_IDX = 2

type Feature = { name: string; availability: [boolean, boolean, boolean] }
type Category = { name: string; features: Feature[] }

const categories: Category[] = Object.entries(data.planos_fitmass).map(
  ([catName, feats]) => ({
    name: catName,
    features: Object.entries(feats as Record<string, Record<PlanKey, boolean>>).map(
      ([key, vals]) => ({
        name: formatKey(key),
        availability: PLANS.map((p) => vals[p]) as [boolean, boolean, boolean],
      })
    ),
  })
)

const prices = data.metadata.precos as Record<PlanKey, string>

/* ─── Icons ──────────────────────────────────────────────────────────────── */

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function SlidersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  )
}

function ZapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth={2.5} />
    </svg>
  )
}

const CATEGORY_ICONS: Record<string, React.FC> = {
  'Menu do Aluno': UserIcon,
  'Personalização': SlidersIcon,
  'Funcionalidades Avançadas': ZapIcon,
  'Fitmass App': PhoneIcon,
}

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
  const [open, setOpen] = useState<string | null>(null)
  const toggle = (name: string) => setOpen((prev) => (prev === name ? null : name))

  return (
    <section
      id="comparativo"
      className="py-14 px-4 bg-white"
      aria-labelledby="comparativo-heading"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
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

        {/* Desktop column headers */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] mb-2 px-6">
          <div />
          {PLANS.map((plan, i) => (
            <div
              key={plan}
              className={`text-center py-2 ${i === ULTRA_IDX ? 'bg-accent/5 rounded-t-xl mx-0.5' : ''}`}
            >
              <div
                className={`font-title text-sm uppercase tracking-widest ${
                  i === ULTRA_IDX ? 'text-accent font-bold' : 'text-contrast/50'
                }`}
              >
                {PLAN_LABELS[plan]}
              </div>
              <div
                className={`font-body text-xs mt-0.5 ${
                  i === ULTRA_IDX ? 'text-accent/70 font-semibold' : 'text-contrast/35'
                }`}
              >
                {prices[plan]}
              </div>
            </div>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {categories.map((category) => {
            const isOpen = open === category.name
            const Icon = CATEGORY_ICONS[category.name] ?? PhoneIcon

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
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isOpen
                          ? 'bg-accent text-white'
                          : 'bg-accent/10 text-accent group-hover:bg-accent/20'
                      }`}
                    >
                      <Icon />
                    </span>
                    <span className="font-title text-xl uppercase tracking-wide text-contrast">
                      {category.name}
                    </span>
                    <span className="hidden sm:inline font-body text-xs text-contrast/35">
                      {category.features.length} recursos
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
                    isOpen ? 'max-h-1000 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {/* Mobile column headers */}
                  <div className="md:hidden grid grid-cols-[2fr_1fr_1fr_1fr] bg-surface px-4 py-2 border-t border-gray-100">
                    <div />
                    {PLANS.map((plan, i) => (
                      <div
                        key={plan}
                        className={`text-center text-[10px] font-body font-bold uppercase leading-tight ${
                          i === ULTRA_IDX ? 'text-accent' : 'text-contrast/50'
                        }`}
                      >
                        {PLAN_LABELS[plan]}
                      </div>
                    ))}
                  </div>

                  {/* Feature rows */}
                  <div className="divide-y divide-gray-50">
                    {category.features.map((feature) => (
                      <div
                        key={feature.name}
                        className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-4 md:px-6 py-3 hover:bg-surface/60 transition-colors"
                      >
                        <span className="font-body text-sm text-contrast pr-4">
                          {feature.name}
                        </span>
                        {feature.availability.map((available, i) => (
                          <div
                            key={i}
                            className={`flex justify-center py-1 ${
                              i === ULTRA_IDX ? 'bg-accent/5 mx-0.5 rounded-md' : ''
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
