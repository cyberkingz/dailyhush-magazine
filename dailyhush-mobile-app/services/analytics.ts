/**
 * DailyHush - Analytics Service
 * Track F.I.R.E. Training engagement metrics and user progress
 */

import { supabase } from '@/utils/supabase';
import { FireModule } from '@/types';

// Analytics event types
export enum AnalyticsEvent {
  MODULE_STARTED = 'module_started',
  MODULE_SCREEN_VIEWED = 'module_screen_viewed',
  MODULE_COMPLETED = 'module_completed',
  MODULE_RESUMED = 'module_resumed',
  TRIGGER_SELECTED = 'trigger_selected',
  PHYSICAL_SIGN_SELECTED = 'physical_sign_selected',
  MENTAL_CUE_SELECTED = 'mental_cue_selected',
  REFRAME_WRITTEN = 'reframe_written',
  ROUTINE_SELECTED = 'routine_selected',
  ENVIRONMENT_CHANGED = 'environment_changed',
  FIRE_CERTIFIED = 'fire_certified',
}

// Event properties interface
export interface AnalyticsEventProperties {
  module?: FireModule;
  screen?: string;
  duration_seconds?: number;
  triggers_count?: number;
  physical_signs_count?: number;
  mental_cues_count?: number;
  reframe_length?: number;
  routines_count?: number;
  environment_changes_count?: number;
  days_to_complete?: number;
  [key: string]: any; // Allow additional properties
}

/**
 * Track an analytics event
 */
export async function trackEvent(
  userId: string,
  event: AnalyticsEvent,
  properties: AnalyticsEventProperties = {}
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate inputs
    if (!userId) {
      console.warn('Cannot track event: userId is required');
      return { success: false, error: 'User ID is required' };
    }

    if (!event) {
      console.warn('Cannot track event: event type is required');
      return { success: false, error: 'Event type is required' };
    }

    const eventData = {
      user_id: userId,
      event_type: event,
      event_properties: properties,
      timestamp: new Date().toISOString(),
    };

    const { error } = await supabase.from('fire_training_analytics').insert(eventData);

    if (error) {
      console.error('Error tracking event:', error);
      return { success: false, error: error.message };
    }

    console.log(`Analytics: ${event}`, properties);
    return { success: true };
  } catch (error: any) {
    console.error('Error in trackEvent:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Track module started event
 */
export async function trackModuleStarted(
  userId: string,
  module: FireModule
): Promise<{ success: boolean; error?: string }> {
  return trackEvent(userId, AnalyticsEvent.MODULE_STARTED, { module });
}

/**
 * Track module screen viewed event
 */
export async function trackScreenViewed(
  userId: string,
  module: FireModule,
  screen: string
): Promise<{ success: boolean; error?: string }> {
  return trackEvent(userId, AnalyticsEvent.MODULE_SCREEN_VIEWED, { module, screen });
}

/**
 * Track module completed event
 */
export async function trackModuleCompleted(
  userId: string,
  module: FireModule,
  durationSeconds?: number
): Promise<{ success: boolean; error?: string }> {
  return trackEvent(userId, AnalyticsEvent.MODULE_COMPLETED, {
    module,
    duration_seconds: durationSeconds,
  });
}

/**
 * Track module resumed event
 */
export async function trackModuleResumed(
  userId: string,
  module: FireModule,
  screen: string
): Promise<{ success: boolean; error?: string }> {
  return trackEvent(userId, AnalyticsEvent.MODULE_RESUMED, { module, screen });
}

/**
 * Track F.I.R.E. certification achieved
 */
export async function trackFIRECertified(
  userId: string,
  daysToComplete?: number
): Promise<{ success: boolean; error?: string }> {
  return trackEvent(userId, AnalyticsEvent.FIRE_CERTIFIED, { days_to_complete: daysToComplete });
}

/**
 * Get analytics summary for a user
 */
export async function getAnalyticsSummary(userId: string): Promise<{
  modulesStarted: number;
  modulesCompleted: number;
  totalScreensViewed: number;
  averageSessionDuration: number;
  isCertified: boolean;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('fire_training_analytics')
      .select('event_type, event_properties')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching analytics summary:', error);
      return {
        modulesStarted: 0,
        modulesCompleted: 0,
        totalScreensViewed: 0,
        averageSessionDuration: 0,
        isCertified: false,
        error: error.message,
      };
    }

    const modulesStarted =
      data?.filter((e) => e.event_type === AnalyticsEvent.MODULE_STARTED).length || 0;
    const modulesCompleted =
      data?.filter((e) => e.event_type === AnalyticsEvent.MODULE_COMPLETED).length || 0;
    const totalScreensViewed =
      data?.filter((e) => e.event_type === AnalyticsEvent.MODULE_SCREEN_VIEWED).length || 0;

    const completedEvents =
      data?.filter((e) => e.event_type === AnalyticsEvent.MODULE_COMPLETED) || [];
    const totalDuration = completedEvents.reduce(
      (sum, e) => sum + (e.event_properties?.duration_seconds || 0),
      0
    );
    const averageSessionDuration =
      completedEvents.length > 0 ? totalDuration / completedEvents.length : 0;

    const isCertified = data?.some((e) => e.event_type === AnalyticsEvent.FIRE_CERTIFIED) || false;

    return {
      modulesStarted,
      modulesCompleted,
      totalScreensViewed,
      averageSessionDuration,
      isCertified,
    };
  } catch (error: any) {
    console.error('Error in getAnalyticsSummary:', error);
    return {
      modulesStarted: 0,
      modulesCompleted: 0,
      totalScreensViewed: 0,
      averageSessionDuration: 0,
      isCertified: false,
      error: error.message,
    };
  }
}

