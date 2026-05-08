import ViewTracker from '@/app/components/blog/ViewTracker'

type Post = {
  slug: string
  title: string
  summary: string
  content: string
  coverUrl: string | null
  publishedAt: Date | null
  createdAt: Date
  author: { name: string }
}

export default function PostBody({ post }: { post: Post }) {
  const date = post.publishedAt ?? post.createdAt

  return (
    <article className="max-w-2xl mx-auto px-4 py-16">
      <ViewTracker slug={post.slug} />

      {/* Meta */}
      <div className="flex items-center gap-2 mb-5">
        <span className="font-body text-xs text-accent font-semibold uppercase tracking-widest">
          {post.author.name}
        </span>
        <span className="w-1 h-1 rounded-full bg-contrast/20" aria-hidden="true" />
        <time className="font-body text-xs text-contrast/40">
          {new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
        </time>
      </div>

      {/* Title */}
      <h1 className="font-title text-4xl md:text-5xl uppercase text-contrast tracking-wide leading-tight mb-5">
        {post.title}
      </h1>

      {/* Summary */}
      <p className="font-body text-lg text-contrast/60 leading-relaxed mb-8 border-l-2 border-accent pl-4">
        {post.summary}
      </p>

      {/* Cover image */}
      {post.coverUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverUrl}
          alt={post.title}
          className="w-full rounded-2xl mb-10 object-cover max-h-[420px]"
        />
      )}

      {/* Content */}
      <div
        className="prose-content"
        dangerouslySetInnerHTML={{
          __html: post.content.replace(/\[\/?\w[\w-]*(?:\s[^\]]*?)?\]/g, ''),
        }}
      />

      <div className="mt-12 pt-8 border-t border-gray-100" />
    </article>
  )
}
