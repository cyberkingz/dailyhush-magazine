/**
 * LoadingOverlay Component
 *
 * Semi-transparent overlay with spinner during submission.
 *
 * ADDRESSES UX P0 FINDING #8: Loading states during submission
 *
 * @module components/mood-widget/LoadingOverlay
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/designTokens';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

/**
 * LoadingOverlay component
 * Shows spinner during async operations
 */
export function LoadingOverlay({
  visible,
  message = 'Saving your mood...',
}: LoadingOverlayProps) {
  if (!visible) {
    return null;
  }

  return (
    <View
      style={styles.overlay}
      accessible={true}
      accessibilityLabel={message}
      accessibilityLiveRegion="polite"
    >
      <View style={styles.content}>
        <ActivityIndicator size="large" color={colors.lime[500]} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background.primary + 'CC', // 80% opacity
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  content: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  message: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
});
