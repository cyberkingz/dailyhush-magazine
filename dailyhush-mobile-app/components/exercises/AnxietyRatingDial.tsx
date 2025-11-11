/**
 * Nœma - Anxiety Rating Circular Dial
 *
 * Circular dial with draggable handle to select anxiety level (1-10).
 * Adapted from IntensityScale for exercise pre/post ratings.
 * User can drag the handle around the circle or tap on a position.
 *
 * REFACTORED: Uses design tokens, no hardcoded values
 */

import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ANXIETY_SCALE } from '@/types/exercises';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, OPACITY } from '@/constants/design-tokens';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

// ============================================================================
// DIAL CONFIGURATION CONSTANTS
// ============================================================================
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DIAL_SIZE = Math.min(SCREEN_WIDTH - spacing['2xl'] * 2.5, 320);
const DIAL_RADIUS = DIAL_SIZE / 2;
const HANDLE_SIZE = 64;
const TRACK_RADIUS = DIAL_RADIUS - spacing['3xl'] - spacing.sm;
const RATING_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
const RATING_STEP_DEGREES = 360 / RATING_VALUES.length;
const RATING_START_ANGLE = 90; // Rating 1 is at the top

// Position marker sizes
const MARKER_ACTIVE_SIZE = 18;
const MARKER_INACTIVE_SIZE = 14;
const MARKER_TOUCHABLE_SIZE = 48;

// ============================================================================
// TYPES
// ============================================================================

interface AnxietyRatingDialProps {
  selectedRating?: number | null;
  onRatingSelect: (rating: number) => void;
  type: 'pre' | 'post';
}

interface AnxietyColorSet {
  primary: string;
  shadow: string;
  border: string;
}

type RatingValue = typeof RATING_VALUES[number];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate angle from cartesian coordinates
 */
function calculateAngle(x: number, y: number): number {
  const angle = Math.atan2(-y, x) * (180 / Math.PI);
  return (angle + 360) % 360;
}

/**
 * Get angle position for a specific rating value
 */
function getAngleForRating(rating: number): number {
  const index = RATING_VALUES.indexOf(rating as RatingValue);
  if (index === -1) return RATING_START_ANGLE;
  const angle = RATING_START_ANGLE - index * RATING_STEP_DEGREES;
  return (angle + 360) % 360;
}

/**
 * Snap angle to nearest rating value
 */
function snapToRating(angle: number): RatingValue {
  let closestRating: RatingValue = RATING_VALUES[0];
  let minDiff = 360;

  for (const value of RATING_VALUES) {
    const targetAngle = getAngleForRating(value);
    let diff = Math.abs(angle - targetAngle);
    if (diff > 180) diff = 360 - diff;

    if (diff < minDiff) {
      minDiff = diff;
      closestRating = value;
    }
  }

  return closestRating;
}

/**
 * Calculate x, y position for a rating value on the circular track
 */
function getPositionForRating(rating: number): { x: number; y: number; angle: number } {
  const angle = getAngleForRating(rating);
  const radians = (angle * Math.PI) / 180;

  const x = DIAL_RADIUS + TRACK_RADIUS * Math.cos(radians);
  const y = DIAL_RADIUS - TRACK_RADIUS * Math.sin(radians);

  return { x, y, angle };
}

/**
 * Get color scheme based on anxiety level (1-10)
 * Low (1-3): Green
 * Medium (4-6): Yellow
 * High (7-10): Red
 */
function getAnxietyColor(rating: number): AnxietyColorSet {
  if (rating <= 3) {
    return COLORS.anxiety.low;
  } else if (rating <= 6) {
    return COLORS.anxiety.medium;
  } else {
    return COLORS.anxiety.high;
  }
}

/**
 * Get haptic intensity based on rating
 */
