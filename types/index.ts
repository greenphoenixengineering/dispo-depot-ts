export * from "./config";

export type Wholesaler = {
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  user_id: string;
  id: number;
  alias: string;
  email_authorized: boolean;
};

// Define proper types for the email usage data
export type EmailUsageData = {
  wholesaler: any | null;
  usage: any | null;
  currentPlan: string;
  planLimits: {
    emailsPerTagPerMonth: number | typeof Infinity;
  };
  currentEmailCount: number;
  error?: string;
};
