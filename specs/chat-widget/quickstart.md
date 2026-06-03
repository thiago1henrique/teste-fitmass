# Quickstart: Chat Widget Flutuante

**Date**: 2026-06-02 | **Branch**: `feat/chat-widget`

Guia de implementação passo a passo. Cada passo corresponde a uma ou mais tasks em `tasks.md`.

---

## Pré-requisito: Amplify Sandbox

```bash
npx ampx sandbox
```

Aguardar o sandbox re-criar o schema após o passo 1 (adicionar modelo). O app não inicia sem `amplify_outputs.json` atualizado.

---

## Passo 1: Adicionar modelo ChatQuestion ao schema Amplify

**Arquivo**: `amplify/data/resource.ts`

Inserir após o modelo `LinkItem`, antes do fechamento do `a.schema({...})`:

```typescript
ChatQuestion: a
  .model({
    question:    a.string().required(),
    answer:      a.string(),
    actionType:  a.enum(['ANSWER', 'WHATSAPP']),
    whatsappMsg: a.string(),
    order:       a.integer().required(),
    active:      a.boolean().default(true),
  })
  .authorization((allow) => [
    allow.groups(['ADMIN', 'EDITOR']),
    allow.guest().to(['read']),
    allow.publicApiKey().to(['read']),
  ]),
```

Após salvar: reiniciar o `npx ampx sandbox` se já estiver rodando.

---

## Passo 2: Criar server actions (`app/actions/chat.ts`)

Seguir o padrão de `app/actions/posts.ts`:

```typescript
'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'
import { cookies } from 'next/headers'
import outputs from '@/amplify_outputs.json'
import type { Schema } from '@/amplify/data/resource'
import { requireSession } from '@/lib/auth-utils'
import { listAll } from '@/lib/list-all'

const WHATSAPP_DEFAULT = 'Olá, vim do site da Fitmass e gostaria de mais informações.'
const MAX_QUESTIONS = 5

function getClient() {
  return generateServerClientUsingCookies<Schema>({ config: outputs, cookies })
}

function invalidate() {
  revalidatePath('/', 'layout')
  revalidatePath('/admin/chat')
  revalidateTag('chat-questions')
}

// Leitura pública — sem requireSession, usa apiKey
export async function getChatQuestions() {
  const client = generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies,
    authMode: 'apiKey',
  })
  const raw = await listAll(client.models.ChatQuestion.list)
  return raw
    .filter(q => q.active !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export async function createChatQuestion(formData: FormData): Promise<{ error?: string }> {
  await requireSession()
  const client = getClient()
  
  // Count guard
  const existing = await listAll(client.models.ChatQuestion.list)
  if (existing.length >= MAX_QUESTIONS) {
    return { error: 'Limite de 5 perguntas atingido.' }
  }
  
  const question = (formData.get('question') as string)?.trim()
  const actionType = formData.get('actionType') as 'ANSWER' | 'WHATSAPP'
  const answer = actionType === 'ANSWER' ? (formData.get('answer') as string)?.trim() : null
  const whatsappMsg = actionType === 'WHATSAPP' ? (formData.get('whatsappMsg') as string)?.trim() || null : null
  const order = existing.length

  if (!question) return { error: 'Pergunta é obrigatória.' }
  if (question.length > 120) return { error: 'Pergunta deve ter no máximo 120 caracteres.' }
  if (actionType === 'ANSWER' && !answer) return { error: 'Resposta é obrigatória.' }

  await client.models.ChatQuestion.create({ question, answer, actionType, whatsappMsg, order, active: true })
  invalidate()
  return {}
}

export async function updateChatQuestion(id: string, formData: FormData): Promise<{ error?: string }> {
  await requireSession()
  const client = getClient()
  
  const question = (formData.get('question') as string)?.trim()
  const actionType = formData.get('actionType') as 'ANSWER' | 'WHATSAPP'
  const answer = actionType === 'ANSWER' ? (formData.get('answer') as string)?.trim() : null
  const whatsappMsg = actionType === 'WHATSAPP' ? (formData.get('whatsappMsg') as string)?.trim() || null : null

  if (!question) return { error: 'Pergunta é obrigatória.' }
  if (question.length > 120) return { error: 'Pergunta deve ter no máximo 120 caracteres.' }
  if (actionType === 'ANSWER' && !answer) return { error: 'Resposta é obrigatória.' }

  await client.models.ChatQuestion.update({ id, question, answer, actionType, whatsappMsg })
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
  await Promise.all(orderedIds.map((id, order) => client.models.ChatQuestion.update({ id, order })))
  invalidate()
  return {}
}

export async function seedDefaultChatQuestions(): Promise<{ error?: string }> {
  await requireSession()
  const client = getClient()
  
  const existing = await listAll(client.models.ChatQuestion.list)
  if (existing.length > 0) return { error: 'Já existem perguntas configuradas.' }
  
  const defaults = [
    { question: 'O que é a Fitmass?', answer: 'A Fitmass é uma plataforma de gestão para academias e estúdios fitness, com avaliação física por bioimpedância, gestão de alunos, planos e muito mais.', actionType: 'ANSWER' as const, whatsappMsg: null, order: 0 },
    { question: 'Quais planos vocês oferecem?', answer: 'Temos planos para academias de todos os tamanhos. Acesse fitmass.com.br/planos para ver todas as opções e preços.', actionType: 'ANSWER' as const, whatsappMsg: null, order: 1 },
    { question: 'Como funciona a avaliação física?', answer: 'Nossa avaliação usa bioimpedância multifrequencial para medir composição corporal com precisão. Os resultados ficam disponíveis instantaneamente no app do aluno.', actionType: 'ANSWER' as const, whatsappMsg: null, order: 2 },
    { question: 'Quero agendar uma demo', answer: null, actionType: 'WHATSAPP' as const, whatsappMsg: 'Olá! Gostaria de agendar uma demonstração do Fitmass.', order: 3 },
    { question: 'Fale com um atendente', answer: null, actionType: 'WHATSAPP' as const, whatsappMsg: null, order: 4 },
  ]
  
  await Promise.all(defaults.map(d => client.models.ChatQuestion.create({ ...d, active: true })))
  invalidate()
  return {}
}
```

