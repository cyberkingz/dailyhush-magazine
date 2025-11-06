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
  // ANIMATED VALUES (Per Mood) - CALLED AT TOP LEVEL
  // ========================================================================

  // CALM mood animated values
  const calmOpacity = useSharedValue(1); // Start visible
  const calmTranslateY = useSharedValue(0); // Start in position
  const calmScale = useSharedValue(1); // Start full size
  const calmRotate = useSharedValue(0);

  // ANXIOUS mood animated values
  const anxiousOpacity = useSharedValue(1);
  const anxiousTranslateY = useSharedValue(0);
  const anxiousScale = useSharedValue(1);
  const anxiousRotate = useSharedValue(0);

  // SAD mood animated values
  const sadOpacity = useSharedValue(1);
  const sadTranslateY = useSharedValue(0);
  const sadScale = useSharedValue(1);
  const sadRotate = useSharedValue(0);

  // FRUSTRATED mood animated values
  const frustratedOpacity = useSharedValue(1);
  const frustratedTranslateY = useSharedValue(0);
  const frustratedScale = useSharedValue(1);
  const frustratedRotate = useSharedValue(0);

  // MIXED mood animated values
  const mixedOpacity = useSharedValue(1);
  const mixedTranslateY = useSharedValue(0);
  const mixedScale = useSharedValue(1);
  const mixedRotate = useSharedValue(0);

  // ========================================================================
  // ANIMATED STYLES (Per Mood) - CALLED AT TOP LEVEL
  // ========================================================================

  const calmAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: calmOpacity.value,
      transform: [
        { translateY: calmTranslateY.value },
        { scale: calmScale.value },
        { rotate: `${calmRotate.value}deg` },
      ],
    };
  }, []);

  const anxiousAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: anxiousOpacity.value,
      transform: [
        { translateY: anxiousTranslateY.value },
        { scale: anxiousScale.value },
        { rotate: `${anxiousRotate.value}deg` },
      ],
    };
  }, []);

  const sadAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: sadOpacity.value,
      transform: [
        { translateY: sadTranslateY.value },
        { scale: sadScale.value },
        { rotate: `${sadRotate.value}deg` },
      ],
    };
  }, []);

  const frustratedAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: frustratedOpacity.value,
      transform: [
        { translateY: frustratedTranslateY.value },
        { scale: frustratedScale.value },
        { rotate: `${frustratedRotate.value}deg` },
      ],
    };
  }, []);

  const mixedAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: mixedOpacity.value,
      transform: [
        { translateY: mixedTranslateY.value },
        { scale: mixedScale.value },
        { rotate: `${mixedRotate.value}deg` },
      ],
    };
  }, []);

  // ========================================================================
  // ASSEMBLE INTO RECORDS
  // ========================================================================

  const moodAnimatedValues = useMemo<Record<MoodChoice, MoodAnimatedValues>>(() => ({
    calm: {
      opacity: calmOpacity,
      translateY: calmTranslateY,
      scale: calmScale,
      rotate: calmRotate,
    },
    anxious: {
      opacity: anxiousOpacity,
      translateY: anxiousTranslateY,
      scale: anxiousScale,
      rotate: anxiousRotate,
    },
    sad: {
      opacity: sadOpacity,
      translateY: sadTranslateY,
      scale: sadScale,
      rotate: sadRotate,
    },
    frustrated: {
      opacity: frustratedOpacity,
      translateY: frustratedTranslateY,
      scale: frustratedScale,
      rotate: frustratedRotate,
    },
    mixed: {
      opacity: mixedOpacity,
      translateY: mixedTranslateY,
      scale: mixedScale,
      rotate: mixedRotate,
    },
  }), []);

  const moodAnimations = useMemo<Record<MoodChoice, { style: any }>>(() => ({
    calm: { style: calmAnimatedStyle },
    anxious: { style: anxiousAnimatedStyle },
    sad: { style: sadAnimatedStyle },
    frustrated: { style: frustratedAnimatedStyle },
    mixed: { style: mixedAnimatedStyle },
  }), [calmAnimatedStyle, anxiousAnimatedStyle, sadAnimatedStyle, frustratedAnimatedStyle, mixedAnimatedStyle]);

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
  }, [visible, selectedMood, moods, staggerDelay, moodAnimatedValues]);

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

        // Fly out with stagger
        otherValues.translateY.value = withDelay(
          index * 30, // Small stagger for wave effect
          withTiming(0, { duration: 200 })
        );

        otherValues.opacity.value = withDelay(
          index * 30,
          withTiming(0, { duration: 200 })
        );
      }
    });

    // Mark selection as complete after animations
    setTimeout(() => {
      setIsComplete(true);
    }, 400);
  }, [moods, moodAnimatedValues]);

  // ========================================================================
  // CLEANUP
  // ========================================================================

  /**
   * Cancel all animations on unmount
   */
  useEffect(() => {
    return () => {
      // Cancel calm animations
      cancelAnimation(calmOpacity);
      cancelAnimation(calmTranslateY);
      cancelAnimation(calmScale);
      cancelAnimation(calmRotate);

      // Cancel anxious animations
      cancelAnimation(anxiousOpacity);
      cancelAnimation(anxiousTranslateY);
      cancelAnimation(anxiousScale);
      cancelAnimation(anxiousRotate);

      // Cancel sad animations
      cancelAnimation(sadOpacity);
      cancelAnimation(sadTranslateY);
      cancelAnimation(sadScale);
      cancelAnimation(sadRotate);

      // Cancel frustrated animations
      cancelAnimation(frustratedOpacity);
      cancelAnimation(frustratedTranslateY);
      cancelAnimation(frustratedScale);
      cancelAnimation(frustratedRotate);

      // Cancel mixed animations
      cancelAnimation(mixedOpacity);
      cancelAnimation(mixedTranslateY);
      cancelAnimation(mixedScale);
      cancelAnimation(mixedRotate);
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
