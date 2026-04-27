'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { loginAction, type LoginState } from '@/app/actions/auth'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-accent text-white font-body font-bold uppercase tracking-widest text-sm px-6 py-3.5 rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-60"
    >
      {pending ? 'Entrando…' : 'Entrar'}
    </button>
  )
}

export default function LoginForm() {
  const [state, action] = useActionState<LoginState, FormData>(loginAction, {})

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <p className="bg-red-50 border border-red-200 text-red-700 font-body text-sm px-4 py-3 rounded-xl">
          {state.error}
        </p>
      )}

      <div>
        <label className="block font-body text-sm font-medium text-contrast/70 mb-1.5">
          E-mail
        </label>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 font-body text-sm text-contrast placeholder-contrast/30 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          placeholder="admin@fitmass.com.br"
        />
      </div>

      <div>
        <label className="block font-body text-sm font-medium text-contrast/70 mb-1.5">
          Senha
        </label>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 font-body text-sm text-contrast placeholder-contrast/30 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
          placeholder="••••••••"
        />
      </div>

      <SubmitButton />
    </form>
  )
}
