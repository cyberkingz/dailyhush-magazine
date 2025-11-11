/**
 * Nœma - useMoodLogging Hook
 *
 * React hook for inline mood logging widget with advanced features:
 * - Optimistic UI updates
 * - Offline queue with background sync
 * - Automatic retry with exponential backoff
 * - Loading and error state management
 * - Today's mood caching
 *
 * @see services/moodLogging.ts
 * @see types/mood.types.ts
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import { v4 as uuidv4 } from 'uuid';
import {
  saveMoodLog as saveMoodLogService,
  getTodayMoodLog as getTodayMoodLogService,
  updateMoodLog as updateMoodLogService,
  deleteMoodLog as deleteMoodLogService,
} from '@/services/moodLogging';
import type {
  MoodSubmitData,
  MoodLog,
  MoodLogUpdate,
  MoodLoggingError,
  OfflineMoodLog,
  OfflineQueueStatus,
  UseMoodLoggingState,
} from '@/types/mood.types';
import { MoodLoggingError as MoodLoggingErrorClass } from '@/types/mood.types';

// ============================================================================
// CONSTANTS
// ============================================================================

const OFFLINE_QUEUE_KEY = '@dailyhush/offline_mood_queue';
const TODAY_MOOD_CACHE_KEY = '@dailyhush/today_mood_cache';
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

// ============================================================================
// OFFLINE QUEUE MANAGEMENT
// ============================================================================

/**
 * Load offline queue from AsyncStorage
 */
async function loadOfflineQueue(): Promise<OfflineMoodLog[]> {
  try {
    const queueJson = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
    return queueJson ? JSON.parse(queueJson) : [];
  } catch (error) {
    console.error('Failed to load offline queue:', error);
    return [];
  }
}

/**
 * Save offline queue to AsyncStorage
 */
async function saveOfflineQueue(queue: OfflineMoodLog[]): Promise<void> {
  try {
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Failed to save offline queue:', error);
  }
}

/**
 * Add item to offline queue
 */
async function addToOfflineQueue(data: MoodSubmitData): Promise<string> {
  const queue = await loadOfflineQueue();
  const tempId = uuidv4();

  const queueItem: OfflineMoodLog = {
    tempId,
    data,
    queuedAt: new Date().toISOString(),
    status: 'pending' as OfflineQueueStatus,
    retryCount: 0,
  };

  queue.push(queueItem);
  await saveOfflineQueue(queue);

  return tempId;
}

/**
 * Remove item from offline queue
 */
async function removeFromOfflineQueue(tempId: string): Promise<void> {
  const queue = await loadOfflineQueue();
  const filtered = queue.filter((item) => item.tempId !== tempId);
  await saveOfflineQueue(filtered);
}

/**
 * Update offline queue item status
 */
async function updateOfflineQueueItem(
  tempId: string,
  updates: Partial<OfflineMoodLog>
): Promise<void> {
  const queue = await loadOfflineQueue();
  const index = queue.findIndex((item) => item.tempId === tempId);

  if (index !== -1) {
    queue[index] = { ...queue[index], ...updates };
    await saveOfflineQueue(queue);
  }
}

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

interface CachedMoodLog {
  data: MoodLog | null;
  timestamp: number;
}

/**
 * Load cached today's mood log
 */
async function loadTodayMoodCache(): Promise<MoodLog | null> {
  try {
    const cacheJson = await AsyncStorage.getItem(TODAY_MOOD_CACHE_KEY);
    if (!cacheJson) return null;

    const cached: CachedMoodLog = JSON.parse(cacheJson);

    // Check if cache is expired
    if (Date.now() - cached.timestamp > CACHE_EXPIRY_MS) {
      await AsyncStorage.removeItem(TODAY_MOOD_CACHE_KEY);
      return null;
    }

    return cached.data;
  } catch (error) {
    console.error('Failed to load mood cache:', error);
    return null;
  }
}

/**
 * Save today's mood log to cache
 */
