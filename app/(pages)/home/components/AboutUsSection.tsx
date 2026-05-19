import Image from 'next/image'

const products = ['Bioscan', 'Scanner', 'Pwrscan', 'Pocket']

export default function AboutUsSection() {
  return (
    <section
      className="py-20 px-4 bg-surface overflow-hidden"
      aria-labelledby="sobre-nos-heading"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Image column */}
          <div className="relative flex justify-center lg:justify-start">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 70%, rgba(136,189,35,0.14) 0%, transparent 65%)',
              }}
              aria-hidden="true"
            />
            <Image
              src="/pages/landingpage/Holding-Phone.png"
              alt="Pessoa utilizando o aplicativo Fitmass no smartphone para acompanhar medições corporais"
              width={320}
              height={400}
              className="relative z-10 max-w-75 sm:max-w-95 lg:max-w-none lg:w-full object-contain drop-shadow-xl"
              loading="lazy"
            />
          </div>

          {/* Text column */}
          <div className="flex flex-col gap-6">

            {/* Badge */}
            <span className="inline-flex w-fit items-center gap-2 bg-accent/15 text-accent font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
              Sobre Nós
            </span>

            {/* Heading */}
            <h2
              id="sobre-nos-heading"
              className="font-title text-3xl md:text-4xl xl:text-5xl uppercase text-contrast tracking-wide leading-tight"
            >
              ESPECIALISTAS EM{' '}
              <span className="text-accent">MEDIÇÕES CORPORAIS</span>{' '}
              E ANÁLISE AVANÇADA DE DADOS
            </h2>

            {/* Body */}
            <div className="space-y-4">
              <p className="font-body text-contrast/65 text-base leading-relaxed">
                A Fitmass fabrica e comercializa a <b>Bioscan</b>, balança de
                bioimpedância profissional que realiza avaliações físicas completas em
                academias, consultórios médicos, empresas e até mesmo em casa —
                com precisão clínica, em menos de 1 minuto.
              </p>
              <p className="font-body text-contrast/65 text-base leading-relaxed">
                A Bioscan acompanha peso, gordura, massa muscular, hidratação e
                circunferências corporais. O ecossistema digital completo — app para o
                aluno, software de gestão e relatórios com a marca da sua academia —
                potencializa cada medição e transforma dados em retenção.
              </p>
            </div>

            {/* Product line */}
            <div className="pt-2">
              <p className="font-body text-xs uppercase tracking-widest text-contrast/40 mb-3">
                Linha de produtos
              </p>
              <div className="flex flex-wrap gap-2">
                {products.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface border border-contrast/10 font-body text-sm font-medium text-contrast"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
                    {name}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
