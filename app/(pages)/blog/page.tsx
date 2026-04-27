import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
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

  const where = {
    status: 'PUBLISHED' as const,
    ...(category ? { categories: { has: category } } : {}),
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      include: { author: { select: { name: true } } },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.post.count({ where }),
  ])

  return (
    <Blog
      posts={posts}
      total={total}
      page={page}
      pageSize={PAGE_SIZE}
      category={category ?? null}
    />
  )
}