---

## Passo 3: Criar ChatWidget.tsx (RSC wrapper)

**Arquivo**: `app/components/chat/ChatWidget.tsx`

```typescript
import { unstable_cache } from 'next/cache'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'
import { cookies } from 'next/headers'
import outputs from '@/amplify_outputs.json'
import type { Schema } from '@/amplify/data/resource'
import { listAll } from '@/lib/list-all'
import ChatWidgetClient from './ChatWidgetClient'

const getQuestions = unstable_cache(
  async () => {
    const client = generateServerClientUsingCookies<Schema>({
      config: outputs,
      cookies,
      authMode: 'apiKey',
    })
    const raw = await listAll(client.models.ChatQuestion.list)
    return raw
      .filter(q => q.active !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(q => ({
        id: q.id,
        question: q.question,
        answer: q.answer ?? null,
        actionType: (q.actionType ?? 'ANSWER') as 'ANSWER' | 'WHATSAPP',
        whatsappMsg: q.whatsappMsg ?? null,
      }))
  },
  ['chat-questions'],
  { revalidate: 60, tags: ['chat-questions'] }
)

export default async function ChatWidget() {
  try {
    const questions = await getQuestions()
    if (questions.length === 0) return null
    return <ChatWidgetClient questions={questions} />
  } catch {
    return null // fallback silencioso se DB indisponível
  }
}
```

---

## Passo 4: Criar ChatWidgetClient.tsx (UI interativa)

**Arquivo**: `app/components/chat/ChatWidgetClient.tsx`

