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
import type { Enums } from '@/types/supabase';

export default function WritingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    mood: string;
    moodLabel: string;
    moodEmoji: string;
    intensity: string;
  }>();

  const [content, setContent] = useState('');
  const [entryId, setEntryId] = useState<string | undefined>();

  const handleAutoSave = async (text: string) => {
    if (!params.mood || !params.intensity) {
      return;
    }

    try {
      const entryData = {
        mood: params.mood as Enums<'mood_type'>,
        intensity: parseInt(params.intensity, 10),
        content: text || null,
      };

      if (entryId) {
        // Update existing entry
        await updateMoodEntry(entryId, entryData);
      } else {
        // Create draft entry
        const newEntry = await createMoodEntry(entryData);
        setEntryId(newEntry.id);
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
      throw error;
    }
  };

  const handleContinue = () => {
    // Navigate to suggestion screen with all data
    router.push({
      pathname: '/mood-capture/suggestion',
      params: {
        mood: params.mood,
        moodLabel: params.moodLabel,
        moodEmoji: params.moodEmoji,
        intensity: params.intensity,
        entryId: entryId || '',
        content,
      },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
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
          onSave={handleAutoSave}
          enableVoice
          showCharacterCount
        />
      </View>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { paddingBottom: insets.bottom + 20 }]}>
        <ContinueButton label="Continue" onPress={handleContinue} />
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
    paddingHorizontal: 16,
    marginBottom: 12,
    height: 56,
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
