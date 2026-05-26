const WHATSAPP_CONSULTOR =
  'https://api.whatsapp.com/send/?phone=5541984810567&text=Ol%C3%A1%2C+vim+do+site+e+gostaria+de+falar+com+um+consultor+sobre+o+MyDay&type=phone_number&app_absent=0'

const bullets = [
  'Nova fonte de receita recorrente',
  'Integração com sua Bioscan',
  'Sem trabalho operacional',
  'Diferencial competitivo real',
]

export default function FinalCTAMyDay() {
  return (
    <section
      id="cta-final-myday"
      aria-labelledby="cta-myday-heading"
      className="relative bg-contrast overflow-hidden"
    >
      {/* SVG diagonal transition from bg-surface (FAQ) */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none -translate-y-px">
        <svg
          viewBox="0 0 1440 64"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polygon fill="#F8F8F8" points="0,0 1440,0 0,64" />
        </svg>
      </div>

      {/* Glows */}
      <div
        className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-secondary/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(37,182,235,1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,182,235,1) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-24 pb-20 text-center">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 bg-secondary/15 text-secondary font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary" aria-hidden="true" />
          Nova Receita
        </span>

        {/* Heading */}
        <h2
          id="cta-myday-heading"
          className="font-title text-4xl md:text-5xl uppercase text-white tracking-wide mb-4"
        >
          Sua academia pronta para gerar nova receita?
        </h2>

        {/* Subtitle */}
        <p className="font-body text-white/60 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Fale com nosso time e descubra qual plano faz mais sentido para o tamanho da sua academia.
        </p>

        {/* Bullets */}
        <ul className="inline-flex flex-col gap-3 text-left mb-10" aria-label="Benefícios">
          {bullets.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-accent shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-body text-white/80">{item}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex justify-center mb-6">
          <a
            href={WHATSAPP_CONSULTOR}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-accent text-white font-body font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:bg-accent/90 active:scale-95 transition-[background-color,transform] duration-200"
          >
            Falar com um consultor
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>

        {/* Social proof */}
        <p className="font-body text-white/35 text-sm tracking-wide">
          Já são +150 academias oferecendo o MyDay para seus alunos
        </p>
      </div>
    </section>
  )
}
