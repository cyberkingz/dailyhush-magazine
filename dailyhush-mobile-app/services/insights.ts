/**
 * DailyHush - Insights Service
 * Fetch and aggregate spiral pattern data for user insights
 */

import { supabase } from '@/utils/supabase';

export interface WeeklyInsights {
  totalSpirals: number;
  spiralsPrevented: number;
  avgDuration: number; // seconds
  mostCommonTrigger: string | null;
  peakTime: string | null;
  improvementVsLastWeek: number; // percentage
  insights: string[];
}

export interface SpiralLog {
  spiral_id: string;
  user_id: string;
  timestamp: string;
  trigger: string | null;
  duration_seconds: number;
  interrupted: boolean;
  pre_feeling: number;
  post_feeling: number;
  used_shift: boolean;
  technique_used: string;
  location: string | null;
  notes: string | null;
}

/**
 * Get weekly insights for the current user
 * Aggregates spiral logs from the last 7 days
 */
export async function getWeeklyInsights(
  userId: string
): Promise<{ success: boolean; data?: WeeklyInsights; error?: string }> {
  try {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    // Calculate date range for current week
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Also get data from previous week for comparison
    const fourteenDaysAgo = new Date(today);
    fourteenDaysAgo.setDate(today.getDate() - 14);

    // Fetch spiral logs for the last 14 days (current week + previous week)
    const { data: spiralLogs, error } = await supabase
      .from('spiral_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('timestamp', fourteenDaysAgo.toISOString())
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching spiral logs:', error);
      return { success: false, error: error.message };
    }

    if (!spiralLogs || spiralLogs.length === 0) {
      // No data yet - return empty insights
      return {
        success: true,
        data: {
          totalSpirals: 0,
          spiralsPrevented: 0,
          avgDuration: 0,
          mostCommonTrigger: null,
          peakTime: null,
          improvementVsLastWeek: 0,
          insights: [],
        },
      };
    }

    // Split logs into current week and previous week
    const currentWeekLogs = spiralLogs.filter(
      (log) => new Date(log.timestamp) >= sevenDaysAgo
    );
    const previousWeekLogs = spiralLogs.filter(
      (log) =>
        new Date(log.timestamp) < sevenDaysAgo &&
        new Date(log.timestamp) >= fourteenDaysAgo
    );

    // Calculate metrics for current week
    const totalSpirals = currentWeekLogs.length;
    const spiralsPrevented = currentWeekLogs.filter((log) => log.interrupted).length;

    // Calculate average duration
    const totalDuration = currentWeekLogs.reduce(
      (sum, log) => sum + log.duration_seconds,
      0
    );
    const avgDuration = totalSpirals > 0 ? Math.round(totalDuration / totalSpirals) : 0;

    // Find most common trigger
    const triggerCounts = new Map<string, number>();
    currentWeekLogs.forEach((log) => {
      if (log.trigger) {
        triggerCounts.set(log.trigger, (triggerCounts.get(log.trigger) || 0) + 1);
      }
    });
    const mostCommonTrigger = triggerCounts.size > 0
      ? Array.from(triggerCounts.entries()).sort((a, b) => b[1] - a[1])[0][0]
      : null;

    // Find peak time (hour with most spirals)
    const hourCounts = new Map<number, number>();
    currentWeekLogs.forEach((log) => {
      const hour = new Date(log.timestamp).getHours();
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    });
    const peakHour = hourCounts.size > 0
      ? Array.from(hourCounts.entries()).sort((a, b) => b[1] - a[1])[0][0]
      : null;
    const peakTime = peakHour !== null ? formatHour(peakHour) : null;

    // Calculate improvement vs last week
    const previousWeekTotal = previousWeekLogs.length;
    let improvementVsLastWeek = 0;
    if (previousWeekTotal > 0) {
      improvementVsLastWeek = Math.round(
        ((previousWeekTotal - totalSpirals) / previousWeekTotal) * 100
      );
    }

    // Generate insights based on patterns
    const insights = generateInsights(currentWeekLogs, {
      spiralsPrevented,
      totalSpirals,
      avgDuration,
      peakTime,
      mostCommonTrigger,
    });

    return {
      success: true,
      data: {
        totalSpirals,
        spiralsPrevented,
        avgDuration,
        mostCommonTrigger,
        peakTime,
        improvementVsLastWeek,
        insights,
      },
    };
  } catch (error: any) {
    console.error('Error in getWeeklyInsights:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all spiral logs for a user
 */
export async function getSpiralLogs(
  userId: string,
  limit = 50
): Promise<{ success: boolean; data?: SpiralLog[]; error?: string }> {
  try {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    const { data, error } = await supabase
      .from('spiral_logs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching spiral logs:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error('Error in getSpiralLogs:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Save or update weekly pattern insights
 * This is called automatically after each spiral log is recorded
 */
export async function savePatternInsights(
  userId: string,
  weekStart: string,
  insights: Omit<WeeklyInsights, 'insights'> & { insights: string[] }
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    const { error } = await supabase.from('pattern_insights').upsert(
      {
        user_id: userId,
        week_start: weekStart,
        total_spirals: insights.totalSpirals,
        spirals_prevented: insights.spiralsPrevented,
        avg_duration_seconds: insights.avgDuration,
        most_common_trigger: insights.mostCommonTrigger,
        peak_time: insights.peakTime,
        improvement_vs_last_week: insights.improvementVsLastWeek,
        insights: insights.insights,
      },
      {
        onConflict: 'user_id,week_start',
      }
    );

    if (error) {
      console.error('Error saving pattern insights:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in savePatternInsights:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate insights based on spiral patterns
 */
function generateInsights(
  logs: any[],
  metrics: {
    spiralsPrevented: number;
    totalSpirals: number;
    avgDuration: number;
    peakTime: string | null;
    mostCommonTrigger: string | null;
  }
): string[] {
  const insights: string[] = [];

  // Insight 1: Interruption success rate
  if (metrics.totalSpirals > 0) {
    const interruptionRate = Math.round(
      (metrics.spiralsPrevented / metrics.totalSpirals) * 100
    );
    if (interruptionRate >= 70) {
      insights.push(`You're successfully interrupting ${interruptionRate}% of your spirals`);
    } else if (interruptionRate >= 40) {
      insights.push(`You interrupted ${interruptionRate}% of spirals this week - keep practicing`);
    } else {
      insights.push('Try using the F.I.R.E. technique when you notice a spiral starting');
    }
  }

  // Insight 2: Peak time pattern
  if (metrics.peakTime) {
    if (metrics.peakTime.includes('AM')) {
      insights.push(`Early morning (${metrics.peakTime}) is your most challenging time`);
    } else if (
      metrics.peakTime.includes('10') ||
      metrics.peakTime.includes('11') ||
      metrics.peakTime === '12:00 PM'
    ) {
      insights.push(`Late morning spirals may be related to stress or fatigue`);
    } else {
      insights.push(`Most spirals happen around ${metrics.peakTime}`);
    }
  }

  // Insight 3: Trigger pattern
  if (metrics.mostCommonTrigger) {
    insights.push(`"${metrics.mostCommonTrigger}" is your most common trigger`);
  }

  // Insight 4: Shift necklace usage
  const shiftUsageCount = logs.filter((log) => log.used_shift).length;
  if (shiftUsageCount > 0) {
    insights.push(`The Shift necklace helped you ${shiftUsageCount} time${shiftUsageCount > 1 ? 's' : ''} this week`);
  }

  // Insight 5: Feeling improvement
  const logsWithFeelings = logs.filter(
    (log) => log.pre_feeling && log.post_feeling
  );
  if (logsWithFeelings.length > 0) {
    const avgImprovement =
      logsWithFeelings.reduce(
        (sum, log) => sum + (log.post_feeling - log.pre_feeling),
        0
      ) / logsWithFeelings.length;
    if (avgImprovement > 2) {
      insights.push('Your mood consistently improves after interventions');
    } else if (avgImprovement > 0) {
      insights.push('Interventions are helping improve your mood');
    }
  }

  // Insight 6: Location patterns
  const locationCounts = new Map<string, number>();
  logs.forEach((log) => {
    if (log.location) {
      locationCounts.set(log.location, (locationCounts.get(log.location) || 0) + 1);
    }
  });
  if (locationCounts.size > 0) {
    const topLocation = Array.from(locationCounts.entries()).sort(
      (a, b) => b[1] - a[1]
    )[0][0];
    insights.push(`You spiral most often in ${topLocation}`);
  }

  // Return top 3-4 most relevant insights
  return insights.slice(0, 4);
}

/**
 * Format hour (0-23) to 12-hour time string
 */
function formatHour(hour: number): string {
  if (hour === 0) return '12:00 AM';
  if (hour === 12) return '12:00 PM';
  if (hour < 12) return `${hour}:00 AM`;
  return `${hour - 12}:00 PM`;
}
