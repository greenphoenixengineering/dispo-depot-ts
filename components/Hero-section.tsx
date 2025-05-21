import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import heroDashboard from "@/public/dashboard.png"

export function HeroSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-4">
              Connect With Buyers
              <br />
              <span className="text-green-500">Faster Than Ever</span>
            </h1>
            <p className="text-gray-600 mb-8 text-lg">
              Streamline your wholesale operations with our powerful CRM platform. Connect, manage, and grow your buyer
              relationships with intuitive tools designed for distributors.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-6 py-3 hover:bg-gray-50 transition-colors"
            >
              Try Now For Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="shadow-xl rounded-lg overflow-hidden max-w-full">
              <Image
                src={heroDashboard}
                alt="Dispo Depot Dashboard"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
