'use client'

import { useState, useTransition } from 'react'
import { useForm, useWatch, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, ShieldCheck, Lock, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { checkoutSchema, type CheckoutFormData } from '../schema'
import { processCheckout } from '../actions'
import PersonalInfo from './fields/PersonalInfo'
import AddressInfo from './fields/AddressInfo'
import PaymentSelector from './fields/PaymentSelector'
import CreditCardInfo from './fields/CreditCardInfo'
import OrderSummary, { type PlanDetails } from './OrderSummary'

type Props = { plan: PlanDetails }

// Campos do formulário mapeados para seus IDs no DOM
const FIELD_TO_ID: Partial<Record<keyof CheckoutFormData, string>> = {
  name: 'checkout-name',
  email: 'checkout-email',
  cpf: 'checkout-cpf',
  phone: 'checkout-phone',
  zipCode: 'checkout-zip',
  street: 'checkout-street',
  number: 'checkout-number',
  neighborhood: 'checkout-neighborhood',
  city: 'checkout-city',
  state: 'checkout-state',
  cardNumber: 'card-number',
  cardName: 'card-name',
  cardExpiry: 'card-expiry',
  cardCvv: 'card-cvv',
}

function scrollToFirstError(errors: FieldErrors<CheckoutFormData>) {
  const firstKey = Object.keys(errors)[0] as keyof CheckoutFormData | undefined
  if (!firstKey) return
  const id = FIELD_TO_ID[firstKey]
  const el = id
    ? document.getElementById(id)
    : (document.querySelector(`[name="${firstKey}"]`) as HTMLElement | null)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.focus({ preventScroll: true })
  }
}

export default function CheckoutForm({ plan }: Props) {
  const [isPending, startTransition] = useTransition()
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)
  const [errorCount, setErrorCount] = useState(0)

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: 'credit_card', installments: '1' },
    mode: 'onTouched',
  })

  const paymentMethod = useWatch({ control: form.control, name: 'paymentMethod' }) ?? 'credit_card'
  const installmentsRaw = useWatch({ control: form.control, name: 'installments' })
  const installments = parseInt(installmentsRaw ?? '1', 10)

  function onSubmit(data: CheckoutFormData) {
    setErrorCount(0)
    setSubmitResult(null)
    startTransition(async () => {
      try {
        const result = await processCheckout(data, plan.id, plan.price, plan.name)
        setSubmitResult({ success: result.success, message: result.success ? result.message : result.error })
      } catch (err) {
        console.error('[CheckoutForm] erro inesperado:', err)
        setSubmitResult({ success: false, message: 'Erro de conexão. Verifique sua internet e tente novamente.' })
      }
    })
  }

  function onInvalid(errors: FieldErrors<CheckoutFormData>) {
    const count = Object.keys(errors).length
    setErrorCount(count)
    scrollToFirstError(errors)
  }

  /* ── Estado de sucesso ─────────────────────────────────── */
  if (submitResult?.success) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <div className="text-center max-w-md animate-[price-fade-in_0.4s_ease-out]">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-accent" />
          </div>
          <h2 className="font-title text-4xl text-contrast uppercase tracking-wide mb-3">
            Pedido Recebido!
          </h2>
          <p className="font-body text-contrast/60 leading-relaxed mb-8">{submitResult.message}</p>
          <Link
            href="/planos"
            className="inline-flex items-center gap-2 font-body font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-xl bg-accent text-white hover:bg-accent/90 transition-colors duration-200"
          >
            Voltar aos Planos
          </Link>
        </div>
      </div>
    )
  }

  /* ── Formulário principal ──────────────────────────────── */
  return (
    <div className="min-h-screen bg-surface">
      {/* Barra superior fixa */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Link
            href="/planos"
            className="flex items-center gap-1.5 font-body text-sm text-contrast/50 hover:text-accent transition-colors duration-200 group shrink-0"
          >
            <ChevronLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Voltar aos planos</span>
            <span className="sm:hidden">Voltar</span>
          </Link>
          <span className="font-title text-xl text-contrast uppercase tracking-widest">Fitmass</span>
          <span className="flex items-center gap-1.5 font-body text-xs text-contrast/35 shrink-0">
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Compra 100% segura</span>
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="font-title text-3xl md:text-4xl text-contrast uppercase tracking-wide">
            Finalizar Assinatura
          </h1>
          <p className="font-body text-sm text-contrast/45 mt-1.5">
            Plano <span className="font-semibold text-accent">{plan.name}</span>
            {' · preencha seus dados para continuar'}
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 items-start">

            {/* Coluna esquerda */}
            <div className="space-y-5">
              {/* Resumo mobile */}
              <div className="lg:hidden">
                <OrderSummary plan={plan} paymentMethod={paymentMethod} installments={installments} mobile />
              </div>

              <PersonalInfo form={form} />
              <AddressInfo form={form} />
              <PaymentSelector form={form} />
              {paymentMethod === 'credit_card' && <CreditCardInfo form={form} />}

              {/* Erro de validação — banner junto ao botão */}
              {errorCount > 0 && !isPending && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="font-body text-sm text-red-700">
                    {errorCount === 1
                      ? 'Há 1 campo com erro. A página rolou até ele para você corrigir.'
                      : `Há ${errorCount} campos com erros. Corrija os campos destacados em vermelho acima.`}
                  </p>
                </div>
              )}

              {/* Erro do servidor */}
              {submitResult && !submitResult.success && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="font-body text-sm text-red-700">{submitResult.message}</p>
                </div>
              )}

              {/* CTA */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="
                    w-full flex items-center justify-center gap-2.5
                    bg-accent text-white font-body font-bold uppercase tracking-widest text-sm
                    px-8 py-4 rounded-xl
                    hover:bg-accent/90 active:scale-[0.98]
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
                    transition-all duration-200 cursor-pointer
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2
                  "
                >
                  {isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Processando…</>
                  ) : (
                    <><ShieldCheck className="w-4 h-4" />Finalizar Assinatura</>
                  )}
                </button>

                <div className="flex items-center justify-center gap-6">
                  <span className="flex items-center gap-1.5 font-body text-xs text-contrast/35">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                    Pagamento seguro
                  </span>
                  <span className="flex items-center gap-1.5 font-body text-xs text-contrast/35">
                    <Lock className="w-3.5 h-3.5 text-accent" />
                    SSL 256 bits
                  </span>
                </div>

                <p className="text-center font-body text-xs text-contrast/30 leading-relaxed">
                  Ao finalizar, você concorda com os{' '}
                  <Link href="/privacidade" className="underline underline-offset-2 hover:text-accent transition-colors duration-200">
                    Termos de Uso e Política de Privacidade
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* Coluna direita — desktop */}
            <div className="hidden lg:block sticky top-20">
              <OrderSummary plan={plan} paymentMethod={paymentMethod} installments={installments} />
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}
