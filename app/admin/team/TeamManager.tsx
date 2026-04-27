'use client'

import { useState, useTransition } from 'react'
import { createUser, deleteUser } from '@/app/actions/users'

type User = {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'EDITOR'
  createdAt: Date
}

export default function TeamManager({
  users,
  currentUserId,
}: {
  users: User[]
  currentUserId: string
}) {
  const [showForm, setShowForm] = useState(false)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteUser(id)
      if (result?.error) alert(result.error)
      setConfirmId(null)
    })
  }

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setFormError(null)
    startTransition(async () => {
      const result = await createUser(formData)
      if (result?.error) {
        setFormError(result.error)
      } else {
        setShowForm(false)
        ;(e.target as HTMLFormElement).reset()
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Add user form */}
      {showForm ? (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <h2 className="font-title text-lg uppercase text-contrast tracking-wide mb-5">
            Novo Usuário
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            {formError && (
              <p className="bg-red-50 border border-red-200 text-red-700 font-body text-sm px-4 py-3 rounded-xl">
                {formError}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-sm font-medium text-contrast/70 mb-1.5">Nome</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 font-body text-sm text-contrast focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-contrast/70 mb-1.5">E-mail</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 font-body text-sm text-contrast focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-contrast/70 mb-1.5">Senha</label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 font-body text-sm text-contrast focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
                />
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-contrast/70 mb-1.5">Perfil</label>
                <select
                  name="role"
                  defaultValue="EDITOR"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 font-body text-sm text-contrast focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
                >
                  <option value="EDITOR">Editor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="bg-accent text-white font-body font-bold uppercase tracking-widest text-sm px-6 py-2.5 rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-60"
              >
                {isPending ? 'Criando…' : 'Criar Usuário'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setFormError(null) }}
                className="border border-gray-200 text-contrast/60 font-body text-sm px-6 py-2.5 rounded-xl hover:border-gray-300 hover:text-contrast transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-accent text-white font-body font-bold uppercase tracking-widest text-sm px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Novo Usuário
        </button>
      )}

      {/* Users table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left font-body text-xs uppercase tracking-widest text-contrast/40 px-6 py-3">Nome</th>
              <th className="text-left font-body text-xs uppercase tracking-widest text-contrast/40 px-6 py-3">E-mail</th>
              <th className="text-left font-body text-xs uppercase tracking-widest text-contrast/40 px-6 py-3">Perfil</th>
              <th className="text-left font-body text-xs uppercase tracking-widest text-contrast/40 px-6 py-3">Desde</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-body text-sm font-medium text-contrast">{user.name}</td>
                <td className="px-6 py-4 font-body text-sm text-contrast/60">{user.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-body text-xs font-semibold ${
                      user.role === 'ADMIN'
                        ? 'bg-accent/10 text-accent'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {user.role === 'ADMIN' ? 'Admin' : 'Editor'}
                  </span>
                </td>
                <td className="px-6 py-4 font-body text-sm text-contrast/40">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-right">
                  {user.id !== currentUserId && (
                    confirmId === user.id ? (
                      <span className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={isPending}
                          className="font-body text-sm text-red-600 hover:text-red-700 font-semibold transition-colors disabled:opacity-50"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="font-body text-sm text-contrast/40 hover:text-contrast transition-colors"
                        >
                          Cancelar
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setConfirmId(user.id)}
                        className="font-body text-sm text-contrast/40 hover:text-red-500 transition-colors"
                      >
                        Remover
                      </button>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
