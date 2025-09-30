import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { getWholesalerUsage } from "@/app/actions/supabase";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get wholesaler usage data
    const usage = await getWholesalerUsage();

    return NextResponse.json({
      success: true,
      usage: {
        buyer_count: usage.buyer_count || 0,
        tag_count: usage.tag_count || 0,
        email_count: usage.email_count || 0,
        current_plan: usage.current_plan || 'Free',
      }
    });

  } catch (error) {
    console.error("Error fetching wholesaler usage:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
