import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PostBody from './PostBody'
import RelatedPostsSection from '@/app/components/blog/RelatedPostsSection'

export const revalidate = 3600

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
  })
  return posts.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug, status: 'PUBLISHED' },
  })
  if (!post) return {}

  return {
    title: `${post.title} | Blog Fitmass`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      images: post.coverUrl ? [post.coverUrl] : [],
    },
    alternates: { canonical: `https://fitmass.com.br/blog/${slug}` },
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: { author: { select: { name: true } } },
  })

  if (!post) notFound()

  return (
    <>
      <div className="pt-24 bg-surface">
        <PostBody post={post} />
      </div>
      <RelatedPostsSection excludeSlug={post.slug} />
    </>
  )
}
