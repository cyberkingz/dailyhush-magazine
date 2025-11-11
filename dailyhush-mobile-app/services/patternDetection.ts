/**
 * Nœma - Pattern Detection Service
 *
 * Analyzes user's spiral history to identify patterns using simple SQL queries.
 * NO machine learning - just aggregations (GROUP BY, COUNT, AVG).
 *
 * Features:
 * - Peak spiral time detection (what hour spirals occur most)
 * - Common trigger identification (which triggers cause most spirals)
 * - Technique effectiveness rankings (which techniques work best)
 * - Early detection metrics (are they catching spirals early?)
 * - Weekly averages and trends
 *
 * Algorithm:
 * - All analysis done via SQL aggregations
 * - Minimum data requirements to avoid false patterns
 * - Graceful handling of new users with no history
 * - Results optimized for insights screen display
 */

import { supabase } from '@/utils/supabase';
import { withRetry } from '@/utils/retry';
import { TECHNIQUE_LIBRARY, getTechniqueById } from '@/constants/techniqueLibrary';
import type { SpiralPattern } from '@/types';

// ============================================================================
// PATTERN DETECTION CONSTANTS
// ============================================================================

const PATTERN_DETECTION_CONSTANTS = {
  DEFAULT_DAYS_BACK: 30, // Default lookback period
  EARLY_DETECTION_THRESHOLD: 5, // Intensity level considered "early"
  MIN_SPIRALS_FOR_PATTERN: 3, // Need at least 3 spirals to detect pattern
  SUCCESS_REDUCTION_THRESHOLD: 2, // 2+ point reduction = success
  DAYS_PER_WEEK: 7, // For calculating weekly averages
} as const;

// ============================================================================
// MAIN PATTERN DETECTION FUNCTION
// ============================================================================

/**
 * Analyzes user's spiral history to detect patterns
 *
 * Performs comprehensive pattern analysis including:
 * - Peak spiral time (hour of day when most spirals occur)
 * - Most common trigger (trigger with highest count)
 * - Average spirals per week (trend over time)
 * - Most effective technique (highest avg reduction)
 * - Early detection rate (% caught at intensity 5+)
 *
 * @param userId - User's ID
 * @param daysBack - How many days of history to analyze (default 30)
 * @returns SpiralPattern object with detected patterns
 *
 * @example
 * const patterns = await detectSpiralPatterns('user-123', 30);
 * console.log(`Peak time: ${patterns.peakTime}:00`); // "3:00"
 * console.log(`Common trigger: ${patterns.mostCommonTrigger}`); // "conversations"
 * console.log(`Avg spirals/week: ${patterns.avgSpiralsPerWeek}`); // 4.2
 * console.log(`Best technique: ${patterns.mostEffectiveTechnique}`); // "Box Breathing"
 * console.log(`Early detection: ${patterns.earlyDetectionRate}%`); // 65%
 */
export async function detectSpiralPatterns(
  userId: string,
  daysBack: number = PATTERN_DETECTION_CONSTANTS.DEFAULT_DAYS_BACK
): Promise<SpiralPattern> {
  try {
    console.log('[PatternDetection] Starting pattern analysis:', {
      userId,
      daysBack,
    });

    // Validate daysBack parameter
    if (daysBack < 1) {
      throw new Error(`Invalid daysBack: ${daysBack}. Must be at least 1.`);
    }

    // Execute all pattern queries in parallel for performance
    const [
      peakTime,
      mostCommonTrigger,
      avgSpiralsPerWeek,
      mostEffectiveTechnique,
      earlyDetectionRate,
    ] = await Promise.all([
      getPeakSpiralTime(userId, daysBack),
      getMostCommonTrigger(userId, daysBack),
      getAvgSpiralsPerWeek(userId, daysBack),
      getMostEffectiveTechniqueName(userId),
      getEarlyDetectionRate(userId, daysBack),
    ]);

    const patterns: SpiralPattern = {
      peakTime,
      mostCommonTrigger,
      avgSpiralsPerWeek,
      mostEffectiveTechnique,
      earlyDetectionRate,
    };

    console.log('[PatternDetection] Pattern analysis complete:', patterns);
    return patterns;
  } catch (error) {
    console.error('[PatternDetection] Pattern detection failed:', error);
    throw error;
  }
}

// ============================================================================
// PEAK SPIRAL TIME DETECTION
// ============================================================================

