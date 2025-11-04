/**
 * DailyHush - Breathing Animation Component
 *
 * Clean countdown-based breathing interface matching Spiral exercise
 *
 * Features:
 * - CountdownRing progress visualization
 * - Phase-based countdown timer
 * - Clean centered layout
 * - Cycle tracking
 * - Auto-advance through phases
 *
 * REFACTORED: Uses CountdownRing component like Spiral exercise
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import type { BreathingData } from '@/types/exercises';
import { CountdownRing } from '@/components/CountdownRing';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';
import { RADIUS } from '@/constants/design-tokens';

interface BreathingAnimationProps {
  protocol: BreathingData['protocol'];
  phase: BreathingData['currentPhase'];
  cycleNumber: number;
  totalCycles: number;
  onCycleComplete: () => void;
  isPaused: boolean;
  breathDurations: BreathingData['breathDurations'];
}

export function BreathingAnimation({
  protocol,
  phase,
  cycleNumber,
  totalCycles,
  onCycleComplete,
  isPaused,
  breathDurations,
}: BreathingAnimationProps) {
  const [currentPhase, setCurrentPhase] = useState(phase);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseStartTimeRef = useRef<number>(Date.now());

  // Calculate total cycle duration for progress tracking
  const totalCycleDuration =
    breathDurations.inhale +
    (breathDurations.hold || 0) +
    breathDurations.exhale +
    (breathDurations.rest || 0);

  // Calculate progress percentage for current cycle
  const getProgress = (): number => {
    const phaseDuration = getPhaseDuration(currentPhase);
    const phaseElapsed = phaseDuration - timeRemaining;
    let phaseStartOffset = 0;

    // Calculate offset based on completed phases in cycle
    switch (currentPhase) {
      case 'inhale':
        phaseStartOffset = 0;
        break;
      case 'hold':
        phaseStartOffset = breathDurations.inhale;
        break;
      case 'exhale':
        phaseStartOffset = breathDurations.inhale + (breathDurations.hold || 0);
        break;
      case 'rest':
        phaseStartOffset =
          breathDurations.inhale + (breathDurations.hold || 0) + breathDurations.exhale;
        break;
    }

    const totalElapsed = phaseStartOffset + phaseElapsed;
    return (totalElapsed / totalCycleDuration) * 100;
  };

  /**
   * Get phase display text
   */
  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale':
        return protocol === 'cyclic-sigh' ? 'Breathe In (Twice)' : 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'rest':
        return 'Rest';
      default:
        return '';
    }
  };

  /**
   * Get phase instruction text
   */
  const getPhaseInstruction = () => {
    switch (currentPhase) {
      case 'inhale':
        return protocol === 'cyclic-sigh'
          ? 'Two quick inhales through your nose'
          : 'Slowly through your nose';
      case 'hold':
        return 'Keep your breath steady';
      case 'exhale':
        return protocol === 'cyclic-sigh'
          ? 'Long, slow exhale through your mouth'
          : 'Slowly through your mouth';
      case 'rest':
        return 'Brief pause before next cycle';
      default:
        return '';
    }
  };

  /**
   * Get phase duration in seconds
   */
  const getPhaseDuration = (phaseName: BreathingData['currentPhase']): number => {
    switch (phaseName) {
      case 'inhale':
        return breathDurations.inhale;
      case 'hold':
        return breathDurations.hold || 0;
      case 'exhale':
        return breathDurations.exhale;
      case 'rest':
        return breathDurations.rest || 0;
      default:
        return 0;
    }
  };


  /**
   * Advance to next phase
   */
  const advancePhase = () => {
    let nextPhase: BreathingData['currentPhase'];

    switch (currentPhase) {
      case 'inhale':
        nextPhase = breathDurations.hold ? 'hold' : 'exhale';
        break;
      case 'hold':
        nextPhase = 'exhale';
        break;
      case 'exhale':
        nextPhase = breathDurations.rest ? 'rest' : 'inhale';
        if (nextPhase === 'inhale') {
          // Cycle complete
          onCycleComplete();
        }
        break;
      case 'rest':
        nextPhase = 'inhale';
        onCycleComplete();
        break;
      default:
        nextPhase = 'inhale';
    }

    setCurrentPhase(nextPhase);
    phaseStartTimeRef.current = Date.now();
  };

  /**
   * Timer countdown
   */
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const duration = getPhaseDuration(currentPhase);
    setTimeRemaining(duration);
    phaseStartTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - phaseStartTimeRef.current) / 1000;
      const remaining = Math.max(0, duration - elapsed);
      setTimeRemaining(Math.ceil(remaining));

      if (remaining <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        advancePhase();
      }
    }, 100);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentPhase, isPaused]);


  return (
    <ImageBackground
      source={require('@/assets/img/forest.png')}
      style={styles.container}
      resizeMode="cover">
      {/* Dark overlay for readability */}
      <View style={styles.overlay} />

      <View style={styles.content}>
        {/* Top Section - Countdown with Progress Ring */}
        <View style={styles.countdownSection}>
          <View style={styles.ringContainer}>
            {/* Animated progress ring */}
            <CountdownRing
              size={260}
              strokeWidth={8}
              color="#40916C"
              glowColor="#52B788"
              progress={getProgress()}
            />

            {/* Countdown text overlay */}
            <View style={styles.countdownOverlay}>
              <Text style={styles.countdownNumber}>{timeRemaining}</Text>
              <Text style={styles.countdownLabel}>seconds</Text>
              {/* Cycle counter */}
              <Text style={styles.cycleCounter}>
                Cycle {cycleNumber} of {totalCycles}
              </Text>
            </View>
          </View>
        </View>

        {/* Middle Section - Phase Instruction */}
        <View style={styles.instructionSection}>
          <View style={styles.instructionCard}>
            <Text style={styles.phaseName}>{getPhaseText()}</Text>
            <Text style={styles.phaseInstruction}>{getPhaseInstruction()}</Text>
          </View>
        </View>

        {/* Bottom Section - Protocol Badge */}
        <View style={styles.protocolBadgeContainer}>
          <View style={styles.protocolBadge}>
            <Text style={styles.protocolBadgeText}>
              {protocol === 'cyclic-sigh'
                ? 'CYCLIC SIGH'
                : protocol === '4-7-8'
                ? '4-7-8 BREATHING'
                : protocol === 'box'
                ? 'BOX BREATHING'
                : 'COHERENT BREATHING'}
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

// ============================================================================
// STYLES - Matching Spiral exercise layout
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0A1612',
    opacity: 0.85, // 85% dark overlay for forest image
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['3xl'],
  },

  // Countdown Section Styles
  countdownSection: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  ringContainer: {
    position: 'relative',
    width: 260,
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownNumber: {
    fontSize: 60,
    fontFamily: 'Poppins_700Bold',
    color: colors.text.primary,
    letterSpacing: 2,
  },
  countdownLabel: {
    marginTop: spacing.xs,
    fontSize: typography.size.sm,
    fontFamily: 'Inter_400Regular',
    color: colors.text.muted,
  },
  cycleCounter: {
    marginTop: spacing.md,
    fontSize: typography.size.xs,
    fontFamily: 'Inter_500Medium',
    color: colors.text.muted,
  },

  // Instruction Section Styles
  instructionSection: {
    width: '100%',
    paddingHorizontal: spacing.sm,
  },
  instructionCard: {
    minHeight: 112,
    justifyContent: 'center',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: 'rgba(64, 145, 108, 0.3)',
    backgroundColor: 'rgba(26, 77, 60, 0.6)',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    shadowColor: '#40916C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  phaseName: {
    fontSize: typography.size.xl,
    fontFamily: 'Poppins_700Bold',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
    lineHeight: typography.size.xl * typography.lineHeight.tight,
  },
  phaseInstruction: {
    fontSize: typography.size.base,
    fontFamily: 'Inter_500Medium',
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: typography.size.base * typography.lineHeight.relaxed,
  },

  // Protocol Badge Styles
  protocolBadgeContainer: {
    width: '100%',
    alignItems: 'center',
  },
  protocolBadge: {
    backgroundColor: 'rgba(15, 31, 26, 0.7)',
    borderRadius: RADIUS.full,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(64, 145, 108, 0.3)',
  },
  protocolBadgeText: {
    color: colors.emerald[400],
    fontFamily: 'Inter_600SemiBold',
    fontSize: typography.size.xs,
    letterSpacing: 1.2,
  },
});

