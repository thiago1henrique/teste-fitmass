'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { generateSlug } from '@/lib/slug'

async function requireSession() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  return session
}

export async function createPost(formData: FormData) {
  const session = await requireSession()

  const title = formData.get('title') as string
  const summary = formData.get('summary') as string
  const content = formData.get('content') as string
  const coverUrl = (formData.get('coverUrl') as string) || null
  const status = (formData.get('status') as 'DRAFT' | 'PUBLISHED') ?? 'DRAFT'
  const categories = formData.getAll('categories') as string[]

  if (!title || !summary || !content) {
    return { error: 'Título, resumo e conteúdo são obrigatórios.' }
  }

  let slug = generateSlug(title)
  const existing = await prisma.post.findUnique({ where: { slug } })
  if (existing) slug = `${slug}-${Date.now()}`

  await prisma.post.create({
    data: {
      title,
      slug,
      summary,
      content,
      coverUrl,
      status,
      categories,
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
      authorId: session.userId,
    },
  })

  revalidatePath('/blog')
  revalidatePath('/admin/posts')
  redirect('/admin/posts')
}

export async function updatePost(id: string, formData: FormData) {
  await requireSession()

  const title = formData.get('title') as string
  const summary = formData.get('summary') as string
  const content = formData.get('content') as string
  const coverUrl = (formData.get('coverUrl') as string) || null
  const status = (formData.get('status') as 'DRAFT' | 'PUBLISHED') ?? 'DRAFT'
  const categories = formData.getAll('categories') as string[]

  if (!title || !summary || !content) {
    return { error: 'Título, resumo e conteúdo são obrigatórios.' }
  }

  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) return { error: 'Post não encontrado.' }

  const wasPublished = post.status === 'PUBLISHED'
  const isNowPublished = status === 'PUBLISHED'

  await prisma.post.update({
    where: { id },
    data: {
      title,
      summary,
      content,
      coverUrl,
      status,
      categories,
      publishedAt: isNowPublished && !wasPublished ? new Date() : post.publishedAt,
    },
  })

  revalidatePath('/blog')
  revalidatePath(`/blog/${post.slug}`)
  revalidatePath('/admin/posts')
  redirect('/admin/posts')
}

export async function deletePost(id: string) {
  await requireSession()

  const post = await prisma.post.findUnique({ where: { id } })
  if (!post) return { error: 'Post não encontrado.' }

  await prisma.post.delete({ where: { id } })

  revalidatePath('/blog')
  revalidatePath('/admin/posts')
}
