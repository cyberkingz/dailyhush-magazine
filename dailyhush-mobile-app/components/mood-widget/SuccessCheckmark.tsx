/**
 * SuccessCheckmark Component
 *
 * Animated SVG checkmark that draws on screen with celebration effects.
 * Uses useSuccessAnimation hook for path drawing, rotation, and scale bounce.
 *
 * @module components/mood-widget/SuccessCheckmark
 */

import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import type { SuccessCheckmarkProps } from '@/types/widget.types';
import { useSuccessAnimation } from '@/hooks/widget';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/designTokens';

// Create animated SVG path and Text
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedText = Animated.createAnimatedComponent(Animated.Text);

/**
 * SuccessCheckmark component
 * Animated checkmark with glow effect
 */
export function SuccessCheckmark({ visible, onComplete, config }: SuccessCheckmarkProps) {
  // Opacity for fade-out
  const opacity = useSharedValue(1);

  // Track if animation has been triggered for current visibility cycle
  const hasTriggered = useRef(false);

  // Use success animation hook
  const { trigger, animatedProps, animatedStyle } = useSuccessAnimation({
    duration: config.duration || 400,
    enableHaptics: true,
    showGlow: config.showGlow,
    onComplete: () => {
      // Skip fade-out animation to avoid nested Reanimated conflicts
      console.log('[SuccessCheckmark] Animation complete, calling parent onComplete');
      onComplete?.();
    },
  });

  // Container fade animation
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Trigger animation when visible (only once per visibility cycle)
  useEffect(() => {
    if (visible && !hasTriggered.current) {
      console.log('[SuccessCheckmark] Triggering animation (first time)');
      hasTriggered.current = true;
      opacity.value = 1; // Reset opacity
      trigger();
    } else if (visible && hasTriggered.current) {
      console.log('[SuccessCheckmark] Skipping trigger (already triggered)');
    } else if (!visible) {
      // Reset flag when component becomes invisible
      hasTriggered.current = false;
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Animated checkmark SVG */}
      <Animated.View style={[styles.svgContainer, animatedStyle]}>
        <Svg width={64} height={64} viewBox="0 0 64 64">
          <AnimatedPath
            d="M 16,32 L 28,44 L 48,20"
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
      <AnimatedText style={styles.message} accessibilityLiveRegion="polite">
        {config.message}
      </AnimatedText>
    </Animated.View>
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.lime[500],
    textAlign: 'center',
    opacity: 0.9,
  },
});
