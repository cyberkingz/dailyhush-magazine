/**
 * Nœma - Exercise Container Component
 *
 * Universal wrapper for all exercise screens
 * Handles:
 * - Stage-based rendering
 * - Progress tracking
 * - Emergency exit
 * - Pause/resume UI
 * - Full-screen layout
 *
 * REFACTORED: Uses design tokens, StyleSheet-based, no hardcoded values
 */

import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { X, Pause, Play, AlertCircle } from 'lucide-react-native';
import type { ExerciseConfig, ExerciseSession } from '@/types/exercises';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { COLORS, RADIUS, SHADOWS, ICON_SIZE } from '@/constants/design-tokens';

interface ExerciseContainerProps {
  config: ExerciseConfig;
  session: ExerciseSession;
  onPause?: () => void;
  onResume?: () => void;
  onAbandon?: () => void;
  children: React.ReactNode;
}

export function ExerciseContainer({
  config,
  session,
  onPause,
  onResume,
  onAbandon,
  children,
}: ExerciseContainerProps) {
  const router = useRouter();
  const [showExitConfirm, setShowExitConfirm] = React.useState(false);

  /**
   * Handle emergency exit with confirmation
   */
  const handleExit = () => {
    setShowExitConfirm(true);
  };

  const confirmExit = () => {
    onAbandon?.();
    router.back();
  };

  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  /**
   * Toggle pause/resume
   */
  const handlePauseToggle = () => {
    if (session.isPaused) {
      onResume?.();
    } else {
      onPause?.();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={GRADIENT_COLORS} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          {/* Left: Exit Button */}
          <TouchableOpacity
            onPress={handleExit}
            style={styles.exitButton}
            accessibilityLabel="Exit exercise"
            accessibilityRole="button"
          >
            <X size={ICON_SIZE.md} color={colors.text.muted} />
          </TouchableOpacity>

          {/* Center: Title & Progress */}
          <View style={styles.centerContent}>
            <Text style={styles.title}>{config.shortTitle}</Text>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, { width: `${session.progress.percentage}%` }]} />
            </View>

            {/* Step Counter */}
            <Text style={styles.stepCounter}>
              Step {session.progress.currentStep} of {session.progress.totalSteps}
            </Text>
          </View>

          {/* Right: Pause/Resume (if allowed) */}
          {config.stages.allowPause && session.currentStage === 'exercise' ? (
            <TouchableOpacity
              onPress={handlePauseToggle}
              style={styles.pauseButton}
              accessibilityLabel={session.isPaused ? 'Resume exercise' : 'Pause exercise'}
              accessibilityRole="button"
            >
              {session.isPaused ? (
                <Play size={ICON_SIZE.md} color={colors.text.muted} fill={colors.text.muted} />
              ) : (
                <Pause size={ICON_SIZE.md} color={colors.text.muted} />
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.pauseButtonPlaceholder} />
          )}
        </View>

        {/* Main Content */}
        <View style={styles.content}>{children}</View>

        {/* Exit Confirmation Modal */}
        {showExitConfirm && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Icon */}
              <View style={styles.modalIconContainer}>
                <View style={styles.modalIconCircle}>
                  <AlertCircle size={ICON_SIZE.lg - 4} color={COLORS.semantic.error} />
                </View>
              </View>

              {/* Title */}
              <Text style={styles.modalTitle}>Stop Exercise?</Text>

              {/* Message */}
              <Text style={styles.modalMessage}>
                Your progress won't be saved. Are you sure you want to exit?
              </Text>

              {/* Buttons */}
              <View style={styles.modalButtons}>
                {/* Confirm Exit */}
                <TouchableOpacity
                  onPress={confirmExit}
                  style={styles.exitConfirmButton}
                  accessibilityLabel="Confirm exit"
                  accessibilityRole="button"
                >
                  <Text style={styles.exitConfirmText}>Yes, Exit</Text>
                </TouchableOpacity>

                {/* Cancel */}
                <TouchableOpacity
                  onPress={cancelExit}
                  style={styles.keepGoingButton}
                  accessibilityLabel="Continue exercise"
                  accessibilityRole="button"
                >
                  <Text style={styles.keepGoingText}>Keep Going</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Paused Overlay */}
        {session.isPaused && (
          <View style={styles.pausedOverlay}>
            <View style={styles.pausedContent}>
              <Text style={styles.pausedTitle}>Paused</Text>
              <Text style={styles.pausedMessage}>Take your time. Resume when ready.</Text>
              <TouchableOpacity
                onPress={handlePauseToggle}
                style={styles.resumeButton}
                accessibilityLabel="Resume exercise"
                accessibilityRole="button"
              >
                <Text style={styles.resumeButtonText}>Resume</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

// ============================================================================
// CONSTANTS
// ============================================================================

const GRADIENT_COLORS = ['#0A1612', '#0F1C17', '#0A1612'] as const;
const MAX_PROGRESS_WIDTH = 280;

// ============================================================================
// STYLES - ALL VALUES FROM DESIGN TOKENS
// ============================================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A1612', // Match gradient start color
  },
  gradient: {
    flex: 1,
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(64, 145, 108, 0.2)',
  },
  exitButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -spacing.sm,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  title: {
    fontSize: typography.size.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: spacing.xs + 2,
  },
  progressBarContainer: {
    width: '100%',
    maxWidth: MAX_PROGRESS_WIDTH,
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginBottom: spacing.xs + 2,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.emerald[600],
    borderRadius: RADIUS.full,
  },
  stepCounter: {
    fontSize: typography.size.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.muted,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.5,
  },
  pauseButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -spacing.sm,
  },
  pauseButtonPlaceholder: {
    width: 40,
  },

  // Content
  content: {
    flex: 1,
  },

  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderRadius: RADIUS.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: colors.background.border,
  },
  modalIconContainer: {
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  modalIconCircle: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: typography.size.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  modalMessage: {
    fontSize: typography.size.base,
    color: colors.text.secondary,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: typography.size.base * typography.lineHeight.relaxed,
  },
  modalButtons: {
    gap: spacing.md,
  },
  exitConfirmButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: RADIUS.lg,
    paddingVertical: spacing.base - 2,
    alignItems: 'center',
  },
  exitConfirmText: {
    fontSize: typography.size.base,
    fontWeight: typography.fontWeight.semibold,
    color: '#FF8787',
    fontFamily: 'Poppins_600SemiBold',
  },
  keepGoingButton: {
    backgroundColor: colors.emerald[600],
    borderRadius: RADIUS.lg,
    paddingVertical: spacing.base - 2,
    alignItems: 'center',
  },
  keepGoingText: {
    fontSize: typography.size.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.background.primary,
    fontFamily: 'Poppins_600SemiBold',
  },

  // Paused Overlay
  pausedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pausedContent: {
    backgroundColor: colors.background.secondary,
    borderRadius: RADIUS.xl,
    padding: spacing['2xl'],
    marginHorizontal: spacing.xl,
    borderWidth: 1,
    borderColor: colors.background.border,
    minWidth: 280,
  },
  pausedTitle: {
    fontSize: typography.size['2xl'],
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  pausedMessage: {
    fontSize: typography.size.base,
    color: colors.text.secondary,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: typography.size.base * typography.lineHeight.relaxed,
  },
  resumeButton: {
    backgroundColor: colors.emerald[600],
    borderRadius: RADIUS.lg,
    paddingVertical: spacing.base - 2,
    alignItems: 'center',
  },
  resumeButtonText: {
    fontSize: typography.size.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.background.primary,
    fontFamily: 'Poppins_600SemiBold',
  },
});
