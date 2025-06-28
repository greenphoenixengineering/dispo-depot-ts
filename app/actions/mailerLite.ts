import { NewTag } from "@/libs/tagTypes";
import { NewBuyer } from "@/libs/types";
import { RequestInit } from "next/dist/server/web/spec-extension/request";

const BASE_URL = "https://connect.mailerlite.com/api";

// GENERIC MAILERLITE FETCH FUNCTION
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

  return response;
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
    throw new Error("error adding buyer to mailerlite");
  }
}

export async function addTagToMailerlite(payload: NewTag) {
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
