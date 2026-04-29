import type { Metadata } from 'next'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'
import { cookies } from 'next/headers'
import outputs from '@/amplify_outputs.json'
import type { Schema } from '@/amplify/data/resource'
import Blog from './Blog'

export const revalidate = 60

export const PAGE_SIZE = 12

export const metadata: Metadata = {
  title: 'Blog | Fitmass',
  description: 'Artigos sobre bioimpedância, saúde, fitness e tecnologia para academias e profissionais.',
  alternates: { canonical: 'https://fitmass.com.br/blog' },
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>
}) {
  const { page: pageParam, category } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const client = generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies,
    authMode: 'apiKey',
  })

  const { data: allPosts } = await client.models.Post.list({
    filter: { status: { eq: 'PUBLISHED' } },
  })

  let posts = allPosts
    .filter((p) => !category || (p.categories ?? []).includes(category))
    .sort((a, b) => {
      const da = a.publishedAt ?? a.createdAt
      const db = b.publishedAt ?? b.createdAt
      return new Date(db).getTime() - new Date(da).getTime()
    })

  const total = posts.length
  posts = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const adapted = posts.map((p) => ({
    ...p,
    categories: (p.categories?.filter((c): c is string => !!c) ?? []) as string[],
    author: { name: p.authorName },
    publishedAt: p.publishedAt ? new Date(p.publishedAt) : null,
    createdAt:   new Date(p.createdAt),
    updatedAt:   new Date(p.updatedAt),
  }))

  return (
    <Blog
      posts={adapted}
      total={total}
      page={page}
      pageSize={PAGE_SIZE}
      category={category ?? null}
    />
  )
}
