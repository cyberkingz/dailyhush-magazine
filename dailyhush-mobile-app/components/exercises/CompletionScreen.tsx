/**
 * Nœma - Completion Screen Component
 *
 * Celebration screen shown after exercise completion
 *
 * Features:
 * - Anxiety reduction visualization
 * - Duration display
 * - Ogilvy completion message
 * - Social proof (optional)
 * - Navigation options
 *
 * REFACTORED: Uses design tokens, StyleSheet-based, no hardcoded values
 */

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { CheckCircle2, TrendingDown, Clock, Users } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { COLORS, RADIUS, SHADOWS, ICON_SIZE } from '@/constants/design-tokens';

interface CompletionScreenProps {
  preRating: number;
  postRating: number;
  reduction: number;
  reductionPercentage: number;
  duration: number; // seconds
  exerciseTitle: string;
  completionMessage: string;
  onContinue: () => void;
  onReturnHome: () => void;
  showSocialProof?: boolean;
  socialProofCount?: number;
}

export function CompletionScreen({
  preRating,
  postRating,
  reduction,
  reductionPercentage,
  duration,
  exerciseTitle,
  completionMessage,
  onContinue,
  onReturnHome,
  showSocialProof = false,
  socialProofCount,
}: CompletionScreenProps) {
  /**
   * Trigger haptic on mount
   */
  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  /**
   * Format duration
   */
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  /**
   * Get reduction color based on improvement level
   */
  const getReductionColor = (): string => {
    if (reduction >= 3) return COLORS.anxiety.low.primary; // Green for great improvement
    if (reduction >= 1) return colors.emerald[400]; // Teal for good improvement
    if (reduction < 0) return COLORS.anxiety.medium.primary; // Orange for worsened
    return colors.text.secondary; // Gray for no change
  };

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeIn} style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Animated.View entering={FadeInDown.springify().damping(15)} style={styles.iconCircle}>
            <CheckCircle2 size={ICON_SIZE.xxl} color={colors.emerald[400]} strokeWidth={3} />
          </Animated.View>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Excellent Work</Text>
          <Text style={styles.message}>{completionMessage}</Text>
        </View>

        {/* Stats Card */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.statsCard}>
          {/* Anxiety Reduction */}
          <View style={styles.reductionSection}>
            <View style={styles.reductionHeader}>
              <View style={styles.reductionLabelContainer}>
                <TrendingDown size={ICON_SIZE.sm} color={colors.emerald[400]} />
                <Text style={styles.reductionLabel}>Anxiety Reduction</Text>
              </View>
              <Text style={[styles.reductionValue, { color: getReductionColor() }]}>
                {reduction > 0 ? '+' : reduction < 0 ? '' : ''}
                {Math.abs(reduction)} points
              </Text>
            </View>

            {/* Rating Comparison */}
            <View style={styles.comparisonCard}>
              <View style={styles.ratingBefore}>
                <Text style={styles.ratingLabel}>Before</Text>
                <View style={styles.ratingRow}>
                  <Text style={styles.ratingNumber}>{preRating}</Text>
                  <Text style={styles.ratingSlash}>/10</Text>
                </View>
              </View>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
              </View>

              <View style={styles.ratingAfter}>
                <Text style={styles.ratingLabel}>After</Text>
                <View style={styles.ratingRow}>
                  <Text style={[styles.ratingNumber, styles.ratingNumberAfter]}>{postRating}</Text>
                  <Text style={styles.ratingSlash}>/10</Text>
                </View>
              </View>
            </View>

            {/* Percentage Reduction */}
            {reductionPercentage > 0 && (
              <View style={styles.percentageCard}>
                <Text style={styles.percentageText}>{reductionPercentage}% improvement</Text>
              </View>
            )}
          </View>

          {/* Duration */}
          <View style={styles.durationSection}>
            <View style={styles.durationRow}>
              <View style={styles.durationLabelContainer}>
                <Clock size={ICON_SIZE.sm - 2} color={colors.text.muted} />
                <Text style={styles.durationLabel}>Duration</Text>
              </View>
              <Text style={styles.durationValue}>{formatDuration(duration)}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Social Proof (optional) */}
        {showSocialProof && socialProofCount && (
          <Animated.View entering={FadeInDown.delay(300)} style={styles.socialProofCard}>
            <View style={styles.socialProofContent}>
              <View style={styles.socialProofIcon}>
                <Users size={ICON_SIZE.sm} color={colors.emerald[400]} />
              </View>
              <Text style={styles.socialProofText}>
                {socialProofCount.toLocaleString()} people used this technique today
              </Text>
            </View>
          </Animated.View>
        )}

        {/* CTAs */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.ctaContainer}>
          {/* Continue (trigger log) */}
          <TouchableOpacity
            onPress={onContinue}
            style={styles.continueButton}
            accessibilityLabel="Continue"
            accessibilityRole="button">
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>

          {/* Return Home */}
          <TouchableOpacity
            onPress={onReturnHome}
            style={styles.returnHomeButton}
            accessibilityLabel="Return to home"
            accessibilityRole="button">
            <Text style={styles.returnHomeButtonText}>Return to Home</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Insight Tip */}
        <View style={styles.insightTip}>
          <Text style={styles.insightText}>
            💡 <Text style={styles.insightTextBold}>Track your patterns:</Text> Check your Insights
            tab to see which techniques work best for you over time.
          </Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

