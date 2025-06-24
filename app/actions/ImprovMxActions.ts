import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { mailerLiteFetch } from "./mailerLiteActions";

const IMRPOVMX_BASE_URL =
  "https://api.improvmx.com/v3/domains/mydispodepot.io/aliases";

// GENERIC MAILERLIT FETCH FUNCTION
export async function improvMxFetch(
  method: "GET" | "POST" | "PUT" | "DELETE",
  payload?: any
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Basic ${process.env.IMPROVMX_API_KEY}`,
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  const response = await fetch(`${IMRPOVMX_BASE_URL}`, options);

  // Optionally, handle errors or non-2xx responses here
  return response;
}
// action to create an alias for a user
export async function createUserAlias(payload: any) {
  const { alias, forward } = payload;

  // Basic validation to prevent sending bad requests
  if (!alias || !forward) {
    throw new Error(
      "Both 'alias' and 'forward' are required to create a user alias."
    );
  }

  try {
    const res = await improvMxFetch("POST", payload);
    const data = await res.json();

    console.log("improv mx res", res);
    console.log("improv mx data", data);

    if (!res.ok) {
      console.error("ImprovMX API Error:", data);
      throw new Error(`API request failed with status ${res.status}`);
    }

    return data;
  } catch (error) {
    console.error("Failed inside createUserAlias:", error);
    throw error;
  }
}

export async function notifyAdminNewAliasCreated(payload: {
  userName: string;
  userAlias: string;
}) {
  const { userName, userAlias } = payload;
  const mailerLitePayload = {
    name: "New User Alias Notification",
    type: "regular",
    emails: [
      {
        subject: "New User Alias Created",
        from_name: "Dispo Depot",
        from: "mike@greenphoenixengineering.com",
        reply_to: "support@mydispodepot.io",

        content: `
<p>Hello Admin,</p>
<p>A new user alias has been created:</p>
<p>full name of new user ${userName} </p>
<p><strong>Alias:</strong> ${userAlias}</p>
`,
      },
    ],
  };

  try {
    const notifyAdminWithAliasResponse = await mailerLiteFetch(
      "/campaigns",
      "POST",
      mailerLitePayload
    );

    const notifyAdminWithAliasCampaingResult =
      await notifyAdminWithAliasResponse.json();
    console.log(
      "notify admin campaing result",
      notifyAdminWithAliasCampaingResult
    );
    if (notifyAdminWithAliasCampaingResult.data.id) {
      // schedule the campaing
      const sheduleCampaingPayload = { delivery: "instant" };

      const sheduleCampaingResponse = await mailerLiteFetch(
        `/campaigns/${notifyAdminWithAliasCampaingResult.data.id}/schedule`,
        "POST",
        sheduleCampaingPayload
      );

      const scheduleCampaingResult = await sheduleCampaingResponse.json();

      if (scheduleCampaingResult.data.id) {
        return { success: true };
      } else {
        return {
          success: false,
          error: "Campaign created, but there was an error scheduling it.",
        };
      }
    }

    return { success: false };
  } catch (e) {
    return { success: false, error: e };
  }
}
