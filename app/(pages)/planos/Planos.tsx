import HeroSection from './components/HeroSection'
import PlanCards from './components/PlanCards'
import ComparisonAccordion from './components/ComparisonAccordion'
import PartnersTicker from '../home/components/PartnersTicker'
import BeforeAfterSection from '../home/components/BeforeAfterSection'
import FAQ from './components/FAQ'
import CTASection from './components/CTASection'
import BlogPreviewSection from '../../components/blog/BlogPreviewSection'
import EventBanners from '@/app/components/events/EventBanners'

export default function Planos() {
  return (
    <main>
      <HeroSection />
      <EventBanners position="after-plans-hero" />
      <PlanCards />
      <EventBanners position="after-plan-cards" />
      <ComparisonAccordion />
      <PartnersTicker topDiagonal />
      <BeforeAfterSection />
      <FAQ />
      <BlogPreviewSection />
      <CTASection />
    </main>
  )
}
