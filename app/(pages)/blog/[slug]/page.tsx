import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'
import { cookies } from 'next/headers'
import outputs from '@/amplify_outputs.json'
import type { Schema } from '@/amplify/data/resource'
import { listAll } from '@/lib/list-all'
import PostBody from './PostBody'
import RelatedPostsSection from '@/app/components/blog/RelatedPostsSection'

export const dynamic = 'force-dynamic'

async function getPost(slug: string) {
  try {
    const client = generateServerClientUsingCookies<Schema>({
      config: outputs,
      cookies,
      authMode: 'apiKey',
    })
    const data = await listAll((t) =>
      client.models.Post.list({ filter: { slug: { eq: slug }, status: { eq: 'PUBLISHED' } }, nextToken: t })
    )
    return data[0] ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
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
  const raw = await getPost(slug)
  if (!raw) notFound()

  const post = {
    ...raw,
    content:     raw.content ?? '',
    author:      { name: raw.authorName ?? '' },
    publishedAt: raw.publishedAt ? new Date(raw.publishedAt) : null,
    createdAt:   new Date(raw.createdAt),
    updatedAt:   new Date(raw.updatedAt),
  }

  return (
    <>
      <div className="pt-24 bg-surface">
        <PostBody post={post} />
      </div>
      <RelatedPostsSection excludeSlug={post.slug} />
    </>
  )
}
