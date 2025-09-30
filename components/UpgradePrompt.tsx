"use client";

import { AlertTriangle, ArrowUp, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { PlanName } from "@/types/config";

interface UpgradePromptProps {
  isVisible: boolean;
  reason: string;
  suggestedPlan?: PlanName;
  onDismiss?: () => void;
  variant?: 'modal' | 'banner' | 'inline';
}

export function UpgradePrompt({ 
  isVisible, 
  reason, 
  suggestedPlan, 
  onDismiss,
  variant = 'banner'
}: UpgradePromptProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isVisible || isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  const getPlanPrice = (plan?: PlanName) => {
    switch (plan) {
      case PlanName.STANDARD: return '$1';
      case PlanName.PRO: return '$19';
      default: return '';
    }
  };

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Upgrade Required
            </h3>
          </div>
          
          <p className="text-gray-600 mb-6">{reason}</p>
          
          <div className="flex gap-3">
            <Link 
              href="/account"
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-center font-medium hover:bg-green-700 transition-colors"
            >
              {suggestedPlan ? `Upgrade to ${suggestedPlan} ${getPlanPrice(suggestedPlan)}/mo` : 'View Plans'}
            </Link>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h4 className="font-medium text-orange-800 mb-1">
                {suggestedPlan ? `Upgrade to ${suggestedPlan}` : 'Plan Limit Reached'}
              </h4>
              <p className="text-sm text-orange-700 mb-3">{reason}</p>
              <Link 
                href="/account"
                className="inline-flex items-center gap-2 bg-orange-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-orange-700 transition-colors"
              >
                <ArrowUp className="w-4 h-4" />
                {suggestedPlan ? `Upgrade to ${suggestedPlan} ${getPlanPrice(suggestedPlan)}/mo` : 'View Plans'}
              </Link>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-orange-400 hover:text-orange-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Inline variant
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-orange-600" />
        <span className="text-sm text-orange-800">{reason}</span>
        <Link 
          href="/account"
          className="ml-auto text-sm text-orange-600 hover:text-orange-800 font-medium"
        >
          Upgrade
        </Link>
      </div>
    </div>
  );
}
