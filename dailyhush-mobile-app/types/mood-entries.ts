/**
 * Nœma Mobile App - Mood Entry Types
 * Therapeutic 4-step mood capture flow
 */

// ================================================
// ENUMS
// ================================================

/**
 * The 5 core mood types users can select
 */
export enum MoodType {
  CALM = 'calm',
  ANXIOUS = 'anxious',
  SAD = 'sad',
  FRUSTRATED = 'frustrated',
  MIXED = 'mixed',
}

/**
 * Mood entry status for tracking completion
 */
export enum MoodEntryStatus {
  DRAFT = 'draft', // Auto-saved but incomplete
  COMPLETED = 'completed', // All 4 steps finished
  ABANDONED = 'abandoned', // User left without completing
}

/**
 * Voice transcription processing status
 */
export enum TranscriptionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

/**
 * Type of suggestion shown to user
 */
export enum SuggestionType {
  AI_GENERATED = 'ai_generated',
  PRE_DEFINED = 'pre_defined',
  PERSONALIZED = 'personalized',
}

// ================================================
// STEP-BY-STEP INTERFACES
// ================================================

/**
 * Step 1: Mood Selection
 */
export interface MoodSelection {
  mood_type: MoodType;
  mood_emoji: string; // e.g., '😌', '😰', '😢', '😤', '🤔'
  mood_selected_at: string; // ISO timestamp
}

/**
 * Step 2: Intensity Scale
 */
export interface IntensityRating {
  intensity_rating: number; // 1-5 scale
  intensity_selected_at: string; // ISO timestamp
}

/**
 * Step 3: Free Writing (Therapeutic Journal)
 */
export interface JournalEntry {
  journal_text: string; // Decrypted plain text (never stored)
  journal_word_count: number;
  voice_audio_path?: string; // Path to audio file in storage
  voice_duration_seconds?: number;
  voice_transcription?: string; // Decrypted transcription
  transcription_status?: TranscriptionStatus;
  last_autosave_at?: string; // ISO timestamp
  autosave_version?: number;
}

/**
 * Step 4: Gentle Suggestion
 */
export interface GentleSuggestion {
  suggestion_shown: string; // The suggestion text
  suggestion_type: SuggestionType;
  suggestion_accepted?: boolean; // User feedback
  suggestion_details?: {
    category?: string;
    ai_prompt?: string;
    confidence_score?: number;
    related_patterns?: string[];
  };
  suggestion_shown_at?: string; // ISO timestamp
  suggestion_responded_at?: string; // ISO timestamp
}

// ================================================
// MAIN MOOD ENTRY INTERFACE
// ================================================

/**
 * Complete mood entry with all 4 steps
 * This is the main data structure stored in the database
 */
export interface MoodEntry {
  // Identification
  id: string;
  user_id: string;

  // Step 1: Mood Selection
  mood_type?: MoodType;
  mood_emoji?: string;
  mood_selected_at?: string;

  // Step 2: Intensity Rating
  intensity_rating?: number; // 1-5
  intensity_selected_at?: string;

  // Step 3: Free Writing (encrypted in DB)
  journal_text_encrypted?: Uint8Array; // Never exposed to client
  journal_text_nonce?: string; // Never exposed to client
  journal_text?: string; // Decrypted on client only
  journal_word_count: number;

  // Voice support
  voice_audio_path?: string;
  voice_duration_seconds?: number;
  voice_transcription_encrypted?: Uint8Array; // Never exposed to client
  voice_transcription_nonce?: string; // Never exposed to client
  voice_transcription?: string; // Decrypted on client only
  transcription_status?: TranscriptionStatus;

  // Auto-save
  last_autosave_at?: string;
  autosave_version: number;

  // Step 4: Suggestion
  suggestion_shown?: string;
  suggestion_type?: SuggestionType;
  suggestion_accepted?: boolean;
  suggestion_details?: Record<string, any>;
  suggestion_shown_at?: string;
  suggestion_responded_at?: string;

