-- Initial Schema Migration for Dispo Depot
-- This file contains all the schemas and tables needed for the application

-- Create schemas if they don't exist
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS next_auth;
CREATE SCHEMA IF NOT EXISTS public;
CREATE SCHEMA IF NOT EXISTS realtime;
CREATE SCHEMA IF NOT EXISTS storage;
CREATE SCHEMA IF NOT EXISTS vault;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant permissions to service_role and anon roles for next_auth schema
GRANT USAGE ON SCHEMA next_auth TO service_role, anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA next_auth TO service_role, anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA next_auth TO service_role, anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA next_auth TO service_role, anon, authenticated;

-- Ensure future tables get the same permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA next_auth GRANT ALL ON TABLES TO service_role, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA next_auth GRANT ALL ON SEQUENCES TO service_role, anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA next_auth GRANT ALL ON ROUTINES TO service_role, anon, authenticated;

-- NEXT_AUTH SCHEMA (Custom schema that doesn't exist by default)
-- Create users table first for foreign keys
CREATE TABLE IF NOT EXISTS next_auth.users (
  email text UNIQUE,
  emailVerified timestamp with time zone,
  image text,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  first_name text,
  last_name text,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS next_auth.accounts (
  type text NOT NULL,
  provider text NOT NULL,
  "providerAccountId" text NOT NULL,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  oauth_token_secret text,
  oauth_token text,
  "userId" uuid,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  CONSTRAINT accounts_pkey PRIMARY KEY (id),
  CONSTRAINT accounts_userId_fkey FOREIGN KEY ("userId") REFERENCES next_auth.users(id)
);

CREATE TABLE IF NOT EXISTS next_auth.sessions (
  expires timestamp with time zone NOT NULL,
  "sessionToken" text NOT NULL UNIQUE,
  "userId" uuid,
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  CONSTRAINT sessions_pkey PRIMARY KEY (id),
  CONSTRAINT sessions_userId_fkey FOREIGN KEY ("userId") REFERENCES next_auth.users(id)
);

CREATE TABLE IF NOT EXISTS next_auth.verification_tokens (
  "identifier" text,
  "token" text NOT NULL,
  "expires" timestamp with time zone NOT NULL,
  CONSTRAINT verification_tokens_pkey PRIMARY KEY ("token")
);

-- PUBLIC SCHEMA (Custom tables for our application)
-- Create wholesaler table first for foreign keys
CREATE TABLE IF NOT EXISTS public.wholesaler (
  email_authorized boolean,
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  first_name text,
  last_name text,
  email text NOT NULL,
  user_id uuid NOT NULL UNIQUE,
  alias text UNIQUE,
  CONSTRAINT wholesaler_pkey PRIMARY KEY (id)
);

-- Create wholesaler_subscriptions table first for usage foreign key
CREATE TABLE IF NOT EXISTS public.wholesaler_subscriptions (
  wholesaler_id bigint,
  email character varying NOT NULL UNIQUE,
  name character varying,
  stripe_customer_id character varying,
  stripe_price_id character varying,
  plan_name character varying,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  has_access boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT wholesaler_subscriptions_pkey PRIMARY KEY (id),
  CONSTRAINT wholesaler_subscriptions_wholesaler_id_fkey FOREIGN KEY (wholesaler_id) REFERENCES public.wholesaler(id)
);

CREATE TABLE IF NOT EXISTS public.buyer (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  first_name text,
  api_id text NOT NULL UNIQUE,
  email text,
  last_name text,
  phone_num text,
  wholesaler_id bigint NOT NULL,
  CONSTRAINT buyer_pkey PRIMARY KEY (id),
  CONSTRAINT buyer_wholesaler_id_fkey FOREIGN KEY (wholesaler_id) REFERENCES public.wholesaler(id)
);

-- Create tags table first for buyer_tags foreign key
CREATE TABLE IF NOT EXISTS public.tags (
  api_id text NOT NULL UNIQUE,
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  wholesaler_id bigint,
  CONSTRAINT tags_pkey PRIMARY KEY (id),
  CONSTRAINT tags_wholesaler_id_fkey FOREIGN KEY (wholesaler_id) REFERENCES public.wholesaler(id)
);

CREATE TABLE IF NOT EXISTS public.buyer_tags (
  tag_id bigint NOT NULL,
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  buyer_id bigint NOT NULL,
  CONSTRAINT buyer_tags_pkey PRIMARY KEY (id),
  CONSTRAINT fk_buyer_tags_on_buyer_delete FOREIGN KEY (buyer_id) REFERENCES public.buyer(id),
  CONSTRAINT buyer_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id)
);

CREATE TABLE IF NOT EXISTS public.usage (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  wholesaler_id bigint NOT NULL UNIQUE,
  subscription_id uuid, -- Allow NULL for free users
  current_plan character varying,
  buyer_count bigint,
  tag_count bigint,
  email_count bigint,
  last_email_reset_month text DEFAULT to_char(now(), 'YYYY-MM'), -- Track monthly email resets
  CONSTRAINT usage_pkey PRIMARY KEY (id),
  CONSTRAINT usage_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.wholesaler_subscriptions(id),
  CONSTRAINT usage_wholesaler_id_fkey FOREIGN KEY (wholesaler_id) REFERENCES public.wholesaler(id)
);

CREATE TABLE IF NOT EXISTS public.wholesaler_campaign (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  campaign_id text,
  wholesaler_id bigint,
  CONSTRAINT wholesaler_campaign_pkey PRIMARY KEY (id),
  CONSTRAINT wholesaler_campaign_wholesaler_id_fkey FOREIGN KEY (wholesaler_id) REFERENCES public.wholesaler(id)
);

-- Create the get_tags_with_buyer_count function
CREATE OR REPLACE FUNCTION public.get_tags_with_buyer_count(wholesaler_id_input BIGINT)
RETURNS TABLE (
  id BIGINT,
  name TEXT,
  api_id TEXT,
  created_at TIMESTAMPTZ,
  buyer_count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
      t.id,
      t.name,
      t.api_id,
      t.created_at,
      COALESCE(COUNT(DISTINCT bt.buyer_id), 0)::BIGINT AS buyer_count
  FROM
      tags t
  LEFT JOIN
      buyer_tags bt ON t.id = bt.tag_id
  WHERE
      t.wholesaler_id = wholesaler_id_input
  GROUP BY
      t.id, t.name, t.api_id
  ORDER BY
      t.name;
END;
$$;

-- Create the handle_new_user_to_wholesaler function
CREATE OR REPLACE FUNCTION public.handle_new_user_to_wholesaler()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_wholesaler_id BIGINT;
BEGIN
  -- Insert a new row into the public.wholesaler table and get the ID
  INSERT INTO public.wholesaler (user_id, first_name, last_name, email, alias, email_authorized)
  VALUES (
    NEW.id,             -- The user_id from the new row in next_auth.users
    NEW.first_name,     -- The first_name from the new user
    NEW.last_name,      -- The last_name from the new user
    NEW.email,          -- The email from the new user
    CONCAT('reply-', NEW.id, '@mydispodepot.io'), -- Create proper alias format
    true                -- Set email_authorized to true for new users
  )
  RETURNING id INTO new_wholesaler_id;

  -- Insert initial usage row for Free plan
  INSERT INTO public.usage (
    wholesaler_id,
    subscription_id,    -- NULL for free users
    current_plan,
    buyer_count,
    tag_count,
    email_count
  )
  VALUES (
    new_wholesaler_id,
    NULL,               -- No subscription for free users
    'Free',             -- Default to Free plan
    0,                  -- Start with 0 buyers
    0,                  -- Start with 0 tags
    0                   -- Start with 0 emails
  );

  RETURN NEW;
END;
$$;

-- Create the trigger for handle_new_user_to_wholesaler
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON next_auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_to_wholesaler();

-- Create the update_buyer_and_sync_tags function
CREATE OR REPLACE FUNCTION public.update_buyer_and_sync_tags(
  p_buyer_id BIGINT,
  p_first_name TEXT,
  p_last_name TEXT,
  p_email TEXT,
  p_phone_num TEXT,
  p_tag_ids BIGINT[]
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Step 1: Update buyer info (uses bigint comparison)
  UPDATE public.buyer -- Check table name
  SET
      first_name = p_first_name,
      last_name = p_last_name,
      email = p_email,
      phone_num = p_phone_num
  WHERE id = p_buyer_id; -- Comparison is now bigint = bigint

  -- Step 2: Delete tags (uses bigint comparison)
  DELETE FROM public.buyer_tags -- Check table name
  WHERE buyer_id = p_buyer_id; -- Assuming buyer_tags.buyer_id is also bigint/int8

  -- Step 3: Insert tags
  IF p_tag_ids IS NOT NULL AND array_length(p_tag_ids, 1) > 0 THEN
      INSERT INTO public.buyer_tags (buyer_id, tag_id) -- Check table name
      SELECT p_buyer_id, unnest(p_tag_ids);
  END IF;
END;
$$;

-- Grant explicit permissions to existing next_auth tables
GRANT ALL PRIVILEGES ON TABLE next_auth.users TO service_role, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE next_auth.accounts TO service_role, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE next_auth.sessions TO service_role, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE next_auth.verification_tokens TO service_role, anon, authenticated;

-- Create function to reset email count monthly
CREATE OR REPLACE FUNCTION public.reset_monthly_email_count(wholesaler_id_input BIGINT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_month TEXT;
  last_reset_month TEXT;
BEGIN
  -- Get current year-month
  current_month := to_char(now(), 'YYYY-MM');
  
  -- Get last reset month for this wholesaler
  SELECT last_email_reset_month INTO last_reset_month
  FROM usage 
  WHERE wholesaler_id = wholesaler_id_input;
  
  -- If it's a new month, reset the email count
  IF last_reset_month IS NULL OR last_reset_month != current_month THEN
    UPDATE usage 
    SET 
      email_count = 0,
      last_email_reset_month = current_month
    WHERE wholesaler_id = wholesaler_id_input;
  END IF;
END;
$$;

-- Create function to increment email count with monthly reset check
CREATE OR REPLACE FUNCTION public.increment_email_count_with_reset(wholesaler_id_input BIGINT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- First, check and reset if needed
  PERFORM reset_monthly_email_count(wholesaler_id_input);
  
  -- Then increment the count
  UPDATE usage 
  SET email_count = COALESCE(email_count, 0) + 1
  WHERE wholesaler_id = wholesaler_id_input;
END;
$$;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.get_tags_with_buyer_count(BIGINT) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user_to_wholesaler() TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.update_buyer_and_sync_tags(BIGINT, TEXT, TEXT, TEXT, TEXT, BIGINT[]) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.reset_monthly_email_count(BIGINT) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.increment_email_count_with_reset(BIGINT) TO authenticated, anon, service_role;

-- Add comments explaining the functions
COMMENT ON FUNCTION public.handle_new_user_to_wholesaler() IS 
'Automatically creates wholesaler and initial usage records when a new user signs up via OAuth. Free users get NULL subscription_id.';

COMMENT ON FUNCTION public.reset_monthly_email_count(BIGINT) IS 
'Resets email count to 0 if we are in a new month. Used to implement monthly email limits.';

COMMENT ON FUNCTION public.increment_email_count_with_reset(BIGINT) IS 
'Increments email count for a wholesaler, automatically resetting count if we are in a new month.';