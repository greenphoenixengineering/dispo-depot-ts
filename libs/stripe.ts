import Stripe from "stripe";
import { supabaseUserService } from "./supabase";
import configFile from "@/config";
import { PlanName } from "@/types/config";

interface CreateCheckoutParams {
  priceId: string;
  mode: "payment" | "subscription";
  successUrl: string;
  cancelUrl: string;
  couponId?: string | null;
  clientReferenceId?: string;
  user?: {
    customerId?: string;
    email?: string;
  };
}

interface CreateCustomerPortalParams {
  customerId: string;
  returnUrl: string;
}

interface ManageSubscriptionParams {
  user: {
    customerId?: string;
    email?: string;
  };
  newPriceId: string;
  operation: 'upgrade' | 'downgrade' | 'new';
}

interface ManageSubscriptionResult {
  action: string;
  url?: string;
  subscription?: Stripe.Subscription;
  error?: string;
}

function getPlanNameFromPriceId(priceId: string): string {
  const plan = configFile.stripe.plans.find(p => p.priceId === priceId);
  return plan ? plan.name : "Unknown";
}

// Helper function to determine if a plan change is an upgrade or downgrade
export const getPlanOperation = (currentPlanName: string, newPlanName: string): 'upgrade' | 'downgrade' | 'new' => {
  const planHierarchy = {
    [PlanName.FREE]: 0,
    [PlanName.STANDARD]: 1,
    [PlanName.PRO]: 2,
  };

  const currentLevel = planHierarchy[currentPlanName as PlanName] ?? -1;
  const newLevel = planHierarchy[newPlanName as PlanName] ?? -1;

  if (currentLevel === -1) return 'new';
  if (newLevel > currentLevel) return 'upgrade';
  if (newLevel < currentLevel) return 'downgrade';
  return 'new'; // Same level, treat as new
};

// Helper: Find active subscription for a customer
export const findActiveSubscription = async (customerId: string): Promise<Stripe.Subscription | null> => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-08-16",
      typescript: true,
    });
    const subs = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });
    return subs.data[0] || null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

// For immediate upgrades (with proration)
export const upgradeSubscription = async (
  subscriptionId: string, 
  newPriceId: string
): Promise<Stripe.Subscription | null> => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-08-16",
      typescript: true,
    });
    
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const itemId = subscription.items.data[0]?.id;
    
    if (!itemId) throw new Error('No subscription item found');
    
    const updated = await stripe.subscriptions.update(subscriptionId, {
      items: [{ id: itemId, price: newPriceId }],
      proration_behavior: 'create_prorations',
      cancel_at_period_end: false,
    });
    
    return updated;
  } catch (e) {
    console.error('Upgrade subscription error:', e);
    return null;
  }
};

// For downgrades (schedule for end of period)
export const downgradeSubscription = async (
  subscriptionId: string, 
  newPriceId: string
): Promise<Stripe.Subscription | null> => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-08-16",
      typescript: true,
    });
    
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const itemId = subscription.items.data[0]?.id;
    
    if (!itemId) throw new Error('No subscription item found');
    
    const updated = await stripe.subscriptions.update(subscriptionId, {
      items: [{ id: itemId, price: newPriceId }],
      proration_behavior: 'none',
      cancel_at_period_end: false,
    });
    
    return updated;
  } catch (e) {
    console.error('Downgrade subscription error:', e);
    return null;
  }
};

// For cancellations (schedule for end of period)
export const cancelSubscriptionAtPeriodEnd = async (
  subscriptionId: string
): Promise<Stripe.Subscription | null> => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-08-16",
      typescript: true,
    });
    
    const updated = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    
    return updated;
  } catch (e) {
    console.error('Cancel subscription error:', e);
    return null;
  }
};

