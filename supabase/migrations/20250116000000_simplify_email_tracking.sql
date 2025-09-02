-- Simplify Email Tracking Migration
-- This removes the complex email_usage table and uses simple email_count from usage table

-- Drop the email_usage table and related functions if they exist
DROP TABLE IF EXISTS public.email_usage CASCADE;
DROP FUNCTION IF EXISTS public.get_current_month_email_usage(BIGINT, TEXT[]) CASCADE;
DROP FUNCTION IF EXISTS public.increment_email_usage(BIGINT, TEXT[]) CASCADE;
DROP FUNCTION IF EXISTS public.can_send_emails_to_tags(BIGINT, TEXT[], TEXT) CASCADE;

-- Add a last_email_reset_month column to track when email count was last reset
ALTER TABLE public.usage 
ADD COLUMN IF NOT EXISTS last_email_reset_month TEXT DEFAULT to_char(now(), 'YYYY-MM');

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

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.reset_monthly_email_count(BIGINT) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.increment_email_count_with_reset(BIGINT) TO authenticated, anon, service_role;

-- Add a comment explaining the change
COMMENT ON FUNCTION public.reset_monthly_email_count(BIGINT) IS 
'Resets email count to 0 if we are in a new month. Used to implement monthly email limits.';

COMMENT ON FUNCTION public.increment_email_count_with_reset(BIGINT) IS 
'Increments email count for a wholesaler, automatically resetting count if we are in a new month.';
