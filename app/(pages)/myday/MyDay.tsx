import HeroMyDay from './components/HeroMyDay'
import FAQMyDay from './components/FAQMyDay'
import MyDayPlanSection from './components/MyDayPlanSection'
import RevenueCalculatorSection from './components/RevenueCalculatorSection'
import PainPointsSection from '../home/components/PainPointsSection'
import PlanCards from '../planos/components/PlanCards'
import FinalCTAMyDay from './components/FinalCTAMyDay'

const MYDAY_ITEMS = [
  {
    problem:  'Avaliação acontece, aluno vai embora com papel na mão e não sabe o que fazer',
    solution: 'IA usa os dados da avaliação para acompanhar o aluno todos os dias no WhatsApp',
  },
  {
    problem:  'Receita da academia para no equipamento — sem modelo de monetização contínua',
    solution: 'Cada aluno que usa o MyDay gera receita recorrente mensal para a academia',
  },
  {
    problem:  'Aluno não vê resultado, perde motivação e cancela a matrícula',
    solution: 'Acompanhamento diário aumenta motivação e reduz cancelamentos',
  },
  {
    problem:  'Concorrentes oferecem a mesma coisa — avaliação pontual sem continuidade',
    solution: 'Diferencial real: IA de acompanhamento integrada com a Bioscan',
  },
  {
    problem:  'A academia depende apenas da mensalidade para faturar',
    solution: 'Nova fonte de receita: % de cada assinatura MyDay dos alunos',
  },
  {
    problem:  'Sem dados sobre engajamento dos alunos com o resultado da avaliação',
    solution: 'A academia sabe quantos alunos estão usando e evoluindo',
  },
]

export default function MyDay() {
  return (
    <main>
      <HeroMyDay />
      <MyDayPlanSection />
      <RevenueCalculatorSection />
      <PainPointsSection
        items={MYDAY_ITEMS}
        badge="Comparativo"
        title={<>O que muda para{' '}<span className="text-[#FF6A00]">a sua academia</span></>}
        subtitle="Veja o antes e depois de oferecer o MyDay para seus alunos."
        leftHeader="Sem MyDay"
        rightHeader="Com Fitmass MyDay"
        headingId="myday-comparison-heading"
        accentHex="#FF6A00"
      />
      <PlanCards
        visiblePlanIds={['ultra', 'premium']}
        ctaOverride="/planos"
        mobileSwipe={true}
        sectionBadge="Planos Fitmass"
        sectionTitle={<>Escolha quanto sua academia{' '}<span className="text-[#FF6A00]">fatura por aluno</span></>}
        sectionSubtitle="O MyDay está incluído nos planos Fitmass Premium e Ultra. A diferença está em quanto fica para você."
        showToggle={false}
        headingId="myday-planos-fitmass-heading"
        cardWidth={300}
        accentHex="#FF6A00"
      />
      <FAQMyDay />
      <FinalCTAMyDay />
    </main>
  )
}
