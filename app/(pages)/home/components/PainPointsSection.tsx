function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

type PainItem = { problem: string; solution: string }

type Props = {
  items?: PainItem[]
  badge?: string
  title?: React.ReactNode
  subtitle?: string
  leftHeader?: string
  rightHeader?: string
  headingId?: string
  accentHex?: string
}

const DEFAULT_ITEMS: PainItem[] = [
  {
    problem: 'Alunos abandonam sem dar explicação',
    solution: 'Acompanhe a evolução de cada aluno e antecipe o cancelamento',
  },
  {
    problem: 'Academia igual a todas as concorrentes',
    solution: 'Bioimpedância como diferencial, sua academia se destaca no mercado',
  },
  {
    problem: 'Avaliações manuais, demoradas e imprecisas',
    solution: 'Análise corporal completa com precisão clínica em menos de 1 minuto',
  },
  {
    problem: 'Sistemas desconectados, dados perdidos entre profissional e aluno',
    solution: 'Bioimpedância, app e sistema de gestão integrados: tudo em uma só plataforma',
  },
  {
    problem: 'Equipamento genérico sem nenhuma identidade com a sua academia',
    solution: 'App e bioimpedância com a sua marca, diferencial que o aluno vê todo dia',
  },
  {
    problem: 'Suporte técnico frio, você resolve os problemas sozinho',
    solution: 'Parceiro dedicado do crescimento da sua academia, do dia um em diante',
  },
]

export default function PainPointsSection({
  items = DEFAULT_ITEMS,
  badge = 'Problema & Solução',
  title = <>O QUE ESTÁ CUSTANDO{' '}<span className="text-accent">ALUNOS À SUA ACADEMIA</span></>,
  subtitle = 'Veja lado a lado o que muda quando sua academia investe em bioimpedância profissional.',
  leftHeader = 'Sem avaliação profissional',
  rightHeader = 'Com Fitmass',
  headingId = 'dores-heading',
  accentHex = '#88BD23',
}: Props) {
  return (
    <section className="py-16 px-4 bg-surface" aria-labelledby={headingId}>
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-10">
          <span
            className="inline-flex items-center gap-2 font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5"
            style={{ backgroundColor: hexToRgba(accentHex, 0.15), color: accentHex }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentHex }} aria-hidden="true" />
            {badge}
          </span>
          <h2
            id={headingId}
            className="font-title text-4xl md:text-5xl uppercase text-contrast tracking-wide leading-tight mb-4"
          >
            {title}
          </h2>
          <p className="font-body text-contrast/55 max-w-xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Tabela — layout unificado mobile + desktop */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Cabeçalho */}
          <div className="grid grid-cols-2 divide-x divide-red-100">
            <div className="flex items-center gap-2 px-3 sm:px-6 py-3 sm:py-4 bg-red-100/60 border-b border-red-200/50">
              <span className="hidden sm:flex w-5 h-5 rounded-full bg-red-100 items-center justify-center shrink-0" aria-hidden="true">
                <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
              <span className="font-title text-[10px] sm:text-sm uppercase tracking-wide text-red-800/70 leading-tight">
                {leftHeader}
              </span>
            </div>
            <div
              className="flex items-center gap-2 px-3 sm:px-6 py-3 sm:py-4 border-b"
              style={{
                backgroundColor: hexToRgba(accentHex, 0.08),
                borderBottomColor: hexToRgba(accentHex, 0.25),
              }}
            >
              <span
                className="hidden sm:flex w-5 h-5 rounded-full items-center justify-center shrink-0"
                style={{ backgroundColor: accentHex }}
                aria-hidden="true"
              >
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span
                className="font-title text-[10px] sm:text-sm uppercase tracking-wide font-semibold leading-tight"
                style={{ color: accentHex }}
              >
                {rightHeader}
              </span>
            </div>
          </div>

          {/* Linhas */}
          {items.map(({ problem, solution }, i) => (
            <div
              key={i}
              className="grid grid-cols-2 divide-x divide-red-100 border-b border-gray-200 last:border-b-0"
            >
              <div className="px-3 sm:px-6 py-3 sm:py-5 bg-red-50/70">
                <p className="font-body text-red-900/65 text-xs sm:text-sm leading-relaxed">{problem}</p>
              </div>
              <div
                className="px-3 sm:px-6 py-3 sm:py-5"
                style={{ backgroundColor: hexToRgba(accentHex, 0.05) }}
              >
                <p className="font-body text-contrast text-xs sm:text-sm leading-relaxed font-medium">{solution}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
