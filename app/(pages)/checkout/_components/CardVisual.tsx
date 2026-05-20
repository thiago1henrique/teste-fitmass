'use client'

import { useWatch, type Control } from 'react-hook-form'
import type { CheckoutFormData } from '../schema'

type Props = {
  control: Control<CheckoutFormData>
  cvvFocused: boolean
}

type CardBrand = 'visa' | 'mastercard' | 'amex' | 'elo' | 'generic'

function detectBrand(num: string): CardBrand {
  const d = num.replace(/\D/g, '')
  if (!d) return 'generic'
  if (d.startsWith('4')) return 'visa'
  if (/^5[1-5]/.test(d) || /^2(2[2-9][1-9]|[3-6]\d{2}|7[01]\d|720)/.test(d)) return 'mastercard'
  if (/^3[47]/.test(d)) return 'amex'
  if (/^(4011|4312|4389|4514|4576|5041|5066|5090|6277|6362|6504|6505|6516|6550)/.test(d)) return 'elo'
  return 'generic'
}

function CardChip() {
  return (
    <svg width="42" height="32" viewBox="0 0 42 32" fill="none" aria-hidden="true">
      <rect width="42" height="32" rx="5" fill="#C8A84B" />
      <rect x="1" y="1" width="40" height="30" rx="4" fill="url(#chipGrad)" />
      {/* Contact pads */}
      <rect x="5" y="5" width="12" height="9" rx="1.5" fill="#A07830" opacity="0.6" />
      <rect x="25" y="5" width="12" height="9" rx="1.5" fill="#A07830" opacity="0.6" />
      <rect x="5" y="18" width="12" height="9" rx="1.5" fill="#A07830" opacity="0.6" />
      <rect x="25" y="18" width="12" height="9" rx="1.5" fill="#A07830" opacity="0.6" />
      {/* Vertical bar */}
      <rect x="18" y="3" width="6" height="26" rx="1" fill="#A07830" opacity="0.5" />
      {/* Horizontal bar */}
      <rect x="3" y="13" width="36" height="6" rx="1" fill="#A07830" opacity="0.5" />
      <defs>
        <linearGradient id="chipGrad" x1="0" y1="0" x2="42" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D4AE52" />
          <stop offset="50%" stopColor="#B8943B" />
          <stop offset="100%" stopColor="#C8A84B" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function ContactlessIcon() {
  return (
    <svg width="20" height="24" viewBox="0 0 20 24" fill="none" aria-hidden="true">
      <path d="M10 12C10 8.686 12.686 6 16 6" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <path d="M10 12C10 7.029 14.029 3 19 3" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      <path d="M10 12C10 5.373 15.373 0 22 0" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <circle cx="10" cy="12" r="2" fill="white" opacity="0.9" />
    </svg>
  )
}

function BrandLogo({ brand }: { brand: CardBrand }) {
  if (brand === 'visa') {
    return (
      <svg width="52" height="18" viewBox="0 0 52 18" fill="none" aria-label="Visa">
        <text x="0" y="16" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="17"
          fontStyle="italic" fill="white" letterSpacing="0">VISA</text>
      </svg>
    )
  }
  if (brand === 'mastercard') {
    return (
      <svg width="44" height="28" viewBox="0 0 44 28" aria-label="Mastercard">
        <circle cx="14" cy="14" r="14" fill="#EB001B" />
        <circle cx="30" cy="14" r="14" fill="#F79E1B" />
        <path d="M22 5.6a14 14 0 0 1 0 16.8A14 14 0 0 1 22 5.6z" fill="#FF5F00" />
      </svg>
    )
  }
  if (brand === 'amex') {
    return (
      <span
        className="font-body font-bold text-white text-xs tracking-widest opacity-90"
        aria-label="American Express"
      >
        AMEX
      </span>
    )
  }
  if (brand === 'elo') {
    return (
      <span
        className="font-body font-bold text-white text-sm tracking-wider opacity-90"
        aria-label="Elo"
      >
        elo
      </span>
    )
  }
  return null
}

/* Formata o número de 16 dígitos em 4 grupos de 4 */
function CardNumberDisplay({ raw }: { raw: string }) {
  const digits = raw.replace(/\D/g, '')
  const groups = [
    digits.slice(0, 4),
    digits.slice(4, 8),
    digits.slice(8, 12),
    digits.slice(12, 16),
  ]

  return (
    <div className="flex gap-4 items-center" aria-label="Número do cartão">
      {groups.map((g, gi) => (
        <span key={gi} className="flex gap-1">
          {Array.from({ length: 4 }).map((_, ci) => {
            const char = g[ci]
            return (
              <span
                key={ci}
                className="font-mono text-xl leading-none transition-all duration-200"
                style={{
                  color: char ? 'white' : 'rgba(255,255,255,0.3)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {char ?? '•'}
              </span>
            )
          })}
        </span>
      ))}
    </div>
  )
}

export default function CardVisual({ control, cvvFocused }: Props) {
  const cardNumber = useWatch({ control, name: 'cardNumber' }) ?? ''
  const cardName = useWatch({ control, name: 'cardName' }) ?? ''
  const cardExpiry = useWatch({ control, name: 'cardExpiry' }) ?? ''
  const cardCvv = useWatch({ control, name: 'cardCvv' }) ?? ''

  const brand = detectBrand(cardNumber)
  const displayName = cardName.trim() || 'NOME DO TITULAR'
  const displayExpiry = cardExpiry || 'MM/AA'

  return (
    <div
      className="w-full max-w-100 mx-auto"
      style={{ perspective: '1200px' }}
      aria-hidden="true"
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1.586 / 1',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.65s cubic-bezier(0.4, 0.2, 0.2, 1)',
          transform: cvvFocused ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* ─── Frente do cartão ──────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #1c2a1c 0%, #0f1f0f 40%, #1a2f1a 70%, #0d1a0d 100%)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(136,189,35,0.15)',
          }}
        >
          {/* Glow verde radial */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 20% 30%, rgba(136,189,35,0.18) 0%, transparent 65%)',
              pointerEvents: 'none',
            }}
          />
          {/* Textura sutil */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 12px)',
              pointerEvents: 'none',
            }}
          />

          {/* Conteúdo frente */}
          <div className="relative h-full flex flex-col justify-between p-5 sm:p-6">
            {/* Linha superior: chip + logo */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <CardChip />
                <ContactlessIcon />
              </div>
              <div className="flex items-center">
                <BrandLogo brand={brand} />
              </div>
            </div>

            {/* Número do cartão */}
            <div className="mt-1">
              <CardNumberDisplay raw={cardNumber} />
            </div>

            {/* Linha inferior: nome + validade */}
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-body text-[9px] uppercase tracking-widest text-white/30 mb-0.5">
                  Titular
                </p>
                <p className="font-body font-semibold text-sm text-white/90 uppercase truncate tracking-wide">
                  {displayName}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-body text-[9px] uppercase tracking-widest text-white/30 mb-0.5">
                  Validade
                </p>
                <p className="font-mono text-sm text-white/90 tracking-widest">
                  {displayExpiry}
                </p>
              </div>
            </div>
          </div>

          {/* Linha de brilho diagonal */}
          <div
            style={{
              position: 'absolute',
              top: '-20%',
              left: '-10%',
              width: '60%',
              height: '200%',
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* ─── Verso do cartão ───────────────────────────────── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #141e14 0%, #0f1a0f 50%, #1a2a1a 100%)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(136,189,35,0.15)',
          }}
        >
          {/* Tarja magnética */}
          <div
            style={{
              position: 'absolute',
              top: '22%',
              left: 0,
              right: 0,
              height: '22%',
              background: 'linear-gradient(180deg, #111 0%, #000 40%, #1a1a1a 100%)',
            }}
          />

          {/* Faixa de assinatura + CVV */}
          <div
            style={{
              position: 'absolute',
              top: '52%',
              left: '5%',
              right: '5%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {/* Faixa de assinatura */}
            <div
              style={{
                flex: 1,
                height: '36px',
                background: 'repeating-linear-gradient(90deg, #fff 0, #fff 4px, #e8e8e8 4px, #e8e8e8 6px)',
                borderRadius: '3px',
                opacity: 0.85,
              }}
            />
            {/* Box do CVV */}
            <div
              style={{
                width: '52px',
                height: '36px',
                background: 'white',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <span style={{ fontSize: '8px', color: '#888', fontFamily: 'sans-serif', letterSpacing: '0.05em' }}>
                CVV
              </span>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#1a1a1a',
                  letterSpacing: '0.15em',
                }}
              >
                {cardCvv.padEnd(3, '•')}
              </span>
            </div>
          </div>

          {/* Logo Fitmass no verso */}
          <div
            style={{
              position: 'absolute',
              bottom: '8%',
              right: '5%',
            }}
          >
            <span
              className="font-title uppercase tracking-widest text-white/20 text-base"
            >
              Fitmass
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
