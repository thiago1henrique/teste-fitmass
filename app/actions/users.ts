'use server'

import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

async function requireAdmin() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  if (session.role !== 'ADMIN') redirect('/admin')
  return session
}

export async function createUser(formData: FormData) {
  await requireAdmin()

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = (formData.get('role') as 'ADMIN' | 'EDITOR') ?? 'EDITOR'

  if (!name || !email || !password) {
    return { error: 'Preencha todos os campos.' }
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return { error: 'E-mail já cadastrado.' }

  const hashed = await bcrypt.hash(password, 12)
  await prisma.user.create({ data: { name, email, password: hashed, role } })

  revalidatePath('/admin/team')
}

export async function deleteUser(id: string) {
  const session = await requireAdmin()

  if (session.userId === id) return { error: 'Você não pode remover a si mesmo.' }

  await prisma.user.delete({ where: { id } })
  revalidatePath('/admin/team')
}
