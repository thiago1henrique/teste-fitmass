'use client'

import { useEffect, useSyncExternalStore, type ReactNode } from 'react'
import { getActiveEvent, deactivateEvent, EVENTS_SYNC_EVENT } from '@/app/lib/events'
import { ActiveEventContext } from './ActiveEventContext'
import type { FitmassEventData, FitmassEventThemeColors } from '@/app/types/events'

function makeThemeCss(colors: FitmassEventThemeColors): string {
  const [ar, ag, ab] = colors.accent.trim().split(/\s+/).map(Number)
  const [sr, sg, sb] = colors.secondary.trim().split(/\s+/).map(Number)
  const [ur, ug, ub] = colors.surface.trim().split(/\s+/).map(Number)
  if ([ar, ag, ab, sr, sg, sb, ur, ug, ub].some(isNaN)) return ''
  return `:root{--event-accent:${ar} ${ag} ${ab};--event-secondary:${sr} ${sg} ${sb};--event-surface:${ur} ${ug} ${ub};}`
}

function injectCss(css: string): void {
  let el = document.getElementById('event-theme') as HTMLStyleElement | null
  if (!el) {
    el = document.createElement('style')
    el.id = 'event-theme'
    document.head.appendChild(el)
  }
  el.textContent = css
}

function removeCss(): void {
  document.getElementById('event-theme')?.remove()
}

// useSyncExternalStore subscription — listens to cross-tab (storage) and same-tab (EVENTS_SYNC_EVENT)
function subscribe(callback: () => void): () => void {
  window.addEventListener('storage', callback)
  window.addEventListener(EVENTS_SYNC_EVENT, callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(EVENTS_SYNC_EVENT, callback)
  }
}

// Always reads current localStorage — runs on every render, router-cache-proof
function getSnapshot(): FitmassEventData | null {
  return getActiveEvent()
}

interface Props {
  children: ReactNode
}

export default function EventThemeProvider({ children }: Props) {
  // useSyncExternalStore calls getSnapshot() on every render, so even when
  // Next.js restores this component from the router cache, the data is fresh.
  const activeEvent = useSyncExternalStore(subscribe, getSnapshot, () => null)

  useEffect(() => {
    if (activeEvent) {
      injectCss(makeThemeCss(activeEvent.theme))
    } else {
      removeCss()
    }
  }, [activeEvent])

  // Auto-expire: deactivate event in localStorage when its period ends
  useEffect(() => {
    if (!activeEvent) return
    const end = new Date(activeEvent.endDate)
    end.setHours(23, 59, 59, 999)
    const ms = Math.max(0, end.getTime() - Date.now())
    if (ms <= 0) return
    const timer = setTimeout(() => {
      deactivateEvent()
    }, ms)
    return () => clearTimeout(timer)
  }, [activeEvent])

  return (
    <ActiveEventContext.Provider value={activeEvent}>
      {children}
    </ActiveEventContext.Provider>
  )
}
