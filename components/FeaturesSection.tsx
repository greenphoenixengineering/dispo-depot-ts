import { FeatureCard } from "./FeatureCard"
import { Tag, MessageSquare, Cpu } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="relative py-12 md:py-24 bg-green-50 overflow-hidden">      
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