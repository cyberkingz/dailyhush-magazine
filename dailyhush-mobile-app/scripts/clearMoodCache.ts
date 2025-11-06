/**
 * Utility script to clear mood cache from AsyncStorage
 * Run this in the app debugger console or add it temporarily to clear cache
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export async function clearMoodCache() {
  try {
    // Clear today's mood cache
    await AsyncStorage.removeItem('@dailyhush/today_mood_cache');
    console.log('✅ Cleared today mood cache');

    // Clear offline queue
    await AsyncStorage.removeItem('@dailyhush/offline_mood_queue');
    console.log('✅ Cleared offline mood queue');

    // List all keys to verify
    const allKeys = await AsyncStorage.getAllKeys();
    console.log('📦 Remaining AsyncStorage keys:', allKeys);

    return true;
  } catch (error) {
    console.error('❌ Failed to clear cache:', error);
    return false;
  }
}

// Auto-run if this file is imported
clearMoodCache();
