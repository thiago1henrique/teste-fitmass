'use client'

import { useState } from 'react'

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export interface FAQItem {
  question: string
  answer: React.ReactNode
}

interface FAQBaseProps {
  id: string
  accentHex: string
  badge: string
  heading: string
  subtitle: string
  items: FAQItem[]
  background?: string
}

export default function FAQBase({
  id,
  accentHex,
  badge,
  heading,
  subtitle,
  items,
  background = 'bg-surface',
}: FAQBaseProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i))

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: typeof answer === 'string' ? answer : '' },
    })),
  }

  return (
    <section
      id={id}
      className={`py-16 px-4 ${background}`}
      aria-labelledby={`${id}-heading`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span
            className="inline-flex items-center gap-2 font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5"
            style={{ backgroundColor: hexToRgba(accentHex, 0.15), color: accentHex }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: accentHex }}
              aria-hidden="true"
            />
            {badge}
          </span>
          <h2
            id={`${id}-heading`}
            className="font-title text-5xl uppercase text-contrast tracking-wide mb-3"
          >
            {heading}
          </h2>
          <p className="text-contrast/60 font-body">{subtitle}</p>
        </div>

        <dl className="space-y-3">
          {items.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className="rounded-2xl overflow-hidden border transition-colors duration-200 bg-white"
                style={
                  isOpen
                    ? {
                        borderColor: hexToRgba(accentHex, 0.4),
                        boxShadow: `0 4px 6px -1px ${hexToRgba(accentHex, 0.05)}`,
                      }
                    : { borderColor: '#e5e7eb' }
                }
              >
                <dt>
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex items-center gap-5 px-6 py-5 text-left hover:bg-surface/60 transition-colors"
                    aria-expanded={isOpen}
                    aria-controls={`${id}-answer-${index}`}
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center font-title text-sm shrink-0 transition-colors"
                      style={
                        isOpen
                          ? { backgroundColor: accentHex, color: '#fff' }
                          : { backgroundColor: hexToRgba(accentHex, 0.1), color: accentHex }
                      }
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-body font-semibold text-contrast flex-1">
                      {item.question}
                    </span>
                    <svg
                      className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                      style={{ color: accentHex }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </dt>
                <dd
                  id={`${id}-answer-${index}`}
                  className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                    isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="pl-[4.25rem] pr-6 pb-5 font-body text-contrast/65 leading-relaxed">
                    {item.answer}
                  </div>
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
