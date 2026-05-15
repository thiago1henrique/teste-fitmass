import type { MetadataRoute } from 'next'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'
import { cookies } from 'next/headers'
import outputs from '@/amplify_outputs.json'
import type { Schema } from '@/amplify/data/resource'
import { listAll } from '@/lib/list-all'

export const revalidate = 3600

const BASE_URL = 'https://fitmass.com.br'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/planos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacidade`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  let postRoutes: MetadataRoute.Sitemap = []
  try {
    const client = generateServerClientUsingCookies<Schema>({
      config: outputs,
      cookies,
      authMode: 'apiKey',
    })
    const posts = await listAll((t) =>
      client.models.Post.list({
        filter: { status: { eq: 'PUBLISHED' } },
        nextToken: t,
        limit: 500,
      })
    )
    postRoutes = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch {
    // sitemap degrades gracefully if DB is unreachable
  }

  return [...staticRoutes, ...postRoutes]
}
