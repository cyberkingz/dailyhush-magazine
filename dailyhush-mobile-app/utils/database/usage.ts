/**
 * Usage Tracking Functions for Nœma
 *
 * Handles tier-based usage limits for conversations, exercises, and other resources.
 * Integrates with RevenueCat subscriptions to enforce free vs premium limits.
 */

import { supabase } from '../supabase';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type ResourceType = 'conversation' | 'exercise' | 'voice_journal' | 'shift_session';
export type Period = 'daily' | 'weekly' | 'monthly';
export type Tier = 'free' | 'premium' | 'premium_annual';

export interface UsageLimit {
  allowed: boolean;
  currentUsage: number;
  limitAmount: number | null;
  tier: Tier;
}

export interface UsageRecord {
  usage_id?: string;
  user_id: string;
  resource_type: ResourceType;
  module_id?: string;
  timestamp?: string;
  duration_seconds?: number;
  completed?: boolean;
  interrupted?: boolean;
  tier_at_usage?: Tier;
}

// ============================================================================
// USAGE LIMIT CHECKING
// ============================================================================

/**
 * Check if user can perform an action based on their tier limits
 * @param userId - The user's UUID
 * @param resourceType - Type of resource to check
 * @param period - Time period for the limit (daily, weekly, monthly)
 * @returns Usage limit information including whether action is allowed
 */
export async function checkUsageLimit(
  userId: string,
  resourceType: ResourceType,
  period: Period = 'daily'
): Promise<UsageLimit> {
  const { data, error } = await supabase.rpc('check_usage_limit', {
    p_user_id: userId,
    p_resource_type: resourceType,
    p_period: period,
  });

  if (error) {
    console.error('Error checking usage limit:', error);
    throw error;
  }

  // Database function returns a single row, extract it
  const result = Array.isArray(data) ? data[0] : data;

  return {
    allowed: result.allowed,
    currentUsage: result.current_usage,
    limitAmount: result.limit_amount,
    tier: result.tier as Tier,
  };
}

/**
 * Check if user has premium access
 * @param userId - The user's UUID
 * @returns True if user has active premium subscription
 */
export async function hasPremiumAccess(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('tier, status')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (error) {
    // If no subscription found, user is free tier
    if (error.code === 'PGRST116') {
      return false;
    }
    console.error('Error checking premium access:', error);
    return false;
  }

  return data?.tier === 'premium' || data?.tier === 'premium_annual';
}

/**
 * Get user's current tier
 * @param userId - The user's UUID
 * @returns Current tier (defaults to 'free' if no active subscription)
 */
export async function getUserTier(userId: string): Promise<Tier> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('tier')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (error || !data) {
    return 'free';
  }

  return data.tier as Tier;
}

// ============================================================================
// USAGE COUNTING
// ============================================================================

/**
 * Count usage for the current week
 * @param userId - The user's UUID
 * @param resourceType - Type of resource to count
 * @returns Number of times resource was used this week
 */
