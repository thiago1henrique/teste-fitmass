const trustIndicators = [
  'Garantia de 12 meses',
  'Suporte técnico nacional',
  'Instalação plug & play',
  'Dados protegidos (LGPD)',
]

export default function CTASection() {
  return (
    <section
      id="contato"
      className="relative bg-contrast overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Diagonal topo — vem do bg-surface da seção FAQ */}
      <div className="pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" className="w-full" style={{ height: 72, display: 'block' }}>
          <polygon fill="#F8F8F8" points="0,0 1440,0 0,72" />
        </svg>
      </div>

      {/* Glow central (accent) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-accent/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      {/* Glows laterais (secondary) */}
      <div
        className="absolute -top-16 -left-16 w-87.5 h-87.5 rounded-full bg-secondary/8 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-16 -right-16 w-70 h-70 rounded-full bg-secondary/6 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Grid de linhas */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(136,189,35,1) 1px, transparent 1px), linear-gradient(90deg, rgba(136,189,35,1) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-3xl mx-auto text-center px-4 py-16">
        <span className="inline-flex items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
          Comece Hoje Mesmo
        </span>

        <h2
          id="cta-heading"
          className="font-title text-4xl md:text-5xl uppercase text-white tracking-wide mb-6 leading-tight"
        >
          PRONTO PARA ELEVAR O{' '}
          <span className="text-accent">NÍVEL DA SUA ACADEMIA?</span>
        </h2>

        <p className="font-body text-white/55 text-lg mb-12 max-w-xl mx-auto">
          Escolha o plano que melhor se adapta ao seu negócio e comece hoje mesmo.
        </p>

        <a
          href="https://wa.me/5541984810567?text=Desejo%20come%C3%A7ar%20com%20o%20Fitmass%20na%20minha%20academia"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-accent text-white font-body font-bold text-base uppercase tracking-widest px-12 py-5 rounded-2xl hover:bg-accent/90 active:scale-95 transition-all duration-200 shadow-2xl shadow-accent/30"
        >
          QUERO COMEÇAR AGORA
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {trustIndicators.map((label) => (
            <div key={label} className="flex items-center gap-2 text-white/35 font-body text-sm">
              <svg className="w-3.5 h-3.5 text-accent/70 shrink-0" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
