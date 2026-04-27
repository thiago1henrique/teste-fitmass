'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'
import { cookies } from 'next/headers'
import outputs from '@/amplify_outputs.json'
import type { Schema } from '@/amplify/data/resource'
import { getSession } from '@/lib/session'
import { generateSlug } from '@/lib/slug'

function getClient() {
  return generateServerClientUsingCookies<Schema>({ config: outputs, cookies })
}

async function requireSession() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  return session
}

export async function createPost(formData: FormData) {
  const session    = await requireSession()
  const title      = formData.get('title') as string
  const summary    = formData.get('summary') as string
  const content    = formData.get('content') as string
  const coverUrl   = (formData.get('coverUrl') as string) || undefined
  const status     = (formData.get('status') as 'DRAFT' | 'PUBLISHED') ?? 'DRAFT'
  const categories = formData.getAll('categories') as string[]

  if (!title || !summary || !content) {
    return { error: 'Título, resumo e conteúdo são obrigatórios.' }
  }

  const client = getClient()

  let slug = generateSlug(title)
  const { data: existing } = await client.models.Post.list({
    filter: { slug: { eq: slug } },
  })
  if (existing.length > 0) slug = `${slug}-${Date.now()}`

  await client.models.Post.create({
    title,
    slug,
    summary,
    content,
    coverUrl,
    status,
    categories,
    publishedAt:  status === 'PUBLISHED' ? new Date().toISOString() : undefined,
    authorId:     session.userId,
    authorName:   session.name,
  })

  revalidatePath('/blog')
  revalidatePath('/admin/posts')
  redirect('/admin/posts')
}

export async function updatePost(id: string, formData: FormData) {
  await requireSession()

  const title      = formData.get('title') as string
  const summary    = formData.get('summary') as string
  const content    = formData.get('content') as string
  const coverUrl   = (formData.get('coverUrl') as string) || undefined
  const status     = (formData.get('status') as 'DRAFT' | 'PUBLISHED') ?? 'DRAFT'
  const categories = formData.getAll('categories') as string[]

  if (!title || !summary || !content) {
    return { error: 'Título, resumo e conteúdo são obrigatórios.' }
  }

  const client = getClient()
  const { data: post } = await client.models.Post.get({ id })
  if (!post) return { error: 'Post não encontrado.' }

  const wasPublished   = post.status === 'PUBLISHED'
  const isNowPublished = status === 'PUBLISHED'

  await client.models.Post.update({
    id,
    title,
    summary,
    content,
    coverUrl,
    status,
    categories,
    publishedAt:
      isNowPublished && !wasPublished
        ? new Date().toISOString()
        : post.publishedAt ?? undefined,
  })

  revalidatePath('/blog')
  revalidatePath(`/blog/${post.slug}`)
  revalidatePath('/admin/posts')
  redirect('/admin/posts')
}

export async function deletePost(id: string) {
  await requireSession()

  const client = getClient()
  const { data: post } = await client.models.Post.get({ id })
  if (!post) return { error: 'Post não encontrado.' }

  await client.models.Post.delete({ id })

  revalidatePath('/blog')
  revalidatePath('/admin/posts')
}
