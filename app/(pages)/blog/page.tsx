import type { Metadata } from 'next'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'
import { cookies } from 'next/headers'
import outputs from '@/amplify_outputs.json'
import type { Schema } from '@/amplify/data/resource'
import { listAll } from '@/lib/list-all'
import Blog from './Blog'

export const revalidate = 60

export const PAGE_SIZE = 15

export const metadata: Metadata = {
  title: 'Blog | Fitmass',
  description: 'Artigos sobre bioimpedância, saúde, fitness e tecnologia para academias e profissionais.',
  alternates: { canonical: 'https://fitmass.com.br/blog' },
  openGraph: {
    title: 'Blog | Fitmass',
    description: 'Artigos sobre bioimpedância, saúde, fitness e tecnologia para academias e profissionais.',
    url: 'https://fitmass.com.br/blog',
    type: 'website',
  },
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>
}) {
  const { page: pageParam, category, search } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const allPosts = await (async () => {
    try {
      const client = generateServerClientUsingCookies<Schema>({
        config: outputs,
        cookies,
        authMode: 'apiKey',
      })
      return await listAll((t) =>
        client.models.Post.list({ filter: { status: { eq: 'PUBLISHED' } }, nextToken: t, limit: 500 })
      )
    } catch {
      return []
    }
  })()

  const q = search?.trim().toLowerCase() ?? ''

  const adapt = (p: typeof allPosts[0]) => ({
    ...p,
    categories: (p.categories?.filter((c): c is string => !!c) ?? []) as string[],
    author: { name: p.authorName },
    publishedAt: p.publishedAt ? new Date(p.publishedAt) : null,
    createdAt:   new Date(p.createdAt),
    updatedAt:   new Date(p.updatedAt),
  })

  const filteredSorted = allPosts
    .filter((p) => !category || (p.categories ?? []).includes(category))
    .filter((p) =>
      !q ||
      p.title.toLowerCase().includes(q) ||
      (p.summary ?? '').toLowerCase().includes(q)
    )
    .sort((a, b) => {
      const da = a.publishedAt ?? a.createdAt
      const db = b.publishedAt ?? b.createdAt
      return new Date(db).getTime() - new Date(da).getTime()
    })

  const total = filteredSorted.length
  const adapted = filteredSorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(adapt)

  // Pass all posts for category sections — only needed on the unfiltered main page
  const allAdapted = !category && !q && page === 1
    ? allPosts
        .sort((a, b) => {
          const da = a.publishedAt ?? a.createdAt
          const db = b.publishedAt ?? b.createdAt
          return new Date(db).getTime() - new Date(da).getTime()
        })
        .map(adapt)
    : []

  return (
    <Blog
      posts={adapted}
      allPosts={allAdapted}
      total={total}
      page={page}
      pageSize={PAGE_SIZE}
      category={category ?? null}
      search={q || null}
    />
  )
}
