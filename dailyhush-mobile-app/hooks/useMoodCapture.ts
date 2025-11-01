/**
 * DailyHush - useMoodCapture Hook
 *
 * Central state management for mood capture bottom sheet flow.
 * Manages navigation between 4 steps and data collection.
 *
 * Follows best practices:
 * - Single source of truth for mood capture state
 * - Type-safe with full TypeScript
 * - Immutable state updates
 * - Clear validation rules
 *
 * @see MOOD_CAPTURE_ROADMAP.md
 */

import { useState, useCallback, useEffect } from 'react';
import type { Enums } from '@/types/supabase';
import type { MoodOption, IntensityValue } from '@/constants/moodOptions';
import type { SuggestionTemplate } from '@/constants/suggestions';

// ============================================================================
// TYPES
// ============================================================================

export type MoodCaptureStep = 1 | 2 | 3 | 4;

export interface MoodCaptureData {
  /** Step 1: Selected mood */
  mood?: MoodOption;

  /** Step 2: Intensity rating (1-5) */
  intensity?: IntensityValue;

  /** Step 3: Free-form writing */
  writingContent?: string;

  /** Step 3: Voice transcription (if used) */
  voiceTranscription?: string;

  /** Step 4: Suggested activity */
  suggestion?: SuggestionTemplate;

  /** Step 4: Did user accept suggestion? */
  suggestionAccepted?: boolean;

  /** Metadata */
  startTime: Date;
  skippedSteps: MoodCaptureStep[];
}

export interface UseMoodCaptureReturn {
  // Current state
  currentStep: MoodCaptureStep;
  data: MoodCaptureData;
  isComplete: boolean;

  // Navigation
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: MoodCaptureStep) => void;
  skipCurrentStep: () => void;

  // Data updates
  setMood: (mood: MoodOption) => void;
  setIntensity: (intensity: IntensityValue) => void;
  setWritingContent: (content: string) => void;
  setVoiceTranscription: (transcription: string) => void;
  setSuggestion: (suggestion: SuggestionTemplate, accepted: boolean) => void;

  // Validation
  canContinueFromStep: (step: MoodCaptureStep) => boolean;

  // Reset
  reset: () => void;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const getInitialData = (): MoodCaptureData => ({
  startTime: new Date(),
  skippedSteps: [],
});

// ============================================================================
// HOOK
// ============================================================================

/**
 * Central state management hook for mood capture flow
 *
 * @param initialStep - Optional starting step (defaults to 1)
 * @param onComplete - Callback when all steps are done
 *
 * @example
 * ```tsx
 * const moodCapture = useMoodCapture({
 *   onComplete: (data) => {
 *     console.log('Mood capture complete!', data);
 *   }
 * });
 * ```
 */
