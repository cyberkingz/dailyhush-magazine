/**
 * Analytics Queries for Nœma
 *
 * Comprehensive analytics functions for user statistics, usage patterns,
 * and progress tracking across spirals, conversations, and check-ins.
 */

import { supabase } from '../supabase';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface UserStats {
  totalSpirals: number;
  averageReduction: number;
  mostCommonTrigger: string | null;
  spiralsByDay: Array<{ day: string; count: number }>;
}

export interface UsagePatterns {
  highRiskHours: number[];
  highRiskDays: string[];
  successRate: number;
}

export interface WeeklyProgress {
  weeklySpirals: number;
  weeklyConversations: number;
  averageIntensity: number;
  trend: 'improving' | 'stable' | 'worsening';
}

export interface ConversationStats {
  totalConversations: number;
  averageReduction: number;
  completionRate: number;
  averageDuration: number;
}

export interface CheckInStats {
  totalCheckIns: number;
  averageMood: number;
  averageEnergy: number;
  averageSleep: number;
  streakDays: number;
  moodTrend: 'improving' | 'stable' | 'declining';
}

export interface ComprehensiveStats {
  spirals: {
    total: number;
    avg_duration: number;
    avg_reduction: number;
    most_common_trigger: string | null;
  };
  conversations: {
    total: number;
    avg_reduction: number;
    completion_rate: number;
  };
  check_ins: {
    total: number;
    avg_mood: number;
    avg_energy: number;
    avg_sleep: number;
    streak_days: number;
  };
  usage: {
    conversations_this_week: number;
    exercises_this_week: number;
  };
}

// ============================================================================
// USER STATISTICS
// ============================================================================

/**
 * Get comprehensive user statistics for spirals
 * @param userId - The user's UUID
 * @param days - Number of days to analyze (default: 30)
 */
export async function getUserStats(
  userId: string,
  days: number = 30
): Promise<UserStats> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get spiral statistics
  const { data: spirals, error: spiralsError } = await supabase
    .from('spiral_logs')
    .select('trigger, pre_feeling, post_feeling, timestamp')
    .eq('user_id', userId)
    .gte('timestamp', startDate.toISOString())
    .order('timestamp', { ascending: false });

  if (spiralsError) {
    console.error('Error fetching spiral stats:', spiralsError);
    throw spiralsError;
  }

  if (!spirals || spirals.length === 0) {
    return {
      totalSpirals: 0,
      averageReduction: 0,
      mostCommonTrigger: null,
      spiralsByDay: [],
    };
  }

  // Calculate average reduction
  const reductions = spirals
    .filter((s) => s.pre_feeling && s.post_feeling)
    .map((s) => s.pre_feeling - s.post_feeling);

  const averageReduction =
    reductions.length > 0
      ? reductions.reduce((a, b) => a + b, 0) / reductions.length
      : 0;

  // Find most common trigger
  const triggerCounts = spirals.reduce(
    (acc, spiral) => {
      if (spiral.trigger) {
        acc[spiral.trigger] = (acc[spiral.trigger] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  const mostCommonTrigger =
    Object.keys(triggerCounts).length > 0
      ? Object.entries(triggerCounts).sort((a, b) => b[1] - a[1])[0][0]
      : null;

  // Group spirals by day
  const spiralsByDay = spirals.reduce(
    (acc, spiral) => {
      const day = new Date(spiral.timestamp).toLocaleDateString('en-US', {
        weekday: 'short',
      });
      const existing = acc.find((item) => item.day === day);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ day, count: 1 });
      }
      return acc;
    },
    [] as Array<{ day: string; count: number }>
  );

  return {
    totalSpirals: spirals.length,
    averageReduction: Math.round(averageReduction * 10) / 10,
    mostCommonTrigger,
    spiralsByDay,
  };
}

// ============================================================================
// USAGE PATTERNS
// ============================================================================

/**
 * Analyze usage patterns to identify high-risk times and success rates
 * @param userId - The user's UUID
 * @param days - Number of days to analyze (default: 30)
 */
