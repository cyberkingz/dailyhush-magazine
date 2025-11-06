/**
 * EmptyState Component
 *
 * Initial state of mood widget when no mood is logged today.
 * Shows prompt to log mood with CloudSun icon.
 *
 * @module components/mood-widget/EmptyState
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { CloudSun } from 'lucide-react-native';
import { PillButton } from '@/components/ui/pill-button';
import type { EmptyStateProps } from '@/types/widget.types';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/designTokens';
import { ACCESSIBILITY_LABELS } from '@/constants/widgetConfig';

/**
 * EmptyState component
 * Shows when no mood is logged today
 */
export function EmptyState({
  onPress,
  title = 'How are you feeling today?',
  description = 'Check in with your emotional weather',
  isLoading = false,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text
        style={styles.title}
        accessibilityRole="header"
      >
        {title}
      </Text>

      {/* Icon Circle */}
      <View
        style={styles.iconCircle}
        accessible={false}
      >
        <CloudSun
          size={64}
          color={colors.lime[400]}
          strokeWidth={1.5}
        />
      </View>

      {/* Description */}
      <Text style={styles.description}>
        {description}
      </Text>

      {/* Floating Log Mood Button */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.lime[500]} />
        </View>
      ) : (
        <PillButton
          label="Log Mood"
          onPress={onPress}
          variant="primary"
          style={styles.floatingButton}
          accessibilityLabel={ACCESSIBILITY_LABELS.emptyState.logMoodButton}
          accessibilityHint={ACCESSIBILITY_LABELS.emptyState.logMoodHint}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: SPACING.xxl + SPACING.xs, // 28px
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.lime[500] + '1A', // Lime with 10% opacity
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xxl,
  },
  description: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    opacity: 0.8,
    lineHeight: 22,
    paddingHorizontal: SPACING.lg,
  },
  floatingButton: {
    marginTop: SPACING.md,
  },
  loadingContainer: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.md,
  },
});
