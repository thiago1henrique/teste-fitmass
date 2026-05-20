// ── Icons ─────────────────────────────────────────────────────────────────────

function ScanIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7" aria-hidden="true">
      <path strokeLinecap="round" d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
      <path strokeLinecap="round" d="M3 12h18" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path strokeLinecap="round" d="M12 18h.01" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7" aria-hidden="true">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

// ── Mock image placeholders ────────────────────────────────────────────────────

function MockScan() {
  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-contrast/5 to-contrast/10 border border-contrast/10 flex flex-col items-center justify-center gap-3">
      <div className="w-20 h-20 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
        <div className="text-accent">
          <ScanIcon />
        </div>
      </div>
      <span className="text-contrast/30 text-xs font-body">Foto do equipamento Bioscan</span>
    </div>
  )
}

function MockPhone() {
  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-contrast/5 to-contrast/10 border border-contrast/10 flex flex-col items-center justify-center gap-3">
      {/* mini phone mockup */}
      <div className="relative w-16 h-27 rounded-[14px] bg-contrast border border-contrast/20 overflow-hidden shadow-lg">
        <div className="absolute inset-0.5 rounded-xl bg-[#0d0d13] flex flex-col">
          <div className="h-5 bg-accent flex items-center justify-center">
            <span className="text-white text-[6px] font-bold uppercase tracking-wider">Fitmass</span>
          </div>
          <div className="flex-1 px-1.5 pt-1.5 flex flex-col gap-1">
            {[72, 45, 80].map((pct, i) => (
              <div key={i}>
                <div className="h-0.5 rounded-full bg-white/8 overflow-hidden">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="px-1.5 pb-1.5">
            <div className="h-4 rounded-md bg-accent flex items-center justify-center">
              <span className="text-white text-[5px] font-bold uppercase tracking-wider">Ver Relatório</span>
            </div>
          </div>
        </div>
      </div>
      <span className="text-contrast/30 text-xs font-body">Tela inicial do App Fitmass</span>
    </div>
  )
}

function MockChart() {
  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-contrast/5 to-contrast/10 border border-contrast/10 flex flex-col items-center justify-center gap-3">
      {/* mini bar chart */}
      <div className="flex items-end gap-1.5 h-14">
        {[40, 55, 48, 70, 62, 85, 78].map((h, i) => (
          <div
            key={i}
            className="w-4 rounded-t-sm"
            style={{
              height: `${h}%`,
              backgroundColor: i === 5 ? '#88BD23' : `rgba(136,189,35,${0.25 + i * 0.08})`,
            }}
          />
        ))}
      </div>
      <span className="text-contrast/30 text-xs font-body">Gráfico de evolução mensal</span>
    </div>
  )
}

function MockResult() {
  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-contrast/5 to-contrast/10 border border-contrast/10 flex flex-col items-center justify-center gap-3">
      <div className="flex items-center gap-2">
        {/* two avatar circles */}
        <div className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent/40 flex items-center justify-center">
          <span className="text-accent font-bold text-sm">AL</span>
        </div>
        <div className="w-12 h-12 rounded-full bg-secondary/20 border-2 border-secondary/40 flex items-center justify-center">
          <span className="text-secondary font-bold text-sm">PR</span>
        </div>
      </div>
      <span className="text-contrast/30 text-xs font-body">Aluno e profissional</span>
    </div>
  )
}

// ── Data ──────────────────────────────────────────────────────────────────────

