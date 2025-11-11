/**
 * Nœma - Insights Service
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
    const currentWeekLogs = spiralLogs.filter((log) => new Date(log.timestamp) >= sevenDaysAgo);
    const previousWeekLogs = spiralLogs.filter(
      (log) => new Date(log.timestamp) < sevenDaysAgo && new Date(log.timestamp) >= fourteenDaysAgo
    );

    // Calculate metrics for current week
    const totalSpirals = currentWeekLogs.length;
    const spiralsPrevented = currentWeekLogs.filter((log) => log.interrupted).length;

    // Calculate average duration
    const totalDuration = currentWeekLogs.reduce((sum, log) => sum + log.duration_seconds, 0);
    const avgDuration = totalSpirals > 0 ? Math.round(totalDuration / totalSpirals) : 0;

    // Find most common trigger
    const triggerCounts = new Map<string, number>();
    currentWeekLogs.forEach((log) => {
      if (log.trigger) {
        triggerCounts.set(log.trigger, (triggerCounts.get(log.trigger) || 0) + 1);
      }
    });
    const mostCommonTrigger =
      triggerCounts.size > 0
        ? Array.from(triggerCounts.entries()).sort((a, b) => b[1] - a[1])[0][0]
        : null;

    // Find peak time (hour with most spirals)
    const hourCounts = new Map<number, number>();
    currentWeekLogs.forEach((log) => {
      const hour = new Date(log.timestamp).getHours();
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    });
    const peakHour =
      hourCounts.size > 0
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
 * Uses healing-focused, shame-free language
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

  // Insight 1: Interruption success rate - HEALING-FOCUSED
  if (metrics.totalSpirals > 0) {
    const interruptionRate = Math.round((metrics.spiralsPrevented / metrics.totalSpirals) * 100);
    if (interruptionRate >= 70) {
      insights.push(
        `You notice and respond ${interruptionRate}% of the time. Your awareness is growing.`
      );
    } else if (interruptionRate >= 40) {
      insights.push(
        `You're catching spirals ${interruptionRate}% of the time. Each notice builds the skill.`
      );
    } else if (metrics.spiralsPrevented > 0) {
      insights.push(
        `You've practiced F.I.R.E. ${metrics.spiralsPrevented} time${metrics.spiralsPrevented > 1 ? 's' : ''}. Noticing is the first step.`
      );
    } else {
      insights.push('Each time you log a spiral, you build awareness. That itself is healing.');
    }
  }

  // Insight 2: Peak time pattern - NON-JUDGMENTAL
  if (metrics.peakTime) {
    const hour = parseInt(metrics.peakTime.split(':')[0]);
    const isPM = metrics.peakTime.includes('PM');
    const actualHour = isPM && hour !== 12 ? hour + 12 : hour === 12 && !isPM ? 0 : hour;

    if (actualHour >= 5 && actualHour < 9) {
      insights.push(
        `Mornings around ${metrics.peakTime} show a pattern. Consider gentler morning routines.`
      );
    } else if (actualHour >= 20 || actualHour < 5) {
      insights.push(`Evening patterns around ${metrics.peakTime}. Your mind may need rest.`);
    } else if (actualHour >= 9 && actualHour < 12) {
      insights.push(
        `Late morning patterns around ${metrics.peakTime}. Notice what happens before.`
      );
    } else {
      insights.push(`Patterns appear around ${metrics.peakTime}. Awareness helps you prepare.`);
    }
  }

  // Insight 3: Trigger pattern - EMPOWERING
  if (metrics.mostCommonTrigger) {
    insights.push(`"${metrics.mostCommonTrigger}" appears often. Naming it helps you prepare.`);
  }

  // Insight 4: Shift necklace usage - LESS PROMOTIONAL
  const shiftUsageCount = logs.filter((log) => log.used_shift).length;
  if (shiftUsageCount > 0) {
    insights.push(
      `Physical grounding helped ${shiftUsageCount} time${shiftUsageCount > 1 ? 's' : ''} this week.`
    );
  }

  // Insight 5: Feeling improvement - WARM LANGUAGE
  const logsWithFeelings = logs.filter((log) => log.pre_feeling && log.post_feeling);
  if (logsWithFeelings.length > 0) {
    const avgImprovement =
      logsWithFeelings.reduce((sum, log) => sum + (log.post_feeling - log.pre_feeling), 0) /
      logsWithFeelings.length;
    if (avgImprovement > 2) {
      insights.push('You feel better after interrupting spirals. The practice is working.');
    } else if (avgImprovement > 0) {
      insights.push("Small improvements add up. You're rewiring the pattern.");
    }
  }

  // Insight 6: Location patterns - PRIVACY-CONSCIOUS
  // Skip private spaces like bedroom, bathroom, bed
  const locationCounts = new Map<string, number>();
  logs.forEach((log) => {
    if (log.location) {
      const location = log.location.toLowerCase();
      // Only include location if it's not private/invasive
      if (!['bedroom', 'bathroom', 'bed', 'home'].includes(location)) {
        locationCounts.set(log.location, (locationCounts.get(log.location) || 0) + 1);
      }
    }
  });
  if (locationCounts.size > 0) {
    const topLocation = Array.from(locationCounts.entries()).sort((a, b) => b[1] - a[1])[0][0];
    insights.push(`${topLocation} appears in your patterns. Environment affects us.`);
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
