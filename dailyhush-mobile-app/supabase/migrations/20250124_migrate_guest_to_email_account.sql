-- Create function to migrate guest user data to new email account
-- This handles complete data transfer when guest upgrades to authenticated account

CREATE OR REPLACE FUNCTION migrate_guest_to_email_account(
  p_new_user_id UUID,
  p_guest_user_id UUID,
  p_email TEXT,
  p_name TEXT DEFAULT NULL,
  p_age INTEGER DEFAULT NULL,
  p_onboarding_completed BOOLEAN DEFAULT FALSE,
  p_fire_progress JSONB DEFAULT NULL,
  p_triggers TEXT[] DEFAULT NULL,
  p_has_shift_necklace BOOLEAN DEFAULT FALSE,
  p_shift_paired BOOLEAN DEFAULT FALSE
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Run with elevated privileges to bypass RLS
SET search_path = public
AS $$
BEGIN
  -- Security check: Only allow creating profile for the authenticated user
  IF auth.uid() != p_new_user_id THEN
    RAISE EXCEPTION 'Cannot create profile for another user';
  END IF;

  -- Insert new user profile with migrated guest data
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
    p_new_user_id,
    p_email,
    p_name,
    p_age,
    p_onboarding_completed,
    p_has_shift_necklace,
    p_shift_paired,
    COALESCE(p_fire_progress, jsonb_build_object('focus', false, 'interrupt', false, 'reframe', false, 'execute', false)),
    COALESCE(p_triggers, '{}'::text[]),
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    age = EXCLUDED.age,
    onboarding_completed = EXCLUDED.onboarding_completed,
    has_shift_necklace = EXCLUDED.has_shift_necklace,
    shift_paired = EXCLUDED.shift_paired,
    fire_progress = EXCLUDED.fire_progress,
    triggers = EXCLUDED.triggers,
    updated_at = NOW();

  -- Transfer fire_training_progress records from guest to new user
  -- This preserves all FIRE training history
  IF p_guest_user_id IS NOT NULL THEN
    UPDATE fire_training_progress
    SET user_id = p_new_user_id
    WHERE user_id = p_guest_user_id;

    RAISE NOTICE 'Transferred fire_training_progress records from % to %', p_guest_user_id, p_new_user_id;
  END IF;

  -- Note: We don't delete the guest profile here to avoid data loss
  -- The old guest auth user will be automatically cleaned up by Supabase
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION migrate_guest_to_email_account TO authenticated;