  // Entry metadata
  status: MoodEntryStatus;
  completed_at?: string;
  time_spent_seconds?: number;

  // Soft delete
  deleted_at?: string;

  // Timestamps
  created_at: string;
  updated_at: string;

  // Analytics
  device_type?: string;
  app_version?: string;
}

// ================================================
// CLIENT-SIDE TYPES
// ================================================

/**
 * Mood entry for creating (INSERT)
 * Omits server-generated fields
 */
export type MoodEntryInsert = Omit<
  MoodEntry,
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'journal_text_encrypted'
  | 'journal_text_nonce'
  | 'voice_transcription_encrypted'
  | 'voice_transcription_nonce'
> & {
  user_id: string;
  status?: MoodEntryStatus;
  autosave_version?: number;
  journal_word_count?: number;
};

/**
 * Mood entry for updating (UPDATE)
 * All fields optional except ID
 */
export type MoodEntryUpdate = Partial<MoodEntryInsert> & {
  id: string;
};

/**
 * Mood entry summary (list view)
 * Omits sensitive/encrypted fields for performance
 */
export interface MoodEntrySummary {
  id: string;
  mood_type?: MoodType;
  mood_emoji?: string;
  intensity_rating?: number;
  journal_word_count: number;
  status: MoodEntryStatus;
  completed_at?: string;
  created_at: string;
  time_spent_seconds?: number;
}

// ================================================
// ENCRYPTION TYPES
// ================================================

/**
 * User's encryption key (stored encrypted in DB)
 */
