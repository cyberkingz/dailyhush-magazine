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
  if (!visible) {
    return null;
  }

  return (
    <View
      style={styles.container}
      accessibilityRole="radiogroup"
      accessibilityLabel="Select your current mood"
    >
      <Text style={styles.headline}>
        How are you feeling?
      </Text>

      <View style={styles.column}>
        {moods.map((mood) => {
          const isSelected = selected === mood.value;

          return (
            <View
              key={mood.value}
              style={styles.moodWrapper}
            >
              <Pressable
                onPress={() => {
                  if (config.spacing) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  }
                  onSelect(mood);
                }}
                style={{
                  backgroundColor: isSelected ? '#7AF859' : '#65D948',
                  padding: 16,
                  borderRadius: 999,
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <mood.icon
                  size={20}
                  color="#0a1f1a"
                  strokeWidth={2.5}
                />
                <Text style={{ color: '#0a1f1a', fontSize: 16, fontWeight: '600', marginLeft: 12 }}>
                  {mood.label}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  headline: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  column: {
    flexDirection: 'column',
    width: '100%',
  },
  moodWrapper: {
    width: '100%',
    marginBottom: 12,
  },
  moodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#65D948',
    padding: 16,
    borderRadius: 999,
    width: '100%',
  },
  moodButtonSelected: {
    backgroundColor: '#7AF859',
  },
  moodButtonPressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0a1f1a',
    marginLeft: 12,
  },
});
