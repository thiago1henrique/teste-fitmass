import { Suspense } from 'react'
import HeroHome from './components/HeroHome'
import ProductsSection from './components/ProductsSection'
import AboutUsSection from './components/AboutUsSection'
import CinematicTransition from './components/CinematicTransition'
import BioscanSection from './components/BioscanSection'
import BioscanOutro from './components/BioscanOutro'
import PainPointsSection from './components/PainPointsSection'
import BenefitsSection from './components/BenefitsSection'
import TestimonialsSection from './components/TestimonialsSection'
import BeforeAfterSection from './components/BeforeAfterSection'
import PartnersTicker from './components/PartnersTicker'
import PersonalizationSection from '../../components/personalization/PersonalizationSection'
import HowItWorksSection from './components/HowItWorksSection'
import BrazilMapSection from './components/BrazilMapSection'
import FAQHome from './components/FAQHome'
import BlogPreviewSection from '../../components/blog/BlogPreviewSection'
import ContactSection from './components/ContactSection'
import FinalCTASection from './components/FinalCTASection'
import EventBanners from '@/app/components/events/EventBanners'

export default function Home() {
  return (
    <main>
      <HeroHome />
      <EventBanners position="after-hero" />
      <ProductsSection />
      <HowItWorksSection />
      <EventBanners position="after-how-it-works" />
      <TestimonialsSection />
      <EventBanners position="after-testimonials" />
      <BeforeAfterSection />
      {/* <AboutUsSection /> */}
      <PainPointsSection />
      <BenefitsSection />
      <PartnersTicker />
      {/* <PersonalizationSection /> */}
      {/* <BrazilMapSection /> */}
      <Suspense>
        <BlogPreviewSection />
      </Suspense>
      <ContactSection />
      <FAQHome />
      <EventBanners position="before-cta" />
      <FinalCTASection />
    </main>
  )
}
