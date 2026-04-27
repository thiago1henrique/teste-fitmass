import WeatherWidget from '@/app/components/blog/WeatherWidget'
import MostReadWidget from '@/app/components/blog/MostReadWidget'
import BlogClient, { type Post } from './BlogClient'

interface BlogProps {
  posts: Post[]
  total: number
  page: number
  pageSize: number
  category: string | null
}

export default function Blog({ posts, total, page, pageSize, category }: BlogProps) {
  if (total === 0 && page === 1) {
    return (
      <div className="pt-20">
        <div className="bg-contrast border-b border-white/10 h-10" />
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <p className="font-body text-contrast/40 text-lg">Nenhum post publicado ainda.</p>
          <p className="font-body text-contrast/30 text-sm mt-1">Volte em breve!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20">
      <BlogClient
        posts={posts}
        total={total}
        page={page}
        pageSize={pageSize}
        category={category}
        sidebar={
          <>
            <WeatherWidget />
            <MostReadWidget />
          </>
        }
      />
    </div>
  )
}
