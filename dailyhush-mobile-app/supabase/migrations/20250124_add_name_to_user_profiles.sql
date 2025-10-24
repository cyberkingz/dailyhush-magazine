-- Add name field to user_profiles table for personalization
-- Part of anonymous auth implementation

-- Add name column to user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS name TEXT;

-- Add comment
COMMENT ON COLUMN user_profiles.name IS 'User''s first name for personalization';
