/**
 * SuccessCheckmark Component
 *
 * Animated SVG checkmark that draws on screen with celebration effects.
 * Uses useSuccessAnimation hook for path drawing, rotation, and scale bounce.
 *
 * @module components/mood-widget/SuccessCheckmark
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import type { SuccessCheckmarkProps } from '@/types/widget.types';
import { useSuccessAnimation } from '@/hooks/widget';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/designTokens';

// Create animated SVG path
const AnimatedPath = Animated.createAnimatedComponent(Path);

/**
 * SuccessCheckmark component
 * Animated checkmark with glow effect
 */
export function SuccessCheckmark({
  visible,
  onComplete,
  config,
}: SuccessCheckmarkProps) {
  // Use success animation hook
  const { trigger, animatedProps, animatedStyle } = useSuccessAnimation({
    duration: config.duration || 400,
    enableHaptics: true,
    showGlow: config.showGlow,
    onComplete,
  });

  // Trigger animation when visible
  useEffect(() => {
    if (visible) {
      trigger();
    }
  }, [visible, trigger]);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Animated checkmark SVG */}
      <Animated.View style={[styles.svgContainer, animatedStyle]}>
        <Svg width={80} height={80} viewBox="0 0 80 80">
          <AnimatedPath
            d="M 20,40 L 35,55 L 60,25"
            stroke={config.color}
            strokeWidth={config.strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={100}
            animatedProps={animatedProps}
          />
        </Svg>
      </Animated.View>

      {/* Success message */}
      <Text style={styles.message} accessibilityLiveRegion="polite">
        {config.message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  svgContainer: {
    marginBottom: SPACING.lg,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.lime[500],
    textAlign: 'center',
  },
});
