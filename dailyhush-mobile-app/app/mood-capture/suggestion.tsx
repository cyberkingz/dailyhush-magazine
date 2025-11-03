/**
 * DailyHush - Suggestion Screen (Step 4)
 *
 * Final step showing a gentle therapeutic suggestion.
 * User can accept or close to complete the flow.
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GentleSuggestion } from '@/components/moodCapture/steps/GentleSuggestion';
import { BackButton, ContinueButton } from '@/components/moodCapture/NavigationButtons';
import { ProgressIndicator } from '@/components/moodCapture/ProgressIndicator';
import { updateMoodEntry } from '@/lib/mood-entries';
import type { Enums } from '@/types/supabase';
import type { Suggestion } from '@/constants/suggestions';
import { useAnalytics } from '@/utils/analytics';
import { useStore } from '@/store/useStore';

export default function SuggestionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const analytics = useAnalytics();
  const { user } = useStore();
  const params = useLocalSearchParams<{
    mood: string;
    moodLabel: string;
    moodEmoji: string;
    intensity: string;
    entryId: string;
    content: string;
  }>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);

  const handleAcceptSuggestion = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
  };

  const handleComplete = async () => {
    if (!params.entryId) {
      // No entry saved yet, just go back
      router.back();
      return;
    }

    setIsSubmitting(true);

    try {
      // Update entry with suggestion acceptance
      await updateMoodEntry(params.entryId, {
        suggested_activity: selectedSuggestion?.id || null,
        suggestion_accepted: !!selectedSuggestion,
      });

      // Track check-in completion
      analytics.track('CHECKIN_COMPLETED', {
        streak_count: user?.current_streak || 0,
        checkin_count: user?.total_check_ins || 0,
      });

      // Navigate back to profile (replace entire mood capture stack)
      router.replace('/profile');
    } catch (error) {
      console.error('Failed to complete mood entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndClose = async () => {
    await handleComplete();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <BackButton onPress={() => router.back()} />
        <View style={styles.progressContainer}>
          <ProgressIndicator currentStep={4} totalSteps={4} />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <GentleSuggestion
          selectedMood={params.mood as Enums<'mood_type'>}
          selectedIntensity={parseInt(params.intensity, 10)}
          onAcceptSuggestion={handleAcceptSuggestion}
        />
      </View>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { paddingBottom: insets.bottom + 20 }]}>
        <ContinueButton
          label="Save & Close"
          onPress={handleSaveAndClose}
          disabled={isSubmitting}
        />
      </View>
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
