'use client'

import { useState } from 'react'

const faqs = [
  {
    question: 'Preciso ter a balança Bioscan para oferecer o MyDay?',
    answer:
      'Sim. O MyDay está incluído nos planos Fitmass que já contemplam a Bioscan. A integração entre os dados da balança e a IA é o principal diferencial do produto: academias parceiras Fitmass já têm tudo que precisam.',
  },
  {
    question: 'A academia precisa gerenciar alguma coisa no dia a dia?',
    answer:
      'Não. Você disponibiliza o link do WhatsApp para os alunos interessados, a IA cuida do restante. Não há painel para gerenciar, nem treinamento necessário para a equipe da academia.',
  },
  {
    question: 'Como a academia envia o repasse para o Fitmass?',
    answer:
      'Simples: já vem no boleto. O repasse ao Fitmass é incluído automaticamente na mensalidade do seu plano. Sem transferências, sem burocracia, sem nada extra pra gerenciar.',
  },
  {
    question: 'Posso oferecer o MyDay para todos os alunos ou tem limite?',
    answer:
      'Não há limite de alunos. Quanto mais alunos assinarem, maior a receita recorrente para a academia.',
  },
  {
    question: 'Qual a diferença entre o Premium e o Ultra além do repasse?',
    answer:
      'No plano Ultra sua academia deixa de ser mais uma e passa a ter identidade própria. Além de todas as funcionalidades do plano Premium: o app que o aluno usa leva sua logo e suas cores, o Bioscan vira vitrine da sua marca, pesquisas para entender seus alunos e automação de processos com API e webhooks. Mais retenção, mais diferencial, mais receita. Com a mesma estrutura que você já tem.',
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

export default function FAQMyDay() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i))

  return (
    <section
      id="faq-myday"
      className="py-16 px-4 bg-surface"
      aria-labelledby="faq-myday-heading"
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
            id="faq-myday-heading"
            className="font-title text-5xl uppercase text-contrast tracking-wide mb-3"
          >
            Perguntas Frequentes
          </h2>
          <p className="text-contrast/60 font-body">
            Tudo que você precisa saber sobre o MyDay.
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
                    aria-controls={`faq-myday-answer-${index}`}
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
                  id={`faq-myday-answer-${index}`}
                  className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                    isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
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
