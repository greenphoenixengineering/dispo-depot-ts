"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { PlanName } from "@/types";

export default function UpgradeButton() {
  const { data: session } = useSession();
  // Only show upgrade button if user is on free plan
  if (!session || session?.user?.plan?.name !== PlanName.FREE) {
    return null;
  }

  return (
    <Link
      href="/#pricing"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-4 py-2 flex items-center gap-2 shadow-lg transition-all z-50"
    >
      <span>Upgrade</span>
      <ArrowUpRight className="w-4 h-4" />
    </Link>
  );
} 