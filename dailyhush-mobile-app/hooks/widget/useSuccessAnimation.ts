/**
 * useSuccessAnimation Hook
 *
 * Manages success checkmark animation with SVG path drawing.
 * Includes scale bounce, rotation, and optional glow effects.
 *
 * Features:
 * - SVG path drawing animation (0% → 100%)
 * - Scale bounce effect
 * - Rotation for celebration feel
 * - Glow effect (optional)
 * - Auto-trigger on visibility
 *
 * @module hooks/widget/useSuccessAnimation
 */

import { useEffect, useCallback, useState } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withTiming,
  withSequence,
  withSpring,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import type { UseSuccessAnimationReturn } from '@/types/widget.types';

// ============================================================================
// TYPES
// ============================================================================

interface UseSuccessAnimationConfig {
  /** Animation duration (ms) */
  duration: number;

  /** Enable haptic feedback */
  enableHaptics: boolean;

  /** Show glow effect */
  showGlow: boolean;

  /** Callback when animation completes */
  onComplete?: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * SVG checkmark path length (approximate)
 * Used for strokeDasharray/strokeDashoffset animation
 */
const CHECKMARK_PATH_LENGTH = 100;

// ============================================================================
// HOOK
// ============================================================================

/**
 * Success animation hook
 *
 * @param config - Animation configuration
 * @returns Trigger function and animated props
 *
 * @example
 * ```tsx
 * const { trigger, animatedProps, animatedStyle } = useSuccessAnimation({
 *   duration: 400,
 *   enableHaptics: true,
 *   showGlow: true,
 *   onComplete: () => console.log('Animation complete!'),
 * });
 *
 * // SVG checkmark
 * <Svg width={80} height={80}>
 *   <AnimatedPath
 *     d="M 10,40 L 30,60 L 70,20"
 *     stroke={colors.lime[500]}
 *     strokeWidth={4}
 *     fill="none"
 *     strokeDasharray={100}
 *     animatedProps={animatedProps}
 *   />
 * </Svg>
 * ```
 */
export function useSuccessAnimation(
  config: UseSuccessAnimationConfig
): UseSuccessAnimationReturn {
  const { duration, enableHaptics, showGlow, onComplete } = config;

  // ========================================================================
  // STATE
  // ========================================================================

  /**
   * Is animation currently playing (React state - safe for render)
   */
  const [isPlaying, setIsPlaying] = useState(false);

  // ========================================================================
  // ANIMATED VALUES
  // ========================================================================

  /**
   * Path drawing progress (0 = not drawn, 1 = fully drawn)
   */
  const drawProgress = useSharedValue(0);

  /**
   * Scale value (for bounce effect)
   */
  const scale = useSharedValue(0);

  /**
   * Rotation value (for celebration spin)
   */
  const rotate = useSharedValue(0);

  /**
   * Glow opacity (pulse effect)
   */
  const glowOpacity = useSharedValue(0);

  // ========================================================================
  // TRIGGER ANIMATION
  // ========================================================================

  /**
   * Trigger the success animation
   */
  const trigger = useCallback(() => {
    console.log('[Animation] Trigger start');
    setIsPlaying(true);
    console.log('[Animation] setIsPlaying done');

    // ========================================
    // PATH DRAWING
    // ========================================

    // Draw checkmark from 0% to 100%
    console.log('[Animation] Starting path animation');
    drawProgress.value = withTiming(1, {
      duration,
      easing: Easing.out(Easing.ease),
    });
    console.log('[Animation] Path animation queued');

    // ========================================
    // SCALE BOUNCE
    // ========================================

    // Scale: 0 → 1.1 → 1 (subtle bounce in)
    console.log('[Animation] Starting scale animation');
    scale.value = withSequence(
      withTiming(0, { duration: 0 }), // Start at 0
      withTiming(1.1, { duration: duration * 0.4, easing: Easing.out(Easing.ease) }), // Grow to 1.1
      withSpring(1, { damping: 14, stiffness: 120 }) // Settle to 1 (more subtle)
    );
    console.log('[Animation] Scale animation queued');

    // ========================================
    // ROTATION (DISABLED - too distracting)
    // ========================================

    // No rotation for more subtle effect
    console.log('[Animation] Setting rotation');
    rotate.value = 0;
    console.log('[Animation] Rotation set');

    // ========================================
    // GLOW PULSE (if enabled)
    // ========================================

    console.log('[Animation] Checking glow:', showGlow);
    if (showGlow) {
      // Subtle glow: 0 → 0.4 → 0.2 (fade in then settle - more subtle)
      console.log('[Animation] Starting glow animation');
      glowOpacity.value = withSequence(
        withTiming(0.4, { duration: duration * 0.5, easing: Easing.out(Easing.ease) }),
        withTiming(0.2, { duration: duration * 0.5, easing: Easing.inOut(Easing.ease) })
      );
      console.log('[Animation] Glow animation queued');
    }

    // ========================================
    // HAPTIC FEEDBACK
    // ========================================

    // Temporarily disabled - crashes on simulator
    // if (enableHaptics) {
    //   // Success haptic notification
    //   Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // }

    // ========================================
    // COMPLETION CALLBACK
    // ========================================

    // Call onComplete after animation finishes
    console.log('[Animation] Setting completion callback, hasCallback:', !!onComplete);
    if (onComplete) {
      setTimeout(() => {
        console.log('[Animation] Completion callback executing');
        setIsPlaying(false);
        console.log('[Animation] setIsPlaying(false) done');
        onComplete();
        console.log('[Animation] onComplete() done');
      }, duration);
    }
    console.log('[Animation] Trigger complete');
  }, [duration, enableHaptics, showGlow, onComplete]);
  // Note: Shared values (drawProgress, scale, rotate, glowOpacity) are NOT included
  // because they're refs and don't change identity

  // ========================================================================
  // ANIMATED PROPS (for SVG)
  // ========================================================================

  /**
   * Animated props for SVG path
   * Controls strokeDashoffset to create drawing effect
   */
  const animatedProps = useAnimatedProps(() => {
    'worklet';

    return {
      strokeDashoffset: (1 - drawProgress.value) * CHECKMARK_PATH_LENGTH,
    };
  }, []);

  // ========================================================================
  // ANIMATED STYLE (for container)
  // ========================================================================

  /**
   * Animated style for checkmark container
   * Handles scale, rotation, and glow
   */
  const animatedStyle = useAnimatedStyle(() => {
    'worklet';

    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotate.value}deg` },
      ],
      // Glow shadow effect (if enabled)
      ...(showGlow && {
        shadowOpacity: glowOpacity.value,
        shadowRadius: 16,
        shadowColor: '#7AF859', // Lime-500
        shadowOffset: { width: 0, height: 0 },
      }),
    };
  }, [showGlow]);

  // ========================================================================
  // CLEANUP
  // ========================================================================

  /**
   * Cancel animations on unmount
   */
  useEffect(() => {
    return () => {
      cancelAnimation(drawProgress);
      cancelAnimation(scale);
      cancelAnimation(rotate);
      cancelAnimation(glowOpacity);
    };
  }, []);

  // ========================================================================
  // RETURN
  // ========================================================================

  return {
    trigger,
    animatedProps,
    animatedStyle,
    isPlaying, // Use state value (safe for render)
  };
}
