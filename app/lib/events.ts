'use client'

import type { FitmassEventData } from '@/app/types/events'

const EVENTS_KEY = 'fitmass_events'
const ACTIVE_ID_KEY = 'fitmass_active_event'

// Custom event dispatched after every localStorage write — same-tab listeners
export const EVENTS_SYNC_EVENT = 'fitmass-events-sync'

function notifySameTab(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(EVENTS_SYNC_EVENT))
  }
}

export function isEventWithinRange(event: FitmassEventData): boolean {
  const now = new Date()
  const start = new Date(event.startDate)
  const end = new Date(event.endDate)
  end.setHours(23, 59, 59, 999)
  return now >= start && now <= end
}

export function getEvents(): FitmassEventData[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(EVENTS_KEY)
    return raw ? (JSON.parse(raw) as FitmassEventData[]) : []
  } catch {
    return []
  }
}

export function saveEvents(events: FitmassEventData[]): void {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
}

export function getActiveEvent(): FitmassEventData | null {
  if (typeof window === 'undefined') return null
  try {
    const activeId = localStorage.getItem(ACTIVE_ID_KEY)
    if (!activeId) return null
    const events = getEvents()
    const event = events.find((e) => e.id === activeId && e.active) ?? null
    if (!event || !isEventWithinRange(event)) return null
    return event
  } catch {
    return null
  }
}

export function saveEvent(event: FitmassEventData): void {
  const events = getEvents()
  const idx = events.findIndex((e) => e.id === event.id)
  if (idx >= 0) {
    events[idx] = event
  } else {
    events.push(event)
  }
  saveEvents(events)
  notifySameTab()
}

export function deleteEvent(id: string): void {
  const events = getEvents().filter((e) => e.id !== id)
  saveEvents(events)
  const activeId = localStorage.getItem(ACTIVE_ID_KEY)
  if (activeId === id) {
    deactivateEvent()
  } else {
    notifySameTab()
  }
}

export function activateEvent(id: string): void {
  const events = getEvents().map((e) => ({ ...e, active: e.id === id }))
  saveEvents(events)
  localStorage.setItem(ACTIVE_ID_KEY, id)
  notifySameTab()
}

export function deactivateEvent(): void {
  const events = getEvents().map((e) => ({ ...e, active: false }))
  saveEvents(events)
  localStorage.removeItem(ACTIVE_ID_KEY)
  notifySameTab()
}

export function generateId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}
