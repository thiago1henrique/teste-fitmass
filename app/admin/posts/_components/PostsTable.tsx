'use client'

import { useState, useTransition } from 'react'
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

export default function PostsTable({ posts }: { posts: Post[] }) {
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDelete(id: string) {
    startTransition(async () => {
      await deletePost(id)
      setConfirmId(null)
    })
  }

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
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left font-body text-xs uppercase tracking-widest text-contrast/40 px-6 py-3">Título</th>
            <th className="text-left font-body text-xs uppercase tracking-widest text-contrast/40 px-6 py-3">Autor</th>
            <th className="text-left font-body text-xs uppercase tracking-widest text-contrast/40 px-6 py-3">Status</th>
            <th className="text-left font-body text-xs uppercase tracking-widest text-contrast/40 px-6 py-3">Data</th>
            <th className="px-6 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4">
                <p className="font-body text-sm font-medium text-contrast truncate max-w-xs">{post.title}</p>
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
  )
}
