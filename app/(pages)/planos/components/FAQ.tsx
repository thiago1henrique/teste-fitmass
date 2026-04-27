'use client'

import { useState } from 'react'

const faqs = [
  {
    question: 'A balança tem garantia?',
    answer:
      'Sim, todos os equipamentos Fitmass possuem garantia de 12 meses contra defeitos de fabricação e suporte técnico nacional.',
  },
  {
    question: 'Preciso pagar taxa de instalação?',
    answer:
      'Não. O sistema é Plug & Play e nosso processo de onboarding é 100% guiado para que você comece a usar no mesmo dia.',
  },
  {
    question: 'O software integra com meu sistema de gestão?',
    answer:
      'Sim, possuímos APIs de integração facilitada para os principais softwares de gestão de academias do mercado.',
  },
  {
    question: 'Como funciona o App para o aluno?',
    answer:
      'O aluno baixa o App e acessa os resultados instantaneamente após a pesagem, podendo acompanhar sua evolução através de gráficos intuitivos.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) =>
    setOpenIndex((prev) => (prev === i ? null : i))

  return (
    <section
      id="faq"
      className="py-16 px-4 bg-surface"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            Dúvidas Frequentes
          </span>
          <h2
            id="faq-heading"
            className="font-title text-5xl uppercase text-contrast tracking-wide mb-3"
          >
            Perguntas Frequentes
          </h2>
          <p className="text-contrast/60 font-body">
            Tudo que você precisa saber antes de começar.
          </p>
        </div>

        {/* FAQPage JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map(({ question, answer }) => ({
                '@type': 'Question',
                name: question,
                acceptedAnswer: { '@type': 'Answer', text: answer },
              })),
            }),
          }}
        />

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
                    aria-controls={`faq-answer-${index}`}
                  >
                    {/* Número */}
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-title text-sm flex-shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-accent text-white'
                          : 'bg-accent/10 text-accent'
                      }`}
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="font-body font-semibold text-contrast flex-1">
                      {faq.question}
                    </span>

                    {/* Plus → X */}
                    <svg
                      className={`w-5 h-5 text-accent flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </dt>

                <dd
                  id={`faq-answer-${index}`}
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
