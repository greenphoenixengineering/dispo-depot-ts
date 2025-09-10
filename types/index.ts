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
