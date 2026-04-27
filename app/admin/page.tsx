import { redirect } from 'next/navigation'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'
import { CognitoIdentityProviderClient, ListUsersCommand } from '@aws-sdk/client-cognito-identity-provider'
import { cookies } from 'next/headers'
import outputs from '@/amplify_outputs.json'
import type { Schema } from '@/amplify/data/resource'
import { getSession } from '@/lib/session'
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
  const { data: allPosts } = await client.models.Post.list({
    filter: undefined,
  })

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

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="font-body text-sm font-semibold text-blue-700">Métricas de acesso ao site</p>
          <p className="font-body text-xs text-blue-500 mt-0.5">
            Para visualizar visitas, sessões e origens de tráfego em tempo real, conecte o{' '}
            <strong>AWS Amplify Analytics</strong> ou <strong>Google Analytics</strong> ao projeto.
          </p>
        </div>
      </div>
    </div>
  )
}
