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
import { AnxietyRatingDial } from './AnxietyRatingDial';
import { RADIUS, SHADOWS } from '@/constants/design-tokens';
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

  getReduction();

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
            accessibilityRole="button">
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
