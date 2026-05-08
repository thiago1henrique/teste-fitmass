'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { signIn, signOut } from 'aws-amplify/auth'
import { checkRateLimit } from '@/lib/rate-limit'

export type LoginState = {
  error?: string
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const ip = ((await headers()).get('x-forwarded-for') ?? 'unknown').split(',')[0].trim()

  if (!checkRateLimit(`login:${ip}`, 5, 60_000)) {
    return { error: 'Muitas tentativas. Aguarde um minuto e tente novamente.' }
  }

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
