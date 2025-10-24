-- Make email field nullable for anonymous authentication
-- Anonymous users don't have an email address

-- Drop the NOT NULL constraint from email column
ALTER TABLE user_profiles
ALTER COLUMN email DROP NOT NULL;

-- Add comment
COMMENT ON COLUMN user_profiles.email IS 'User email address (nullable for anonymous users)';
