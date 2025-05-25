"use client";

import React, { useState } from "react";
import DashboardSideBar from "@/components/DashboardSideBar";
import { Menu } from "lucide-react";
import Link from "next/link";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar: overlay on mobile, static on desktop */}
      <DashboardSideBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between relative">
          {/* Hamburger menu on mobile */}
          <button
            className="md:hidden absolute left-4 top-1/2 -translate-y-1/2 z-20"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-7 h-7 text-gray-700" />
          </button>
          {/* Centered logo on mobile, left on desktop */}
          <div className="flex-1 flex justify-center md:justify-start">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-white"></div>
              </div>
              <span className="font-bold text-xl">Dispo Depot</span>
            </Link>
          </div>
          {/* User avatar or right content */}
          <div className="flex items-center justify-end w-10 h-10 rounded-full bg-gray-200">
            <span className="text-gray-600 font-medium">JD</span>
          </div>
        </header>
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
} 