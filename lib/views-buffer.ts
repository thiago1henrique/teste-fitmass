import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'
import { cookies } from 'next/headers'
import outputs from '@/amplify_outputs.json'
import type { Schema } from '@/amplify/data/resource'

export async function bufferView(slug: string): Promise<void> {
  try {
    const client = generateServerClientUsingCookies<Schema>({
      config: outputs,
      cookies,
      authMode: 'apiKey',
    })
    const { data: posts } = await client.models.Post.list({
      filter: { slug: { eq: slug }, status: { eq: 'PUBLISHED' } },
    })
    if (posts[0]) {
      await client.models.Post.update({
        id: posts[0].id,
        views: (posts[0].views ?? 0) + 1,
      })
    }
  } catch {
    // non-critical — fails silently in local dev without real AWS credentials
  }
}
