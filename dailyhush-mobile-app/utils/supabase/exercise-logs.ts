// ============================================================================
// SUPABASE CLIENT HELPERS FOR EXERCISE LOGS
// ============================================================================
// Type-safe functions for interacting with exercise_logs table
// ============================================================================

import { supabase } from '@/utils/supabase';
import type {
  ExerciseLog,
  ExerciseLogInsert,
  ExerciseStats,
  TriggerOption,
  ExerciseType,
  ModuleContext,
} from '@/types/exercises';
import {
  UserExerciseSummary,
  WeeklyExerciseProgress,
  TriggerAnalysis,
  ExerciseHistoryItem,
} from '@/types/exercise-logs';

// ============================================================================
// 1. CREATE EXERCISE LOG
// ============================================================================

/**
 * Start a new exercise session
 * Creates a log entry with pre-anxiety rating and trigger info
 */
export async function startExercise(payload: Partial<ExerciseLogInsert>) {
  const { data, error } = await supabase
    .from('exercise_logs')
    .insert({
      ...payload,
      started_at: new Date().toISOString(),
      completion_status: payload.completion_status || 'in_progress',
    })
    .select()
    .single();

  if (error) {
    console.error('Error starting exercise:', error);
    throw error;
  }

  return data as ExerciseLog;
}

// ============================================================================
// 2. UPDATE EXERCISE LOG
// ============================================================================

/**
 * Mark exercise as completed with post-anxiety rating
 */
export async function completeExercise(
  logId: string,
  payload: {
    completed_at: string;
    duration_seconds: number;
    post_anxiety_rating: number;
    completion_status: 'completed';
    exercise_data?: Record<string, any>;
  }
) {
  const { data, error } = await supabase
    .from('exercise_logs')
    .update(payload)
    .eq('log_id', logId)
    .select()
    .single();

  if (error) {
    console.error('Error completing exercise:', error);
    throw error;
  }

  return data as ExerciseLog;
}

/**
 * Mark exercise as abandoned with friction point data
 */
export async function abandonExercise(
  logId: string,
  payload: {
    completion_status: 'abandoned';
    duration_seconds: number;
    abandoned_at_percentage: number;
  }
) {
  const { data, error } = await supabase
    .from('exercise_logs')
    .update(payload)
    .eq('log_id', logId)
    .select()
    .single();

  if (error) {
    console.error('Error abandoning exercise:', error);
    throw error;
  }

  return data as ExerciseLog;
}

/**
 * Mark exercise as skipped
 */
export async function skipExercise(
  logId: string,
  payload: {
    completion_status: 'skipped';
    skip_reason?: string;
  }
) {
  const { data, error } = await supabase
    .from('exercise_logs')
    .update(payload)
    .eq('log_id', logId)
    .select()
    .single();

  if (error) {
    console.error('Error skipping exercise:', error);
    throw error;
  }

  return data as ExerciseLog;
}

// ============================================================================
// 3. READ EXERCISE LOGS
// ============================================================================

/**
 * Get user's recent exercise history
 */
export async function getRecentExercises(
  userId: string,
  limit: number = 20
): Promise<ExerciseHistoryItem[]> {
  const { data, error } = await supabase
    .from('exercise_logs')
    .select(
      `
      log_id,
      exercise_name,
      exercise_type,
      completed_at,
      duration_seconds,
      anxiety_reduction,
      reduction_percentage,
      trigger_category,
      module_context
    `
    )
    .eq('user_id', userId)
    .eq('is_deleted', false)
    .order('started_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent exercises:', error);
    throw error;
  }

  return (data || []).map((item) => ({
    ...item,
    duration_minutes: item.duration_seconds ? Math.round(item.duration_seconds / 60) : 0,
  })) as ExerciseHistoryItem[];
}

/**
 * Get exercises from last N days
 */
export async function getExercisesByDateRange(
  userId: string,
  daysAgo: number = 7
): Promise<ExerciseLog[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysAgo);

  const { data, error } = await supabase
    .from('exercise_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('is_deleted', false)
    .gte('started_at', startDate.toISOString())
    .order('started_at', { ascending: false });

  if (error) {
    console.error('Error fetching exercises by date range:', error);
    throw error;
  }

  return (data || []) as ExerciseLog[];
}

/**
 * Get single exercise log by ID
 */
export async function getExerciseById(logId: string): Promise<ExerciseLog | null> {
  const { data, error } = await supabase
    .from('exercise_logs')
    .select('*')
    .eq('log_id', logId)
    .eq('is_deleted', false)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    console.error('Error fetching exercise by ID:', error);
    throw error;
  }

  return data as ExerciseLog;
}

// ============================================================================
// 4. STATISTICS & ANALYTICS
// ============================================================================

/**
 * Get user's exercise summary for dashboard
 */
