import { Suspense } from 'react'
import PagesLayoutClient from './PagesLayoutClient'
import ChatWidget from '@/app/components/chat/ChatWidget'

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <PagesLayoutClient />
      </Suspense>
      {children}
      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>
    </>
  )
}
