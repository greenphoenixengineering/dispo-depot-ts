"use server";

import { authOptions } from "@/libs/next-auth";
import { supabase } from "@/libs/supabase";
import { getServerSession } from "next-auth";

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

  console.log("data from action", data);

  if (error) {
    console.log("error", error.message);
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

export async function addBuyerToMailerLit(newBuyer: any) {
  // 1. Destructure necessary data from the input object
  const { first_name, last_name, email, phone, groupId } = newBuyer;


  const MAILERLITE_API_URL = "https://connect.mailerlite.com/api/subscribers";

  // 3. Prepare MailerLite Payload using destructured variables
  const payload: any = {
    email: email,
    fields: {
      name: first_name, // M
      ...(last_name && { last_name: last_name }),
      phone,
    },
    groups: [groupId], 
    status: "active", 
  };

  // 4. Make the API Call
  try {
    const response = await fetch(MAILERLITE_API_URL, {
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
    throw new Error("something went wrong")
  }
}

export  async function addBuyer(newBuyer: any) {
  const wholesalerData = await getCurrentWholesaler();

  const { first_name, last_name, email, phone, api_id } = newBuyer;

  const { data, error } = await supabase
    .from("buyer")
    .insert([
      {
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone_num: phone,
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


export  async function linkBuyerToTag(buyerAndTagData: any) {

  const {buyer_id,tag_id } = buyerAndTagData;


  const { data, error } = await supabase
    .from("buyer_tags")
    .insert([
      {
       buyer_id,
       tag_id
      },
    ])
    .select();

  if (error) {
    throw new Error(`something went wrong: ${error.message}`);
  }

  return data;
}





// GET A SINGLE BUYER

export async function getSingleBuyer(buyerId:string) {

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
  .eq("id", buyerId);

console.log("fetched buyer",buyerId)
  if (error) {
    console.log("error", error.message);
  } else {
    return data;
  }
}




export async function updateBuyerAndTagsAction(
  payload:any
) {
  const { buyerId, updates, tagIds } = payload;

  console.log(`[Action] Calling RPC 'update_buyer_and_sync_tags' for Buyer ID: ${buyerId}`);
  console.log(`[Action] Updates:`, updates);
  console.log(`[Action] Tag IDs:`, tagIds);

  // --- Call the Supabase RPC Function ---
  // Arguments must match the function definition ORDER and TYPE
  const { error: rpcError } = await supabase.rpc('update_buyer_and_sync_tags', {
      p_buyer_id: buyerId,                   // Argument 1: uuid or text
      p_first_name: updates.first_name,    // Argument 2: text
      p_last_name: updates.last_name,      // Argument 3: text
      p_email: updates.email,              // Argument 4: text
      p_phone_num: updates.phone,          // Argument 5: text (maps to the DB column)
      p_tag_ids: tagIds                    // Argument 6: int[] or text[] etc.
  });
  // ---

  if (rpcError) {
    console.error("[Action Error] RPC call 'update_buyer_and_sync_tags' failed:", rpcError);
    return {
      success: false,
      message: `Failed to update buyer: ${rpcError.message}`, // Provide Supabase error
      error: rpcError,
    };
  }

  // --- Revalidate Cache ---
  // Success! Revalidate relevant paths
  try {
      console.log(`[Action] RPC call successful for Buyer ID: ${buyerId}. Revalidating paths...`);
     
  } catch (revalidateError) {
      console.warn("[Action Warning] Failed to revalidate path:", revalidateError);
      // Usually not critical enough to mark the whole operation as failed
  }


  return { success: true, message: "Buyer updated successfully!" };
}