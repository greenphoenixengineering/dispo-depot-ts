import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { getCurrentWholesaler, getCurrentEmailUsage, canSendEmails, getWholesalerUsage } from "@/app/actions/supabase";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get wholesaler and usage data
    const wholesaler = await getCurrentWholesaler();
    const usage = await getWholesalerUsage();
    const currentPlan = usage.current_plan || 'Free';

    // Get current email usage from simple usage table
    const emailUsageResult = await getCurrentEmailUsage();

    if (!emailUsageResult.success) {
      return NextResponse.json(
        { error: emailUsageResult.error },
        { status: 500 }
      );
    }

    // Check send permissions
    const permissionResult = await canSendEmails();
    let sendPermissions = null;
    if (permissionResult.success) {
      sendPermissions = permissionResult.data;
    }

    return NextResponse.json({
      success: true,
      data: {
        currentPlan,
        emailUsage: emailUsageResult.data,
        sendPermissions,
        monthYear: new Date().toISOString().slice(0, 7) // YYYY-MM format
      }
    });

  } catch (error) {
    console.error("Error fetching email usage:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if can send emails using simple usage count
    const permissionResult = await canSendEmails();

    if (!permissionResult.success) {
      return NextResponse.json(
        { error: permissionResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      canSend: permissionResult.canSend,
      data: permissionResult.data
    });

  } catch (error) {
    console.error("Error checking email permissions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
