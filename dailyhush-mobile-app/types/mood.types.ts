/**
 * Nœma - Mood Logging Types
 *
 * Type definitions for the inline mood logging widget.
 * This is a simplified, quick mood capture vs. the full therapeutic 4-step flow.
 *
 * @see services/moodLogging.ts
 * @see hooks/useMoodLogging.ts
 */

import type { Enums } from './supabase';

// ============================================================================
// MOOD LOG DATA STRUCTURES
// ============================================================================

/**
 * Mood choice options for the widget
 * Matches the database mood_type enum
 */
export type MoodChoice = Enums<'mood_type'>;

/**
 * Intensity rating (1-7 scale for widget)
 * 1 = Very Mild, 4 = Moderate, 7 = Very Strong
 */
export type MoodIntensity = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Data structure for submitting a mood log
 * Used by the inline widget to capture quick mood data
 */
export interface MoodSubmitData {
  /** The selected mood */
  mood: MoodChoice;

  /** Intensity rating (1-7) */
  intensity: MoodIntensity;

  /** Optional quick notes */
  notes?: string;

  /** When the mood was logged (defaults to now) */
  timestamp?: Date;

  /** User ID (auto-populated from auth if not provided) */
  userId?: string;
}

/**
 * Complete mood log record from database
 * Returned after saving/fetching mood logs
 */
export interface MoodLog {
  /** Unique identifier */
  id: string;

  /** User who created this log */
  user_id: string;

  /** Selected mood */
  mood: MoodChoice;

  /** Mood emoji representation */
  mood_emoji: string;

  /** Intensity rating (1-7) */
  intensity: MoodIntensity;

  /** Optional notes */
  notes: string | null;

  /** When this log was created */
  created_at: string;

  /** When this log was last updated */
  updated_at: string;

  /** Date key for querying (YYYY-MM-DD) */
  log_date: string;
}

/**
 * Partial mood log for updates
 * Allows updating specific fields without requiring all data
 */
export type MoodLogUpdate = Partial<Pick<MoodSubmitData, 'mood' | 'intensity' | 'notes'>>;

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * Error codes for mood logging operations
 */
export enum MoodLoggingErrorCode {
  /** Network request failed */
  NETWORK_ERROR = 'NETWORK_ERROR',

  /** Request timed out */
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',

  /** User not authenticated */
  UNAUTHORIZED = 'UNAUTHORIZED',

  /** Invalid input data */
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  /** Database constraint violation */
  CONSTRAINT_ERROR = 'CONSTRAINT_ERROR',

  /** RLS policy violation */
  PERMISSION_DENIED = 'PERMISSION_DENIED',

  /** Unknown error occurred */
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',

  /** User is offline (for offline queue) */
  OFFLINE = 'OFFLINE',
}

/**
 * Custom error class for mood logging operations
 * Provides user-friendly error messages and codes
 */
export class MoodLoggingError extends Error {
  constructor(
    public code: MoodLoggingErrorCode,
    public userMessage: string,
    public originalError?: unknown
  ) {
    super(userMessage);
    this.name = 'MoodLoggingError';
  }

  /**
   * Check if error is retryable
   * Network and timeout errors can be retried
   */
  isRetryable(): boolean {
    return [MoodLoggingErrorCode.NETWORK_ERROR, MoodLoggingErrorCode.TIMEOUT_ERROR].includes(
      this.code
    );
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    return this.userMessage;
  }
}

// ============================================================================
// SERVICE RESPONSE TYPES
// ============================================================================

/**
 * Success response from mood logging service
 */
export interface MoodLogSuccess<T = MoodLog> {
  success: true;
  data: T;
}

/**
 * Error response from mood logging service
 */
export interface MoodLogError {
  success: false;
  error: MoodLoggingError;
}

/**
 * Result type for mood logging operations
 * Either success with data or error with details
 */
export type MoodLogResult<T = MoodLog> = MoodLogSuccess<T> | MoodLogError;

// ============================================================================
// OFFLINE QUEUE TYPES
// ============================================================================

/**
 * Status of an offline queue item
 */
export enum OfflineQueueStatus {
  /** Waiting to be synced */
  PENDING = 'pending',

  /** Currently syncing */
  SYNCING = 'syncing',

  /** Successfully synced */
  SYNCED = 'synced',

  /** Failed to sync after retries */
  FAILED = 'failed',
}

/**
 * Offline queue item for mood logs
 * Stored in AsyncStorage when network is unavailable
 */
export interface OfflineMoodLog {
  /** Temporary ID (UUID) */
  tempId: string;

  /** Mood log data to be synced */
  data: MoodSubmitData;

  /** When this was queued */
  queuedAt: string;

  /** Current status */
  status: OfflineQueueStatus;

  /** Number of sync attempts */
  retryCount: number;

  /** Last sync attempt time */
  lastAttempt?: string;

  /** Error message from last failed attempt */
  lastError?: string;
}

// ============================================================================
// HOOK STATE TYPES
// ============================================================================

/**
 * Loading state for mood logging operations
 */
export interface MoodLoggingLoadingState {
  /** Is currently submitting a mood log */
  isSubmitting: boolean;

  /** Is currently fetching mood logs */
  isFetching: boolean;

  /** Is currently syncing offline queue */
  isSyncing: boolean;
}

/**
 * Hook state for useMoodLogging
 */
export interface UseMoodLoggingState extends MoodLoggingLoadingState {
  /** Current error, if any */
  error: MoodLoggingError | null;

  /** Today's mood log (cached) */
  todayMood: MoodLog | null;

  /** Number of pending offline items */
  pendingCount: number;
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

/**
 * Validation result for mood log data
 */
export interface ValidationResult {
  /** Is the data valid? */
  valid: boolean;

  /** Validation errors by field */
  errors: {
    mood?: string;
    intensity?: string;
    notes?: string;
    timestamp?: string;
  };
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Options for saveMoodLog function
 */
export interface SaveMoodLogOptions {
  /** Merge with existing today's entry instead of replacing */
  merge?: boolean;

  /** Skip offline queue if network fails (default: false) */
  skipOfflineQueue?: boolean;

  /** Timeout in milliseconds (default: 10000) */
  timeout?: number;
}

/**
 * Options for getTodayMoodLog function
 */
export interface GetTodayMoodLogOptions {
  /** Force fetch from server, bypass cache */
  forceFetch?: boolean;

  /** User's timezone (default: device timezone) */
  timezone?: string;
}

/**
 * Options for retry logic
 */
export interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxAttempts?: number;

  /** Initial delay in ms (default: 1000) */
  initialDelay?: number;

  /** Multiplier for exponential backoff (default: 2) */
  backoffMultiplier?: number;

  /** Maximum delay in ms (default: 10000) */
  maxDelay?: number;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if result is success
 */
export function isSuccess<T>(result: MoodLogResult<T>): result is MoodLogSuccess<T> {
  return result.success === true;
}

/**
 * Type guard to check if result is error
 */
export function isError<T>(result: MoodLogResult<T>): result is MoodLogError {
  return result.success === false;
}

/**
 * Type guard to check if value is a valid mood intensity
 */
export function isValidIntensity(value: unknown): value is MoodIntensity {
  return typeof value === 'number' && value >= 1 && value <= 7 && Number.isInteger(value);
}

/**
 * Type guard to check if value is a valid mood choice
 */
export function isValidMoodChoice(value: unknown): value is MoodChoice {
  const validMoods: MoodChoice[] = ['calm', 'anxious', 'sad', 'frustrated', 'mixed'];
  return typeof value === 'string' && validMoods.includes(value as MoodChoice);
}
