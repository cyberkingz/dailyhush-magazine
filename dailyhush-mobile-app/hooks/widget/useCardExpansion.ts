/**
 * useCardExpansion Hook
 *
 * Manages card height, background color, and shadow animations
 * for the mood widget's expand/collapse behavior.
 *
 * Features:
 * - Smooth expansion/collapse with configurable easing
 * - Background color transitions
 * - Shadow intensity changes
 * - Cancellation on unmount (no memory leaks)
 *
 * @module hooks/widget/useCardExpansion
 */

import { useCallback, useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import type { UseCardExpansionReturn } from '@/types/widget.types';
import { colors } from '@/constants/colors';
import { EASING_CURVES } from '@/constants/widgetConfig';

// ============================================================================
// TYPES
// ============================================================================

interface UseCardExpansionConfig {
  /** Card height when collapsed */
  collapsedHeight: number;

  /** Card height when expanded */
  expandedHeight: number;

  /** Expansion animation duration (ms) */
  expansionDuration: number;

  /** Collapse animation duration (ms) */
  collapseDuration: number;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Card expansion animation hook
 *
 * @param config - Animation configuration
 * @returns Expansion controls and animated styles
 *
 * @example
 * ```tsx
 * const { expand, collapse, animatedCardStyle, isExpanded } = useCardExpansion({
 *   collapsedHeight: 240,
 *   expandedHeight: 480,
 *   expansionDuration: 300,
 *   collapseDuration: 400,
 * });
 *
 * <Animated.View style={[styles.card, animatedCardStyle]}>
 *   {content}
 * </Animated.View>
 * ```
 */
export function useCardExpansion(
  config: UseCardExpansionConfig
): UseCardExpansionReturn {
  const {
    collapsedHeight,
    expandedHeight,
    expansionDuration,
    collapseDuration,
  } = config;

  // ========================================================================
  // ANIMATED VALUES
  // ========================================================================

  /**
   * Card height animated value
   * Starts at collapsed height
   */
  const height = useSharedValue(collapsedHeight);

  /**
   * Expansion state (0 = collapsed, 1 = expanded)
   * Used for background color and shadow interpolation
   */
  const expansionProgress = useSharedValue(0);

  // ========================================================================
  // ANIMATION CONTROLS
  // ========================================================================

  /**
   * Expand the card
   * Smoothly animates from collapsed to expanded state
   */
  const expand = useCallback(() => {
    'worklet';

    // Animate height
    height.value = withTiming(expandedHeight, {
      duration: expansionDuration,
      easing: Easing.bezier(...EASING_CURVES.expansion),
    });

    // Animate expansion progress
    expansionProgress.value = withTiming(1, {
      duration: expansionDuration,
      easing: Easing.bezier(...EASING_CURVES.expansion),
    });
  }, [expandedHeight, expansionDuration]);

  /**
   * Collapse the card
   * Smoothly animates from expanded to collapsed state
   */
  const collapse = useCallback(() => {
    'worklet';

    // Animate height
    height.value = withTiming(collapsedHeight, {
      duration: collapseDuration,
      easing: Easing.bezier(...EASING_CURVES.collapse),
    });

    // Animate expansion progress
    expansionProgress.value = withTiming(0, {
      duration: collapseDuration,
      easing: Easing.bezier(...EASING_CURVES.collapse),
    });
  }, [collapsedHeight, collapseDuration]);

  // ========================================================================
  // ANIMATED STYLES
  // ========================================================================

  /**
   * Animated card style
   * Interpolates height, background color, and shadow based on expansion state
   */
  const animatedCardStyle = useAnimatedStyle(() => {
    'worklet';

    return {
      height: height.value,
      // Subtle background color change during expansion
      backgroundColor: colors.background.card,
      // Shadow intensity increases when expanded (adds depth)
      shadowOpacity: 0.1 + (expansionProgress.value * 0.1),
      shadowRadius: 4 + (expansionProgress.value * 8),
      shadowOffset: {
        width: 0,
        height: 2 + (expansionProgress.value * 4),
      },
      shadowColor: colors.black,
    };
  }, []);

  // ========================================================================
  // CLEANUP
  // ========================================================================

  /**
   * Cancel animations on unmount
   * Prevents memory leaks and warns if animations are running
   */
  useEffect(() => {
    return () => {
      cancelAnimation(height);
      cancelAnimation(expansionProgress);
    };
  }, []);

  // ========================================================================
  // RETURN
  // ========================================================================

  return {
    expand,
    collapse,
    animatedCardStyle,
    isExpanded: expansionProgress.value > 0.5, // Consider expanded if > 50% progress
  };
}
