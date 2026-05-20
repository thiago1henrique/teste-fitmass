'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'
import { cookies } from 'next/headers'
import outputs from '@/amplify_outputs.json'
import type { Schema } from '@/amplify/data/resource'
import { generateSlug } from '@/lib/slug'
import { requireSession, auditLog } from '@/lib/auth-utils'

const TITLE_MAX    = 200
const SUMMARY_MAX  = 500
const CONTENT_MAX  = 100_000

function getClient() {
  return generateServerClientUsingCookies<Schema>({ config: outputs, cookies })
}

export async function createPost(formData: FormData) {
  const session    = await requireSession()
  const title      = (formData.get('title') as string)?.trim()
  const summary    = (formData.get('summary') as string)?.trim()
  const content    = formData.get('content') as string
  const coverUrl   = (formData.get('coverUrl') as string) || undefined
  const status     = (formData.get('status') as 'DRAFT' | 'PUBLISHED') ?? 'DRAFT'
  const categories = formData.getAll('categories') as string[]

  if (!title || !summary || !content) {
    return { error: 'Título, resumo e conteúdo são obrigatórios.' }
  }
  if (title.length > TITLE_MAX)   return { error: `Título deve ter no máximo ${TITLE_MAX} caracteres.` }
  if (summary.length > SUMMARY_MAX) return { error: `Resumo deve ter no máximo ${SUMMARY_MAX} caracteres.` }
  if (content.length > CONTENT_MAX) return { error: `Conteúdo deve ter no máximo ${CONTENT_MAX} caracteres.` }

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

  auditLog('post_created', session.userId, { slug, status })

  revalidateTag('posts', 'default')
  revalidatePath('/blog')
  revalidatePath('/admin/posts')
  redirect('/admin/posts')
}

export async function updatePost(id: string, formData: FormData) {
  const session    = await requireSession()
  const title      = (formData.get('title') as string)?.trim()
  const summary    = (formData.get('summary') as string)?.trim()
  const content    = formData.get('content') as string
  const coverUrl   = (formData.get('coverUrl') as string) || undefined
  const status     = (formData.get('status') as 'DRAFT' | 'PUBLISHED') ?? 'DRAFT'
  const categories = formData.getAll('categories') as string[]

  if (!title || !summary || !content) {
    return { error: 'Título, resumo e conteúdo são obrigatórios.' }
  }
  if (title.length > TITLE_MAX)   return { error: `Título deve ter no máximo ${TITLE_MAX} caracteres.` }
  if (summary.length > SUMMARY_MAX) return { error: `Resumo deve ter no máximo ${SUMMARY_MAX} caracteres.` }
  if (content.length > CONTENT_MAX) return { error: `Conteúdo deve ter no máximo ${CONTENT_MAX} caracteres.` }

  const client = getClient()
  const { data: post } = await client.models.Post.get({ id })
  if (!post) return { error: 'Post não encontrado.' }

  if (post.authorId !== session.userId && session.role !== 'ADMIN') {
    return { error: 'Sem permissão para editar este post.' }
  }

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

  auditLog('post_updated', session.userId, { id, status })

  revalidateTag('posts', 'default')
  revalidateTag(`post-${post.slug}`, 'default')
  revalidatePath('/blog')
  revalidatePath(`/blog/${post.slug}`)
  revalidatePath('/admin/posts')
  redirect('/admin/posts')
}

export async function deletePost(id: string) {
  const session = await requireSession()

  const client = getClient()
  const { data: post } = await client.models.Post.get({ id })
  if (!post) return { error: 'Post não encontrado.' }

  if (post.authorId !== session.userId && session.role !== 'ADMIN') {
    return { error: 'Sem permissão para excluir este post.' }
  }

  await client.models.Post.delete({ id })

  auditLog('post_deleted', session.userId, { id, slug: post.slug })

  revalidateTag('posts', 'default')
  revalidateTag(`post-${post.slug}`, 'default')
  revalidatePath('/blog')
  revalidatePath('/admin/posts')
}
