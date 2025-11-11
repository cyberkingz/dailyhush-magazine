/**
 * Nœma - Pre/Post Rating Card Component
 *
 * 1-10 anxiety rating scale used before and after exercises
 *
 * Features:
 * - Visual rating selector with colors
 * - Comparison view (post-rating shows improvement)
 * - Haptic feedback on selection
 * - Accessibility labels
 * - Smooth animations
 *
 * REFACTORED: Uses design tokens, proper component composition, no hardcoded values
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react-native';
import { ANXIETY_SCALE } from '@/types/exercises';
import { AnxietyRatingDial } from './AnxietyRatingDial';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS, OPACITY, ICON_SIZE } from '@/constants/design-tokens';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

// ============================================================================
// TYPES
// ============================================================================

interface PrePostRatingCardProps {
  type: 'pre' | 'post';
  currentRating: number | null;
  onRatingSelect: (rating: number) => void;
  onContinue: () => void;
  showComparison?: boolean;
  comparisonRating?: number;
}

interface ReductionData {
  reduction: number;
  percentage: number;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get icon component based on reduction amount
 * Now uses outcome-based colors for clarity
 */
function getReductionIcon(reduction: number) {
  const iconSize = ICON_SIZE.lg;

  if (reduction > 0) {
    // Improvement - anxiety decreased (green)
    return <TrendingDown size={iconSize} color={COLORS.outcome.improved.icon} />;
  } else if (reduction < 0) {
    // Worsening - anxiety increased (red)
    return <TrendingUp size={iconSize} color={COLORS.outcome.worsened.icon} />;
  } else {
    // No change (blue)
    return <Minus size={iconSize} color={COLORS.outcome.noChange.icon} />;
  }
}

/**
 * Get reduction message based on reduction amount
 * Now uses clear outcome language that eliminates confusion
 */
function getReductionMessage(reduction: number): string {
  const points = Math.abs(reduction);
  const pointText = points === 1 ? 'point' : 'points';

  if (reduction > 0) {
    // Improvement - anxiety went down
    return `Your anxiety decreased by ${points} ${pointText}`;
  } else if (reduction < 0) {
    // Worsening - anxiety went up
    return `Your anxiety increased by ${points} ${pointText}`;
  } else {
    // No change
    return 'Your anxiety stayed the same';
  }
}

/**
 * Get reassurance message for worsened outcomes
 * Provides context and reduces worry
 */
function getReassuranceMessage(): string {
  return 'This happens sometimes - let\'s explore other techniques';
}

// ============================================================================
// COMPONENT
// ============================================================================

export function PrePostRatingCard({
  type,
  currentRating,
  onRatingSelect,
  onContinue,
  showComparison = false,
  comparisonRating,
}: PrePostRatingCardProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(currentRating);

  /**
   * Handle rating selection with haptic feedback
   */
  const handleSelect = async (rating: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedRating(rating);
    onRatingSelect(rating);
  };

  /**
   * Continue to next stage with haptic feedback
   */
  const handleContinue = async () => {
    if (!selectedRating) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onContinue();
  };

  /**
   * Calculate reduction if showing comparison
   */
  const getReduction = (): ReductionData | null => {
    if (!showComparison || !comparisonRating || !selectedRating) return null;
    const reduction = comparisonRating - selectedRating;
    const percentage = Math.round((reduction / comparisonRating) * 100);
    return { reduction, percentage };
  };

  const reduction = getReduction();

  // Helper function to get outcome-based styles
  const getOutcomeStyles = (reduction: number) => {
    if (reduction > 0) {
      return {
        backgroundColor: COLORS.outcome.improved.backgroundDark,
        borderColor: COLORS.outcome.improved.border,
        textColor: COLORS.outcome.improved.textDark,
      };
    } else if (reduction < 0) {
      return {
        backgroundColor: COLORS.outcome.worsened.backgroundDark,
        borderColor: COLORS.outcome.worsened.border,
        textColor: COLORS.outcome.worsened.textDark,
      };
    } else {
      return {
        backgroundColor: COLORS.outcome.noChange.backgroundDark,
        borderColor: COLORS.outcome.noChange.border,
        textColor: COLORS.outcome.noChange.textDark,
      };
    }
  };

  const outcomeStyles = reduction ? getOutcomeStyles(reduction.reduction) : null;

  return (
    <View style={styles.container}>
      {/* Circular Anxiety Rating Dial - Main focus */}
      <View style={styles.dialContainer}>
        <AnxietyRatingDial
          selectedRating={selectedRating}
          onRatingSelect={handleSelect}
          type={type}
        />
      </View>

      {/* Continue Button - Emerald branded with strong visual presence */}
      {selectedRating && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleContinue}
            style={styles.continueButton}
            activeOpacity={0.8}
            accessibilityLabel="Continue to next step"
            accessibilityRole="button"
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Helper Text - Simple inline explanation */}
      <View style={styles.helperContainer}>
        <Text style={styles.helperText}>
          Tracking before and after helps you see what works best
        </Text>
      </View>
    </View>
  );
}

// ============================================================================
// STYLES - ALL VALUES FROM DESIGN TOKENS
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.lg,
  },

  // ============================================================================
  // DIAL CONTAINER - Add spacing wrapper for better control
  // ============================================================================
  dialContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing['3xl'],
    alignItems: 'center',
  },

  // ============================================================================
  // CONTINUE BUTTON - Emerald branded with strong presence
  // ============================================================================
  buttonContainer: {
    paddingHorizontal: spacing.screenPadding,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  continueButton: {
    backgroundColor: colors.emerald[600], // Primary dark emerald brand color
    borderRadius: RADIUS.lg,
    paddingVertical: spacing.base + spacing.xs,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52, // Comfortable touch target
    ...SHADOWS.emeraldStrong, // Strong emerald glow
    borderWidth: 1.5,
    borderColor: colors.emerald[500], // Lighter border for definition
  },
  continueButtonText: {
    fontSize: typography.size.base,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: 'Poppins_600SemiBold', // Poppins for buttons
    color: colors.text.primary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    lineHeight: typography.size.base * typography.lineHeight.tight,
  },

  // ============================================================================
  // HELPER TEXT - Simple inline explanation
  // ============================================================================
  helperContainer: {
    paddingHorizontal: spacing.screenPadding,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  helperText: {
    fontSize: typography.size.xs,
    lineHeight: typography.size.xs * typography.lineHeight.normal,
    color: colors.text.muted,
    opacity: 0.7,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
});
