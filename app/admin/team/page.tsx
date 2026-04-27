import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import TeamManager from './TeamManager'

export const metadata = { title: 'Equipe | Admin Fitmass' }

export default async function TeamPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  if (session.role !== 'ADMIN') redirect('/admin')

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-title text-3xl uppercase text-contrast tracking-wide">Equipe</h1>
        <p className="font-body text-contrast/50 text-sm mt-1">{users.length} usuário(s)</p>
      </div>

      <TeamManager users={users} currentUserId={session.userId} />
    </div>
  )
}
