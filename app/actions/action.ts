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


    console.log('data from action',data)

  if (error) {
    console.log('error',error.message)


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
      .single(); // if expecting one wholesaler per user
  

      
    if (error) {
      throw new Error(`Failed to fetch wholesaler: ${error.message}`);
    }
  
    return data;
  }
  