import HeroMyDayBase from '@/app/(pages)/myday/components/HeroMyDayBase'

export default function HeroMyDayAluno() {
  return (
    <HeroMyDayBase
      ariaLabel="Fitmass MyDay — Seu personal de IA no WhatsApp"
      badge={{
        icon: '/pages/landingpage/aiSection/MyDay-icone.svg',
        label: 'Fitmass MyDay',
      }}
      heading={
        <>
          Seu personal de IA.{' '}
          <strong className="text-[#FF6A00] not-italic">Direto no WhatsApp.</strong>
        </>
      }
      description="O Fitmass MyDay é uma IA que te acompanha no WhatsApp, controla seu déficit calórico com os dados reais da sua bioimpedância, registra treinos, te lembra das metas e manda seu progresso automaticamente."
      complement="Sem app para baixar. Sem planilha para preencher. É só mandar mensagem."
      ctas={[
        { label: 'Começar 7 dias grátis', href: '#', variant: 'primary' },
      ]}
      microcopy="Sem cartão de crédito. Abre no WhatsApp que você já tem."
      mockupView="aluno"
    />
  )
}
