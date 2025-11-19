// ============================================================================
// REACT NATIVE HOOK: useExerciseTracking
// ============================================================================
// Complete hook for tracking exercise sessions in Nœma app
// ============================================================================

import { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '@/store/useStore';
import { ExerciseLogsAPI } from '@/utils/supabase/exercise-logs';
import type {
  ExerciseLog,
  ExerciseType,
  StartExercisePayload,
  CompleteExercisePayload,
  AbandonExercisePayload,
  ExerciseStats,
  ExerciseHistoryItem,
} from '@/types/exercise-logs';

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useExerciseTracking() {
  const { user } = useUserStore();
  const userId = user?.user_id;

  // State
  const [currentExercise, setCurrentExercise] = useState<ExerciseLog | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // START EXERCISE
  // ============================================================================

  const startExercise = useCallback(
    async (payload: StartExercisePayload) => {
      if (!userId) {
        setError('User not authenticated');
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const log = await ExerciseLogsAPI.startExercise(userId, {
          ...payload,
          device_type: 'mobile', // Could detect iOS/Android
          app_version: '1.0.0', // From app config
        });

        setCurrentExercise(log);

        // Track analytics
        ExerciseLogsAPI.trackExerciseCompletion(log);

        return log;
      } catch (err: any) {
        console.error('Error starting exercise:', err);
        setError(err.message || 'Failed to start exercise');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  // ============================================================================
  // COMPLETE EXERCISE
  // ============================================================================

  const completeExercise = useCallback(
    async (
      logId: string,
      postRating: number,
      durationSeconds: number,
      exerciseData?: Record<string, any>
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const payload: CompleteExercisePayload = {
          completion_status: 'completed',
          completed_at: new Date().toISOString(),
          duration_seconds: durationSeconds,
          post_anxiety_rating: postRating,
          exercise_data: exerciseData,
        };

        const log = await ExerciseLogsAPI.completeExercise(logId, payload);

        setCurrentExercise(null); // Clear current exercise

        // Track analytics
        ExerciseLogsAPI.trackExerciseCompletion(log);

        return log;
      } catch (err: any) {
        console.error('Error completing exercise:', err);
        setError(err.message || 'Failed to complete exercise');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ============================================================================
  // ABANDON EXERCISE
  // ============================================================================

  const abandonExercise = useCallback(
    async (logId: string, abandonedAtPercentage: number, durationSeconds?: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const payload: AbandonExercisePayload = {
          completion_status: 'abandoned',
          abandoned_at_percentage: abandonedAtPercentage,
          duration_seconds: durationSeconds,
        };

        const log = await ExerciseLogsAPI.abandonExercise(logId, payload);

        setCurrentExercise(null);

        // Track analytics
        ExerciseLogsAPI.trackExerciseAbandonment(log);

        return log;
      } catch (err: any) {
        console.error('Error abandoning exercise:', err);
        setError(err.message || 'Failed to abandon exercise');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ============================================================================
  // SKIP EXERCISE
  // ============================================================================

  const skipExercise = useCallback(async (logId: string, skipReason?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const log = await ExerciseLogsAPI.skipExercise(logId, {
        completion_status: 'skipped',
        skip_reason: skipReason,
      });

      setCurrentExercise(null);

      return log;
    } catch (err: any) {
      console.error('Error skipping exercise:', err);
      setError(err.message || 'Failed to skip exercise');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    currentExercise,
    isLoading,
    error,
    startExercise,
    completeExercise,
    abandonExercise,
    skipExercise,
  };
}

// ============================================================================
// HOOK: useExerciseHistory
// ============================================================================

export function useExerciseHistory(limit: number = 20) {
  const { user } = useUserStore();
  const userId = user?.user_id;

  const [history, setHistory] = useState<ExerciseHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await ExerciseLogsAPI.getRecentExercises(userId, limit);
      setHistory(data);
    } catch (err: any) {
      console.error('Error fetching exercise history:', err);
      setError(err.message || 'Failed to fetch history');
    } finally {
      setIsLoading(false);
    }
  }, [userId, limit]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    isLoading,
    error,
    refetch: fetchHistory,
  };
}

// ============================================================================
// HOOK: useExerciseStats
// ============================================================================

export function useExerciseStats() {
  const { user } = useUserStore();
  const userId = user?.user_id;

  const [stats, setStats] = useState<ExerciseStats[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [mostEffectiveExercise, setMostEffectiveExercise] = useState<ExerciseType | null>(null);
  const [mostCommonTrigger, setMostCommonTrigger] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch all stats in parallel
      const [statsData, streakData, effectiveExercise, commonTrigger] = await Promise.all([
        ExerciseLogsAPI.getExerciseStats(userId),
        ExerciseLogsAPI.getExerciseStreak(userId),
        ExerciseLogsAPI.getMostEffectiveExercise(userId),
        ExerciseLogsAPI.getMostCommonTrigger(userId),
      ]);

      setStats(statsData);
      setStreak(streakData);
      setMostEffectiveExercise(effectiveExercise);
      setMostCommonTrigger(commonTrigger);
    } catch (err: any) {
      console.error('Error fetching exercise stats:', err);
      setError(err.message || 'Failed to fetch stats');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Calculate overall stats
  const overallStats = stats.reduce(
    (acc, stat) => ({
      total_sessions: acc.total_sessions + stat.total_sessions,
      completed_count: acc.completed_count + stat.completed_count,
      avg_reduction: acc.avg_reduction + stat.avg_anxiety_reduction * stat.total_sessions,
      total_this_week: acc.total_this_week + stat.completions_last_7_days,
    }),
    {
      total_sessions: 0,
      completed_count: 0,
      avg_reduction: 0,
      total_this_week: 0,
    }
  );

  // Calculate weighted average reduction
  const avgReduction =
    overallStats.total_sessions > 0
      ? Math.round(overallStats.avg_reduction / overallStats.total_sessions)
      : 0;

  return {
    stats,
    streak,
    mostEffectiveExercise,
    mostCommonTrigger,
    overallStats: {
      ...overallStats,
      avg_reduction: avgReduction,
    },
    isLoading,
    error,
    refetch: fetchStats,
  };
}

// ============================================================================
// HOOK: useExerciseTriggers
// ============================================================================

export function useExerciseTriggers(loopType?: string) {
  const [triggers, setTriggers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTriggers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await ExerciseLogsAPI.getExerciseTriggers(loopType);
        setTriggers(data);
      } catch (err: any) {
        console.error('Error fetching triggers:', err);
        setError(err.message || 'Failed to fetch triggers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTriggers();
  }, [loopType]);

  return {
    triggers,
    isLoading,
    error,
  };
}

// ============================================================================
// HOOK: useExerciseSubscription
// ============================================================================

export function useExerciseSubscription(onExerciseUpdate?: (payload: any) => void) {
  const { user } = useUserStore();
  const userId = user?.user_id;

  useEffect(() => {
    if (!userId || !onExerciseUpdate) return;

    // Subscribe to real-time updates
    const subscription = ExerciseLogsAPI.subscribeToExerciseLogs(userId, onExerciseUpdate);

    // Cleanup on unmount
    return () => {
      ExerciseLogsAPI.unsubscribeFromExerciseLogs(subscription);
    };
  }, [userId, onExerciseUpdate]);
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  useExerciseTracking,
  useExerciseHistory,
  useExerciseStats,
  useExerciseTriggers,
  useExerciseSubscription,
};
