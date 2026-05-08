'use server'

import { revalidatePath } from 'next/cache'
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminAddUserToGroupCommand,
  AdminDeleteUserCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { requireAdmin, auditLog } from '@/lib/auth-utils'

const cognito = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION ?? 'us-east-1',
})
const USER_POOL_ID = process.env.AMPLIFY_USERPOOL_ID ?? ''

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function createUser(formData: FormData) {
  const session  = await requireAdmin()
  const name     = (formData.get('name') as string)?.trim()
  const email    = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string
  const role     = (formData.get('role') as 'ADMIN' | 'EDITOR') ?? 'EDITOR'

  if (!name || !email || !password) {
    return { error: 'Preencha todos os campos.' }
  }
  if (!EMAIL_RE.test(email)) {
    return { error: 'E-mail inválido.' }
  }
  if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { error: 'A senha deve ter ao menos 8 caracteres, uma letra maiúscula e um número.' }
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
    // Generic message for all cases to prevent user enumeration
    if (msg.includes('UsernameExistsException')) {
      return { error: 'Não foi possível criar o usuário. Verifique os dados e tente novamente.' }
    }
    return { error: 'Erro ao criar usuário. Tente novamente.' }
  }

  auditLog('user_created', session.userId, { email, role })
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

  auditLog('user_deleted', session.userId, { cognitoUsername })
  revalidatePath('/admin/team')
}
