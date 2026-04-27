import HeroSection from './components/HeroSection'
import PlanCards from './components/PlanCards'
import ComparisonAccordion from './components/ComparisonAccordion'
import PartnersBanner from './components/PartnersBanner'
import PersonalizationSection from '../../components/personalization/PersonalizationSection'
import FAQ from './components/FAQ'
import CTASection from './components/CTASection'
import BlogPreviewSection from '../../components/blog/BlogPreviewSection'

export default function Planos() {
  return (
    <main>
      <HeroSection />
      <PlanCards />
      <ComparisonAccordion />
      <PartnersBanner />
      <PersonalizationSection />
      <FAQ />
      <BlogPreviewSection />
      <CTASection />
    </main>
  )
}