// Smart subscription manager that decides which action to take
export const manageSubscription = async ({
  user,
  newPriceId,
  operation
}: ManageSubscriptionParams): Promise<ManageSubscriptionResult> => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-08-16", // TODO: update this when Stripe updates their API
      typescript: true,
    });

    // If user has no customerId, they need to create a new subscription
    if (!user.customerId) {
      const checkoutUrl = await createCheckout({
        user,
        mode: 'subscription',
        priceId: newPriceId,
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/#pricing`,
      });
      
      return {
        action: 'new_subscription',
        url: checkoutUrl
      };
    }

    // Check for existing subscription
    const activeSub = await findActiveSubscription(user.customerId);
    
    if (!activeSub) {
      // No active subscription, create new one
      const checkoutUrl = await createCheckout({
        user,
        mode: 'subscription',
        priceId: newPriceId,
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/#pricing`,
      });
      
      return {
        action: 'new_subscription',
        url: checkoutUrl
      };
    }

    // User has active subscription
    if (operation === 'upgrade') {
      const updated = await upgradeSubscription(activeSub.id, newPriceId);
      if (updated) {
        // Update user in database
        await supabaseUserService.upsertUser({
          email: user.email,
          stripe_customer_id: user.customerId,
          stripe_price_id: newPriceId,
          plan_name: getPlanNameFromPriceId(newPriceId),
          has_access: true,
        });
        return { action: 'upgraded', subscription: updated };
      }
    } else if (operation === 'downgrade') {
      const updated = await downgradeSubscription(activeSub.id, newPriceId);
      if (updated) {
        // Update user in database
        await supabaseUserService.upsertUser({
          email: user.email,
          stripe_customer_id: user.customerId,
          stripe_price_id: newPriceId,
          plan_name: getPlanNameFromPriceId(newPriceId),
          has_access: true,
        });
        return { action: 'downgraded', subscription: updated };
      }
    }

    return { action: 'error', error: 'Failed to manage subscription' };
  } catch (e) {
    console.error('Manage subscription error:', e);
    return { action: 'error', error: e instanceof Error ? e.message : 'Unknown error' };
  }
};

// This is used to create a Stripe Checkout for one-time payments or new subscriptions
export const createCheckout = async ({
  user,
  mode,
  clientReferenceId,
  successUrl,
  cancelUrl,
  priceId,
  couponId,
}: CreateCheckoutParams): Promise<string | null> => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-08-16",
      typescript: true,
    });

    const extraParams: {
      customer?: string;
      customer_creation?: "always";
      customer_email?: string;
      invoice_creation?: { enabled: boolean };
      payment_intent_data?: { setup_future_usage: "on_session" };
      tax_id_collection?: { enabled: boolean };
    } = {};

    if (user?.customerId) {
      extraParams.customer = user.customerId;
    } else {
      if (mode === "payment") {
        extraParams.customer_creation = "always";
        extraParams.payment_intent_data = { setup_future_usage: "on_session" };
      }
      if (user?.email) {
        extraParams.customer_email = user.email;
      }
      extraParams.tax_id_collection = { enabled: true };
    }

    const stripeSession = await stripe.checkout.sessions.create({
      mode,
      allow_promotion_codes: true,
      client_reference_id: clientReferenceId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      discounts: couponId
        ? [
            {
              coupon: couponId,
            },
          ]
        : [],
      success_url: successUrl,
      cancel_url: cancelUrl,
      ...extraParams,
    });

    return stripeSession.url;
  } catch (e) {
    console.error('Create checkout error:', e);
    return null;
  }
};

// This is used to create Customer Portal sessions, so users can manage their subscriptions (payment methods, cancel, etc..)
export const createCustomerPortal = async ({
  customerId,
  returnUrl,
}: CreateCustomerPortalParams): Promise<string> => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-08-16", // TODO: update this when Stripe updates their API
    typescript: true,
  });

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return portalSession.url;
};

// This is used to get the user checkout session and populate the data so we get the planId the user subscribed to
export const findCheckoutSession = async (sessionId: string) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-08-16", // TODO: update this when Stripe updates their API
      typescript: true,
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    return session;
  } catch (e) {
    console.error(e);
    return null;
  }
};