export async function getUserExerciseSummary(userId: string): Promise<UserExerciseSummary> {
  const { data, error } = await supabase.rpc('get_user_exercise_summary', {
    p_user_id: userId,
  });

  if (error) {
    console.error('Error fetching user exercise summary:', error);
    throw error;
  }

  return data as UserExerciseSummary;
}

/**
 * Get pre-computed stats from materialized view (FAST)
 */
export async function getExerciseStats(userId: string): Promise<ExerciseStats[]> {
  const { data, error } = await supabase
    .from('exercise_stats_by_user')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching exercise stats:', error);
    throw error;
  }

  return (data || []) as ExerciseStats[];
}

/**
 * Get current exercise streak
 */
export async function getExerciseStreak(userId: string): Promise<number> {
  const { data, error } = await supabase.rpc('get_exercise_streak', {
    p_user_id: userId,
  });

  if (error) {
    console.error('Error fetching exercise streak:', error);
    throw error;
  }

  return (data as number) || 0;
}

/**
 * Get most effective exercise type for user
 */
export async function getMostEffectiveExercise(userId: string): Promise<ExerciseType | null> {
  const { data, error } = await supabase.rpc('get_most_effective_exercise', {
    p_user_id: userId,
  });

  if (error) {
    console.error('Error fetching most effective exercise:', error);
    throw error;
  }

  return (data as ExerciseType) || null;
}

/**
 * Get most common trigger category
 */
export async function getMostCommonTrigger(userId: string): Promise<string | null> {
  const { data, error } = await supabase.rpc('get_most_common_trigger', {
    p_user_id: userId,
  });

  if (error) {
    console.error('Error fetching most common trigger:', error);
    throw error;
  }

  return (data as string) || null;
}

/**
 * Get weekly progress for Pattern Insights
 */
export async function getWeeklyProgress(
  userId: string,
  weeksBack: number = 8
): Promise<WeeklyExerciseProgress[]> {
  const { data, error } = await supabase.rpc('get_weekly_exercise_progress', {
    p_user_id: userId,
    p_weeks_back: weeksBack,
  });

  if (error) {
    console.error('Error fetching weekly progress:', error);
    throw error;
  }

  return (data || []) as WeeklyExerciseProgress[];
}

/**
 * Get trigger analysis
 */
export async function getTriggerAnalysis(userId: string): Promise<TriggerAnalysis[]> {
  const { data, error } = await supabase.rpc('get_trigger_analysis', {
    p_user_id: userId,
  });

  if (error) {
    console.error('Error fetching trigger analysis:', error);
    throw error;
  }

  return (data || []) as TriggerAnalysis[];
}

// ============================================================================
// 5. TRIGGER MANAGEMENT
// ============================================================================

/**
 * Get all available exercise triggers
 */
