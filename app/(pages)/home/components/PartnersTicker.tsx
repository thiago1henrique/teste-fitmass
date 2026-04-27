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

export default function PartnersTicker() {
  return (
    <section
      className="relative bg-contrast overflow-hidden"
      aria-labelledby="parceiros-home-heading"
    >
      {/* Separador sutil do hero */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden="true" />

      <div className="py-10 px-4">
        <div className="max-w-5xl mx-auto mb-7 text-center">
          <h2
            id="parceiros-home-heading"
            className="font-title text-2xl md:text-3xl uppercase text-white tracking-wide mb-3"
          >
            TECNOLOGIA UTILIZADA PELAS MAIORES REDES DO BRASIL
          </h2>
          <p className="font-body text-white/50">
            Junte-se a mais de 2.000 academias que confiam na precisão Fitmass para fidelizar alunos.
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
                  <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
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
