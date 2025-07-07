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
  console.log("eventType", eventType);
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
        const clientReferenceId = stripeObject.client_reference_id;
        const plan = configFile.stripe.plans.find((p) => p.priceId === priceId);
        
        if (!plan) {
          console.error('Plan not found for priceId:', priceId);
          return NextResponse.json({ error: 'Plan not found' }, { status: 400 });
        }

        const customer = (await stripe.customers.retrieve(
          customerId as string
        )) as Stripe.Customer;
        
        // If client reference ID exists (user was logged in), check if it matches customer email
        if (clientReferenceId && clientReferenceId !== customer.email) {
          console.warn('clientReferenceId does not match customer email. Ref:', clientReferenceId, 'Email:', customer.email);
        }
     
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

        break;
      }

      case "checkout.session.expired": {
        // User didn't complete the transaction
        break;
      }

      case "customer.subscription.updated": {
        // The customer might have changed the plan
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
        // Customer just paid an invoice
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
        // A payment failed
        break;

      default:
      // Unhandled event type
    }
  } catch (e) {
    console.error("stripe error: ", e.message);
  }

  return NextResponse.json({});
}
