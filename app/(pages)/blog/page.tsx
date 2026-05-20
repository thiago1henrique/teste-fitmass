import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getPublishedPosts } from '@/lib/posts'
import Blog from './Blog'

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

async function BlogContent({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>
}) {
  const { page: pageParam, category, search } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const allPosts = await getPublishedPosts()

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

export default function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>
}) {
  return (
    <Suspense>
      <BlogContent searchParams={searchParams} />
    </Suspense>
  )
}