function getHapticStyle(rating: number): Haptics.ImpactFeedbackStyle {
  if (rating >= 7) return Haptics.ImpactFeedbackStyle.Heavy;
  if (rating >= 4) return Haptics.ImpactFeedbackStyle.Medium;
  return Haptics.ImpactFeedbackStyle.Light;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function AnxietyRatingDial({
  selectedRating,
  onRatingSelect,
  type,
}: AnxietyRatingDialProps) {
  const [currentRating, setCurrentRating] = useState<number>(selectedRating || 5);
  const lastHapticRating = useRef<number | null>(null);
  const dialRef = useRef<View>(null);
  const dialCenter = useRef({ x: 0, y: 0 }).current;
  const hasMeasuredDial = useRef(false);
  const currentRatingRef = useRef<number>(selectedRating || 5);
  const isDragging = useRef(false);

  // Animation values
  const handleX = useRef(new Animated.Value(0)).current;
  const handleY = useRef(new Animated.Value(0)).current;
  const handleScale = useRef(new Animated.Value(1)).current;

  /**
   * Update handle position based on rating
   */
  const updateHandlePosition = React.useCallback(
    (rating: number) => {
      const position = getPositionForRating(rating);
      handleX.setValue(position.x - HANDLE_SIZE / 2);
      handleY.setValue(position.y - HANDLE_SIZE / 2);
    },
    [handleX, handleY]
  );

  /**
   * Measure dial position on screen
   */
  const measureDial = React.useCallback(() => {
    dialRef.current?.measure((x, y, width, height, pageX, pageY) => {
      dialCenter.x = pageX + width / 2;
      dialCenter.y = pageY + height / 2;
      hasMeasuredDial.current = true;
    });
  }, [dialCenter]);

  /**
   * Finish drag gesture with spring animation
   */
  const finishDrag = React.useCallback(() => {
    const activeRating = currentRatingRef.current;
    const position = getPositionForRating(activeRating);

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

    onRatingSelect(activeRating);
    lastHapticRating.current = activeRating;
    isDragging.current = false;
  }, [handleX, handleY, handleScale, onRatingSelect]);

  // Initialize handle position
  React.useEffect(() => {
    if (isDragging.current) return;
    updateHandlePosition(currentRating);
  }, [currentRating, updateHandlePosition]);

  React.useEffect(() => {
    currentRatingRef.current = currentRating;
  }, [currentRating]);

  // Update if parent provides a new selected rating
  React.useEffect(() => {
    if (selectedRating === undefined || selectedRating === null) return;
    if (selectedRating !== currentRatingRef.current) {
      setCurrentRating(selectedRating);
    }
  }, [selectedRating]);

  const handleDialLayout = () => {
    measureDial();
  };

  /**
   * Pan responder for dragging the handle
   */
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        isDragging.current = true;
        measureDial();

        Animated.spring(handleScale, {
          toValue: 1.12,
          tension: 90,
          friction: 9,
          useNativeDriver: false,
        }).start();

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      },

      onPanResponderMove: (event, gestureState) => {
        if (!hasMeasuredDial.current) {
          measureDial();
          return;
        }

        const touchX = event.nativeEvent.pageX ?? gestureState.moveX;
        const touchY = event.nativeEvent.pageY ?? gestureState.moveY;

        const relativeX = touchX - dialCenter.x;
        const relativeY = touchY - dialCenter.y;

        const angle = calculateAngle(relativeX, relativeY);

        const radians = (angle * Math.PI) / 180;
        const trackX = DIAL_RADIUS + TRACK_RADIUS * Math.cos(radians);
        const trackY = DIAL_RADIUS - TRACK_RADIUS * Math.sin(radians);

        handleX.setValue(trackX - HANDLE_SIZE / 2);
        handleY.setValue(trackY - HANDLE_SIZE / 2);

        const activeRating = currentRatingRef.current;
        const newRating = snapToRating(angle);

        if (newRating !== activeRating) {
          const hapticStyle = getHapticStyle(newRating);

          if (lastHapticRating.current !== newRating) {
            Haptics.impactAsync(hapticStyle);
            lastHapticRating.current = newRating;
          }
          setCurrentRating(newRating);
        }
      },

      onPanResponderRelease: finishDrag,
      onPanResponderTerminate: finishDrag,
    })
  ).current;

  const colorScheme = getAnxietyColor(currentRating);
  const ratingLabel = ANXIETY_SCALE[currentRating];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {type === 'pre' ? 'How anxious are you right now?' : 'How do you feel now?'}
        </Text>
        <Text style={styles.subtitle}>Drag to rate the intensity</Text>
      </View>

      {/* Circular Dial */}
      <View style={styles.dialContainer}>
        <View
          ref={dialRef}
          onLayout={handleDialLayout}
          style={[styles.dialBackground, { borderColor: colorScheme.border }]}
        >
          {/* Center Label */}
          <View style={styles.centerLabel}>
            <Text style={[styles.ratingNumber, { color: colorScheme.primary }]}>{currentRating}</Text>
            <Text style={styles.ratingLabel}>{ratingLabel}</Text>
          </View>

          {/* Track */}
          <View style={[styles.track, { borderColor: colorScheme.border }]} />

          {/* Position Markers */}
          {RATING_VALUES.map((rating) => {
            const position = getPositionForRating(rating);
            const isActive = rating === currentRating;
            const markerColors = getAnxietyColor(rating);

            return (
              <TouchableOpacity
                key={rating}
                style={[
                  styles.markerTouchable,
                  {
                    left: position.x - MARKER_TOUCHABLE_SIZE / 2,
                    top: position.y - MARKER_TOUCHABLE_SIZE / 2,
                  },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setCurrentRating(rating);
                  updateHandlePosition(rating);
                  onRatingSelect(rating);
                }}
                accessibilityLabel={`Rating ${rating}: ${ANXIETY_SCALE[rating]}`}
                accessibilityRole="button"
              >
                <View
                  style={[
                    styles.marker,
                    {
                      backgroundColor: isActive ? markerColors.primary : colors.background.tertiary,
                      borderWidth: isActive ? 0 : 3,
                      borderColor: isActive ? 'transparent' : markerColors.border,
                      width: isActive ? MARKER_ACTIVE_SIZE : MARKER_INACTIVE_SIZE,
                      height: isActive ? MARKER_ACTIVE_SIZE : MARKER_INACTIVE_SIZE,
                      borderRadius: isActive ? MARKER_ACTIVE_SIZE / 2 : MARKER_INACTIVE_SIZE / 2,
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
                backgroundColor: colorScheme.primary,
                shadowColor: colorScheme.shadow,
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
// STYLES - ALL VALUES FROM DESIGN TOKENS
// ============================================================================

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['3xl'] + spacing.sm,
  },
  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.size.xl * typography.lineHeight.tight,
    letterSpacing: -0.2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.size.sm * typography.lineHeight.normal,
    color: colors.text.secondary,
    textAlign: 'center',
    opacity: OPACITY.muted + 0.25,
  },
  dialContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2xl'] + spacing.sm,
  },
  dialBackground: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    borderRadius: DIAL_SIZE / 2,
    backgroundColor: colors.background.tertiary,
    opacity: 0.65,
    borderWidth: 2,
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
    borderStyle: 'dashed',
    zIndex: 1,
  },
  centerLabel: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  ratingNumber: {
    fontSize: typography.size['4xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.size['4xl'] * typography.lineHeight.tight,
    marginBottom: spacing.xs,
  },
  ratingLabel: {
    fontSize: typography.size.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  markerTouchable: {
    position: 'absolute',
    width: MARKER_TOUCHABLE_SIZE,
    height: MARKER_TOUCHABLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  marker: {
    shadowColor: colors.emerald[600],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 3,
  },
  handle: {
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    borderRadius: HANDLE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 5,
    borderColor: `rgba(255, 255, 255, ${OPACITY.muted})`,
    zIndex: 20,
  },
  handleInner: {
    width: spacing.xl + spacing.xs,
    height: spacing.xl + spacing.xs,
    borderRadius: (spacing.xl + spacing.xs) / 2,
    backgroundColor: colors.white,
    opacity: 0.95,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  helperTextContainer: {
    width: DIAL_SIZE,
    marginTop: spacing.xs,
    alignItems: 'center',
  },
  helperText: {
    fontSize: typography.size.sm - 1,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
    color: colors.text.secondary,
    opacity: OPACITY.muted + 0.2,
  },
});
