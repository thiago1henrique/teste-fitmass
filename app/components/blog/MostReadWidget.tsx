import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function MostReadWidget() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { views: 'desc' },
    take: 5,
    select: { title: true, slug: true, coverUrl: true, publishedAt: true, createdAt: true },
  })

  if (posts.length === 0) return null

  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <div className="bg-contrast px-4 py-2">
        <span className="font-body text-[11px] font-bold uppercase tracking-widest text-white/60">
          Mais Lidas
        </span>
      </div>
      <div className="divide-y divide-gray-50">
        {posts.map((post, i) => {
          const date = post.publishedAt ?? post.createdAt
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="flex items-start gap-3 p-3 hover:bg-surface transition-colors group"
            >
              <span className="font-title text-2xl text-accent/30 leading-none w-5 shrink-0 pt-0.5 select-none">
                {i + 1}
              </span>
              {post.coverUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.coverUrl}
                  alt=""
                  aria-hidden="true"
                  className="w-14 h-14 object-cover rounded shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="font-body text-xs font-semibold text-contrast leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                  {post.title}
                </p>
                <time className="font-body text-[10px] text-contrast/40 mt-0.5 block">
                  {new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                </time>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
