'use client'

import { useState, useRef, useTransition } from 'react'
import { createUser, deleteUser } from '@/app/actions/users'

type User = {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'EDITOR'
  createdAt: Date
  photo: string | null
}

function Avatar({ name, photo, size = 8 }: { name: string; photo: string | null; size?: number }) {
  const [err, setErr] = useState(false)
  const cls = `w-${size} h-${size} rounded-full shrink-0 overflow-hidden flex items-center justify-center`
  if (photo && !err) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo}
        alt={name}
        onError={() => setErr(true)}
        className={`${cls} object-cover bg-gray-100`}
      />
    )
  }
  return (
    <div className={`${cls} bg-accent/20`}>
      <span className="font-body text-accent font-bold uppercase text-xs">{name.charAt(0)}</span>
    </div>
  )
}

export default function TeamManager({
  users,
  currentUserId,
}: {
  users: User[]
  currentUserId: string
}) {
  const [showForm, setShowForm]     = useState(false)
  const [confirmId, setConfirmId]   = useState<string | null>(null)
  const [formError, setFormError]   = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Photo upload state
  const [photoFile,    setPhotoFile]    = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  function resetForm() {
    setShowForm(false)
    setFormError(null)
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)
    setIsCreating(true)

    const formData = new FormData(e.currentTarget)

    if (photoFile) {
      try {
        const body = new FormData()
        body.append('file', photoFile)
        const res  = await fetch('/api/upload', { method: 'POST', body })
        const json = await res.json() as { url?: string; error?: string }
        if (json.url) formData.append('photoUrl', json.url)
      } catch {
        // photo upload failure is non-fatal
      }
    }

    const result = await createUser(formData)
    setIsCreating(false)

    if (result?.error) {
      setFormError(result.error)
    } else {
      resetForm()
    }
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteUser(id)
      if (result?.error) alert(result.error)
      setConfirmId(null)
    })
  }

  const busy = isCreating || isPending

  return (
    <div className="space-y-6">
      {/* Add user form */}
      {showForm ? (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <h2 className="font-title text-lg uppercase text-contrast tracking-wide mb-5">
            Novo Usuário
          </h2>
          <form onSubmit={handleCreate} className="space-y-5">
            {formError && (
              <p className="bg-red-50 border border-red-200 text-red-700 font-body text-sm px-4 py-3 rounded-xl">
                {formError}
              </p>
            )}

            {/* Photo upload */}
            <div>
              <label className="block font-body text-sm font-medium text-contrast/70 mb-2">
                Foto de perfil <span className="text-contrast/30 font-normal">(opcional)</span>
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                  {photoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photoPreview} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="font-body text-sm px-4 py-2 rounded-xl border border-gray-200 bg-white hover:border-accent/50 hover:bg-accent/5 transition-colors"
                  >
                    {photoPreview ? 'Trocar foto' : 'Selecionar foto'}
                  </button>
                  {photoPreview && (
                    <button
                      type="button"
                      onClick={() => { setPhotoFile(null); setPhotoPreview(null) }}
                      className="block font-body text-xs text-contrast/40 hover:text-red-500 transition-colors"
                    >
                      Remover
                    </button>
                  )}
                </div>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>

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

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={busy}
                className="bg-accent text-white font-body font-bold uppercase tracking-widest text-sm px-6 py-2.5 rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-60"
              >
                {isCreating ? 'Criando…' : 'Criar Usuário'}
              </button>
              <button
                type="button"
                onClick={resetForm}
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
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center font-body text-sm text-contrast/40">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name} photo={user.photo} />
                    <span className="font-body text-sm font-medium text-contrast">{user.name}</span>
                  </div>
                </td>
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
                          disabled={busy}
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
