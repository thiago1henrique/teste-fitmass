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
const DEFAULT_MSG   = 'Olá, vim do site da Fitmass e gostaria de mais informações.'

function buildWhatsAppUrl(msg: string | null) {
  return `${WHATSAPP_BASE}&text=${encodeURIComponent(msg ?? DEFAULT_MSG)}`
}

export default function ChatWidgetClient({ questions }: { questions: Question[] }) {
  const [open, setOpen]           = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  function handleClick(q: Question) {
    if (q.actionType === 'WHATSAPP') {
      window.open(buildWhatsAppUrl(q.whatsappMsg), '_blank', 'noopener,noreferrer')
    } else {
      setSelectedId((prev) => (prev === q.id ? null : q.id))
    }
  }

  function handleToggle() {
    setOpen((o) => !o)
    setSelectedId(null)
  }

  return (
    <>
      {/* Painel */}
      <div
        className={`fixed bottom-[100px] right-4 md:right-6 z-50 w-80 md:w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ease-out ${
          open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
        role="dialog"
        aria-label="Chat de suporte"
        aria-hidden={!open}
      >
          {/* Header */}
          <div
            className="px-5 py-4 border-b border-gray-100 flex items-center justify-between"
            style={{ background: 'var(--color-contrast)' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-body text-white text-sm font-semibold">Como podemos ajudar?</span>
            </div>
            <button
              onClick={handleToggle}
              className="text-white/50 hover:text-white transition-colors p-1 -mr-1"
              aria-label="Fechar chat"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Perguntas */}
          <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
            {questions.map((q) => (
              <div key={q.id}>
                <button
                  onClick={() => handleClick(q)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 font-body text-sm text-gray-700 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all duration-200 flex items-center justify-between gap-2"
                >
                  <span>{q.question}</span>
                  {q.actionType === 'WHATSAPP' ? (
                    <svg className="w-4 h-4 shrink-0 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
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
                      className="mt-2 font-body text-xs hover:underline"
                      style={{ color: 'var(--color-accent)' }}
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

      {/* Botão flutuante */}
      <button
        onClick={handleToggle}
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
