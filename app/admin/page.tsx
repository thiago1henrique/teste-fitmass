import { redirect } from 'next/navigation'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'
import { CognitoIdentityProviderClient, ListUsersCommand } from '@aws-sdk/client-cognito-identity-provider'
import { cookies } from 'next/headers'
import outputs from '@/amplify_outputs.json'
import type { Schema } from '@/amplify/data/resource'
import { getSession } from '@/lib/session'
import { listAll } from '@/lib/list-all'
import { PostsByMonthChart, PostsByStatusChart } from './_components/DashboardCharts'

export const metadata = { title: 'Dashboard | Admin Fitmass' }

function buildMonthlyData(
  posts: { createdAt: string; status: string | null }[]
): { month: string; posts: number }[] {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const label = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
    const count = posts.filter((p) => {
      const pd = new Date(p.createdAt)
      return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth()
    }).length
    return { month: label, posts: count }
  })
}

function StatCard({ label, value, sub, accent }: {
  label: string; value: number | string; sub?: string; accent?: boolean
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <p className={`font-title text-3xl uppercase tracking-wide ${accent ? 'text-accent' : 'text-contrast'}`}>
        {value}
      </p>
      <p className="font-body text-contrast/50 text-sm mt-1">{label}</p>
      {sub && <p className="font-body text-xs text-contrast/30 mt-0.5">{sub}</p>}
    </div>
  )
}

