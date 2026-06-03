'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'
import { cookies } from 'next/headers'
import outputs from '@/amplify_outputs.json'
import type { Schema } from '@/amplify/data/resource'
import { requireSession } from '@/lib/auth-utils'
import { listAll } from '@/lib/list-all'

const MAX_QUESTIONS = 5
const QUESTION_MAX  = 120
const ANSWER_MAX    = 500

function getClient() {
  return generateServerClientUsingCookies<Schema>({ config: outputs, cookies })
}

function invalidate() {
  revalidatePath('/', 'layout')
  revalidatePath('/admin/chat')
  revalidateTag('chat-questions', 'default')
}

export async function getChatQuestions() {
  const client = generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies,
    authMode: 'apiKey',
  })
  const raw = await listAll((token) => client.models.ChatQuestion.list({ nextToken: token }))
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
}

export async function createChatQuestion(formData: FormData): Promise<{ error?: string }> {
  await requireSession()
  const client = getClient()

  const existing = await listAll((token) => client.models.ChatQuestion.list({ nextToken: token }))
  if (existing.length >= MAX_QUESTIONS) return { error: 'Limite de 5 perguntas atingido.' }

  const question   = (formData.get('question') as string)?.trim()
  const actionType = (formData.get('actionType') as string) === 'WHATSAPP' ? 'WHATSAPP' : 'ANSWER'
  const answer     = actionType === 'ANSWER' ? (formData.get('answer') as string)?.trim() : null
  const whatsappMsg = actionType === 'WHATSAPP'
    ? ((formData.get('whatsappMsg') as string)?.trim() || null)
    : null

  if (!question)               return { error: 'Pergunta é obrigatória.' }
  if (question.length > QUESTION_MAX) return { error: `Pergunta deve ter no máximo ${QUESTION_MAX} caracteres.` }
  if (actionType === 'ANSWER' && !answer) return { error: 'Resposta é obrigatória.' }
  if (answer && answer.length > ANSWER_MAX) return { error: `Resposta deve ter no máximo ${ANSWER_MAX} caracteres.` }

  await client.models.ChatQuestion.create({
    question,
    answer,
    actionType: actionType as 'ANSWER' | 'WHATSAPP',
    whatsappMsg,
    order: existing.length,
    active: true,
  })
  invalidate()
  return {}
}

export async function updateChatQuestion(id: string, formData: FormData): Promise<{ error?: string }> {
  await requireSession()
  const client = getClient()

  const question    = (formData.get('question') as string)?.trim()
  const actionType  = (formData.get('actionType') as string) === 'WHATSAPP' ? 'WHATSAPP' : 'ANSWER'
  const answer      = actionType === 'ANSWER' ? (formData.get('answer') as string)?.trim() : null
  const whatsappMsg = actionType === 'WHATSAPP'
    ? ((formData.get('whatsappMsg') as string)?.trim() || null)
    : null

  if (!question)               return { error: 'Pergunta é obrigatória.' }
  if (question.length > QUESTION_MAX) return { error: `Pergunta deve ter no máximo ${QUESTION_MAX} caracteres.` }
  if (actionType === 'ANSWER' && !answer) return { error: 'Resposta é obrigatória.' }
  if (answer && answer.length > ANSWER_MAX) return { error: `Resposta deve ter no máximo ${ANSWER_MAX} caracteres.` }

  await client.models.ChatQuestion.update({
    id,
    question,
    answer,
    actionType: actionType as 'ANSWER' | 'WHATSAPP',
    whatsappMsg,
  })
  invalidate()
  return {}
}

export async function deleteChatQuestion(id: string): Promise<{ error?: string }> {
  await requireSession()
  const client = getClient()
  await client.models.ChatQuestion.delete({ id })
  invalidate()
  return {}
}

export async function toggleChatQuestionActive(id: string, active: boolean): Promise<{ error?: string }> {
  await requireSession()
  const client = getClient()
  await client.models.ChatQuestion.update({ id, active })
  invalidate()
  return {}
}

export async function reorderChatQuestions(orderedIds: string[]): Promise<{ error?: string }> {
  await requireSession()
  const client = getClient()
  await Promise.all(
    orderedIds.map((id, order) => client.models.ChatQuestion.update({ id, order }))
  )
  invalidate()
  return {}
}

export async function seedDefaultChatQuestions(): Promise<{ error?: string }> {
  await requireSession()
  const client = getClient()

  const existing = await listAll((token) => client.models.ChatQuestion.list({ nextToken: token }))
  if (existing.length > 0) return { error: 'Já existem perguntas configuradas.' }

  const defaults = [
    {
      question:    'O que é a Fitmass?',
      answer:      'A Fitmass é uma plataforma de gestão para academias e estúdios fitness, com avaliação física por bioimpedância, gestão de alunos, planos e muito mais.',
      actionType:  'ANSWER' as const,
      whatsappMsg: null,
      order:       0,
    },
    {
      question:    'Quais planos vocês oferecem?',
      answer:      'Temos planos para academias de todos os tamanhos. Acesse fitmass.com.br/planos para ver todas as opções e preços.',
      actionType:  'ANSWER' as const,
      whatsappMsg: null,
      order:       1,
    },
    {
      question:    'Como funciona a avaliação física?',
      answer:      'Nossa avaliação usa bioimpedância multifrequencial para medir composição corporal com precisão. Os resultados ficam disponíveis instantaneamente no app do aluno.',
      actionType:  'ANSWER' as const,
      whatsappMsg: null,
      order:       2,
    },
    {
      question:    'Quero agendar uma demo',
      answer:      null,
      actionType:  'WHATSAPP' as const,
      whatsappMsg: 'Olá! Gostaria de agendar uma demonstração do Fitmass.',
      order:       3,
    },
    {
      question:    'Fale com um atendente',
      answer:      null,
      actionType:  'WHATSAPP' as const,
      whatsappMsg: null,
      order:       4,
    },
  ]

  await Promise.all(defaults.map((d) => client.models.ChatQuestion.create({ ...d, active: true })))
  invalidate()
  return {}
}
