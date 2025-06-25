import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { createCustomerPortal } from "@/libs/stripe";
import { supabaseUserService } from "@/libs/supabase";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (session) {
    try {
      const body = await req.json();

      if (!session.user.email) {
        return NextResponse.json(
          { error: "User email not found" },
          { status: 400 }
        );
      }

      // Get user from Supabase
      const supabaseUser = await supabaseUserService.getUserByEmail(session.user.email);

      if (!supabaseUser?.stripe_customer_id) {
        return NextResponse.json(
          {
            error:
              "You don't have a billing account yet. Make a purchase first.",
          },
          { status: 400 }
        );
      } else if (!body.returnUrl) {
        return NextResponse.json(
          { error: "Return URL is required" },
          { status: 400 }
        );
      }

      const stripePortalUrl = await createCustomerPortal({
        customerId: supabaseUser.stripe_customer_id,
        returnUrl: body.returnUrl,
      });

      return NextResponse.json({
        url: stripePortalUrl,
      });
    } catch (e) {
      console.error(e);
      return NextResponse.json({ error: e?.message }, { status: 500 });
    }
  } else {
    // Not Signed in
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
}
