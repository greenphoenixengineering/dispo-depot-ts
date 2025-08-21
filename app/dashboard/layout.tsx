"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import type { ReactNode } from "react"
import { Tag, LogOut, Mail, Home, User, ChevronDown, BarChart3 } from "lucide-react"

function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-600 font-medium">JD</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 transition-all duration-200 origin-top-right ${
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <Link
          href="/dashboard/account"
          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <User className="w-4 h-4" />
          <span>Manage Account</span>
        </Link>
        <hr className="border-gray-100" />
        <Link
          href="/logout"
          className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border-2 border-white"></div>
            </div>
            <span className="font-bold text-xl">Dispo Depot</span>
          </Link>
        </div>
        <nav className="mt-6">
          <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Main</div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-green-500"
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/dashboard/tags"
            className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-green-500"
          >
            <Tag className="w-5 h-5" />
            <span>Manage Tags</span>
          </Link>
          <Link
            href="/dashboard/deals"
            className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-green-500"
          >
            <Mail className="w-5 h-5" />
            <span>Send Deals</span>
          </Link>
          <Link
            href="/dashboard/deal-analysis"
            className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-green-500"
          >
            <BarChart3 className="w-5 h-5" />
            <span>Deal Analysis</span>
          </Link>

          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="md:hidden">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-white"></div>
              </div>
              <span className="font-bold text-xl">Dispo Depot</span>
            </Link>
          </div>
          <div className="flex items-center justify-end w-full">
            <ProfileDropdown />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  )
}
