/**
 * IntensityCircular Component (Widget Optimized)
 *
 * Compact circular dial for inline mood widget.
 * Smaller size optimized to fit within card layout.
 */

import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, TouchableOpacity, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/designTokens';
import type { IntensityValue } from '@/types/widget.types';
import { useScrollControl } from './ScrollControlContext';

// Compact dimensions for widget card
const DIAL_SIZE = 240; // Reduced from 320
const DIAL_RADIUS = DIAL_SIZE / 2;
const HANDLE_SIZE = 48; // Reduced from 64
const TRACK_RADIUS = DIAL_RADIUS - 32; // Handle moves on this circle
const INTENSITY_VALUES: IntensityValue[] = [1, 2, 3, 4, 5, 6, 7];
const INTENSITY_STEP_DEGREES = 360 / INTENSITY_VALUES.length;
const INTENSITY_START_ANGLE = 90; // Intensity 1 is at the top

const INTENSITY_LABELS: Record<IntensityValue, string> = {
  1: 'Very Low',
  2: 'Low',
  3: 'Mild',
  4: 'Moderate',
  5: 'Strong',
  6: 'Very Strong',
  7: 'Extreme',
};

interface IntensityCircularProps {
  selectedIntensity?: IntensityValue;
  onIntensitySelect: (intensity: IntensityValue) => void;
}

// Calculate angle from center
function calculateAngle(x: number, y: number): number {
  const angle = Math.atan2(-y, x) * (180 / Math.PI);
  return (angle + 360) % 360;
}

function getAngleForIntensity(intensity: IntensityValue): number {
  const index = INTENSITY_VALUES.indexOf(intensity);
  if (index === -1) return INTENSITY_START_ANGLE;
  const angle = INTENSITY_START_ANGLE - index * INTENSITY_STEP_DEGREES;
  return (angle + 360) % 360;
}

function snapToIntensity(angle: number): IntensityValue {
  let closestIntensity = INTENSITY_VALUES[0];
  let minDiff = 360;

  for (const value of INTENSITY_VALUES) {
    const targetAngle = getAngleForIntensity(value);
    let diff = Math.abs(angle - targetAngle);
    if (diff > 180) diff = 360 - diff;

    if (diff < minDiff) {
      minDiff = diff;
      closestIntensity = value;
    }
  }

  return closestIntensity;
}

function getPositionForIntensity(intensity: IntensityValue): { x: number; y: number } {
  const angle = getAngleForIntensity(intensity);
  const radians = (angle * Math.PI) / 180;
  const x = DIAL_RADIUS + TRACK_RADIUS * Math.cos(radians);
  const y = DIAL_RADIUS - TRACK_RADIUS * Math.sin(radians);
  return { x, y };
}

