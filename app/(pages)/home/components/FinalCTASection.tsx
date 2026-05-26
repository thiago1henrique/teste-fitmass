'use client'

export default function FinalCTASection() {
  return (
    <section
      id="cta-final"
      className="relative bg-accent overflow-hidden"
      aria-label="Comece sua transformação com a Fitmass"
    >
      {/* Diagonal de entrada — escuro para verde */}
      <div className="pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" className="w-full" style={{ height: 72, display: 'block' }}>
          <polygon fill="#333333" points="0,0 1440,0 0,72" />
        </svg>
      </div>

      {/* Hachura diagonal decorativa */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            'repeating-linear-gradient(-45deg, rgba(0,0,0,0.035) 0, rgba(0,0,0,0.035) 1px, transparent 0, transparent 9px)',
          backgroundSize: '9px 9px',
        }}
      />

      {/* Glow branco no canto superior direito */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/20 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Glow escuro no canto inferior esquerdo */}
      <div
        className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-black/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto px-4 pt-4 pb-24 text-center">

        {/* Badge */}
        <span className="inline-flex items-center gap-2 bg-black/10 text-contrast font-body font-semibold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-contrast/70" aria-hidden="true" />
          Dê o próximo passo
        </span>

        {/* Headline principal */}
        <h2 className="font-title text-5xl md:text-7xl lg:text-[5.5rem] uppercase tracking-wide leading-none mb-6 text-contrast">
          SUA ACADEMIA<br />
          <span className="text-white" style={{ textShadow: '0 2px 24px rgba(0,0,0,0.18)' }}>
            MERECE MAIS
          </span>
        </h2>

        {/* Subtítulo */}
        <p className="font-body text-contrast/70 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed">
          Junte-se às academias que já usam a Fitmass para vender mais,
          reter alunos e crescer de verdade.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="https://api.whatsapp.com/send/?phone=5541984810567&text=Ol%C3%A1%2C+vim+do+site+e+gostaria+de+mais+informa%C3%A7%C3%B5es+sobre+o+Fitmass&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 bg-contrast text-white font-body font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:bg-contrast/85 active:scale-[0.98] transition-all duration-200 shadow-xl shadow-black/20"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.846L0 24l6.334-1.507A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-5.002-1.37l-.36-.213-3.76.895.955-3.658-.234-.376A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
            </svg>
            Falar no WhatsApp
          </a>

          <a
            href="/planos"
            className="inline-flex items-center gap-2 bg-white/25 text-contrast font-body font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:bg-white/40 active:scale-[0.98] transition-all duration-200 border border-black/10"
          >
            Ver planos e preços
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>

        {/* Social proof */}
        <p className="mt-10 font-body text-contrast/50 text-sm tracking-wide">
          +150 academias já confiam na Fitmass&nbsp;&nbsp;·&nbsp;&nbsp;Sem contrato de fidelidade
        </p>
      </div>
    </section>
  )
}
