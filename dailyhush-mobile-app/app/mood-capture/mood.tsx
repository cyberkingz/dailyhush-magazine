/**
 * DailyHush - Mood Selection Screen (Step 1)
 *
 * First step where users select their current mood from 5 options.
 * Full screen with all moods visible.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MoodSelector } from '@/components/moodCapture/steps/MoodSelector';
import { ProgressIndicator } from '@/components/moodCapture/ProgressIndicator';
import type { MoodOption } from '@/constants/moodOptions';
import { useAnalytics } from '@/utils/analytics';

export default function MoodScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const analytics = useAnalytics();

  // Track check-in start
  useEffect(() => {
    analytics.track('CHECKIN_STARTED');
  }, [analytics]);

  const handleMoodSelect = (mood: MoodOption) => {
    // Navigate to intensity screen with mood data
    router.push({
      pathname: '/mood-capture/intensity',
      params: {
        mood: mood.id,
        moodLabel: mood.label,
        moodEmoji: mood.emoji,
      },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <MoodSelector onMoodSelect={handleMoodSelect} autoAdvance />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
