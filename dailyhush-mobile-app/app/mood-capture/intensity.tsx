/**
 * DailyHush - Intensity Rating Screen (Step 2)
 *
 * Second step where users rate the intensity of their selected mood.
 * Shows 1-5 scale with labels.
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IntensityScale } from '@/components/moodCapture/steps/IntensityScale';
import { BackButton, ContinueButton } from '@/components/moodCapture/NavigationButtons';
import { ProgressIndicator } from '@/components/moodCapture/ProgressIndicator';
import type { Enums } from '@/types/supabase';

export default function IntensityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    mood: string;
    moodLabel: string;
    moodEmoji: string;
  }>();

  const [selectedIntensity, setSelectedIntensity] = useState<number | undefined>();

  const handleContinue = () => {
    if (!selectedIntensity) return;

    // Navigate to writing screen with accumulated data
    router.push({
      pathname: '/mood-capture/writing',
      params: {
        mood: params.mood,
        moodLabel: params.moodLabel,
        moodEmoji: params.moodEmoji,
        intensity: selectedIntensity.toString(),
      },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <BackButton onPress={() => router.back()} />
        <View style={styles.progressContainer}>
          <ProgressIndicator currentStep={2} totalSteps={4} />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <IntensityScale
          selectedMood={params.mood as Enums<'mood_type'>}
          selectedIntensity={selectedIntensity}
          onIntensitySelect={setSelectedIntensity}
          autoAdvance={false}
        />
      </View>

      {/* Bottom Actions */}
      {selectedIntensity && (
        <View style={[styles.bottomActions, { paddingBottom: insets.bottom + 20 }]}>
          <ContinueButton label="Continue" onPress={handleContinue} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    height: 44,
    position: 'relative',
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  bottomActions: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});
