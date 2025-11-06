/**
 * ProgressIndicator Component
 *
 * Shows current step in the mood logging flow (Step 1 of 3, etc.)
 *
 * @module components/mood-widget/ProgressIndicator
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/designTokens';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  visible: boolean;
}

/**
 * ProgressIndicator component
 * Step counter (dots or text)
 */
export function ProgressIndicator({
  currentStep,
  totalSteps,
  visible,
}: ProgressIndicatorProps) {
  if (!visible) {
    return null;
  }

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel={`Step ${currentStep} of ${totalSteps}`}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 1, max: totalSteps, now: currentStep }}
    >
      {/* Dot indicators */}
      <View style={styles.dots}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index + 1 === currentStep && styles.dotActive,
              index + 1 < currentStep && styles.dotCompleted,
            ]}
            accessible={false}
          />
        ))}
      </View>

      {/* Text indicator */}
      <Text style={styles.text}>
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  dots: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.background.border,
  },
  dotActive: {
    backgroundColor: colors.lime[500],
    width: 24, // Elongate active dot
  },
  dotCompleted: {
    backgroundColor: colors.lime[600],
  },
  text: {
    fontSize: 12,
    color: colors.text.secondary,
    opacity: 0.7,
  },
});
