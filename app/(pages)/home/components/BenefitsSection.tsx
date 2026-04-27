function PrecisionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <path strokeLinecap="round" d="M12 3v2M12 19v2M3 12h2M19 12h2" />
    </svg>
  )
}

function RetentionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7" aria-hidden="true">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

function AuthorityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="12" y2="17" />
    </svg>
  )
}

function IntegrationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7" aria-hidden="true">
      <rect x="2" y="9" width="6" height="6" rx="1" />
      <rect x="16" y="3" width="6" height="6" rx="1" />
      <rect x="16" y="15" width="6" height="6" rx="1" />
      <path strokeLinecap="round" d="M8 12h4m0 0V6h4M12 12v6h4" />
    </svg>
  )
}

const benefits = [
  {
    Icon: PrecisionIcon,
    title: 'Precisão',
    description:
      'Sensores de alta tecnologia que entregam dados com precisão clínica, garantindo relatórios confiáveis para cada avaliação.',
  },
  {
    Icon: RetentionIcon,
    title: 'Retenção',
    description:
      'Gráficos de evolução que motivam o aluno a permanecer engajado e fiel à sua academia mês após mês.',
  },
  {
    Icon: AuthorityIcon,
    title: 'Autoridade',
    description:
      'Relatórios profissionais assinados com a sua marca, posicionando sua academia como referência técnica no mercado.',
  },
  {
    Icon: IntegrationIcon,
    title: 'Integração',
    description:
      'Conexão com os principais softwares de gestão de academias do mercado via API facilitada.',
  },
]

export default function BenefitsSection() {
  return (
    <section
      id="diferenciais"
      className="relative pt-16 pb-24 px-4 bg-surface"
      aria-labelledby="diferenciais-heading"
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            Por que Fitmass?
          </span>
          <h2
            id="diferenciais-heading"
            className="font-title text-4xl md:text-5xl uppercase text-contrast tracking-wide leading-tight"
          >
            TUDO QUE SUA ACADEMIA{' '}
            <span className="text-accent">PRECISA PARA CRESCER</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map(({ Icon, title, description }) => (
            <div
              key={title}
              className="group bg-white border border-gray-100 rounded-2xl p-7 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                <Icon />
              </div>
              <h3 className="font-title text-xl uppercase text-contrast tracking-wide mb-3">
                {title}
              </h3>
              <p className="font-body text-contrast/60 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Diagonal → PersonalizationHome (bg-contrast) */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 64" preserveAspectRatio="none" className="w-full" style={{ height: 64, display: 'block' }}>
          <polygon fill="#333333" points="0,64 1440,64 1440,0" />
        </svg>
      </div>
    </section>
  )
}
