import Link from 'next/link'
import Image from 'next/image'
import { getPublishedPosts } from '@/lib/posts'

export default async function BlogPreviewSection() {
  const allPosts = await getPublishedPosts()

  const posts = allPosts
    .sort((a, b) => {
      const da = a.publishedAt ?? a.createdAt
      const db = b.publishedAt ?? b.createdAt
      return new Date(db).getTime() - new Date(da).getTime()
    })
    .slice(0, 3)

  if (posts.length === 0) return null

  return (
    <section className="bg-surface py-16 px-4" aria-labelledby="blog-preview-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            Blog
          </span>
          <h2
            id="blog-preview-heading"
            className="font-title text-4xl md:text-5xl text-contrast uppercase tracking-wide mb-4"
          >
            Últimos Artigos
          </h2>
          <p className="font-body text-contrast/60 text-lg max-w-xl mx-auto">
            Conteúdo sobre bioimpedância, saúde e tecnologia para seu negócio crescer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {posts.map((post) => {
            const date = post.publishedAt ?? post.createdAt
            return (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                aria-label={`Ler: ${post.title}`}
              >
                {post.coverUrl ? (
                  <Image
                    src={post.coverUrl}
                    alt={post.title}
                    width={800}
                    height={352}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-44 bg-linear-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                    <svg className="w-10 h-10 text-accent/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}

                <div className="flex flex-col flex-1 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-body text-xs text-accent font-semibold uppercase tracking-widest">
                      {post.authorName}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-contrast/20" aria-hidden="true" />
                    <time className="font-body text-xs text-contrast/40">
                      {new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </time>
                  </div>

                  <h3 className="font-title text-xl uppercase tracking-wide text-contrast mb-3 line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="font-body text-sm text-contrast/60 leading-relaxed line-clamp-3 flex-1 mb-5">
                    {post.summary}
                  </p>

                  <span className="inline-flex items-center justify-center gap-2 bg-accent text-white font-body font-bold uppercase tracking-widest text-xs px-5 py-2.5 rounded-xl group-hover:bg-accent/90 transition-colors self-start">
                    Ler artigo
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 border-2 border-accent/50 text-accent font-body font-bold uppercase tracking-widest text-sm px-8 py-3.5 rounded-xl hover:border-accent hover:bg-accent hover:text-white transition-all duration-200"
          >
            Ver mais no blog
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
