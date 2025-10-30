/**
 * useSpiral Hook
 * Track and log rumination spirals
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/utils/supabase';
import { useStore } from '@/store/useStore';
import type { SpiralLog } from '@/types';

export function useSpiral() {
  const [isLogging, setIsLogging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useStore();

  /**
   * Log a completed spiral intervention
   */
  const logSpiral = useCallback(
    async (spiral: Omit<SpiralLog, 'spiral_id' | 'user_id'>) => {
      if (!user) {
        setError('User not logged in');
        return null;
      }

      setIsLogging(true);
      setError(null);

      try {
        const spiralLog: Partial<SpiralLog> = {
          ...spiral,
          user_id: user.user_id,
          timestamp: new Date().toISOString(),
        };

        // Insert into Supabase
        const { data, error: supabaseError } = await supabase
          .from('spiral_logs')
          .insert(spiralLog)
          .select()
          .single();

        if (supabaseError) throw supabaseError;

        console.log('Spiral logged successfully:', data);
        return data as SpiralLog;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to log spiral';
        setError(errorMessage);
        console.error('Error logging spiral:', err);
        return null;
      } finally {
        setIsLogging(false);
      }
    },
    [user]
  );

  /**
   * Get recent spirals for the user
   */
  const getRecentSpirals = useCallback(
    async (limit = 10) => {
      if (!user) return [];

      try {
        const { data, error: supabaseError } = await supabase
          .from('spiral_logs')
          .select('*')
          .eq('user_id', user.user_id)
          .order('timestamp', { ascending: false })
          .limit(limit);

        if (supabaseError) throw supabaseError;

        return data as SpiralLog[];
      } catch (err) {
        console.error('Error fetching spirals:', err);
        return [];
      }
    },
    [user]
  );

  /**
   * Get today's spiral count
   */
  const getTodaySpirals = useCallback(async () => {
    if (!user) return { today: 0, thisWeek: 0 };

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      weekAgo.setHours(0, 0, 0, 0);

      // Get today's count
      const { data: todayData, error: todayError } = await supabase
        .from('spiral_logs')
        .select('spiral_id')
        .eq('user_id', user.user_id)
        .gte('timestamp', today.toISOString());

      if (todayError) throw todayError;

      // Get this week's count
      const { data: weekData, error: weekError } = await supabase
        .from('spiral_logs')
        .select('spiral_id')
        .eq('user_id', user.user_id)
        .gte('timestamp', weekAgo.toISOString());

      if (weekError) throw weekError;

      return {
        today: todayData?.length || 0,
        thisWeek: weekData?.length || 0,
      };
    } catch (err) {
      console.error('Error getting today spirals:', err);
      return { today: 0, thisWeek: 0 };
    }
  }, [user]);

  /**
   * Get spiral statistics for insights
   */
  const getSpiralStats = useCallback(
    async (days = 7) => {
      if (!user) return null;

      try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data, error: supabaseError } = await supabase
          .from('spiral_logs')
          .select('*')
          .eq('user_id', user.user_id)
          .gte('timestamp', startDate.toISOString());

        if (supabaseError) throw supabaseError;

        const spirals = data as SpiralLog[];

        // Calculate stats
        const totalSpirals = spirals.length;
        const interrupted = spirals.filter((s) => s.interrupted).length;
        const avgDuration = spirals.reduce((sum, s) => sum + s.duration_seconds, 0) / totalSpirals;

        // Most common trigger
        const triggers = spirals
          .filter((s) => s.trigger)
          .reduce(
            (acc, s) => {
              acc[s.trigger!] = (acc[s.trigger!] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>
          );

        const mostCommonTrigger =
          Object.entries(triggers).sort(([, a], [, b]) => b - a)[0]?.[0] || 'Unknown';

        // Peak time
        const hours = spirals.map((s) => new Date(s.timestamp).getHours());
        const peakHour = hours.reduce(
          (acc, hour) => {
            acc[hour] = (acc[hour] || 0) + 1;
            return acc;
          },
          {} as Record<number, number>
        );

        const peakTime = Object.entries(peakHour).sort(([, a], [, b]) => b - a)[0]?.[0];

        return {
          totalSpirals,
          interrupted,
          avgDuration,
          mostCommonTrigger,
          peakTime: peakTime ? `${peakTime}:00` : 'Unknown',
        };
      } catch (err) {
        console.error('Error getting spiral stats:', err);
        return null;
      }
    },
    [user]
  );

  return {
    logSpiral,
    getRecentSpirals,
    getTodaySpirals,
    getSpiralStats,
    isLogging,
    error,
  };
}
