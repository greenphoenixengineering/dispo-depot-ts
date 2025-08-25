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
  subscription_id uuid NOT NULL,
  current_plan character varying,
  buyer_count bigint,
  tag_count bigint,
  email_count bigint,
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

-- Grant explicit permissions to existing next_auth tables
GRANT ALL PRIVILEGES ON TABLE next_auth.users TO service_role, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE next_auth.accounts TO service_role, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE next_auth.sessions TO service_role, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE next_auth.verification_tokens TO service_role, anon, authenticated;