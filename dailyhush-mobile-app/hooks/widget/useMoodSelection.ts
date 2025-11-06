/**
 * useMoodSelection Hook
 *
 * Manages mood choice animations:
 * - Staggered entrance (wave effect)
 * - Selection animation (pulse + wiggle)
 * - Fly-out for non-selected moods
 *
 * Features:
 * - Per-mood animated values
 * - Smooth transitions with spring physics
 * - Automatic cleanup
 *
 * @module hooks/widget/useMoodSelection
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import type { MoodChoice, MoodOption, UseMoodSelectionReturn } from '@/types/widget.types';
import { SPRING_CONFIGS } from '@/constants/widgetConfig';

// ============================================================================
// TYPES
// ============================================================================

interface UseMoodSelectionConfig {
  /** Available mood options */
  moods: MoodOption[];

  /** Delay between each mood stagger (ms) */
  staggerDelay: number;

  /** Is mood selector currently visible */
  visible: boolean;
}

/**
 * Animated values for a single mood
 */
interface MoodAnimatedValues {
  opacity: any; // SharedValue<number>
  translateY: any; // SharedValue<number>
  scale: any; // SharedValue<number>
  rotate: any; // SharedValue<number>
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Mood selection animation hook
 *
 * @param config - Configuration for mood animations
 * @returns Selection controls and per-mood animated styles
 *
 * @example
 * ```tsx
 * const { selectMood, moodAnimations, selectedMood } = useMoodSelection({
 *   moods: MOOD_OPTIONS,
 *   staggerDelay: 50,
 *   visible: true,
 * });
 *
 * {moods.map((mood) => (
 *   <Animated.View
 *     key={mood.value}
 *     style={moodAnimations[mood.value].style}
 *   >
 *     <Text>{mood.emoji}</Text>
 *   </Animated.View>
 * ))}
 * ```
 */
export function useMoodSelection(
  config: UseMoodSelectionConfig
): UseMoodSelectionReturn {
  const { moods, staggerDelay, visible } = config;

  // ========================================================================
  // STATE
  // ========================================================================

  const [selectedMood, setSelectedMood] = useState<MoodChoice | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // ========================================================================
  // ANIMATED VALUES (Per Mood)
  // ========================================================================

  /**
   * Create animated values for each mood
   * Using useMemo to avoid recreating on every render
   */
  const moodAnimatedValues = useMemo(() => {
    const values: Record<MoodChoice, MoodAnimatedValues> = {} as any;

    moods.forEach((mood) => {
      values[mood.value] = {
        opacity: useSharedValue(0),
        translateY: useSharedValue(60), // Start 60px below
        scale: useSharedValue(0.8), // Start slightly smaller
        rotate: useSharedValue(0), // For wiggle effect
      };
    });

    return values;
  }, [moods.length]); // Only recreate if mood count changes

  // ========================================================================
  // ENTRANCE ANIMATION
  // ========================================================================

  /**
   * Trigger staggered entrance when visible
   */
  useEffect(() => {
    if (visible && !selectedMood) {
      // Animate each mood with stagger delay
      moods.forEach((mood, index) => {
        const values = moodAnimatedValues[mood.value];
        const delay = index * staggerDelay;

        // Opacity: fade in
        values.opacity.value = withDelay(
          delay,
          withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) })
        );

        // TranslateY: slide up from bottom
        values.translateY.value = withDelay(
          delay,
          withSpring(0, SPRING_CONFIGS.moodSelection)
        );

        // Scale: grow to full size
        values.scale.value = withDelay(
          delay,
          withSpring(1, SPRING_CONFIGS.moodSelection)
        );
      });
    }
  }, [visible, selectedMood]);

  // ========================================================================
  // SELECTION ANIMATION
  // ========================================================================

  /**
   * Select a mood
   * Triggers selection animations:
   * 1. Selected mood pulses and wiggles
   * 2. Other moods fly out to sides
   */
  const selectMood = useCallback((mood: MoodOption) => {
    setSelectedMood(mood.value);

    const selectedValues = moodAnimatedValues[mood.value];

    // ========================================
    // SELECTED MOOD ANIMATIONS
    // ========================================

    // Pulse animation (scale up then settle)
    selectedValues.scale.value = withSequence(
      withTiming(1.2, { duration: 150 }),
      withSpring(1, { damping: 10 })
    );

    // Wiggle animation (rotate left-right-center)
    selectedValues.rotate.value = withSequence(
      withTiming(5, { duration: 100 }),
      withTiming(-5, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );

    // ========================================
    // OTHER MOODS FLY OUT
    // ========================================

    moods.forEach((otherMood, index) => {
      if (otherMood.value !== mood.value) {
        const otherValues = moodAnimatedValues[otherMood.value];

        // Determine fly-out direction
        // Moods on left fly left, moods on right fly right
        const selectedIndex = moods.findIndex((m) => m.value === mood.value);
        const direction = index < selectedIndex ? -1 : 1;

        // Fly out to side with stagger
        otherValues.translateY.value = withDelay(
          index * 30, // Small stagger for wave effect
          withTiming(0, { duration: 200 })
        );

        otherValues.opacity.value = withDelay(
          index * 30,
          withTiming(0, { duration: 200 })
        );

        // Move to side (left or right)
        const translateX = useSharedValue(0);
        translateX.value = withTiming(direction * 100, { duration: 200 });
      }
    });

    // Mark selection as complete after animations
    setTimeout(() => {
      setIsComplete(true);
    }, 400);
  }, [moods, moodAnimatedValues]);

  // ========================================================================
  // ANIMATED STYLES (Per Mood)
  // ========================================================================

  /**
   * Create animated style for each mood
   */
  const moodAnimations = useMemo(() => {
    const animations: Record<MoodChoice, { style: any }> = {} as any;

    moods.forEach((mood) => {
      const values = moodAnimatedValues[mood.value];

      // Create animated style
      animations[mood.value] = {
        style: useAnimatedStyle(() => {
          'worklet';

          return {
            opacity: values.opacity.value,
            transform: [
              { translateY: values.translateY.value },
              { scale: values.scale.value },
              { rotate: `${values.rotate.value}deg` },
            ],
          };
        }, []),
      };
    });

    return animations;
  }, [moods, moodAnimatedValues]);

  // ========================================================================
  // CLEANUP
  // ========================================================================

  /**
   * Cancel all animations on unmount
   */
  useEffect(() => {
    return () => {
      moods.forEach((mood) => {
        const values = moodAnimatedValues[mood.value];
        cancelAnimation(values.opacity);
        cancelAnimation(values.translateY);
        cancelAnimation(values.scale);
        cancelAnimation(values.rotate);
      });
    };
  }, []);

  // ========================================================================
  // RETURN
  // ========================================================================

  return {
    selectMood,
    moodAnimations,
    selectedMood,
    isComplete,
  };
}
