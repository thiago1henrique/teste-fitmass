import { redirect } from 'next/navigation'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'
import { cookies } from 'next/headers'
import outputs from '@/amplify_outputs.json'
import type { Schema } from '@/amplify/data/resource'
import { getSession } from '@/lib/session'
import PostsTable from './_components/PostsTable'

export const metadata = { title: 'Posts | Admin Fitmass' }

export default async function PostsPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const client = generateServerClientUsingCookies<Schema>({ config: outputs, cookies })
  const { data: rawPosts } = await client.models.Post.list({ filter: undefined })

  const posts = rawPosts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((p) => ({
      ...p,
      status:      (p.status ?? 'DRAFT') as 'DRAFT' | 'PUBLISHED',
      author:      { name: p.authorName },
      publishedAt: p.publishedAt ? new Date(p.publishedAt) : null,
      createdAt:   new Date(p.createdAt),
    }))

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-title text-3xl uppercase text-contrast tracking-wide">Posts</h1>
          <p className="font-body text-contrast/50 text-sm mt-1">{posts.length} post(s) no total</p>
        </div>
        <a
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 bg-accent text-white font-body font-bold uppercase tracking-widest text-sm px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Novo Post
        </a>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <PostsTable posts={posts} />
      </div>
    </div>
  )
}
