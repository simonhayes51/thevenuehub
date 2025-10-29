import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CategoryGrid from './components/CategoryGrid'
import FeaturedCarousel from './components/FeaturedCarousel'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import CTA from './components/CTA'
import Footer from './components/Footer'

export default function App(){
  return (
    <>
      <Navbar />
      <Hero />
      <CategoryGrid />
      <FeaturedCarousel />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  )
}
