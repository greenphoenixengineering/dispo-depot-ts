-- Update usage table to allow NULL subscription_id for free users
-- This migration allows free users to have usage tracking without a subscription

-- First, drop the NOT NULL constraint on subscription_id
ALTER TABLE public.usage ALTER COLUMN subscription_id DROP NOT NULL;

-- Update the foreign key constraint to handle NULL values properly
ALTER TABLE public.usage DROP CONSTRAINT usage_subscription_id_fkey;
ALTER TABLE public.usage ADD CONSTRAINT usage_subscription_id_fkey 
  FOREIGN KEY (subscription_id) REFERENCES public.wholesaler_subscriptions(id);

-- Update the handle_new_user_to_wholesaler function to also create usage row
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
    0                   -- Start with 0 emails (legacy field)
  );

  RETURN NEW;
END;
$$;

-- Add a comment to explain the change
COMMENT ON FUNCTION public.handle_new_user_to_wholesaler() IS 
'Automatically creates wholesaler and initial usage records when a new user signs up via OAuth. Free users get NULL subscription_id.';
