import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { createCheckout } from "@/libs/stripe";
import { supabaseUserService } from "@/libs/supabase";
import config from "@/config";

// This function is used to create a Stripe Checkout Session (one-time payment or subscription)
// It's called by the <ButtonCheckout /> component
// Requires users to be authenticated and will prefill the Checkout data with their email
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  // Require authentication
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Authentication required", redirectUrl: config.auth.loginUrl },
      { status: 401 }
    );
  }

  const body = await req.json();
  
  if (!body.priceId) {
    return NextResponse.json(
      { error: "Price ID is required" },
      { status: 400 }
    );
  } else if (!body.successUrl || !body.cancelUrl) {
    return NextResponse.json(
      { error: "Success and cancel URLs are required" },
      { status: 400 }
    );
  } else if (!body.mode) {
    return NextResponse.json(
      {
        error:
          "Mode is required (either 'payment' for one-time payments or 'subscription' for recurring subscription)",
      },
      { status: 400 }
    );
  }

  try {
    // Get user from Supabase if they exist
    let supabaseUser = null;
    try {
      supabaseUser = await supabaseUserService.getUserByEmail(session.user.email);
    } catch (error) {
      // User doesn't exist in Supabase yet, which is fine
      console.log('User not found in Supabase, will be created during checkout');
    }

    const { priceId, mode, successUrl, cancelUrl } = body;

    const stripeSessionURL = await createCheckout({
      priceId,
      mode,
      successUrl,
      cancelUrl,
      // Pass the user email to the Stripe Session so it can be retrieved in the webhook later
      clientReferenceId: session.user.email,
      // Automatically prefill Checkout data with email for faster checkout
      user: {
        email: session.user.email,
        customerId: supabaseUser?.stripe_customer_id,
      },
      // If you send coupons from the frontend, you can pass it here
      // couponId: body.couponId,
    });

    if (!stripeSessionURL) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: stripeSessionURL });
  } catch (e) {
    console.error('Create checkout error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
