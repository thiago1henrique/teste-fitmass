import { redirect } from 'next/navigation'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'
import { cookies } from 'next/headers'
import outputs from '@/amplify_outputs.json'
import type { Schema } from '@/amplify/data/resource'
import { getSession } from '@/lib/session'
import { listAll } from '@/lib/list-all'
import ChatAdmin from './ChatAdmin'

export const metadata = { title: 'Chat Widget | Admin Fitmass' }

export default async function ChatAdminPage() {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  const client = generateServerClientUsingCookies<Schema>({ config: outputs, cookies })

  let rawQuestions: Awaited<ReturnType<typeof client.models.ChatQuestion.list>>['data'] = []

  try {
    rawQuestions = await listAll((t) => client.models.ChatQuestion.list({ nextToken: t }))
  } catch {
    // Model not yet deployed — show empty admin with seed button
  }

  const questions = rawQuestions
    .map((q) => ({
      id:          q.id,
      question:    q.question,
      answer:      q.answer ?? null,
      actionType:  (q.actionType ?? 'ANSWER') as 'ANSWER' | 'WHATSAPP',
      whatsappMsg: q.whatsappMsg ?? null,
      order:       q.order ?? 0,
      active:      q.active ?? true,
    }))
    .sort((a, b) => a.order - b.order)

  return <ChatAdmin questions={questions} />
}
