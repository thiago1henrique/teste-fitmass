import { redirect } from 'next/navigation'
import { getSession } from './session'
import type { SessionPayload } from './session'

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  return session
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  if (session.role !== 'ADMIN') redirect('/admin')
  return session
}

export function auditLog(event: string, actor: string, details: Record<string, unknown>) {
  console.log(JSON.stringify({ ts: new Date().toISOString(), event, actor, ...details }))
}
