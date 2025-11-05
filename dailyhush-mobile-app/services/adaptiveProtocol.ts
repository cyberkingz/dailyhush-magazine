/**
 * DailyHush - Adaptive Protocol Selection Service
 *
 * Implements a simple mathematical scoring algorithm (NO machine learning)
 * to select the most effective spiral interrupt technique for each user.
 *
 * Algorithm: Score = (Past Effectiveness × 10) + (Trigger Match × 8) + (Intensity Match × 6) - (Recency Penalty × 10)
 *
 * Features:
 * - Personalized technique selection based on user history
 * - Simple deterministic scoring (same inputs = same outputs)
 * - Automatic effectiveness tracking via database triggers
 * - Fallback to intensity-based defaults for new users
 */

import { supabase } from '@/utils/supabase';
import { withRetry } from '@/utils/retry';
import { TECHNIQUE_LIBRARY } from '@/constants/techniqueLibrary';
import type {
  Technique,
  UserTechniqueStats,
  AdaptiveProtocol,
  ProtocolOutcome,
} from '@/types';

// ============================================================================
// SCORING CONSTANTS
// ============================================================================

const SCORING_WEIGHTS = {
  EFFECTIVENESS: 10, // Weight for past success rate
  TRIGGER_MATCH: 8, // Weight for matching trigger
  INTENSITY_MATCH: 6, // Weight for matching intensity range
  RECENCY_PENALTY: 10, // Weight for recent usage (prevents habituation)
} as const;

const RECENCY_THRESHOLD_HOURS = 24; // Penalize techniques used within last 24 hours
const SUCCESS_THRESHOLD = 2; // Reduction of 2+ points considered successful

// ============================================================================
// MAIN SELECTION FUNCTION
// ============================================================================

/**
 * Selects the most appropriate technique using simple scoring algorithm
 *
 * Algorithm:
 * 1. Filter techniques by intensity range and Shift availability
 * 2. Score each technique based on:
 *    - Past effectiveness (avg_reduction × 10)
 *    - Trigger match (8 points if technique.bestFor includes trigger)
 *    - Intensity match (6 points if exact intensity range match)
 *    - Recency penalty (-10 points if used in last 24 hours)
 * 3. Select highest scoring technique
 * 4. Calculate confidence based on available data
 * 5. Generate human-readable rationale
 *
 * @param userId - User's ID
 * @param intensity - Current spiral intensity (1-10 scale)
 * @param trigger - Optional trigger type (e.g., "conversations", "health")
 * @param shiftConnected - Whether Shift necklace is paired
 * @returns AdaptiveProtocol with technique, confidence, and rationale
 *
 * @example
 * const protocol = await selectAdaptiveProtocol(
 *   'user-123',
 *   8, // High intensity
 *   'panic',
 *   false // No Shift device
 * );
 * console.log(protocol.technique.name); // "Box Breathing"
 * console.log(protocol.confidence); // 0.85
 * console.log(protocol.rationale); // "Box Breathing worked well for you..."
 */
export async function selectAdaptiveProtocol(
  userId: string,
  intensity: number,
  trigger?: string,
  shiftConnected: boolean = false
): Promise<AdaptiveProtocol> {
  try {
    console.log('[AdaptiveProtocol] Selection started:', {
      userId,
      intensity,
      trigger,
      shiftConnected,
    });

    // Validate intensity
    if (intensity < 1 || intensity > 10) {
      throw new Error(`Invalid intensity: ${intensity}. Must be between 1 and 10.`);
    }

    // Step 1: Get user's technique effectiveness stats
    const userStats = await getUserTechniqueStats(userId);
    console.log(`[AdaptiveProtocol] Found ${userStats.length} technique stats for user`);

    // Step 2: Convert intensity to range
    const intensityRange = getIntensityRange(intensity);
    console.log(`[AdaptiveProtocol] Intensity ${intensity} mapped to range: ${intensityRange}`);

    // Step 3: Filter available techniques
    const availableTechniques = filterTechniques(
      TECHNIQUE_LIBRARY,
      intensityRange,
      shiftConnected
    );
    console.log(
      `[AdaptiveProtocol] ${availableTechniques.length} techniques available after filtering`
    );

    if (availableTechniques.length === 0) {
      throw new Error('No available techniques found for current criteria');
    }

    // Step 4: Score each technique
    const scoredTechniques = availableTechniques.map((technique) => {
      const stats = userStats.find((s) => s.techniqueId === technique.id);
      const score = scoreTechnique(technique, stats, intensity, trigger);

      console.log(`[AdaptiveProtocol] Scored ${technique.name}: ${score.total.toFixed(2)}`, {
        effectiveness: score.effectiveness,
        triggerMatch: score.triggerMatch,
        intensityMatch: score.intensityMatch,
        recencyPenalty: score.recencyPenalty,
      });

      return {
        technique,
        stats,
        score,
      };
    });

    // Step 5: Sort by score (highest first) and select winner
    scoredTechniques.sort((a, b) => b.score.total - a.score.total);
    const selected = scoredTechniques[0];

    // Step 6: Calculate confidence
    const confidence = calculateConfidence(
      selected.score,
      selected.stats,
      scoredTechniques.length
    );

    // Step 7: Generate human-readable rationale
    const rationale = generateRationale(selected.technique, selected.stats, intensity, trigger);

    console.log('[AdaptiveProtocol] Selection complete:', {
      technique: selected.technique.name,
      score: selected.score.total,
      confidence,
    });

    return {
      technique: selected.technique,
      confidence,
      rationale,
    };
  } catch (error) {
    console.error('[AdaptiveProtocol] Selection failed:', error);
    throw error;
  }
}

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

