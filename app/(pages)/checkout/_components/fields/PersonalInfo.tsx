'use client'

import { Controller, type UseFormReturn } from 'react-hook-form'
import type { CheckoutFormData } from '../../schema'

const INPUT =
  'w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-body text-sm text-contrast placeholder:text-contrast/30 focus:border-accent/60 focus:ring-2 focus:ring-accent/15 outline-none transition-all duration-200'
const INPUT_ERR = 'border-red-300 focus:border-red-400 focus:ring-red-100'
const LABEL = 'block font-body text-[10px] font-semibold uppercase tracking-widest text-contrast/45 mb-2'
const ERR = 'mt-1.5 font-body text-xs text-red-500'

type Props = { form: UseFormReturn<CheckoutFormData> }

function maskCPF(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

function maskPhone(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export default function PersonalInfo({ form }: Props) {
  const { register, control, formState: { errors } } = form

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-7 h-7 rounded-full bg-accent text-white font-body font-bold text-xs flex items-center justify-center shrink-0">
          1
        </div>
        <h2 className="font-title text-lg text-contrast uppercase tracking-wide">
          Informações Pessoais
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nome completo */}
        <div className="sm:col-span-2">
          <label htmlFor="checkout-name" className={LABEL}>Nome completo</label>
          <input
            id="checkout-name"
            type="text"
            autoComplete="name"
            placeholder="Seu nome e sobrenome"
            className={`${INPUT} ${errors.name ? INPUT_ERR : ''}`}
            {...register('name')}
          />
          {errors.name && <p className={ERR}>{errors.name.message}</p>}
        </div>

        {/* E-mail */}
        <div className="sm:col-span-2">
          <label htmlFor="checkout-email" className={LABEL}>E-mail</label>
          <input
            id="checkout-email"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com.br"
            className={`${INPUT} ${errors.email ? INPUT_ERR : ''}`}
            {...register('email')}
          />
          {errors.email && <p className={ERR}>{errors.email.message}</p>}
        </div>

        {/* CPF com máscara */}
        <div>
          <label htmlFor="checkout-cpf" className={LABEL}>CPF</label>
          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <input
                id="checkout-cpf"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="000.000.000-00"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(maskCPF(e.target.value))}
                onBlur={field.onBlur}
                className={`${INPUT} ${errors.cpf ? INPUT_ERR : ''}`}
              />
            )}
          />
          {errors.cpf && <p className={ERR}>{errors.cpf.message}</p>}
        </div>

        {/* Telefone com máscara */}
        <div>
          <label htmlFor="checkout-phone" className={LABEL}>Telefone / WhatsApp</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <input
                id="checkout-phone"
                type="tel"
                autoComplete="tel"
                placeholder="(41) 99999-9999"
                value={field.value ?? ''}
                onChange={(e) => field.onChange(maskPhone(e.target.value))}
                onBlur={field.onBlur}
                className={`${INPUT} ${errors.phone ? INPUT_ERR : ''}`}
              />
            )}
          />
          {errors.phone && <p className={ERR}>{errors.phone.message}</p>}
        </div>
      </div>
    </div>
  )
}
