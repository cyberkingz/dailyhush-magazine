-- DailyHush Mobile App - Mood Entries Table Migration
-- Creates the mood_entries table for therapeutic mood capture flow
-- Run this SQL in your Supabase SQL Editor

-- ================================================
-- MOOD ENTRIES TABLE
-- 4-step therapeutic mood capture flow
-- ================================================
CREATE TABLE IF NOT EXISTS public.mood_entries (
    -- Identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,

    -- Step 1: Mood Selection
    mood_type TEXT CHECK (mood_type IN ('calm', 'anxious', 'sad', 'frustrated', 'mixed')),
    mood_emoji TEXT,
    mood_selected_at TIMESTAMP WITH TIME ZONE,

    -- Step 2: Intensity Rating (1-10 scale)
    intensity_rating INTEGER CHECK (intensity_rating >= 1 AND intensity_rating <= 10),
    intensity_selected_at TIMESTAMP WITH TIME ZONE,

    -- Step 3: Free Writing (encrypted in DB)
    journal_text_encrypted BYTEA, -- Encrypted journal text
    journal_text_nonce TEXT, -- Nonce for decryption
    journal_word_count INTEGER DEFAULT 0,

    -- Voice support
    voice_audio_path TEXT,
    voice_duration_seconds INTEGER,
    voice_transcription_encrypted BYTEA, -- Encrypted transcription
    voice_transcription_nonce TEXT, -- Nonce for decryption
    transcription_status TEXT CHECK (transcription_status IN ('pending', 'processing', 'completed', 'failed')),

    -- Auto-save metadata
    last_autosave_at TIMESTAMP WITH TIME ZONE,
    autosave_version INTEGER DEFAULT 1,

    -- Step 4: Suggestion
    suggestion_shown TEXT,
    suggestion_type TEXT CHECK (suggestion_type IN ('ai_generated', 'pre_defined', 'personalized')),
    suggestion_accepted BOOLEAN,
    suggestion_details JSONB,
    suggestion_shown_at TIMESTAMP WITH TIME ZONE,
    suggestion_responded_at TIMESTAMP WITH TIME ZONE,

    -- Entry metadata
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'abandoned')),
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent_seconds INTEGER,

    -- Soft delete
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Analytics
    device_type TEXT,
    app_version TEXT
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON public.mood_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_status ON public.mood_entries(status);
CREATE INDEX IF NOT EXISTS idx_mood_entries_created_at ON public.mood_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_mood_entries_completed_at ON public.mood_entries(completed_at);
CREATE INDEX IF NOT EXISTS idx_mood_entries_mood_type ON public.mood_entries(mood_type);

-- Create index for filtering non-deleted entries
CREATE INDEX IF NOT EXISTS idx_mood_entries_not_deleted
ON public.mood_entries(user_id, created_at)
WHERE deleted_at IS NULL;

-- Add comment to document the table
COMMENT ON TABLE public.mood_entries IS
'Therapeutic mood capture entries with 4-step flow: mood selection, intensity rating, free writing, and gentle suggestion. Journal text is encrypted client-side for privacy.';

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

-- Enable RLS
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own mood entries
CREATE POLICY "Users can view own mood entries"
ON public.mood_entries
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own mood entries
CREATE POLICY "Users can insert own mood entries"
ON public.mood_entries
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own mood entries
CREATE POLICY "Users can update own mood entries"
ON public.mood_entries
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete (soft delete) their own mood entries
CREATE POLICY "Users can delete own mood entries"
ON public.mood_entries
FOR DELETE
USING (auth.uid() = user_id);

-- ================================================
-- TRIGGERS
-- ================================================

-- Trigger: Update updated_at timestamp on any update
CREATE OR REPLACE FUNCTION update_mood_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_mood_entries_updated_at_trigger
BEFORE UPDATE ON public.mood_entries
FOR EACH ROW
EXECUTE FUNCTION update_mood_entries_updated_at();
