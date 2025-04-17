import { Header } from "@/components/Header"
import Link from "next/link"

export default function SignIn() {
  return (
    <main>
      <Header />
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Login </h1>
          <div className="bg-white p-8 rounded-lg border border-gray-200">
            <form className="space-y-4">
             
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
              Sign in
              </button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-600">
             don&apos;t have an account?{" "}
              <Link href="/signup" className="text-green-500 hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
