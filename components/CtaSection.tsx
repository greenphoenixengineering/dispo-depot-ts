import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-12 md:py-24 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to transform your wholesale business?</h2>
            <p className="text-gray-600 mb-8">
              Dispo Depot provides everything you need to streamline buyer relationships and boost your distribution
              efficiency. Start connecting with your customers in a whole new way.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-green-500 text-white rounded-full px-5 py-2 md:px-6 md:py-3 hover:bg-green-600 transition-colors"
            >
              Try Now For Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}