export function IntensityCircular({ selectedIntensity, onIntensitySelect }: IntensityCircularProps) {
  const [currentIntensity, setCurrentIntensity] = useState<IntensityValue>(selectedIntensity || 4);
  const lastHapticIntensity = useRef<IntensityValue | null>(null);
  const dialRef = useRef<View>(null);
  const dialCenter = useRef({ x: 0, y: 0 }).current;
  const hasMeasuredDial = useRef(false);
  const currentIntensityRef = useRef<IntensityValue>(selectedIntensity || 4);
  const isDragging = useRef(false);

  // Get scroll control to disable parent ScrollView during drag
  const { setScrollEnabled } = useScrollControl();

  const handleX = useRef(new Animated.Value(0)).current;
  const handleY = useRef(new Animated.Value(0)).current;
  const handleScale = useRef(new Animated.Value(1)).current;

  const updateHandlePosition = React.useCallback(
    (intensity: IntensityValue) => {
      const position = getPositionForIntensity(intensity);
      handleX.setValue(position.x - HANDLE_SIZE / 2);
      handleY.setValue(position.y - HANDLE_SIZE / 2);
    },
    [handleX, handleY]
  );

  const measureDial = React.useCallback(() => {
    dialRef.current?.measure((x, y, width, height, pageX, pageY) => {
      dialCenter.x = pageX + width / 2;
      dialCenter.y = pageY + height / 2;
      hasMeasuredDial.current = true;
    });
  }, [dialCenter]);

  React.useEffect(() => {
    if (isDragging.current) return;
    updateHandlePosition(currentIntensity);
  }, [currentIntensity, updateHandlePosition]);

  React.useEffect(() => {
    currentIntensityRef.current = currentIntensity;
  }, [currentIntensity]);

  React.useEffect(() => {
    if (selectedIntensity === undefined) return;
    if (selectedIntensity !== currentIntensityRef.current) {
      setCurrentIntensity(selectedIntensity);
    }
  }, [selectedIntensity]);

  // Force measurement after mount to ensure drag works immediately
  React.useEffect(() => {
    const timer = setTimeout(() => {
      measureDial();
    }, 100);
    return () => clearTimeout(timer);
  }, [measureDial]);

  const finishDrag = React.useCallback(() => {
    const activeIntensity = currentIntensityRef.current;
    const position = getPositionForIntensity(activeIntensity);

    // Re-enable parent ScrollView after drag completes
    setScrollEnabled(true);

    Animated.parallel([
      Animated.spring(handleX, {
        toValue: position.x - HANDLE_SIZE / 2,
        tension: 50,
        friction: 12,
        useNativeDriver: false,
      }),
      Animated.spring(handleY, {
        toValue: position.y - HANDLE_SIZE / 2,
        tension: 50,
        friction: 12,
        useNativeDriver: false,
      }),
      Animated.spring(handleScale, {
        toValue: 1,
        tension: 80,
        friction: 10,
        useNativeDriver: false,
      }),
    ]).start();

    // Don't auto-advance - user must click Continue button
    lastHapticIntensity.current = activeIntensity;
    isDragging.current = false;
  }, [handleX, handleY, handleScale, setScrollEnabled]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false, // Don't let parent ScrollView steal the gesture

      onPanResponderGrant: () => {
        isDragging.current = true;
        measureDial();

        // Disable parent ScrollView to prevent scroll during drag
        setScrollEnabled(false);

        Animated.spring(handleScale, {
          toValue: 1.12,
          tension: 90,
          friction: 9,
          useNativeDriver: false,
        }).start();

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      },

      onPanResponderMove: (event, gestureState) => {
        // Get absolute touch position
        const touchX = event.nativeEvent.pageX ?? gestureState.moveX;
        const touchY = event.nativeEvent.pageY ?? gestureState.moveY;

        // Calculate relative position from dial center
        const relativeX = touchX - dialCenter.x;
        const relativeY = touchY - dialCenter.y;

        // Calculate angle from center
        const angle = calculateAngle(relativeX, relativeY);

        // Calculate position on the track circle (constrain to track radius)
        const radians = (angle * Math.PI) / 180;
        const trackX = DIAL_RADIUS + TRACK_RADIUS * Math.cos(radians);
        const trackY = DIAL_RADIUS - TRACK_RADIUS * Math.sin(radians);

        // Move handle smoothly along the track
        handleX.setValue(trackX - HANDLE_SIZE / 2);
        handleY.setValue(trackY - HANDLE_SIZE / 2);

        // Snap to nearest intensity (for state only)
        const activeIntensity = currentIntensityRef.current;
        const newIntensity = snapToIntensity(angle);

        // Update intensity and trigger haptic if changed
        if (newIntensity !== activeIntensity) {
          const hapticStyle =
            newIntensity >= 6
              ? Haptics.ImpactFeedbackStyle.Heavy
              : newIntensity >= 4
              ? Haptics.ImpactFeedbackStyle.Medium
              : Haptics.ImpactFeedbackStyle.Light;

          if (lastHapticIntensity.current !== newIntensity) {
            Haptics.impactAsync(hapticStyle);
            lastHapticIntensity.current = newIntensity;
          }
          setCurrentIntensity(newIntensity);
        }
      },

      onPanResponderRelease: finishDrag,
      onPanResponderTerminate: finishDrag,
    })
  ).current;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Rate the intensity</Text>

      {/* Circular Dial */}
      <View style={styles.dialContainer}>
        <View
          ref={dialRef}
          onLayout={() => measureDial()}
          style={styles.dialBackground}
        >
          {/* Center Label */}
          <View style={styles.centerLabel}>
            <Text style={styles.intensityNumber}>{currentIntensity}</Text>
            <Text style={styles.intensityLabel}>
              {INTENSITY_LABELS[currentIntensity]}
            </Text>
          </View>

          {/* Track */}
          <View style={styles.track} />

          {/* Position Markers */}
          {INTENSITY_VALUES.map((intensity) => {
            const position = getPositionForIntensity(intensity);
            const isActive = intensity === currentIntensity;

            return (
              <TouchableOpacity
                key={intensity}
                style={[
                  styles.markerTouchable,
                  {
                    left: position.x - 20,
                    top: position.y - 20,
                  },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setCurrentIntensity(intensity);
                  updateHandlePosition(intensity);
                }}
                accessibilityLabel={`Intensity ${intensity}`}
                accessibilityRole="button"
              >
                <View
                  style={[
                    styles.marker,
                    {
                      backgroundColor: isActive ? colors.lime[500] : 'rgba(15, 50, 41, 0.95)',
                      borderWidth: isActive ? 0 : 2,
                      borderColor: isActive ? 'transparent' : 'rgba(122, 248, 89, 0.75)',
                      width: isActive ? 14 : 10,
                      height: isActive ? 14 : 10,
                      borderRadius: isActive ? 7 : 5,
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          })}

          {/* Draggable Handle */}
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.handle,
              {
                left: handleX,
                top: handleY,
                transform: [{ scale: handleScale }],
              },
            ]}
          >
            <View style={styles.handleInner} />
          </Animated.View>
        </View>
      </View>

      {/* Helper text */}
      <Text style={styles.helperText}>Drag or tap to adjust</Text>

      {/* Continue button */}
      <Pressable
        style={styles.continueButton}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onIntensitySelect(currentIntensity);
        }}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  dialContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  dialBackground: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    borderRadius: DIAL_SIZE / 2,
    backgroundColor: 'rgba(15, 50, 41, 0.65)',
    borderWidth: 2,
    borderColor: 'rgba(122, 248, 89, 0.30)',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    position: 'absolute',
    width: TRACK_RADIUS * 2,
    height: TRACK_RADIUS * 2,
    borderRadius: TRACK_RADIUS,
    borderWidth: 2,
    borderColor: 'rgba(122, 248, 89, 0.25)',
    borderStyle: 'dashed',
    zIndex: 1,
  },
  centerLabel: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  intensityNumber: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.lime[500],
    lineHeight: 48,
    marginBottom: 2,
  },
  intensityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
  },
  markerTouchable: {
    position: 'absolute',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  marker: {
    shadowColor: colors.lime[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 3,
  },
  handle: {
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: HANDLE_SIZE / 2,
    backgroundColor: colors.lime[500],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.lime[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    zIndex: 20,
  },
  handleInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  helperText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    color: colors.text.secondary,
    opacity: 0.80,
    marginBottom: SPACING.md,
  },
  continueButton: {
    backgroundColor: colors.lime[600],
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 999,
    minWidth: 140,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background.primary,
    textAlign: 'center',
  },
});
