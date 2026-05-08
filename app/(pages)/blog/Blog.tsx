import Link from 'next/link'
import WeatherWidget from '@/app/components/blog/WeatherWidget'
import MostReadWidget from '@/app/components/blog/MostReadWidget'
import BlogClient, { type Post } from './BlogClient'

export const BLOG_CATEGORIES = [
  'Saúde', 'Bioscan', 'Profissionais', 'System',
  'Corporativo', 'Estabelecimentos', 'App', 'Scanner',
]

function buildUrl(category: string | null, search: string | null) {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (search)   params.set('search', search)
  const qs = params.toString()
  return `/blog${qs ? `?${qs}` : ''}`
}

interface BlogProps {
  posts: Post[]
  total: number
  page: number
  pageSize: number
  category: string | null
  search: string | null
}

export default function Blog({ posts, total, page, pageSize, category, search }: BlogProps) {
  return (
    <div className="pt-20">
      {/* Barra de categorias — sticky diretamente no wrapper pt-20, z-40 fica acima do conteúdo mas abaixo do header (z-50) */}
      <div className="sticky top-16 z-40 bg-contrast shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-0.5 h-11 overflow-x-auto no-scrollbar">
            <Link
              href="/blog"
              className={`font-body text-[11px] font-bold uppercase tracking-widest whitespace-nowrap px-3 py-1.5 rounded transition-colors ${
                category === null && !search
                  ? 'bg-accent text-white'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Blog Fitmass
            </Link>

            <span className="w-px h-4 bg-white/20 shrink-0 mx-1" aria-hidden="true" />

            {BLOG_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={buildUrl(cat === category ? null : cat, null)}
                className={`font-body text-[11px] font-bold uppercase tracking-widest whitespace-nowrap px-3 py-1.5 rounded transition-colors ${
                  category === cat
                    ? 'bg-accent text-white'
                    : 'text-white/45 hover:text-white'
                }`}
              >
                {cat}
              </Link>
            ))}

            <span className="w-px h-4 bg-white/20 shrink-0 mx-1 hidden sm:block" aria-hidden="true" />

            {/* Barra de pesquisa desktop */}
            <form method="GET" action="/blog" className="hidden sm:flex items-center gap-1.5 ml-auto shrink-0">
              {category && <input type="hidden" name="category" value={category} />}
              <div className="relative">
                <svg
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
                </svg>
                <input
                  type="text"
                  name="search"
                  defaultValue={search ?? ''}
                  placeholder="Pesquisar…"
                  className="bg-white/10 text-white placeholder-white/35 font-body text-[11px] pl-8 pr-3 py-1.5 rounded w-40 focus:w-52 focus:bg-white/15 focus:outline-none transition-all duration-200"
                />
              </div>
              <button
                type="submit"
                className="font-body text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white px-2 py-1.5 rounded transition-colors"
              >
                Ir
              </button>
            </form>
          </div>
        </div>

        {/* Barra de pesquisa mobile */}
        <form method="GET" action="/blog" className="sm:hidden border-t border-white/10 px-4 py-2 flex items-center gap-2">
          {category && <input type="hidden" name="category" value={category} />}
          <div className="relative flex-1">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
            </svg>
            <input
              type="text"
              name="search"
              defaultValue={search ?? ''}
              placeholder="Pesquisar no blog…"
              className="w-full bg-white/10 text-white placeholder-white/35 font-body text-[11px] pl-8 pr-3 py-1.5 rounded focus:bg-white/15 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="font-body text-[11px] font-bold uppercase tracking-widest text-accent px-3 py-1.5 rounded transition-colors"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Conteúdo principal */}
      {total === 0 && page === 1 && !search && !category ? (
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <p className="font-body text-contrast/40 text-lg">Nenhum post publicado ainda.</p>
          <p className="font-body text-contrast/30 text-sm mt-1">Volte em breve!</p>
        </div>
      ) : (
        <BlogClient
          posts={posts}
          total={total}
          page={page}
          pageSize={pageSize}
          category={category}
          search={search}
          sidebar={
            <>
              <WeatherWidget />
              <MostReadWidget />
            </>
          }
        />
      )}
    </div>
  )
}
