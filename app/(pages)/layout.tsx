import { Suspense } from 'react'
import PagesLayoutClient from './PagesLayoutClient'

export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <PagesLayoutClient />
      </Suspense>
      {children}
    </>
  )
}
