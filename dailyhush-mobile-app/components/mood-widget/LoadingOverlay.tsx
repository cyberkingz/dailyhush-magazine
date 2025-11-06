/**
 * LoadingOverlay Component
 *
 * Semi-transparent overlay with spinner during submission.
 * Shows context-aware messages based on current operation.
 *
 * ADDRESSES UX P0 FINDING #8: Loading states during submission
 *
 * @module components/mood-widget/LoadingOverlay
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/designTokens';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

/**
 * LoadingOverlay component
 * Shows spinner during async operations with encouraging messages
 */
export function LoadingOverlay({
  visible,
  message = 'Saving your mood...',
}: LoadingOverlayProps) {
  const [displayMessage, setDisplayMessage] = useState(message);

  // Update message after 2 seconds if still loading
  useEffect(() => {
    if (!visible) return;

    setDisplayMessage(message);

    const timer = setTimeout(() => {
      setDisplayMessage('Almost there...');
    }, 2000);

    return () => clearTimeout(timer);
  }, [visible, message]);

  if (!visible) {
    return null;
  }

  return (
    <View
      style={styles.overlay}
      accessible={true}
      accessibilityLabel={displayMessage}
      accessibilityLiveRegion="polite">
      <View style={styles.content}>
        <ActivityIndicator size="large" color={colors.lime[500]} />
        <Text style={styles.message}>{displayMessage}</Text>
        <Text style={styles.submessage}>This won't take long</Text>
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
    gap: SPACING.sm,
  },
  message: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '600',
    marginTop: SPACING.sm,
  },
  submessage: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: '400',
    marginTop: SPACING.xs,
  },
});
