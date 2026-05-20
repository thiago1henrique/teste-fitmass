import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import { cacheLife, cacheTag } from 'next/cache'
import outputs from '@/amplify_outputs.json'
import type { Schema } from '@/amplify/data/resource'
import { listAll } from '@/lib/list-all'

// Public read-only client using API key — no cookies needed, safe inside "use cache"
Amplify.configure(outputs, { ssr: true })
const client = generateClient<Schema>({ authMode: 'apiKey' })

export async function getPublishedPosts() {
  'use cache'
  cacheLife('minutes')
  cacheTag('posts')
  try {
    return await listAll((t) =>
      client.models.Post.list({ filter: { status: { eq: 'PUBLISHED' } }, nextToken: t, limit: 500 })
    )
  } catch {
    return []
  }
}

export async function getPost(slug: string) {
  'use cache'
  cacheLife('hours')
  cacheTag('posts', `post-${slug}`)
  try {
    const data = await listAll((t) =>
      client.models.Post.list({
        filter: { slug: { eq: slug }, status: { eq: 'PUBLISHED' } },
        nextToken: t,
      })
    )
    return data[0] ?? null
  } catch {
    return null
  }
}
