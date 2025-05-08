"use client";
import React from "react";
import { Tag, LogOut, Mail, Home } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

const DashboardSideBar = () => {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
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
        <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Main
        </div>
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

        <div className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Account
        </div>
        <Link
          href="/logout"
          onClick={handleSignOut}
          className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-red-500"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Link>
      </nav>
    </aside>
  );
};

export default DashboardSideBar;
