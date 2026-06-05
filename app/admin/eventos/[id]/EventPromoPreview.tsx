'use client'

import { X } from 'lucide-react'
import type { FitmassEventData } from '@/app/types/events'
import { rgbToHex } from '@/app/lib/eventTemplates'
import EventCountdown from '@/app/components/events/EventCountdown'

interface Props {
  form: FitmassEventData
}

export default function EventPromoPreview({ form }: Props) {
  const strip = form.promoStrip
  const accentHex = rgbToHex(form.theme.accent)
  const surfaceHex = rgbToHex(form.theme.surface)

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const countdownDate = strip.countdownEnd || tomorrow.toISOString()

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
        <p className="font-title uppercase tracking-wide text-contrast text-sm mb-4">Preview ao Vivo</p>

        {/* Faixa promo */}
        <div className="mb-4">
          <p className="label-field mb-2">Faixa Promocional</p>
          <div
            className="relative flex items-center justify-center gap-2 rounded-xl px-8 py-2.5 text-sm"
            style={{ backgroundColor: strip.bgColor || '#333', color: strip.textColor || '#fff' }}
          >
            <span className="text-center text-xs leading-snug truncate max-w-[160px]">{strip.text || 'Texto da faixa'}</span>
            <span
              className="shrink-0 rounded-full border px-2 py-0.5 text-xs font-semibold"
              style={{ borderColor: strip.textColor || '#fff', color: strip.textColor || '#fff' }}
            >
              {strip.linkText || 'Ver mais'} →
            </span>
            <EventCountdown endDate={countdownDate} textColor={strip.textColor || '#fff'} />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 opacity-60">
              <X size={12} />
            </span>
          </div>
        </div>

        {/* Cores do tema */}
        <div className="mb-4">
          <p className="label-field mb-2">Tema de Cores</p>
          <div className="flex gap-2">
            <div className="flex flex-col items-center gap-1">
              <span
                className="h-8 w-8 rounded-lg border border-gray-100 shadow-sm"
                style={{ backgroundColor: accentHex }}
              />
              <span className="text-xs text-contrast/40 font-mono">accent</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span
                className="h-8 w-8 rounded-lg border border-gray-100 shadow-sm"
                style={{ backgroundColor: rgbToHex(form.theme.secondary) }}
              />
              <span className="text-xs text-contrast/40 font-mono">secondary</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span
                className="h-8 w-8 rounded-lg border border-gray-100 shadow-sm"
                style={{ backgroundColor: surfaceHex }}
              />
              <span className="text-xs text-contrast/40 font-mono">surface</span>
            </div>
          </div>
        </div>

        {/* Simulação de botão com cor de evento */}
        <div className="mb-4">
          <p className="label-field mb-2">Simulação de Botão</p>
          <div
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white"
            style={{ backgroundColor: accentHex }}
          >
            Assinar Agora
          </div>
        </div>

        {/* Simulação de fundo de seção */}
        <div>
          <p className="label-field mb-2">Fundo de Seção</p>
          <div
            className="rounded-xl border border-gray-100 p-4 text-center"
            style={{ backgroundColor: surfaceHex }}
          >
            <p className="text-xs font-body text-contrast/50">Seção com --event-surface</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl bg-surface border border-gray-100 p-4">
        <p className="font-body text-xs text-contrast/60 leading-relaxed">
          <strong className="text-contrast/80">Como funciona:</strong> As cores do tema sobrepõem os tokens padrão da marca via CSS. Componentes que usam <code className="font-mono text-accent">var(--event-accent)</code> refletem automaticamente a cor escolhida.
        </p>
      </div>
    </div>
  )
}
