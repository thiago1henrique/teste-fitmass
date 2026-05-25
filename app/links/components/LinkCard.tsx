'use client'
import { ExternalLink } from 'lucide-react'
import { getSocialMeta } from '../socialIcons'

interface LinkCardItem {
  id: string
  title: string
  url: string
  description?: string | null
  icon?: string | null
}

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max) + '…' : text
}

export function LinkCard({ link }: { link: LinkCardItem }) {
  const { icon: Icon } = getSocialMeta(link.url, link.icon)

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 hover:border-accent/30 hover:bg-white/[0.08] transition-all duration-300 cursor-pointer"
    >
      <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.08] text-white">
        <Icon size={20} />
      </div>

      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="font-body font-semibold text-sm text-white group-hover:text-accent transition-colors duration-200 truncate">
          {link.title}
        </span>
        {link.description && (
          <span className="font-body text-xs text-white/50 leading-relaxed">
            {truncate(link.description, 100)}
          </span>
        )}
      </div>

      <ExternalLink
        size={16}
        className="shrink-0 text-white/30 group-hover:text-accent transition-colors duration-200"
      />
    </a>
  )
}
