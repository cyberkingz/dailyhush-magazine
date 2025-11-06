/**
 * IntensitySlider Component
 *
 * Dual-input slider: gesture dragging OR tappable numbers (accessibility).
 * Includes scale labels and step indicators.
 *
 * ADDRESSES UX P0 FINDING #3: Provides tap alternative to gesture-only slider
 * ADDRESSES UX P0 FINDING #4: Shows scale labels ("Low ← → High")
 *
 * @module components/mood-widget/IntensitySlider
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import type { IntensitySliderProps, IntensityValue } from '@/types/widget.types';
import { useIntensitySlider } from '@/hooks/widget';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/designTokens';
import { ACCESSIBILITY_LABELS } from '@/constants/widgetConfig';

/**
 * IntensitySlider component
 * Gesture slider + tap-to-select buttons (accessibility)
 */
export function IntensitySlider({
  range,
  initialValue,
  onChange,
  visible,
  config,
}: IntensitySliderProps) {
  const [min, max] = range;

  // Use intensity slider hook
  const { currentValue, setValue, panGesture, thumbStyle, animatedStyle } = useIntensitySlider({
    range,
    initialValue,
    sliderWidth: 280,
    onChange,
    enableHaptics: true,
  });

  if (!visible) {
    return null;
  }

  // Generate step values (1-7)
  const steps = Array.from({ length: max - min + 1 }, (_, i) => (min + i) as IntensityValue);

  return (
    <View
      style={styles.container}
      accessibilityRole="adjustable"
      accessibilityLabel={ACCESSIBILITY_LABELS.intensitySlider.slider}
      accessibilityHint={ACCESSIBILITY_LABELS.intensitySlider.sliderHint}
      accessibilityValue={{ min, max, now: currentValue }}
    >
      {/* Title */}
      <Text style={styles.title}>
        Rate your intensity
      </Text>

      {/* Scale labels (UX P0 fix #4) */}
      {config.showScaleLabels && (
        <View style={styles.scaleLabels}>
          <Text style={styles.scaleLabel}>
            {ACCESSIBILITY_LABELS.intensitySlider.scaleLabel.low}
          </Text>
          <Text style={styles.scaleLabel}>
            {ACCESSIBILITY_LABELS.intensitySlider.scaleLabel.high}
          </Text>
        </View>
      )}

      {/* Gesture-based slider (for users who can drag) */}
      {config.enableGesture && (
        <GestureDetector gesture={panGesture}>
          <View style={styles.sliderTrack}>
            {/* Active track (filled portion) */}
            <Animated.View style={[styles.activeTrack, animatedStyle]} />

            {/* Step dots */}
            {config.showIndicators === 'dots' || config.showIndicators === 'both' ? (
              <View style={styles.dots}>
                {steps.map((step) => (
                  <View
                    key={step}
                    style={[
                      styles.dot,
                      currentValue >= step && styles.dotActive,
                    ]}
                    accessible={false}
                  />
                ))}
              </View>
            ) : null}

            {/* Thumb */}
            <Animated.View style={[styles.thumb, thumbStyle]} />
          </View>
        </GestureDetector>
      )}

      {/* Tappable numbers (UX P0 fix #3 - accessibility alternative) */}
      <View style={styles.tapButtons}>
        {steps.map((step) => (
          <Pressable
            key={step}
            onPress={() => {
              setValue(step);
              if (config.showScaleLabels) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
            }}
            style={({ pressed }) => [
              styles.tapButton,
              currentValue === step && styles.tapButtonActive,
              pressed && styles.tapButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={ACCESSIBILITY_LABELS.intensitySlider.stepButton(step)}
            accessibilityState={{ selected: currentValue === step }}
          >
            <Text
              style={[
                styles.tapButtonText,
                currentValue === step && styles.tapButtonTextActive,
              ]}
            >
              {step}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Current value display */}
      <Text style={styles.currentValue}>
        Intensity: {currentValue} / {max}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  scaleLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    opacity: 0.7,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: colors.background.tertiary,
    borderRadius: 4,
    position: 'relative',
    marginBottom: SPACING.lg,
  },
  activeTrack: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 8,
    backgroundColor: colors.lime[500],
    borderRadius: 4,
  },
  dots: {
    position: 'absolute',
    top: -6,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dot: {
    width: 4,
    height: 20,
    backgroundColor: colors.background.border,
    borderRadius: 2,
  },
  dotActive: {
    backgroundColor: colors.lime[500],
  },
  thumb: {
    position: 'absolute',
    top: -8,
    left: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.lime[500],
    borderWidth: 3,
    borderColor: colors.background.primary,
    shadowColor: colors.lime[500],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  tapButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    gap: SPACING.xs,
  },
  tapButton: {
    flex: 1,
    minHeight: 44, // WCAG minimum touch target
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SPACING.sm,
    backgroundColor: colors.background.secondary,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tapButtonActive: {
    backgroundColor: colors.lime[500] + '20',
    borderColor: colors.lime[500],
  },
  tapButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  tapButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  tapButtonTextActive: {
    color: colors.lime[500],
  },
  currentValue: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
