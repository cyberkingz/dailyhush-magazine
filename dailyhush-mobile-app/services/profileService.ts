/**
 * Nœma - Profile API Service
 *
 * Handles all API interactions for the profile page including:
 * - Fetching profile summary data
 * - Daily check-ins
 * - Insights retrieval
 * - User statistics
 */

import { supabase } from '@/utils/supabase';
import type { Tables, Enums } from '@/types/supabase';

/**
 * Profile Summary Data
 * All data needed to render the profile page
 */
export interface ProfileSummary {
  user: {
    id: string;
    email: string;
    full_name: string | null;
    loop_type: string | null;
    is_premium: boolean;
    created_at: string;
  };
  stats: {
    totalCheckIns: number;
    currentStreak: number;
    longestStreak: number;
    avgMoodRating: number;
    daysActive: number;
  };
  recentCheckIns: Tables<'user_check_ins'>[];
  insights: Tables<'user_insights'>[];
  todayCheckIn: Tables<'user_check_ins'> | null;
}

/**
 * Check-in Input Data
 */
export interface CheckInInput {
  mood_rating: number; // 1-5
  emotional_weather: Enums<'emotional_weather'>;
  notes?: string;
}

/**
 * Fetch complete profile summary for the user
 * Single API call to get all data needed for profile page
 */
export async function fetchProfileSummary(): Promise<ProfileSummary | null> {
  try {
    // Get current user
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      console.error('Error getting user:', authError);
      return null;
    }

    // Fetch user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', authUser.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return null;
    }

    // Fetch recent check-ins (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: checkIns, error: checkInsError } = await supabase
      .from('user_check_ins')
      .select('*')
      .eq('user_id', authUser.id)
      .gte('check_in_date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('check_in_date', { ascending: false });

    if (checkInsError) {
      console.error('Error fetching check-ins:', checkInsError);
    }

    // Fetch active insights (not dismissed)
    const { data: insights, error: insightsError } = await supabase
      .from('user_insights')
      .select('*')
      .eq('user_id', authUser.id)
      .eq('is_dismissed', false)
      .or(`valid_until.is.null,valid_until.gte.${new Date().toISOString()}`)
      .order('created_at', { ascending: false })
      .limit(10);

    if (insightsError) {
      console.error('Error fetching insights:', insightsError);
    }

    // Check if user checked in today
    const today = new Date().toISOString().split('T')[0];
    const todayCheckIn = checkIns?.find((ci) => ci.check_in_date === today) || null;

    // Calculate stats
    const stats = calculateUserStats(checkIns || [], authUser.id);

    return {
      user: {
        id: authUser.id,
        email: authUser.email!,
        full_name: userProfile.name,
        loop_type: userProfile.loop_type,
        is_premium: userProfile.premium_trial_active,
        created_at: userProfile.created_at,
      },
      stats,
      recentCheckIns: checkIns || [],
      insights: insights || [],
      todayCheckIn,
    };
  } catch (error) {
    console.error('Error fetching profile summary:', error);
    return null;
  }
}

/**
 * Calculate user statistics from check-ins
 */
function calculateUserStats(
  checkIns: Tables<'user_check_ins'>[],
  userId: string
): ProfileSummary['stats'] {
  if (checkIns.length === 0) {
    return {
      totalCheckIns: 0,
      currentStreak: 0,
      longestStreak: 0,
      avgMoodRating: 0,
      daysActive: 0,
    };
  }

  // Total check-ins
  const totalCheckIns = checkIns.length;

  // Average mood rating
  const avgMoodRating = checkIns.reduce((sum, ci) => sum + ci.mood_rating, 0) / checkIns.length;

  // Calculate current streak
  const currentStreak = calculateCurrentStreak(checkIns);

  // Calculate longest streak
  const longestStreak = calculateLongestStreak(checkIns);

  // Days active (unique check-in dates)
  const daysActive = new Set(checkIns.map((ci) => ci.check_in_date)).size;

  return {
    totalCheckIns,
    currentStreak,
    longestStreak,
    avgMoodRating: Math.round(avgMoodRating * 10) / 10, // Round to 1 decimal
    daysActive,
  };
}

