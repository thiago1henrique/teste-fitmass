'use client'

import { useState } from 'react'
import { Shield, CheckCircle2, ChevronDown, Tag } from 'lucide-react'
import type { PaymentMethod } from '../schema'

export type PlanDetails = {
  id: string
  name: string
  price: number
  billing: 'monthly' | 'annual'
  features: string[]
}

type Props = {
  plan: PlanDetails
  paymentMethod: PaymentMethod
  installments: number
  mobile?: boolean
}

const PIX_DISCOUNT_PCT = 0.05

export default function OrderSummary({ plan, paymentMethod, installments, mobile = false }: Props) {
  const [open, setOpen] = useState(false)

  const pixDiscount = paymentMethod === 'pix' ? Math.round(plan.price * PIX_DISCOUNT_PCT) : 0
  const total = plan.price - pixDiscount
  const installmentValue = installments > 1 ? (total / installments).toFixed(2).replace('.', ',') : null

  const content = (
    <div className="space-y-5">
      {/* Cabeçalho do plano */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-body text-[10px] font-semibold uppercase tracking-widest text-contrast/35 mb-1">
            Plano selecionado
          </p>
          <h3 className="font-title text-2xl text-contrast uppercase tracking-wide leading-tight">
            {plan.name}
          </h3>
          <p className="font-body text-xs text-contrast/40 mt-0.5">
            {plan.billing === 'annual' ? 'Cobrado anualmente' : 'Cobrado mensalmente'}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-title text-3xl text-contrast tabular-nums leading-none">
            R$&thinsp;{total}
          </p>
          <p className="font-body text-xs text-contrast/40 mt-1">/mês</p>
        </div>
      </div>

      {/* Desconto Pix */}
      {paymentMethod === 'pix' && (
        <div className="flex items-center gap-2 bg-accent/8 border border-accent/20 rounded-xl px-3 py-2.5">
          <Tag className="w-3.5 h-3.5 text-accent shrink-0" />
          <p className="font-body text-xs text-accent font-semibold">
            Desconto de 5% aplicado no pagamento via Pix
          </p>
        </div>
      )}

      {/* Parcelamento */}
      {paymentMethod === 'credit_card' && installmentValue && (
        <p className="font-body text-xs text-contrast/50">
          {installments}x de R$&thinsp;{installmentValue} no cartão
        </p>
      )}

      <hr className="border-gray-100" />

      {/* Features incluídas */}
      <ul className="space-y-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <span className="font-body text-sm text-contrast/65 leading-snug">{f}</span>
          </li>
        ))}
      </ul>

      <hr className="border-gray-100" />

      {/* Breakdown de preço */}
      <div className="space-y-2 font-body text-sm">
        <div className="flex justify-between text-contrast/55">
          <span>Subtotal</span>
          <span>R$&thinsp;{plan.price}/mês</span>
        </div>
        {pixDiscount > 0 && (
          <div className="flex justify-between text-accent font-medium">
            <span>Desconto Pix (5%)</span>
            <span>− R$&thinsp;{pixDiscount}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-contrast pt-2 border-t border-gray-100 text-base">
          <span>Total</span>
          <span>R$&thinsp;{total}/mês</span>
        </div>
      </div>

      {/* Selo de segurança */}
      <div className="flex items-start gap-2.5 pt-1">
        <Shield className="w-4 h-4 shrink-0 mt-0.5 text-accent" />
        <p className="font-body text-xs text-contrast/35 leading-relaxed">
          Pagamento processado com criptografia SSL de 256 bits. Seus dados estão seguros.
        </p>
      </div>
    </div>
  )

  if (mobile) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between px-5 py-4 cursor-pointer"
        >
          <span className="font-body text-sm text-contrast/55 font-medium">
            {open ? 'Ocultar resumo do pedido' : 'Ver resumo do pedido'}
          </span>
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-title text-xl text-accent">
              R$&thinsp;{total}/mês
            </span>
            <ChevronDown
              className={`w-4 h-4 text-contrast/35 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </div>
        </button>
        {open && (
          <div className="px-5 pb-5 border-t border-gray-100 pt-5">{content}</div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      {content}
    </div>
  )
}
