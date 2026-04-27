import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { createPost } from '@/app/actions/posts'
import PostForm from '../_components/PostForm'

export const metadata = { title: 'Novo Post | Admin Fitmass' }

export default async function NewPostPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

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
        <h1 className="font-title text-xl uppercase text-contrast tracking-wide">Novo Post</h1>
      </div>

      {/* Form */}
      <div className="bg-white border-t-0 flex-1">
        <PostForm action={createPost} />
      </div>
    </div>
  )
}
