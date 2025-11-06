/**
 * MoodSelector Component
 *
 * Grid of 5 mood choices with staggered entrance animations.
 * Each mood has emoji, label, and selection animation.
 *
 * @module components/mood-widget/MoodSelector
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import type { MoodSelectorProps } from '@/types/widget.types';
import { useMoodSelection } from '@/hooks/widget';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/designTokens';
import { ACCESSIBILITY_LABELS } from '@/constants/widgetConfig';

/**
 * MoodSelector component
 * 5 mood choices with staggered entrance
 */
export function MoodSelector({
  moods,
  onSelect,
  selected,
  visible,
  config,
}: MoodSelectorProps) {
  // Use mood selection hook
  const { selectMood, moodAnimations } = useMoodSelection({
    moods,
    staggerDelay: config.spacing,
    visible,
  });

  if (!visible) {
    return null;
  }

  return (
    <View
      style={styles.container}
      accessibilityRole="radiogroup"
      accessibilityLabel="Select your current mood"
    >
      {config.showLabels && (
        <Text style={styles.instruction}>
          How are you feeling?
        </Text>
      )}

      <View style={[
        styles.grid,
        config.layout === 'horizontal' && styles.horizontal,
      ]}>
        {moods.map((mood) => {
          const isSelected = selected === mood.value;
          const animation = moodAnimations[mood.value];

          return (
            <Animated.View
              key={mood.value}
              style={[styles.moodWrapper, animation?.style]}
            >
              <Pressable
                onPress={() => {
                  if (config.spacing) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }
                  selectMood(mood);
                  onSelect(mood);
                }}
                style={({ pressed }) => [
                  styles.moodButton,
                  isSelected && styles.moodButtonSelected,
                  pressed && styles.moodButtonPressed,
                ]}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={ACCESSIBILITY_LABELS.moodSelector.moodButton(mood.label)}
                accessibilityHint={ACCESSIBILITY_LABELS.moodSelector.moodHint(mood.label)}
              >
                {/* Emoji */}
                <Text style={styles.emoji}>{mood.emoji}</Text>

                {/* Label (if enabled) */}
                {config.showLabels && (
                  <Text style={styles.label}>{mood.label}</Text>
                )}
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: SPACING.lg,
  },
  instruction: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  horizontal: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-around',
  },
  moodWrapper: {
    // Animated wrapper
  },
  moodButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: SPACING.lg,
    backgroundColor: colors.background.secondary,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 72,
    minHeight: 72,
  },
  moodButtonSelected: {
    borderColor: colors.lime[500],
    backgroundColor: colors.lime[500] + '20', // 20% opacity
  },
  moodButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  emoji: {
    fontSize: 32,
  },
  label: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});
