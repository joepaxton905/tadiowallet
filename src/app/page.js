import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import Security from '@/components/Security'
import Cryptocurrencies from '@/components/Cryptocurrencies'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="relative">
      {/* Navigation */}
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <Features />
      
      {/* How It Works Section */}
      <HowItWorks />
      
      {/* Security Section */}
      <Security />
      
      {/* Supported Cryptocurrencies */}
      <Cryptocurrencies />
      
      {/* Call to Action */}
      <CTA />
      
      {/* Footer */}
      <Footer />
    </main>
  )
}