export async function countUsageThisWeek(
  userId: string,
  resourceType: ResourceType
): Promise<number> {
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of week (Sunday)
  weekStart.setHours(0, 0, 0, 0);

  const { error, count } = await supabase
    .from('user_usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('resource_type', resourceType)
    .gte('timestamp', weekStart.toISOString());

  if (error) {
    console.error('Error counting weekly usage:', error);
    throw error;
  }

  return count || 0;
}

/**
 * Count usage for today
 * @param userId - The user's UUID
 * @param resourceType - Type of resource to count
 * @returns Number of times resource was used today
 */
export async function countUsageToday(userId: string, resourceType: ResourceType): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { error, count } = await supabase
    .from('user_usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('resource_type', resourceType)
    .gte('timestamp', today.toISOString());

  if (error) {
    console.error('Error counting daily usage:', error);
    throw error;
  }

  return count || 0;
}

/**
 * Count usage for the current month
 * @param userId - The user's UUID
 * @param resourceType - Type of resource to count
 * @returns Number of times resource was used this month
 */
export async function countUsageThisMonth(
  userId: string,
  resourceType: ResourceType
): Promise<number> {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { error, count } = await supabase
    .from('user_usage')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('resource_type', resourceType)
    .gte('timestamp', monthStart.toISOString());

  if (error) {
    console.error('Error counting monthly usage:', error);
    throw error;
  }

  return count || 0;
}

// ============================================================================
// USAGE RECORDING
// ============================================================================

/**
 * Record a usage event
 * @param userId - The user's UUID
 * @param resourceType - Type of resource being used
 * @param moduleId - Optional identifier for specific module/feature
 * @param options - Optional metadata (duration, completion status, etc.)
 * @returns The created usage record
 */
export async function recordUsage(
  userId: string,
  resourceType: ResourceType,
  moduleId?: string,
  options?: {
    durationSeconds?: number;
    completed?: boolean;
    interrupted?: boolean;
  }
): Promise<UsageRecord> {
  // Get current tier
  const tier = await getUserTier(userId);

  const usageRecord: UsageRecord = {
    user_id: userId,
    resource_type: resourceType,
    module_id: moduleId,
    tier_at_usage: tier,
    ...options,
  };

  const { data, error } = await supabase.from('user_usage').insert(usageRecord).select().single();

  if (error) {
    console.error('Error recording usage:', error);
    throw error;
  }

  return data as UsageRecord;
}

/**
 * Record conversation usage with automatic limit checking
 * @param userId - The user's UUID
 * @param moduleId - Conversation identifier (e.g., 'anna_chat')
 * @throws Error if user has exceeded their limit
 */
export async function recordConversationUsage(
  userId: string,
  moduleId: string = 'anna_chat'
): Promise<UsageRecord> {
  // Check if user can start a conversation
  const limit = await checkUsageLimit(userId, 'conversation', 'daily');

  if (!limit.allowed) {
    throw new Error(
      `Daily conversation limit reached (${limit.currentUsage}/${limit.limitAmount}). Upgrade to premium for unlimited conversations.`
    );
  }

  return recordUsage(userId, 'conversation', moduleId);
}

/**
 * Record exercise usage with automatic limit checking
 * @param userId - The user's UUID
 * @param moduleId - Exercise identifier (e.g., 'focus', 'breathing')
 * @param durationSeconds - How long the exercise lasted
 * @param completed - Whether the exercise was completed
 * @throws Error if user has exceeded their limit
 */
export async function recordExerciseUsage(
  userId: string,
  moduleId: string,
  durationSeconds?: number,
  completed: boolean = true
): Promise<UsageRecord> {
  // Check if user can start an exercise
  const limit = await checkUsageLimit(userId, 'exercise', 'weekly');

  if (!limit.allowed) {
    throw new Error(
      `Weekly exercise limit reached (${limit.currentUsage}/${limit.limitAmount}). Upgrade to premium for unlimited exercises.`
    );
  }

  return recordUsage(userId, 'exercise', moduleId, {
    durationSeconds,
    completed,
  });
}

// ============================================================================
// USAGE ANALYTICS
// ============================================================================

/**
 * Get usage statistics for all resource types
 * @param userId - The user's UUID
 * @param days - Number of days to analyze (default: 30)
 */
export async function getUsageStatistics(
  userId: string,
  days: number = 30
): Promise<Record<ResourceType, number>> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('user_usage')
    .select('resource_type')
    .eq('user_id', userId)
    .gte('timestamp', startDate.toISOString());

  if (error) {
    console.error('Error getting usage statistics:', error);
    throw error;
  }

  // Count by resource type
  const stats = {
    conversation: 0,
    exercise: 0,
    voice_journal: 0,
    shift_session: 0,
  } as Record<ResourceType, number>;

  data?.forEach((record) => {
    stats[record.resource_type as ResourceType]++;
  });

  return stats;
}

/**
 * Get detailed usage breakdown by module
 * @param userId - The user's UUID
 * @param resourceType - Type of resource to analyze
 * @param days - Number of days to analyze (default: 30)
 */