export default async function AdminDashboard() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const client = generateServerClientUsingCookies<Schema>({ config: outputs, cookies })
  const allPosts = await listAll((t) =>
    client.models.Post.list({ nextToken: t, limit: 500 })
  )

  const cognito    = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION ?? 'us-east-1' })
  const { Users }  = await cognito.send(new ListUsersCommand({
    UserPoolId: process.env.AMPLIFY_USERPOOL_ID ?? '',
  })).catch(() => ({ Users: [] }))

  const publishedPosts = allPosts.filter((p) => p.status === 'PUBLISHED').length
  const draftPosts     = allPosts.filter((p) => p.status === 'DRAFT').length
  const totalPosts     = allPosts.length
  const totalUsers     = Users?.length ?? 0
  const monthlyData    = buildMonthlyData(allPosts)
  const statusData     = [
    { name: 'Publicados', value: publishedPosts },
    { name: 'Rascunhos',  value: draftPosts },
  ]

  const recentPosts = [...allPosts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  const now       = new Date()
  const thisMonth = allPosts.filter((p) => {
    const d = new Date(p.createdAt)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }).length
  const lastMonth = allPosts.filter((p) => {
    const d  = new Date(p.createdAt)
    const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return d.getFullYear() === lm.getFullYear() && d.getMonth() === lm.getMonth()
  }).length
  const monthDiff = thisMonth - lastMonth
  const monthSign = monthDiff > 0 ? `+${monthDiff}` : `${monthDiff}`

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="font-title text-3xl uppercase text-contrast tracking-wide">Dashboard</h1>
        <p className="font-body text-contrast/50 text-sm mt-1">
          Bem-vindo, {session.name} · {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total de posts"  value={totalPosts}      accent />
        <StatCard label="Publicados"      value={publishedPosts}  sub={`${Math.round(publishedPosts / Math.max(totalPosts, 1) * 100)}% do total`} />
        <StatCard label="Rascunhos"       value={draftPosts} />
        <StatCard label="Usuários"        value={totalUsers} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <PostsByMonthChart data={monthlyData} />
        <PostsByStatusChart data={statusData} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="font-title text-xl text-accent uppercase tracking-wide">
              {thisMonth} {monthDiff !== 0 && <span className="text-sm font-body">({monthSign})</span>}
            </p>
            <p className="font-body text-xs text-contrast/50">Posts este mês</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-contrast/40 shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-title text-xl text-contrast uppercase tracking-wide">{lastMonth}</p>
            <p className="font-body text-xs text-contrast/50">Posts mês anterior</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-contrast/40 shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="font-title text-xl text-contrast uppercase tracking-wide">{totalUsers}</p>
            <p className="font-body text-xs text-contrast/50">Membros da equipe</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-title text-base uppercase text-contrast tracking-wide">Atividade recente</h2>
          <a href="/admin/posts" className="font-body text-sm text-accent hover:text-accent/80 transition-colors">
            Ver todos →
          </a>
        </div>
        <div className="divide-y divide-gray-50">
          {recentPosts.length === 0 && (
            <p className="font-body text-contrast/40 text-sm px-6 py-8 text-center">Nenhum post ainda.</p>
          )}
          {recentPosts.map((post) => (
            <div key={post.id} className="px-6 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full shrink-0 ${post.status === 'PUBLISHED' ? 'bg-accent' : 'bg-gray-300'}`} />
                <div className="min-w-0">
                  <p className="font-body text-sm font-medium text-contrast truncate">{post.title}</p>
                  <p className="font-body text-xs text-contrast/40 mt-0.5">
                    {post.authorName} · {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-body text-xs font-semibold ${
                  post.status === 'PUBLISHED' ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-gray-500'
                }`}>
                  {post.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                </span>
                <a
                  href={`/admin/posts/${post.id}/edit`}
                  className="font-body text-xs text-contrast/40 hover:text-accent transition-colors"
                >
                  Editar
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top posts por visualizações */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-title text-base uppercase text-contrast tracking-wide">Top Posts por Visualizações</h2>
          <a href="/admin/posts" className="font-body text-sm text-accent hover:text-accent/80 transition-colors">
            Ver todos →
          </a>
        </div>
        <div className="divide-y divide-gray-50">
          {allPosts
            .filter((p) => p.status === 'PUBLISHED')
            .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
            .slice(0, 8)
            .map((post, i) => {
              const maxViews = Math.max(...allPosts.map((p) => p.views ?? 0), 1)
              const pct = Math.round(((post.views ?? 0) / maxViews) * 100)
              return (
                <div key={post.id} className="px-6 py-3 flex items-center gap-4">
                  <span className="font-title text-xl text-accent/30 leading-none w-5 shrink-0 select-none">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body text-sm font-medium text-contrast truncate hover:text-accent transition-colors"
                      >
                        {post.title}
                      </a>
                      <span className="font-body text-xs text-contrast/50 shrink-0 tabular-nums">
                        {(post.views ?? 0).toLocaleString('pt-BR')} views
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent/60 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          {allPosts.filter((p) => p.status === 'PUBLISHED').length === 0 && (
            <p className="font-body text-contrast/40 text-sm px-6 py-8 text-center">Nenhum post publicado ainda.</p>
          )}
        </div>
      </div>

      {/* Categorias mais usadas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
          <h3 className="font-title text-sm uppercase text-contrast tracking-wide mb-4">Categorias</h3>
          {(() => {
            const catCount: Record<string, number> = {}
            for (const p of allPosts) {
              for (const c of p.categories ?? []) {
                if (c) catCount[c] = (catCount[c] ?? 0) + 1
              }
            }
            const entries = Object.entries(catCount).sort((a, b) => b[1] - a[1])
            const max = entries[0]?.[1] ?? 1
            return entries.length === 0 ? (
              <p className="font-body text-xs text-contrast/40">Nenhuma categoria.</p>
            ) : (
              <div className="space-y-2.5">
                {entries.map(([cat, count]) => (
                  <div key={cat} className="flex items-center gap-3">
                    <span className="font-body text-xs font-semibold text-contrast/70 w-28 truncate">{cat}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-accent/50 rounded-full" style={{ width: `${Math.round((count / max) * 100)}%` }} />
                    </div>
                    <span className="font-body text-xs text-contrast/40 tabular-nums w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            )
          })()}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
          <h3 className="font-title text-sm uppercase text-contrast tracking-wide mb-4">Ações rápidas</h3>
          <div className="space-y-2">
            <a href="/admin/posts/new" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0 group-hover:bg-accent/20 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="font-body text-sm text-contrast/70">Novo post</span>
            </a>
            <a href="/admin/posts" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-contrast/40 shrink-0 group-hover:bg-gray-200 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-body text-sm text-contrast/70">Gerenciar posts</span>
            </a>
            <a href="/admin/team" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-contrast/40 shrink-0 group-hover:bg-gray-200 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="font-body text-sm text-contrast/70">Equipe</span>
            </a>
            <a href="/blog" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-contrast/40 shrink-0 group-hover:bg-gray-200 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
              <span className="font-body text-sm text-contrast/70">Ver blog no site</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
