import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import LoginForm from './LoginForm'

export const metadata = { title: 'Login | Admin Fitmass' }

export default async function LoginPage() {
  const session = await getSession()
  if (session) redirect('/admin')

  return (
    <div className="min-h-screen bg-contrast flex items-center justify-center p-4">
      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://fitmass.com.br/wp-content/uploads/2023/05/Logo-Fitmass-branca.svg"
            alt="Fitmass"
            className="h-10 w-auto mx-auto mb-6"
          />
          <h1 className="font-title text-2xl uppercase text-white tracking-wide">
            Área Administrativa
          </h1>
          <p className="font-body text-white/40 text-sm mt-1">
            Acesso restrito a membros da equipe
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl shadow-black/30">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
