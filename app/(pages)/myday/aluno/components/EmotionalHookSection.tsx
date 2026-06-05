export default function EmotionalHookSection() {
  return (
    <section className="bg-[#111111] py-20 px-4" aria-labelledby="problema-heading">
      <div className="max-w-2xl mx-auto text-center">

        <h2
          id="problema-heading"
          className="font-title text-4xl md:text-5xl lg:text-6xl uppercase text-white tracking-wide leading-tight mb-14"
        >
          Você treina.<br />
          Come bem.<br />
          <span className="text-[#FF6A00]">Mas os resultados não aparecem.</span>
        </h2>

        <div className="space-y-8">

          <p className="font-body text-white/65 text-base md:text-lg leading-relaxed">
            A maioria das pessoas treina sem saber se está dentro do déficit calórico
            certo para seu objetivo. Fazem dieta baseada em posts do Instagram, não
            nos dados do próprio corpo.
          </p>

          <div className="border-t border-[#FF6A00]/20" />

          <p className="font-body text-white/80 text-base md:text-lg leading-relaxed">
            O resultado? Meses de treino, muito esforço — e a balança{' '}
            <span className="underline underline-offset-2">não move</span>. Ou pior:
            move, mas você perde músculo em vez de gordura.
          </p>

          <div className="border-t border-[#FF6A00]/20" />

          <div className="rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-6 py-5">
            <p className="font-body text-white text-base md:text-lg leading-relaxed">
              O{' '}
              <span className="text-[#FF6A00] font-semibold">MyDay</span> resolve isso.
              Com os dados reais da sua bioimpedância e uma{' '}
              <span className="text-[#FF6A00] font-semibold">IA</span> que te acompanha
              todos os dias no WhatsApp.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
