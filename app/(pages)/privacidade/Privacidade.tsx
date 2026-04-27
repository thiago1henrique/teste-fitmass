import PrivacyPortal from './components/PrivacyPortal'

export default function Privacidade() {
  return (
    <>
      <main>
        {/* Hero compacto */}
        <section
          className="relative bg-contrast overflow-hidden"
          aria-label="Portal de Privacidade Fitmass"
        >
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

          {/* Glow radial */}
          <div
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-accent/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative max-w-4xl mx-auto px-4 pt-36 pb-16 text-center">
            <span className="inline-flex items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
              LGPD · Lei 13.709/2018
            </span>

            <h1 className="font-title text-5xl md:text-6xl uppercase text-white tracking-wide leading-tight mb-6">
              PORTAL DE{' '}
              <span className="text-accent">PRIVACIDADE</span>
            </h1>

            <p className="font-body text-white/60 text-lg max-w-xl mx-auto">
              Transparência e respeito ao titular de dados. Consulte nossas políticas,
              exerça seus direitos e entre em contato com nosso DPO.
            </p>
          </div>

          {/* Diagonal → bg-surface */}
          <div className="pointer-events-none" aria-hidden="true">
            <svg
              viewBox="0 0 1440 72"
              preserveAspectRatio="none"
              className="w-full"
              style={{ height: 72, display: 'block' }}
            >
              <polygon fill="#F8F8F8" points="1441,-1 1441,73 -1,73" />
            </svg>
          </div>
        </section>

        <PrivacyPortal />
      </main>
    </>
  )
}
