/**
 * OfflineIndicator Component
 *
 * Shows a subtle banner when the user is offline.
 * Informs that mood will be queued and synced when back online.
 *
 * @module components/mood-widget/OfflineIndicator
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/designTokens';

interface OfflineIndicatorProps {
  visible: boolean;
}

/**
 * OfflineIndicator component
 * Shows when device is offline
 */
export function OfflineIndicator({ visible }: OfflineIndicatorProps) {
  if (!visible) {
    return null;
  }

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel="You are offline. Your mood will be saved when you reconnect."
      accessibilityRole="alert">
      <WifiOff size={16} color={colors.status.warning} strokeWidth={2} />
      <Text style={styles.text}>Offline - Will sync when connected</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: colors.status.warning + '20',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: SPACING.md,
    marginBottom: SPACING.md,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.status.warning,
  },
});
