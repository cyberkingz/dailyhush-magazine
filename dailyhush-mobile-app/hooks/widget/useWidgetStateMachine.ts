/**
 * useWidgetStateMachine Hook
 *
 * Central state machine for mood widget flow.
 * Manages transitions between: empty → mood → intensity → notes → success → display
 *
 * Features:
 * - Type-safe state transitions
 * - Data validation at each step
 * - Loading and error states
 * - Cancel/reset functionality
 * - Integration with mood logging API
 *
 * @module hooks/widget/useWidgetStateMachine
 */

import { useState, useCallback } from 'react';
import type {
  WidgetState,
  MoodChoice,
  IntensityValue,
  MoodSubmitData,
  UseWidgetStateMachineReturn,
} from '@/types/widget.types';
import { useMoodLogging } from '@/hooks/useMoodLogging';

// ============================================================================
// TYPES
// ============================================================================

interface UseWidgetStateMachineConfig {
  /** Enable quick notes stage (if false, skips from intensity → success) */
  enableQuickNotes: boolean;

  /** Callback when flow is canceled */
  onCancel?: () => void;

  /** Callback when mood is successfully logged */
  onSuccess?: (data: MoodSubmitData) => void;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Widget state machine hook
 *
 * @param config - State machine configuration
 * @returns State, data, and transition functions
 *
 * @example
 * ```tsx
 * const {
 *   state,
 *   data,
 *   startFlow,
 *   selectMood,
 *   selectIntensity,
 *   submitNotes,
 *   skipNotes,
 *   completeSuccess,
 *   reset,
 *   cancel,
 * } = useWidgetStateMachine({
 *   enableQuickNotes: true,
 *   onSuccess: (data) => console.log('Mood logged:', data),
 * });
 * ```
 */
export function useWidgetStateMachine(
  config: UseWidgetStateMachineConfig
): UseWidgetStateMachineReturn {
  const { enableQuickNotes, onCancel, onSuccess } = config;

  // ========================================================================
  // MOOD LOGGING API
  // ========================================================================

  const {
    submitMood,
    isSubmitting,
    error: apiError,
  } = useMoodLogging();

  // ========================================================================
  // STATE
  // ========================================================================

  /**
   * Current widget state
   */
  const [state, setState] = useState<WidgetState>('empty');

  /**
   * Accumulated mood data
   */
  const [data, setData] = useState<Partial<MoodSubmitData>>({});

  /**
   * Error message (if any)
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * Start time (for analytics)
   */
  const [startTime, setStartTime] = useState<Date | null>(null);

  // ========================================================================
  // VALIDATION
  // ========================================================================

  /**
   * Validate mood selection
   */
  const validateMood = useCallback((mood?: MoodChoice): boolean => {
    if (!mood) {
      setError('Please select a mood');
      return false;
    }
    setError(null);
    return true;
  }, []);

  /**
   * Validate intensity selection
   */
  const validateIntensity = useCallback((intensity?: IntensityValue): boolean => {
    if (!intensity) {
      setError('Please select an intensity level');
      return false;
    }
    if (intensity < 1 || intensity > 7) {
      setError('Intensity must be between 1 and 7');
      return false;
    }
    setError(null);
    return true;
  }, []);

  // ========================================================================
  // STATE TRANSITIONS
  // ========================================================================

  /**
   * Transition: empty → mood
   * Start the mood logging flow
   */
  const startFlow = useCallback(() => {
    setState('mood');
    setStartTime(new Date());
    setData({});
    setError(null);
  }, []);

  /**
   * Transition: mood → intensity
   * Save selected mood and advance to intensity
   */
  const selectMood = useCallback((mood: MoodChoice) => {
    if (!validateMood(mood)) return;

    setData((prev) => ({ ...prev, mood }));
    setState('intensity');
  }, [validateMood]);

  /**
   * Transition: intensity → notes (or success if notes disabled)
   * Save selected intensity and advance
   */
  const selectIntensity = useCallback((intensity: IntensityValue) => {
    if (!validateIntensity(intensity)) return;

    setData((prev) => ({ ...prev, intensity }));

    // If notes are disabled, go straight to submit
    if (!enableQuickNotes) {
      setState('success');
      submitMoodData({ ...data, intensity });
    } else {
      setState('notes');
    }
  }, [validateIntensity, enableQuickNotes, data]);

  /**
   * Submit mood data to API
   * Internal helper function
   */
  const submitMoodData = useCallback(async (finalData: Partial<MoodSubmitData>) => {
    try {
      // Validate required fields
      if (!finalData.mood) {
        throw new Error('Mood is required');
      }
      if (!finalData.intensity) {
        throw new Error('Intensity is required');
      }

      // Prepare submission data
      const submitData: MoodSubmitData = {
        mood: finalData.mood,
        intensity: finalData.intensity,
        notes: finalData.notes,
        timestamp: new Date(),
      };

      // Submit to API
      const result = await submitMood(submitData);

      if (result) {
        // Success!
        setError(null);
        onSuccess?.(submitData);

        // Calculate time to complete (for analytics)
        if (startTime) {
          const timeToComplete = Date.now() - startTime.getTime();
          console.log(`[Widget] Mood logged in ${timeToComplete}ms`);
        }
      } else {
        throw new Error('Failed to submit mood');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit mood';
      setError(errorMessage);
      console.error('[Widget] Submit error:', err);

      // Don't advance to success on error
      // Stay on current state so user can retry
    }
  }, [submitMood, onSuccess, startTime]);

  /**
   * Transition: notes → success
   * Save notes and submit to API
   */
  const submitNotes = useCallback(async (notes?: string) => {
    const finalData = { ...data, notes };
    setData(finalData);

    // Transition to success state (animation will play)
    setState('success');

    // Submit in background
    await submitMoodData(finalData);
  }, [data, submitMoodData]);

  /**
   * Transition: notes → success (skip notes)
   * Submit without notes
   */
  const skipNotes = useCallback(async () => {
    await submitNotes(undefined);
  }, [submitNotes]);

  /**
   * Transition: success → display
   * Complete success animation and show final state
   */
  const completeSuccess = useCallback(() => {
    setState('display');
  }, []);

  /**
   * Reset to empty state
   * Clears all data
   */
  const reset = useCallback(() => {
    setState('empty');
    setData({});
    setError(null);
    setStartTime(null);
  }, []);

  /**
   * Cancel flow
   * Returns to previous state (or empty if at start)
   */
  const cancel = useCallback(() => {
    onCancel?.();
    reset();
  }, [onCancel, reset]);

  // ========================================================================
  // ERROR HANDLING
  // ========================================================================

  /**
   * Update error state from API
   */
  const currentError = error || (apiError ? apiError.getUserMessage() : null);

  // ========================================================================
  // RETURN
  // ========================================================================

  return {
    // Current state
    state,
    data,

    // Transitions
    startFlow,
    selectMood,
    selectIntensity,
    submitNotes,
    skipNotes,
    completeSuccess,
    reset,
    cancel,

    // Status
    isLoading: isSubmitting,
    error: currentError,
  };
}
