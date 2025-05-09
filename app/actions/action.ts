"use server";

import { authOptions } from "@/libs/next-auth";
import { supabase } from "@/libs/supabase";
import { getServerSession } from "next-auth";
import { revalidatePath, revalidateTag } from "next/cache";
const dynamic = "force-dynamic";
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

// get single tag

export async function getSingleTag(id:number) {
    let { data: tag, error } = await supabase
    .from("tags")
    .select("*")

    .eq("id", id);
   if(error){
    throw new Error("error getting a single tag")
   }
    return tag
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

export async function addTagToMailerlit(payload: any) {
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
    throw new Error("something went wrong");
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
    throw new Error(`something went wrong: ${error.message}`);
  }
  revalidatePath("/dashboard/tags");

  return data;
}
// update tag

export async function UpdateTag(payload: any) {
  const { tagId, tagApiId, newTagName } = payload;
  

  console.log("payload",payload)
  try {
    const { error } = await supabase
      .from("tags")
      .update({ name: newTagName })
      .eq("id", tagId)
      .select();

    if (error) {
      return { success: false, message: "error updating tag on supabase" };
    }

    // const name=newTagName
    const response = await fetch(`${BASE_URL}/groups/${tagApiId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",

        Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({name:newTagName}),
    });
    if (!response.ok) {
      return { success: false, message: "Error updating tag on mailerlit!" };
    }
    const result = await response.json();

    console.log("response",response)

    return { success: true };
  } catch {
    throw new Error("unexptected error happens during updating a tag");
  }
}

export async function deleteTag(payload: any) {
  const { tagId, tagApiId } = payload;

  console.log("tag api id", tagApiId);

  try {
    // delete tag from tags table
    const { error } = await supabase.from("tags").delete().eq("id", tagId);
    console.log("payload", payload);

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
