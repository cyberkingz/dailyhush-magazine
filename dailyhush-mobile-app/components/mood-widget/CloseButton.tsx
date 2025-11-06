/**
 * CloseButton Component
 *
 * Top-right X button, always visible when widget is expanded.
 *
 * ADDRESSES UX P0 FINDING #1: Close button always visible
 *
 * @module components/mood-widget/CloseButton
 */

import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/designTokens';
import { ACCESSIBILITY_LABELS } from '@/constants/widgetConfig';

interface CloseButtonProps {
  onPress: () => void;
  style?: any;
}

/**
 * CloseButton component
 * X button to cancel widget
 */
export function CloseButton({ onPress, style }: CloseButtonProps) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={ACCESSIBILITY_LABELS.moodSelector.closeButton}
      accessibilityHint={ACCESSIBILITY_LABELS.moodSelector.closeHint}
    >
      <X size={20} color={colors.text.primary} strokeWidth={2.5} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: SPACING.lg,
    right: SPACING.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary + '80', // 80% opacity
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.9 }],
  },
});
