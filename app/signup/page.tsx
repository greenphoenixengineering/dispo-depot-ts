import { Header } from "@/components/Header"
import Link from "next/link"
import HeroSection from "@/components/HeroSection"

export default function SignUp() {
  return (
    <main>
      <Header />
      <HeroSection />
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-md">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Create your account</h1>
          <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-200 shadow-sm">
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Sign Up
              </button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/signin" className="text-green-500 hover:underline">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
