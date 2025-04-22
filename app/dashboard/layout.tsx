import Link from "next/link"
import type { ReactNode } from "react"
import { Tag, LogOut, Mail, Home } from "lucide-react"
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import config from "@/config";
import { signOut } from "next-auth/react";
import DashboardSideBar from "@/components/DashboardSideBar";

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
    <DashboardSideBar/>

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
