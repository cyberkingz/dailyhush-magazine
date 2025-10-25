-- Create RPC function to check if user exists in auth.users table
-- This allows the mobile app to detect accounts that exist in Supabase Auth
-- but might not have a profile record yet

CREATE OR REPLACE FUNCTION get_user_by_email(email_param TEXT)
RETURNS TABLE (id UUID, email TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT au.id, au.email::TEXT
  FROM auth.users au
  WHERE LOWER(au.email) = LOWER(email_param);
END;
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION get_user_by_email(TEXT) TO authenticated, anon;

COMMENT ON FUNCTION get_user_by_email IS 'Checks if a user exists in auth.users by email. Used for account detection during onboarding.';
