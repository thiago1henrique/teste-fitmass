import { redirect } from 'next/navigation'
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  ListUsersInGroupCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { getSession } from '@/lib/session'
import TeamManager from './TeamManager'

// Cognito hard cap per request is 60; paginate if you expect more users
const LIST_LIMIT = 60

export const metadata = { title: 'Equipe | Admin Fitmass' }

const USER_POOL = process.env.AMPLIFY_USERPOOL_ID ?? ''

function attr(attributes: { Name?: string; Value?: string }[] | undefined, name: string) {
  return attributes?.find((a) => a.Name === name)?.Value ?? ''
}

export default async function TeamPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  if (session.role !== 'ADMIN') redirect('/admin')

  const cognito = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION ?? 'us-east-1' })

  const [{ Users: allUsers }, { Users: adminUsers }] = await Promise.all([
    cognito.send(new ListUsersCommand({ UserPoolId: USER_POOL, Limit: LIST_LIMIT })).catch(() => ({ Users: [] })),
    cognito.send(new ListUsersInGroupCommand({ UserPoolId: USER_POOL, GroupName: 'ADMIN', Limit: LIST_LIMIT })).catch(() => ({ Users: [] })),
  ])

  const adminSubs = new Set((adminUsers ?? []).map((u) => attr(u.Attributes, 'sub')))

  const users = (allUsers ?? []).map((u) => ({
    id:        attr(u.Attributes, 'sub'),
    name:      attr(u.Attributes, 'given_name') || attr(u.Attributes, 'email'),
    email:     attr(u.Attributes, 'email'),
    role:      (adminSubs.has(attr(u.Attributes, 'sub')) ? 'ADMIN' : 'EDITOR') as 'ADMIN' | 'EDITOR',
    createdAt: new Date(u.UserCreateDate ?? 0),
  }))

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