/**
 * Gets the hour of day when user spirals most frequently
 *
 * Extracts hour from timestamp, groups by hour, and finds the hour
 * with the highest spiral count. Returns null if insufficient data.
 *
 * SQL approach:
 * - EXTRACT(HOUR FROM timestamp) to get hour (0-23)
 * - GROUP BY hour
 * - ORDER BY count DESC
 * - LIMIT 1
 *
 * @param userId - User's ID
 * @param daysBack - Days of history to analyze
 * @returns Hour (0-23) or null if no data
 *
 * @example
 * const peakTime = await getPeakSpiralTime('user-123', 30);
 * if (peakTime !== null) {
 *   console.log(`You tend to spiral around ${peakTime}:00`);
 *   // "You tend to spiral around 3:00"
 * }
 */
export async function getPeakSpiralTime(
  userId: string,
  daysBack: number = PATTERN_DETECTION_CONSTANTS.DEFAULT_DAYS_BACK
): Promise<number | null> {
  try {
    console.log('[PatternDetection] Detecting peak spiral time:', { userId, daysBack });

    // Query to get hour with most spirals
    const { data, error } = await withRetry(
      () =>
        supabase.rpc('get_peak_spiral_hour', {
          p_user_id: userId,
          p_days_back: daysBack,
        }),
      {
        maxRetries: 3,
        onRetry: (attempt) => {
          console.log(`[PatternDetection] Retry attempt ${attempt} for getPeakSpiralTime`);
        },
      }
    );

    if (error) {
      // If RPC function doesn't exist, fall back to direct query
      console.log('[PatternDetection] RPC not found, using direct query');
      return await getPeakSpiralTimeDirect(userId, daysBack);
    }

    if (!data || data.length === 0) {
      console.log('[PatternDetection] No peak time data found');
      return null;
    }

    const peakHour = data[0]?.hour;
    console.log(`[PatternDetection] Peak spiral time: ${peakHour}:00`);
    return peakHour !== undefined ? peakHour : null;
  } catch (error) {
    console.error('[PatternDetection] getPeakSpiralTime failed:', error);
    // Try direct query as fallback
    return await getPeakSpiralTimeDirect(userId, daysBack);
  }
}

/**
 * Direct query fallback for peak spiral time
 * Uses client-side extraction if RPC not available
 */
async function getPeakSpiralTimeDirect(
  userId: string,
  daysBack: number
): Promise<number | null> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    const { data, error } = await withRetry(
      () =>
        supabase
          .from('spiral_logs')
          .select('timestamp')
          .eq('user_id', userId)
          .gte('timestamp', cutoffDate.toISOString()),
      {
        maxRetries: 3,
        onRetry: (attempt) => {
          console.log(
            `[PatternDetection] Retry attempt ${attempt} for getPeakSpiralTimeDirect`
          );
        },
      }
    );

    if (error) {
      console.error('[PatternDetection] Error fetching spiral timestamps:', error);
      throw new Error(`Failed to fetch spiral timestamps: ${error.message}`);
    }

    if (!data || data.length < PATTERN_DETECTION_CONSTANTS.MIN_SPIRALS_FOR_PATTERN) {
      console.log('[PatternDetection] Insufficient data for peak time detection');
      return null;
    }

    // Extract hours and count occurrences
    const hourCounts = new Map<number, number>();
    data.forEach((log) => {
      const hour = new Date(log.timestamp).getHours();
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    });

    // Find hour with maximum count
    let maxHour = 0;
    let maxCount = 0;
    hourCounts.forEach((count, hour) => {
      if (count > maxCount) {
        maxCount = count;
        maxHour = hour;
      }
    });

    console.log(`[PatternDetection] Peak spiral time (direct): ${maxHour}:00 (${maxCount} spirals)`);
    return maxHour;
  } catch (error) {
    console.error('[PatternDetection] getPeakSpiralTimeDirect failed:', error);
    return null;
  }
}

// ============================================================================
// TRIGGER PATTERN DETECTION
// ============================================================================