/**
 * Calculate current check-in streak (consecutive days from today)
 */
function calculateCurrentStreak(checkIns: Tables<'user_check_ins'>[]): number {
  if (checkIns.length === 0) return 0;

  // Sort by date descending (most recent first)
  const sorted = [...checkIns].sort(
    (a, b) => new Date(b.check_in_date).getTime() - new Date(a.check_in_date).getTime()
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const checkIn of sorted) {
    const checkInDate = new Date(checkIn.check_in_date);
    checkInDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
      (currentDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === streak) {
      streak++;
      currentDate = checkInDate;
    } else if (daysDiff > streak) {
      break; // Gap in streak
    }
  }

  return streak;
}

/**
 * Calculate longest check-in streak ever
 */
function calculateLongestStreak(checkIns: Tables<'user_check_ins'>[]): number {
  if (checkIns.length === 0) return 0;

  // Sort by date ascending
  const sorted = [...checkIns].sort(
    (a, b) => new Date(a.check_in_date).getTime() - new Date(b.check_in_date).getTime()
  );

  let longestStreak = 1;
  let currentStreakLength = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prevDate = new Date(sorted[i - 1].check_in_date);
    const currDate = new Date(sorted[i].check_in_date);

    const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      currentStreakLength++;
      longestStreak = Math.max(longestStreak, currentStreakLength);
    } else if (daysDiff > 1) {
      currentStreakLength = 1;
    }
  }

  return longestStreak;
}

/**
 * Save a daily check-in
 * Creates or updates check-in for today
 */
export async function saveCheckIn(input: CheckInInput): Promise<boolean> {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting user:', authError);
      return false;
    }

    const today = new Date().toISOString().split('T')[0];

    // Upsert check-in (insert or update if exists)
    const { error } = await supabase.from('user_check_ins').upsert(
      {
        user_id: user.id,
        check_in_date: today,
        mood_rating: input.mood_rating,
        emotional_weather: input.emotional_weather,
        notes: input.notes || null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,check_in_date', // Unique constraint
      }
    );

    if (error) {
      console.error('Error saving check-in:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving check-in:', error);
    return false;
  }
}

/**
 * Mark an insight as read
 */
export async function markInsightAsRead(insightId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_insights')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq('id', insightId);

    if (error) {
      console.error('Error marking insight as read:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error marking insight as read:', error);
    return false;
  }
}

/**
 * Dismiss an insight
 */
export async function dismissInsight(insightId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_insights')
      .update({
        is_dismissed: true,
        dismissed_at: new Date().toISOString(),
      })
      .eq('id', insightId);

    if (error) {
      console.error('Error dismissing insight:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error dismissing insight:', error);
    return false;
  }
}

/**
 * Get check-in history for a date range
 * Useful for charts and visualizations
 */
export async function getCheckInHistory(
  startDate: Date,
  endDate: Date
): Promise<Tables<'user_check_ins'>[] | null> {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting user:', authError);
      return null;
    }

    const { data, error } = await supabase
      .from('user_check_ins')
      .select('*')
      .eq('user_id', user.id)
      .gte('check_in_date', startDate.toISOString().split('T')[0])
      .lte('check_in_date', endDate.toISOString().split('T')[0])
      .order('check_in_date', { ascending: true });

    if (error) {
      console.error('Error fetching check-in history:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching check-in history:', error);
    return null;
  }
}

/**
 * Get insights by category
 */
export async function getInsightsByCategory(
  category: Enums<'insight_category'>
): Promise<Tables<'user_insights'>[] | null> {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error getting user:', authError);
      return null;
    }

    const { data, error } = await supabase
      .from('user_insights')
      .select('*')
      .eq('user_id', user.id)
      .eq('category', category)
      .eq('is_dismissed', false)
      .or(`valid_until.is.null,valid_until.gte.${new Date().toISOString()}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching insights by category:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching insights by category:', error);
    return null;
  }
}
