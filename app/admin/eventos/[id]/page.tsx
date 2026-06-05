import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import EventFormClient from './EventFormClient'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  return { title: `${id === 'novo' ? 'Novo Evento' : 'Editar Evento'} | Admin Fitmass` }
}

export default async function EventFormPage({ params }: Props) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const { id } = await params
  return <EventFormClient eventId={id} />
}
