import HeroHome from './components/HeroHome'
import AboutUsSection from './components/AboutUsSection'
import CinematicTransition from './components/CinematicTransition'
import BioscanSection from './components/BioscanSection'
import BioscanOutro from './components/BioscanOutro'
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
      <AboutUsSection />
      <CinematicTransition />
      <BioscanSection />
      <BioscanOutro />
      <div
        className="h-125 lg:h-160"
        style={{
          background:
            'linear-gradient(to bottom, #000000 0%, #0e0e0e 15%, #333333 30%, #7c7c7c 50%, #c5c5c5 70%, #eaeaea 85%, #f8f8f8 100%)',
        }}
        aria-hidden="true"
      />
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
