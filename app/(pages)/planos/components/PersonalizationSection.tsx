const highlights = [
  { value: 'Sua Logo',    label: 'no App'         },
  { value: 'Suas Cores',  label: 'na interface'   },
  { value: 'Seu Domínio', label: 'na plataforma'  },
]

export default function PersonalizationSection() {
  return (
    <section
      id="personalizacao"
      className="relative py-20 px-4 bg-contrast overflow-hidden"
      aria-labelledby="personalizacao-heading"
    >
      {/* Glow decorativo */}
      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/8 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Texto */}
        <div>
          <p className="font-body text-accent font-semibold uppercase text-sm tracking-widest mb-4">
            White Label & Personalização
          </p>

          <h2
            id="personalizacao-heading"
            className="font-title text-4xl md:text-5xl uppercase text-white tracking-wide mb-8 leading-tight"
          >
            SUA MARCA,
            <br />
            NOSSA TECNOLOGIA.
          </h2>

          <p className="font-body text-white/80 text-lg leading-relaxed mb-4">
            Fortaleça a identidade da sua academia e aumente sua retenção. Com o
            sistema Fitmass, o aluno não recebe apenas dados; ele vive uma{' '}
            <strong className="text-white font-semibold">experiência exclusiva</strong>{' '}
            dentro de um aplicativo personalizado com as suas cores e sua logo.
          </p>

          <p className="font-body text-white/55 leading-relaxed">
            Transforme a avaliação física em uma poderosa ferramenta de marketing e autoridade.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {highlights.map(({ value, label }) => (
              <div
                key={value}
                className="text-center bg-white/5 border border-white/10 rounded-xl py-4 px-2"
              >
                <div className="font-title text-accent text-lg uppercase tracking-wide">{value}</div>
                <div className="font-body text-white/45 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mockup */}
        <div className="relative flex justify-center lg:justify-end">
          <div
            className="relative w-56 h-[400px] rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col overflow-hidden shadow-2xl"
            aria-label="Mockup do app personalizado com marca da academia"
            role="img"
          >
            {/* Status bar */}
            <div className="h-10 bg-accent flex items-center justify-between px-4 shrink-0">
              <span className="font-title text-white text-xs uppercase tracking-widest">Sua Academia</span>
              <span className="w-2 h-2 rounded-full bg-white/40" aria-hidden="true" />
            </div>

            <div className="flex-1 p-4 flex flex-col gap-3">
              {/* Logo placeholder */}
              <div className="h-20 rounded-2xl bg-accent/20 border border-accent/20 flex items-center justify-center">
                <span className="font-title text-accent/60 text-xs uppercase tracking-wider text-center px-2">
                  Seu Logo Aqui
                </span>
              </div>

              {/* Métricas simuladas */}
              {[
                { label: 'Massa Magra',  w: '85%', v: '52.3kg' },
                { label: 'Gordura',      w: '48%', v: '18.2%' },
                { label: 'Hidratação',   w: '74%', v: '61.4%' },
              ].map(({ label, w, v }) => (
                <div key={label} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-body text-white/55 text-[10px]">{label}</span>
                    <span className="font-body text-accent text-[10px] font-semibold">{v}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: w }} />
                  </div>
                </div>
              ))}

              {/* CTA simulado */}
              <div className="mt-auto h-9 rounded-xl bg-accent flex items-center justify-center">
                <span className="font-body text-white text-xs font-bold uppercase tracking-wide">
                  Ver Relatório Completo
                </span>
              </div>
            </div>
          </div>

          {/* Glow */}
          <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-full scale-75 -z-10" aria-hidden="true" />
        </div>
      </div>

      {/* Diagonal → FAQ (bg-surface) */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" className="w-full" style={{ height: 72, display: 'block' }}>
          <polygon fill="#F8F8F8" points="0,72 1440,72 1440,0" />
        </svg>
      </div>
    </section>
  )
}