export async function getUsagePatterns(
  userId: string,
  days: number = 30
): Promise<UsagePatterns> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get all spirals and interventions
  const { data: spirals, error } = await supabase
    .from('spiral_logs')
    .select('timestamp, interrupted, pre_feeling, post_feeling')
    .eq('user_id', userId)
    .gte('timestamp', startDate.toISOString());

  if (error) {
    console.error('Error fetching usage patterns:', error);
    throw error;
  }

  if (!spirals || spirals.length === 0) {
    return {
      highRiskHours: [],
      highRiskDays: [],
      successRate: 0,
    };
  }

  // Analyze high-risk hours
  const hourCounts = spirals.reduce(
    (acc, spiral) => {
      const hour = new Date(spiral.timestamp).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  const avgCount = Object.values(hourCounts).reduce((a, b) => a + b, 0) / 24;
  const highRiskHours = Object.entries(hourCounts)
    .filter(([_, count]) => count > avgCount * 1.5)
    .map(([hour, _]) => parseInt(hour))
    .sort((a, b) => a - b);

  // Analyze high-risk days
  const dayCounts = spirals.reduce(
    (acc, spiral) => {
      const day = new Date(spiral.timestamp).toLocaleDateString('en-US', {
        weekday: 'long',
      });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const avgDayCount = Object.values(dayCounts).reduce((a, b) => a + b, 0) / 7;
  const highRiskDays = Object.entries(dayCounts)
    .filter(([_, count]) => count > avgDayCount * 1.3)
    .map(([day, _]) => day)
    .sort();

  // Calculate success rate (interrupted spirals with improvement)
  const successfulInterventions = spirals.filter(
    (s) => s.interrupted && s.pre_feeling && s.post_feeling && s.post_feeling < s.pre_feeling
  ).length;

  const totalInterventions = spirals.filter((s) => s.interrupted).length;
  const successRate =
    totalInterventions > 0
      ? Math.round((successfulInterventions / totalInterventions) * 100)
      : 0;

  return {
    highRiskHours,
    highRiskDays,
    successRate,
  };
}

// ============================================================================
// WEEKLY PROGRESS
// ============================================================================

/**
 * Get weekly progress summary with trend analysis
 * @param userId - The user's UUID
 */
export async function getWeeklyProgress(userId: string): Promise<WeeklyProgress> {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - 7);

  const lastWeekStart = new Date(weekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  // Get this week's spirals
  const { data: thisWeekSpirals, error: thisWeekError } = await supabase
    .from('spiral_logs')
    .select('pre_feeling, post_feeling')
    .eq('user_id', userId)
    .gte('timestamp', weekStart.toISOString());

  // Get last week's spirals for comparison
  const { data: lastWeekSpirals, error: lastWeekError } = await supabase
    .from('spiral_logs')
    .select('pre_feeling, post_feeling')
    .eq('user_id', userId)
    .gte('timestamp', lastWeekStart.toISOString())
    .lt('timestamp', weekStart.toISOString());

  // Get this week's conversations
  const { data: thisWeekConversations, error: convError } = await supabase
    .from('ai_sessions')
    .select('session_id')
    .eq('user_id', userId)
    .gte('timestamp', weekStart.toISOString());

  if (thisWeekError || lastWeekError || convError) {
    console.error('Error fetching weekly progress:', {
      thisWeekError,
      lastWeekError,
      convError,
    });
    throw thisWeekError || lastWeekError || convError;
  }

  const weeklySpirals = thisWeekSpirals?.length || 0;
  const weeklyConversations = thisWeekConversations?.length || 0;

  // Calculate average intensity (pre_feeling)
  const thisWeekIntensities = thisWeekSpirals
    ?.filter((s) => s.pre_feeling)
    .map((s) => s.pre_feeling) || [];

  const averageIntensity =
    thisWeekIntensities.length > 0
      ? thisWeekIntensities.reduce((a, b) => a + b, 0) / thisWeekIntensities.length
      : 0;

  // Calculate trend
  const lastWeekIntensities = lastWeekSpirals
    ?.filter((s) => s.pre_feeling)
    .map((s) => s.pre_feeling) || [];

  const lastWeekAvg =
    lastWeekIntensities.length > 0
      ? lastWeekIntensities.reduce((a, b) => a + b, 0) / lastWeekIntensities.length
      : averageIntensity;

  let trend: 'improving' | 'stable' | 'worsening' = 'stable';
  const difference = lastWeekAvg - averageIntensity;

  if (difference > 0.5) {
    trend = 'improving'; // Intensity decreased = improvement
  } else if (difference < -0.5) {
    trend = 'worsening'; // Intensity increased
  }

  return {
    weeklySpirals,
    weeklyConversations,
    averageIntensity: Math.round(averageIntensity * 10) / 10,
    trend,
  };
}

// ============================================================================
// CONVERSATION STATISTICS
// ============================================================================

/**
 * Get detailed conversation/AI session statistics
 * @param userId - The user's UUID
 * @param days - Number of days to analyze (default: 30)
 */
export async function getConversationStats(
  userId: string,
  days: number = 30
): Promise<ConversationStats> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('ai_sessions')
    .select('reduction_percentage, exercise_completed, session_duration_seconds')
    .eq('user_id', userId)
    .gte('timestamp', startDate.toISOString());

  if (error) {
    console.error('Error fetching conversation stats:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return {
      totalConversations: 0,
      averageReduction: 0,
      completionRate: 0,
      averageDuration: 0,
    };
  }

  const totalConversations = data.length;

  const reductions = data
    .filter((s) => s.reduction_percentage !== null)
    .map((s) => s.reduction_percentage);

  const averageReduction =
    reductions.length > 0 ? reductions.reduce((a, b) => a + b, 0) / reductions.length : 0;

  const completedCount = data.filter((s) => s.exercise_completed).length;
  const completionRate = (completedCount / totalConversations) * 100;

  const durations = data
    .filter((s) => s.session_duration_seconds !== null)
    .map((s) => s.session_duration_seconds);

  const averageDuration =
    durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;

  return {
    totalConversations,
    averageReduction: Math.round(averageReduction * 10) / 10,
    completionRate: Math.round(completionRate),
    averageDuration: Math.round(averageDuration),
  };
}

// ============================================================================
// CHECK-IN STATISTICS
// ============================================================================

/**
 * Get daily check-in statistics and trends
 * @param userId - The user's UUID
 * @param days - Number of days to analyze (default: 30)
 */
export async function getCheckInStats(
  userId: string,
  days: number = 30
): Promise<CheckInStats> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('daily_check_ins')
    .select('mood_rating, energy_level, sleep_quality, check_in_date')
    .eq('user_id', userId)
    .gte('check_in_date', startDate.toISOString().split('T')[0])
    .order('check_in_date', { ascending: false });

  if (error) {
    console.error('Error fetching check-in stats:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return {
      totalCheckIns: 0,
      averageMood: 0,
      averageEnergy: 0,
      averageSleep: 0,
      streakDays: 0,
      moodTrend: 'stable',
    };
  }

  const totalCheckIns = data.length;

  // Calculate averages
  const moods = data.filter((d) => d.mood_rating).map((d) => d.mood_rating);
  const energies = data.filter((d) => d.energy_level).map((d) => d.energy_level);
  const sleeps = data.filter((d) => d.sleep_quality).map((d) => d.sleep_quality);

  const averageMood = moods.length > 0 ? moods.reduce((a, b) => a + b, 0) / moods.length : 0;
  const averageEnergy =
    energies.length > 0 ? energies.reduce((a, b) => a + b, 0) / energies.length : 0;
  const averageSleep =
    sleeps.length > 0 ? sleeps.reduce((a, b) => a + b, 0) / sleeps.length : 0;

  // Calculate streak
  let streakDays = 0;
  const today = new Date().toISOString().split('T')[0];
  let checkDate = new Date();

  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toISOString().split('T')[0];
    const hasCheckIn = data.some((d) => d.check_in_date === dateStr);

    if (hasCheckIn) {
      streakDays++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Only break if it's not today (user might not have checked in yet today)
      if (dateStr !== today) {
        break;
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  // Calculate mood trend (compare first half vs second half)
  const midpoint = Math.floor(data.length / 2);
  const recentMoods = data.slice(0, midpoint).map((d) => d.mood_rating);
  const olderMoods = data.slice(midpoint).map((d) => d.mood_rating);

  const recentAvg =
    recentMoods.length > 0 ? recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length : 0;
  const olderAvg =
    olderMoods.length > 0 ? olderMoods.reduce((a, b) => a + b, 0) / olderMoods.length : 0;

  let moodTrend: 'improving' | 'stable' | 'declining' = 'stable';
  const moodDifference = recentAvg - olderAvg;

  if (moodDifference > 0.5) {
    moodTrend = 'improving';
  } else if (moodDifference < -0.5) {
    moodTrend = 'declining';
  }

  return {
    totalCheckIns,
    averageMood: Math.round(averageMood * 10) / 10,
    averageEnergy: Math.round(averageEnergy * 10) / 10,
    averageSleep: Math.round(averageSleep * 10) / 10,
    streakDays,
    moodTrend,
  };
}

// ============================================================================
// COMPREHENSIVE STATISTICS (uses DB function)
// ============================================================================

/**
 * Get comprehensive statistics using the database function
 * This is more efficient than multiple queries
 * @param userId - The user's UUID
 * @param days - Number of days to analyze (default: 30)
 */
export async function getComprehensiveStats(
  userId: string,
  days: number = 30
): Promise<ComprehensiveStats> {
  const { data, error } = await supabase.rpc('get_comprehensive_user_stats', {
    p_user_id: userId,
    p_days: days,
  });

  if (error) {
    console.error('Error fetching comprehensive stats:', error);
    throw error;
  }

  return data as ComprehensiveStats;
}

// ============================================================================
// REAL-TIME SUBSCRIPTIONS
// ============================================================================

/**
 * Subscribe to real-time updates for spiral logs
 * @param userId - The user's UUID
 * @param callback - Function to call when data changes
 */
export function subscribeToSpiralUpdates(
  userId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`spiral-updates-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'spiral_logs',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
}

/**
 * Subscribe to real-time updates for AI sessions
 * @param userId - The user's UUID
 * @param callback - Function to call when data changes
 */
export function subscribeToConversationUpdates(
  userId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`conversation-updates-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'ai_sessions',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
}

/**
 * Subscribe to real-time updates for daily check-ins
 * @param userId - The user's UUID
 * @param callback - Function to call when data changes
 */
export function subscribeToCheckInUpdates(
  userId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`check-in-updates-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'daily_check_ins',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
}
