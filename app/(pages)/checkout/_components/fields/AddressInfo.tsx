'use client'

import { useState } from 'react'
import { Controller, type UseFormReturn } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import type { CheckoutFormData } from '../../schema'

const INPUT =
  'w-full bg-white border border-gray-200 rounded-xl px-4 py-3 font-body text-sm text-contrast placeholder:text-contrast/30 focus:border-accent/60 focus:ring-2 focus:ring-accent/15 outline-none transition-all duration-200'
const INPUT_ERR = 'border-red-300 focus:border-red-400 focus:ring-red-100'
const LABEL = 'block font-body text-[10px] font-semibold uppercase tracking-widest text-contrast/45 mb-2'
const ERR = 'mt-1.5 font-body text-xs text-red-500'

const BR_STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO',
  'MA','MT','MS','MG','PA','PB','PR','PE','PI',
  'RJ','RN','RS','RO','RR','SC','SP','SE','TO',
]

type ViaCEPResponse = {
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
  erro?: boolean
}

type Props = { form: UseFormReturn<CheckoutFormData> }

function maskCEP(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 8)
  if (d.length <= 5) return d
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

export default function AddressInfo({ form }: Props) {
  const [cepLoading, setCepLoading] = useState(false)
  const [cepError, setCepError] = useState('')

  const { register, control, setValue, formState: { errors } } = form

  async function lookupCEP(cep: string) {
    const digits = cep.replace(/\D/g, '')
    if (digits.length !== 8) return

    setCepLoading(true)
    setCepError('')
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data: ViaCEPResponse = await res.json()
      if (data.erro) {
        setCepError('CEP não encontrado')
      } else {
        // shouldDirty: true garante que o valor entra no store interno
        // independente do modo de renderização do React
        const opts = { shouldDirty: true, shouldTouch: true, shouldValidate: false } as const
        setValue('street', data.logradouro ?? '', opts)
        setValue('neighborhood', data.bairro ?? '', opts)
        setValue('city', data.localidade ?? '', opts)
        setValue('state', data.uf ?? '', opts)
      }
    } catch {
      setCepError('Não foi possível buscar o CEP')
    } finally {
      setCepLoading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-7 h-7 rounded-full bg-accent text-white font-body font-bold text-xs flex items-center justify-center shrink-0">
          2
        </div>
        <h2 className="font-title text-lg text-contrast uppercase tracking-wide">
          Endereço de Cobrança
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">

        {/* CEP */}
        <div className="sm:col-span-2">
          <label htmlFor="checkout-zip" className={LABEL}>CEP</label>
          <div className="relative">
            <Controller
              name="zipCode"
              control={control}
              render={({ field }) => (
                <input
                  id="checkout-zip"
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="00000-000"
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const masked = maskCEP(e.target.value)
                    field.onChange(masked)
                    lookupCEP(masked)
                  }}
                  onBlur={field.onBlur}
                  className={`${INPUT} pr-10 ${errors.zipCode ? INPUT_ERR : ''}`}
                />
              )}
            />
            {cepLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent animate-spin" />
            )}
          </div>
          {errors.zipCode && <p className={ERR}>{errors.zipCode.message}</p>}
          {cepError && !errors.zipCode && <p className={ERR}>{cepError}</p>}
        </div>

        {/* Rua — Controller para garantir que setValue seja lido na validação */}
        <div className="sm:col-span-4">
          <label htmlFor="checkout-street" className={LABEL}>Rua / Logradouro</label>
          <Controller
            name="street"
            control={control}
            render={({ field }) => (
              <input
                id="checkout-street"
                type="text"
                autoComplete="address-line1"
                placeholder="Nome da rua"
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                className={`${INPUT} ${errors.street ? INPUT_ERR : ''}`}
              />
            )}
          />
          {errors.street && <p className={ERR}>{errors.street.message}</p>}
        </div>

        {/* Número — usuário digita, register é suficiente */}
        <div className="sm:col-span-2">
          <label htmlFor="checkout-number" className={LABEL}>Número</label>
          <input
            id="checkout-number"
            type="text"
            autoComplete="address-line2"
            placeholder="123"
            className={`${INPUT} ${errors.number ? INPUT_ERR : ''}`}
            {...register('number')}
          />
          {errors.number && <p className={ERR}>{errors.number.message}</p>}
        </div>

        {/* Complemento */}
        <div className="sm:col-span-4">
          <label htmlFor="checkout-complement" className={LABEL}>
            Complemento{' '}
            <span className="normal-case text-contrast/30 tracking-normal">(opcional)</span>
          </label>
          <input
            id="checkout-complement"
            type="text"
            autoComplete="address-line3"
            placeholder="Apto, sala, bloco…"
            className={INPUT}
            {...register('complement')}
          />
        </div>

        {/* Bairro — Controller */}
        <div className="sm:col-span-3">
          <label htmlFor="checkout-neighborhood" className={LABEL}>Bairro</label>
          <Controller
            name="neighborhood"
            control={control}
            render={({ field }) => (
              <input
                id="checkout-neighborhood"
                type="text"
                placeholder="Bairro"
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                className={`${INPUT} ${errors.neighborhood ? INPUT_ERR : ''}`}
              />
            )}
          />
          {errors.neighborhood && <p className={ERR}>{errors.neighborhood.message}</p>}
        </div>

        {/* Cidade — Controller */}
        <div className="sm:col-span-3">
          <label htmlFor="checkout-city" className={LABEL}>Cidade</label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <input
                id="checkout-city"
                type="text"
                autoComplete="address-level2"
                placeholder="Curitiba"
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                className={`${INPUT} ${errors.city ? INPUT_ERR : ''}`}
              />
            )}
          />
          {errors.city && <p className={ERR}>{errors.city.message}</p>}
        </div>

        {/* Estado — Controller (select controlado para setValue funcionar corretamente) */}
        <div className="sm:col-span-2">
          <label htmlFor="checkout-state" className={LABEL}>Estado (UF)</label>
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <select
                id="checkout-state"
                autoComplete="address-level1"
                value={field.value ?? ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                className={`${INPUT} cursor-pointer ${errors.state ? INPUT_ERR : ''}`}
              >
                <option value="">UF</option>
                {BR_STATES.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            )}
          />
          {errors.state && <p className={ERR}>{errors.state.message}</p>}
        </div>

      </div>
    </div>
  )
}
