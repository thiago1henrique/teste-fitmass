import HeroHome from './components/HeroHome'
import PainPointsSection from './components/PainPointsSection'
import BenefitsSection from './components/BenefitsSection'
import PartnersTicker from './components/PartnersTicker'
import PersonalizationSection from '../../components/personalization/PersonalizationSection'
import AiFitSimulator from './components/AiFitSimulator'
import FAQHome from './components/FAQHome'
import BlogPreviewSection from '../../components/blog/BlogPreviewSection'
import ContactSection from './components/ContactSection'

export default function Home() {
  return (
    <main>
      <HeroHome />
      <PainPointsSection />
      <BenefitsSection />
      <PartnersTicker />
      <PersonalizationSection />
      <AiFitSimulator />
      <FAQHome />
      <BlogPreviewSection />
      <ContactSection />
    </main>
  )
}
