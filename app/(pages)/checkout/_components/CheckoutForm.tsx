'use client'

import { useState, useTransition, useEffect } from 'react'
import { useForm, useWatch, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ChevronLeft, ShieldCheck, Lock, AlertCircle, Loader2,
  CheckCircle2, Copy, Check, ExternalLink, QrCode,
} from 'lucide-react'
import Link from 'next/link'
import { checkoutSchema, type CheckoutFormData } from '../schema'
import type { CheckoutResult } from '../actions'
import PersonalInfo from './fields/PersonalInfo'
import AddressInfo from './fields/AddressInfo'
import PaymentSelector from './fields/PaymentSelector'
import CreditCardInfo from './fields/CreditCardInfo'
import OrderSummary, { type PlanDetails } from './OrderSummary'

type Props = { plan: PlanDetails }

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

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 font-body font-semibold text-sm px-5 py-2.5 rounded-xl border-2 border-accent text-accent hover:bg-accent hover:text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copied ? 'Copiado!' : label}
    </button>
  )
}

function SuccessWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-[price-fade-in_0.4s_ease-out]">
        {children}
        <div className="text-center mt-8">
          <a
            href="/planos"
            className="inline-flex items-center gap-2 font-body text-sm text-contrast/40 hover:text-accent transition-colors duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar aos Planos
          </a>
        </div>
      </div>
    </div>
  )
}

function CreditCardSuccess({ message }: { message: string }) {
  return (
    <SuccessWrapper>
      <div className="text-center">
        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-accent" />
        </div>
        <h2 className="font-title text-4xl text-contrast uppercase tracking-wide mb-3">
          Pedido Recebido!
        </h2>
        <p className="font-body text-contrast/60 leading-relaxed">{message}</p>
      </div>
    </SuccessWrapper>
  )
}

function PixSuccess({ qrCode, qrCodeUrl }: { qrCode: string; qrCodeUrl: string }) {
  const isImageUrl = qrCodeUrl.startsWith('http') || qrCodeUrl.startsWith('data:image')
  return (
    <SuccessWrapper>
      <div className="text-center">
        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <QrCode className="w-10 h-10 text-accent" />
        </div>
        <h2 className="font-title text-4xl text-contrast uppercase tracking-wide mb-2">
          Pague com Pix
        </h2>
        <p className="font-body text-contrast/55 text-sm mb-6">
          Escaneie o QR Code no app do seu banco ou copie o código abaixo.
        </p>

        {isImageUrl && (
          <div className="flex justify-center mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrCodeUrl}
              alt="QR Code Pix"
              width={220}
              height={220}
              className="rounded-2xl border border-gray-100 shadow-sm"
            />
          </div>
        )}

        {qrCode && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5 text-left">
            <p className="font-body text-[10px] font-semibold uppercase tracking-widest text-contrast/35 mb-2">
              Pix Copia e Cola
            </p>
            <p className="font-mono text-xs text-contrast/60 break-all leading-relaxed line-clamp-3">
              {qrCode}
            </p>
          </div>
        )}

        <div className="flex justify-center">
          <CopyButton text={qrCode} label="Copiar código Pix" />
        </div>

        <p className="font-body text-xs text-contrast/35 mt-5">
          O QR Code expira em 24 horas.
        </p>
      </div>
    </SuccessWrapper>
  )
}

