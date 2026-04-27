'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'aws-amplify/auth'

export default function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email    = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      setError('Preencha todos os campos.')
      return
    }

    setError(null)
    startTransition(async () => {
      try {
        await signIn({ username: email, password })
        router.push('/admin')
        router.refresh()
      } catch {
        setError('E-mail ou senha inválidos.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="bg-red-50 border border-red-200 text-red-700 font-body text-sm px-4 py-3 rounded-xl">
          {error}
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

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-accent text-white font-body font-bold uppercase tracking-widest text-sm px-6 py-3.5 rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-60"
      >
        {isPending ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}
