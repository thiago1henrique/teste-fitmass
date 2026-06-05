'use client'

import { createContext, useContext } from 'react'
import type { FitmassEventData } from '@/app/types/events'

export const ActiveEventContext = createContext<FitmassEventData | null>(null)

export function useActiveEvent(): FitmassEventData | null {
  return useContext(ActiveEventContext)
}
