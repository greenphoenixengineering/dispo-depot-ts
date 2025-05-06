"use server";

import { authOptions } from "@/libs/next-auth";
import { supabase } from "@/libs/supabase";
import {
  DeleteBuyer,
  NewBuyer,
  NewBuyerInSupa,
  UpdateBuyer,
} from "@/libs/types";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

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
    throw new Error("error getting wholesaler with tags");
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

// GET A SINGLE BUYER

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
        name: updates.first_name, // M
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
