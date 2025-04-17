import { CTASection } from '@/components/CtaSection'
import { FeaturesSection } from '@/components/FeaturesSection'
import { Header } from '@/components/Header'
import { HeroSection } from '@/components/Hero-section'
import React from 'react'

const page = () => {
  return (
    <>
    <Header/>
    <HeroSection/>
    <FeaturesSection/>
    <CTASection/>
    </>
  )
}

export default page