'use client'

import { useEffect, useState } from 'react'

function readConsent(): string | null {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(/(?:^|; )fitmass_consent=([^;]*)/)
  return m ? decodeURIComponent(m[1]) : null
}

function writeConsent(value: string) {
  const maxAge = 365 * 24 * 60 * 60
  document.cookie = `fitmass_consent=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; samesite=lax`
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!readConsent()) setVisible(true)
  }, [])

  if (!visible) return null

  const accept = (value: 'all' | 'necessary') => {
    writeConsent(value)
    setVisible(false)
  }

  return (
    <div
      role="dialog"
      aria-label="Preferências de cookies"
      className="fixed bottom-0 left-0 right-0 z-50 bg-contrast border-t-2 border-accent shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Texto */}
        <div className="flex-1 min-w-0 flex items-start gap-3">
          <svg
            className="w-5 h-5 text-accent shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
          </svg>
          <p className="font-body text-sm text-white/80 leading-relaxed">
            <span className="font-semibold text-white">Sua privacidade importa.</span>{' '}
            Usamos cookies essenciais para o funcionamento do site e, com sua permissão, cookies
            de análise para melhorar sua experiência.{' '}
            <span className="text-white/50">Em conformidade com a LGPD.</span>
          </p>
        </div>

        {/* Botões */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          <button
            onClick={() => accept('necessary')}
            className="font-body text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-white transition-colors px-4 py-2 border border-white/20 rounded hover:border-white/40 whitespace-nowrap"
          >
            Somente Necessários
          </button>
          <button
            onClick={() => accept('all')}
            className="font-body text-xs font-bold uppercase tracking-widest bg-accent text-white px-5 py-2 rounded hover:bg-accent/90 transition-colors whitespace-nowrap"
          >
            Aceitar Todos
          </button>
        </div>
      </div>
    </div>
  )
}
