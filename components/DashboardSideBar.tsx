"use client";
import React from "react";
import { Tag, LogOut, Mail, Home, Cpu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const DashboardSideBar = () => {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard/ai-estimator",
      icon: <Cpu className="w-5 h-5" />,
      label: "AI Estimator",
    },
    {
      href: "/dashboard",
      icon: <Home className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      href: "/dashboard/tags",
      icon: <Tag className="w-5 h-5" />,
      label: "Manage Tags",
    },
    {
      href: "/dashboard/deals",
      icon: <Mail className="w-5 h-5" />,
      label: "Send Deals",
    },
  ];

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
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-green-500 rounded transition-colors ${
              pathname === item.href ? "bg-gray-100" : ""
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
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
