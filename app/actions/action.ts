"use server";

import { authOptions } from "@/libs/next-auth";
import { supabase } from "@/libs/supabase";
import {
  DeleteBuyer,
  NewBuyer,
  NewBuyerInSupa,
  UpdateBuyer,
} from "@/libs/types";

import { DeletedTag, NewTag } from "@/libs/tagTypes";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { SendDealsState } from "@/libs/sendDealTypes";
import { RequestInit } from "next/dist/server/web/spec-extension/request";

const BASE_URL = "https://connect.mailerlite.com/api";
export async function getBuyersWithTags() {
  const wholesalerData = await getCurrentWholesaler();

  const { data, error } = await supabase
    .from("buyer")
    .select(
      `
      *,
      buyer_tags (
        tags:tag_id (
          id,
          name
        )
      )
    `
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

  if (!session?.user?.id) {
    throw new Error("Unauthorized: No user session found.");
  }

  const { data, error } = await supabase
    .from("wholesaler")
    .select("*")
    .eq("user_id", session.user.id)
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
    const result = await response.json();
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

export async function addBuyerToMailerLit(newBuyer: NewBuyer) {
  const { first_name, last_name, email, phone_num, groupId } = newBuyer;

  const payload: any = {
    email: email,
    fields: {
      name: first_name,
      ...(last_name && { last_name: last_name }),
      phone: phone_num,
    },
    groups: [groupId],
    status: "active",
  };

  try {
    const response = await mailerLiteFetch(`/subscribers`, "POST", payload);

    const result = await response.json();

    if (response.ok) {
      return { status: true, newSubscriberId: result?.data?.id };
    } else {
      return { status: false };
    }
  } catch (e) {
    throw new Error("error adding buyer to mailerlit");
  }
}

export async function getSingleBuyer(buyerId: string) {
  const { data, error } = await supabase
    .from("buyer")
    .select(
      `
    *,
    buyer_tags (
      tags:tag_id (
        id,
        name,
        api_id

      )
    )
  `
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
      throw new Error(`Database error: ${error.message}`); // Throw to be caught below
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

  const { data, error } = await supabase
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

export async function addTagToMailerlit(payload: NewTag) {
  try {
    const response = await mailerLiteFetch(`/groups`, "POST", payload);

    const result = await response.json();

    if (response.ok) {
      return { status: true, tagApiId: result?.data?.id };
    } else {
      return { status: false };
    }
  } catch (e) {
    throw new Error("error adding buyer to mailerlit");
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
    `${BASE_URL}/subscribers/${DeletePayload.buyerApiId}`,
    "DELETE"
  );

  if (!response.ok) {
    return { success: false, message: "Error deleting buyer!" };
  }

  return { success: true, message: "Buyer deleted successfully!" };
}

// SEND DEAL ACTION

export async function sendDealsAction(
  prevState: SendDealsState,
  formData: FormData
): Promise<SendDealsState> {
  const subject = formData.get("subject") as string;
  const messageContent = formData.get("message") as string;
  const selectedTagsApiId = formData.getAll("selectedTagsApiId") as string[];
  // selectedApiIds

  const errors: SendDealsState["errors"] = {};

  if (selectedTagsApiId.length === 0) {
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

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  const campaignName = `${subject}_${formattedDate}`;
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
    groups: selectedTagsApiId,
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

    return { message: "Deal sent successfully!", success: true };
  } catch (error: any) {
    console.error("Error in sendDeals action:", error);
    return {
      errors: { api: error.message || "An unexpected error occurred." },
      success: false,
    };
  }
}

// GENERIC MAILERLIT FETCH FUNCTION
export async function mailerLiteFetch(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  payload?: any
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  const response = await fetch(`${BASE_URL}${path}`, options);

  // Optionally, handle errors or non-2xx responses here
  return response;
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
