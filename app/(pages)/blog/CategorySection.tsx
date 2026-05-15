'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Post } from './BlogClient'

const CAT_PAGE_SIZE = 5

function fmt(date: Date) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function CatListCard({ post }: { post: Post }) {
  const date = post.publishedAt ?? post.createdAt
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex gap-4 py-4 border-b border-gray-100 last:border-0"
      aria-label={`Ler: ${post.title}`}
    >
      <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
        {post.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-secondary/15 to-secondary/5 flex items-center justify-center">
            <svg className="w-5 h-5 text-secondary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-col min-w-0 flex-1 justify-between py-0.5">
        <h3 className="font-body text-sm font-semibold text-contrast leading-snug line-clamp-2 group-hover:text-secondary transition-colors">
          {post.title}
        </h3>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="font-body text-xs text-contrast/50">{post.author.name}</span>
          <span className="w-1 h-1 rounded-full bg-contrast/20" aria-hidden="true" />
          <time className="font-body text-xs text-contrast/40">{fmt(date)}</time>
        </div>
      </div>
    </Link>
  )
}

interface CategorySectionProps {
  name: string
  posts: Post[]
}

export default function CategorySection({ name, posts }: CategorySectionProps) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(posts.length / CAT_PAGE_SIZE)
  const slice = posts.slice((page - 1) * CAT_PAGE_SIZE, page * CAT_PAGE_SIZE)

  return (
    <section aria-labelledby={`cat-heading-${name}`} className="py-8 border-t border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="w-1 h-5 bg-secondary rounded-full shrink-0" aria-hidden="true" />
          <h2
            id={`cat-heading-${name}`}
            className="font-body text-xs font-bold uppercase tracking-widest text-contrast/60"
          >
            {name}
          </h2>
        </div>
        <Link
          href={`/blog?category=${encodeURIComponent(name)}`}
          className="font-body text-[11px] font-semibold uppercase tracking-widest text-secondary hover:text-secondary/70 transition-colors flex items-center gap-1"
        >
          Ver todos
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div>
        {slice.map((post) => (
          <CatListCard key={post.id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-gray-100">
          {page > 1 && (
            <button
              onClick={() => setPage((p) => p - 1)}
              className="flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-widest text-contrast/50 hover:text-accent transition-colors px-3 py-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>
          )}

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | '…')[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('…')
                acc.push(p)
                return acc
              }, [])
              .map((p, i) =>
                p === '…' ? (
                  <span key={`ellipsis-${i}`} className="font-body text-xs text-contrast/30 px-1">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded font-body text-xs font-bold transition-colors ${
                      p === page
                        ? 'bg-accent text-white'
                        : 'text-contrast/50 hover:text-accent hover:bg-accent/10'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
          </div>

          {page < totalPages && (
            <button
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-widest text-contrast/50 hover:text-accent transition-colors px-3 py-2"
            >
              Próxima
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </section>
  )
}
