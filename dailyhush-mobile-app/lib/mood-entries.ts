/**
 * Mood Entries Library
 * Complete implementation of mood capture flow with encryption
 */

import { supabase } from '@/utils/supabase';
import {
  MoodType,
  MoodEntryStatus,
  MoodEntry,
  MoodEntryInsert,
  MoodEntryUpdate,
  MoodEntrySummary,
  MoodPatterns,
  CreateMoodEntryRequest,
  UpdateMoodEntryRequest,
} from '@/types/mood-entries';
import { encryptText, decryptText, getUserEncryptionKey } from './encryption';

// ================================================
// CORE OPERATIONS
// ================================================

/**
 * Creates a new mood entry in draft status
 */
export async function createMoodEntry(
  userId: string,
  options?: {
    device_type?: string;
    app_version?: string;
  }
): Promise<MoodEntry> {
  const { data, error } = await supabase
    .from('mood_entries')
    .insert({
      user_id: userId,
      status: MoodEntryStatus.DRAFT,
      autosave_version: 1,
      journal_word_count: 0,
      device_type: options?.device_type,
      app_version: options?.app_version,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create mood entry: ${error.message}`);
  }

  return data as MoodEntry;
}

/**
 * Updates a mood entry with new data (auto-save)
 */
export async function updateMoodEntry(
  entryId: string,
  updates: UpdateMoodEntryRequest
): Promise<MoodEntry> {
  const updatePayload: any = {};

  // Step 1: Mood selection
  if (updates.mood_type !== undefined) {
    updatePayload.mood_type = updates.mood_type;
    updatePayload.mood_emoji = updates.mood_emoji || getMoodEmoji(updates.mood_type);
    updatePayload.mood_selected_at = new Date().toISOString();
  }

  // Step 2: Intensity rating
  if (updates.intensity_rating !== undefined) {
    updatePayload.intensity_rating = updates.intensity_rating;
    updatePayload.intensity_selected_at = new Date().toISOString();
  }

  // Step 3: Journal text (encrypted)
  if (updates.journal_text !== undefined) {
    try {
      const encrypted = await encryptText(updates.journal_text);
      updatePayload.journal_text_encrypted = encrypted.ciphertext;
      updatePayload.journal_text_nonce = encrypted.nonce;
      updatePayload.journal_word_count = countWords(updates.journal_text);
    } catch (error) {
      // If encryption fails (no key set up yet), just store word count
      // Encryption key will be set up during onboarding
      console.warn('Encryption key not available, skipping journal text encryption:', error);
      updatePayload.journal_word_count = countWords(updates.journal_text);
      // Don't save the text if we can't encrypt it (privacy protection)
    }
  }

  // Step 4: Suggestion response
  if (updates.suggestion_accepted !== undefined) {
    updatePayload.suggestion_accepted = updates.suggestion_accepted;
    updatePayload.suggestion_responded_at = new Date().toISOString();
  }

  // Status updates
  if (updates.status !== undefined) {
    updatePayload.status = updates.status;

    if (updates.status === MoodEntryStatus.COMPLETED) {
      updatePayload.completed_at = new Date().toISOString();
    }
  }

  // Auto-save metadata
  updatePayload.last_autosave_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('mood_entries')
    .update(updatePayload)
    .eq('id', entryId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update mood entry: ${error.message}`);
  }

  return data as MoodEntry;
}

/**
 * Completes a mood entry (final step)
 */
