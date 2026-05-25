import type { ReactNode } from 'react'

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
      {children}
    </span>
  )
}
