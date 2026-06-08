'use client'

import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react'
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

// Cache the last parsed result so getSnapshot returns a stable reference when
// localStorage hasn't changed — required by useSyncExternalStore to avoid
// triggering an infinite re-render loop.
let _snapshotCache: { key: string; value: FitmassEventData | null } | null = null

function getSnapshot(): FitmassEventData | null {
  if (typeof window === 'undefined') return null
  const key = `${localStorage.getItem('fitmass_active_event')}::${localStorage.getItem('fitmass_events')}`
  if (_snapshotCache && _snapshotCache.key === key) return _snapshotCache.value
  const value = getActiveEvent()
  _snapshotCache = { key, value }
  return value
}

interface Props {
  children: ReactNode
}

export default function EventThemeProvider({ children }: Props) {
  // Delay exposing event data until after hydration: React uses getSnapshot()
  // (not getServerSnapshot) during the client hydration pass, so it would
  // immediately read localStorage and mismatch the server-rendered null tree.
  // mounted=false keeps the context null on the first render, matching the server.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

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
    <ActiveEventContext.Provider value={mounted ? activeEvent : null}>
      {children}
    </ActiveEventContext.Provider>
  )
}
