/**
 * DailyHush - Writing Screen (Step 3)
 *
 * Third step where users can write or record their thoughts.
 * Optional step with auto-save functionality.
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FreeWriting } from '@/components/moodCapture/steps/FreeWriting';
import { BackButton, ContinueButton } from '@/components/moodCapture/NavigationButtons';
import { ProgressIndicator } from '@/components/moodCapture/ProgressIndicator';
import { createMoodEntry, updateMoodEntry } from '@/lib/mood-entries';
import { useUser } from '@/store/useStore';
import { MoodEntryStatus, MoodType } from '@/types/mood-entries';
import type { Enums } from '@/types/supabase';

export default function WritingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useUser();
  const params = useLocalSearchParams<{
    mood: string;
    moodLabel: string;
    moodEmoji: string;
    intensity: string;
  }>();

  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleContinue = async () => {
    if (!params.mood || !params.intensity || !user?.user_id) return;

    setIsSaving(true);

    try {
      // Step 1: Create draft mood entry
      const entry = await createMoodEntry(user.user_id);

      // Step 2: Update entry with mood, intensity, and journal text
      await updateMoodEntry(entry.id, {
        id: entry.id,
        mood_type: params.mood as MoodType,
        mood_emoji: params.moodEmoji,
        intensity_rating: parseInt(params.intensity, 10),
        journal_text: content || '',
        status: MoodEntryStatus.DRAFT,
      });

      // Navigate to suggestion screen with saved entry
      router.push({
        pathname: '/mood-capture/suggestion',
        params: {
          mood: params.mood,
          moodLabel: params.moodLabel,
          moodEmoji: params.moodEmoji,
          intensity: params.intensity,
          entryId: entry.id,
          content,
        },
      });
    } catch (error) {
      console.error('Failed to save entry:', error);
      setIsSaving(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <BackButton onPress={() => router.back()} />
        <View style={styles.progressContainer}>
          <ProgressIndicator currentStep={3} totalSteps={4} />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <FreeWriting
          selectedMood={params.mood as Enums<'mood_type'>}
          content={content}
          onContentChange={setContent}
          showCharacterCount
        />
      </View>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { paddingBottom: insets.bottom + 20 }]}>
        <ContinueButton
          label={isSaving ? "Saving..." : "Continue"}
          onPress={handleContinue}
          disabled={isSaving}
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