/**
 * Fetches user's technique effectiveness stats from database
 *
 * Queries the user_technique_stats table which is automatically
 * updated by a database trigger whenever spiral_logs are inserted.
 *
 * @param userId - User's ID
 * @returns Array of technique stats with effectiveness data
 *
 * @example
 * const stats = await getUserTechniqueStats('user-123');
 * stats.forEach(stat => {
 *   console.log(`${stat.techniqueId}: ${stat.avgReduction} avg reduction`);
 * });
 */
export async function getUserTechniqueStats(
  userId: string
): Promise<UserTechniqueStats[]> {
  try {
    const { data, error } = await withRetry(
      () =>
        supabase
          .from('user_technique_stats')
          .select('*')
          .eq('user_id', userId)
          .order('last_used_at', { ascending: false, nullsFirst: false }),
      {
        maxRetries: 3,
        onRetry: (attempt, err) => {
          console.log(`[AdaptiveProtocol] Retry attempt ${attempt} for getUserTechniqueStats`);
        },
      }
    );

    if (error) {
      console.error('[AdaptiveProtocol] Error fetching technique stats:', error);
      throw new Error(`Failed to fetch technique stats: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log('[AdaptiveProtocol] No technique stats found for user (likely new user)');
      return [];
    }

    // Transform database rows to UserTechniqueStats type
    const stats: UserTechniqueStats[] = data.map((row) => ({
      id: row.id,
      userId: row.user_id,
      techniqueId: row.technique_id,
      timesUsed: row.times_used,
      timesSuccessful: row.times_successful,
      avgReduction: parseFloat(row.avg_reduction),
      lastUsedAt: row.last_used_at ? new Date(row.last_used_at) : null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));

    console.log(`[AdaptiveProtocol] Fetched ${stats.length} technique stats`);
    return stats;
  } catch (error) {
    console.error('[AdaptiveProtocol] getUserTechniqueStats failed:', error);
    throw error;
  }
}

/**
 * Records protocol outcome to spiral_logs table
 *
 * Database trigger will automatically update user_technique_stats
 * with the new effectiveness data. This keeps stats synchronized
 * without requiring manual calculation.
 *
 * @param outcome - ProtocolOutcome object with all session data
 *
 * @example
 * await recordProtocolOutcome({
 *   userId: 'user-123',
 *   techniqueId: 'box-breathing',
 *   techniqueName: 'Box Breathing',
 *   duration: 60,
 *   preFeel: 8,
 *   postFeel: 4,
 *   reduction: 4,
 *   confidence: 0.85,
 *   rationale: 'Box Breathing worked well...',
 *   trigger: 'panic',
 *   completed: true,
 *   timestamp: new Date().toISOString()
 * });
 */
export async function recordProtocolOutcome(outcome: ProtocolOutcome): Promise<void> {
  try {
    console.log('[AdaptiveProtocol] Recording protocol outcome:', {
      userId: outcome.userId,
      techniqueId: outcome.techniqueId,
      reduction: outcome.reduction,
      completed: outcome.completed,
    });

    // Prepare spiral log entry
    const spiralLog = {
      user_id: outcome.userId,
      timestamp: outcome.timestamp,
      technique_id: outcome.techniqueId,
      technique_name: outcome.techniqueName,
      protocol_duration: outcome.duration,
      pre_feeling: outcome.preFeel,
      post_feeling: outcome.postFeel,
      interrupted: outcome.completed,
      trigger: outcome.trigger || null,
      used_shift: false, // TODO: Detect from outcome or technique
      selection_confidence: outcome.confidence,
      selection_rationale: outcome.rationale,
      interactive_responses: outcome.interactiveResponses || null,
      duration_seconds: outcome.duration,
      technique_used: outcome.techniqueName, // Legacy field
    };

    // Insert into spiral_logs (trigger will auto-update user_technique_stats)
    const { data, error } = await withRetry(
      () => supabase.from('spiral_logs').insert(spiralLog).select().single(),
      {
        maxRetries: 3,
        onRetry: (attempt, err) => {
          console.log(`[AdaptiveProtocol] Retry attempt ${attempt} for recordProtocolOutcome`);
        },
      }
    );

    if (error) {
      console.error('[AdaptiveProtocol] Error recording protocol outcome:', error);
      throw new Error(`Failed to record protocol outcome: ${error.message}`);
    }

    console.log('[AdaptiveProtocol] Protocol outcome recorded successfully:', data.spiral_id);
  } catch (error) {
    console.error('[AdaptiveProtocol] recordProtocolOutcome failed:', error);
    throw error;
  }
}

// ============================================================================
// SCORING LOGIC
// ============================================================================

/**
 * Scores a technique based on multiple factors
 *
 * Score components:
 * - Effectiveness: How well technique worked in the past (avg_reduction × 10)
 * - Trigger match: Does technique target this trigger? (8 points)
 * - Intensity match: Does technique match intensity range? (6 points)
 * - Recency penalty: Was technique used recently? (-10 points)
 *
 * @returns Object with score breakdown and total
 */
function scoreTechnique(
  technique: Technique,
  stats: UserTechniqueStats | undefined,
  intensity: number,
  trigger: string | undefined
): {
  effectiveness: number;
  triggerMatch: number;
  intensityMatch: number;
  recencyPenalty: number;
  total: number;
} {
  let effectiveness = 0;
  let triggerMatch = 0;
  let intensityMatch = 0;
  let recencyPenalty = 0;

  // 1. Effectiveness score (past performance)
  if (stats && stats.avgReduction > 0) {
    effectiveness = stats.avgReduction * SCORING_WEIGHTS.EFFECTIVENESS;
  }

  // 2. Trigger match score
  if (trigger && technique.bestFor.includes(trigger)) {
    triggerMatch = SCORING_WEIGHTS.TRIGGER_MATCH;
  }

  // 3. Intensity match score
  const intensityRange = getIntensityRange(intensity);
  if (
    technique.intensityRange === intensityRange ||
    technique.intensityRange === 'any'
  ) {
    intensityMatch = SCORING_WEIGHTS.INTENSITY_MATCH;
  }

  // 4. Recency penalty (prevent habituation)
  if (stats?.lastUsedAt) {
    const hoursSinceLastUse =
      (Date.now() - stats.lastUsedAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceLastUse < RECENCY_THRESHOLD_HOURS) {
      recencyPenalty = -SCORING_WEIGHTS.RECENCY_PENALTY;
    }
  }

  const total = effectiveness + triggerMatch + intensityMatch + recencyPenalty;

  return {
    effectiveness,
    triggerMatch,
    intensityMatch,
    recencyPenalty,
    total,
  };
}

/**
 * Calculates confidence score (0-1) for the selection
 *
 * Confidence factors:
 * - Higher scores = higher confidence
 * - More usage data = higher confidence
 * - More available techniques = lower confidence (more uncertainty)
 *
 * @returns Confidence score between 0 and 1
 */
function calculateConfidence(
  score: {
    effectiveness: number;
    triggerMatch: number;
    intensityMatch: number;
    recencyPenalty: number;
    total: number;
  },
  stats: UserTechniqueStats | undefined,
  techniqueCount: number
): number {
  // Calculate maximum possible score (without penalty)
  const maxPossibleScore =
    10 * SCORING_WEIGHTS.EFFECTIVENESS + // Best possible effectiveness (10 point reduction × weight)
    SCORING_WEIGHTS.TRIGGER_MATCH +
    SCORING_WEIGHTS.INTENSITY_MATCH;

  // Normalize score to 0-1 range
  const normalizedScore = Math.max(0, score.total) / maxPossibleScore;

  // Boost confidence if we have usage data
  let dataBonus = 0;
  if (stats && stats.timesUsed > 0) {
    // More uses = more confidence (diminishing returns after 10 uses)
    dataBonus = Math.min(stats.timesUsed / 10, 1) * 0.2;
  }

  // Reduce confidence if many techniques available (more uncertainty)
  const choiceReduction = Math.min(techniqueCount / 5, 1) * 0.1;

  // Final confidence calculation
  const confidence = Math.min(
    Math.max(normalizedScore + dataBonus - choiceReduction, 0),
    1
  );

  return Math.round(confidence * 100) / 100; // Round to 2 decimal places
}

// ============================================================================
// RATIONALE GENERATION
// ============================================================================

/**
 * Creates human-readable explanation for why technique was selected
 *
 * Rationale includes:
 * - Past performance (if available)
 * - Why technique matches current situation
 * - What the technique is good for
 *
 * @returns String like "Box Breathing worked well for you in the past (avg reduction: 4.2 points). Best for panic and acute stress."
 *
 * @example
 * const rationale = generateRationale(
 *   boxBreathingTechnique,
 *   { avgReduction: 4.2, timesUsed: 5 },
 *   8,
 *   'panic'
 * );
 * // "Box Breathing worked well for you in the past (avg reduction: 4.2 points). Best for panic and acute stress."
 */
export function generateRationale(
  technique: Technique,
  stats: UserTechniqueStats | undefined,
  intensity: number,
  trigger: string | undefined
): string {
  const parts: string[] = [];

  // Part 1: Past performance
  if (stats && stats.timesUsed > 0) {
    const reductionText = stats.avgReduction.toFixed(1);
    if (stats.avgReduction >= 3) {
      parts.push(
        `${technique.shortName} has been very effective for you in the past (avg reduction: ${reductionText} points).`
      );
    } else if (stats.avgReduction >= 1.5) {
      parts.push(
        `${technique.shortName} worked well for you in the past (avg reduction: ${reductionText} points).`
      );
    } else {
      parts.push(
        `${technique.shortName} showed some effectiveness for you before (avg reduction: ${reductionText} points).`
      );
    }
  } else {
    // New technique for this user
    parts.push(`${technique.shortName} is a proven technique you haven't tried yet.`);
  }

  // Part 2: Why it matches current situation
  const intensityRange = getIntensityRange(intensity);
  if (trigger && technique.bestFor.includes(trigger)) {
    parts.push(`It's specifically designed for ${trigger}.`);
  } else if (technique.intensityRange === intensityRange) {
    const intensityDescription =
      intensityRange === 'severe'
        ? 'high-intensity spirals'
        : intensityRange === 'moderate'
        ? 'moderate anxiety'
        : 'mild worry';
    parts.push(`It's effective for ${intensityDescription} like what you're experiencing now.`);
  }

  // Part 3: What it's best for (if not already mentioned)
  if (!trigger || !technique.bestFor.includes(trigger)) {
    const bestForText = technique.bestFor.slice(0, 2).join(' and ');
    parts.push(`Best for ${bestForText}.`);
  }

  return parts.join(' ');
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Converts numeric intensity (1-10) to range category
 *
 * Ranges:
 * - severe: 8-10 (high anxiety, panic)
 * - moderate: 4-7 (typical anxiety)
 * - mild: 1-3 (low-level worry)
 */
function getIntensityRange(intensity: number): 'severe' | 'moderate' | 'mild' {
  if (intensity >= 8) return 'severe';
  if (intensity >= 4) return 'moderate';
  return 'mild';
}

/**
 * Filters techniques by intensity range and Shift availability
 *
 * @param techniques - All available techniques
 * @param intensityRange - Target intensity range
 * @param shiftConnected - Whether Shift device is available
 * @returns Filtered array of techniques
 */
function filterTechniques(
  techniques: readonly Technique[],
  intensityRange: 'severe' | 'moderate' | 'mild',
  shiftConnected: boolean
): Technique[] {
  return [...techniques].filter((technique) => {
    // Filter by Shift requirement
    if (technique.requiresShift && !shiftConnected) {
      return false;
    }

    // Filter by intensity range (include 'any' techniques)
    if (
      technique.intensityRange !== intensityRange &&
      technique.intensityRange !== 'any'
    ) {
      return false;
    }

    return true;
  });
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  selectAdaptiveProtocol,
  getUserTechniqueStats,
  recordProtocolOutcome,
  generateRationale,
};
