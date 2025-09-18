"use server";

import { authOptions } from "@/libs/next-auth";
import { supabase } from "@/libs/supabase";
import { DeleteBuyer, NewBuyerInSupa, UpdateBuyer } from "@/libs/types";

import { DeletedTag, NewTag } from "@/libs/tagTypes";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { mailerLiteFetch } from "./mailerLite";
import { SendDealsState } from "@/libs/sendDealTypes";
import { error } from "console";
import { EmailUsageData } from "@/types";

export async function getBuyersWithTags() {
  const wholesalerData = await getCurrentWholesaler();

  const { data, error } = await supabase
    .from("buyer")
    .select(
      `*,
        buyer_tags (
        tags:tag_id (
          id,
          name
        )
      )`
    )
    .eq("wholesaler_id", wholesalerData.id);

  if (error) {
    throw new Error("there was an error getting buyer with tags");
  } else {
    return data;
  }
}

export async function getCurrentWholesaler() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized: No user session found.");
  }

  if (session.wholesaler) {
    return session.wholesaler;
  }

  if (!session.user?.id) {
    throw new Error("Unauthorized: No user ID found in session.");
  }
  return await getWholesalerById(session.user.id);
}
export async function getWholesalerById(wholesalerId: string) {
  if (!wholesalerId) {
    throw new Error("No wholesaler ID found.");
  }

  const { data, error } = await supabase
    .from("wholesaler")
    .select("*")
    .eq("user_id", wholesalerId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch wholesaler: ${error.message}`);
  }

  return data;
}

export async function getWholesalerTags() {
  const wholesalerData = await getCurrentWholesaler();

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized: No user session found.");
  }

  let { data: tags, error } = await supabase
    .from("tags")
    .select("*")

    .eq("wholesaler_id", wholesalerData.id);

  if (error) {
    throw new Error(`Failed to fetch tags: ${error.message}`);
  }

  return tags;
}

export async function updateBuyerAndTagsAction(payload: UpdateBuyer) {
  const { buyerId, updates, tags, buyerApiId } = payload;
  const tagIds = tags.map((tagInfo: any) => tagInfo.id);

  const mailerLiteGroupIds = tags.map((tagInfo: any) => tagInfo.api_id);

  // --- Call the Supabase RPC Function ---
  const { error: rpcError } = await supabase.rpc("update_buyer_and_sync_tags", {
    p_buyer_id: buyerId,
    p_first_name: updates.first_name,
    p_last_name: updates.last_name,
    p_email: updates.email,
    p_phone_num: updates.phone_num,
    p_tag_ids: tagIds,
  });

  if (rpcError) {
    console.error(
      "[Action Error] RPC call 'update_buyer_and_sync_tags' failed:",
      rpcError
    );

    return {
      success: false,
      message: `Failed to update buyer`,
      error: rpcError,
    };
  }

  try {
    const payload = {
      email: updates.email,
      fields: {
        name: updates.first_name,
        last_name: updates.last_name,
        phone: updates.phone_num,
      },
      groups: mailerLiteGroupIds,
      status: "active",
    };
    const response = await mailerLiteFetch(
      `/subscribers/${buyerApiId}`,
      "PUT",
      payload
    );

    if (!response.ok) {
      return { success: false, message: "Error updating buyer!" };
    }
    await response.json();
  } catch (revalidateError) {
    console.warn(
      "[Action Warning] Failed to revalidate path:",
      revalidateError
    );
    return { success: false, message: "Error updating buyer!" };
  }

  revalidatePath("/dashboard");
  return { success: true, message: "Buyer updated successfully!" };
}

export async function linkBuyerToTag(buyerAndTagData: any) {
  const { buyer_id, tag_id } = buyerAndTagData;

  const { data, error } = await supabase
    .from("buyer_tags")
    .insert([
      {
        buyer_id,
        tag_id,
      },
    ])
    .select();

  if (error) {
    throw new Error(`error linking a buyer with tag: ${error.message}`);
  }

  revalidatePath("/dashboard");

  return data;
}

export async function getSingleBuyer(buyerId: string) {
  const { data, error } = await supabase
    .from("buyer")
    .select(
      `*,
        buyer_tags (
        tags:tag_id (
          id,
          name,
          api_id
        )
      )`
    )
    .eq("id", buyerId);

  if (error) {
    throw new Error("error getting a single buyer");
  } else {
    return data;
  }
}

// get single tag
export async function getSingleTag(id: number) {
  let { data: tag, error } = await supabase
    .from("tags")
    .select("*")

    .eq("id", id);
  if (error) {
    throw new Error("error getting a single tag");
  }
  return tag;
}

export async function getTagsWithCounts() {
  const wholesalerData = await getCurrentWholesaler();

  if (!wholesalerData.id) {
    return { tags: [], error: { message: "Wholesaler ID is required." } };
  }

  try {
    const { data, error } = await supabase.rpc("get_tags_with_buyer_count", {
      wholesaler_id_input: wholesalerData.id,
    });

    if (error) {
      throw new Error(`error fetching tag: ${error.message}`);
    }

    return data;
  } catch (error: any) {
    return {
      tags: [],
      error: { message: error.message || "Failed to fetch tags with counts." },
    };
  }
}

export async function addTagToSupabase(payload: any) {
  const wholesalerData = await getCurrentWholesaler();

  const { name, api_id } = payload;

  const { error } = await supabase
    .from("tags")
    .insert([
      {
        name,
        api_id,
        wholesaler_id: wholesalerData.id,
      },
    ])
    .select();

  if (error) {
    return {
      success: false,
      error: "there was an error adding tag to supabase",
    };
  }
  revalidatePath("/dashboard/tags");

  return { success: true };
}

export async function addTagToMailerlite(payload: NewTag) {
  try {
    const response = await mailerLiteFetch(`/groups`, "POST", payload);

    const result = await response.json();

    if (response.ok || !result.errors) {
      return { status: true, tagApiId: result?.data?.id };
    } else {
      return { status: false, error: result.errors.name[0] };
    }
  } catch (e) {
    throw new Error("error adding buyer to mailerlite");
  }
}

export async function addBuyer(newBuyer: NewBuyerInSupa) {
  const wholesalerData = await getCurrentWholesaler();

  const { first_name, last_name, email, phone_num, api_id } = newBuyer;

  const { data, error } = await supabase
    .from("buyer")
    .insert([
      {
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone_num: phone_num,
        api_id,
        wholesaler_id: wholesalerData.id,
      },
    ])
    .select();

  if (error) {
    throw new Error(`Failed to add buyer: ${error.message}`);
  }

  return data;
}

// update tag
export async function UpdateTag(payload: any) {
  const { tagId, tagApiId, newTagName } = payload;

  try {
    const { error } = await supabase
      .from("tags")
      .update({ name: newTagName })
      .eq("id", tagId)
      .select();

    if (error) {
      return { success: false, message: "error updating tag on supabase" };
    }
    const response = await mailerLiteFetch(`/groups/${tagApiId}`, "PUT", {
      name: newTagName,
    });

    if (!response.ok) {
      return { success: false, message: "Error updating tag on mailerlit!" };
    }
    revalidatePath("/dashboard/tags");
    return { success: true };
  } catch {
    throw new Error("unexptected error happens during updating a tag");
  }
}

export async function deleteTag(payload: DeletedTag) {
  const { tagId, tagApiId } = payload;

  try {
    // delete tag from tags table
    const { error } = await supabase.from("tags").delete().eq("id", tagId);

    if (error) {
      return { success: false, error: error.message };
    }
    const response = await mailerLiteFetch(`/groups/${tagApiId}`, "DELETE");

    if (response.ok) {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (e) {
    throw new Error("error deleting tag");
  }
}

export async function deleteBuyer(DeletePayload: DeleteBuyer) {
  const { error: deleteError } = await supabase
    .from("buyer")
    .delete()
    .eq("id", DeletePayload.buyerId);

  if (deleteError) {
    return { success: false, message: "Error deleting buyer!" };
  }

  const response = await mailerLiteFetch(
    `/subscribers/${DeletePayload.buyerApiId}`,
    "DELETE"
  );

  if (!response.ok) {
    return { success: false, message: "Error deleting buyer!" };
  }

  return { success: true, message: "Buyer deleted successfully!" };
}

export async function updateUserAliasOnSupa(payload: {
  alias: string;
  userId: string;
}) {
  const { error } = await supabase
    .from("wholesaler")
    .update({ alias: payload.alias })
    .eq("user_id", payload.userId)
    .select();

  if (error) {
    return { success: false };
  } else {
    return { success: true };
  }
}

export async function sendDealsAction(
  prevState: SendDealsState,
  formData: FormData
): Promise<SendDealsState> {
  const subject = formData.get("subject") as string;
  const messageContent = formData.get("message") as string;
  const selectedTags = formData.getAll("selectedTags") as string[];

  const errors: SendDealsState["errors"] = {};

  if (selectedTags.length === 0) {
    errors.tags = "Please select at least one buyer group.";
  }
  if (!subject) {
    errors.subject = "Subject line is required.";
  }
  if (!messageContent) {
    errors.message = "Message is required.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, success: false };
  }

  // Check email sending limits using simple usage table
  try {
    // Get user session first for authorization
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return {
        errors: { api: "Unauthorized: No user session found." },
        success: false,
      };
    }

    const { currentEmailCount, planLimits } = await getEmailUsageData();

    // Simple email limit check using plan limits
    if (planLimits.emailsPerTagPerMonth !== Infinity) {
      if (currentEmailCount >= planLimits.emailsPerTagPerMonth) {
        return {
          errors: {
            api: `Email limit reached (${currentEmailCount}/${planLimits.emailsPerTagPerMonth} emails this month). Please upgrade your plan or wait until next month.`,
          },
          success: false,
        };
      }
    }
  } catch (limitError) {
    console.error("Error checking email limits:", limitError);
    return {
      errors: { api: "Error checking email limits. Please try again." },
      success: false,
    };
  }

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  const campaignName = `${subject}_${formattedDate}`;

  // Get wholesaler for email payload
  const currentWholesaler = await getCurrentWholesaler();

  // ----- STEP 1: Create Campaign Shell (Mailerlite) -----
  const mailerLitePayload = {
    name: campaignName,
    type: "regular",
    emails: [
      {
        subject: subject,
        from_name: `${currentWholesaler.first_name} ${currentWholesaler.last_name}`,
        from: `messenger@mydispodepot.io`,
        reply_to: "support@mydispodepot.io",
        content: messageContent,
      },
    ],
    groups: selectedTags,
  };

  try {
    const createCampaignResponse = await mailerLiteFetch(
      "/campaigns",
      "POST",
      mailerLitePayload
    );
    const createCampaignResult = await createCampaignResponse.json();

    if (
      !createCampaignResponse.ok ||
      !createCampaignResult.data ||
      !createCampaignResult.data.id
    ) {
      const apiErrorMsg =
        createCampaignResult.message ||
        (createCampaignResult.errors
          ? JSON.stringify(createCampaignResult.errors)
          : `API request failed: ${createCampaignResponse.status}`);
      return {
        errors: { api: `Failed to create campaign: ${apiErrorMsg}` },
        success: false,
      };
    }

    const campaignId = createCampaignResult.data.id;

    // ----- STEP 2: SAVE CAMPAIGN ID TO SUPABASE -----
    const { error: supabaseInsertError } = await supabase
      .from("wholesaler_campaign")
      .insert({
        campaign_id: campaignId,
        wholesaler_id: currentWholesaler?.id,
      });

    if (supabaseInsertError) {
      return {
        errors: {
          api: `Failed to save campaign to DB: ${supabaseInsertError.message}`,
        },
        success: false,
      };
    }

    // ----- STEP 3: Schedule / send the campaign (Mailerlite) -----
    const sendDealActionPayload = { delivery: "instant" };

    const sendCampaignResponse = await mailerLiteFetch(
      `/campaigns/${campaignId}/schedule`,
      "POST",
      sendDealActionPayload
    );

    const sendCampaignResult = await sendCampaignResponse.json();

    if (!sendCampaignResponse.ok) {
      console.error(
        "Mailerlite API Error (Send Campaign):",
        sendCampaignResult
      );
      const errorMessage =
        sendCampaignResult.message ||
        (sendCampaignResult.errors
          ? JSON.stringify(sendCampaignResult.errors)
          : `Send action failed: ${sendCampaignResponse.status}`);
      return {
        errors: { api: `Failed to send campaign: ${errorMessage}` },
        success: false,
      };
    }

    // INCREMENT EMAIL USAGE COUNT WITH MONTHLY RESET
    const { error: incrementError } = await supabase.rpc(
      "increment_email_count_with_reset",
      {
        wholesaler_id_input: currentWholesaler.id,
      }
    );

    if (incrementError) {
      console.error("Error incrementing email count:", incrementError);
      // Continue anyway - don't fail the email send for tracking issues
    }

    return { message: "Deal sent successfully!", success: true };
  } catch (error: any) {
    console.error("Error in sendDeals action:", error);
    return {
      errors: { api: error.message || "An unexpected error occurred." },
      success: false,
    };
  }
}

export async function getWholesalerByEmail(email: string) {
  const { data, error } = await supabase
    .from("wholesaler")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    throw new Error(`Failed to fetch wholesaler by email: ${error.message}`);
  }

  return data;
}

// GENERIC FUNCTION TO INCREASE THE BUYER_COUNT OR TAG_COUNT or EMAIL_COUNT ON USAGE TABLE

type UsageMetric = "buyer_count" | "tag_count" | "email_count";
type DecrementableUsageMetric = "buyer_count" | "tag_count";
type UsageData = Partial<Record<UsageMetric, number>>; // An object where keys are from UsageMetric and values are numbers

export async function incrementUsageCount(metricName: UsageMetric) {
  try {
    // 1. Get the current user/wholesaler
    const wholesalerData = await getCurrentWholesaler();
    if (!wholesalerData || !wholesalerData.id) {
      throw new Error("Could not identify the current wholesaler.");
    }
    const wholesalerId = wholesalerData.id;

    const { data, error: fetchError } = await supabase
      .from("usage")
      .select(metricName)
      .eq("wholesaler_id", wholesalerId)
      .single();

    // Cast the data to your defined type
    const usageData = data as UsageData;
    if (fetchError) {
      console.error(
        `Error fetching usage data for ${metricName}:`,
        fetchError.message
      );
      throw fetchError;
    }

    // 3. Increment the value in your code
    const currentCount = usageData ? usageData[metricName] : 0;
    const newCount = (currentCount || 0) + 1;

    // 4. Write the new, calculated value back to the database
    const { error: updateError } = await supabase
      .from("usage")
      .update({ [metricName]: newCount })
      .eq("wholesaler_id", wholesalerId);

    if (updateError) {
      console.error(`Error updating ${metricName}:`, updateError.message);
      return { success: false, message: `Error increasing the ${metricName}.` };
    }

    return { success: true, newCount };
  } catch (error: any) {
    // Make the generic error message more informative
    const metric = typeof metricName === "string" ? metricName : "a count";
    return {
      success: false,
      message: `An unexpected error occurred while updating ${metric}. Details: ${error.message}`,
    };
  }
}

// GENERIC FUNCTION TO DECREASE A USAGE METRIC
export async function decreaseUsageCount(metricName: DecrementableUsageMetric) {
  try {
    // 1. Get the current user/wholesaler
    const wholesalerData = await getCurrentWholesaler();
    if (!wholesalerData || !wholesalerData.id) {
      throw new Error("Could not identify the current wholesaler.");
    }
    const wholesalerId = wholesalerData.id;

    // 2. Read the current counts from the database
    const { data: usageData, error: fetchError } = await supabase
      .from("usage")
      .select("buyer_count, tag_count, email_count")
      .eq("wholesaler_id", wholesalerId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // 3. Get the current count and perform the safety check
    const currentCount = usageData ? usageData[metricName] : 0;

    // If the count is already zero, do nothing and report success.
    if (currentCount <= 0) {
      console.log(
        `Attempted to decrease ${metricName}, but it is already at 0.`
      );
    }

    // 4. Calculate the new, decreased value
    const newCount = currentCount - 1;

    // 5. Write the new value back to the database
    const { error: updateError } = await supabase
      .from("usage")
      .update({ [metricName]: newCount })
      .eq("wholesaler_id", wholesalerId);

    if (updateError) {
      throw error(`Error decreasing ${metricName}:`, updateError.message);
    }

    return { success: true, newCount };
  } catch (error: any) {
    return {
      success: false,
      message: `An unexpected error occurred while decreasing ${metricName}. Details: ${error.message}`,
    };
  }
}

// get user usage
export async function getWholesalerUsage() {
  const wholesalerData = await getCurrentWholesaler();
  const { data, error } = await supabase
    .from("usage")
    .select("*")
    .eq("wholesaler_id", wholesalerData.id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Creates a new wholesaler record in the database without subscription
 *
 * @param wholesalerData - Object containing wholesaler information
 * @returns The created wholesaler record or error information
 */
export async function createWholesaler(wholesalerData: {
  first_name: string;
  last_name: string;
  email: string;
  user_id: string;
}) {
  try {
    // Insert the wholesaler record only
    const { data: wholesaler } = await supabase
      .from("wholesaler")
      .insert([
        {
          first_name: wholesalerData.first_name,
          last_name: wholesalerData.last_name,
          email: wholesalerData.email,
          user_id: wholesalerData.user_id,
          alias: `reply-${wholesalerData.user_id}@mydispodepot.io`,
          email_authorized: true,
        },
      ])
      .select()
      .single();
    // Return success with the created wholesaler data
    return wholesaler;
  } catch (error: any) {
    console.error("Unexpected error creating wholesaler:", error);
    return null;
  }
}

// EMAIL TRACKING FUNCTIONS - NOW USING SIMPLE USAGE TABLE

/**
 * Shared helper function to get email usage data and limits
 * Used by both getCurrentEmailUsage and sendDeal functions
 */
async function getEmailUsageData(): Promise<EmailUsageData> {
  try {
    const currentWholesaler = await getCurrentWholesaler();

    // Reset monthly count if needed before getting usage
    await supabase.rpc("reset_monthly_email_count", {
      wholesaler_id_input: currentWholesaler.id,
    });

    const usage = await getWholesalerUsage();
    const currentPlan = usage.current_plan || "Free";
    const { getPlanLimits } = await import("@/libs/planLimits");
    const planLimits = getPlanLimits(currentPlan as any);

    return {
      wholesaler: currentWholesaler,
      usage,
      currentPlan,
      planLimits,
      currentEmailCount: usage.email_count || 0,
    };
  } catch (error: any) {
    console.error("Error getting email usage data:", error);

    // Return fallback data structure to prevent crashes
    return {
      wholesaler: null,
      usage: null,
      currentPlan: "Free",
      planLimits: { emailsPerTagPerMonth: 0 },
      currentEmailCount: 0,
      error: error.message,
    };
  }
}

/**
 * Get current email usage from usage table
 */
export async function getCurrentEmailUsage() {
  try {
    const { currentEmailCount, planLimits, currentPlan } =
      await getEmailUsageData();

    return {
      success: true,
      data: {
        current: currentEmailCount,
        limit: planLimits.emailsPerTagPerMonth,
        plan: currentPlan,
        canSend:
          planLimits.emailsPerTagPerMonth === Infinity ||
          currentEmailCount < planLimits.emailsPerTagPerMonth,
      } as {
        current: number;
        limit: number | typeof Infinity;
        plan: string;
        canSend: boolean;
      },
    };
  } catch (error: any) {
    console.error("Error getting email usage:", error);
    return { success: false, data: null as any, error: error.message };
  }
}

/**
 * Check if wholesaler can send emails based on simple usage count
 */
export async function canSendEmails() {
  try {
    const currentWholesaler = await getCurrentWholesaler();

    // Reset monthly count if needed before checking limits
    await supabase.rpc("reset_monthly_email_count", {
      wholesaler_id_input: currentWholesaler.id,
    });

    const usage = await getWholesalerUsage();
    const currentPlan = usage.current_plan || "Free";
    const { getPlanLimits } = await import("@/libs/planLimits");
    const planLimits = getPlanLimits(currentPlan as any);

    const currentEmailCount = usage.email_count || 0;
    const canSend =
      planLimits.emailsPerTagPerMonth === Infinity ||
      currentEmailCount < planLimits.emailsPerTagPerMonth;

    return {
      success: true,
      canSend,
      data: {
        current: currentEmailCount,
        limit: planLimits.emailsPerTagPerMonth,
        plan: currentPlan,
        reason: canSend
          ? "Within limit"
          : `Limit reached (${currentEmailCount}/${planLimits.emailsPerTagPerMonth} emails this month)`,
      } as {
        current: number;
        limit: number | typeof Infinity;
        plan: string;
        reason: string;
      },
    };
  } catch (error: any) {
    console.error("Error checking email permissions:", error);
    return {
      success: false,
      canSend: false,
      data: null as any,
      error: error.message,
    };
  }
}
