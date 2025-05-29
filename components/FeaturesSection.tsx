import { FeatureCard } from "./FeatureCard"
import { Tag, MessageSquare, Cpu } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
          <FeatureCard
            icon={<Tag className="w-6 h-6" />}
            title="Advanced Tagging System"
            description="Organize and categorize your content with our powerful tagging system for efficient management and retrieval."
          />
          <FeatureCard
            icon={<MessageSquare className="w-6 h-6" />}
            title="Email & SMS Integrations"
            description="Seamlessly connect with your customers through integrated email and SMS messaging capabilities."
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