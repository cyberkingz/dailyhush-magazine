/**
 * Nœma - Prompt Chips Component
 *
 * Displays gentle writing prompts as tappable chips to help users begin journaling.
 * Filters prompts based on selected mood to show most relevant suggestions.
 *
 * Features:
 * - Mood-aware filtering (shows 3-8 relevant prompts)
 * - Tap to insert prompt text
 * - Pill-shaped design with haptic feedback
 * - WCAG AAA touch targets (44px min height)
 *
 * @see MOOD_CAPTURE_ROADMAP.md
 */

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { PROMPT_CHIPS, HAPTICS } from '@/constants/moodCaptureDesign';
import { getPromptsForMood, type WritingPrompt } from '@/constants/moodOptions';
import type { Enums } from '@/types/supabase';

// ============================================================================
// TYPES
// ============================================================================

interface PromptChipsProps {
  /**
   * Current selected mood (optional)
   * If provided, filters prompts to show most relevant ones
   */
  mood?: Enums<'mood_type'>;

  /**
   * Callback when a prompt is selected
   * Receives the full prompt text to be inserted
   */
  onPromptSelect: (promptText: string) => void;

  /**
   * Maximum number of prompts to show
   * @default 8
   */
  maxChips?: number;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Prompt chips for writing assistance
 * Shows mood-relevant prompts that can be tapped to insert
 */
export function PromptChips({ mood, onPromptSelect, maxChips = 8 }: PromptChipsProps) {
  // Get filtered prompts based on mood
  const prompts = getPromptsForMood(mood);

  // Limit to maxChips
  const displayedPrompts = prompts.slice(0, maxChips);

  return (
    <View
      style={styles.container}
      accessibilityRole="list"
      accessibilityLabel="Writing prompts to help you get started"
      accessibilityHint="Select a prompt to insert it into your journal entry">
      {displayedPrompts.map((prompt) => (
        <PromptChip key={prompt.id} prompt={prompt} onPress={() => onPromptSelect(prompt.text)} />
      ))}
    </View>
  );
}

// ============================================================================
// PROMPT CHIP
// ============================================================================

interface PromptChipProps {
  prompt: WritingPrompt;
  onPress: () => void;
}

function PromptChip({ prompt, onPress }: PromptChipProps) {
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle[HAPTICS.buttons.chip]);
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.chip}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Insert prompt: ${prompt.text}`}
      accessibilityHint="Double tap to add this prompt to your journal">
      <Text style={styles.chipText}>{prompt.text}</Text>
    </TouchableOpacity>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    ...PROMPT_CHIPS.container,
  },
  chip: {
    ...PROMPT_CHIPS.chip,
  },
  chipText: {
    ...PROMPT_CHIPS.text,
  },
});
