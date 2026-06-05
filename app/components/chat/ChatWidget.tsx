import { unstable_cache } from 'next/cache'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/data'
import outputs from '@/amplify_outputs.json'
import type { Schema } from '@/amplify/data/resource'
import { listAll } from '@/lib/list-all'
import ChatWidgetClient from './ChatWidgetClient'

Amplify.configure(outputs, { ssr: true })
const amplifyClient = generateClient<Schema>({ authMode: 'apiKey' })

type Question = {
  id: string
  question: string
  answer: string | null
  actionType: 'ANSWER' | 'WHATSAPP'
  whatsappMsg: string | null
}

const DEFAULT_QUESTIONS: Question[] = [
  { id: 'default-0', question: 'O que é a Fitmass?',           actionType: 'ANSWER',   answer: 'A Fitmass é uma plataforma de gestão para academias e estúdios fitness, com avaliação física por bioimpedância, gestão de alunos, planos e muito mais.', whatsappMsg: null },
  { id: 'default-1', question: 'Quais planos vocês oferecem?', actionType: 'ANSWER',   answer: 'Temos planos para academias de todos os tamanhos. Acesse fitmass.com.br/planos para ver todas as opções e preços.', whatsappMsg: null },
  { id: 'default-2', question: 'Como funciona a avaliação física?', actionType: 'ANSWER', answer: 'Nossa avaliação usa bioimpedância multifrequencial para medir composição corporal com precisão. Os resultados ficam disponíveis instantaneamente no app do aluno.', whatsappMsg: null },
  { id: 'default-3', question: 'Quero agendar uma demo',       actionType: 'WHATSAPP', answer: null, whatsappMsg: 'Olá! Gostaria de agendar uma demonstração do Fitmass.' },
  { id: 'default-4', question: 'Fale com um atendente',        actionType: 'WHATSAPP', answer: null, whatsappMsg: null },
]

const getQuestions = unstable_cache(
  async () => {
    const raw = await listAll((token) => amplifyClient.models.ChatQuestion.list({ nextToken: token }))
    return raw
      .filter((q) => q.active !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((q) => ({
        id:          q.id,
        question:    q.question,
        answer:      q.answer ?? null,
        actionType:  (q.actionType ?? 'ANSWER') as 'ANSWER' | 'WHATSAPP',
        whatsappMsg: q.whatsappMsg ?? null,
      }))
  },
  ['chat-questions'],
  { revalidate: 60, tags: ['chat-questions'] }
)

export default async function ChatWidget() {
  let questions: Question[] = []
  try {
    questions = await getQuestions()
  } catch {
    // model not deployed yet — fall through to defaults
  }
  if (questions.length === 0) questions = DEFAULT_QUESTIONS
  return <ChatWidgetClient questions={questions} />
}
