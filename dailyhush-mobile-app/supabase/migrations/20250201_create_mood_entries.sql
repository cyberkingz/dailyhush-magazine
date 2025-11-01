-- ================================================
-- MOOD ENTRIES TABLE
-- Therapeutic 4-step mood capture flow
-- ================================================
-- This table stores the complete mood capture journey:
-- Step 1: Mood selection (calm, anxious, sad, frustrated, mixed)
-- Step 2: Intensity rating (1-5 scale)
-- Step 3: Free-writing therapeutic journal
-- Step 4: AI/pre-defined gentle suggestions

-- Enable pgcrypto for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ================================================
-- CUSTOM TYPES / ENUMS
-- ================================================

-- Mood types matching the 5 core emotions
CREATE TYPE mood_type AS ENUM (
  'calm',
  'anxious',
  'sad',
  'frustrated',
  'mixed'
);

-- Entry status for draft/complete tracking
CREATE TYPE mood_entry_status AS ENUM (
  'draft',      -- Auto-saved but incomplete
  'completed',  -- All 4 steps finished
  'abandoned'   -- User left without completing
);

-- Voice transcription status
CREATE TYPE transcription_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed'
);

-- ================================================
-- MAIN MOOD ENTRIES TABLE
-- ================================================

CREATE TABLE IF NOT EXISTS public.mood_entries (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID NOT NULL,

  -- Step 1: Mood Selection
  mood_type mood_type,
  mood_emoji TEXT, -- Emoji representation (e.g., '😌', '😰', '😢', '😤', '🤔')
  mood_selected_at TIMESTAMPTZ,

  -- Step 2: Intensity Scale
  intensity_rating INTEGER CHECK (intensity_rating >= 1 AND intensity_rating <= 5),
  intensity_selected_at TIMESTAMPTZ,

  -- Step 3: Free Writing (ENCRYPTED)
  journal_text_encrypted BYTEA, -- Encrypted journal content
  journal_text_nonce TEXT, -- Encryption nonce for authenticated encryption
  journal_word_count INTEGER DEFAULT 0, -- For analytics (not encrypted)

  -- Voice transcription support
  voice_audio_path TEXT, -- S3/Storage bucket path to audio file
  voice_duration_seconds INTEGER,
  voice_transcription_encrypted BYTEA, -- Encrypted transcription
  voice_transcription_nonce TEXT,
  transcription_status transcription_status DEFAULT 'pending',

  -- Auto-save tracking
  last_autosave_at TIMESTAMPTZ,
  autosave_version INTEGER DEFAULT 1, -- Increment on each auto-save

  -- Step 4: Gentle Suggestion
  suggestion_shown TEXT, -- The suggestion text shown to user
  suggestion_type TEXT, -- 'ai_generated', 'pre_defined', 'personalized'
  suggestion_accepted BOOLEAN, -- User clicked "yes, helpful"
  suggestion_details JSONB, -- Additional context (e.g., AI prompt used, category)
  suggestion_shown_at TIMESTAMPTZ,
  suggestion_responded_at TIMESTAMPTZ,

  -- Entry metadata
  status mood_entry_status DEFAULT 'draft',
  completed_at TIMESTAMPTZ, -- When all 4 steps finished
  time_spent_seconds INTEGER, -- Total time from start to completion

  -- Soft delete support
  deleted_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Analytics fields (not encrypted)
  device_type TEXT, -- 'ios', 'android'
  app_version TEXT,

  -- Constraints
  CONSTRAINT mood_entries_user_fk FOREIGN KEY (user_id)
    REFERENCES public.user_profiles(user_id)
    ON DELETE CASCADE,

  -- Ensure intensity is set when mood is set
  CONSTRAINT intensity_required_when_mood_set CHECK (
    (mood_type IS NULL AND intensity_rating IS NULL) OR
    (mood_type IS NOT NULL)
  )
);

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

