"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import apiClient from "@/libs/api";

interface SubscriptionManagerProps {
  priceId: string;
  operation: 'upgrade' | 'downgrade' | 'new';
  className?: string;
  children?: React.ReactNode;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface ManageSubscriptionResponse {
  action: string;
  url?: string;
  subscription?: any;
  error?: string;
}

// This component is used to manage subscriptions (upgrade, downgrade, new)
// It calls the /api/stripe/manage-subscription route with the priceId and operation
const SubscriptionManager = ({
  priceId,
  operation,
  className,
  children,
  onSuccess,
  onError,
}: SubscriptionManagerProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  const handleSubscriptionChange = async () => {
    if (!session?.user?.email) {
      onError?.("You must be logged in to manage subscriptions");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post<any, ManageSubscriptionResponse>(
        "/stripe/manage-subscription",
        {
          priceId,
          operation,
        }
      );

      if (response.action === 'error') {
        onError?.(response.error || 'Failed to manage subscription');
        setIsLoading(false);
        return;
      }

      if (response.action === 'new_subscription' && response.url) {
        // Redirect to checkout for new subscription
        window.location.href = response.url;
      } else if (response.action === 'upgraded' || response.action === 'downgraded') {
        // Show success message and refresh page
        onSuccess?.();
        window.location.reload();
      } else {
        onError?.('Unexpected response from server');
        setIsLoading(false);
      }
    } catch (e: any) {
      console.error('Subscription management error:', e);
      
      // If authentication error, redirect to login
      if (e.response?.status === 401 && e.response?.data?.redirectUrl) {
        const callbackUrl = encodeURIComponent(window.location.href);
        window.location.href = `${e.response.data.redirectUrl}?callbackUrl=${callbackUrl}`;
      } else {
        onError?.(e.response?.data?.error || 'Failed to manage subscription');
        setIsLoading(false);
      }
    }
  };

  return (
    <button
      className={className || "btn btn-primary btn-block group"}
      onClick={handleSubscriptionChange}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        children || (
          <>
            {operation === 'upgrade' && 'Upgrade'}
            {operation === 'downgrade' && 'Downgrade'}
            {operation === 'new' && 'Subscribe'}
          </>
        )
      )}
    </button>
  );
};

export default SubscriptionManager; 