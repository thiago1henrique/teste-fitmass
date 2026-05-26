const partners = [
  '26 Fit',
  'Acqua',
  'Acqua Fit',
  'Acquafit',
  'Adapt',
  'Alexandre Correa Zanardi',
  'Angelo\'s Fitness',
  'Arena',
  'Arena Fitness',
  'Atenas Fit',
  'Be Healthy',
  'Blessed Studio',
  'Bluefit',
  'Bluegym',
  'Boa Forma',
  'Body One',
  'Bodyfit',
  'Bodytech',
  'Brolex',
  'Bronzati Prime',
  'Cia do Corpo',
  'Clínica Vanitá',
  'Conecta',
  'Conex',
  'Crossfit 1530',
  'DK Fit',
  'Do is Fit',
  'Dr. Wenderson Eustáquio',
  'Dropfit',
  'DS Arena',
  'Edgar Yeiko',
  'Engenharia do Corpo',
  'Espaço Sinergia',
  'Estivadores',
  'Evoque',
  'Fábrica Premium',
  'First',
  'Fit Active',
  'Fit Company',
  'Fitmoov',
  'Forever Young',
  'Forss Gym',
  'Giron Gym',
  'Gold Center Fit',
  'Grupo B Fitness',
  'GTS Academia',
  'Home Fitness',
  'Imperial Fit',
  'Instituto Euplena',
  'Iron Club',
  'Iron Lifting Club',
  'K2 Fitness',
  'La Mafia',
  'Life Fit',
  'Lifetime',
  'Marathon',
  'Mega Fit',
  'Move Concept',
  'Movimento',
  'New Gym',
  'Nova Era',
  'O2 Fitness',
  'Olímpica Boqueirão',
  'Olympia Fit',
  'Oxgym',
  'Panobianco',
  'Personal Doktor',
  'PHD',
  'Plataforma',
  'Point',
  'Ponto Zero',
  'Power Fit',
  'Power Shape',
  'Prime Force',
  'Pro Fit',
  'Qualitá Premium',
  'Quality Life',
  'Ray Fit',
  'Skyfit',
  'Smart Barra',
  'Sparta 55',
  'Starfit',
  'Studio ALegro',
  'Studio Physis',
  'Stylefit',
  'Sulimar Álvares',
  'TimeAcademia',
  'Ultra',
  'Up',
  'Usina do Corpo',
  'Viafit',
  'Vida Ativa',
  'Vip Fitness',
  'WM Fitness',
  'World Gym',
]

export default function PartnersTicker({ topDiagonal = false }: { topDiagonal?: boolean }) {
  return (
    <section
      className="relative bg-contrast overflow-hidden"
      aria-labelledby="parceiros-ticker-heading"
    >
      {topDiagonal ? (
        <div className="pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 1440 64" preserveAspectRatio="none" className="w-full" style={{ height: 64, display: 'block' }}>
            <polygon fill="#ffffff" points="0,0 1440,0 0,64" />
          </svg>
        </div>
      ) : (
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden="true" />
      )}

      <div className="py-10 px-4">
        <div className="max-w-5xl mx-auto mb-7 text-center">
          <h2
            id="parceiros-ticker-heading"
            className="font-title text-2xl md:text-3xl uppercase text-white tracking-wide mb-3"
          >
            TECNOLOGIA UTILIZADA PELAS MAIORES REDES DO BRASIL
          </h2>
          <p className="font-body text-white/50">
            Junte-se a mais de 150 academias que confiam na precisão Fitmass para fidelizar alunos.
          </p>
        </div>

        {/* Ticker — decorativo */}
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
                  <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
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
