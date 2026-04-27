'use client'

import { useState } from 'react'

const INFO = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    label: 'Federação das Indústrias do Estado do Paraná',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    label: 'Av. Com. Franco, 1341 - Jardim Botânico\nCuritiba - PR, 80215-090',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    label: '+55 41 98481-0567',
    href: 'tel:+5541984810567',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    label: 'fitmass@fitmass.com.br',
    href: 'mailto:fitmass@fitmass.com.br',
  },
]

const INPUT_CLASS =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-body text-sm text-white placeholder:text-white/30 focus:border-accent/60 focus:ring-1 focus:ring-accent/30 outline-none transition-colors duration-200'

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = encodeURIComponent(
      `Olá! Meu nome é ${form.name}.\n\nE-mail: ${form.email}\nTelefone: ${form.phone}\n\n${form.message}`,
    )
    window.open(`https://wa.me/5541984810567?text=${text}`, '_blank')
    setSent(true)
    setForm({ name: '', email: '', phone: '', message: '' })
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <section
      id="contato"
      className="relative bg-contrast overflow-hidden"
      aria-label="Entre em contato com a Fitmass"
    >
      {/* Diagonal de entrada */}
      <div className="pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" className="w-full" style={{ height: 72, display: 'block' }}>
          <polygon fill="#F8F8F8" points="0,0 1440,0 0,72" />
        </svg>
      </div>

      {/* Glows decorativos */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-accent/8 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl pointer-events-none" aria-hidden="true" />

      {/* Grid sutil */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(136,189,35,1) 1px, transparent 1px), linear-gradient(90deg, rgba(136,189,35,1) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-4 pt-12 pb-24">
        {/* Cabeçalho */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            Fale Conosco
          </span>
          <h2 className="font-title text-4xl md:text-5xl uppercase text-white tracking-wide leading-tight">
            VAMOS CONVERSAR SOBRE{' '}
            <span className="text-accent">SUA ACADEMIA</span>
          </h2>
        </div>

        {/* Grid de duas colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Coluna esquerda — informações */}
          <div className="space-y-8">
            <p className="font-body text-white/60 text-base leading-relaxed">
              Estamos prontos para mostrar como a Fitmass pode transformar os resultados da sua academia.
              Entre em contato e receba uma demonstração personalizada.
            </p>

            <ul className="space-y-6">
              {INFO.map(({ icon, label, href }, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    {icon}
                  </span>
                  {href ? (
                    <a
                      href={href}
                      className="font-body text-white/70 hover:text-accent transition-colors duration-200 text-sm leading-relaxed pt-2"
                    >
                      {label}
                    </a>
                  ) : (
                    <span className="font-body text-white/70 text-sm leading-relaxed pt-2 whitespace-pre-line">
                      {label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna direita — formulário */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/[0.03] border border-white/8 rounded-2xl p-8 space-y-4"
          >
            <div>
              <label htmlFor="contact-name" className="block font-body text-xs font-semibold uppercase tracking-widest text-white/40 mb-2">
                Seu nome
              </label>
              <input
                id="contact-name"
                type="text"
                required
                placeholder="Seu nome e sobrenome"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block font-body text-xs font-semibold uppercase tracking-widest text-white/40 mb-2">
                Seu melhor e-mail
              </label>
              <input
                id="contact-email"
                type="email"
                required
                placeholder="seuemail@email.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label htmlFor="contact-phone" className="block font-body text-xs font-semibold uppercase tracking-widest text-white/40 mb-2">
                Número de telefone
              </label>
              <input
                id="contact-phone"
                type="tel"
                placeholder="+55 41 99999-9999"
                value={form.phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 11)
                  let masked = digits
                  if (digits.length > 2) masked = `(${digits.slice(0, 2)}) ${digits.slice(2)}`
                  if (digits.length > 7) masked = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
                  setForm((f) => ({ ...f, phone: masked }))
                }}
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block font-body text-xs font-semibold uppercase tracking-widest text-white/40 mb-2">
                Mensagem
              </label>
              <textarea
                id="contact-message"
                required
                rows={4}
                placeholder="Conte um pouco sobre sua academia e o que você está buscando…"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className={`${INPUT_CLASS} resize-none`}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-accent text-white font-body font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:bg-accent/90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              {sent ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Mensagem enviada!
                </>
              ) : (
                <>
                  Enviar mensagem
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
