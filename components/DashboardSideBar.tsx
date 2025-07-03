// components/DashboardSideBar.tsx
"use client";
import React from "react";
import { Tag, LogOut, Mail, Home, X } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface DashboardSideBarProps {
  open?: boolean;
  onClose?: () => void;
}

const DashboardSideBar = ({ open = false, onClose }: DashboardSideBarProps) => {
  const handleSignOut = () => signOut({ callbackUrl: "/" });

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200
        transform transition-all duration-300 overflow-hidden
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0 md:block
        w-48 md:w-64
      `}
      aria-label="Sidebar"
    >
      <div className="md:hidden flex justify-end p-4">
        <button onClick={onClose} aria-label="Close sidebar">
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      <div className="hidden md:flex p-6 items-center">
        <Link href="/dashboard" className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full border-2 border-white" />
          </div>
          <span className="font-bold ml-2 text-lg whitespace-nowrap">Dispo Depot</span>
        </Link>
      </div>

      <nav className="mt-6">
        {/* MAIN */}
        {/* <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
          Main
        </div> */}

        {/* Links */}
        {[
          { href: "/dashboard", icon: Home, label: "Dashboard" },
          { href: "/dashboard/tags", icon: Tag, label: "Manage Tags" },
          { href: "/dashboard/deals", icon: Mail, label: "Send Deals" },
        ].map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-green-500"
          >
            <Icon className="w-6 h-6 flex-shrink-0" />
            <span className="ml-2 whitespace-nowrap">
              {label}
            </span>
          </Link>
        ))}

        {/* ACCOUNT */}
        {/* <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
          Account
        </div> */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-red-500"
        >
          <LogOut className="w-6 h-6 flex-shrink-0" />
          <span className="ml-2 whitespace-nowrap">
            Logout
          </span>
        </button>
      </nav>
    </aside>
  );
};

export default DashboardSideBar;