export function useMoodCapture(options?: {
  initialStep?: MoodCaptureStep;
  onComplete?: (data: MoodCaptureData) => void;
}): UseMoodCaptureReturn {
  const { initialStep = 1, onComplete } = options ?? {};

  // State
  const [currentStep, setCurrentStep] = useState<MoodCaptureStep>(initialStep);
  const [data, setData] = useState<MoodCaptureData>(getInitialData);
  const [isComplete, setIsComplete] = useState(false);

  // ========================================================================
  // VALIDATION
  // ========================================================================

  /**
   * Check if user can continue from a specific step
   * - Step 1: Must select mood
   * - Step 2: Must select intensity
   * - Step 3: Always allowed (writing is optional)
   * - Step 4: Always allowed
   */
  const canContinueFromStep = useCallback(
    (step: MoodCaptureStep): boolean => {
      switch (step) {
        case 1:
          return !!data.mood; // Must select mood
        case 2:
          return !!data.intensity; // Must select intensity
        case 3:
          return true; // Writing is optional
        case 4:
          return true; // Always can complete
        default:
          return false;
      }
    },
    [data]
  );

  // ========================================================================
  // NAVIGATION
  // ========================================================================

  /**
   * Go to next step
   * Validates current step before advancing
   */
  const goToNextStep = useCallback(() => {
    if (!canContinueFromStep(currentStep)) {
      console.warn(
        `Cannot continue from step ${currentStep}: validation failed`
      );
      return;
    }

    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as MoodCaptureStep);
    } else {
      // Step 4 is last - mark as complete
      setIsComplete(true);
      onComplete?.(data);
    }
  }, [currentStep, canContinueFromStep, data, onComplete]);

  /**
   * Go to previous step
   * Preserves all entered data
   */
  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as MoodCaptureStep);
    }
  }, [currentStep]);

  /**
   * Jump to a specific step
   * Used for skip functionality
   */
  const goToStep = useCallback((step: MoodCaptureStep) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
    }
  }, []);

  /**
   * Skip current step
   * Records skipped step and jumps based on context:
   * - Step 1 (mood): Jump to Step 3 (writing is most important)
   * - Step 2 (intensity): Jump to Step 3
   * - Step 3 (writing): Show confirmation, then go to Step 4
   * - Step 4 (suggestion): Complete the flow
   */
  const skipCurrentStep = useCallback(() => {
    setData((prev) => ({
      ...prev,
      skippedSteps: [...prev.skippedSteps, currentStep],
    }));

    switch (currentStep) {
      case 1:
      case 2:
        // Skip to writing (most important step)
        setCurrentStep(3);
        break;
      case 3:
        // Skip writing, go to suggestion
        setCurrentStep(4);
        break;
      case 4:
        // Skip suggestion, complete flow
        setIsComplete(true);
        onComplete?.(data);
        break;
    }
  }, [currentStep, data, onComplete]);

  // ========================================================================
  // DATA UPDATES
  // ========================================================================

  /**
   * Set selected mood (Step 1)
   */
  const setMood = useCallback((mood: MoodOption) => {
    setData((prev) => ({ ...prev, mood }));
  }, []);

  /**
   * Set intensity rating (Step 2)
   */
  const setIntensity = useCallback((intensity: IntensityValue) => {
    setData((prev) => ({ ...prev, intensity }));
  }, []);

  /**
   * Set writing content (Step 3)
   * Used for both manual typing and voice transcription
   */
  const setWritingContent = useCallback((content: string) => {
    setData((prev) => ({ ...prev, writingContent: content }));
  }, []);

  /**
   * Set voice transcription (Step 3)
   * Stores separately for analytics
   */
  const setVoiceTranscription = useCallback((transcription: string) => {
    setData((prev) => ({
      ...prev,
      voiceTranscription: transcription,
      // Also append to writing content
      writingContent: prev.writingContent
        ? `${prev.writingContent} ${transcription}`
        : transcription,
    }));
  }, []);

  /**
   * Set suggestion and acceptance (Step 4)
   */
  const setSuggestion = useCallback(
    (suggestion: SuggestionTemplate, accepted: boolean) => {
      setData((prev) => ({
        ...prev,
        suggestion,
        suggestionAccepted: accepted,
      }));
    },
    []
  );

  // ========================================================================
  // RESET
  // ========================================================================

  /**
   * Reset entire flow
   * Used when closing/dismissing bottom sheet
   */
  const reset = useCallback(() => {
    setCurrentStep(1);
    setData(getInitialData());
    setIsComplete(false);
  }, []);

  // ========================================================================
  // EFFECTS
  // ========================================================================

  /**
   * Auto-advance from Step 4 when suggestion is set
   * (if user clicks "Try This Exercise" or "Save & Close")
   */
  useEffect(() => {
    if (currentStep === 4 && data.suggestion) {
      // Small delay for better UX (user sees the suggestion)
      const timer = setTimeout(() => {
        setIsComplete(true);
        onComplete?.(data);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentStep, data, onComplete]);

  // ========================================================================
  // RETURN
  // ========================================================================

  return {
    // Current state
    currentStep,
    data,
    isComplete,

    // Navigation
    goToNextStep,
    goToPreviousStep,
    goToStep,
    skipCurrentStep,

    // Data updates
    setMood,
    setIntensity,
    setWritingContent,
    setVoiceTranscription,
    setSuggestion,

    // Validation
    canContinueFromStep,

    // Reset
    reset,
  };
}
