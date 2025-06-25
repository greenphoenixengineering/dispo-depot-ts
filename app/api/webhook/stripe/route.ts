import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import configFile from "@/config";
import { findCheckoutSession } from "@/libs/stripe";
import { supabaseUserService } from "@/libs/supabase";


//  Update Stripe Webhook to Store in Supabase
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
  typescript: true,
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// This is where we receive Stripe webhook events
// It's used to update user data, send emails, etc...
// Now stores user plan data in Supabase only
export async function POST(req: NextRequest) {
  const body = await req.text();

  const signature = headers().get("stripe-signature");

  let eventType;
  let event;

  // verify Stripe event is legit
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed. ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  eventType = event.type;

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        // First payment is successful and a subscription is created (if mode was set to "subscription" in ButtonCheckout)
        // ✅ Grant access to the product
        const stripeObject: Stripe.Checkout.Session = event.data
          .object as Stripe.Checkout.Session;

        const session = await findCheckoutSession(stripeObject.id);

        const customerId = session?.customer;
        const priceId = session?.line_items?.data[0]?.price.id;
        const userId = stripeObject.client_reference_id;
        const plan = configFile.stripe.plans.find((p) => p.priceId === priceId);

        if (!plan) break;

        const customer = (await stripe.customers.retrieve(
          customerId as string
        )) as Stripe.Customer;

        // Store user plan information in Supabase
        try {
          await supabaseUserService.upsertUser({
            email: customer.email || '',
            name: customer.name || '',
            stripe_customer_id: customerId as string,
            stripe_price_id: priceId,
            plan_name: plan.name,
            has_access: true,
          });
          console.log('User plan info stored in Supabase successfully');
        } catch (supabaseError) {
          console.error('Failed to store user in Supabase:', supabaseError);
          throw supabaseError;
        }

        // Extra: send email with user link, product page, etc...
        // try {
        //   await sendEmail(...);
        // } catch (e) {
        //   console.error("Email issue:" + e?.message);
        // }

        break;
      }

      case "checkout.session.expired": {
        // User didn't complete the transaction
        // You don't need to do anything here, but you can send an email to the user to remind them to complete the transaction, for instance
        break;
      }

      case "customer.subscription.updated": {
        // The customer might have changed the plan (higher or lower plan, cancel soon etc...)
        // You don't need to do anything here, because Stripe will let us know when the subscription is canceled for good (at the end of the billing cycle) in the "customer.subscription.deleted" event
        // You can update the user data to show a "Subscription ending soon" badge for instance
        break;
      }

      case "customer.subscription.deleted": {
        // The customer subscription stopped
        // ❌ Revoke access to the product
        const stripeObject: Stripe.Subscription = event.data
          .object as Stripe.Subscription;

        // Update Supabase user access
        try {
          const supabaseUser = await supabaseUserService.getUserByStripeCustomerId(stripeObject.customer as string);
          if (supabaseUser) {
            await supabaseUserService.updateUserAccess(supabaseUser.email, false);
            console.log('User access revoked in Supabase');
          }
        } catch (supabaseError) {
          console.error('Failed to update Supabase user access:', supabaseError);
        }

        break;
      }

      case "invoice.paid": {
        // Customer just paid an invoice (for instance, a recurring payment for a subscription)
        // ✅ Grant access to the product

        const stripeObject: Stripe.Invoice = event.data
          .object as Stripe.Invoice;

        const customerId = stripeObject.customer;

        // Update Supabase user access
        try {
          const supabaseUser = await supabaseUserService.getUserByStripeCustomerId(customerId as string);
          if (supabaseUser) {
            await supabaseUserService.updateUserAccess(supabaseUser.email, true);
            console.log('User access granted in Supabase');
          }
        } catch (supabaseError) {
          console.error('Failed to update Supabase user access:', supabaseError);
        }

        break;
      }

      case "invoice.payment_failed":
        // A payment failed (for instance the customer does not have a valid payment method)
        // ❌ Revoke access to the product
        // ⏳ OR wait for the customer to pay (more friendly):
        //      - Stripe will automatically email the customer (Smart Retries)
        //      - We will receive a "customer.subscription.deleted" when all retries were made and the subscription has expired

        break;

      default:
      // Unhandled event type
    }
  } catch (e) {
    console.error("stripe error: ", e.message);
  }

  return NextResponse.json({});
}
