import { CTASection } from '@/components/CtaSection'
import { FeaturesSection } from '@/components/FeaturesSection'
import { Header } from '@/components/Header'
import { HeroSection } from '@/components/Hero-section'
import { Pricing } from '@/components/Pricing'
import { PricingFAQ } from '@/components/PricingFaq'
import Link from "next/link"
import { Check } from "lucide-react"
import React from 'react'
import ButtonSignin from '@/components/ButtonSignin'
import { PricingComparison } from '@/components/PricingComparison'

const page = () => {
  return (
    <>
      <Header/>
      <HeroSection/>
      <FeaturesSection/>
      <Pricing />
      <PricingComparison />
      <PricingFAQ />
      <div className="my-16 text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-4">Need a custom plan?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We offer custom solutions for large wholesalers with specific needs. Contact our sales team to discuss
            your requirements.
          </p>
          <a
            href="mailto:support@greenphoenixengineering.com"
            className="inline-flex items-center px-5 py-2 md:px-6 md:py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Contact Sales
          </a>
        </div>
      <CTASection />
    </>
  )
}

export default page