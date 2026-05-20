'use client'

import { useState, useEffect, useRef } from 'react'
import { ImageTooltip } from './ImageTooltip'

/* ─── Icons ──────────────────────────────────────────────────────────────── */

function DumbbellIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true"
      stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2"  y="15" width="5"  height="10" rx="2" />
      <rect x="7"  y="11" width="4"  height="18" rx="2" />
      <line x1="11" y1="20" x2="29" y2="20" />
      <rect x="29" y="11" width="4"  height="18" rx="2" />
      <rect x="33" y="15" width="5"  height="10" rx="2" />
    </svg>
  )
}

function TrendingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true"
      stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 36V8" />
      <path d="M4 36h32" />
      <polyline points="8,28 14,20 20,23 27,13 36,8" />
      <path d="M30,8 L36,8 L36,14" />
      <circle cx="8"  cy="28" r="2" fill="currentColor" stroke="none" />
      <circle cx="14" cy="20" r="2" fill="currentColor" stroke="none" />
      <circle cx="20" cy="23" r="2" fill="currentColor" stroke="none" />
      <circle cx="27" cy="13" r="2" fill="currentColor" stroke="none" />
    </svg>
  )
}

function LightningIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23 4 L7 22 H18 L15 36 L33 18 H22 Z" />
    </svg>
  )
}

function NetworkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true"
      stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="20" cy="20" r="5" />
      <circle cx="8"  cy="8"  r="4" />
      <circle cx="32" cy="8"  r="4" />
      <circle cx="8"  cy="32" r="4" />
      <circle cx="32" cy="32" r="4" />
      <line x1="11" y1="11" x2="16" y2="16" />
      <line x1="29" y1="11" x2="24" y2="16" />
      <line x1="11" y1="29" x2="16" y2="24" />
      <line x1="29" y1="29" x2="24" y2="24" />
    </svg>
  )
}

/* ─── Tooltip image sets ─────────────────────────────────────────────────── */

const personalizacaoImages = [1, 2, 3, 4, 5].map((n) => ({
  src: `/pages/planos/cardsSection/recursos/personalizacao-0${n}.png`,
  alt: `Personalização ${n}`,
}))

const bioImages = [1, 2, 3, 4, 5].map((n) => ({
  src: `/pages/planos/cardsSection/recursos/bio-0${n}.png`,
  alt: `Bioscan tela ${n}`,
}))

const plotagemImages = [1, 2, 3, 4, 5].map((n) => ({
  src: `/pages/planos/cardsSection/recursos/plotagem-0${n}.png`,
  alt: `Plotagem ${n}`,
}))

/* ─── Data ───────────────────────────────────────────────────────────────── */

type Plan = {
  id: string
  name: string
  subtitle: string
  description: string
  badge: string | null
  cta: string
  ctaHref: string
  features: string[]
  Icon: React.FC<{ className?: string }>
}