export async function completeMoodEntry(
  entryId: string,
  timeSpentSeconds: number,
  suggestionAccepted?: boolean
): Promise<MoodEntry> {
  const { data, error } = await supabase
    .from('mood_entries')
    .update({
      status: MoodEntryStatus.COMPLETED,
      completed_at: new Date().toISOString(),
      time_spent_seconds: timeSpentSeconds,
      suggestion_accepted: suggestionAccepted,
      suggestion_responded_at:
        suggestionAccepted !== undefined ? new Date().toISOString() : undefined,
    })
    .eq('id', entryId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to complete mood entry: ${error.message}`);
  }

  return data as MoodEntry;
}

/**
 * Gets a mood entry by ID with decryption
 */
export async function getMoodEntry(entryId: string): Promise<MoodEntry> {
  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('id', entryId)
    .single();

  if (error) {
    throw new Error(`Failed to get mood entry: ${error.message}`);
  }

  const entry = data as MoodEntry;

  // Decrypt journal text if exists
  if (entry.journal_text_encrypted && entry.journal_text_nonce) {
    try {
      entry.journal_text = await decryptText(
        new Uint8Array(entry.journal_text_encrypted as any),
        entry.journal_text_nonce
      );
    } catch (error) {
      console.error('Failed to decrypt journal text:', error);
      // Don't throw - just leave encrypted
    }
  }

  // Decrypt voice transcription if exists
  if (entry.voice_transcription_encrypted && entry.voice_transcription_nonce) {
    try {
      entry.voice_transcription = await decryptText(
        new Uint8Array(entry.voice_transcription_encrypted as any),
        entry.voice_transcription_nonce
      );
    } catch (error) {
      console.error('Failed to decrypt voice transcription:', error);
    }
  }

  return entry;
}

/**
 * Lists mood entries for a user (paginated)
 */
export async function listMoodEntries(
  userId: string,
  options?: {
    limit?: number;
    offset?: number;
    include_drafts?: boolean;
    start_date?: string;
    end_date?: string;
  }
): Promise<{
  entries: MoodEntrySummary[];
  total_count: number;
  has_more: boolean;
}> {
  const limit = options?.limit || 50;
  const offset = options?.offset || 0;

  let query = supabase
    .from('mood_entries')
    .select(
      'id, mood_type, mood_emoji, intensity_rating, journal_word_count, status, completed_at, created_at, time_spent_seconds',
      { count: 'exact' }
    )
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  // Filter by status
  if (!options?.include_drafts) {
    query = query.eq('status', MoodEntryStatus.COMPLETED);
  }

  // Date range filter
  if (options?.start_date) {
    query = query.gte('created_at', options.start_date);
  }
  if (options?.end_date) {
    query = query.lte('created_at', options.end_date);
  }

  // Pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to list mood entries: ${error.message}`);
  }

  return {
    entries: data as MoodEntrySummary[],
    total_count: count || 0,
    has_more: (count || 0) > offset + limit,
  };
}

/**
 * Gets draft entries for resume functionality
 */
