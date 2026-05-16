import Image from 'next/image'
import HeroBadges from './HeroBadges'

export default function HeroHome() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-center bg-contrast overflow-hidden"
      aria-label="Apresentação Fitmass"
    >
      {/* Radial glow — topo direita (accent) */}
      <div
        className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-accent/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      {/* Radial glow — baixo esquerda (secondary) */}
      <div
        className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl pointer-events-none"
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

      {/* Barra vertical accent — direita */}
      <div
        className="absolute top-0 right-32 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      {/* Barra vertical secondary — esquerda */}
      <div
        className="absolute top-0 left-32 w-px h-full bg-linear-to-b from-transparent via-secondary/15 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Conteúdo */}
      <div className="relative max-w-6xl mx-auto w-full px-4 pt-32 pb-24 grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8 lg:gap-16 items-center">

        {/* Copy */}
        <div className="lg:max-w-120">
          <span className="inline-flex items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            Agende uma demonstração
          </span>

          <h1 className="font-title text-4xl md:text-5xl lg:text-[3.25rem] uppercase text-white tracking-wide leading-[1.08] mb-6">
            Transformando dados em{' '}
            <span className="text-accent">bem-estar</span>
          </h1>

          <p className="font-body text-white/65 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
            Bioimpedância de precisão aliada a um software de gestão completo
            para elevar o nível do seu negócio.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/planos"
              className="inline-flex items-center justify-center gap-2 bg-accent text-white font-body font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:bg-accent/90 transition-colors whitespace-nowrap"
            >
              Conhecer Planos
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#diferenciais"
              className="inline-flex items-center justify-center border border-secondary/40 text-secondary font-body font-semibold uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:border-secondary hover:bg-secondary/10 transition-colors whitespace-nowrap"
            >
              Ver Diferenciais
            </a>
          </div>
        </div>

        {/* Biosan — efeito 3D, coluna dominante */}
        <div
          className="flex justify-center lg:justify-end items-center"
          role="img"
          aria-label="Balança de bioimpedância Biosan"
        >
          <div className="relative" style={{ perspective: '1000px' }}>
            {/* Glow ambiente */}
            <div
              className="absolute inset-0 -z-10 blur-3xl opacity-35 scale-100 translate-y-6"
              style={{ background: 'radial-gradient(ellipse, #88BD23 0%, transparent 70%)' }}
              aria-hidden="true"
            />
            {/* Sombra projetada */}
            <div
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-8 -z-10"
              style={{
                background: 'radial-gradient(ellipse, rgba(0,0,0,0.8) 0%, transparent 70%)',
                filter: 'blur(20px)',
              }}
              aria-hidden="true"
            />

            <HeroBadges />

            {/* Imagem com classe 3D */}
            <div className="img-3d-tilt">
              <Image
                src="/pages/landingpage/bioscan-2.png"
                alt="Balança de bioimpedância Biosan"
                width={700}
                height={980}
                className="object-contain w-full sm:max-w-125 lg:max-w-full max-h-[92vh] drop-shadow-[0_32px_80px_rgba(0,0,0,0.72)] mb-10"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Diagonal → PainPointsSection (bg-surface) */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" className="w-full" style={{ height: 72, display: 'block' }}>
          <polygon fill="#F8F8F8" points="1440,0 1440,72 0,72" />
        </svg>
      </div>
    </section>
  )
}
