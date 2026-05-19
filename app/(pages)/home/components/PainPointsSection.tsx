const items = [
  {
    problem: 'Alunos abandonam sem dar explicação',
    solution: 'Acompanhe a evolução de cada aluno e antecipe o cancelamento',
  },
  {
    problem: 'Avaliações manuais demoradas e imprecisas',
    solution: 'Bioimpedância com precisão clínica em menos de 1 minuto',
  },
  {
    problem: 'Academia igual a todas as concorrentes',
    solution: 'App exclusivo com sua marca — diferencial que o aluno vê todo dia',
  },
  {
    problem: 'Nenhum dado para tomar decisões de negócio',
    solution: 'Dashboard completo com métricas de retenção e engajamento',
  },
]

export default function PainPointsSection() {
  return (
    <section
      className="py-16 px-4 bg-surface"
      aria-labelledby="dores-heading"
    >
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            Problema & Solução
          </span>
          <h2
            id="dores-heading"
            className="font-title text-4xl md:text-5xl uppercase text-contrast tracking-wide leading-tight mb-4"
          >
            O QUE ESTÁ CUSTANDO{' '}
            <span className="text-accent">ALUNOS À SUA ACADEMIA</span>
          </h2>
          <p className="font-body text-contrast/55 max-w-xl mx-auto">
            Academias sem a Bioscan perdem alunos silenciosamente.
            Veja o que muda quando você investe em avaliação corporal profissional.
          </p>
        </div>

        {/* Tabela de comparação */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Cabeçalho */}
          <div className="grid grid-cols-2 divide-x divide-gray-200">
            <div className="flex items-center gap-2 px-6 py-4 bg-gray-50 border-b border-gray-200">
              <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
              <span className="font-title text-sm uppercase tracking-wide text-contrast/60">
                Sem avaliação profissional
              </span>
            </div>
            <div className="flex items-center gap-2 px-6 py-4 bg-accent/5 border-b border-accent/20">
              <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="font-title text-sm uppercase tracking-wide text-accent">
                Com Fitmass
              </span>
            </div>
          </div>

          {/* Linhas */}
          {items.map(({ problem, solution }, i) => (
            <div
              key={i}
              className="grid grid-cols-2 divide-x divide-gray-200 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex items-start gap-3 px-6 py-5">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-red-50 flex items-center justify-center" aria-hidden="true">
                  <svg className="w-2.5 h-2.5 text-red-400" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="4" />
                  </svg>
                </span>
                <p className="font-body text-contrast/50 text-sm leading-relaxed">{problem}</p>
              </div>
              <div className="flex items-start gap-3 px-6 py-5 bg-accent/[0.03]">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center" aria-hidden="true">
                  <svg className="w-2.5 h-2.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <p className="font-body text-contrast text-sm leading-relaxed font-medium">{solution}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
