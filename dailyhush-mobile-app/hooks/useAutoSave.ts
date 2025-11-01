/**
 * DailyHush - useAutoSave Hook
 *
 * Debounced auto-save functionality for mood capture writing step.
 * Prevents data loss by automatically saving drafts every 3 seconds after typing stops.
 *
 * Follows best practices:
 * - Debounced to avoid excessive API calls
 * - Shows visual status indicator (saving/saved/error)
 * - Handles errors gracefully with retry
 * - Cleanup on unmount
 *
 * @see MOOD_CAPTURE_ROADMAP.md
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================================================
// TYPES
// ============================================================================

export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface UseAutoSaveOptions<T> {
  /**
   * Function to save data (returns Promise)
   * Should call API to persist draft
   */
  onSave: (data: T) => Promise<void>;

  /**
   * Debounce delay in milliseconds
   * @default 3000 (3 seconds)
   */
  debounceMs?: number;

  /**
   * How long to show "Saved" indicator before hiding
   * @default 2000 (2 seconds)
   */
  savedIndicatorDuration?: number;

  /**
   * Enable/disable auto-save
   * @default true
   */
  enabled?: boolean;
}

export interface UseAutoSaveReturn {
  /** Current save status */
  status: AutoSaveStatus;

  /** Timestamp of last successful save */
  lastSaved?: Date;

  /** Error message if save failed */
  error?: string;

  /** Manually trigger save (bypasses debounce) */
  saveNow: () => Promise<void>;

  /** Retry failed save */
  retry: () => Promise<void>;

  /** Reset status */
  reset: () => void;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Auto-save hook with debouncing and status tracking
 *
 * @param data - Data to save (triggers save when changed)
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * const autoSave = useAutoSave(writingContent, {
 *   onSave: async (content) => {
 *     await updateMoodEntry(entryId, { content });
 *   },
 *   debounceMs: 3000,
 * });
 *
 * // Show status to user
 * {autoSave.status === 'saving' && <Text>Saving...</Text>}
 * {autoSave.status === 'saved' && <Text>✓ Saved</Text>}
 * ```
 */
export function useAutoSave<T>(
  data: T,
  options: UseAutoSaveOptions<T>
): UseAutoSaveReturn {
  const {
    onSave,
    debounceMs = 3000,
    savedIndicatorDuration = 2000,
    enabled = true,
  } = options;

  // State
  const [status, setStatus] = useState<AutoSaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | undefined>();
  const [error, setError] = useState<string | undefined>();

  // Refs to avoid stale closures
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const savedTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastDataRef = useRef<T>(data);
  const isMountedRef = useRef(true);

  // ========================================================================
  // SAVE FUNCTION
  // ========================================================================

  /**
   * Internal save function
   * Calls onSave prop and handles status updates
   */
  const performSave = useCallback(async () => {
    if (!isMountedRef.current || !enabled) return;

    try {
      setStatus('saving');
      setError(undefined);

      await onSave(lastDataRef.current);

      if (!isMountedRef.current) return;

      setStatus('saved');
      setLastSaved(new Date());

      // Hide "Saved" indicator after duration
      savedTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          setStatus('idle');
        }
      }, savedIndicatorDuration);
    } catch (err) {
      if (!isMountedRef.current) return;

      setStatus('error');
      setError(
        err instanceof Error ? err.message : 'Failed to save. Please try again.'
      );
      console.error('Auto-save error:', err);
    }
  }, [onSave, enabled, savedIndicatorDuration]);

  // ========================================================================
  // DEBOUNCED AUTO-SAVE
  // ========================================================================

  /**
   * Trigger debounced save when data changes
   */
  useEffect(() => {
    // Skip if disabled or data hasn't changed
    if (!enabled || data === lastDataRef.current) {
      return;
    }

    lastDataRef.current = data;

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Don't save empty data
    if (!data || (typeof data === 'string' && data.trim().length === 0)) {
      return;
    }

    // Set new debounce timer
    debounceTimerRef.current = setTimeout(() => {
      performSave();
    }, debounceMs);

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [data, enabled, debounceMs, performSave]);

  // ========================================================================
  // MANUAL ACTIONS
  // ========================================================================

  /**
   * Manually trigger save (bypasses debounce)
   * Useful for "Save & Close" button
   */
  const saveNow = useCallback(async () => {
    // Clear debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    await performSave();
  }, [performSave]);

  /**
   * Retry failed save
   */
  const retry = useCallback(async () => {
    await performSave();
  }, [performSave]);

  /**
   * Reset status
   */
  const reset = useCallback(() => {
    setStatus('idle');
    setError(undefined);
    setLastSaved(undefined);
  }, []);

  // ========================================================================
  // CLEANUP
  // ========================================================================

  /**
   * Cleanup on unmount
   * - Cancel pending saves
   * - Optionally trigger final save
   */
  useEffect(() => {
    return () => {
      isMountedRef.current = false;

      // Clear timers
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (savedTimerRef.current) {
        clearTimeout(savedTimerRef.current);
      }

      // Optional: trigger final save on unmount
      // Note: This might not complete if component unmounts quickly
      // For critical saves, use saveNow() before unmounting
    };
  }, []);

  // ========================================================================
  // RETURN
  // ========================================================================

  return {
    status,
    lastSaved,
    error,
    saveNow,
    retry,
    reset,
  };
}

/**
 * Variation: useAutoSaveWithMinLength
 *
 * Only auto-saves if content exceeds minimum length
 * Useful to avoid saving empty or minimal drafts
 */
export function useAutoSaveWithMinLength(
  data: string,
  options: UseAutoSaveOptions<string> & { minLength?: number }
): UseAutoSaveReturn {
  const { minLength = 10, ...autoSaveOptions } = options;

  // Only pass data to auto-save if it meets minimum length
  const dataToSave = data.trim().length >= minLength ? data : '';

  return useAutoSave(dataToSave, autoSaveOptions);
}