export interface UserEncryptionKey {
  user_id: string;
  encrypted_master_key: Uint8Array; // Encrypted with password-derived key
  key_derivation_salt: string;
  algorithm: string; // 'aes-256-gcm'
  key_version: number;
  previous_key?: Uint8Array;
  rotated_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Encryption configuration for client-side encryption
 */
export interface EncryptionConfig {
  algorithm: 'aes-256-gcm';
  keyLength: 256;
  nonceLength: 12; // 96 bits for GCM
  tagLength: 16; // 128 bits authentication tag
  pbkdf2Iterations: 100000; // Password-based key derivation
}

/**
 * Encrypted field wrapper
 */
export interface EncryptedData {
  ciphertext: Uint8Array;
  nonce: string; // Base64 encoded
  algorithm: string;
}

// ================================================
// API REQUEST/RESPONSE TYPES
// ================================================

/**
 * Request to create a new mood entry
 */
export interface CreateMoodEntryRequest {
  mood_type?: MoodType;
  mood_emoji?: string;
  intensity_rating?: number;
  journal_text?: string; // Will be encrypted client-side
  voice_audio_file?: File | Blob;
  status?: MoodEntryStatus;
  device_type?: string;
  app_version?: string;
}

/**
 * Request to update an existing mood entry (auto-save)
 */
export interface UpdateMoodEntryRequest {
  id: string;
  mood_type?: MoodType;
  mood_emoji?: string;
  intensity_rating?: number;
  journal_text?: string; // Will be encrypted client-side
  suggestion_accepted?: boolean;
  status?: MoodEntryStatus;
}

/**
 * Response from mood entry operations
 */
export interface MoodEntryResponse {
  success: boolean;
  data?: MoodEntry;
  error?: string;
}

/**
 * Request to list mood entries with filters
 */
export interface ListMoodEntriesRequest {
  user_id: string;
  status?: MoodEntryStatus;
  limit?: number;
  offset?: number;
  include_drafts?: boolean;
  start_date?: string; // ISO date
  end_date?: string; // ISO date
}

/**
 * Response from listing mood entries
 */
export interface ListMoodEntriesResponse {
  success: boolean;
  data?: MoodEntrySummary[];
  total_count?: number;
  has_more?: boolean;
  error?: string;
}

// ================================================
// ANALYTICS TYPES
// ================================================

/**
 * Mood pattern analytics
 */
export interface MoodPatterns {
  total_entries: number;
  most_common_mood: MoodType;
  avg_intensity: number;
  entries_by_mood: Record<MoodType, number>;
  completion_rate: number; // Percentage
  time_period_days: number;
}

/**
 * Mood trends over time
 */
export interface MoodTrends {
  daily_mood_counts: {
    date: string;
    mood_type: MoodType;
    count: number;
    avg_intensity: number;
  }[];
  weekly_completion_rate: number;
  total_words_written: number;
  most_active_time_of_day: string; // e.g., "03:00"
}

// ================================================
// UI STATE TYPES
// ================================================

/**
 * Current step in the mood capture flow
 */
export enum MoodCaptureStep {
  MOOD_SELECTION = 1,
  INTENSITY_RATING = 2,
  FREE_WRITING = 3,
  GENTLE_SUGGESTION = 4,
}

/**
 * Mood capture flow state
 */
export interface MoodCaptureState {
  current_step: MoodCaptureStep;
  entry_id?: string; // Set after initial save
  mood_selection?: MoodSelection;
  intensity_rating?: IntensityRating;
  journal_entry?: JournalEntry;
  gentle_suggestion?: GentleSuggestion;
  is_autosaving: boolean;
  last_autosave_at?: Date;
  error?: string;
}

/**
 * Voice recording state
 */
export interface VoiceRecordingState {
  is_recording: boolean;
  is_processing: boolean;
  duration_seconds: number;
  audio_file?: File | Blob;
  audio_path?: string;
  transcription?: string;
  transcription_status: TranscriptionStatus;
  error?: string;
}

// ================================================
// VALIDATION TYPES
// ================================================

/**
 * Validation result for mood entry
 */
export interface MoodEntryValidation {
  is_valid: boolean;
  errors: {
    mood_type?: string;
    intensity_rating?: string;
    journal_text?: string;
  };
  warnings?: string[];
}

// ================================================
// UTILITY TYPES
// ================================================

/**
 * Mood emoji mapping
 */
export const MOOD_EMOJIS: Record<MoodType, string> = {
  [MoodType.CALM]: '😌',
  [MoodType.ANXIOUS]: '😰',
  [MoodType.SAD]: '😢',
  [MoodType.FRUSTRATED]: '😤',
  [MoodType.MIXED]: '🤔',
};

/**
 * Mood color mapping for UI
 */
export const MOOD_COLORS: Record<MoodType, string> = {
  [MoodType.CALM]: '#A8E6CF', // Soft green
  [MoodType.ANXIOUS]: '#FFD3B6', // Soft orange
  [MoodType.SAD]: '#AADCEC', // Soft blue
  [MoodType.FRUSTRATED]: '#FFB6B9', // Soft red
  [MoodType.MIXED]: '#E8DAEF', // Soft purple
};

/**
 * Mood labels for accessibility
 */
export const MOOD_LABELS: Record<MoodType, string> = {
  [MoodType.CALM]: 'Calm and peaceful',
  [MoodType.ANXIOUS]: 'Anxious or worried',
  [MoodType.SAD]: 'Sad or down',
  [MoodType.FRUSTRATED]: 'Frustrated or angry',
  [MoodType.MIXED]: 'Mixed emotions',
};

// ================================================
// CONSTANTS
// ================================================

export const MOOD_ENTRY_CONSTANTS = {
  MIN_INTENSITY: 1,
  MAX_INTENSITY: 5,
  MIN_JOURNAL_WORDS: 10, // Minimum words for meaningful journaling
  MAX_JOURNAL_CHARS: 10000, // Max characters for journal entry
  AUTOSAVE_INTERVAL_MS: 3000, // Auto-save every 3 seconds
  DRAFT_EXPIRY_DAYS: 7, // Days before drafts are cleaned up
  VOICE_MAX_DURATION_SECONDS: 300, // 5 minutes max voice recording
  ENCRYPTION_ALGORITHM: 'aes-256-gcm',
  ENCRYPTION_KEY_LENGTH: 256,
} as const;