```typescript
'use client'

import { useState } from 'react'

interface Question {
  id: string
  question: string
  answer: string | null
  actionType: 'ANSWER' | 'WHATSAPP'
  whatsappMsg: string | null
}

const WHATSAPP_BASE = 'https://api.whatsapp.com/send/?phone=5541984810567&type=phone_number&app_absent=0'
const DEFAULT_MSG = 'Olá, vim do site da Fitmass e gostaria de mais informações.'

function buildWhatsAppUrl(msg: string | null) {
  return `${WHATSAPP_BASE}&text=${encodeURIComponent(msg ?? DEFAULT_MSG)}`
}

export default function ChatWidgetClient({ questions }: { questions: Question[] }) {
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = questions.find(q => q.id === selectedId)

  function handleClick(q: Question) {
    if (q.actionType === 'WHATSAPP') {
      window.open(buildWhatsAppUrl(q.whatsappMsg), '_blank', 'noopener,noreferrer')
    } else {
      setSelectedId(q.id === selectedId ? null : q.id)
    }
  }

  return (
    <>
      {/* Painel */}
      {open && (
        <div
          className="fixed bottom-[76px] right-4 md:right-6 z-50 w-80 md:w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          role="dialog"
          aria-label="Chat de suporte"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between"
            style={{ background: 'var(--color-contrast)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-body text-white text-sm font-semibold">Como podemos ajudar?</span>
            </div>
            <button
              onClick={() => { setOpen(false); setSelectedId(null) }}
              className="text-white/50 hover:text-white transition-colors"
              aria-label="Fechar chat"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Perguntas */}
          <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
            {questions.map(q => (
              <div key={q.id}>
                <button
                  onClick={() => handleClick(q)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 font-body text-sm text-gray-700 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all duration-200 flex items-center justify-between gap-2"
                >
                  <span>{q.question}</span>
                  {q.actionType === 'WHATSAPP' ? (
                    <svg className="w-4 h-4 shrink-0 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>

                {/* Resposta inline */}
                {selectedId === q.id && q.actionType === 'ANSWER' && q.answer && (
                  <div className="mt-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="font-body text-sm text-gray-600 leading-relaxed">{q.answer}</p>
                    <button
                      onClick={() => setSelectedId(null)}
                      className="mt-2 font-body text-xs text-[var(--color-accent)] hover:underline"
                    >
                      ← Voltar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-gray-100 text-center">
            <span className="font-body text-xs text-gray-400">Powered by Fitmass</span>
          </div>
        </div>
      )}

      {/* Botão flutuante */}
      <button
        onClick={() => { setOpen(o => !o); setSelectedId(null) }}
        className="fixed bottom-6 right-4 md:right-6 z-50 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
        style={{ background: 'var(--color-accent)' }}
        aria-label={open ? 'Fechar chat' : 'Abrir chat'}
      >
        {open ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </>
  )
}
```

---

## Passo 5: Atualizar layout público

**Arquivo**: `app/(pages)/layout.tsx`

Adicionar import e widget:

```typescript
import { Suspense } from 'react'
import ChatWidget from '@/app/components/chat/ChatWidget'

// dentro do return:
<Suspense fallback={null}><ChatWidget /></Suspense>
```

---

## Passo 6: Criar página admin (`app/admin/chat/page.tsx`)

Server component seguindo padrão de `app/admin/links/page.tsx`:

```typescript
import { requireSession } from '@/lib/auth-utils'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'
import { cookies } from 'next/headers'
import outputs from '@/amplify_outputs.json'
import type { Schema } from '@/amplify/data/resource'
import { listAll } from '@/lib/list-all'
import ChatAdmin from './ChatAdmin'

export const metadata = { title: 'Chat Widget | Admin Fitmass' }

export default async function ChatPage() {
  const session = await requireSession()
  
  const client = generateServerClientUsingCookies<Schema>({ config: outputs, cookies })
  
  let questions = []
  try {
    const raw = await listAll(client.models.ChatQuestion.list)
    questions = raw.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  } catch {
    // modelo não deployado ainda
  }
  
  return <ChatAdmin questions={questions} userRole={session.role} />
}
```

---

## Passo 7: Criar ChatAdmin.tsx (CRUD UI)

**Arquivo**: `app/admin/chat/ChatAdmin.tsx`

Componente client com modal de formulário, lista de perguntas, botões ↑↓, toggle ativo e seed. Seguir exatamente o padrão de `LinksAdmin.tsx` — mesmas classes CSS, mesma estrutura de modal, mesma lógica de useTransition.

---

## Passo 8: Atualizar AdminSidebar

**Arquivo**: `app/admin/_components/AdminSidebar.tsx`

Inserir entre o item "Links" (index 3) e "Vendas" (index 4) no array `navItems`:

```typescript
{
  label: 'Chat',
  href: '/admin/chat',
  adminOnly: false,
  icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
},
```

---

## Verificação final

```bash
npm run lint     # zero errors
npm run build    # build com sucesso
npm run dev      # verificar widget na home, admin/chat funcional
```

Golden path:
1. Acesse `/admin/chat` → clique "Importar perguntas padrão" → 5 cards aparecem
2. Edite uma pergunta → salve → verifique card atualizado
3. Acesse `/` → botão flutuante visível bottom-right
4. Clique no botão → painel abre com 5 perguntas
5. Clique pergunta ANSWER → resposta expande inline
6. Clique "Fale com um atendente" → WhatsApp abre em nova aba
7. Acesse `/admin` → confirme que widget NÃO aparece