export async function getUsageBreakdown(
  userId: string,
  resourceType: ResourceType,
  days: number = 30
): Promise<Record<string, number>> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('user_usage')
    .select('module_id')
    .eq('user_id', userId)
    .eq('resource_type', resourceType)
    .gte('timestamp', startDate.toISOString());

  if (error) {
    console.error('Error getting usage breakdown:', error);
    throw error;
  }

  // Count by module
  const breakdown: Record<string, number> = {};

  data?.forEach((record) => {
    const module = record.module_id || 'unknown';
    breakdown[module] = (breakdown[module] || 0) + 1;
  });

  return breakdown;
}

/**
 * Get usage limits for all resource types for current user
 * @param userId - The user's UUID
 * @param period - Time period for limits
 */
export async function getAllUsageLimits(
  userId: string,
  period: Period = 'daily'
): Promise<Record<ResourceType, UsageLimit>> {
  const resourceTypes: ResourceType[] = [
    'conversation',
    'exercise',
    'voice_journal',
    'shift_session',
  ];

  const limits: Record<string, UsageLimit> = {};

  await Promise.all(
    resourceTypes.map(async (resourceType) => {
      try {
        const limit = await checkUsageLimit(userId, resourceType, period);
        limits[resourceType] = limit;
      } catch (error) {
        console.error(`Error getting limit for ${resourceType}:`, error);
        // Set default values on error
        limits[resourceType] = {
          allowed: true,
          currentUsage: 0,
          limitAmount: null,
          tier: 'free',
        };
      }
    })
  );

  return limits as Record<ResourceType, UsageLimit>;
}

// ============================================================================
// SUBSCRIPTION HELPERS
// ============================================================================

/**
 * Update user's subscription from RevenueCat webhook
 * @param userId - The user's UUID
 * @param subscriptionData - Subscription data from RevenueCat
 */
export async function updateSubscriptionFromRevenueCat(
  userId: string,
  subscriptionData: {
    tier: Tier;
    status: string;
    productId: string;
    store: string;
    revenuecatCustomerId: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    priceCents?: number;
    currency?: string;
  }
): Promise<void> {
  const { error } = await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      tier: subscriptionData.tier,
      status: subscriptionData.status,
      product_id: subscriptionData.productId,
      store: subscriptionData.store,
      revenuecat_customer_id: subscriptionData.revenuecatCustomerId,
      current_period_start: subscriptionData.currentPeriodStart.toISOString(),
      current_period_end: subscriptionData.currentPeriodEnd.toISOString(),
      price_cents: subscriptionData.priceCents,
      currency: subscriptionData.currency || 'USD',
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id',
    }
  );

  if (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

/**
 * Get subscription status and expiry information
 * @param userId - The user's UUID
 */
export async function getSubscriptionStatus(userId: string): Promise<{
  tier: Tier;
  status: string;
  expiresAt: Date | null;
  daysRemaining: number | null;
}> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('tier, status, current_period_end')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return {
      tier: 'free',
      status: 'none',
      expiresAt: null,
      daysRemaining: null,
    };
  }

  const expiresAt = new Date(data.current_period_end);
  const now = new Date();
  const daysRemaining = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return {
    tier: data.tier as Tier,
    status: data.status,
    expiresAt,
    daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
  };
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Check if user can start a new conversation
 * @param userId - The user's UUID
 * @returns Object with allowed status and reason if not allowed
 */
export async function canStartConversation(
  userId: string
): Promise<{ allowed: boolean; reason?: string; upgradePrompt?: string }> {
  const limit = await checkUsageLimit(userId, 'conversation', 'daily');

  if (limit.allowed) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: `You've reached your daily limit of ${limit.limitAmount} conversations.`,
    upgradePrompt: 'Upgrade to Premium for unlimited conversations with Anna.',
  };
}

/**
 * Check if user can do an exercise
 * @param userId - The user's UUID
 * @returns Object with allowed status and reason if not allowed
 */
export async function canDoExercise(
  userId: string
): Promise<{ allowed: boolean; reason?: string; upgradePrompt?: string }> {
  const limit = await checkUsageLimit(userId, 'exercise', 'weekly');

  if (limit.allowed) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: `You've reached your weekly limit of ${limit.limitAmount} exercises.`,
    upgradePrompt: 'Upgrade to Premium for unlimited FIRE training exercises.',
  };
}