export async function getExerciseTriggers(loopType?: string): Promise<TriggerOption[]> {
  let query = supabase
    .from('exercise_triggers')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  if (loopType && loopType !== 'all') {
    query = query.or(`loop_type.eq.${loopType},loop_type.eq.all`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching exercise triggers:', error);
    throw error;
  }

  return (data || []) as TriggerOption[];
}

// ============================================================================
// 6. SOFT DELETE
// ============================================================================

/**
 * Soft delete an exercise log (user privacy)
 */
export async function deleteExerciseLog(logId: string): Promise<void> {
  const { error } = await supabase
    .from('exercise_logs')
    .update({
      is_deleted: true,
      deleted_at: new Date().toISOString(),
    })
    .eq('log_id', logId);

  if (error) {
    console.error('Error deleting exercise log:', error);
    throw error;
  }
}

/**
 * Bulk soft delete all exercise logs for a user
 */
export async function deleteAllExerciseLogs(userId: string): Promise<void> {
  const { error } = await supabase
    .from('exercise_logs')
    .update({
      is_deleted: true,
      deleted_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('is_deleted', false);

  if (error) {
    console.error('Error deleting all exercise logs:', error);
    throw error;
  }
}

// ============================================================================
// 7. COMPLETION RATE QUERIES
// ============================================================================

/**
 * Get completion rate by exercise type
 */
export async function getCompletionRateByType(userId: string) {
  const { data, error } = await supabase
    .from('exercise_logs')
    .select('exercise_type, completion_status')
    .eq('user_id', userId)
    .eq('is_deleted', false);

  if (error) {
    console.error('Error fetching completion rates:', error);
    throw error;
  }

  // Group by exercise type
  const grouped = (data || []).reduce(
    (acc, item) => {
      const type = item.exercise_type;
      if (!acc[type]) {
        acc[type] = { total: 0, completed: 0, abandoned: 0, skipped: 0 };
      }
      acc[type].total++;
      if (item.completion_status === 'completed') acc[type].completed++;
      if (item.completion_status === 'abandoned') acc[type].abandoned++;
      if (item.completion_status === 'skipped') acc[type].skipped++;
      return acc;
    },
    {} as Record<string, { total: number; completed: number; abandoned: number; skipped: number }>
  );

  // Calculate rates
  return Object.entries(grouped).map(([type, stats]) => ({
    exercise_type: type as ExerciseType,
    total_sessions: stats.total,
    completed_count: stats.completed,
    abandoned_count: stats.abandoned,
    skipped_count: stats.skipped,
    completion_rate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
  }));
}

/**
 * Get completion rate by module
 */
export async function getCompletionRateByModule(userId: string) {
  const { data, error } = await supabase
    .from('exercise_logs')
    .select('module_context, completion_status')
    .eq('user_id', userId)
    .eq('is_deleted', false);

  if (error) {
    console.error('Error fetching completion rates by module:', error);
    throw error;
  }

  // Group by module
  const grouped = (data || []).reduce(
    (acc, item) => {
      const module = item.module_context;
      if (!acc[module]) {
        acc[module] = { total: 0, completed: 0, abandoned: 0, skipped: 0 };
      }
      acc[module].total++;
      if (item.completion_status === 'completed') acc[module].completed++;
      if (item.completion_status === 'abandoned') acc[module].abandoned++;
      if (item.completion_status === 'skipped') acc[module].skipped++;
      return acc;
    },
    {} as Record<string, { total: number; completed: number; abandoned: number; skipped: number }>
  );

  // Calculate rates
  return Object.entries(grouped).map(([module, stats]) => ({
    module_context: module as ModuleContext,
    total_sessions: stats.total,
    completed_count: stats.completed,
    abandoned_count: stats.abandoned,
    skipped_count: stats.skipped,
    completion_rate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
  }));
}

// ============================================================================
// 8. REAL-TIME SUBSCRIPTIONS
// ============================================================================

/**
 * Subscribe to exercise log changes for a user
 * Use case: Real-time dashboard updates
 */
export function subscribeToExerciseLogs(userId: string, callback: (payload: any) => void) {
  const subscription = supabase
    .channel('exercise-logs-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'exercise_logs',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();

  return subscription;
}

/**
 * Unsubscribe from real-time updates
 */
export function unsubscribeFromExerciseLogs(subscription: any) {
  subscription.unsubscribe();
}

// ============================================================================
// 9. UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate anxiety reduction percentage
 */
export function calculateReductionPercentage(preRating: number, postRating: number): number {
  if (preRating === 0) return 0;
  return Math.round(((preRating - postRating) / preRating) * 100);
}

/**
 * Format duration in seconds to human-readable string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Get color for anxiety rating (1-10)
 */
export function getAnxietyRatingColor(rating: number): string {
  if (rating <= 3) return 'green'; // Low anxiety
  if (rating <= 6) return 'yellow'; // Moderate anxiety
  return 'red'; // High anxiety
}

/**
 * Get emoji for anxiety reduction
 */
export function getReductionEmoji(reductionPercentage: number): string {
  if (reductionPercentage >= 50) return '🎉'; // Excellent
  if (reductionPercentage >= 30) return '✨'; // Great
  if (reductionPercentage >= 15) return '👍'; // Good
  if (reductionPercentage > 0) return '🌱'; // Some improvement
  return ''; // No improvement
}

// ============================================================================
// 10. ANALYTICS TRACKING
// ============================================================================

/**
 * Track exercise completion event
 * Use case: Send to analytics platforms (Mixpanel, Amplitude, etc.)
 */
export function trackExerciseCompletion(log: ExerciseLog) {
  // Example: Send to analytics
  // analytics.track('Exercise Completed', {
  //   exercise_type: log.exercise_type,
  //   duration_seconds: log.duration_seconds,
  //   anxiety_reduction: log.anxiety_reduction,
  //   module_context: log.module_context,
  // });
  console.log('Exercise completed:', {
    exercise_type: log.exercise_type,
    reduction_percentage: log.reduction_percentage,
  });
}

/**
 * Track exercise abandonment event
 */
export function trackExerciseAbandonment(log: ExerciseLog) {
  console.log('Exercise abandoned:', {
    exercise_type: log.exercise_type,
    abandoned_at_percentage: log.abandoned_at_percentage,
  });
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export const ExerciseLogsAPI = {
  // CRUD
  startExercise,
  completeExercise,
  abandonExercise,
  skipExercise,
  getRecentExercises,
  getExercisesByDateRange,
  getExerciseById,
  deleteExerciseLog,
  deleteAllExerciseLogs,

  // Stats & Analytics
  getUserExerciseSummary,
  getExerciseStats,
  getExerciseStreak,
  getMostEffectiveExercise,
  getMostCommonTrigger,
  getWeeklyProgress,
  getTriggerAnalysis,
  getCompletionRateByType,
  getCompletionRateByModule,

  // Triggers
  getExerciseTriggers,

  // Real-time
  subscribeToExerciseLogs,
  unsubscribeFromExerciseLogs,

  // Utilities
  calculateReductionPercentage,
  formatDuration,
  getAnxietyRatingColor,
  getReductionEmoji,
  trackExerciseCompletion,
  trackExerciseAbandonment,
};

export default ExerciseLogsAPI;
