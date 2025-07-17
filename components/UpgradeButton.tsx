'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { PlanName } from '@/types';
import apiClient from '@/libs/api';

type CustomerPortalResponse = {
  url: string;
}

export default function UpgradeButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  
  // Only show upgrade button if user is logged in
  if (!session) {
    return null;
  }

  const handleManagePlan = async () => {
    setIsLoading(true);

    try {
      const response = await apiClient.post<any, CustomerPortalResponse>(
        "/stripe/create-portal",
        {
          returnUrl:  window?.location?.origin + '/dashboard',
        }
      );

      // The apiClient returns response.data automatically via interceptor
      if (response && response.url) {
        window.location.href = response.url;
      } else {
        console.error("No customer portal URL returned");
        setIsLoading(false);
      }
    } catch (e: any) {
      console.error(e);
      
      // If authentication error, redirect to login
      if (e.response?.status === 401 && e.response?.data?.redirectUrl) {
        const callbackUrl = encodeURIComponent(window.location.href);
        window.location.href = `${e.response.data.redirectUrl}?callbackUrl=${callbackUrl}`;
      } else {
        setIsLoading(false);
      }
    }
  }

  return (
    <>
      {/* Only show upgrade button if user is on free plan */}
      {session?.user?.plan?.name === PlanName.FREE ? (
        <Link
          href="/#pricing"
          className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-4 py-2 flex items-center gap-2 shadow-lg transition-all z-50"
        >
          <span>Upgrade</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      ) : (
        <button
          onClick={handleManagePlan}
          className="fixed bottom-6 right-6 bg-gray-500 hover:bg-gray-600 text-white rounded-full px-4 py-2 flex items-center gap-2 shadow-lg transition-all z-50"
        >
          <span>Manage Plan {isLoading ? '...' : ''}</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      )}
    </>
  );
}
