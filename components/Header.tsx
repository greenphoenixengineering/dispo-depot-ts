"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import ButtonSignin from "./ButtonSignin"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 z-10">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full border-2 border-white"></div>
          </div>
          <span className="font-bold text-xl">Dispo Depot</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/pricing" className="text-gray-700 hover:text-gray-900 font-medium">
            Pricing
          </Link>
          <ButtonSignin  extraStyle="bg-green-500 text-white px-4 py-2 rounded-full font-medium hover:bg-green-600 transition-colors" text="sign up"/>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden z-10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="h-6 w-6 text-gray-900" /> : <Menu className="h-6 w-6 text-gray-900" />}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-white z-0 flex flex-col items-center justify-center space-y-8">
            <Link href="/pricing" className="text-xl font-medium" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </Link>
                      <ButtonSignin  extraStyle="bg-green-500 text-white px-4 py-2 rounded-full font-medium hover:bg-green-600 transition-colors" text="sign up"/>

          </div>
        )}
      </div>
    </header>
  )
}
