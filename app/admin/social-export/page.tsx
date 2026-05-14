import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'
import { cookies } from 'next/headers'
import outputs from '@/amplify_outputs.json'
import type { Schema } from '@/amplify/data/resource'
import ExportEditor from './ExportEditor'

export const metadata = { title: 'Exportar para Redes Sociais — Fitmass Admin' }

type InitialPost = {
  title: string
  summary: string | null
  coverUrl: string | null
  categories: string[]
}

export default async function SocialExportPage({
  searchParams,
}: {
  searchParams: Promise<{ postId?: string }>
}) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const { postId } = await searchParams

  let initialPost: InitialPost | null = null

  if (postId) {
    const client = generateServerClientUsingCookies<Schema>({ config: outputs, cookies })
    const { data: post } = await client.models.Post.get({ id: postId })
    if (post) {
      initialPost = {
        title: post.title ?? '',
        summary: post.summary ?? null,
        coverUrl: post.coverUrl ?? null,
        categories: (post.categories ?? []).filter(Boolean) as string[],
      }
    }
  }

  return <ExportEditor initialPost={initialPost} />
}
