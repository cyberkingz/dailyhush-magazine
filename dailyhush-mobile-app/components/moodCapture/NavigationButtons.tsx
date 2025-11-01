/**
 * DailyHush - Navigation Buttons Component
 *
 * Reusable navigation buttons for mood capture flow:
 * - Back button (top-left, Steps 2-4)
 * - Close button (top-right, all steps)
 * - Skip button (alternative to close, Steps 1-2)
 * - Continue button (bottom, all steps)
 *
 * @see MOOD_CAPTURE_ROADMAP.md
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ChevronLeft, X } from 'lucide-react-native';
import { BUTTONS, STEP_HEADER, HAPTICS } from '@/constants/moodCaptureDesign';
import { colors } from '@/constants/colors';

// ============================================================================
// BACK BUTTON
// ============================================================================

interface BackButtonProps {
  onPress: () => void;
  visible?: boolean;
}

export function BackButton({ onPress, visible = true }: BackButtonProps) {
  if (!visible) return null;

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle[HAPTICS.navigation.backward]);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.backButton, BUTTONS.back]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Go back to previous step"
      accessibilityHint="Double tap to return to the previous step. Your progress will be saved."
    >
      <ChevronLeft
        size={BUTTONS.back.icon.size}
        color={BUTTONS.back.icon.color}
        strokeWidth={BUTTONS.back.icon.strokeWidth}
      />
    </TouchableOpacity>
  );
}

// ============================================================================
// CLOSE BUTTON
// ============================================================================

interface CloseButtonProps {
  onPress: () => void;
}

export function CloseButton({ onPress }: CloseButtonProps) {
  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle[HAPTICS.navigation.close]);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.closeButton, BUTTONS.close]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Close mood capture"
      accessibilityHint="Double tap to close this screen"
    >
      <X
        size={BUTTONS.close.icon.size}
        color={BUTTONS.close.icon.color}
        strokeWidth={BUTTONS.close.icon.strokeWidth}
      />
    </TouchableOpacity>
  );
}

// ============================================================================
// SKIP BUTTON
// ============================================================================

interface SkipButtonProps {
  onPress: () => void;
  visible?: boolean;
}

export function SkipButton({ onPress, visible = true }: SkipButtonProps) {
  if (!visible) return null;

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle[HAPTICS.buttons.skip]);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.skipButton, STEP_HEADER.skipButton.container]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Skip this step"
      accessibilityHint="Double tap to skip to the writing step"
    >
      <Text style={[styles.skipButtonText, STEP_HEADER.skipButton.text]}>Skip</Text>
    </TouchableOpacity>
  );
}

// ============================================================================
// CONTINUE BUTTON
// ============================================================================

interface ContinueButtonProps {
  onPress: () => void;
  label?: string;
  disabled?: boolean;
  loading?: boolean;
}

export function ContinueButton({
  onPress,
  label = 'Continue',
  disabled = false,
  loading = false,
}: ContinueButtonProps) {
  const handlePress = async () => {
    if (disabled || loading) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle[HAPTICS.buttons.primary]);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[
        styles.continueButton,
        BUTTONS.primary,
        (disabled || loading) && BUTTONS.primary.disabled,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint="Double tap to proceed to next step"
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.background.primary} />
      ) : (
        <Text style={[styles.continueButtonText, BUTTONS.primary.text]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

// ============================================================================
// SECONDARY BUTTON (for Step 4 - "Save & Close")
// ============================================================================

interface SecondaryButtonProps {
  onPress: () => void;
  label: string;
  loading?: boolean;
}

export function SecondaryButton({ onPress, label, loading = false }: SecondaryButtonProps) {
  const handlePress = async () => {
    if (loading) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle[HAPTICS.buttons.secondary]);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.secondaryButton, BUTTONS.secondary]}
      onPress={handlePress}
      disabled={loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.text.secondary} />
      ) : (
        <Text style={[styles.secondaryButtonText, BUTTONS.secondary.text]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  backButton: {
    // Styles from BUTTONS.back constant
  },
  closeButton: {
    // Styles from BUTTONS.close constant
  },
  skipButton: {
    // Styles from STEP_HEADER.skipButton.container constant
  },
  skipButtonText: {
    // Styles from STEP_HEADER.skipButton.text constant
  },
  continueButton: {
    // Styles from BUTTONS.primary constant
  },
  continueButtonText: {
    // Styles from BUTTONS.primary.text constant
  },
  secondaryButton: {
    // Styles from BUTTONS.secondary constant
  },
  secondaryButtonText: {
    // Styles from BUTTONS.secondary.text constant
  },
});
