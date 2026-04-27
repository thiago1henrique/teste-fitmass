'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminAddUserToGroupCommand,
  AdminDeleteUserCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { getSession } from '@/lib/session'

const cognito = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION ?? 'us-east-1',
})
const USER_POOL_ID = process.env.AMPLIFY_USERPOOL_ID ?? ''

async function requireAdmin() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  if (session.role !== 'ADMIN') redirect('/admin')
  return session
}

export async function createUser(formData: FormData) {
  await requireAdmin()

  const name     = formData.get('name') as string
  const email    = formData.get('email') as string
  const password = formData.get('password') as string
  const role     = (formData.get('role') as 'ADMIN' | 'EDITOR') ?? 'EDITOR'

  if (!name || !email || !password) {
    return { error: 'Preencha todos os campos.' }
  }

  try {
    await cognito.send(new AdminCreateUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      MessageAction: 'SUPPRESS',
      UserAttributes: [
        { Name: 'email',          Value: email },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'given_name',     Value: name },
      ],
    }))

    await cognito.send(new AdminSetUserPasswordCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      Password: password,
      Permanent: true,
    }))

    await cognito.send(new AdminAddUserToGroupCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      GroupName: role,
    }))
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : ''
    if (msg.includes('UsernameExistsException')) {
      return { error: 'E-mail já cadastrado.' }
    }
    return { error: 'Erro ao criar usuário. Tente novamente.' }
  }

  revalidatePath('/admin/team')
}

export async function deleteUser(cognitoUsername: string) {
  const session = await requireAdmin()

  if (session.userId === cognitoUsername) {
    return { error: 'Você não pode remover a si mesmo.' }
  }

  try {
    await cognito.send(new AdminDeleteUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: cognitoUsername,
    }))
  } catch {
    return { error: 'Erro ao remover usuário.' }
  }

  revalidatePath('/admin/team')
}
