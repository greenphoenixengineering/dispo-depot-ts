import { FeatureCard } from "./FeatureCard"
import { Tag, MessageSquare, Cpu } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="relative py-12 md:py-24 bg-green-50 overflow-hidden">
      {/* Decorative SVG blob for top transition */}
      <div className="absolute top-0 left-0 w-full -translate-y-1 pointer-events-none z-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24 md:h-32">
          <path fill="#f0fdf4" d="M0,80 C360,160 1080,0 1440,80 L1440,0 L0,0 Z" />
        </svg>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          <FeatureCard
            icon={<Tag className="w-6 h-6" />}
            title="Advanced Tagging System"
            description="Send deals to multiple buyers at once via Tags. No more long email chains or pricey email platforms."
          />
          <FeatureCard
            icon={<Cpu className="w-6 h-6" />}
            title="AI Estimator"
            description="Quickly estimate jobs given dimensions, materials, and a brief description."
          />
          <FeatureCard
            icon={<Cpu className="w-6 h-6" />}
            title="API for AI Workflows"
            description="Leverage our robust API to create custom AI workflows that automate and enhance your business processes."
          />
        </div>
      </div>
    </section>
  )
}