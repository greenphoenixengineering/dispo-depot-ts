import { PlanName } from "@/types/config";

// Plan limits configuration matching the pricing structure
export const PLAN_LIMITS = {
  [PlanName.FREE]: {
    buyers: 10,
    emailsPerTagPerMonth: 1,
    tags: Infinity, // Unlimited
    hasAdvancedManagement: false,
    hasCSVImport: false,
    hasAdvancedAnalytics: false,
    hasAPIAccess: false,
    hasCustomIntegrations: false,
    supportLevel: 'email' as const,
  },
  [PlanName.STANDARD]: {
    buyers: 500,
    emailsPerTagPerMonth: 100,
    tags: Infinity, // Unlimited
    hasAdvancedManagement: true,
    hasCSVImport: true,
    hasAdvancedAnalytics: false,
    hasAPIAccess: false,
    hasCustomIntegrations: false,
    supportLevel: 'priority-email' as const,
  },
  [PlanName.PRO]: {
    buyers: Infinity, // Unlimited
    emailsPerTagPerMonth: Infinity, // Unlimited
    tags: Infinity, // Unlimited
    hasAdvancedManagement: true,
    hasCSVImport: true,
    hasAdvancedAnalytics: true,
    hasAPIAccess: true,
    hasCustomIntegrations: true,
    supportLevel: 'priority-phone' as const,
  },
} as const;

export type PlanLimits = typeof PLAN_LIMITS[PlanName];
export type SupportLevel = 'email' | 'priority-email' | 'priority-phone';

// Helper functions for checking limits
export function getPlanLimits(planName: string): PlanLimits {
  const normalizedPlan = planName as PlanName;
  return PLAN_LIMITS[normalizedPlan] || PLAN_LIMITS[PlanName.FREE];
}

export function isUnlimited(value: number): boolean {
  return value === Infinity;
}

export function formatLimit(value: number): string {
  return isUnlimited(value) ? 'Unlimited' : value.toLocaleString();
}

export function getUsagePercentage(current: number, limit: number): number {
  if (isUnlimited(limit)) return 0; // For unlimited plans, show 0% (no limit)
  return Math.min((current / limit) * 100, 100);
}

export function isAtLimit(current: number, limit: number): boolean {
  if (isUnlimited(limit)) return false;
  return current >= limit;
}

export function getRemainingQuota(current: number, limit: number): number {
  if (isUnlimited(limit)) return Infinity;
  return Math.max(0, limit - current);
}
