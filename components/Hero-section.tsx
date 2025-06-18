import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import heroDashboard from "@/public/dashboard.png"

export function HeroSection() {
  return (
    <section className="relative py-32 md:py-64 overflow-hidden">
      {/* Full-width background image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/hero-bg.jpg"
          alt="Background"
          fill
          className="object-cover object-center w-full h-full md:opacity-100 opacity-25"
          priority
          sizes="100vw"
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900 md:text-white">
              Connect With Buyers
              <br />
              <span className="text-green-500">Faster Than Ever</span>
            </h1>
            <p className="mb-8 text-base md:text-lg text-gray-800 md:text-white/90">
              Streamline your wholesale operations with our powerful CRM platform. Connect, manage, and grow your buyer
              relationships with intuitive tools designed for real estate professionals.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 border border-gray-900 md:border-gray-100 text-gray-900 md:text-white rounded-full px-5 py-2 md:px-6 md:py-3 hover:bg-gray-900/10 md:hover:bg-white/10 transition-colors"
            >
              Try Now For Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="shadow-xl rounded-lg overflow-hidden max-w-full">
              <Image
                src={heroDashboard}
                alt="Dispo Depot Dashboard"
                width={300}
                height={300}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}