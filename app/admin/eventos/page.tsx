import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import EventsListClient from './EventsListClient'

export const metadata = { title: 'Eventos | Admin Fitmass' }

export default async function EventosPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  return <EventsListClient />
}
