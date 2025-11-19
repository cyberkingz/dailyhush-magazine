/**
 * Nœma - useExerciseSession Hook
 * Manages exercise session state, stage transitions, and persistence
 *
 * Features:
 * - Stage-based flow management
 * - Auto-save to AsyncStorage
 * - Database logging via Supabase
 * - Analytics tracking
 * - Pause/resume functionality
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

import { v4 as uuidv4 } from 'uuid';

import type {
  ExerciseSession,
  ExerciseConfig,
  ExerciseStage,
  ExerciseData,
  ModuleContext,
  TriggerData,
} from '@/types/exercises';
import { useUser } from '@/store/useStore';
import { useAnalytics } from '@/utils/analytics';
import { startExercise, completeExercise, abandonExercise } from '@/utils/supabase/exercise-logs';
import * as Haptics from 'expo-haptics';

// Polyfill crypto.getRandomValues for React Native
if (typeof global.crypto !== 'object') {
  global.crypto = {} as any;
}
if (typeof global.crypto.getRandomValues !== 'function') {
  global.crypto.getRandomValues = <T extends ArrayBufferView>(array: T): T => {
    const bytes = Crypto.getRandomBytes(array.byteLength);
    const uint8Array = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
    uint8Array.set(bytes);
    return array;
  };
}

const STORAGE_KEY = '@dailyhush_exercise_session';
const AUTO_SAVE_INTERVAL = 5000; // 5 seconds

interface UseExerciseSessionProps {
  config: ExerciseConfig;
  moduleContext?: ModuleContext;
  moduleScreen?: string;
  onComplete?: () => void;
  onAbandon?: () => void;
}

export function useExerciseSession({
  config,
  moduleContext = 'standalone',
  moduleScreen,
  onComplete,
  onAbandon,
}: UseExerciseSessionProps) {
  const user = useUser();
  const analytics = useAnalytics();

  // Session state
  const [session, setSession] = useState<ExerciseSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Timers
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitialized = useRef<boolean>(false);

  /**
   * Initialize a new exercise session
   */
  const initializeSession = useCallback(async () => {
    // Prevent multiple initializations
    if (hasInitialized.current) {
      return;
    }
    hasInitialized.current = true;

    if (!user?.user_id) {
      setError('User not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      // Check for existing session in AsyncStorage
      const existingSession = await AsyncStorage.getItem(STORAGE_KEY);

      if (existingSession) {
        const parsed: ExerciseSession = JSON.parse(existingSession);

        // Only restore if it's the same exercise type and not completed
        if (parsed.exerciseType === config.type && parsed.completionStatus !== 'completed') {
          setSession(parsed);
          setIsLoading(false);

          // Track resume
          analytics.track('EXERCISE_RESUMED', {
            exercise_type: config.type,
            exercise_name: config.title,
            session_id: parsed.sessionId,
            stage: parsed.currentStage,
          });

          return;
        }
      }

      // Create new session
      const newSession: ExerciseSession = {
        sessionId: uuidv4(),
        userId: user.user_id,
        exerciseType: config.type,
        moduleContext,
        moduleScreen,
        startedAt: new Date().toISOString(),
        currentStage: config.stages.requirePreRating
          ? 'pre_rating'
          : config.stages.showInstructions
            ? 'instructions'
            : 'exercise',
        completionStatus: 'in_progress',
        currentStageDuration: 0,
        totalDuration: 0,
        preRating: null,
        postRating: null,
        exerciseData: initializeExerciseData(config.type),
        progress: {
          currentStep: 1,
          totalSteps: calculateTotalSteps(config),
          percentage: 0,
        },
        isPaused: false,
        canResume: true,
      };

      setSession(newSession);
      await saveSessionToStorage(newSession);

      // Create database log entry
      try {
        const log = await startExercise({
          user_id: user.user_id,
          exercise_type: config.type,
          exercise_name: config.title,
          module_context: moduleContext,
          fire_module_screen: moduleScreen,
          device_type: Platform.OS, // 'ios' | 'android' | 'web'
        });

        // Update session with log_id
        const updatedSession = { ...newSession, logId: log.log_id };
        setSession(updatedSession);
        await saveSessionToStorage(updatedSession);
      } catch (dbError) {
        console.error('Failed to create database log:', dbError);
        // Continue anyway - local session still works
      }

      // Track analytics
      analytics.track('EXERCISE_STARTED', {
        exercise_type: config.type,
        exercise_name: config.title,
        exercise_category: config.category,
        module_context: moduleContext,
        session_id: newSession.sessionId,
      });

      setIsLoading(false);
    } catch (err) {
      console.error('Failed to initialize session:', err);
      setError('Failed to start exercise');
      setIsLoading(false);
    }
  }, [user, config, moduleContext, moduleScreen, analytics]);

  /**
   * Save session to AsyncStorage
   */
  const saveSessionToStorage = async (sessionData: ExerciseSession) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
    } catch (err) {
      console.error('Failed to save session to storage:', err);
    }
  };

  /**
   * Clear session from AsyncStorage
   */
  const clearSessionFromStorage = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear session from storage:', err);
    }
  };

  /**
   * Update session state
   */
  const updateSession = useCallback((updates: Partial<ExerciseSession>) => {
    setSession((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      saveSessionToStorage(updated); // Auto-save
      return updated;
    });
  }, []);

  /**
   * Transition to next stage
   */
  const goToNextStage = useCallback(async () => {
    if (!session) return;

    const currentStage = session.currentStage;
    const nextStage = getNextStage(currentStage, config);

    if (!nextStage) {
      console.error('No next stage available');
      return;
    }

    // Haptic feedback
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Track stage transition
    analytics.track('EXERCISE_STAGE_TRANSITION', {
      exercise_type: config.type,
      session_id: session.sessionId,
      from_stage: currentStage,
      to_stage: nextStage,
      duration_in_previous_stage: session.currentStageDuration,
    });

    updateSession({
      currentStage: nextStage,
      currentStageDuration: 0,
      progress: {
        ...session.progress,
        currentStep: session.progress.currentStep + 1,
        percentage: Math.round(
          ((session.progress.currentStep + 1) / session.progress.totalSteps) * 100
        ),
      },
    });
  }, [session, config, analytics, updateSession]);

  /**
   * Set pre-anxiety rating
   */
  const setPreRating = useCallback(
    async (rating: number) => {
      if (!session) return;

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      analytics.track('EXERCISE_RATING_PRE', {
        exercise_type: config.type,
        session_id: session.sessionId,
        pre_anxiety_rating: rating,
      });

      updateSession({ preRating: rating });
    },
    [session, config, analytics, updateSession]
  );

  /**
   * Set post-anxiety rating
   */
  const setPostRating = useCallback(
    async (rating: number) => {
      if (!session) return;

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const reduction = session.preRating ? session.preRating - rating : 0;
      const reductionPercentage =
        session.preRating && session.preRating > 0
          ? Math.round((reduction / session.preRating) * 100)
          : 0;

      analytics.track('EXERCISE_RATING_POST', {
        exercise_type: config.type,
        session_id: session.sessionId,
        post_anxiety_rating: rating,
        pre_anxiety_rating: session.preRating,
        anxiety_reduction: reduction,
        reduction_percentage: reductionPercentage,
      });

      updateSession({ postRating: rating });
    },
    [session, config, analytics, updateSession]
  );

  /**
   * Log trigger
   */
  const logTrigger = useCallback(
    async (trigger: TriggerData) => {
      if (!session) return;

      analytics.track('EXERCISE_TRIGGER_LOGGED', {
        exercise_type: config.type,
        session_id: session.sessionId,
        trigger_category: trigger.category,
      });

      updateSession({ trigger });
    },
    [session, config, analytics, updateSession]
  );

  /**
   * Update exercise data
   */
  const updateExerciseData = useCallback(
    (data: Partial<ExerciseData>) => {
      if (!session) return;

      updateSession({
        exerciseData: { ...session.exerciseData, ...data },
      });
    },
    [session, updateSession]
  );

  /**
   * Complete exercise
   */
  const complete = useCallback(async () => {
    if (!session) {
      console.error('Cannot complete: No session');
      return;
    }

    const completedAt = new Date().toISOString();
    const totalDuration = Math.floor(
      (new Date(completedAt).getTime() - new Date(session.startedAt).getTime()) / 1000
    );

    // Update database if we have a log ID
    if (session.logId) {
      try {
        await completeExercise(session.logId, {
          completed_at: completedAt,
          duration_seconds: totalDuration,
          post_anxiety_rating: session.postRating!,
          completion_status: 'completed',
          exercise_data: session.exerciseData as any,
        });
      } catch (err) {
        console.error('Failed to complete exercise in database:', err);
      }
    } else {
      console.warn('No log ID - exercise completed locally only');
    }

    // Track analytics (always track, even without database sync)
    analytics.track('EXERCISE_COMPLETED', {
      exercise_type: config.type,
      exercise_name: config.title,
      session_id: session.sessionId,
      duration_seconds: totalDuration,
      pre_anxiety_rating: session.preRating,
      post_anxiety_rating: session.postRating,
      anxiety_reduction:
        session.preRating && session.postRating ? session.preRating - session.postRating : 0,
      reduction_percentage:
        session.preRating && session.postRating && session.preRating > 0
          ? Math.round(((session.preRating - session.postRating) / session.preRating) * 100)
          : 0,
      trigger_category: session.trigger?.category,
      module_context: session.moduleContext,
      synced_to_database: !!session.logId,
    });

    // Haptic feedback
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Clear session
    await clearSessionFromStorage();

    // Call callback
    onComplete?.();
  }, [session, config, analytics, onComplete]);

  /**
   * Abandon exercise
   */
  const abandon = useCallback(async () => {
    if (!session) return;

    const abandonedAt = new Date().toISOString();
    const totalDuration = Math.floor(
      (new Date(abandonedAt).getTime() - new Date(session.startedAt).getTime()) / 1000
    );

    // Update database if we have a log ID
    if (session.logId) {
      try {
        await abandonExercise(session.logId, {
          completion_status: 'abandoned',
          duration_seconds: totalDuration,
          abandoned_at_percentage: session.progress.percentage,
        });
      } catch (err) {
        console.error('Failed to mark as abandoned in database:', err);
      }
    }

    // Track analytics
    analytics.track('EXERCISE_ABANDONED', {
      exercise_type: config.type,
      session_id: session.sessionId,
      abandoned_at_percentage: session.progress.percentage,
      stage: session.currentStage,
      duration_seconds: totalDuration,
    });

    // Clear session
    await clearSessionFromStorage();

    // Call callback
    onAbandon?.();
  }, [session, config, analytics, onAbandon]);

  /**
   * Pause exercise
   */
  const pause = useCallback(async () => {
    if (!session) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    analytics.track('EXERCISE_PAUSED', {
      exercise_type: config.type,
      session_id: session.sessionId,
      stage: session.currentStage,
    });

    updateSession({ isPaused: true });
  }, [session, config, analytics, updateSession]);

  /**
   * Resume exercise
   */
  const resume = useCallback(async () => {
    if (!session) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    analytics.track('EXERCISE_RESUMED', {
      exercise_type: config.type,
      session_id: session.sessionId,
      stage: session.currentStage,
    });

    updateSession({ isPaused: false });
  }, [session, config, analytics, updateSession]);

  // Initialize session on mount
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // Auto-save timer
  useEffect(() => {
    if (!session) return;

    autoSaveRef.current = setInterval(() => {
      saveSessionToStorage(session);
    }, AUTO_SAVE_INTERVAL);

    return () => {
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current);
      }
    };
  }, [session]);

  // Update duration timers
  useEffect(() => {
    if (!session || session.isPaused) return;

    timerRef.current = setInterval(() => {
      updateSession({
        currentStageDuration: session.currentStageDuration + 1,
        totalDuration: session.totalDuration + 1,
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [session, updateSession]);

  return {
    // State
    session,
    isLoading,
    error,

    // Actions
    updateSession,
    goToNextStage,
    setPreRating,
    setPostRating,
    logTrigger,
    updateExerciseData,
    complete,
    abandon,
    pause,
    resume,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Initialize exercise-specific data
 */
function initializeExerciseData(exerciseType: string): ExerciseData {
  switch (exerciseType) {
    case 'breathing':
      return {
        type: 'breathing',
        protocol: 'cyclic-sigh',
        targetCycles: 0,
        completedCycles: 0,
        currentPhase: 'inhale',
        breathDurations: { inhale: 2.5, exhale: 6 },
        cycleHistory: [],
      };
    case 'grounding':
      return {
        type: 'grounding',
        senses: {
          see: { target: 5, identified: 0, items: [] },
          touch: { target: 4, identified: 0, items: [] },
          hear: { target: 3, identified: 0, items: [] },
          smell: { target: 2, identified: 0, items: [] },
          taste: { target: 1, identified: 0, items: [] },
        },
        currentSense: 'see',
        totalIdentified: 0,
        totalTarget: 15,
      };
    case 'brain_dump':
      return {
        type: 'brain_dump',
        wordCount: 0,
        sessionDuration: 0,
        autoSaveCount: 0,
      };
    case 'cognitive_reframe':
      return {
        type: 'emotion',
        selectedEmotions: [],
      };
    default:
      return {
        type: 'breathing',
        protocol: 'cyclic-sigh',
        targetCycles: 0,
        completedCycles: 0,
        currentPhase: 'inhale',
        breathDurations: { inhale: 2.5, exhale: 6 },
        cycleHistory: [],
      };
  }
}

/**
 * Calculate total steps for progress tracking
 */
function calculateTotalSteps(config: ExerciseConfig): number {
  let steps = 1; // Exercise stage itself

  if (config.stages.requirePreRating) steps++;
  if (config.stages.showInstructions) steps++;
  if (config.stages.requirePostRating) steps++;
  if (config.stages.requireTriggerLog) steps++;
  steps++; // Complete stage

  return steps;
}

/**
 * Get next stage based on config
 */
function getNextStage(currentStage: ExerciseStage, config: ExerciseConfig): ExerciseStage | null {
  switch (currentStage) {
    case 'pre_rating':
      return config.stages.showInstructions ? 'instructions' : 'exercise';
    case 'instructions':
      return 'exercise';
    case 'exercise':
      return config.stages.requirePostRating ? 'post_rating' : 'complete';
    case 'post_rating':
      return config.stages.requireTriggerLog ? 'trigger_log' : 'complete';
    case 'trigger_log':
      return 'complete';
    case 'complete':
      return null;
    default:
      return null;
  }
}
