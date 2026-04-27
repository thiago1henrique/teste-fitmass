'use server'

import { redirect } from 'next/navigation'
import { signIn, signOut } from 'aws-amplify/auth'

export type LoginState = {
  error?: string
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email    = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Preencha todos os campos.' }
  }

  try {
    await signIn({ username: email, password })
  } catch {
    return { error: 'E-mail ou senha inválidos.' }
  }

  redirect('/admin')
}

export async function logoutAction() {
  await signOut()
  redirect('/admin/login')
}
