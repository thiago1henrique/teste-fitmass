import { Suspense } from 'react'
import PagesLayoutClient from './PagesLayoutClient'
import ChatWidget from '@/app/components/chat/ChatWidget'
import EventThemeProvider from '@/app/components/events/EventThemeProvider'

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <EventThemeProvider>
      <Suspense>
        <PagesLayoutClient />
      </Suspense>
      {children}
      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>
    </EventThemeProvider>
  )
}
