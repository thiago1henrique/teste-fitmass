import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPost } from '@/lib/posts'
import PostBody from './PostBody'
import RelatedPostsSection from '@/app/components/blog/RelatedPostsSection'
import { Suspense } from 'react'

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

async function PostPageContent({ params }: { params: Promise<{ slug: string }> }) {
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

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: raw.summary ?? '',
    image: raw.coverUrl ? [raw.coverUrl] : undefined,
    datePublished: post.publishedAt?.toISOString() ?? post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Fitmass',
      url: 'https://fitmass.com.br',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://fitmass.com.br/blog/${post.slug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="pt-24 bg-surface">
        <PostBody post={post} />
      </div>
      <RelatedPostsSection excludeSlug={post.slug} />
    </>
  )
}

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense>
      <PostPageContent params={params} />
    </Suspense>
  )
}
