const stats = [
  { value: '+2.000', label: 'Academias atendidas' },
  { value: '98%',   label: 'Índice de satisfação' },
  { value: '12 meses', label: 'de garantia' },
  { value: 'Plug & Play', label: 'Sem instalação' },
]

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-center bg-contrast overflow-hidden"
      aria-label="Apresentação Fitmass"
    >
      {/* Glow radial topo-direita */}
      <div
        className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-accent/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      {/* Glow radial esquerda-baixo */}
      <div
        className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Grid de linhas sutil */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(136,189,35,1) 1px, transparent 1px), linear-gradient(90deg, rgba(136,189,35,1) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
        aria-hidden="true"
      />

      {/* Barra vertical accent */}
      <div
        className="absolute top-0 right-32 w-px h-full bg-gradient-to-b from-transparent via-accent/25 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Conteúdo */}
      <div className="relative max-w-6xl mx-auto w-full px-4 pt-32 pb-36 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 items-center">
        {/* Copy */}
        <div>
          <span className="inline-flex items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            Sistema de Bioimpedância Profissional
          </span>

          <h1 className="font-title text-5xl md:text-6xl lg:text-7xl uppercase text-white tracking-wide leading-[1.05] mb-8">
            AVALIAÇÃO QUE FIDELIZA.{' '}
            <span className="text-accent">RESULTADO QUE VENDE.</span>
          </h1>

          <p className="font-body text-white/65 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
            Ofereça bioimpedância com precisão clínica, relatórios profissionais
            e um app com a sua marca — do consultório à rede de franquias.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#planos"
              className="inline-flex items-center justify-center gap-2 bg-accent text-white font-body font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:bg-accent/90 transition-colors"
            >
              Ver Planos
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <a
              href="https://wa.me/5541984810567?text=Desejo%20conhecer%20mais%20sobre%20a%20Fitmass"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-white/20 text-white/80 font-body font-semibold uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:border-white/40 hover:text-white transition-colors"
            >
              Falar com Especialista
            </a>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-2 hover:bg-white/10 hover:border-accent/30 transition-all duration-300"
            >
              <span className="font-title text-accent text-2xl uppercase tracking-wide leading-none">
                {value}
              </span>
              <span className="font-body text-white/50 text-xs leading-snug">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-30 pointer-events-none select-none"
        aria-hidden="true"
      >
        <span className="font-body text-white text-[10px] uppercase tracking-[0.25em]">Desça a página</span>
        <svg className="w-4 h-4 text-white animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Diagonal divider → PlanCards (bg-surface) */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" className="w-full" style={{ height: 73, display: 'block' }}>
          <polygon fill="#F8F8F8" points="1441,-1 1441,73 -1,73" />
        </svg>
      </div>
    </section>
  )
}