/**
 * Get module-specific metrics
 */
export async function getModuleMetrics(
  userId: string,
  module: FireModule
): Promise<{
  started: boolean;
  completed: boolean;
  screensViewed: number;
  lastAccessedAt?: string;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('fire_training_analytics')
      .select('event_type, event_properties, timestamp')
      .eq('user_id', userId)
      .eq('event_properties->>module', module)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching module metrics:', error);
      return {
        started: false,
        completed: false,
        screensViewed: 0,
        error: error.message,
      };
    }

    const started = data?.some((e) => e.event_type === AnalyticsEvent.MODULE_STARTED) || false;
    const completed = data?.some((e) => e.event_type === AnalyticsEvent.MODULE_COMPLETED) || false;
    const screensViewed =
      data?.filter((e) => e.event_type === AnalyticsEvent.MODULE_SCREEN_VIEWED).length || 0;
    const lastAccessedAt = data?.[0]?.timestamp;

    return {
      started,
      completed,
      screensViewed,
      lastAccessedAt,
    };
  } catch (error: any) {
    console.error('Error in getModuleMetrics:', error);
    return {
      started: false,
      completed: false,
      screensViewed: 0,
      error: error.message,
    };
  }
}

/**
 * Get engagement trends (daily/weekly activity)
 */
export async function getEngagementTrends(
  userId: string,
  days = 30
): Promise<{
  dailyActivity: { date: string; events: number }[];
  peakEngagementTime?: string;
  error?: string;
}> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('fire_training_analytics')
      .select('timestamp')
      .eq('user_id', userId)
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching engagement trends:', error);
      return {
        dailyActivity: [],
        error: error.message,
      };
    }

    // Group events by date
    const dailyMap = new Map<string, number>();
    data?.forEach((event) => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
    });

    const dailyActivity = Array.from(dailyMap.entries())
      .map(([date, events]) => ({ date, events }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate peak engagement time (hour of day)
    const hourCounts = new Map<number, number>();
    data?.forEach((event) => {
      const hour = new Date(event.timestamp).getHours();
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    });

    const peakHour = Array.from(hourCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
    const peakEngagementTime = peakHour !== undefined ? `${peakHour}:00` : undefined;

    return {
      dailyActivity,
      peakEngagementTime,
    };
  } catch (error: any) {
    console.error('Error in getEngagementTrends:', error);
    return {
      dailyActivity: [],
      error: error.message,
    };
  }
}