-- Primary query patterns
CREATE INDEX idx_mood_entries_user_id ON public.mood_entries(user_id);
CREATE INDEX idx_mood_entries_user_status ON public.mood_entries(user_id, status);
CREATE INDEX idx_mood_entries_user_created ON public.mood_entries(user_id, created_at DESC);
CREATE INDEX idx_mood_entries_completed ON public.mood_entries(user_id, completed_at DESC)
  WHERE status = 'completed';

-- Draft entries for auto-save retrieval
CREATE INDEX idx_mood_entries_drafts ON public.mood_entries(user_id, updated_at DESC)
  WHERE status = 'draft' AND deleted_at IS NULL;

-- Analytics queries
CREATE INDEX idx_mood_entries_mood_type ON public.mood_entries(mood_type)
  WHERE status = 'completed';
CREATE INDEX idx_mood_entries_created_date ON public.mood_entries(user_id, DATE(created_at));

-- Soft delete support
CREATE INDEX idx_mood_entries_not_deleted ON public.mood_entries(user_id)
  WHERE deleted_at IS NULL;

-- ================================================
-- ENCRYPTION KEY STORAGE
-- ================================================
-- Each user has their own encryption key for end-to-end encryption
-- Keys are derived from user's password (client-side) and never stored plaintext

CREATE TABLE IF NOT EXISTS public.user_encryption_keys (
  user_id UUID PRIMARY KEY,

  -- Encrypted master key (encrypted with user's password-derived key)
  encrypted_master_key BYTEA NOT NULL,

  -- Salt for key derivation
  key_derivation_salt TEXT NOT NULL,

  -- Key metadata
  algorithm TEXT DEFAULT 'aes-256-gcm',
  key_version INTEGER DEFAULT 1,

  -- Rotation tracking
  previous_key BYTEA,
  rotated_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT user_encryption_keys_user_fk FOREIGN KEY (user_id)
    REFERENCES public.user_profiles(user_id)
    ON DELETE CASCADE
);

CREATE INDEX idx_encryption_keys_user ON public.user_encryption_keys(user_id);

-- ================================================
-- AUTO-UPDATE TRIGGERS
-- ================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_mood_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mood_entries_updated_at
  BEFORE UPDATE ON public.mood_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_mood_entries_updated_at();

-- Auto-update encryption keys updated_at
CREATE TRIGGER encryption_keys_updated_at
  BEFORE UPDATE ON public.user_encryption_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_mood_entries_updated_at();

-- ================================================
-- DRAFT CLEANUP FUNCTION
-- ================================================
-- Delete abandoned drafts older than 7 days

CREATE OR REPLACE FUNCTION cleanup_old_mood_drafts()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Soft delete old drafts
  UPDATE public.mood_entries
  SET deleted_at = NOW(),
      status = 'abandoned'
  WHERE status = 'draft'
    AND deleted_at IS NULL
    AND updated_at < NOW() - INTERVAL '7 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup to run daily (requires pg_cron extension)
-- Note: This would need to be set up separately in production
-- Example: SELECT cron.schedule('cleanup-mood-drafts', '0 2 * * *', 'SELECT cleanup_old_mood_drafts()');

COMMENT ON FUNCTION cleanup_old_mood_drafts() IS
  'Soft deletes mood entry drafts that have not been updated in 7 days. Returns count of deleted drafts.';

-- ================================================
-- HARD DELETE OLD ENTRIES FUNCTION
-- ================================================
-- Permanently delete entries that were soft-deleted more than 90 days ago

CREATE OR REPLACE FUNCTION hard_delete_old_mood_entries()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.mood_entries
  WHERE deleted_at IS NOT NULL
    AND deleted_at < NOW() - INTERVAL '90 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION hard_delete_old_mood_entries() IS
  'Permanently deletes mood entries that were soft-deleted more than 90 days ago. Returns count of deleted entries.';

-- ================================================
-- HELPER FUNCTIONS
-- ================================================

-- Get user's most recent mood entries (excluding deleted)
CREATE OR REPLACE FUNCTION get_user_mood_history(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0,
  p_include_drafts BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
  id UUID,
  mood_type mood_type,
  mood_emoji TEXT,
  intensity_rating INTEGER,
  journal_word_count INTEGER,
  status mood_entry_status,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  time_spent_seconds INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    me.id,
    me.mood_type,
    me.mood_emoji,
    me.intensity_rating,
    me.journal_word_count,
    me.status,
    me.completed_at,
    me.created_at,
    me.time_spent_seconds
  FROM public.mood_entries me
  WHERE me.user_id = p_user_id
    AND me.deleted_at IS NULL
    AND (p_include_drafts OR me.status = 'completed')
  ORDER BY me.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_user_mood_history IS
  'Retrieves paginated mood entry history for a user, excluding sensitive encrypted content.';

-- Get mood pattern analytics
CREATE OR REPLACE FUNCTION get_mood_patterns(
  p_user_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  total_entries INTEGER,
  most_common_mood mood_type,
  avg_intensity NUMERIC,
  entries_by_mood JSONB,
  completion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH stats AS (
    SELECT
      COUNT(*) as total,
      MODE() WITHIN GROUP (ORDER BY mood_type) as common_mood,
      AVG(intensity_rating) as avg_int,
      jsonb_object_agg(
        mood_type::TEXT,
        COUNT(*)
      ) FILTER (WHERE mood_type IS NOT NULL) as mood_counts,
      (COUNT(*) FILTER (WHERE status = 'completed')::NUMERIC /
       NULLIF(COUNT(*), 0) * 100) as comp_rate
    FROM public.mood_entries
    WHERE user_id = p_user_id
      AND deleted_at IS NULL
      AND created_at >= NOW() - (p_days || ' days')::INTERVAL
  )
  SELECT
    total::INTEGER,
    common_mood,
    ROUND(avg_int, 2),
    mood_counts,
    ROUND(comp_rate, 2)
  FROM stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_mood_patterns IS
  'Analyzes mood patterns over a specified time period for insights and analytics.';

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_encryption_keys ENABLE ROW LEVEL SECURITY;

-- Users can only access their own mood entries
CREATE POLICY "Users can view own mood entries"
  ON public.mood_entries
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood entries"
  ON public.mood_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood entries"
  ON public.mood_entries
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own mood entries"
  ON public.mood_entries
  FOR DELETE
  USING (auth.uid() = user_id);

-- Users can only access their own encryption keys
CREATE POLICY "Users can view own encryption key"
  ON public.user_encryption_keys
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own encryption key"
  ON public.user_encryption_keys
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own encryption key"
  ON public.user_encryption_keys
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ================================================
-- TABLE COMMENTS
-- ================================================

COMMENT ON TABLE public.mood_entries IS
  'Stores therapeutic mood capture entries with 4-step flow: mood selection, intensity, free writing (encrypted), and gentle suggestions. Supports auto-save drafts and voice transcription.';

COMMENT ON TABLE public.user_encryption_keys IS
  'Stores per-user encryption keys for end-to-end encryption of sensitive mood journal data. Keys are encrypted with user-derived passwords.';

COMMENT ON COLUMN public.mood_entries.journal_text_encrypted IS
  'Encrypted free-form therapeutic journal text using AES-256-GCM. Decryption key stored in user_encryption_keys table.';

COMMENT ON COLUMN public.mood_entries.voice_transcription_encrypted IS
  'Encrypted transcription of voice journal using AES-256-GCM. Decryption key stored in user_encryption_keys table.';

COMMENT ON COLUMN public.mood_entries.autosave_version IS
  'Increments with each auto-save to detect conflicts and enable version tracking.';

COMMENT ON COLUMN public.mood_entries.suggestion_accepted IS
  'Tracks whether user found the suggestion helpful. Used for ML training and suggestion improvement.';
