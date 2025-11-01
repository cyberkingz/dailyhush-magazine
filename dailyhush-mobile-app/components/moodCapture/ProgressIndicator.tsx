/**
 * DailyHush - Progress Indicator Component
 *
 * Visual progress dots showing current step in mood capture flow (1-4).
 * Uses smooth animations for transitions between steps.
 *
 * @see MOOD_CAPTURE_ROADMAP.md
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { PROGRESS_INDICATOR, ANIMATIONS } from '@/constants/moodCaptureDesign';
import type { MoodCaptureStep } from '@/hooks/useMoodCapture';

// ============================================================================
// TYPES
// ============================================================================

interface ProgressIndicatorProps {
  /** Current step (1-4) */
  currentStep: MoodCaptureStep;
  /** Total number of steps */
  totalSteps?: number;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Progress indicator with animated dots
 * Shows which step user is on in the flow
 */
export function ProgressIndicator({
  currentStep,
  totalSteps = 4,
}: ProgressIndicatorProps) {
  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${currentStep} of ${totalSteps}`}
      accessibilityValue={{
        min: 0,
        max: totalSteps,
        now: currentStep,
      }}
    >
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <ProgressDot
            key={stepNumber}
            isActive={isActive}
            isCompleted={isCompleted}
          />
        );
      })}
    </View>
  );
}

// ============================================================================
// PROGRESS DOT
// ============================================================================

interface ProgressDotProps {
  isActive: boolean;
  isCompleted: boolean;
}

function ProgressDot({ isActive, isCompleted }: ProgressDotProps) {
  // Determine styles based on state
  const dotStyle = isActive
    ? PROGRESS_INDICATOR.dot.active
    : isCompleted
    ? PROGRESS_INDICATOR.dot.completed
    : PROGRESS_INDICATOR.dot.default;

  return (
    <MotiView
      from={{
        width: PROGRESS_INDICATOR.dot.default.width,
        backgroundColor: PROGRESS_INDICATOR.dot.default.backgroundColor,
      }}
      animate={{
        width: dotStyle.width,
        height: dotStyle.height,
        backgroundColor: dotStyle.backgroundColor,
        borderRadius: dotStyle.borderRadius,
        borderWidth: dotStyle.borderWidth || 0,
        borderColor: (dotStyle as any).borderColor || 'transparent',
      }}
      transition={{
        type: 'timing',
        duration: ANIMATIONS.stepTransition.forward.duration,
      }}
      style={styles.dot}
    />
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    ...PROGRESS_INDICATOR.container,
  },
  dot: {
    // Base styles - animated values will override
  },
});