const steps = [
  {
    number: '01',
    label: 'A Medição',
    sublabel: 'Rápida e Intuitiva',
    Icon: ScanIcon,
    MockImage: MockScan,
    text: 'O aluno realiza a própria avaliação por bioimpedância de forma 100% autônoma no equipamento da academia (ou através do celular do Personal com o app Pocket). Em segundos, a leitura é concluída.',
  },
  {
    number: '02',
    label: 'O App Fitmass',
    sublabel: 'Dados Imediatos',
    Icon: PhoneIcon,
    MockImage: MockPhone,
    text: 'Os resultados vão direto para o smartphone do aluno. Ele descobre, na hora, seu percentual de gordura, massa muscular, água corporal, taxa metabólica e muito mais.',
  },
  {
    number: '03',
    label: 'O Acompanhamento',
    sublabel: 'Evolução Visual',
    Icon: ChartIcon,
    MockImage: MockChart,
    text: 'Com o histórico salvo no aplicativo, o aluno visualiza gráficos claros de seu progresso mês a mês, entendendo exatamente como o corpo está reagindo aos treinos.',
  },
  {
    number: '04',
    label: 'O Resultado',
    sublabel: 'Treino e Dieta Ajustados',
    Icon: TargetIcon,
    MockImage: MockResult,
    text: 'Munido de dados reais, o aluno e o profissional ajustam os treinos e a alimentação com precisão, garantindo metas alcançadas, motivação em alta e menos desistências.',
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function HowItWorksSection() {
  return (
    <section
      id="como-funciona"
      className="relative pt-20 pb-28 px-4 bg-surface overflow-hidden"
      aria-labelledby="como-funciona-heading"
    >
      {/* Subtle background accent */}
      <div
        className="absolute top-0 right-0 w-150 h-150 rounded-full blur-3xl pointer-events-none opacity-[0.04]"
        style={{ backgroundColor: '#88BD23', transform: 'translate(30%, -30%)' }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto">

        {/* ── Heading ─────────────────────────────────────────────────────────── */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            Como Funciona
          </span>
          <h2
            id="como-funciona-heading"
            className="font-title text-4xl md:text-5xl uppercase text-contrast tracking-wide leading-tight mb-4"
          >
            A EVOLUÇÃO NA PALMA DA MÃO:{' '}
            <span className="text-accent">COMO O FITMASS FUNCIONA</span>{' '}
            PARA O SEU ALUNO
          </h2>
          <p className="font-body text-contrast/55 text-lg max-w-2xl mx-auto leading-relaxed">
            Uma jornada simples, rápida e autônoma que transforma dados em motivação diária.
          </p>
        </div>

        {/* ── Steps grid ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map(({ number, label, sublabel, text, Icon, MockImage }, idx) => (
            <div key={number} className="relative flex flex-col">

              {/* Connector line between cards (desktop only) */}
              {idx < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-[calc(theme(spacing.14)_+_0.5px)] left-[calc(100%_-_0.75rem)] w-6 z-10"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 16" fill="none" className="w-6 h-4 text-accent/30">
                    <path d="M0 8h20M14 2l6 6-6 6" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}

              {/* Card */}
              <div className="group flex flex-col h-full bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-accent/25 hover:shadow-lg hover:shadow-accent/8 transition-all duration-300">

                {/* Step number + icon bar */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                  <span className="font-title text-4xl text-accent/20 leading-none tracking-tight select-none">
                    {number}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                    <Icon />
                  </div>
                </div>

                {/* Mock image area */}
                <div className="px-5 pb-4">
                  <MockImage />
                </div>

                {/* Text */}
                <div className="px-5 pb-6 flex flex-col flex-1">
                  <div className="mb-3">
                    <h3 className="font-title text-lg uppercase text-contrast tracking-wide leading-tight">
                      {label}
                    </h3>
                    <p className="font-body text-accent text-xs font-semibold uppercase tracking-widest mt-0.5">
                      {sublabel}
                    </p>
                  </div>
                  <p className="font-body text-contrast/60 text-sm leading-relaxed">
                    {text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diagonal → AiFitSimulator (bg-surface — same color, subtle visual separator) */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="w-full" style={{ height: 48, display: 'block' }}>
          <polygon fill="rgba(136,189,35,0.06)" points="0,48 1440,48 1440,0" />
        </svg>
      </div>
    </section>
  )
}
