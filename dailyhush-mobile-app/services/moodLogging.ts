/**
 * DailyHush - Mood Logging Service
 *
 * Service layer for inline mood logging widget operations.
 * Handles all CRUD operations for quick mood logs with robust error handling.
 *
 * Features:
 * - Type-safe Supabase operations
 * - Comprehensive error handling
 * - Input validation
 * - Timezone handling
 * - Timeout support
 * - Retry logic with exponential backoff
 *
 * @see types/mood.types.ts
 * @see hooks/useMoodLogging.ts
 */

import { supabase } from '@/utils/supabase';
import { getMoodEmoji } from '@/constants/moodOptions';
import type {
  MoodSubmitData,
  MoodLog,
  MoodLogUpdate,
  MoodLoggingError,
  MoodLoggingErrorCode,
  ValidationResult,
  SaveMoodLogOptions,
  GetTodayMoodLogOptions,
  RetryOptions,
} from '@/types/mood.types';
import { MoodLoggingError as MoodLoggingErrorClass } from '@/types/mood.types';

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_TIMEOUT = 10000; // 10 seconds
const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelay: 1000,
  backoffMultiplier: 2,
  maxDelay: 10000,
};

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate mood submit data
 * Ensures all required fields are present and valid
 *
 * @param data - Mood submit data to validate
 * @returns Validation result with errors by field
 *
 * @example
 * ```ts
 * const result = validateMoodData({ mood: 'calm', intensity: 4 });
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export function validateMoodData(data: Partial<MoodSubmitData>): ValidationResult {
  const errors: ValidationResult['errors'] = {};

  // Validate mood
  if (!data.mood) {
    errors.mood = 'Mood is required';
  } else if (!['calm', 'anxious', 'sad', 'frustrated', 'mixed'].includes(data.mood)) {
    errors.mood = 'Invalid mood selection';
  }

  // Validate intensity
  if (!data.intensity) {
    errors.intensity = 'Intensity is required';
  } else if (
    typeof data.intensity !== 'number' ||
    data.intensity < 1 ||
    data.intensity > 7 ||
    !Number.isInteger(data.intensity)
  ) {
    errors.intensity = 'Intensity must be a number between 1 and 7';
  }

  // Validate notes (optional but must be string if provided)
  if (data.notes !== undefined && data.notes !== null && typeof data.notes !== 'string') {
    errors.notes = 'Notes must be a string';
  }

  // Validate timestamp (optional but must be valid date if provided)
  if (data.timestamp !== undefined && !(data.timestamp instanceof Date)) {
    errors.timestamp = 'Timestamp must be a Date object';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Create user-friendly error from Supabase error
 *
 * @param error - Raw error from Supabase or network
 * @returns MoodLoggingError with appropriate code and message
 */
function createMoodLoggingError(error: unknown): MoodLoggingErrorClass {
  // Network errors
  if (error instanceof TypeError && error.message.includes('network')) {
    return new MoodLoggingErrorClass(
      'NETWORK_ERROR' as MoodLoggingErrorCode,
      'Unable to connect. Please check your internet connection.',
      error
    );
  }

  // Timeout errors
  if (error instanceof Error && error.message.includes('timeout')) {
    return new MoodLoggingErrorClass(
      'TIMEOUT_ERROR' as MoodLoggingErrorCode,
      'Request timed out. Please try again.',
      error
    );
  }

  // Supabase errors
  if (error && typeof error === 'object' && 'code' in error) {
    const supabaseError = error as { code?: string; message?: string; details?: string };

    // Authentication errors
    if (supabaseError.code === 'PGRST301' || supabaseError.message?.includes('JWT')) {
      return new MoodLoggingErrorClass(
        'UNAUTHORIZED' as MoodLoggingErrorCode,
        'You must be logged in to save mood logs.',
        error
      );
    }

    // RLS policy violations
    if (supabaseError.code === 'PGRST116' || supabaseError.code === '42501') {
      return new MoodLoggingErrorClass(
        'PERMISSION_DENIED' as MoodLoggingErrorCode,
        'You do not have permission to access this data.',
        error
      );
    }

    // Constraint violations
    if (supabaseError.code?.startsWith('23')) {
      return new MoodLoggingErrorClass(
        'CONSTRAINT_ERROR' as MoodLoggingErrorCode,
        'Invalid data. Please check your input.',
        error
      );
    }
  }

  // Unknown errors
  return new MoodLoggingErrorClass(
    'UNKNOWN_ERROR' as MoodLoggingErrorCode,
    'An unexpected error occurred. Please try again.',
    error
  );
}

/**
 * Retry function with exponential backoff
 *
 * @param fn - Async function to retry
 * @param options - Retry configuration
 * @returns Result of the function
 * @throws Last error if all retries fail
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: unknown;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on validation or permission errors
      const moodError = createMoodLoggingError(error);
      if (!moodError.isRetryable()) {
        throw moodError;
      }

      // If not last attempt, wait before retrying
      if (attempt < opts.maxAttempts) {
        const delay = Math.min(
          opts.initialDelay * Math.pow(opts.backoffMultiplier, attempt - 1),
          opts.maxDelay
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // All retries failed
  throw createMoodLoggingError(lastError);
}

/**
 * Execute function with timeout
 *
 * @param fn - Async function to execute
 * @param timeoutMs - Timeout in milliseconds
 * @returns Result of the function
 * @throws Error if timeout is reached
 */
async function withTimeout<T>(fn: () => Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    ),
  ]);
}

// ============================================================================
// DATE/TIMEZONE UTILITIES
// ============================================================================

/**
 * Get today's date in YYYY-MM-DD format (user's local timezone)
 *
 * @param date - Optional date (defaults to now)
 * @returns Date string in YYYY-MM-DD format
 */
function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if user is authenticated
 *
 * @returns User ID if authenticated
 * @throws MoodLoggingError if not authenticated
 */
async function requireAuth(): Promise<string> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new MoodLoggingErrorClass(
      'UNAUTHORIZED' as MoodLoggingErrorCode,
      'You must be logged in to save mood logs.',
      error
    );
  }

  return user.id;
}

// ============================================================================
// CORE SERVICE FUNCTIONS
// ============================================================================

/**
 * Save a new mood log or update today's existing log
 *
 * Uses upsert pattern to handle "one log per day" constraint.
 * If a log already exists for today, it will be updated.
 *
 * @param data - Mood log data to save
 * @param options - Save options (merge, timeout, etc.)
 * @returns Saved mood log
 * @throws MoodLoggingError if save fails
 *
 * @example
 * ```ts
 * try {
 *   const moodLog = await saveMoodLog({
 *     mood: 'calm',
 *     intensity: 4,
 *     notes: 'Feeling peaceful today'
 *   });
 *   console.log('Saved:', moodLog);
 * } catch (error) {
 *   if (error instanceof MoodLoggingError) {
 *     console.error(error.getUserMessage());
 *   }
 * }
 * ```
 */
export async function saveMoodLog(
  data: MoodSubmitData,
  options: SaveMoodLogOptions = {}
): Promise<MoodLog> {
  // Validate input
  const validation = validateMoodData(data);
  if (!validation.valid) {
    const firstError = Object.values(validation.errors)[0];
    throw new MoodLoggingErrorClass(
      'VALIDATION_ERROR' as MoodLoggingErrorCode,
      firstError || 'Invalid mood data',
      validation.errors
    );
  }

  // Execute with retry and timeout
  return withRetry(
    () =>
      withTimeout(async () => {
        // Get authenticated user
        const userId = data.userId || (await requireAuth());

        // Get mood emoji
        const moodEmoji = getMoodEmoji(data.mood);

        // Determine log date (user's local timezone)
        const logDate = getLocalDateString(data.timestamp || new Date());

        // Prepare upsert data
        const upsertData = {
          user_id: userId,
          mood: data.mood,
          mood_emoji: moodEmoji,
          intensity: data.intensity,
          notes: data.notes || null,
          log_date: logDate,
        };

        console.log('[MoodService] saveMoodLog upsert:', {
          user_id: userId,
          mood: data.mood,
          intensity: data.intensity,
          log_date: logDate,
        });

        // Upsert mood log (insert or update if exists)
        console.log('[MoodService] Starting Supabase upsert...');

        let savedLog, error;
        try {
          console.log('[MoodService] Calling upsert without single()...');

          // Try without .single() to see if that's the issue
          const result = await supabase
            .from('mood_logs')
            .upsert(upsertData, {
              onConflict: 'user_id,log_date',
              ignoreDuplicates: false,
            })
            .select();

          console.log('[MoodService] Upsert returned, checking result...');

          // Manually get first result instead of using .single()
          savedLog = result.data?.[0];
          error = result.error;

          console.log('[MoodService] Supabase upsert complete');
        } catch (nativeError) {
          console.error('[MoodService] Native crash caught:', nativeError);
          throw nativeError;
        }

        console.log('[MoodService] saveMoodLog result:', {
          success: !!savedLog,
          error: error?.message,
          savedLogId: savedLog?.id,
        });

        if (error) {
          console.error('[MoodService] saveMoodLog error:', error);
          throw error;
        }

        if (!savedLog) {
          console.warn('[MoodService] saveMoodLog: upsert returned no data, fetching manually');

          const { data: fallbackLog, error: fallbackError } = await supabase
            .from('mood_logs')
            .select('*')
            .eq('user_id', userId)
            .eq('log_date', logDate)
            .is('deleted_at', null)
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (fallbackError) {
            console.error('[MoodService] saveMoodLog fallback fetch error:', fallbackError);
            throw new MoodLoggingErrorClass(
              'UNKNOWN_ERROR' as MoodLoggingErrorCode,
              'We saved your mood but could not confirm it. Please try again.',
              fallbackError
            );
          }

          if (!fallbackLog) {
            throw new MoodLoggingErrorClass(
              'UNKNOWN_ERROR' as MoodLoggingErrorCode,
              'We saved your mood but could not confirm it. Please try again.',
              null
            );
          }

          console.log('[MoodService] saveMoodLog fallback success:', {
            fallbackLogId: fallbackLog.id,
          });

          return fallbackLog as MoodLog;
        }

        return savedLog as MoodLog;
      }, options.timeout || DEFAULT_TIMEOUT),
    { maxAttempts: 3 }
  );
}

/**
 * Get today's mood log for current user
 *
 * Returns null if no log exists for today.
 * Uses optimized index query for fast lookups.
 *
 * @param userId - User ID (optional, defaults to current user)
 * @param options - Fetch options
 * @returns Today's mood log or null
 * @throws MoodLoggingError if fetch fails
 *
 * @example
 * ```ts
 * const todayLog = await getTodayMoodLog();
 * if (todayLog) {
 *   console.log('You logged:', todayLog.mood);
 * } else {
 *   console.log('No mood logged today');
 * }
 * ```
 */
export async function getTodayMoodLog(
  userId?: string,
  options: GetTodayMoodLogOptions = {}
): Promise<MoodLog | null> {
  return withTimeout(async () => {
    // Get authenticated user
    const uid = userId || (await requireAuth());

    // Get today's date in user's timezone
    const today = getLocalDateString(new Date());

    console.log('[MoodService] getTodayMoodLog query:', { uid, today });

    // Query today's mood log
    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', uid)
      .eq('log_date', today)
      .is('deleted_at', null)
      .maybeSingle();

    console.log('[MoodService] getTodayMoodLog result:', {
      hasData: !!data,
      error: error?.message,
      data: data ? { mood: data.mood, intensity: data.intensity } : null,
    });

    if (error) {
      console.error('[MoodService] getTodayMoodLog error:', error);
      throw error;
    }

    return data as MoodLog | null;
  }, DEFAULT_TIMEOUT);
}

/**
 * Update an existing mood log
 *
 * Allows partial updates (only specified fields are updated).
 *
 * @param id - Mood log ID to update
 * @param data - Fields to update
 * @returns Updated mood log
 * @throws MoodLoggingError if update fails
 *
 * @example
 * ```ts
 * const updated = await updateMoodLog('log-id-123', {
 *   intensity: 5,
 *   notes: 'Updated notes'
 * });
 * ```
 */
export async function updateMoodLog(
  id: string,
  data: MoodLogUpdate
): Promise<MoodLog> {
  // Validate partial data
  const validation = validateMoodData(data);
  if (!validation.valid) {
    const firstError = Object.values(validation.errors)[0];
    throw new MoodLoggingErrorClass(
      'VALIDATION_ERROR' as MoodLoggingErrorCode,
      firstError || 'Invalid mood data',
      validation.errors
    );
  }

  return withRetry(
    () =>
      withTimeout(async () => {
        // Ensure user is authenticated
        await requireAuth();

        // Prepare update data
        const updateData: Record<string, unknown> = {};

        if (data.mood) {
          updateData.mood = data.mood;
          updateData.mood_emoji = getMoodEmoji(data.mood);
        }

        if (data.intensity) {
          updateData.intensity = data.intensity;
        }

        if (data.notes !== undefined) {
          updateData.notes = data.notes || null;
        }

        // Update mood log
        const { data: updatedLog, error } = await supabase
          .from('mood_logs')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        if (!updatedLog) {
          throw new Error('No data returned from update');
        }

        return updatedLog as MoodLog;
      }, DEFAULT_TIMEOUT),
    { maxAttempts: 3 }
  );
}

/**
 * Delete a mood log (soft delete)
 *
 * Marks the log as deleted without removing it from the database.
 *
 * @param id - Mood log ID to delete
 * @throws MoodLoggingError if delete fails
 *
 * @example
 * ```ts
 * await deleteMoodLog('log-id-123');
 * console.log('Mood log deleted');
 * ```
 */
export async function deleteMoodLog(id: string): Promise<void> {
  return withRetry(
    () =>
      withTimeout(async () => {
        // Ensure user is authenticated
        await requireAuth();

        // Soft delete (set deleted_at timestamp)
        const { error } = await supabase
          .from('mood_logs')
          .update({ deleted_at: new Date().toISOString() })
          .eq('id', id);

        if (error) {
          throw error;
        }
      }, DEFAULT_TIMEOUT),
    { maxAttempts: 2 } // Fewer retries for delete
  );
}

/**
 * Get mood log history for a date range
 *
 * Returns all mood logs within the specified date range.
 * Defaults to last 30 days if no dates provided.
 *
 * @param startDate - Start date (inclusive)
 * @param endDate - End date (inclusive)
 * @param userId - User ID (optional, defaults to current user)
 * @returns Array of mood logs
 * @throws MoodLoggingError if fetch fails
 *
 * @example
 * ```ts
 * const last30Days = await getMoodHistory(
 *   new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
 *   new Date()
 * );
 * console.log(`Found ${last30Days.length} mood logs`);
 * ```
 */
export async function getMoodHistory(
  startDate: Date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  endDate: Date = new Date(),
  userId?: string
): Promise<MoodLog[]> {
  return withTimeout(async () => {
    // Get authenticated user
    const uid = userId || (await requireAuth());

    // Convert dates to YYYY-MM-DD strings
    const startDateStr = getLocalDateString(startDate);
    const endDateStr = getLocalDateString(endDate);

    // Query mood logs
    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', uid)
      .gte('log_date', startDateStr)
      .lte('log_date', endDateStr)
      .is('deleted_at', null)
      .order('log_date', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []) as MoodLog[];
  }, DEFAULT_TIMEOUT);
}

/**
 * Get mood statistics for analytics
 *
 * Calculates statistics like total logs, most common mood, average intensity, etc.
 *
 * @param days - Number of days to analyze (default: 30)
 * @param userId - User ID (optional, defaults to current user)
 * @returns Mood statistics
 * @throws MoodLoggingError if fetch fails
 *
 * @example
 * ```ts
 * const stats = await getMoodStats(30);
 * console.log(`Most common mood: ${stats.most_common_mood}`);
 * console.log(`Average intensity: ${stats.avg_intensity}`);
 * ```
 */
export async function getMoodStats(
  days: number = 30,
  userId?: string
): Promise<{
  total_logs: number;
  most_common_mood: string | null;
  avg_intensity: number;
  mood_distribution: Record<string, number>;
  streak_days: number;
}> {
  return withTimeout(async () => {
    // Get authenticated user
    const uid = userId || (await requireAuth());

    // Call database function
    const { data, error } = await supabase.rpc('get_mood_stats', {
      p_user_id: uid,
      p_days: days,
    });

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return {
        total_logs: 0,
        most_common_mood: null,
        avg_intensity: 0,
        mood_distribution: {},
        streak_days: 0,
      };
    }

    return data[0];
  }, DEFAULT_TIMEOUT);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  saveMoodLog,
  getTodayMoodLog,
  updateMoodLog,
  deleteMoodLog,
  getMoodHistory,
  getMoodStats,
  validateMoodData,
};
