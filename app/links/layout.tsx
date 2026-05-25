'use client'

import { useEffect } from 'react'

export default function LinksLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const prev = { html: html.style.backgroundColor, body: body.style.backgroundColor }
    html.style.backgroundColor = '#0a0a0a'
    body.style.backgroundColor = '#0a0a0a'
    return () => {
      html.style.backgroundColor = prev.html
      body.style.backgroundColor = prev.body
    }
  }, [])

  return <>{children}</>
}