function BoletoSuccess({ boletoUrl, line }: { boletoUrl: string; line: string }) {
  return (
    <SuccessWrapper>
      <div className="text-center">
        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-accent" />
        </div>
        <h2 className="font-title text-4xl text-contrast uppercase tracking-wide mb-2">
          Boleto Gerado!
        </h2>
        <p className="font-body text-contrast/55 text-sm mb-6">
          Pague o boleto até a data de vencimento (3 dias úteis).
        </p>

        {line && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5 text-left">
            <p className="font-body text-[10px] font-semibold uppercase tracking-widest text-contrast/35 mb-2">
              Linha Digitável
            </p>
            <p className="font-mono text-xs text-contrast/60 break-all leading-relaxed">
              {line}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {line && <CopyButton text={line} label="Copiar linha digitável" />}
          {boletoUrl && (
            <a
              href={boletoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body font-semibold text-sm px-5 py-2.5 rounded-xl bg-accent text-white hover:bg-accent/90 transition-colors duration-200"
            >
              <ExternalLink className="w-4 h-4" />
              Visualizar Boleto
            </a>
          )}
        </div>

        <p className="font-body text-xs text-contrast/35 mt-5">
          Você também receberá o boleto no e-mail cadastrado.
        </p>
      </div>
    </SuccessWrapper>
  )
}

export default function CheckoutForm({ plan }: Props) {
  const [isPending, startTransition] = useTransition()
  const [submitResult, setSubmitResult] = useState<CheckoutResult | null>(null)
  const [errorCount, setErrorCount] = useState(0)
  const [publicKey, setPublicKey] = useState<string | null>(null)

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: 'credit_card', installments: '1' },
    mode: 'onTouched',
  })

  useEffect(() => {
    fetch('/api/checkout/public-key')
      .then((res) => res.json())
      .then((data) => {
        if (data.publicKey) {
          console.log('[CheckoutForm] ✓ Public key loaded successfully from /api/checkout/public-key')
          setPublicKey(data.publicKey)
        } else if (data.error) {
          console.error('[CheckoutForm] ✗ Server error:', data.error)
        }
      })
      .catch((err) => {
        console.error('[CheckoutForm] ✗ Failed to fetch public key:', err)
      })
  }, [])

  useEffect(() => {
    if (submitResult?.success) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [submitResult?.success])

  const paymentMethod = useWatch({ control: form.control, name: 'paymentMethod' }) ?? 'credit_card'
  const installmentsRaw = useWatch({ control: form.control, name: 'installments' })
  const installments = parseInt(installmentsRaw ?? '1', 10)

  function onSubmit(data: CheckoutFormData) {
    setErrorCount(0)
    setSubmitResult(null)
    startTransition(async () => {
      try {
        let cardToken: string | undefined

        if (data.paymentMethod === 'credit_card') {
          if (!publicKey) {
            console.error('[CheckoutForm] ✗ Public key not loaded')
            setSubmitResult({ success: false, error: 'Configuração de pagamento ausente. Contate o suporte.' })
            return
          }

          console.log('[CheckoutForm] ✓ Tokenizing card with public key')
          const [expMonthStr, expYearStr] = (data.cardExpiry ?? '').split('/')
          const tokenRes = await fetch(
            `https://api.pagar.me/core/v5/tokens?appId=${publicKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'card',
                card: {
                  number: (data.cardNumber ?? '').replace(/\D/g, ''),
                  holder_name: (data.cardName ?? '').toUpperCase(),
                  exp_month: parseInt(expMonthStr, 10),
                  exp_year: parseInt(expYearStr, 10),
                  cvv: data.cardCvv,
                },
              }),
            },
          )

          if (!tokenRes.ok) {
            const errBody = await tokenRes.text()
            console.error('[CheckoutForm] ✗ Tokenization failed:', errBody)
            setSubmitResult({ success: false, error: 'Dados do cartão inválidos. Verifique os dados e tente novamente.' })
            return
          }

          const tokenData = await tokenRes.json()
          cardToken = tokenData.id
          console.log('[CheckoutForm] ✓ Card tokenized successfully')
        }

        // Strip raw card fields — only token + installments reach the server
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { cardNumber, cardName, cardExpiry, cardCvv, ...nonCardData } = data
        const res = await fetch('/api/checkout/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ raw: nonCardData, planId: plan.id, planPrice: plan.price, planName: plan.name, cardToken }),
        })
        const result: CheckoutResult = await res.json()
        setSubmitResult(result)
      } catch (err) {
        console.error('[CheckoutForm] erro inesperado:', err)
        setSubmitResult({ success: false, error: 'Erro de conexão. Verifique sua internet e tente novamente.' })
      }
    })
  }

  function onInvalid(errors: FieldErrors<CheckoutFormData>) {
    const count = Object.keys(errors).length
    setErrorCount(count)
    scrollToFirstError(errors)
  }

  /* ── Telas de sucesso ──────────────────────────────────────── */
  if (submitResult?.success) {
    if (submitResult.paymentMethod === 'pix') {
      return <PixSuccess qrCode={submitResult.qrCode} qrCodeUrl={submitResult.qrCodeUrl} />
    }
    if (submitResult.paymentMethod === 'boleto') {
      return <BoletoSuccess boletoUrl={submitResult.boletoUrl} line={submitResult.line} />
    }
    return <CreditCardSuccess message={submitResult.message} />
  }

  /* ── Formulário principal ──────────────────────────────────── */
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

              {/* Erro de validação */}
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
                  <p className="font-body text-sm text-red-700">{submitResult.error}</p>
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