export async function getDraftEntries(userId: string): Promise<MoodEntry[]> {
  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('status', MoodEntryStatus.DRAFT)
    .is('deleted_at', null)
    .order('updated_at', { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(`Failed to get draft entries: ${error.message}`);
  }

  const entries = data as MoodEntry[];

  // Decrypt journal text for each draft
  for (const entry of entries) {
    if (entry.journal_text_encrypted && entry.journal_text_nonce) {
      try {
        entry.journal_text = await decryptText(
          new Uint8Array(entry.journal_text_encrypted as any),
          entry.journal_text_nonce
        );
      } catch (error) {
        console.error('Failed to decrypt draft:', error);
      }
    }
  }

  return entries;
}

/**
 * Soft deletes a mood entry
 */
export async function deleteMoodEntry(entryId: string): Promise<void> {
  const { error } = await supabase
    .from('mood_entries')
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq('id', entryId);

  if (error) {
    throw new Error(`Failed to delete mood entry: ${error.message}`);
  }
}

/**
 * Clears all draft entries for a user
 */
export async function clearDraftEntries(userId: string): Promise<void> {
  const { error } = await supabase
    .from('mood_entries')
    .update({
      deleted_at: new Date().toISOString(),
      status: MoodEntryStatus.ABANDONED,
    })
    .eq('user_id', userId)
    .eq('status', MoodEntryStatus.DRAFT)
    .is('deleted_at', null);

  if (error) {
    throw new Error(`Failed to clear draft entries: ${error.message}`);
  }
}

// ================================================
// ANALYTICS
// ================================================

/**
 * Gets mood patterns for analytics
 */
export async function getMoodPatterns(
  userId: string,
  days: number = 30
): Promise<MoodPatterns> {
  const { data, error } = await supabase.rpc('get_mood_patterns', {
    p_user_id: userId,
    p_days: days,
  });

  if (error) {
    throw new Error(`Failed to get mood patterns: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return {
      total_entries: 0,
      most_common_mood: MoodType.CALM,
      avg_intensity: 0,
      entries_by_mood: {},
      completion_rate: 0,
      time_period_days: days,
    };
  }

  return {
    ...data[0],
    time_period_days: days,
  };
}

/**
 * Gets mood history for a specific time range
 */
export async function getMoodHistory(
  userId: string,
  options?: {
    limit?: number;
    offset?: number;
    include_drafts?: boolean;
  }
): Promise<MoodEntrySummary[]> {
  const { data, error } = await supabase.rpc('get_user_mood_history', {
    p_user_id: userId,
    p_limit: options?.limit || 50,
    p_offset: options?.offset || 0,
    p_include_drafts: options?.include_drafts || false,
  });

  if (error) {
    throw new Error(`Failed to get mood history: ${error.message}`);
  }

  return data as MoodEntrySummary[];
}

// ================================================
// VOICE RECORDING
// ================================================

/**
 * Uploads a voice recording to storage
 */
export async function uploadVoiceRecording(
  userId: string,
  entryId: string,
  audioFile: File | Blob,
  durationSeconds: number
): Promise<string> {
  const fileName = `${userId}/${entryId}-${Date.now()}.m4a`;

  // Upload to storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('mood-voice-recordings')
    .upload(fileName, audioFile, {
      contentType: 'audio/mp4',
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload voice recording: ${uploadError.message}`);
  }

  // Update mood entry with audio path
  const { error: updateError } = await supabase
    .from('mood_entries')
    .update({
      voice_audio_path: uploadData.path,
      voice_duration_seconds: durationSeconds,
    })
    .eq('id', entryId);

  if (updateError) {
    throw new Error(`Failed to update entry with voice path: ${updateError.message}`);
  }

  return uploadData.path;
}

/**
 * Gets a signed URL for voice recording playback
 */
export async function getVoiceRecordingUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('mood-voice-recordings')
    .createSignedUrl(path, 3600); // 1 hour expiry

  if (error) {
    throw new Error(`Failed to get voice recording URL: ${error.message}`);
  }

  return data.signedUrl;
}

// ================================================
// UTILITY FUNCTIONS
// ================================================

/**
 * Gets the emoji for a mood type
 */
function getMoodEmoji(moodType: MoodType): string {
  const emojiMap: Record<MoodType, string> = {
    [MoodType.CALM]: '😌',
    [MoodType.ANXIOUS]: '😰',
    [MoodType.SAD]: '😢',
    [MoodType.FRUSTRATED]: '😤',
    [MoodType.MIXED]: '🤔',
  };

  return emojiMap[moodType];
}

/**
 * Counts words in text
 */
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Validates a mood entry
 */
export function validateMoodEntry(entry: Partial<MoodEntry>): {
  is_valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  // Validate mood type
  if (entry.mood_type && !Object.values(MoodType).includes(entry.mood_type)) {
    errors.mood_type = 'Invalid mood type';
  }

  // Validate intensity
  if (
    entry.intensity_rating !== undefined &&
    (entry.intensity_rating < 1 || entry.intensity_rating > 5)
  ) {
    errors.intensity_rating = 'Intensity must be between 1 and 5';
  }

  // Validate journal text length
  if (entry.journal_text && entry.journal_text.length > 10000) {
    errors.journal_text = 'Journal text exceeds maximum length';
  }

  return {
    is_valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Calculates completion percentage
 */
export function getCompletionPercentage(entry: Partial<MoodEntry>): number {
  const steps = [
    !!entry.mood_type, // Step 1
    !!entry.intensity_rating, // Step 2
    !!entry.journal_text || !!entry.journal_text_encrypted, // Step 3
    entry.status === MoodEntryStatus.COMPLETED, // Step 4
  ];

  const completedSteps = steps.filter(Boolean).length;
  return (completedSteps / steps.length) * 100;
}

/**
 * Formats time spent in human-readable format
 */
export function formatTimeSpent(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes}m`;
}
