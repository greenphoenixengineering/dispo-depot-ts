import Link from "next/link"
import type { ReactNode } from "react"
import { Tag, LogOut, Mail, Home } from "lucide-react"
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import config from "@/config";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(config.auth.loginUrl);
  }

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

          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</div>
          <Link
            href="/logout"
            className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-red-500"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Link>
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
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 font-medium">JD</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  )
}
