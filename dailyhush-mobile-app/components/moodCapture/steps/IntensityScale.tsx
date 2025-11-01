/**
 * DailyHush - Step 2: Intensity Circular Dial
 *
 * Circular dial with draggable handle to select intensity (1-10).
 * User can drag the handle around the circle or tap on a position.
 */

import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  getMoodEmoji,
  getMoodLabel,
  type IntensityValue,
  INTENSITY_LABELS,
} from '@/constants/moodOptions';
import { colors } from '@/constants/colors';
import type { Enums } from '@/types/supabase';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DIAL_SIZE = Math.min(SCREEN_WIDTH - 80, 320);
const DIAL_RADIUS = DIAL_SIZE / 2;
const HANDLE_SIZE = 64; // Increased from 56 for better accessibility
const TRACK_RADIUS = DIAL_RADIUS - 40; // Handle moves on this circle
const INTENSITY_VALUES: IntensityValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const INTENSITY_STEP_DEGREES = 360 / INTENSITY_VALUES.length;
const INTENSITY_START_ANGLE = 90; // Intensity 1 is at the top of the circle

// ============================================================================
// TYPES
// ============================================================================

interface IntensityScaleProps {
  selectedMood: Enums<'mood_type'>;
  selectedIntensity?: IntensityValue;
  onIntensitySelect: (intensity: IntensityValue) => void;
  autoAdvance?: boolean;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Calculate angle from center (0° = right, increases counter-clockwise)
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

// Snap angle to nearest intensity position
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

// Get position for a given intensity (centered on handle, not top-left)
function getPositionForIntensity(intensity: IntensityValue): { x: number; y: number; angle: number } {
  const angle = getAngleForIntensity(intensity);
  const radians = (angle * Math.PI) / 180;

  // Calculate position on circle (centered coordinates)
  const x = DIAL_RADIUS + TRACK_RADIUS * Math.cos(radians);
  const y = DIAL_RADIUS - TRACK_RADIUS * Math.sin(radians);

  return { x, y, angle };
}

// ============================================================================
// COMPONENT
// ============================================================================

export function IntensityScale({
  selectedMood,
  selectedIntensity,
  onIntensitySelect,
  autoAdvance = true,
}: IntensityScaleProps) {
  const [currentIntensity, setCurrentIntensity] = useState<IntensityValue>(selectedIntensity || 3);
  const lastHapticIntensity = useRef<IntensityValue | null>(null);
  const dialRef = useRef<View>(null);
  const dialCenter = useRef({ x: 0, y: 0 }).current;
  const hasMeasuredDial = useRef(false);
  const currentIntensityRef = useRef<IntensityValue>(selectedIntensity || 3);
  const isDragging = useRef(false);

  // Animation values - all using JS driver
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

  // Initialize handle position
  React.useEffect(() => {
    if (isDragging.current) return;
    updateHandlePosition(currentIntensity);
  }, [currentIntensity, updateHandlePosition]);

  React.useEffect(() => {
    currentIntensityRef.current = currentIntensity;
  }, [currentIntensity]);

  // Update if parent provides a new selected intensity
  React.useEffect(() => {
    if (selectedIntensity === undefined) return;
    if (selectedIntensity !== currentIntensityRef.current) {
      setCurrentIntensity(selectedIntensity);
    }
  }, [selectedIntensity]);

  const finishDrag = React.useCallback(() => {
    const activeIntensity = currentIntensityRef.current;
    const position = getPositionForIntensity(activeIntensity);

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

    onIntensitySelect(activeIntensity);
    lastHapticIntensity.current = activeIntensity;
    isDragging.current = false;
  }, [handleX, handleY, handleScale, onIntensitySelect]);

  // Measure dial position on screen
  const handleDialLayout = () => {
    measureDial();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        isDragging.current = true;
        measureDial();

        // Scale up handle
        Animated.spring(handleScale, {
          toValue: 1.12, // Slightly reduced from 1.15 for subtlety
          tension: 90, // Reduced from 100 for softer animation
          friction: 9, // Increased from 7 for smoother motion
          useNativeDriver: false,
        }).start();

        // Haptic feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      },

      onPanResponderMove: (event, gestureState) => {
        if (!hasMeasuredDial.current) {
          measureDial();
          return;
        }

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
            newIntensity >= 4
              ? Haptics.ImpactFeedbackStyle.Heavy
              : newIntensity >= 3
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

  const moodEmoji = getMoodEmoji(selectedMood);
  const moodLabel = getMoodLabel(selectedMood);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          How {moodLabel.toLowerCase()} {moodEmoji}
        </Text>
        <Text style={styles.subtitle}>Drag to rate the intensity</Text>
      </View>

      {/* Circular Dial */}
      <View style={styles.dialContainer}>
        {/* Dial Background */}
        <View ref={dialRef} onLayout={handleDialLayout} style={styles.dialBackground}>
          {/* Center Label */}
          <View style={styles.centerLabel}>
            <Text style={styles.intensityNumber}>{currentIntensity}</Text>
            <Text style={styles.intensityLabel}>
              {INTENSITY_LABELS[currentIntensity]}
            </Text>
          </View>

          {/* Arc/Track - Render BEFORE markers so markers appear on top */}
          <View style={styles.track} />

          {/* Position Markers - Now render AFTER track for proper layering */}
          {INTENSITY_VALUES.map((intensity) => {
            const position = getPositionForIntensity(intensity);
            const isActive = intensity === currentIntensity;

            return (
              <TouchableOpacity
                key={intensity}
                style={[
                  styles.markerTouchable,
                  {
                    left: position.x - 24, // Center 48px tap area
                    top: position.y - 24,
                  },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setCurrentIntensity(intensity);
                  updateHandlePosition(intensity);
                  onIntensitySelect(intensity);
                }}
                accessibilityLabel={`Intensity ${intensity}: ${INTENSITY_LABELS[intensity]}`}
                accessibilityRole="button"
              >
                <View
                  style={[
                    styles.marker,
                    {
                      backgroundColor: isActive
                        ? colors.emerald[500] // Solid emerald when active
                        : 'rgba(15, 50, 41, 0.95)', // Solid dark background when inactive
                      borderWidth: isActive ? 0 : 3, // Ring only when inactive
                      borderColor: isActive
                        ? 'transparent'
                        : 'rgba(16, 185, 129, 0.75)', // Emerald ring for inactive markers
                      width: isActive ? 18 : 14, // Slightly larger for better visibility
                      height: isActive ? 18 : 14,
                      borderRadius: isActive ? 9 : 7,
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

      {/* Helper copy */}
      <View style={styles.helperTextContainer}>
        <Text style={styles.helperText}>Drag or tap to adjust intensity</Text>
      </View>
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 36,
    letterSpacing: -0.2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16, // Increased from 15 for readability
    fontWeight: '400',
    lineHeight: 22,
    color: colors.text.secondary,
    textAlign: 'center',
    opacity: 0.85, // Increased from 0.7 for contrast
  },
  dialContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  dialBackground: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    borderRadius: DIAL_SIZE / 2,
    backgroundColor: 'rgba(15, 50, 41, 0.65)', // Increased from 0.4 for better contrast
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.30)', // Increased from 0.15 for visibility
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
    borderColor: 'rgba(16, 185, 129, 0.25)', // More subtle to let markers stand out
    borderStyle: 'dashed',
    zIndex: 1, // Below markers but above background
  },
  centerLabel: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  intensityNumber: {
    fontSize: 48, // Reduced from 56 for better hierarchy
    fontWeight: '700',
    color: colors.emerald[400], // Softer than 500 for less intensity
    lineHeight: 56,
    marginBottom: 4,
  },
  intensityLabel: {
    fontSize: 20, // Increased from 18 for prominence
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    letterSpacing: 0.5, // Better readability
  },
  markerTouchable: {
    position: 'absolute',
    width: 48, // Large tap target for accessibility
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Ensure markers render above track
  },
  marker: {
    shadowColor: colors.emerald[500],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6, // Enhanced shadow for depth
    shadowRadius: 6, // Larger glow
    elevation: 3, // Higher elevation for Android
  },
  handle: {
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: HANDLE_SIZE / 2,
    backgroundColor: colors.emerald[500], // Lighter for better visibility
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.emerald[400], // Lighter shadow for visibility
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7, // Increased from 0.5 for stronger glow
    shadowRadius: 12, // Increased from 8 for more prominent shadow
    elevation: 10, // Increased from 8
    borderWidth: 5, // Increased from 4 for better affordance
    borderColor: 'rgba(255, 255, 255, 0.6)', // Increased from 0.3 for visibility
    zIndex: 20, // Highest layer - handle should always be on top
  },
  handleInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  helperTextContainer: {
    width: DIAL_SIZE,
    marginTop: 4,
    alignItems: 'center',
  },
  helperText: {
    fontSize: 15, // Increased from 14 for readability
    fontWeight: '500',
    textAlign: 'center',
    color: colors.text.secondary,
    opacity: 0.80, // Increased from 0.75 for contrast
  },
});
