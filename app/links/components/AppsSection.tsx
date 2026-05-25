'use client'
import { useState } from 'react'
import { Monitor } from 'lucide-react'
import { LinkCard } from './LinkCard'

interface LinkCardItem {
  id: string
  title: string
  url: string
  description?: string | null
  icon?: string | null
}

export interface CategoryNode {
  id: string
  name: string
  order: number
  hasTabs?: boolean | null
  disabled?: boolean | null
  disabledLabel?: string | null
  children: CategoryNode[]
  links: LinkCardItem[]
}

export function AppsSection({ category }: { category: CategoryNode }) {
  const firstActive = category.children.find((c) => !c.disabled) ?? category.children[0]
  const [activeId, setActiveId] = useState(firstActive?.id ?? '')

  const activeTab = category.children.find((c) => c.id === activeId)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-2xl p-1">
        {category.children.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveId(tab.id)}
            className={`flex-1 text-xs font-body font-semibold py-2 px-3 rounded-xl transition-all duration-200 ${
              activeId === tab.id
                ? 'bg-accent text-black'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {activeTab?.disabled ? (
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 opacity-40 cursor-not-allowed select-none">
          <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.08] text-white">
            <Monitor size={20} />
          </div>
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="font-body font-semibold text-sm text-white truncate">
              {activeTab.name}
            </span>
          </div>
          <span className="shrink-0 font-body text-xs font-semibold text-white/50 bg-white/10 px-3 py-1 rounded-full">
            {activeTab.disabledLabel ?? 'Em breve'}
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {(activeTab?.links ?? []).map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
      )}
    </div>
  )
}
