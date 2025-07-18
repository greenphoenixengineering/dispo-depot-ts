import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import configFile from "@/config";
import { findCheckoutSession } from "@/libs/stripe";
import { insertIntoUsage, supabaseUserService } from "@/libs/supabase";
import { getWholesalerByEmail } from '@/app/actions/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
  typescript: true,
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = headers().get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const { type, data: { object } } = event;

  try {
    switch (type) {
      // ────────────────────────────────────────────────────────────────
      // 1) NEW SUBSCRIPTIONS via Checkout
      // ────────────────────────────────────────────────────────────────
      case "checkout.session.completed": {
        // First payment is successful and a subscription is created (if mode was set to "subscription" in ButtonCheckout)
        // ✅ Grant access to the product
        const stripeObject: Stripe.Checkout.Session = event.data
          .object as Stripe.Checkout.Session;
        const session = await findCheckoutSession(stripeObject.id);

        const customerId = session?.customer;
        const priceId = session?.line_items?.data[0]?.price.id;
        const clientReferenceId = stripeObject.client_reference_id;
        const plan = configFile.stripe.plans.find((p) => p.priceId === priceId);
        
        if (!plan) {
          console.error('Plan not found for priceId:', priceId);
          return NextResponse.json({ error: 'Plan not found' }, { status: 400 });
        }

        const customer = (await stripe.customers.retrieve(
          customerId as string
        )) as Stripe.Customer;

        // Fetch wholesaler_id if possible
        let wholesaler_id = null;
        try {
          if (clientReferenceId) {
            const wholesaler = await getWholesalerByEmail(clientReferenceId);
            wholesaler_id = wholesaler?.id || null;
          }
        } catch (e) {
          console.warn('Could not fetch wholesaler_id:', e);
        }
        
        // Store user plan information in Supabase
        try {
          const subscriptionInfo= await supabaseUserService.upsertUser({
            email: customer.email || '',
            name: customer.name || '',
            stripe_customer_id: customerId as string,
            stripe_price_id: priceId,
            plan_name: plan.name,
            has_access: true,
            wholesaler_id: wholesaler_id,
          });

          console.log("subscription info",subscriptionInfo)
          await insertIntoUsage(wholesaler_id,plan.name,subscriptionInfo?.id)
          console.log('User plan info stored in Supabase successfully');
        } catch (supabaseError) {
          console.error('Failed to store user in Supabase:', supabaseError);
          throw supabaseError;
        }
        break;
      }

      // ────────────────────────────────────────────────────────────────
      // 2) SUBSCRIPTION CREATED & UPDATED (change plan, trial, cancel@period_end)
      // ────────────────────────────────────────────────────────────────
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const priceId = sub.items.data[0].price.id;
        const status = sub.status; // 'active' | 'trialing' | 'past_due' | etc.
        const plan = configFile.stripe.plans.find(p => p.priceId === priceId);

        if (!plan) {
          console.warn("No plan config for priceId:", priceId);
          break;
        }

        // Did they click “Cancel at end of period”?
        const isCancelling = sub.cancel_at_period_end === true;
        const cancelAt = isCancelling && sub.cancel_at
          ? new Date(sub.cancel_at * 1000).toISOString()
          : null;

        // Only give access on active/trialing
        const hasAccess = ["active", "trialing"].includes(status);

        // Look up their existing Supabase row so we can grab email/name
        const supaUser = await supabaseUserService.getUserByStripeCustomerId(customerId);
        const email = supaUser?.email || "";
        const name = supaUser?.name || "";

        await supabaseUserService.upsertUser({
          email,
          name,
          stripe_customer_id: customerId,
          stripe_price_id: priceId,
          plan_name: plan.name,
          has_access: hasAccess,
          wholesaler_id:supaUser.wholesaler_id
          // cancel_at: cancelAt,
          // subscription_status: status,
        });

        console.log(`🔄 ${type} → user ${email} updated:`, {
          plan: plan.name,
          status,
          isCancelling,
          cancelAt,
        });
        break;
      }

      // ────────────────────────────────────────────────────────────────
      // 3) SUBSCRIPTION DELETED (final cancel)
      // ────────────────────────────────────────────────────────────────
      case "customer.subscription.deleted": {
        // The customer subscription stopped
        // ❌ Revoke access to the product and downgrade plan
        const stripeObject: Stripe.Subscription = event.data
          .object as Stripe.Subscription;

        // Update Supabase user access and plan
        try {
          const supabaseUser = await supabaseUserService.getUserByStripeCustomerId(stripeObject.customer as string);
          if (supabaseUser) {
            await supabaseUserService.upsertUser({
              email: supabaseUser.email,
              name: supabaseUser.name,
              stripe_customer_id: stripeObject.customer as string,
              stripe_price_id: null, // Downgrade to no plan
              plan_name: "Free",    // Downgrade to Free plan
              has_access: false,
              wholesaler_id:supabaseUser.wholesaler_id
            });
            console.log('User access revoked and plan downgraded in Supabase');
          }
        } catch (supabaseError) {
          console.error('Failed to update Supabase user access and plan:', supabaseError);
        }

        break;
      }

      // ────────────────────────────────────────────────────────────────
      // 4) OPTIONAL: INVOICE EVENTS (renewal, payment failure)
      // ────────────────────────────────────────────────────────────────
      case "invoice.paid": {
        const inv = object as Stripe.Invoice;
        const customerId = inv.customer as string;

        const supaUser = await supabaseUserService.getUserByStripeCustomerId(customerId);
        if (supaUser) {
          await supabaseUserService.updateUserAccess(supaUser.email, true);
          console.log(`💰 invoice.paid → access confirmed for ${supaUser.email}`);
        }
        break;
      }

      case "invoice.payment_failed": {
        const inv = object as Stripe.Invoice;
        const customerId = inv.customer as string;

        const supaUser = await supabaseUserService.getUserByStripeCustomerId(customerId);
        if (supaUser) {
          console.warn(`⚠️ invoice.payment_failed for ${supaUser.email}`);
          // you might revoke access here or start a dunning flow
        }
        break;
      }

      // ────────────────────────────────────────────────────────────────
      // 5) TRIAL ENDING SOON (optional email)
      // ────────────────────────────────────────────────────────────────
      case "customer.subscription.trial_will_end": {
        const sub = object as Stripe.Subscription;
        console.log("⏰ Trial ending soon for", sub.customer);
        // fire off an email reminder if you like
        break;
      }

      default:
        console.log("⚡ Unhandled event type:", type);
    }

  } catch (err: any) {
    console.error("❗️ Error handling webhook event", type, err);
  }

  return NextResponse.json({ received: true });
}