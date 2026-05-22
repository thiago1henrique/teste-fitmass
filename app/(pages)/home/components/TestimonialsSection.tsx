const testimonials = [
  {
    text: 'A Fitmass transformou a forma como acompanho a evolução dos alunos. Os dados de bioimpedância com precisão clínica geraram um aumento real na retenção da minha academia.',
    author: 'Mariana Costa',
    role: 'Proprietária, FitCenter Premium',
    initials: 'MC',
  },
  {
    text: 'Relatórios profissionais com a minha marca fizeram toda a diferença. A academia ganhou credibilidade e hoje é referência em avaliação física na cidade.',
    author: 'Rafael Andrade',
    role: 'Gestor, Academia AlphaFit',
    initials: 'RA',
  },
  {
    text: 'A integração com nosso sistema de gestão foi simples e rápida. Em poucos dias já estávamos usando os dados da Fitmass para criar estratégias de retenção efetivas.',
    author: 'Patrícia Mendes',
    role: 'Diretora, VidaFit Studios',
    initials: 'PM',
  },
]

function StarRating() {
  return (
    <div className="flex items-center gap-0.5" aria-label="Avaliação 5 de 5 estrelas">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="w-4 h-4 fill-accent" aria-hidden="true">
          <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005z" />
        </svg>
      ))}
    </div>
  )
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div
      className="w-12 h-12 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0"
      aria-hidden="true"
    >
      <span className="font-title text-sm text-accent tracking-wide">{initials}</span>
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section
      className="bg-contrast py-20 px-4"
      aria-labelledby="depoimentos-heading"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            Depoimentos
          </span>
          <h2
            id="depoimentos-heading"
            className="font-title text-4xl md:text-5xl uppercase text-white tracking-wide leading-tight"
          >
            Academias que já transformaram resultados com a {' '}
            <span className="text-accent">Fitmass</span>
          </h2>
        </div>

        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-brand pb-4 md:grid md:grid-cols-3 md:gap-6 md:pb-0">
          {testimonials.map(({ text, author, role, initials }) => (
            <article
              key={author}
              className="snap-start shrink-0 w-[80vw] md:w-auto bg-white/5 border border-white/10 rounded-2xl p-7 flex flex-col gap-5 hover:border-accent/30 hover:bg-white/8 transition-all duration-300"
            >
              <span
                className="font-title text-5xl leading-none text-accent select-none"
                aria-hidden="true"
              >
                {'“'}
              </span>

              <StarRating />

              <p className="font-body text-white/70 text-sm leading-relaxed flex-1">
                {text}
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <Avatar initials={initials} />
                <div>
                  <p className="font-body font-semibold text-white text-sm">{author}</p>
                  <p className="font-body text-white/40 text-xs mt-0.5">{role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
