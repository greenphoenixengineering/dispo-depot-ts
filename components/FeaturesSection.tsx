import { Tag, MessageSquare, Cpu } from "lucide-react"
import { FeatureCard } from "./FeatureCard"

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12">
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
