import { PlanName } from "@/types/config";
import { PLAN_LIMITS, getPlanLimits } from "./planLimits";

export interface WholesalerUsage {
  buyer_count: number;
  tag_count: number;
  email_count: number;
  current_plan: string;
}

export interface FeatureGuardContext {
  planName: string;
  usage: WholesalerUsage;
  hasAccess: boolean;
}

// Core feature guard class
export class FeatureGuard {
  private planName: PlanName;
  private usage: WholesalerUsage;
  private planLimits: typeof PLAN_LIMITS[PlanName];
  private hasAccess: boolean;

  constructor(context: FeatureGuardContext) {
    this.planName = (context.planName as PlanName) || PlanName.FREE;
    this.usage = context.usage;
    this.planLimits = getPlanLimits(this.planName);
    this.hasAccess = context.hasAccess;
  }

  // Basic access control
  canAccessFeature(): boolean {
    return this.hasAccess;
  }

  // Buyer management limits
  canAddBuyer(): boolean {
    if (!this.canAccessFeature()) return false;
    
    const { buyers } = this.planLimits;
    if (buyers === Infinity) return true;
    
    return this.usage.buyer_count < buyers;
  }

  getBuyerQuota(): { current: number; limit: number; remaining: number } {
    const { buyers } = this.planLimits;
    return {
      current: this.usage.buyer_count,
      limit: buyers,
      remaining: buyers === Infinity ? Infinity : Math.max(0, buyers - this.usage.buyer_count)
    };
  }

  // Email sending limits (per tag per month)
  // Note: This is a simplified check for the UI. 
  // Real email checking should be done per-tag using the server-side functions
  canSendEmail(): boolean {
    if (!this.canAccessFeature()) return false;
    
    const { emailsPerTagPerMonth } = this.planLimits;
    if (emailsPerTagPerMonth === Infinity) return true;
    
    // This is a fallback check using total email count
    // For accurate checking, use canSendEmailsToTags() server function
    return this.usage.email_count < emailsPerTagPerMonth;
  }

  getEmailQuota(): { current: number; limit: number; remaining: number } {
    const { emailsPerTagPerMonth } = this.planLimits;
    return {
      current: this.usage.email_count,
      limit: emailsPerTagPerMonth,
      remaining: emailsPerTagPerMonth === Infinity ? Infinity : Math.max(0, emailsPerTagPerMonth - this.usage.email_count)
    };
  }

  // Feature-specific access controls
  hasAdvancedBuyerManagement(): boolean {
    return this.canAccessFeature() && this.planLimits.hasAdvancedManagement;
  }

  hasCSVImport(): boolean {
    return this.canAccessFeature() && this.planLimits.hasCSVImport;
  }

  hasAdvancedAnalytics(): boolean {
    return this.canAccessFeature() && this.planLimits.hasAdvancedAnalytics;
  }

  hasAPIAccess(): boolean {
    return this.canAccessFeature() && this.planLimits.hasAPIAccess;
  }

  hasCustomIntegrations(): boolean {
    return this.canAccessFeature() && this.planLimits.hasCustomIntegrations;
  }

  // Support level
  getSupportLevel(): string {
    return this.planLimits.supportLevel;
  }

  // Upgrade recommendations
  getUpgradeRecommendation(): { shouldUpgrade: boolean; reason: string; suggestedPlan?: PlanName } {
    if (this.planName === PlanName.PRO) {
      return { shouldUpgrade: false, reason: 'Already on highest plan' };
    }

    // Check if at buyer limit
    if (!this.canAddBuyer() && this.planLimits.buyers !== Infinity) {
      const nextPlan = this.planName === PlanName.FREE ? PlanName.STANDARD : PlanName.PRO;
      return {
        shouldUpgrade: true,
        reason: `You've reached your buyer limit of ${this.planLimits.buyers}`,
        suggestedPlan: nextPlan
      };
    }

    // Check if at email limit
    if (!this.canSendEmail() && this.planLimits.emailsPerTagPerMonth !== Infinity) {
      const nextPlan = this.planName === PlanName.FREE ? PlanName.STANDARD : PlanName.PRO;
      return {
        shouldUpgrade: true,
        reason: `You've reached your email limit of ${this.planLimits.emailsPerTagPerMonth} per month`,
        suggestedPlan: nextPlan
      };
    }

    return { shouldUpgrade: false, reason: 'Within current plan limits' };
  }

  // Get all limits for display
  getAllLimits() {
    return {
      buyers: this.getBuyerQuota(),
      emails: this.getEmailQuota(),
      features: {
        advancedManagement: this.hasAdvancedBuyerManagement(),
        csvImport: this.hasCSVImport(),
        advancedAnalytics: this.hasAdvancedAnalytics(),
        apiAccess: this.hasAPIAccess(),
        customIntegrations: this.hasCustomIntegrations(),
      },
      supportLevel: this.getSupportLevel(),
      planName: this.planName,
    };
  }
}

// Hook-like function for React components
export function useFeatureGuard(context: FeatureGuardContext): FeatureGuard {
  return new FeatureGuard(context);
}

// Utility functions for common checks
export function canUserAddBuyer(planName: string, usage: WholesalerUsage, hasAccess: boolean): boolean {
  const guard = new FeatureGuard({ planName, usage, hasAccess });
  return guard.canAddBuyer();
}

export function canUserSendEmail(planName: string, usage: WholesalerUsage, hasAccess: boolean): boolean {
  const guard = new FeatureGuard({ planName, usage, hasAccess });
  return guard.canSendEmail();
}

export function getUserUpgradePrompt(planName: string, usage: WholesalerUsage, hasAccess: boolean): { shouldUpgrade: boolean; reason: string; suggestedPlan?: PlanName } {
  const guard = new FeatureGuard({ planName, usage, hasAccess });
  return guard.getUpgradeRecommendation();
}
