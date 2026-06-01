import HeroMyDayAluno from './components/HeroMyDayAluno'
import EmotionalHookSection from './components/EmotionalHookSection'
import HowItWorksMyDayAluno from './components/HowItWorksMyDayAluno'
import ComparisonMyDayAluno from './components/ComparisonMyDayAluno'
import MyDayPlanSection from '@/app/(pages)/myday/components/MyDayPlanSection'
import FAQMyDayAluno from './components/FAQMyDayAluno'
import FinalCTAMyDayAluno from './components/FinalCTAMyDayAluno'

export default function MyDayAluno() {
  return (
    <main>
      <HeroMyDayAluno />
      <EmotionalHookSection />
      <HowItWorksMyDayAluno />
      <ComparisonMyDayAluno />
      <MyDayPlanSection />
      <FAQMyDayAluno />
      <FinalCTAMyDayAluno />
    </main>
  )
}
