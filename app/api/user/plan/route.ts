import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { supabaseUserService } from "@/libs/supabase";


//Create API Endpoint to Get User Plan Info
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user plan information from Supabase
    const userPlan = await supabaseUserService.getUserByEmail(session.user.email);

    if (!userPlan) {
      return NextResponse.json(
        { error: "User plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        email: userPlan.email,
        name: userPlan.name,
        plan_name: userPlan.plan_name,
        has_access: userPlan.has_access,
        stripe_customer_id: userPlan.stripe_customer_id,
        stripe_price_id: userPlan.stripe_price_id,
        created_at: userPlan.created_at,
        updated_at: userPlan.updated_at,
        wholesaler_id: userPlan.wholesaler_id,
      }
    });

  } catch (error) {
    console.error("Error fetching user plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 