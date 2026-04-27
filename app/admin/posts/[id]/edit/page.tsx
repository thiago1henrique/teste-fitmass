import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'
import { cookies } from 'next/headers'
import outputs from '@/amplify_outputs.json'
import type { Schema } from '@/amplify/data/resource'
import { getSession } from '@/lib/session'
import { updatePost } from '@/app/actions/posts'
import PostForm from '../../_components/PostForm'

export const metadata = { title: 'Editar Post | Admin Fitmass' }

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const { id } = await params
  const client = generateServerClientUsingCookies<Schema>({ config: outputs, cookies })
  const { data: raw } = await client.models.Post.get({ id })
  if (!raw) notFound()

  const post = {
    ...raw,
    author:      { name: raw.authorName },
    publishedAt: raw.publishedAt ? new Date(raw.publishedAt) : null,
    createdAt:   new Date(raw.createdAt),
    updatedAt:   new Date(raw.updatedAt),
  }

  const action = updatePost.bind(null, id)

  return (
    <div className="flex flex-col min-h-full">
      {/* Page header */}
      <div className="px-8 pt-8 pb-4 flex items-center gap-4 border-b border-gray-100 bg-surface">
        <Link
          href="/admin/posts"
          className="flex items-center gap-1.5 font-body text-sm text-contrast/50 hover:text-contrast transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Posts
        </Link>
        <span className="text-contrast/20">/</span>
        <h1 className="font-title text-xl uppercase text-contrast tracking-wide truncate max-w-md">
          {post.title}
        </h1>
        <span className="ml-auto font-body text-xs text-contrast/30">/blog/{post.slug}</span>
      </div>

      {/* Form */}
      <div className="bg-white flex-1">
        <PostForm post={post} action={action} />
      </div>
    </div>
  )
}
