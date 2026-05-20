'use client'

import { useState } from 'react'
import { Controller, type UseFormReturn } from 'react-hook-form'
import { Lock } from 'lucide-react'
import type { CheckoutFormData } from '../../schema'
import CardVisual from '../CardVisual'

const INPUT =
  'w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-body text-sm text-contrast placeholder:text-contrast/30 focus:border-accent/60 focus:ring-2 focus:ring-accent/15 outline-none transition-all duration-200'
const INPUT_ERR = 'border-red-300 focus:border-red-400 focus:ring-red-100'
const LABEL = 'block font-body text-[10px] font-semibold uppercase tracking-widest text-contrast/45 mb-2'
const ERR = 'mt-1.5 font-body text-xs text-red-500'

type Props = { form: UseFormReturn<CheckoutFormData> }

function maskCardNumber(v: string): string {
  return v
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

function maskExpiry(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 4)
  if (d.length <= 2) return d
  return `${d.slice(0, 2)}/${d.slice(2)}`
}

const INSTALLMENT_OPTIONS = [
  { value: '1', label: '1× sem juros' },
  { value: '2', label: '2× sem juros' },
  { value: '3', label: '3× sem juros' },
  { value: '6', label: '6× sem juros' },
  { value: '12', label: '12× sem juros' },
]

export default function CreditCardInfo({ form }: Props) {
  const [cvvFocused, setCvvFocused] = useState(false)
  const { register, control, formState: { errors } } = form

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-accent text-white font-body font-bold text-xs flex items-center justify-center shrink-0">
            4
          </div>
          <h2 className="font-title text-lg text-contrast uppercase tracking-wide">
            Dados do Cartão
          </h2>
        </div>
        <span className="flex items-center gap-1.5 font-body text-xs text-contrast/35">
          <Lock className="w-3 h-3" />
          Dados criptografados
        </span>
      </div>

      {/* Cartão animado 3D */}
      <div className="mb-6">
        <CardVisual control={control} cvvFocused={cvvFocused} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Número do cartão */}
        <div className="sm:col-span-2">
          <label htmlFor="card-number" className={LABEL}>Número do Cartão</label>
          <Controller
            name="cardNumber"
            control={control}
            render={({ field }) => (
              <input
                id="card-number"
                type="text"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="0000 0000 0000 0000"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(maskCardNumber(e.target.value))}
                onBlur={field.onBlur}
                className={`${INPUT} tracking-widest ${errors.cardNumber ? INPUT_ERR : ''}`}
              />
            )}
          />
          {errors.cardNumber && <p className={ERR}>{errors.cardNumber.message}</p>}
        </div>

        {/* Nome no cartão */}
        <div className="sm:col-span-2">
          <label htmlFor="card-name" className={LABEL}>Nome no Cartão</label>
          <input
            id="card-name"
            type="text"
            autoComplete="cc-name"
            placeholder="NOME COMO NO CARTÃO"
            className={`${INPUT} uppercase ${errors.cardName ? INPUT_ERR : ''}`}
            {...register('cardName', {
              onChange: (e) => {
                e.target.value = e.target.value.toUpperCase()
              },
            })}
          />
          {errors.cardName && <p className={ERR}>{errors.cardName.message}</p>}
        </div>

        {/* Validade */}
        <div>
          <label htmlFor="card-expiry" className={LABEL}>Validade</label>
          <Controller
            name="cardExpiry"
            control={control}
            render={({ field }) => (
              <input
                id="card-expiry"
                type="text"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/AA"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(maskExpiry(e.target.value))}
                onBlur={field.onBlur}
                className={`${INPUT} ${errors.cardExpiry ? INPUT_ERR : ''}`}
              />
            )}
          />
          {errors.cardExpiry && <p className={ERR}>{errors.cardExpiry.message}</p>}
        </div>

        {/* CVV — vira o cartão ao focar */}
        <div>
          <label htmlFor="card-cvv" className={LABEL}>CVV</label>
          <Controller
            name="cardCvv"
            control={control}
            render={({ field }) => (
              <input
                id="card-cvv"
                type="text"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="000"
                maxLength={4}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
                onFocus={() => setCvvFocused(true)}
                onBlur={() => {
                  setCvvFocused(false)
                  field.onBlur()
                }}
                className={`${INPUT} ${errors.cardCvv ? INPUT_ERR : ''}`}
              />
            )}
          />
          {errors.cardCvv && <p className={ERR}>{errors.cardCvv.message}</p>}
        </div>

        {/* Parcelas */}
        <div className="sm:col-span-2">
          <label htmlFor="installments" className={LABEL}>Parcelas</label>
          <select
            id="installments"
            className={`${INPUT} cursor-pointer`}
            {...register('installments')}
          >
            {INSTALLMENT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
