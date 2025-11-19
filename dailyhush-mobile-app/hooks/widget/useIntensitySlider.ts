/**
 * useIntensitySlider Hook
 *
 * Manages intensity slider with gesture support and tap-to-select fallback.
 * Includes snapping to discrete steps for precise selection.
 *
 * Features:
 * - Gesture-based dragging (swipe to select)
 * - Tap-to-select (accessibility alternative)
 * - Snap to steps with spring physics
 * - Haptic feedback on step change
 *
 * @module hooks/widget/useIntensitySlider
 */

import { useState, useCallback, useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  cancelAnimation,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import type { IntensityValue, UseIntensitySliderReturn } from '@/types/widget.types';
import { SPRING_CONFIGS } from '@/constants/widgetConfig';

// ============================================================================
// TYPES
// ============================================================================

interface UseIntensitySliderConfig {
  /** Intensity range [min, max] */
  range: [number, number];

  /** Initial value */
  initialValue: IntensityValue;

  /** Slider width (for position calculations) */
  sliderWidth: number;

  /** Callback when value changes */
  onChange: (value: IntensityValue) => void;

  /** Enable haptic feedback */
  enableHaptics: boolean;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert slider position (0 - sliderWidth) to intensity value (1-7)
 */
function positionToValue(
  position: number,
  sliderWidth: number,
  range: [number, number]
): IntensityValue {
  const [min, max] = range;
  const steps = max - min;
  const stepWidth = sliderWidth / steps;

  // Calculate which step the position is closest to
  const rawValue = Math.round(position / stepWidth);
  const clampedValue = Math.max(min, Math.min(max, rawValue + min));

  return clampedValue as IntensityValue;
}

/**
 * Convert intensity value (1-7) to slider position (0 - sliderWidth)
 */
function valueToPosition(
  value: IntensityValue,
  sliderWidth: number,
  range: [number, number]
): number {
  const [min, max] = range;
  const steps = max - min;
  const stepWidth = sliderWidth / steps;

  return (value - min) * stepWidth;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Intensity slider animation hook
 *
 * @param config - Slider configuration
 * @returns Slider controls, gesture handler, and animated styles
 *
 * @example
 * ```tsx
 * const { currentValue, setValue, panGesture, thumbStyle } = useIntensitySlider({
 *   range: [1, 7],
 *   initialValue: 4,
 *   sliderWidth: 280,
 *   onChange: (value) => console.log('Intensity:', value),
 *   enableHaptics: true,
 * });
 *
 * <GestureDetector gesture={panGesture}>
 *   <View style={styles.sliderTrack}>
 *     <Animated.View style={[styles.thumb, thumbStyle]} />
 *   </View>
 * </GestureDetector>
 * ```
 */
export function useIntensitySlider(config: UseIntensitySliderConfig): UseIntensitySliderReturn {
  const { range, initialValue, sliderWidth, onChange, enableHaptics } = config;

  // ========================================================================
  // STATE
  // ========================================================================

  const [currentValue, setCurrentValue] = useState<IntensityValue>(initialValue);

  // ========================================================================
  // ANIMATED VALUES
  // ========================================================================

  /**
   * Thumb position (0 to sliderWidth)
   * Starts at initial value position
   */
  const thumbPosition = useSharedValue(valueToPosition(initialValue, sliderWidth, range));

  /**
   * Thumb scale (for press feedback)
   * Grows slightly when being dragged
   */
  const thumbScale = useSharedValue(1);

  /**
   * Track start position (for gesture)
   */
  const startPosition = useSharedValue(0);

  // ========================================================================
  // VALUE SETTERS
  // ========================================================================

  /**
   * Set intensity value (programmatically)
   * Animates thumb to new position
   */
  const setValue = useCallback(
    (value: IntensityValue) => {
      setCurrentValue(value);

      // Animate thumb to new position
      thumbPosition.value = withSpring(
        valueToPosition(value, sliderWidth, range),
        SPRING_CONFIGS.sliderSnap
      );

      // Trigger haptic feedback
      if (enableHaptics) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Call onChange callback
      onChange(value);
    },
    [sliderWidth, range, enableHaptics, onChange]
  );

  /**
   * Update value from position (internal use)
   */
  const updateValueFromPosition = useCallback(
    (position: number) => {
      const clampedPosition = Math.max(0, Math.min(sliderWidth, position));
      const newValue = positionToValue(clampedPosition, sliderWidth, range);

      // Only update if value actually changed
      if (newValue !== currentValue) {
        setCurrentValue(newValue);
        onChange(newValue);

        // Haptic feedback on step change
        if (enableHaptics) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }
    },
    [currentValue, sliderWidth, range, enableHaptics, onChange]
  );

  // ========================================================================
  // GESTURE HANDLER
  // ========================================================================

  /**
   * Pan gesture for dragging the slider
   * Supports both dragging and tapping
   */
  const panGesture = Gesture.Pan()
    .manualActivation(true)
    .onTouchesDown((_, stateManager) => {
      'worklet';
      stateManager.begin();
      stateManager.activate();
    })
    .onTouchesMove((_, stateManager) => {
      'worklet';
      stateManager.begin();
      stateManager.activate();
    })
    .onBegin(() => {
      'worklet';

      // Save start position
      startPosition.value = thumbPosition.value;

      // Scale up thumb (visual feedback)
      thumbScale.value = withSpring(1.3, { damping: 12, stiffness: 200 });
    })
    .onUpdate((event) => {
      'worklet';

      const newPosition = startPosition.value + event.translationX;
      thumbPosition.value = Math.max(0, Math.min(sliderWidth, newPosition));
    })
    .onChange((event) => {
      'worklet';

      // Run onChange on JS thread
      runOnJS(updateValueFromPosition)(thumbPosition.value);
    })
    .onEnd(() => {
      'worklet';

      // Snap to nearest step
      const finalValue = positionToValue(thumbPosition.value, sliderWidth, range);
      const snappedPosition = valueToPosition(finalValue, sliderWidth, range);

      thumbPosition.value = withSpring(snappedPosition, SPRING_CONFIGS.sliderSnap);

      // Scale thumb back to normal
      thumbScale.value = withSpring(1, { damping: 10 });

      // Update final value
      runOnJS(updateValueFromPosition)(snappedPosition);
    })
    .onFinalize(() => {
      'worklet';

      // Ensure thumb is back to normal size
      thumbScale.value = withSpring(1, { damping: 10 });
    });

  // ========================================================================
  // ANIMATED STYLES
  // ========================================================================

  /**
   * Animated style for slider container
   * (Could add active track fill here)
   */
  const animatedStyle = useAnimatedStyle(() => {
    'worklet';

    return {
      // Active track width (filled portion)
      width: thumbPosition.value,
    };
  }, []);

  /**
   * Animated style for thumb
   */
  const thumbStyle = useAnimatedStyle(() => {
    'worklet';

    return {
      transform: [{ translateX: thumbPosition.value }, { scale: thumbScale.value }],
    };
  }, []);

  // ========================================================================
  // EFFECTS
  // ========================================================================

  /**
   * Update position when initial value changes
   */
  useEffect(() => {
    thumbPosition.value = withSpring(
      valueToPosition(initialValue, sliderWidth, range),
      SPRING_CONFIGS.sliderSnap
    );
    setCurrentValue(initialValue);
  }, [initialValue]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      cancelAnimation(thumbPosition);
      cancelAnimation(thumbScale);
    };
  }, []);

  // ========================================================================
  // RETURN
  // ========================================================================

  return {
    currentValue,
    setValue,
    panGesture,
    animatedStyle,
    thumbStyle,
  };
}
