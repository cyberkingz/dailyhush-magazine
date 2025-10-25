-- Migration: Remove CASCADE DELETE from auth.users to user_profiles
-- Purpose: Retain user data for analytics when auth account is deleted
-- Date: October 25, 2025
--
-- IMPORTANT: This allows user_profiles and all related data to persist
-- after auth account deletion. The user_id becomes "orphaned" (no matching
-- auth account) which is intentional for data retention purposes.

-- Step 1: Drop the existing foreign key constraint
ALTER TABLE public.user_profiles
DROP CONSTRAINT IF EXISTS user_profiles_user_id_fkey;

-- Step 2: Re-add the foreign key WITHOUT CASCADE DELETE
-- Using ON DELETE SET NULL would break RLS policies (auth.uid() = user_id)
-- So we simply remove the constraint entirely to allow orphaned user_ids
-- This is intentional: we want user_profiles to remain after auth deletion

-- Note: We're NOT re-adding any foreign key constraint here
-- This allows user_profiles.user_id to persist even when auth.users.id is deleted
-- The UUID will remain valid, just "orphaned" from auth

-- Step 3: Add a comment to document this intentional design
COMMENT ON COLUMN public.user_profiles.user_id IS
'User ID from auth.users. Intentionally NOT a foreign key to allow data retention after account deletion. May be orphaned if auth account is deleted.';

-- Step 4: Verify all child table CASCADE relationships remain intact
-- (These should still cascade when user_profiles is deleted, just not when auth is deleted)
-- No changes needed - these relationships are correct:
--   - spiral_logs.user_id -> user_profiles.user_id ON DELETE CASCADE
--   - pattern_insights.user_id -> user_profiles.user_id ON DELETE CASCADE
--   - shift_usage_logs.user_id -> user_profiles.user_id ON DELETE CASCADE
--   - voice_journals.user_id -> user_profiles.user_id ON DELETE CASCADE
--   - subscriptions.user_id -> user_profiles.user_id ON DELETE CASCADE
--   - fire_training_progress.user_id -> user_profiles.user_id ON DELETE CASCADE
