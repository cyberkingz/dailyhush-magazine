-- Create a database function to insert user profiles
-- This bypasses RLS by running with SECURITY DEFINER
-- Only the authenticated user can call this for their own user_id

CREATE OR REPLACE FUNCTION create_user_profile(
  p_user_id UUID,
  p_email TEXT,
  p_name TEXT DEFAULT NULL,
  p_age INTEGER DEFAULT NULL,
  p_onboarding_completed BOOLEAN DEFAULT FALSE
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Run with function owner's privileges (bypasses RLS)
SET search_path = public
AS $$
BEGIN
  -- Security check: Only allow creating profile for the authenticated user
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Cannot create profile for another user';
  END IF;

  -- Insert or update the user profile
  INSERT INTO user_profiles (
    user_id,
    email,
    name,
    age,
    onboarding_completed,
    has_shift_necklace,
    shift_paired,
    fire_progress,
    triggers,
    created_at,
    updated_at
  ) VALUES (
    p_user_id,
    p_email,
    p_name,
    p_age,
    p_onboarding_completed,
    FALSE,
    FALSE,
    jsonb_build_object('focus', false, 'interrupt', false, 'reframe', false, 'execute', false),
    '[]'::jsonb,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    age = EXCLUDED.age,
    onboarding_completed = EXCLUDED.onboarding_completed,
    updated_at = NOW();
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_user_profile TO authenticated;
