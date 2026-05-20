'use client'

import { useState } from 'react'

const faqs = [
  {
    question: 'Como o Fitmass aumenta a retenção de alunos?',
    answer:
      'O aluno acompanha sua evolução com gráficos detalhados no app, criando engajamento contínuo e motivação para permanecer na academia. Academias que utilizam o Fitmass relatam redução significativa no churn de alunos.',
  },
  {
    question: 'O equipamento possui garantia?',
    answer:
      'Sim, todos os equipamentos Fitmass possuem garantia de 12 meses contra defeitos de fabricação e suporte técnico nacional incluso em todos os planos.',
  },
  {
    question: 'O software é realmente White Label?',
    answer:
      'Sim. Nos planos Premium, ULTRA e Enterprise o aplicativo é 100% personalizado com as cores, logo e domínio da sua academia — seus alunos nunca veem a marca Fitmass.',
  },
  {
    question: 'Como é feito o suporte técnico?',
    answer:
      'Oferecemos suporte via chat, e-mail e telefone conforme o plano contratado. O plano ULTRA e Enterprise conta com gerente de conta dedicado e onboarding presencial ou remoto.',
  },
  {
    question: 'Qual a entrega técnica e prazo de implementação?',
    answer:
      'O sistema é Plug & Play: a balança conecta à sua rede e o software está pronto no mesmo dia. O processo de onboarding guiado garante que você comece a usar sem complicações técnicas.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
}

export default function FAQHome() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i))

  return (
    <section
      id="faq"
      className="py-16 px-4 bg-surface"
      aria-labelledby="faq-home-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            Dúvidas Frequentes
          </span>
          <h2
            id="faq-home-heading"
            className="font-title text-5xl uppercase text-contrast tracking-wide mb-3"
          >
            Perguntas Frequentes
          </h2>
          <p className="text-contrast/60 font-body">
            Tudo que você precisa saber antes de começar.
          </p>
        </div>

        <dl className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className={`rounded-2xl overflow-hidden border transition-colors duration-200 ${
                  isOpen
                    ? 'border-accent/40 bg-white shadow-md shadow-accent/5'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <dt>
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex items-center gap-5 px-6 py-5 text-left hover:bg-surface/60 transition-colors"
                    aria-expanded={isOpen}
                    aria-controls={`faq-home-answer-${index}`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-title text-sm shrink-0 transition-colors ${
                        isOpen ? 'bg-accent text-white' : 'bg-accent/10 text-accent'
                      }`}
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-body font-semibold text-contrast flex-1">
                      {faq.question}
                    </span>
                    <svg
                      className={`w-5 h-5 text-accent shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </dt>
                <dd
                  id={`faq-home-answer-${index}`}
                  className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                    isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="pl-[4.25rem] pr-6 pb-5 font-body text-contrast/65 leading-relaxed">
                    {faq.answer}
                  </p>
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