/**
 * Gets the trigger that causes spirals most frequently
 *
 * Groups spirals by trigger and returns the trigger with highest count.
 * Filters out null triggers.
 *
 * SQL approach:
 * - GROUP BY trigger
 * - WHERE trigger IS NOT NULL
 * - ORDER BY count DESC
 * - LIMIT 1
 *
 * @param userId - User's ID
 * @param daysBack - Days of history to analyze
 * @returns Trigger string or null if no data
 *
 * @example
 * const trigger = await getMostCommonTrigger('user-123', 30);
 * if (trigger) {
 *   console.log(`Your most common trigger is: ${trigger}`);
 *   // "Your most common trigger is: conversations"
 * }
 */
export async function getMostCommonTrigger(
  userId: string,
  daysBack: number = PATTERN_DETECTION_CONSTANTS.DEFAULT_DAYS_BACK
): Promise<string | null> {
  try {
    console.log('[PatternDetection] Detecting most common trigger:', { userId, daysBack });

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    const { data, error } = await withRetry(
      () =>
        supabase
          .from('spiral_logs')
          .select('trigger')
          .eq('user_id', userId)
          .gte('timestamp', cutoffDate.toISOString())
          .not('trigger', 'is', null),
      {
        maxRetries: 3,
        onRetry: (attempt) => {
          console.log(`[PatternDetection] Retry attempt ${attempt} for getMostCommonTrigger`);
        },
      }
    );

    if (error) {
      console.error('[PatternDetection] Error fetching triggers:', error);
      throw new Error(`Failed to fetch triggers: ${error.message}`);
    }

    if (!data || data.length < PATTERN_DETECTION_CONSTANTS.MIN_SPIRALS_FOR_PATTERN) {
      console.log('[PatternDetection] Insufficient trigger data');
      return null;
    }

    // Count trigger occurrences
    const triggerCounts = new Map<string, number>();
    data.forEach((log) => {
      if (log.trigger) {
        triggerCounts.set(log.trigger, (triggerCounts.get(log.trigger) || 0) + 1);
      }
    });

    // Find trigger with maximum count
    let maxTrigger: string | null = null;
    let maxCount = 0;
    triggerCounts.forEach((count, trigger) => {
      if (count > maxCount) {
        maxCount = count;
        maxTrigger = trigger;
      }
    });

    console.log(
      `[PatternDetection] Most common trigger: ${maxTrigger} (${maxCount} occurrences)`
    );
    return maxTrigger;
  } catch (error) {
    console.error('[PatternDetection] getMostCommonTrigger failed:', error);
    return null;
  }
}

// ============================================================================
// WEEKLY AVERAGE CALCULATION
// ============================================================================

/**
 * Calculates average number of spirals per week
 *
 * Counts total spirals in period, divides by number of weeks.
 * Used to track frequency trends over time.
 *
 * @param userId - User's ID
 * @param daysBack - Days of history to analyze
 * @returns Average spirals per week (rounded to 1 decimal)
 *
 * @example
 * const avgPerWeek = await getAvgSpiralsPerWeek('user-123', 30);
 * console.log(`You average ${avgPerWeek} spirals per week`);
 * // "You average 4.2 spirals per week"
 */
