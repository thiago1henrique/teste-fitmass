'use client'

import { Controller, useWatch, type UseFormReturn, type Control } from 'react-hook-form'
import { CreditCard, QrCode, FileText } from 'lucide-react'
import type { CheckoutFormData, PaymentMethod } from '../../schema'

type MethodConfig = {
  id: PaymentMethod
  label: string
  sublabel: string
  Icon: React.FC<{ className?: string }>
}

const METHODS: MethodConfig[] = [
  {
    id: 'credit_card',
    label: 'Cartão de Crédito',
    sublabel: 'Visa, Master, Elo, Amex',
    Icon: CreditCard,
  },
  {
    id: 'pix',
    label: 'Pix',
    sublabel: '5% de desconto',
    Icon: QrCode,
  },
  {
    id: 'boleto',
    label: 'Boleto',
    sublabel: 'Vence em 3 dias úteis',
    Icon: FileText,
  },
]

type Props = { form: UseFormReturn<CheckoutFormData> }

export default function PaymentSelector({ form }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-7 h-7 rounded-full bg-accent text-white font-body font-bold text-xs flex items-center justify-center shrink-0">
          3
        </div>
        <h2 className="font-title text-lg text-contrast uppercase tracking-wide">
          Forma de Pagamento
        </h2>
      </div>

      <Controller
        name="paymentMethod"
        control={form.control}
        render={({ field }) => (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {METHODS.map(({ id, label, sublabel, Icon }) => {
              const selected = field.value === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => field.onChange(id)}
                  aria-pressed={selected}
                  className={`
                    flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
                    ${selected
                      ? 'border-accent bg-accent/5 shadow-sm'
                      : 'border-gray-200 hover:border-accent/40 hover:bg-gray-50/50'
                    }
                  `}
                >
                  <Icon
                    className={`w-6 h-6 transition-colors duration-200 ${
                      selected ? 'text-accent' : 'text-contrast/35'
                    }`}
                  />
                  <div className="text-center">
                    <p
                      className={`font-body font-semibold text-sm leading-tight transition-colors duration-200 ${
                        selected ? 'text-contrast' : 'text-contrast/50'
                      }`}
                    >
                      {label}
                    </p>
                    <p
                      className={`font-body text-xs mt-0.5 transition-colors duration-200 ${
                        selected ? 'text-accent' : 'text-contrast/30'
                      }`}
                    >
                      {sublabel}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      />

      {/* Informativo por método */}
      <MethodInfoWatcher control={form.control} />
    </div>
  )
}

function MethodInfoWatcher({ control }: { control: Control<CheckoutFormData> }) {
  const method = useWatch({ control, name: 'paymentMethod' })
  return <MethodInfo method={method} />
}

function MethodInfo({ method }: { method: PaymentMethod }) {
  if (method === 'pix') {
    return (
      <div className="mt-4 p-4 bg-accent/5 border border-accent/15 rounded-xl">
        <p className="font-body text-sm text-contrast/70 leading-relaxed">
          <span className="font-semibold text-contrast">Como funciona:</span> Após confirmar o pedido,
          um QR Code Pix será gerado. Você terá até 24 horas para realizar o pagamento. O acesso é
          liberado automaticamente após a confirmação.
        </p>
      </div>
    )
  }

  if (method === 'boleto') {
    return (
      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="font-body text-sm text-contrast/70 leading-relaxed">
          <span className="font-semibold text-contrast">Atenção:</span> O boleto vence em 3 dias
          úteis. O acesso é liberado em até 2 dias úteis após a compensação bancária. Não é possível
          parcelar no boleto.
        </p>
      </div>
    )
  }

  return null
}
