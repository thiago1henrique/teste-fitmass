/*
 * Sessão 3 — Marcas Parceiras
 * Fundo escuro para reforçar ritmo visual: Comparison (white) → Partners (dark) → Personalization (dark)
 * SEO: JSON-LD ItemList + aria acessível no marquee decorativo.
 */

const partners = [
  'Academia Alpha',
  'SmartBody',
  'FitCenter Pro',
  'BioSport',
  'Academia Atleta',
  'HealthClub',
  'VidaFit',
  'GymElite',
  'AcademiaForce',
  'FitLife Studio',
  'ProFit',
  'BodyTech Academy',
]

const partnersSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Academias e Profissionais que utilizam Fitmass',
  description: 'Clientes e parceiros do sistema de bioimpedância Fitmass em todo o Brasil.',
  itemListElement: partners.map((name, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: { '@type': 'Organization', name },
  })),
}

export default function PartnersBanner() {
  return (
    <section
      className="relative bg-contrast overflow-hidden"
      aria-labelledby="parceiros-heading"
    >
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(partnersSchema) }}
      />

      {/* Diagonal topo — vem do bg-white da seção anterior */}
      <div className="pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 64" preserveAspectRatio="none" className="w-full" style={{ height: 64, display: 'block' }}>
          <polygon fill="#ffffff" points="0,0 1440,0 0,64" />
        </svg>
      </div>

      <div className="py-8 px-4">
        <div className="max-w-5xl mx-auto px-4 mb-6 text-center">
          <h2
            id="parceiros-heading"
            className="font-title text-2xl md:text-3xl uppercase text-white tracking-wide mb-3"
          >
            TECNOLOGIA UTILIZADA POR ACADEMIAS E PROFISSIONAIS EM TODO O BRASIL
          </h2>
          <p className="font-body text-white/50">
            Junte-se aos líderes do mercado que confiam na precisão Fitmass para fidelizar alunos.
          </p>
        </div>

        {/* Marquee — decorativo */}
        <div className="relative" aria-hidden="true">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-contrast to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-contrast to-transparent" />

          <div className="flex overflow-hidden">
            <ul
              className="flex gap-14 animate-marquee whitespace-nowrap"
              style={{ willChange: 'transform' }}
            >
              {[...partners, ...partners].map((name, i) => (
                <li
                  key={i}
                  className="inline-flex items-center gap-3 font-title text-xl uppercase tracking-widest text-white/30 select-none list-none"
                >
                  <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" aria-hidden="true" />
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
