/**
 * ErrorDisplay Component
 *
 * Inline error message with retry and cancel actions.
 *
 * @module components/mood-widget/ErrorDisplay
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { PillButton } from '@/components/ui/pill-button';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/designTokens';

interface ErrorDisplayProps {
  error: string | null;
  onRetry: () => void;
  onCancel: () => void;
  visible: boolean;
}

/**
 * ErrorDisplay component
 * Shows error with retry/cancel options
 */
export function ErrorDisplay({
  error,
  onRetry,
  onCancel,
  visible,
}: ErrorDisplayProps) {
  if (!visible || !error) {
    return null;
  }

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel={`Error: ${error}`}
      accessibilityLiveRegion="assertive"
      accessibilityRole="alert"
    >
      {/* Error icon */}
      <AlertCircle size={32} color={colors.status.error} strokeWidth={2} />

      {/* Error message */}
      <Text style={styles.message}>{error}</Text>

      {/* Actions */}
      <View style={styles.actions}>
        <PillButton
          label="Try Again"
          onPress={onRetry}
          variant="primary"
          style={styles.actionButton}
        />
        <PillButton
          label="Cancel"
          onPress={onCancel}
          variant="secondary"
          style={styles.actionButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  message: {
    fontSize: 15,
    color: colors.text.primary,
    textAlign: 'center',
    marginVertical: SPACING.md,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
    width: '100%',
  },
  actionButton: {
    flex: 1,
  },
});
