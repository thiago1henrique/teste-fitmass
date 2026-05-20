import Link from 'next/link'
import Image from 'next/image'
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

function fmt(date: Date) {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function buildUrl(page: number, category: string | null, search: string | null) {
  const params = new URLSearchParams()
  if (page > 1) params.set('page', String(page))
  if (category) params.set('category', category)
  if (search)   params.set('search', search)
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
        <Image
          src={post.coverUrl}
          alt=""
          aria-hidden={true}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-br from-contrast to-contrast/70" />
      )}

      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />

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
          <Image
            src={post.coverUrl}
            alt={post.title}
            fill
            sizes="112px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-accent/15 to-accent/5 flex items-center justify-center">
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
          <h3 className="font-body text-sm font-semibold text-contrast leading-snug line-clamp-2 group-hover:text-secondary transition-colors">
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
  search: string | null
  sidebar: ReactNode
  extraContent?: ReactNode
}

export default function BlogClient({ posts, total, page, pageSize, category, search, sidebar, extraContent }: BlogClientProps) {
  const totalPages = Math.ceil(total / pageSize)
  const hero      = page === 1 && !search ? posts.slice(0, 3) : []
  const hasFullHero = hero.length === 3
  const listPosts   = hasFullHero ? posts.slice(3) : posts

  return (
    <div>
      {/* Label de resultado de busca */}
      {search && (
        <div className="bg-surface border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
            <svg className="w-4 h-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
            </svg>
            <span className="font-body text-sm text-contrast/70">
              {total > 0
                ? <>{total} resultado{total !== 1 ? 's' : ''} para <strong className="text-contrast">&quot;{search}&quot;</strong></>
                : <>Nenhum resultado para <strong className="text-contrast">&quot;{search}&quot;</strong></>
              }
            </span>
            <Link href="/blog" className="ml-auto font-body text-xs text-accent hover:text-accent/70 transition-colors">
              Limpar busca ×
            </Link>
          </div>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          {search ? (
            <>
              <p className="font-body text-contrast/40 text-lg">Nenhum resultado encontrado.</p>
              <Link href="/blog" className="mt-4 inline-block font-body text-sm text-accent underline hover:no-underline">
                Ver todos os posts
              </Link>
            </>
          ) : (
            <>
              <p className="font-body text-contrast/40 text-lg">
                Nenhum post em &quot;{category}&quot; ainda.
              </p>
              <Link href="/blog" className="mt-4 inline-block font-body text-sm text-accent underline hover:no-underline">
                Ver todos os posts
              </Link>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Hero estilo G1 */}
          {hasFullHero && (
            <div className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 h-85 md:h-105 lg:h-125">
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
              <div className="flex gap-10">
                <div className="flex-1 min-w-0">
                <main>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-1 h-5 bg-accent rounded-full shrink-0" aria-hidden="true" />
                    <span className="font-body text-xs font-bold uppercase tracking-widest text-contrast/50">
                      {search ? `Resultados para "${search}"` : (category ?? 'Todas as Notícias')}
                    </span>
                  </div>

                  {listPosts.length === 0 ? (
                    <p className="font-body text-sm text-contrast/40 py-8">Nenhum post adicional nesta página.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                      {listPosts.map((post) => (
                        <ListCard key={post.id} post={post} />
                      ))}
                    </div>
                  )}

                  {/* Paginação */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10 pt-6 border-t border-gray-100">
                      {page > 1 && (
                        <Link
                          href={buildUrl(page - 1, category, search)}
                          className="flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-widest text-contrast/50 hover:text-secondary transition-colors px-3 py-2"
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
                                href={buildUrl(p as number, category, search)}
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
                          href={buildUrl(page + 1, category, search)}
                          className="flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-widest text-contrast/50 hover:text-secondary transition-colors px-3 py-2"
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
                {extraContent}
                </div>

                <aside className="hidden xl:block w-72 shrink-0" aria-label="Sidebar">
                  <div className="space-y-5 sticky top-28">{sidebar}</div>
                </aside>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