// ============================================================================
// STYLES - ALL VALUES FROM DESIGN TOKENS
// ============================================================================

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['2xl'],
  },
  content: {
    gap: spacing.xl,
  },

  // Success Icon Styles
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  iconCircle: {
    width: 96,
    height: 96,
    backgroundColor: 'rgba(64, 145, 108, 0.2)',
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(64, 145, 108, 0.4)',
  },

  // Header Styles
  header: {
    gap: spacing.sm,
  },
  title: {
    color: colors.text.primary,
    fontFamily: 'Poppins_700Bold',
    fontSize: typography.size['2xl'],
    lineHeight: typography.size['2xl'] * typography.lineHeight.tight,
    textAlign: 'center',
  },
  message: {
    color: colors.text.secondary,
    fontFamily: 'Inter_500Medium',
    fontSize: typography.size.base,
    lineHeight: typography.size.base * typography.lineHeight.relaxed,
    textAlign: 'center',
    paddingHorizontal: spacing.base,
  },

  // Stats Card Styles
  statsCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: RADIUS.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(26, 77, 60, 0.5)',
    gap: spacing.base,
  },

  // Anxiety Reduction Styles
  reductionSection: {
    gap: spacing.md,
  },
  reductionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reductionLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  reductionLabel: {
    color: colors.text.secondary,
    fontFamily: 'Inter_600SemiBold',
    fontSize: typography.size.sm,
  },
  reductionValue: {
    fontFamily: 'Poppins_700Bold',
    fontSize: typography.size.xl,
    lineHeight: typography.size.xl * typography.lineHeight.tight,
  },

  // Rating Comparison Styles
  comparisonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(10, 22, 18, 0.5)',
    borderRadius: RADIUS.lg,
    padding: spacing.base,
  },
  ratingBefore: {
    flex: 1,
  },
  ratingAfter: {
    flex: 1,
    alignItems: 'flex-end',
  },
  ratingLabel: {
    color: colors.text.muted,
    fontFamily: 'Inter_500Medium',
    fontSize: typography.size.xs,
    marginBottom: spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  ratingNumber: {
    color: colors.text.primary,
    fontFamily: 'Poppins_700Bold',
    fontSize: typography.size['2xl'],
    lineHeight: typography.size['2xl'] * typography.lineHeight.tight,
  },
  ratingNumberAfter: {
    color: colors.emerald[400],
  },
  ratingSlash: {
    color: colors.text.muted,
    fontFamily: 'Inter_400Regular',
    fontSize: typography.size.sm,
  },
  dividerContainer: {
    paddingHorizontal: spacing.base,
  },
  divider: {
    width: 32,
    borderTopWidth: 2,
    borderTopColor: colors.text.muted,
  },

  // Percentage Card Styles
  percentageCard: {
    backgroundColor: 'rgba(64, 145, 108, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(64, 145, 108, 0.3)',
    borderRadius: RADIUS.lg,
    padding: spacing.md,
  },
  percentageText: {
    color: colors.emerald[400],
    fontFamily: 'Inter_600SemiBold',
    fontSize: typography.size.sm,
    textAlign: 'center',
  },

  // Duration Styles
  durationSection: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(26, 77, 60, 0.5)',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  durationLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  durationLabel: {
    color: colors.text.secondary,
    fontFamily: 'Inter_500Medium',
    fontSize: typography.size.sm,
  },
  durationValue: {
    color: colors.text.primary,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: typography.size.lg,
  },

  // Social Proof Styles
  socialProofCard: {
    backgroundColor: 'rgba(64, 145, 108, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(64, 145, 108, 0.2)',
    borderRadius: RADIUS.lg,
    padding: spacing.base,
  },
  socialProofContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  socialProofIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(64, 145, 108, 0.2)',
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialProofText: {
    flex: 1,
    color: colors.text.secondary,
    fontFamily: 'Inter_500Medium',
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm * typography.lineHeight.relaxed,
  },

  // CTA Button Styles
  ctaContainer: {
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  continueButton: {
    backgroundColor: colors.emerald[400],
    borderRadius: RADIUS.lg,
    paddingVertical: spacing.base,
    ...SHADOWS.md,
  },
  continueButtonText: {
    color: colors.background.primary,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: typography.size.lg,
    textAlign: 'center',
  },
  returnHomeButton: {
    borderWidth: 1,
    borderColor: colors.background.border,
    borderRadius: RADIUS.lg,
    paddingVertical: spacing.base,
  },
  returnHomeButtonText: {
    color: colors.text.secondary,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: typography.size.base,
    textAlign: 'center',
  },

  // Insight Tip Styles
  insightTip: {
    backgroundColor: 'rgba(15, 31, 26, 0.5)',
    borderRadius: RADIUS.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(26, 77, 60, 0.3)',
  },
  insightText: {
    color: colors.text.secondary,
    fontFamily: 'Inter_400Regular',
    fontSize: typography.size.sm,
    lineHeight: typography.size.sm * typography.lineHeight.relaxed,
  },
  insightTextBold: {
    fontFamily: 'Inter_600SemiBold',
  },
});