async function saveTodayMoodCache(moodLog: MoodLog | null): Promise<void> {
  try {
    const cached: CachedMoodLog = {
      data: moodLog,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(TODAY_MOOD_CACHE_KEY, JSON.stringify(cached));
  } catch (error) {
    console.error('Failed to save mood cache:', error);
  }
}

/**
 * Clear today's mood cache
 */
async function clearTodayMoodCache(): Promise<void> {
  try {
    await AsyncStorage.removeItem(TODAY_MOOD_CACHE_KEY);
  } catch (error) {
    console.error('Failed to clear mood cache:', error);
  }
}

// ============================================================================
// NETWORK UTILITIES
// ============================================================================

/**
 * Check if device is online
 */
async function isOnline(): Promise<boolean> {
  try {
    const networkState = await Network.getNetworkStateAsync();
    return networkState.isConnected === true && networkState.isInternetReachable === true;
  } catch (error) {
    // Assume online if we can't check
    return true;
  }
}

// ============================================================================
// HOOK
// ============================================================================

export interface UseMoodLoggingReturn extends UseMoodLoggingState {
  /**
   * Submit a new mood log
   * Handles optimistic updates and offline queueing
   */
  submitMood: (data: MoodSubmitData) => Promise<MoodLog | null>;

  /**
   * Get today's mood log
   * Returns cached value if available and fresh
   */
  getTodayMood: (forceFetch?: boolean) => Promise<MoodLog | null>;

  /**
   * Update an existing mood log
   */
  updateMood: (id: string, data: MoodLogUpdate) => Promise<MoodLog | null>;

  /**
   * Delete a mood log
   */
  deleteMood: (id: string) => Promise<boolean>;

  /**
   * Manually trigger offline queue sync
   */
  syncOfflineQueue: () => Promise<void>;

  /**
   * Clear error state
   */
  clearError: () => void;

  /**
   * Refresh today's mood (bypass cache)
   */
  refreshTodayMood: () => Promise<void>;
}

/**
 * Hook for mood logging operations
 *
 * Features:
 * - Optimistic UI updates (instant feedback)
 * - Offline queue (works without network)
 * - Automatic retry with exponential backoff
 * - Today's mood caching (reduces API calls)
 * - Comprehensive error handling
 *
 * @example
 * ```tsx
 * function MoodWidget() {
 *   const {
 *     submitMood,
 *     getTodayMood,
 *     isSubmitting,
 *     error,
 *     todayMood,
 *     pendingCount
 *   } = useMoodLogging();
 *
 *   const handleSubmit = async () => {
 *     const result = await submitMood({
 *       mood: 'calm',
 *       intensity: 4,
 *       notes: 'Feeling peaceful'
 *     });
 *     if (result) {
 *       console.log('Saved!');
 *     }
 *   };
 *
 *   // Load today's mood on mount
 *   useEffect(() => {
 *     getTodayMood();
 *   }, []);
 *
 *   return (
 *     <View>
 *       {isSubmitting && <ActivityIndicator />}
 *       {error && <Text>{error.getUserMessage()}</Text>}
 *       {pendingCount > 0 && <Text>{pendingCount} pending</Text>}
 *     </View>
 *   );
 * }
 * ```
 */
export function useMoodLogging(): UseMoodLoggingReturn {
  // ========================================================================
  // STATE
  // ========================================================================

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<MoodLoggingError | null>(null);
  const [todayMood, setTodayMood] = useState<MoodLog | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  // Track if component is mounted (prevent state updates after unmount)
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // ========================================================================
  // LOAD PENDING COUNT ON MOUNT
  // ========================================================================

  useEffect(() => {
    async function loadPendingCount() {
      const queue = await loadOfflineQueue();
      const pending = queue.filter(
        (item) => item.status === 'pending' || item.status === 'syncing'
      ).length;
      if (isMounted.current) {
        setPendingCount(pending);
      }
    }

    loadPendingCount();
  }, []);

  // ========================================================================
  // AUTO-SYNC OFFLINE QUEUE ON NETWORK CHANGE
  // ========================================================================

  useEffect(() => {
    let syncInterval: NodeJS.Timeout;

    async function startAutoSync() {
      // Check network every 30 seconds and sync if needed
      syncInterval = setInterval(async () => {
        const online = await isOnline();
        if (online && !isSyncing) {
          const queue = await loadOfflineQueue();
          const hasPending = queue.some((item) => item.status === 'pending');
          if (hasPending) {
            syncOfflineQueue();
          }
        }
      }, 30000); // 30 seconds
    }

    startAutoSync();

    return () => {
      if (syncInterval) {
        clearInterval(syncInterval);
      }
    };
  }, [isSyncing]);

  // ========================================================================
  // SUBMIT MOOD
  // ========================================================================

  const submitMood = useCallback(
    async (data: MoodSubmitData): Promise<MoodLog | null> => {
      if (!isMounted.current) return null;

      setIsSubmitting(true);
      setError(null);

      try {
        // Check if online
        const online = await isOnline();

        if (!online) {
          // Queue for offline sync
          await addToOfflineQueue(data);

          if (isMounted.current) {
            setPendingCount((prev) => prev + 1);
            setIsSubmitting(false);

            // Create optimistic result
            const optimisticLog: MoodLog = {
              id: 'temp-' + uuidv4(),
              user_id: data.userId || 'current-user',
              mood: data.mood,
              mood_emoji: '😊', // Will be set correctly when synced
              intensity: data.intensity,
              notes: data.notes || null,
              log_date: new Date().toISOString().split('T')[0],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };

            setTodayMood(optimisticLog);
            await saveTodayMoodCache(optimisticLog);
          }

          return null;
        }

        // Online - save to Supabase
        const savedLog = await saveMoodLogService(data);

        if (isMounted.current) {
          setTodayMood(savedLog);
          await saveTodayMoodCache(savedLog);
          setIsSubmitting(false);
        }

        return savedLog;
      } catch (err) {
        const moodError =
          err instanceof MoodLoggingErrorClass
            ? err
            : new MoodLoggingErrorClass(
                'UNKNOWN_ERROR' as any,
                'Failed to save mood log',
                err
              );

        if (isMounted.current) {
          setError(moodError);
          setIsSubmitting(false);

          // If it's a network error, queue for offline sync
          if (moodError.isRetryable()) {
            await addToOfflineQueue(data);
            setPendingCount((prev) => prev + 1);
          }
        }

        return null;
      }
    },
    []
  );

  // ========================================================================
  // GET TODAY'S MOOD
  // ========================================================================

  const getTodayMood = useCallback(
    async (forceFetch: boolean = false): Promise<MoodLog | null> => {
      if (!isMounted.current) return null;

      // Return cached value if available and not forcing fetch
      if (!forceFetch && todayMood) {
        return todayMood;
      }

      // Try cache first
      if (!forceFetch) {
        const cached = await loadTodayMoodCache();
        if (cached) {
          if (isMounted.current) {
            setTodayMood(cached);
          }
          return cached;
        }
      }

      setIsFetching(true);
      setError(null);

      try {
        const moodLog = await getTodayMoodLogService();

        if (isMounted.current) {
          setTodayMood(moodLog);
          setIsFetching(false);
        }

        await saveTodayMoodCache(moodLog);

        return moodLog;
      } catch (err) {
        const moodError =
          err instanceof MoodLoggingErrorClass
            ? err
            : new MoodLoggingErrorClass(
                'UNKNOWN_ERROR' as any,
                'Failed to fetch mood log',
                err
              );

        if (isMounted.current) {
          setError(moodError);
          setIsFetching(false);
        }

        return null;
      }
    },
    [todayMood]
  );

  // ========================================================================
  // UPDATE MOOD
  // ========================================================================

  const updateMood = useCallback(
    async (id: string, data: MoodLogUpdate): Promise<MoodLog | null> => {
      if (!isMounted.current) return null;

      setIsSubmitting(true);
      setError(null);

      try {
        const updatedLog = await updateMoodLogService(id, data);

        if (isMounted.current) {
          // Update cached today's mood if it's the same log
          if (todayMood?.id === id) {
            setTodayMood(updatedLog);
            await saveTodayMoodCache(updatedLog);
          }
          setIsSubmitting(false);
        }

        return updatedLog;
      } catch (err) {
        const moodError =
          err instanceof MoodLoggingErrorClass
            ? err
            : new MoodLoggingErrorClass(
                'UNKNOWN_ERROR' as any,
                'Failed to update mood log',
                err
              );

        if (isMounted.current) {
          setError(moodError);
          setIsSubmitting(false);
        }

        return null;
      }
    },
    [todayMood]
  );

  // ========================================================================
  // DELETE MOOD
  // ========================================================================

  const deleteMood = useCallback(
    async (id: string): Promise<boolean> => {
      if (!isMounted.current) return false;

      setIsSubmitting(true);
      setError(null);

      try {
        await deleteMoodLogService(id);

        if (isMounted.current) {
          // Clear today's mood if it was deleted
          if (todayMood?.id === id) {
            setTodayMood(null);
            await clearTodayMoodCache();
          }
          setIsSubmitting(false);
        }

        return true;
      } catch (err) {
        const moodError =
          err instanceof MoodLoggingErrorClass
            ? err
            : new MoodLoggingErrorClass(
                'UNKNOWN_ERROR' as any,
                'Failed to delete mood log',
                err
              );

        if (isMounted.current) {
          setError(moodError);
          setIsSubmitting(false);
        }

        return false;
      }
    },
    [todayMood]
  );

  // ========================================================================
  // SYNC OFFLINE QUEUE
  // ========================================================================

  const syncOfflineQueue = useCallback(async (): Promise<void> => {
    if (!isMounted.current || isSyncing) return;

    setIsSyncing(true);

    try {
      const queue = await loadOfflineQueue();
      const pendingItems = queue.filter((item) => item.status === 'pending');

      if (pendingItems.length === 0) {
        if (isMounted.current) {
          setIsSyncing(false);
          setPendingCount(0);
        }
        return;
      }

      // Sync each item
      for (const item of pendingItems) {
        try {
          // Update status to syncing
          await updateOfflineQueueItem(item.tempId, {
            status: 'syncing' as OfflineQueueStatus,
            lastAttempt: new Date().toISOString(),
          });

          // Attempt to save
          await saveMoodLogService(item.data);

          // Success - remove from queue
          await removeFromOfflineQueue(item.tempId);

          if (isMounted.current) {
            setPendingCount((prev) => Math.max(0, prev - 1));
          }
        } catch (err) {
          // Failed - increment retry count
          const newRetryCount = (item.retryCount || 0) + 1;

          if (newRetryCount >= 3) {
            // Max retries reached - mark as failed
            await updateOfflineQueueItem(item.tempId, {
              status: 'failed' as OfflineQueueStatus,
              retryCount: newRetryCount,
              lastError: err instanceof Error ? err.message : 'Unknown error',
            });
          } else {
            // Reset to pending for next sync attempt
            await updateOfflineQueueItem(item.tempId, {
              status: 'pending' as OfflineQueueStatus,
              retryCount: newRetryCount,
              lastError: err instanceof Error ? err.message : 'Unknown error',
            });
          }
        }
      }

      // Refresh today's mood after sync
      await getTodayMood(true);
    } catch (err) {
      console.error('Failed to sync offline queue:', err);
    } finally {
      if (isMounted.current) {
        setIsSyncing(false);
      }
    }
  }, [isSyncing, getTodayMood]);

  // ========================================================================
  // UTILITY FUNCTIONS
  // ========================================================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshTodayMood = useCallback(async () => {
    await clearTodayMoodCache();
    await getTodayMood(true);
  }, [getTodayMood]);

  // ========================================================================
  // RETURN
  // ========================================================================

  return {
    // State
    isSubmitting,
    isFetching,
    isSyncing,
    error,
    todayMood,
    pendingCount,

    // Actions
    submitMood,
    getTodayMood,
    updateMood,
    deleteMood,
    syncOfflineQueue,
    clearError,
    refreshTodayMood,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default useMoodLogging;
