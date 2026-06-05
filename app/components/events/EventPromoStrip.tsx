'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'
import { useActiveEvent } from './ActiveEventContext'
import EventCountdown from './EventCountdown'

function getDismissedKey(eventId: string) {
  return `promo_dismissed_${eventId}`
}

function subscribeDismissed(callback: () => void) {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

function getDismissedSnapshot(eventId: string | undefined): boolean {
  if (!eventId) return false
  return sessionStorage.getItem(getDismissedKey(eventId)) === '1'
}

export default function EventPromoStrip() {
  const event = useActiveEvent()

  const dismissed = useSyncExternalStore(
    subscribeDismissed,
    () => getDismissedSnapshot(event?.id),
    () => false, // SSR snapshot — always show until client hydrates
  )

  if (!event || dismissed) return null

  const strip = event.promoStrip

  function dismiss() {
    sessionStorage.setItem(getDismissedKey(event!.id), '1')
    // Dispatch a storage event so useSyncExternalStore re-reads
    window.dispatchEvent(new StorageEvent('storage'))
  }

  return (
    <div
      role="banner"
      className="relative flex w-full items-center justify-center gap-3 px-10 py-2.5 text-sm"
      style={{ backgroundColor: strip.bgColor, color: strip.textColor }}
    >
      <span className="text-center leading-snug">{strip.text}</span>

      <Link
        href={strip.link}
        className="shrink-0 rounded-full border px-3 py-0.5 text-xs font-semibold transition-opacity hover:opacity-80"
        style={{ borderColor: strip.textColor, color: strip.textColor }}
      >
        {strip.linkText} →
      </Link>

      {strip.countdownEnd && (
        <EventCountdown endDate={strip.countdownEnd} textColor={strip.textColor} />
      )}

      <button
        onClick={dismiss}
        aria-label="Fechar faixa promocional"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 opacity-70 transition-opacity hover:opacity-100"
        style={{ color: strip.textColor }}
      >
        <X size={14} />
      </button>
    </div>
  )
}
