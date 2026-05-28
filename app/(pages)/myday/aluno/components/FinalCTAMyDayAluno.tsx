const WHATSAPP_MYDAY =
  'https://api.whatsapp.com/send/?phone=5541984810567&text=Ol%C3%A1%2C+vim+do+site+e+quero+come%C3%A7ar+a+usar+o+Fitmass+MyDay&type=phone_number&app_absent=0'

const bullets = [
  '7 dias grátis',
  'Sem baixar nada',
  'Funciona no WhatsApp',
  'Cancelamento simples',
]

export default function FinalCTAMyDayAluno() {
  return (
    <section
      id="cta-final-myday-aluno"
      aria-labelledby="cta-myday-aluno-heading"
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
        className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#FF6A00]/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#FF6A00]/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,106,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,106,0,1) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-24 pb-20 text-center">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 bg-[#FF6A00]/15 text-[#FF6A00] font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" aria-hidden="true" />
          Comece hoje
        </span>

        {/* Heading */}
        <h2
          id="cta-myday-aluno-heading"
          className="font-title text-4xl md:text-5xl uppercase text-white tracking-wide mb-4"
        >
          Pronto para parar de adivinhar?
        </h2>

        {/* Subtitle */}
        <p className="font-body text-white/60 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Junte-se a quem já usa dados reais para mudar o corpo.
        </p>

        {/* Bullets */}
        <ul
          className="inline-flex flex-wrap justify-center gap-x-6 gap-y-3 mb-10"
          aria-label="Benefícios"
        >
          {bullets.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#FF6A00] shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-body text-white/80 text-sm">{item}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex justify-center mb-6">
          <a
            href={WHATSAPP_MYDAY}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#FF6A00] text-white font-body font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:bg-[#FF6A00]/90 active:scale-95 transition-[background-color,transform] duration-200"
          >
            Começar agora — é grátis
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

        {/* Microcopy */}
        <p className="font-body text-white/35 text-sm tracking-wide">
          Sem cartão de crédito. Abre no WhatsApp que você já tem.
        </p>
      </div>
    </section>
  )
}
