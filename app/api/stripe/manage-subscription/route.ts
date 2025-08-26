import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { manageSubscription } from "@/libs/stripe";
import { supabaseUserService } from "@/libs/supabase";
import config from "@/config";

// This function is used to manage subscriptions (upgrade, downgrade, new)
// It's called by components that need to change user subscription plans
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
  } else if (!body.operation) {
    return NextResponse.json(
      { error: "Operation is required (upgrade, downgrade, or new)" },
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
      console.log('User not found in Supabase, will be created during subscription management');
    }

    const { priceId, operation } = body;

    const result = await manageSubscription({
      user: {
        email: session.user.email,
        customerId: supabaseUser?.stripe_customer_id,
      },
      newPriceId: priceId,
      operation: operation,
    });

    if (result.action === 'error') {
      return NextResponse.json(
        { error: result.error || 'Failed to manage subscription' },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error('Manage subscription error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 