const plans: Plan[] = [
  {
    id: 'basico',
    name: 'Básico',
    subtitle: 'Ideal para consultórios e profissionais liberais.',
    description: 'Para academias começarem a acompanhar avaliações corporais e evolução dos alunos.',
    badge: null,
    cta: 'Começar grátis',
    ctaHref: 'https://wa.me/5541984810567?text=Desejo%20saber%20mais%20sobre%20o%20plano%20B%C3%A1sico',
    Icon: DumbbellIcon,
    features: [
      'Avaliações corporais ilimitadas',
      'Visualização de relatórios e histórico de medições',
      'App para acompanhamento dos alunos',
      'Compartilhamento de relatórios em PDF',
      'Comunicação com alunos via WhatsApp',
      'Cadastro e gestão básica de alunos',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    subtitle: 'O plano perfeito para academias de médio porte.',
    description: 'Para academias que querem profissionalizar avaliações e melhorar o acompanhamento dos alunos.',
    badge: null,
    cta: 'Saiba Mais',
    ctaHref: 'https://wa.me/5541984810567?text=Desejo%20saber%20mais%20sobre%20o%20plano%20Premium',
    Icon: TrendingIcon,
    features: [
      'Tudo do Básico incluído',
      'Dashboard de evolução dos alunos',
      'Exportação de dados das medições',
      'Integração com ERP da academia',
      'Gestão de créditos Bioscan',
      'Suporte prioritário',
      'Contas de usuário com níveis de acesso',
    ],
  },
  {
    id: 'ultra',
    name: 'ULTRA',
    subtitle: 'A experiência completa em bioimpedância.',
    description: 'Para academias que querem transformar avaliações corporais em estratégia de retenção e crescimento.',
    badge: 'MAIS POPULAR',
    cta: 'Quero o ULTRA',
    ctaHref: 'https://wa.me/5541984810567?text=Desejo%20saber%20sobre%20o%20plano%20ULTRA',
    Icon: LightningIcon,
    features: [
      'Personalização do aplicativo da academia',
      'Personalização das telas do Bioscan',
      'Plotagem do Bioscan',
      'Pesquisas personalizadas após medições',
      'Exportação completa de dados',
      'API de integração com outros sistemas',
      'Webhooks para automações externas',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    subtitle: 'Soluções customizadas para grandes redes.',
    description: 'Para redes de academias e operações com múltiplas unidades que precisam de integração avançada e suporte dedicado.',
    badge: null,
    cta: 'Fale Conosco',
    ctaHref: 'https://wa.me/5541984810567?text=Desejo%20conhecer%20o%20plano%20Enterprise',
    Icon: NetworkIcon,
    features: [
      'Tudo do ULTRA incluído',
      'Integrações personalizadas',
      'API dedicada e suporte técnico',
      'Gerente de sucesso do cliente',
      'Implementação assistida',
      'Soluções para múltiplas unidades',
    ],
  },
]

/* ─── Price display ──────────────────────────────────────────────────────── */

const PRICES: Record<string, { monthly: number; annual: number }> = {
  premium: { monthly: 599, annual: 499 },
  ultra:   { monthly: 899, annual: 599 },
}

function PriceDisplay({ planId, isAnnual }: { planId: string; isAnnual: boolean }) {
  const [visible, setVisible] = useState(true)
  const [currentAnnual, setCurrentAnnual] = useState(isAnnual)
  const initRef = useRef(true)

  useEffect(() => {
    if (initRef.current) { initRef.current = false; return }
    setVisible(false)
    const t = setTimeout(() => {
      setCurrentAnnual(isAnnual)
      setVisible(true)
    }, 150)
    return () => clearTimeout(t)
  }, [isAnnual])

  if (planId === 'basico') {
    return (
      <div className="mb-6">
        <span className="font-title text-4xl text-contrast tracking-wide">Grátis</span>
        <p className="font-body text-xs text-contrast/40 mt-0.5">para sempre</p>
      </div>
    )
  }

  if (planId === 'enterprise') {
    return (
      <div className="mb-6">
        <span className="font-body text-xl font-semibold text-white/80 leading-snug">
          Vamos conversar.
        </span>
        <p className="font-body text-xs text-white/35 mt-0.5">preço sob consulta</p>
      </div>
    )
  }

  const isUltra = planId === 'ultra'
  const price = PRICES[planId][currentAnnual ? 'annual' : 'monthly']

  return (
    <div className="mb-6">
      <div
        className={`flex items-baseline gap-1 transition-all duration-150 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1.5'
        }`}
      >
        <span className={`font-body text-sm font-medium ${isUltra ? 'text-white/50' : 'text-contrast/40'}`}>
          R$
        </span>
        <span className={`font-title text-5xl tabular-nums leading-none ${isUltra ? 'text-accent' : 'text-contrast'}`}>
          {price}
        </span>
        <span className={`font-body text-sm ${isUltra ? 'text-white/50' : 'text-contrast/40'}`}>
          /mês
        </span>
      </div>
      <div className={`transition-opacity duration-150 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        {currentAnnual ? (
          <span className="inline-block mt-1.5 text-xs font-semibold font-body text-accent bg-accent/10 rounded-full px-2.5 py-0.5">
            Cobrado anualmente
          </span>
        ) : (
          <span className={`font-body text-xs mt-1.5 inline-block ${isUltra ? 'text-white/30' : 'text-contrast/30'}`}>
            ou R${PRICES[planId].annual}/mês no plano anual
          </span>
        )}
      </div>
    </div>
  )
}

/* ─── Check item ─────────────────────────────────────────────────────────── */

function CheckItem({
  text,
  isDark,
  tooltip,
}: {
  text: string
  isDark: boolean
  tooltip?: React.ReactNode
}) {
  return (
    <li className="flex items-start gap-2.5">
      <svg
        className="w-4 h-4 mt-0.5 shrink-0 text-accent"
        fill="none" viewBox="0 0 24 24"
        stroke="currentColor" strokeWidth={2.5} aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <span className="flex items-start gap-1.5 flex-1 min-w-0">
        <span className={`font-body text-sm leading-snug flex-1 min-w-0 ${isDark ? 'text-white/80' : 'text-contrast/70'}`}>
          {text}
        </span>
        {tooltip && <span className="shrink-0 mt-0.5">{tooltip}</span>}
      </span>
    </li>
  )
}

/* ─── Section ────────────────────────────────────────────────────────────── */

export default function PlanCards() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section
      id="planos"
      className="py-20 px-4 bg-surface"
      aria-labelledby="planos-heading"
    >
      <div className="max-w-6xl mx-auto">

        {/* Cabeçalho */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            Planos e Preços
          </span>
          <h2
            id="planos-heading"
            className="font-title text-4xl md:text-5xl text-contrast uppercase tracking-wide mb-4"
          >
            Escolha Seu Plano
          </h2>
          <p className="font-body text-contrast/60 text-lg max-w-xl mx-auto">
            Soluções completas em bioimpedância para cada fase do seu negócio.
          </p>
        </div>

        {/* Toggle mensal / anual */}
        <div className="flex justify-center mb-20">
          <div className="flex items-center gap-4">
            <span
              className={`font-body text-sm font-semibold transition-colors duration-200 select-none ${
                !isAnnual ? 'text-contrast' : 'text-contrast/40'
              }`}
            >
              Mensal
            </span>

            <button
              type="button"
              role="switch"
              aria-checked={isAnnual}
              aria-label="Alternar entre plano mensal e anual"
              onClick={() => setIsAnnual(a => !a)}
              className="relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 cursor-pointer"
              style={{ backgroundColor: isAnnual ? '#88BD23' : '#d1d5db' }}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>

            <div className="flex items-center gap-2.5">
              <span
                className={`font-body text-sm font-semibold transition-colors duration-200 select-none ${
                  isAnnual ? 'text-contrast' : 'text-contrast/40'
                }`}
              >
                Plano Anual
              </span>
              <span className="bg-accent text-white text-xs font-bold font-body rounded-full px-2.5 py-0.5 leading-none whitespace-nowrap">
                Economize até 25%
              </span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
          {plans.map((plan) => {
            const isUltra = plan.id === 'ultra'
            const isEnterprise = plan.id === 'enterprise'
            const isDark = isUltra || isEnterprise

            return (
              <article
                key={plan.id}
                className={`relative flex flex-col rounded-2xl transition-all duration-300 ${
                  isUltra
                    ? 'bg-contrast border-2 border-accent shadow-2xl shadow-accent/25 xl:scale-105 xl:-translate-y-3 z-10'
                    : isEnterprise
                    ? 'bg-[#1a1a2e] border border-white/10 shadow-lg'
                    : 'bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1'
                }`}
                aria-label={`Plano ${plan.name}`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="bg-accent text-white font-body font-bold text-xs uppercase tracking-widest text-center py-2 rounded-t-[14px]">
                    {plan.badge}
                  </div>
                )}

                <div className="flex flex-col flex-1 p-8">
                  {/* Ícone */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shrink-0 ${
                      isDark ? 'bg-accent/20 text-accent' : 'bg-accent/10 text-accent'
                    }`}
                  >
                    <plan.Icon className="w-8 h-8" />
                  </div>

                  {/* Nome */}
                  <h3
                    className={`font-title text-3xl uppercase tracking-wide mb-1 ${
                      isUltra ? 'text-accent' : isEnterprise ? 'text-white' : 'text-contrast'
                    }`}
                  >
                    {plan.name}
                  </h3>

                  {/* Subtítulo */}
                  <p
                    className={`font-body text-sm leading-snug mb-6 ${
                      isDark ? 'text-white/55' : 'text-contrast/55'
                    }`}
                  >
                    {plan.subtitle}
                  </p>

                  {/* Preço */}
                  <PriceDisplay planId={plan.id} isAnnual={isAnnual} />

                  <hr className={`mb-6 ${isDark ? 'border-white/10' : 'border-gray-100'}`} />

                  {/* Descrição */}
                  <p
                    className={`font-body text-sm leading-relaxed mb-6 ${
                      isDark ? 'text-white/75' : 'text-contrast/65'
                    }`}
                  >
                    {plan.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 flex-1" aria-label={`Recursos do plano ${plan.name}`}>
                    {plan.features.map((f) => {
                      let tooltip: React.ReactNode = undefined
                      if (isUltra) {
                        if (f === 'Personalização do aplicativo da academia') {
                          tooltip = <ImageTooltip images={personalizacaoImages} ariaLabel="Ver exemplos de personalização do aplicativo" />
                        } else if (f === 'Personalização das telas do Bioscan') {
                          tooltip = <ImageTooltip images={bioImages} ariaLabel="Ver exemplos de personalização de telas do Bioscan" />
                        } else if (f === 'Plotagem do Bioscan') {
                          tooltip = <ImageTooltip images={plotagemImages} ariaLabel="Ver exemplos de plotagem" />
                        }
                      }
                      return (
                        <CheckItem
                          key={f}
                          text={f}
                          isDark={isDark}
                          tooltip={tooltip}
                        />
                      )
                    })}
                  </ul>

                  {/* CTA */}
                  <a
                    href={plan.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-8 block text-center font-body font-semibold text-sm uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      isUltra
                        ? 'bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/30'
                        : isEnterprise
                        ? 'bg-white/10 text-white/80 border border-white/20 hover:bg-secondary/15 hover:border-secondary/40 hover:text-secondary'
                        : 'border-2 border-accent/50 text-accent hover:border-accent hover:bg-accent hover:text-white'
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
