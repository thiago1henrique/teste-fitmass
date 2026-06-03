'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, X, ExternalLink, ChevronUp, ChevronDown, MessageSquare } from 'lucide-react'
import {
  createChatQuestion,
  updateChatQuestion,
  deleteChatQuestion,
  toggleChatQuestionActive,
  reorderChatQuestions,
  seedDefaultChatQuestions,
} from '@/app/actions/chat'

// ── Types ─────────────────────────────────────────────────────────────────────

interface QuestionData {
  id: string
  question: string
  answer: string | null
  actionType: 'ANSWER' | 'WHATSAPP'
  whatsappMsg: string | null
  order: number
  active: boolean
}

type ModalMode = { mode: 'create' } | { mode: 'edit'; item: QuestionData }

// ── Modal shell ───────────────────────────────────────────────────────────────

function Modal({ isOpen, onClose, title, children }: {
  isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode
}) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-title text-base uppercase text-contrast tracking-wide">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 -mr-1">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ── Field wrapper ─────────────────────────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block font-body text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
        {hint && <span className="ml-1 normal-case font-normal text-gray-400">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2 font-body text-sm text-contrast focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors'

// ── Question form ─────────────────────────────────────────────────────────────

function QuestionForm({ modal, onSubmit, onCancel }: {
  modal: ModalMode
  onSubmit: (fd: FormData) => Promise<void>
  onCancel: () => void
}) {
  const editing = modal.mode === 'edit' ? modal.item : null

  const [question,    setQuestion]    = useState(editing?.question ?? '')
  const [actionType,  setActionType]  = useState<'ANSWER' | 'WHATSAPP'>(editing?.actionType ?? 'ANSWER')
  const [answer,      setAnswer]      = useState(editing?.answer ?? '')
  const [whatsappMsg, setWhatsappMsg] = useState(editing?.whatsappMsg ?? '')
  const [isPending,   start]          = useTransition()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData()
    fd.set('question',    question)
    fd.set('actionType',  actionType)
    fd.set('answer',      answer)
    fd.set('whatsappMsg', whatsappMsg)
    start(() => onSubmit(fd))
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="Pergunta" hint="(máx. 120 caracteres)">
        <input
          className={inputCls}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          maxLength={120}
          placeholder="Ex: Como funciona a avaliação física?"
        />
        <p className="text-right font-body text-[10px] text-gray-400">{question.length}/120</p>
      </Field>

      {/* Tipo de ação */}
      <Field label="Tipo de ação">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setActionType('ANSWER')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border font-body text-sm font-semibold transition-all ${
              actionType === 'ANSWER'
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Resposta
          </button>
          <button
            type="button"
            onClick={() => setActionType('WHATSAPP')}
            className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border font-body text-sm font-semibold transition-all ${
              actionType === 'WHATSAPP'
                ? 'border-green-500 bg-green-50 text-green-600'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </button>
        </div>
      </Field>

      {/* Resposta (condicional) */}
      {actionType === 'ANSWER' && (
        <Field label="Resposta" hint="(máx. 500 caracteres)">
          <textarea
            className={`${inputCls} resize-none`}
            rows={4}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            maxLength={500}
            placeholder="Digite a resposta que aparecerá ao clicar na pergunta..."
          />
          <p className="text-right font-body text-[10px] text-gray-400">{answer.length}/500</p>
        </Field>
      )}

      {/* Mensagem WhatsApp (condicional) */}
      {actionType === 'WHATSAPP' && (
        <Field label="Mensagem WhatsApp" hint="(opcional)">
          <input
            className={inputCls}
            value={whatsappMsg}
            onChange={(e) => setWhatsappMsg(e.target.value)}
            placeholder="Olá! Gostaria de mais informações sobre a Fitmass."
          />
          <p className="font-body text-[10px] text-gray-400 mt-1">
            Deixe em branco para usar a mensagem padrão do site.
          </p>
        </Field>
      )}

      <div className="flex gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-200 rounded-xl font-body text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-accent text-white rounded-xl font-body text-sm font-semibold hover:bg-accent/90 disabled:opacity-50"
        >
          {isPending ? 'Salvando…' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

const MAX_QUESTIONS = 5

export default function ChatAdmin({ questions }: { questions: QuestionData[] }) {
  const router                  = useRouter()
  const [, startTransition]     = useTransition()

  const [modal,    setModal]    = useState<ModalMode | null>(null)
  const [confirm,  setConfirm]  = useState<{ id: string; question: string } | null>(null)
  const [error,    setError]    = useState<string | null>(null)
  const [seeding,  setSeeding]  = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [toggling, setToggling] = useState<string | null>(null)
  const [reordering, setReordering] = useState(false)

  function refresh() { startTransition(() => router.refresh()) }

  async function handleSubmit(fd: FormData) {
    setError(null)
    const result = modal?.mode === 'edit'
      ? await updateChatQuestion(modal.item.id, fd)
      : await createChatQuestion(fd)
    if (result?.error) { setError(result.error); return }
    setModal(null)
    refresh()
  }

  async function handleSeed() {
    setSeeding(true); setError(null)
    const result = await seedDefaultChatQuestions()
    setSeeding(false)
    if (result?.error) { setError(result.error); return }
    refresh()
  }

  async function handleDelete() {
    if (!confirm) return
    setDeleting(true); setError(null)
    try {
      const result = await deleteChatQuestion(confirm.id)
      if (result?.error) { setError(result.error); return }
      setConfirm(null)
      refresh()
    } catch {
      setError('Erro ao excluir. Tente novamente.')
    } finally {
      setDeleting(false)
    }
  }

  async function handleToggle(id: string, active: boolean) {
    setToggling(id); setError(null)
    const result = await toggleChatQuestionActive(id, active)
    setToggling(null)
    if (result?.error) { setError(result.error); return }
    refresh()
  }

  async function handleMove(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= questions.length) return

    setReordering(true); setError(null)
    const reordered = [...questions]
    const [moved] = reordered.splice(index, 1)
    reordered.splice(targetIndex, 0, moved)

    const result = await reorderChatQuestions(reordered.map((q) => q.id))
    setReordering(false)
    if (result?.error) { setError(result.error); return }
    refresh()
  }

  const canAdd = questions.length < MAX_QUESTIONS

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-3 flex-wrap">
        <div>
          <h1 className="font-title text-3xl uppercase text-contrast tracking-wide">Chat Widget</h1>
          <p className="font-body text-contrast/50 text-sm mt-1">
            Gerencie as perguntas do chatbot flutuante ({questions.length}/{MAX_QUESTIONS})
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 font-body text-sm px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <ExternalLink size={14} /> Ver site
        </a>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 font-body text-sm flex items-center gap-2">
          <X size={14} className="shrink-0" /> {error}
        </div>
      )}

      {/* Seed banner */}
      {questions.length === 0 && (
        <div className="p-4 bg-accent/5 border border-accent/20 rounded-2xl flex items-center justify-between gap-4 flex-wrap mb-8">
          <div>
            <p className="font-body text-sm font-semibold text-contrast">Nenhuma pergunta cadastrada</p>
            <p className="font-body text-xs text-gray-500 mt-0.5">
              Importe as perguntas padrão para começar rapidamente.
            </p>
          </div>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="shrink-0 inline-flex items-center gap-2 bg-accent text-white font-body font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-accent/90 disabled:opacity-50"
          >
            <MessageSquare size={14} />
            {seeding ? 'Importando…' : 'Importar perguntas padrão'}
          </button>
        </div>
      )}

      {/* Questions list */}
      {questions.length > 0 && (
        <div className="space-y-3 mb-6">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="flex items-start gap-3 p-4">
                {/* Reorder arrows */}
                <div className="flex flex-col gap-0.5 shrink-0 mt-0.5">
                  <button
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0 || reordering}
                    className="p-1 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Mover para cima"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === questions.length - 1 || reordering}
                    className="p-1 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Mover para baixo"
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className={`inline-flex items-center gap-1 font-body text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                        q.actionType === 'WHATSAPP'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-accent/10 text-accent'
                      }`}
                    >
                      {q.actionType === 'WHATSAPP' ? 'WhatsApp' : 'Resposta'}
                    </span>
                    <span className="font-body text-[10px] text-gray-400">#{index + 1}</span>
                  </div>
                  <p className="font-body text-sm font-semibold text-contrast">{q.question}</p>
                  {q.actionType === 'ANSWER' && q.answer && (
                    <p className="font-body text-xs text-gray-400 mt-1 line-clamp-2">{q.answer}</p>
                  )}
                  {q.actionType === 'WHATSAPP' && (
                    <p className="font-body text-xs text-gray-400 mt-1 italic">
                      {q.whatsappMsg ?? 'Mensagem padrão do site'}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Active toggle */}
                  <button
                    onClick={() => handleToggle(q.id, !q.active)}
                    disabled={toggling === q.id}
                    title={q.active ? 'Ativo — clique para desativar' : 'Inativo — clique para ativar'}
                    className={`shrink-0 px-2 py-0.5 rounded-full font-body text-[10px] font-semibold transition-colors disabled:opacity-50 ${
                      q.active
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {q.active ? 'Ativo' : 'Inativo'}
                  </button>

                  <button
                    onClick={() => { setModal({ mode: 'edit', item: q }); setError(null) }}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Editar pergunta"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => { setConfirm({ id: q.id, question: q.question }); setError(null) }}
                    className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Excluir pergunta"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add button */}
      <div className="relative group">
        <button
          onClick={() => { if (canAdd) { setModal({ mode: 'create' }); setError(null) } }}
          disabled={!canAdd}
          className="inline-flex items-center gap-2 border-2 border-dashed border-gray-200 text-gray-400 font-body text-sm px-5 py-3 rounded-xl hover:border-accent hover:text-accent transition-colors disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-400"
        >
          <Plus size={14} /> Nova pergunta
        </button>
        {!canAdd && (
          <span className="absolute left-0 -bottom-6 font-body text-[10px] text-gray-400">
            Limite de {MAX_QUESTIONS} perguntas atingido
          </span>
        )}
      </div>

      {/* Question modal */}
      <Modal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        title={modal?.mode === 'edit' ? 'Editar pergunta' : 'Nova pergunta'}
      >
        {modal && (
          <QuestionForm modal={modal} onSubmit={handleSubmit} onCancel={() => setModal(null)} />
        )}
      </Modal>

      {/* Confirm delete modal */}
      <Modal isOpen={!!confirm} onClose={() => setConfirm(null)} title="Confirmar exclusão">
        <p className="font-body text-sm text-gray-600 mb-6">
          Tem certeza que deseja excluir a pergunta <strong>&ldquo;{confirm?.question}&rdquo;</strong>?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setConfirm(null)}
            className="px-4 py-2 border border-gray-200 rounded-xl font-body text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-500 text-white rounded-xl font-body text-sm font-semibold hover:bg-red-600 disabled:opacity-50"
          >
            {deleting ? 'Excluindo…' : 'Excluir'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
