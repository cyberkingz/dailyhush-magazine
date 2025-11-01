/**
 * DailyHush - Premium Trial Manager
 * Manages 7-day NO-CC Premium trial system
 * Updated: 2025-10-31
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { LoopType } from '@/data/quizQuestions';

const TRIAL_DURATION_DAYS = 7;

export interface TrialStatus {
  isActive: boolean;
  daysRemaining: number;
  startDate: string | null;
  endDate: string | null;
  loopType: LoopType | null;
}

/**
 * Start a 7-day Premium trial (NO credit card required)
 * Called after user completes quiz and opts into trial
 */
export async function startPremiumTrial(
  supabase: SupabaseClient,
  userId: string,
  loopType: LoopType
): Promise<{ success: boolean; error?: string }> {
  try {
    const now = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + TRIAL_DURATION_DAYS);

    const { error } = await supabase
      .from('user_profiles')
      .update({
        premium_trial_active: true,
        premium_trial_start: now.toISOString(),
        premium_trial_end: trialEnd.toISOString(),
        loop_type: loopType,
        updated_at: now.toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error starting Premium trial:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Premium trial started successfully!');
    console.log(`📅 Trial ends: ${trialEnd.toLocaleDateString()}`);
    console.log(`🔁 Loop type: ${loopType}`);

    return { success: true };
  } catch (error: any) {
    console.error('Exception starting Premium trial:', error);
    return { success: false, error: error?.message || 'Unknown error' };
  }
}

/**
 * Check current trial status
 * Returns trial info including days remaining
 */
export async function getTrialStatus(
  supabase: SupabaseClient,
  userId: string
): Promise<TrialStatus> {
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('premium_trial_active, premium_trial_start, premium_trial_end, loop_type')
      .eq('user_id', userId)
      .single();

    if (error || !profile) {
      return {
        isActive: false,
        daysRemaining: 0,
        startDate: null,
        endDate: null,
        loopType: null,
      };
    }

    // Check if trial is active and not expired
    if (!profile.premium_trial_active || !profile.premium_trial_end) {
      return {
        isActive: false,
        daysRemaining: 0,
        startDate: profile.premium_trial_start,
        endDate: profile.premium_trial_end,
        loopType: profile.loop_type,
      };
    }

    const now = new Date();
    const endDate = new Date(profile.premium_trial_end);

    // Check if trial has expired
    if (now > endDate) {
      // Auto-expire trial
      await expireTrial(supabase, userId);
      return {
        isActive: false,
        daysRemaining: 0,
        startDate: profile.premium_trial_start,
        endDate: profile.premium_trial_end,
        loopType: profile.loop_type,
      };
    }

    // Calculate days remaining
    const msRemaining = endDate.getTime() - now.getTime();
    const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));

    return {
      isActive: true,
      daysRemaining,
      startDate: profile.premium_trial_start,
      endDate: profile.premium_trial_end,
      loopType: profile.loop_type,
    };
  } catch (error) {
    console.error('Error getting trial status:', error);
    return {
      isActive: false,
      daysRemaining: 0,
      startDate: null,
      endDate: null,
      loopType: null,
    };
  }
}

/**
 * Expire trial (called automatically when trial ends)
 * User reverts to Free tier
 */
export async function expireTrial(
  supabase: SupabaseClient,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        premium_trial_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error expiring trial:', error);
      return { success: false, error: error.message };
    }

    console.log('⏰ Trial expired - user reverted to Free tier');
    return { success: true };
  } catch (error: any) {
    console.error('Exception expiring trial:', error);
    return { success: false, error: error?.message || 'Unknown error' };
  }
}

/**
 * Cancel trial early (user opts out)
 * User immediately reverts to Free tier
 */
export async function cancelTrial(
  supabase: SupabaseClient,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        premium_trial_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error canceling trial:', error);
      return { success: false, error: error.message };
    }

    console.log('❌ Trial canceled by user - reverted to Free tier');
    return { success: true };
  } catch (error: any) {
    console.error('Exception canceling trial:', error);
    return { success: false, error: error?.message || 'Unknown error' };
  }
}

/**
 * Check if user should see trial expiration reminder
 * Show reminders on Day 5 and Day 6
 */
export function shouldShowTrialReminder(trialStatus: TrialStatus): boolean {
  if (!trialStatus.isActive) return false;

  const daysRemaining = trialStatus.daysRemaining;
  // Show reminder on days 2 and 1 (2 days and 1 day before expiration)
  return daysRemaining === 2 || daysRemaining === 1;
}

/**
 * Check if Premium features are accessible
 * Returns true if user has:
 * - Active trial, OR
 * - Active RevenueCat subscription
 */
export async function isPremiumActive(supabase: SupabaseClient, userId: string): Promise<boolean> {
  // Check trial status
  const trialStatus = await getTrialStatus(supabase, userId);
  if (trialStatus.isActive) {
    return true;
  }

  // Check RevenueCat subscription status
  // TODO: Integrate with RevenueCat SDK to check entitlements
  // For now, check mobile_subscriptions table
  try {
    const { data: subscription, error } = await supabase
      .from('mobile_subscriptions')
      .select('status')
      .eq('user_id', userId)
      .single();

    if (error || !subscription) {
      return false;
    }

    return subscription.status === 'active' || subscription.status === 'trialing';
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
}