async function getAvgSpiralsPerWeek(
  userId: string,
  daysBack: number
): Promise<number> {
  try {
    console.log('[PatternDetection] Calculating avg spirals per week:', { userId, daysBack });

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    const { data, error } = await withRetry(
      () =>
        supabase
          .from('spiral_logs')
          .select('spiral_id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('timestamp', cutoffDate.toISOString()),
      {
        maxRetries: 3,
        onRetry: (attempt) => {
          console.log(`[PatternDetection] Retry attempt ${attempt} for getAvgSpiralsPerWeek`);
        },
      }
    );

    if (error) {
      console.error('[PatternDetection] Error counting spirals:', error);
      throw new Error(`Failed to count spirals: ${error.message}`);
    }

    const totalSpirals = data?.count || 0;
    const weeks = daysBack / PATTERN_DETECTION_CONSTANTS.DAYS_PER_WEEK;
    const avgPerWeek = weeks > 0 ? totalSpirals / weeks : 0;

    // Round to 1 decimal place
    const rounded = Math.round(avgPerWeek * 10) / 10;
    console.log(
      `[PatternDetection] Avg spirals per week: ${rounded} (${totalSpirals} spirals / ${weeks.toFixed(1)} weeks)`
    );
    return rounded;
  } catch (error) {
    console.error('[PatternDetection] getAvgSpiralsPerWeek failed:', error);
    return 0;
  }
}

// ============================================================================
// TECHNIQUE EFFECTIVENESS ANALYSIS
// ============================================================================

/**
 * Gets the name of the most effective technique for this user
 *
 * Queries user_technique_stats for technique with highest avg_reduction,
 * then looks up the technique name from TECHNIQUE_LIBRARY.
 *
 * @param userId - User's ID
 * @returns Technique name or null if no usage data
 *
 * @example
 * const bestTechnique = await getMostEffectiveTechniqueName('user-123');
 * console.log(`Your most effective technique: ${bestTechnique}`);
 * // "Your most effective technique: Box Breathing"
 */
async function getMostEffectiveTechniqueName(userId: string): Promise<string | null> {
  try {
    console.log('[PatternDetection] Finding most effective technique:', { userId });

    const { data, error } = await withRetry(
      () =>
        supabase
          .from('user_technique_stats')
          .select('technique_id, avg_reduction, times_used')
          .eq('user_id', userId)
          .gt('times_used', 0)
          .order('avg_reduction', { ascending: false })
          .limit(1),
      {
        maxRetries: 3,
        onRetry: (attempt) => {
          console.log(
            `[PatternDetection] Retry attempt ${attempt} for getMostEffectiveTechniqueName`
          );
        },
      }
    );

    if (error) {
      console.error('[PatternDetection] Error fetching technique stats:', error);
      throw new Error(`Failed to fetch technique stats: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log('[PatternDetection] No technique usage data found');
      return null;
    }

    const bestTechniqueId = data[0].technique_id;
    const technique = getTechniqueById(bestTechniqueId);

    const techniqueName = technique ? technique.shortName : bestTechniqueId;
    console.log(
      `[PatternDetection] Most effective technique: ${techniqueName} (avg reduction: ${data[0].avg_reduction})`
    );
    return techniqueName;
  } catch (error) {
    console.error('[PatternDetection] getMostEffectiveTechniqueName failed:', error);
    return null;
  }
}

/**
 * Gets all techniques ranked by effectiveness for this user
 *
 * Returns complete rankings with usage stats and success rates.
 * Sorted by avg_reduction DESC (most effective first).
 * Joins with TECHNIQUE_LIBRARY to get full technique names.
 *
 * @param userId - User's ID
 * @returns Array of techniques with stats, sorted by effectiveness
 *
 * @example
 * const rankings = await getTechniqueRankings('user-123');
 * rankings.forEach(rank => {
 *   console.log(`${rank.techniqueName}: ${rank.successRate}% success, ${rank.avgReduction} avg reduction`);
 * });
 * // "Box Breathing: 75% success, 4.2 avg reduction"
 * // "Grounding: 60% success, 3.1 avg reduction"
 */
export async function getTechniqueRankings(
  userId: string
): Promise<
  Array<{
    techniqueId: string;
    techniqueName: string;
    timesUsed: number;
    timesSuccessful: number;
    successRate: number;
    avgReduction: number;
  }>
> {
  try {
    console.log('[PatternDetection] Getting technique rankings:', { userId });

    const { data, error } = await withRetry(
      () =>
        supabase
          .from('user_technique_stats')
          .select('technique_id, times_used, times_successful, avg_reduction')
          .eq('user_id', userId)
          .gt('times_used', 0)
          .order('avg_reduction', { ascending: false }),
      {
        maxRetries: 3,
        onRetry: (attempt) => {
          console.log(`[PatternDetection] Retry attempt ${attempt} for getTechniqueRankings`);
        },
      }
    );

    if (error) {
      console.error('[PatternDetection] Error fetching technique rankings:', error);
      throw new Error(`Failed to fetch technique rankings: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log('[PatternDetection] No technique rankings found');
      return [];
    }

    // Transform and enrich with technique names from library
    const rankings = data.map((stat) => {
      const technique = getTechniqueById(stat.technique_id);
      const successRate =
        stat.times_used > 0
          ? Math.round((stat.times_successful / stat.times_used) * 100)
          : 0;

      return {
        techniqueId: stat.technique_id,
        techniqueName: technique ? technique.shortName : stat.technique_id,
        timesUsed: stat.times_used,
        timesSuccessful: stat.times_successful,
        successRate,
        avgReduction: parseFloat(stat.avg_reduction),
      };
    });

    console.log(`[PatternDetection] Found ${rankings.length} technique rankings`);
    return rankings;
  } catch (error) {
    console.error('[PatternDetection] getTechniqueRankings failed:', error);
    return [];
  }
}

// ============================================================================
// EARLY DETECTION METRICS
// ============================================================================

/**
 * Calculates what percentage of spirals user catches early
 *
 * Early detection = pre_feeling >= 5 (caught in moderate range)
 * vs allowing spirals to escalate to 8+ (severe range).
 *
 * Higher percentage = better spiral awareness and early intervention.
 *
 * SQL approach:
 * - COUNT(CASE WHEN pre_feeling >= 5 THEN 1 END) / COUNT(*)
 * - Returns percentage 0-100
 *
 * @param userId - User's ID
 * @param daysBack - Days of history to analyze
 * @returns Percentage (0-100) or 0 if no data
 *
 * @example
 * const earlyRate = await getEarlyDetectionRate('user-123', 30);
 * console.log(`You catch ${earlyRate}% of spirals early`);
 * // "You catch 65% of spirals early"
 */
export async function getEarlyDetectionRate(
  userId: string,
  daysBack: number = PATTERN_DETECTION_CONSTANTS.DEFAULT_DAYS_BACK
): Promise<number> {
  try {
    console.log('[PatternDetection] Calculating early detection rate:', { userId, daysBack });

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    const { data, error } = await withRetry(
      () =>
        supabase
          .from('spiral_logs')
          .select('pre_feeling')
          .eq('user_id', userId)
          .gte('timestamp', cutoffDate.toISOString())
          .not('pre_feeling', 'is', null),
      {
        maxRetries: 3,
        onRetry: (attempt) => {
          console.log(`[PatternDetection] Retry attempt ${attempt} for getEarlyDetectionRate`);
        },
      }
    );

    if (error) {
      console.error('[PatternDetection] Error fetching spiral intensities:', error);
      throw new Error(`Failed to fetch spiral intensities: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log('[PatternDetection] No spiral data for early detection calculation');
      return 0;
    }

    // Count spirals caught early (pre_feeling >= threshold)
    const earlyCount = data.filter(
      (log) => log.pre_feeling >= PATTERN_DETECTION_CONSTANTS.EARLY_DETECTION_THRESHOLD
    ).length;

    const totalCount = data.length;
    const rate = totalCount > 0 ? (earlyCount / totalCount) * 100 : 0;

    // Round to nearest integer
    const rounded = Math.round(rate);
    console.log(
      `[PatternDetection] Early detection rate: ${rounded}% (${earlyCount}/${totalCount} spirals)`
    );
    return rounded;
  } catch (error) {
    console.error('[PatternDetection] getEarlyDetectionRate failed:', error);
    return 0;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Checks if user has sufficient spiral history for pattern detection
 *
 * Minimum threshold helps avoid false pattern detection with too little data.
 *
 * @param userId - User's ID
 * @param daysBack - Days to check
 * @returns true if sufficient data, false otherwise
 *
 * @example
 * const hasEnoughData = await hasSufficientData('user-123', 30);
 * if (!hasEnoughData) {
 *   console.log('Keep logging spirals to see patterns');
 * }
 */
export async function hasSufficientData(
  userId: string,
  daysBack: number = PATTERN_DETECTION_CONSTANTS.DEFAULT_DAYS_BACK
): Promise<boolean> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    const { data, error } = await withRetry(
      () =>
        supabase
          .from('spiral_logs')
          .select('spiral_id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('timestamp', cutoffDate.toISOString()),
      {
        maxRetries: 3,
      }
    );

    if (error) {
      console.error('[PatternDetection] Error checking data sufficiency:', error);
      return false;
    }

    const count = data?.count || 0;
    const sufficient = count >= PATTERN_DETECTION_CONSTANTS.MIN_SPIRALS_FOR_PATTERN;
    console.log(
      `[PatternDetection] Data sufficiency check: ${count} spirals (min: ${PATTERN_DETECTION_CONSTANTS.MIN_SPIRALS_FOR_PATTERN}) - ${sufficient ? 'sufficient' : 'insufficient'}`
    );
    return sufficient;
  } catch (error) {
    console.error('[PatternDetection] hasSufficientData failed:', error);
    return false;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  detectSpiralPatterns,
  getPeakSpiralTime,
  getMostCommonTrigger,
  getTechniqueRankings,
  getEarlyDetectionRate,
  hasSufficientData,
};
