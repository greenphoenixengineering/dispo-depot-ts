import Stripe from "stripe";
import { supabaseUserService } from "./supabase";
import configFile from "@/config";

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

function getPlanNameFromPriceId(priceId: string): string {
  const plan = configFile.stripe.plans.find(p => p.priceId === priceId);
  return plan ? plan.name : "Unknown";
}

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

// Helper: Update subscription to a new plan
export const updateSubscriptionPlan = async (subscriptionId: string, newPriceId: string): Promise<Stripe.Subscription | null> => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-08-16",
      typescript: true,
    });
    // Get subscription to find item id
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const itemId = subscription.items.data[0]?.id;
    if (!itemId) throw new Error('No subscription item found');
    const updated = await stripe.subscriptions.update(subscriptionId, {
      items: [{ id: itemId, price: newPriceId }],
      proration_behavior: 'create_prorations',
      cancel_at_period_end: false, // <-- This removes the scheduled cancellation!
    });
    return updated;
  } catch (e) {
    console.error(e);
    return null;
  }
};

// This is used to create a Stripe Checkout for one-time payments. It's usually triggered with the <ButtonCheckout /> component. Webhooks are used to update the user's state in the database.
export const createCheckout = async ({
  user,
  mode,
  clientReferenceId,
  successUrl,
  cancelUrl,
  priceId,
  couponId,
}: CreateCheckoutParams): Promise<string> => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-08-16", // TODO: update this when Stripe updates their API
      typescript: true,
    });

    // If mode is subscription and user has a customerId, check for active subscription
    if (mode === 'subscription' && user?.customerId) {
      const activeSub = await findActiveSubscription(user.customerId);
      if (activeSub) {
        const subs = await stripe.subscriptions.list({
          customer: user.customerId,
          status: 'active',
          limit: 10, // get all, not just 1
        });

        if (subs.data.length > 1) {
          // Cancel all but the first subscription
          for (let i = 1; i < subs.data.length; i++) {
            await stripe.subscriptions.cancel(subs.data[i].id);
          }
        }

        // Now update the first (remaining) subscription
        const updatedSub = await updateSubscriptionPlan(subs.data[0].id, priceId);
        if (updatedSub) {
          // Update user in Supabase
          await supabaseUserService.upsertUser({
            email: user.email,
            stripe_customer_id: user.customerId,
            stripe_price_id: priceId,
            plan_name: getPlanNameFromPriceId(priceId), // You may need a helper for this
            has_access: true,
            // ...other fields as needed
          });
        }
        return '/dashboard';
      }
    }

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
        // The option below costs 0.4% (up to $2) per invoice. Alternatively, you can use https://zenvoice.io/ to create unlimited invoices automatically.
        // extraParams.invoice_creation = { enabled: true };
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
    console.error(e);
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

// This is used to get the uesr checkout session and populate the data so we get the planId the user subscribed to
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
