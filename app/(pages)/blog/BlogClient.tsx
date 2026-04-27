import Link from 'next/link'
import type { ReactNode } from 'react'

export type Post = {
  id: string
  title: string
  slug: string
  summary: string
  coverUrl: string | null
  publishedAt: Date | null
  createdAt: Date
  categories: string[]
  author: { name: string }
}

const PREDEFINED = ['Saúde', 'Bioimpedância', 'Fitness', 'Tecnologia']

function fmt(date: Date) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function buildUrl(page: number, category: string | null) {
  const params = new URLSearchParams()
  if (page > 1) params.set('page', String(page))
  if (category) params.set('category', category)
  const qs = params.toString()
  return `/blog${qs ? `?${qs}` : ''}`
}

function HeroCard({ post, large }: { post: Post; large?: boolean }) {
  const date = post.publishedAt ?? post.createdAt
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="relative block overflow-hidden rounded-xl group h-full"
      aria-label={`Ler: ${post.title}`}
    >
      {post.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-contrast to-contrast/70" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {post.categories.map((cat) => (
              <span
                key={cat}
                className="inline-block bg-accent text-white font-body text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
        <h2
          className={`font-title text-white uppercase leading-tight ${
            large
              ? 'text-lg md:text-2xl lg:text-[1.65rem] line-clamp-3'
              : 'text-sm md:text-base line-clamp-3'
          }`}
        >
          {post.title}
        </h2>
        {large && (
          <p className="font-body text-sm text-white/70 line-clamp-2 mt-1 hidden md:block">
            {post.summary}
          </p>
        )}
        <time className="font-body text-[10px] text-white/50 mt-1.5 block">{fmt(date)}</time>
      </div>
    </Link>
  )
}

function ListCard({ post }: { post: Post }) {
  const date = post.publishedAt ?? post.createdAt
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex gap-4 py-4 border-b border-gray-100 last:border-0"
      aria-label={`Ler: ${post.title}`}
    >
      <div className="relative w-28 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
        {post.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/15 to-accent/5 flex items-center justify-center">
            <svg className="w-6 h-6 text-accent/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-col min-w-0 flex-1 justify-between py-0.5">
        <div>
          {post.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1">
              {post.categories.map((cat) => (
                <span key={cat} className="font-body text-[10px] font-bold uppercase tracking-widest text-accent">
                  {cat}
                </span>
              ))}
            </div>
          )}
          <h3 className="font-body text-sm font-semibold text-contrast leading-snug line-clamp-2 group-hover:text-accent transition-colors">
            {post.title}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="font-body text-xs text-contrast/50">{post.author.name}</span>
          <span className="w-1 h-1 rounded-full bg-contrast/20" aria-hidden="true" />
          <time className="font-body text-xs text-contrast/40">{fmt(date)}</time>
        </div>
      </div>
    </Link>
  )
}

interface BlogClientProps {
  posts: Post[]
  total: number
  page: number
  pageSize: number
  category: string | null
  sidebar: ReactNode
}

export default function BlogClient({ posts, total, page, pageSize, category, sidebar }: BlogClientProps) {
  const totalPages = Math.ceil(total / pageSize)
  const hero = page === 1 ? posts.slice(0, 3) : []
  const hasFullHero = hero.length === 3

  return (
    <div>
      {/* Barra de categorias */}
      <div className="bg-contrast border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 h-10 overflow-x-auto">
            <Link
              href="/blog"
              className={`font-body text-[11px] font-bold uppercase tracking-widest whitespace-nowrap px-3 py-1.5 rounded transition-colors ${
                category === null
                  ? 'bg-accent text-white'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Blog Fitmass
            </Link>

            <span className="w-px h-4 bg-white/20 shrink-0 mx-1" aria-hidden="true" />

            {PREDEFINED.map((cat) => (
              <Link
                key={cat}
                href={buildUrl(1, cat === category ? null : cat)}
                className={`font-body text-[11px] font-bold uppercase tracking-widest whitespace-nowrap px-3 py-1.5 rounded transition-colors ${
                  category === cat
                    ? 'bg-accent text-white'
                    : 'text-white/45 hover:text-white'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <p className="font-body text-contrast/40 text-lg">
            Nenhum post em &quot;{category}&quot; ainda.
          </p>
          <Link href="/blog" className="mt-4 inline-block font-body text-sm text-accent underline hover:no-underline">
            Ver todos os posts
          </Link>
        </div>
      ) : (
        <>
          {/* Hero estilo G1 — apenas na primeira página */}
          {hasFullHero && (
            <div className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 h-[340px] md:h-[420px] lg:h-[500px]">
                  <HeroCard post={hero[0]} large />
                  <div className="grid grid-rows-2 gap-2">
                    <HeroCard post={hero[1]} />
                    <HeroCard post={hero[2]} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Listagem + Sidebar */}
          <div className="bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="flex gap-10 items-start">
                <main className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-1 h-5 bg-accent rounded-full shrink-0" aria-hidden="true" />
                    <span className="font-body text-xs font-bold uppercase tracking-widest text-contrast/50">
                      {category ?? 'Todas as Notícias'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    {posts.map((post) => (
                      <ListCard key={post.id} post={post} />
                    ))}
                  </div>

                  {/* Paginação */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10 pt-6 border-t border-gray-100">
                      {page > 1 && (
                        <Link
                          href={buildUrl(page - 1, category)}
                          className="flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-widest text-contrast/50 hover:text-accent transition-colors px-3 py-2"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                          </svg>
                          Anterior
                        </Link>
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
                              <Link
                                key={p}
                                href={buildUrl(p as number, category)}
                                className={`w-8 h-8 flex items-center justify-center rounded font-body text-xs font-bold transition-colors ${
                                  p === page
                                    ? 'bg-accent text-white'
                                    : 'text-contrast/50 hover:text-accent hover:bg-accent/10'
                                }`}
                              >
                                {p}
                              </Link>
                            ),
                          )}
                      </div>

                      {page < totalPages && (
                        <Link
                          href={buildUrl(page + 1, category)}
                          className="flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-widest text-contrast/50 hover:text-accent transition-colors px-3 py-2"
                        >
                          Próxima
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      )}
                    </div>
                  )}
                </main>

                <aside className="hidden xl:block w-72 shrink-0" aria-label="Sidebar">
                  <div className="space-y-5 sticky top-24">{sidebar}</div>
                </aside>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
