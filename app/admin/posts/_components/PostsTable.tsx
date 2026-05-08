'use client'

import { useState, useTransition, useMemo } from 'react'
import { deletePost } from '@/app/actions/posts'

type Post = {
  id: string
  title: string
  slug: string
  status: 'DRAFT' | 'PUBLISHED'
  publishedAt: Date | null
  createdAt: Date
  author: { name: string }
}

function getWeekKey(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday.toISOString()
}

function weekLabel(isoKey: string): string {
  const monday = new Date(isoKey)
  const sunday = new Date(monday)
  sunday.setDate(sunday.getDate() + 6)
  const fmt = (d: Date) =>
    d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  return `Semana de ${fmt(monday)} – ${fmt(sunday)}`
}

export default function PostsTable({ posts }: { posts: Post[] }) {
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL')

  function handleDelete(id: string) {
    startTransition(async () => {
      await deletePost(id)
      setConfirmId(null)
    })
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return posts.filter((p) => {
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.author.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
      )
    })
  }, [posts, search, statusFilter])

  const grouped = useMemo(() => {
    const map = new Map<string, Post[]>()
    for (const post of filtered) {
      const key = getWeekKey(post.createdAt)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(post)
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]))
  }, [filtered])

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-body text-contrast/40 text-sm">Nenhum post ainda.</p>
        <a
          href="/admin/posts/new"
          className="inline-block mt-4 font-body text-sm text-accent hover:text-accent/80 transition-colors"
        >
          Criar o primeiro post →
        </a>
      </div>
    )
  }

  return (
    <div>
      {/* Toolbar de busca + filtro */}
      <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-0 max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-contrast/30 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por título, autor ou slug…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg font-body text-sm text-contrast placeholder-contrast/30 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-contrast/30 hover:text-contrast/60 transition-colors"
              aria-label="Limpar busca"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {(['ALL', 'PUBLISHED', 'DRAFT'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`font-body text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
                statusFilter === s
                  ? 'bg-white text-contrast shadow-sm'
                  : 'text-contrast/50 hover:text-contrast'
              }`}
            >
              {s === 'ALL' ? 'Todos' : s === 'PUBLISHED' ? 'Publicados' : 'Rascunhos'}
            </button>
          ))}
        </div>

        <span className="font-body text-xs text-contrast/40 shrink-0">
          {filtered.length} de {posts.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="font-body text-contrast/40 text-sm">Nenhum post encontrado.</p>
          <button onClick={() => { setSearch(''); setStatusFilter('ALL') }} className="mt-2 font-body text-xs text-accent hover:text-accent/80 transition-colors">
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {grouped.map(([weekKey, weekPosts]) => (
            <div key={weekKey}>
              {/* Week separator */}
              <div className="px-6 py-2 bg-gray-50 border-y border-gray-100 flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-contrast/30 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-body text-[11px] font-bold uppercase tracking-widest text-contrast/40">
                  {weekLabel(weekKey)}
                </span>
                <span className="font-body text-[11px] text-contrast/25 ml-auto">
                  {weekPosts.length} post{weekPosts.length !== 1 ? 's' : ''}
                </span>
              </div>

              <table className="w-full">
                <tbody className="divide-y divide-gray-50">
                  {weekPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-body text-sm font-medium text-contrast truncate max-w-xs hover:text-accent transition-colors block"
                          title="Abrir post no site"
                        >
                          {post.title}
                        </a>
                        <p className="font-body text-xs text-contrast/35 mt-0.5">/blog/{post.slug}</p>
                      </td>
                      <td className="px-6 py-4 font-body text-sm text-contrast/60">{post.author.name}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-body text-xs font-semibold ${
                            post.status === 'PUBLISHED'
                              ? 'bg-accent/10 text-accent'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {post.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-body text-sm text-contrast/40 whitespace-nowrap">
                        {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 justify-end">
                          <a
                            href={`/admin/posts/${post.id}/edit`}
                            className="font-body text-sm text-accent hover:text-accent/80 transition-colors"
                          >
                            Editar
                          </a>

                          {confirmId === post.id ? (
                            <span className="flex items-center gap-2">
                              <button
                                onClick={() => handleDelete(post.id)}
                                disabled={isPending}
                                className="font-body text-sm text-red-600 hover:text-red-700 font-semibold transition-colors disabled:opacity-50"
                              >
                                Confirmar
                              </button>
                              <button
                                onClick={() => setConfirmId(null)}
                                className="font-body text-sm text-contrast/40 hover:text-contrast transition-colors"
                              >
                                Cancelar
                              </button>
                            </span>
                          ) : (
                            <button
                              onClick={() => setConfirmId(post.id)}
                              className="font-body text-sm text-contrast/40 hover:text-red-500 transition-colors"
                            >
                              Excluir
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
