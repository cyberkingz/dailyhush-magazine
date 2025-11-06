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
import type { EmptyStateProps } from '@/types/widget.types';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/designTokens';

/**
 * EmptyState component
 * Shows when no mood is logged today
 */
export function EmptyState({
  title = 'How are you feeling today?',
  description = 'Check in with your emotional weather',
  isLoading = false,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>

      {/* Icon Circle */}
      <View style={styles.iconCircle} accessible={false}>
        <CloudSun size={64} color={colors.lime[400]} strokeWidth={1.5} />
      </View>

      {/* Description */}
      <Text style={styles.description}>{description}</Text>

      {isLoading && (
        <View style={styles.loadingContainer} accessibilityLiveRegion="polite">
          <ActivityIndicator size="small" color={colors.lime[500]} />
          <Text style={styles.loadingText} accessibilityRole="text">
            Preparing your check-in...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.xxl + SPACING.md, // 36px - more breathing room at top
    paddingHorizontal: SPACING.xxl + SPACING.xs, // 28px - match profile page
    paddingBottom: SPACING.lg, // 16px - some bottom spacing before button area
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: SPACING.xxl + SPACING.lg, // 40px - more space after title
    textAlign: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.lime[500] + '1A', // Lime with 10% opacity
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg, // 16px - closer to icon for better grouping
  },
  description: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xxxl + SPACING.md, // extra space to clear floating button
    opacity: 0.8,
    lineHeight: 22,
  },
  loadingContainer: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  loadingText: {
    fontSize: 13,
    color: colors.text.secondary,
    opacity: 0.8,
  },
});
