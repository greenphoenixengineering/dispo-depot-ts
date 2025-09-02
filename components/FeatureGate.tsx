"use client";

import { ReactNode } from "react";
import { useFeatureGuard } from "@/libs/hooks/useFeatureGuard";
import { UpgradePrompt } from "./UpgradePrompt";
import { PlanName } from "@/types/config";

interface FeatureGateProps {
  children: ReactNode;
  feature?: 'addBuyer' | 'sendEmail' | 'advancedManagement' | 'csvImport' | 'advancedAnalytics' | 'apiAccess' | 'customIntegrations';
  fallback?: ReactNode;
  showUpgradePrompt?: boolean;
  upgradePromptVariant?: 'modal' | 'banner' | 'inline';
}

export function FeatureGate({ 
  children, 
  feature, 
  fallback,
  showUpgradePrompt = true,
  upgradePromptVariant = 'inline'
}: FeatureGateProps) {
  const { featureGuard, loading } = useFeatureGuard();
  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-8 rounded"></div>;
  }

  if (!featureGuard) {
    return fallback || null;
  }
console.log("featureGuard",featureGuard);
  let hasAccess = true;
  let upgradeRecommendation: { shouldUpgrade: boolean; reason: string; suggestedPlan?: PlanName } = { shouldUpgrade: false, reason: '' };

  // Check specific feature access
  switch (feature) {
    case 'addBuyer':
      hasAccess = featureGuard.canAddBuyer();
      if (!hasAccess) {
        upgradeRecommendation = featureGuard.getUpgradeRecommendation();
      }
      break;
    case 'sendEmail':
      hasAccess = featureGuard.canSendEmail();
      if (!hasAccess) {
        upgradeRecommendation = featureGuard.getUpgradeRecommendation();
      }
      break;
    case 'advancedManagement':
      hasAccess = featureGuard.hasAdvancedBuyerManagement();
      upgradeRecommendation = {
        shouldUpgrade: !hasAccess,
        reason: 'Advanced buyer management requires Standard plan or higher',
        suggestedPlan: PlanName.STANDARD
      };
      break;
    case 'csvImport':
      hasAccess = featureGuard.hasCSVImport();
      upgradeRecommendation = {
        shouldUpgrade: !hasAccess,
        reason: 'CSV/Excel import requires Standard plan or higher',
        suggestedPlan: PlanName.STANDARD
      };
      break;
    case 'advancedAnalytics':
      hasAccess = featureGuard.hasAdvancedAnalytics();
      upgradeRecommendation = {
        shouldUpgrade: !hasAccess,
        reason: 'Advanced analytics requires Pro plan',
        suggestedPlan: PlanName.PRO
      };
      break;
    case 'apiAccess':
      hasAccess = featureGuard.hasAPIAccess();
      upgradeRecommendation = {
        shouldUpgrade: !hasAccess,
        reason: 'API access requires Pro plan',
        suggestedPlan: PlanName.PRO
      };
      break;
    case 'customIntegrations':
      hasAccess = featureGuard.hasCustomIntegrations();
      upgradeRecommendation = {
        shouldUpgrade: !hasAccess,
        reason: 'Custom integrations require Pro plan',
        suggestedPlan: PlanName.PRO
      };
      break;
    default:
      hasAccess = featureGuard.canAccessFeature();
      break;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  // Show upgrade prompt or fallback
  if (showUpgradePrompt && upgradeRecommendation.shouldUpgrade) {
    return (
      <UpgradePrompt
        isVisible={true}
        reason={upgradeRecommendation.reason}
        suggestedPlan={upgradeRecommendation.suggestedPlan}
        variant={upgradePromptVariant}
      />
    );
  }

  return fallback || null;
}

// Convenience components for common use cases
export function BuyerLimitGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <FeatureGate feature="addBuyer" fallback={fallback}>
      {children}
    </FeatureGate>
  );
}

export function EmailLimitGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <FeatureGate feature="sendEmail" fallback={fallback}>
      {children}
    </FeatureGate>
  );
}

export function AdvancedFeatureGate({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <FeatureGate feature="advancedManagement" fallback={fallback}>
      {children}
    </FeatureGate>
  );
}
