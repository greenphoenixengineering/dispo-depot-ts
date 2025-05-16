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

    const response = await fetch(`${BASE_URL}/subscribers/${buyerApiId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",

        Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });
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
    const response = await fetch(`${BASE_URL}/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",

        Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

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
    const response = await fetch(`${BASE_URL}/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",

        Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

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

    const response = await fetch(`${BASE_URL}/groups/${tagApiId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",

        Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({ name: newTagName }),
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

    // DELETE GROUP FROM MAILERLIT
    const response = await fetch(`${BASE_URL}/groups/${tagApiId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",

        Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
      },
    });

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

  const response = await fetch(
    `${BASE_URL}/subscribers/${DeletePayload.buyerApiId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",

        Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
      },
    }
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
  const selectedApiIds = formData.getAll("selectedApiIds") as string[];

  const errors: SendDealsState["errors"] = {};

  if (selectedApiIds.length === 0) {
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

  const mailerLitePayload = {
    name: campaignName,
    type: "regular",
    emails: [
      {
        subject: subject,
        from_name: "Your Company Name", 
        from: "your-verified-sender@example.com", 
        // html_content: `<p>${messageContent.replace(/\n/g, "<br>")}</p>`,
        // plain_content: messageContent,
      },
    ],
    groups: selectedApiIds,
  };

  console.log("Attempting to send MailerLite Payload:", mailerLitePayload);

  try {
    const response = await fetch(
      `${BASE_URL}/campaigns`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`, 
        },
        body: JSON.stringify(mailerLitePayload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("MailerLite API Error:", result);
      return {
        errors: { api: result.message || `API request failed: ${response.status}` },
        success: false,
      };
    }

    console.log("MailerLite API Success:", result);
    return { message: "Deal sent successfully!", success: true };
  } catch (error: any) {
    console.error("Error in sendDeals action:", error);
    return {
      errors: { api: error.message || "An unexpected error occurred." },
      success: false,
    };
  }
}