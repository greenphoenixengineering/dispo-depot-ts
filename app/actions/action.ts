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
      name: first_name,
      ...(last_name && { last_name: last_name }),
      phone,
    },
    groups: [""], 
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


export async function getTagsWithCounts() {
  const wholesalerData = await getCurrentWholesaler();

  if (!wholesalerData.id) {
    console.error('Server Action: wholesalerId is required.');
    return { tags: [], error: { message: 'Wholesaler ID is required.' } };
  }


  try {
    console.log(`Calling RPC get_tags_with_buyer_count for wholesaler: ${wholesalerData.id}`);

    
    const { data, error } = await supabase.rpc(
      'get_tags_with_buyer_count', 
      { wholesaler_id_input: wholesalerData.id } 
    );

    console.log('my data',data)

    if (error) {
      console.error('Error calling RPC get_tags_with_buyer_count:', error);
      throw new Error(`Database error: ${error.message}`); // Throw to be caught below
    }

    console.log(`Successfully fetched ${data?.length || 0} tags with counts.`);




    return data;

  } catch (error: any) {
    console.error('Server Action Error in getTagsWithCounts:', error);
    return { tags: [], error: { message: error.message || 'Failed to fetch tags with counts.' } };
  }
}