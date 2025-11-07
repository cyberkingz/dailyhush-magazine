/**
 * Backdrop Component
 *
 * Semi-transparent overlay for tap-outside-to-cancel functionality.
 *
 * ADDRESSES UX P0 FINDING #2: Tap-outside-to-cancel
 *
 * @module components/mood-widget/Backdrop
 */

import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { colors } from '@/constants/colors';

interface BackdropProps {
  visible: boolean;
  onPress: () => void;
}

// Create animated pressable
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Backdrop component
 * Tap-outside-to-cancel overlay
 */
export function Backdrop({ visible, onPress }: BackdropProps) {
  if (!visible) {
    return null;
  }

  return (
    <AnimatedPressable
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
      onPress={onPress}
      style={styles.backdrop}
      accessibilityRole="button"
      accessibilityLabel="Cancel and close"
      accessibilityHint="Tap outside the widget to close without saving"
    />
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.black + '40', // Lighter dim for subtlety (was 60)
    zIndex: -1, // Behind the widget card
    borderRadius: 24, // Match card's borderRadius to prevent dark corners
  },
});
