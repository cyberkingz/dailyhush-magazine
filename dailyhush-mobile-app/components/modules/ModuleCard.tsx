/**
 * ModuleCard Component
 * Reusable card for module selection with haptic feedback and animations
 * Follows atomic design principles and accessibility standards
 */

import React, { memo, useCallback } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  AccessibilityRole,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LucideIcon } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Text } from '@/components/ui/text';
import {
  SPACING,
  COLORS,
  RADIUS,
  SHADOWS,
  TYPOGRAPHY,
  MODULE,
  ANIMATIONS,
  TOUCH_TARGET,
  ICON_SIZE,
} from '@/constants/design-tokens';

// ============================================================================
// TYPES
// ============================================================================

export interface ModuleCardProps {
  /** Unique identifier for the module */
  id: string;

  /** Display title of the module */
  title: string;

  /** Short description of the module */
  description: string;

  /** Icon component from lucide-react-native */
  icon: LucideIcon;

  /** Module number (e.g., 1, 2, 3) */
  moduleNumber: number;

  /** Whether this module is locked (premium) */
  isLocked?: boolean;

  /** Whether this module is completed */
  isCompleted?: boolean;

  /** Whether this module is currently active */
  isActive?: boolean;

  /** Progress percentage (0-100) */
  progress?: number;

  /** Callback when card is pressed */
  onPress: (moduleId: string) => void;

  /** Custom style overrides */
  style?: ViewStyle;

  /** Accessibility label override */
  accessibilityLabel?: string;

  /** Accessibility hint override */
  accessibilityHint?: string;

  /** Test ID for testing */
  testID?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const ModuleCard = memo<ModuleCardProps>(
  ({
    id,
    title,
    description,
    icon: Icon,
    moduleNumber,
    isLocked = false,
    isCompleted = false,
    isActive = false,
    progress = 0,
    onPress,
    style,
    accessibilityLabel,
    accessibilityHint,
    testID,
  }) => {
    // Animation values
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);
    const borderOpacity = useSharedValue(isActive ? 1 : 0.3);

    // ========================================================================
    // HANDLERS
    // ========================================================================

    const handlePressIn = useCallback(() => {
      // Haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Scale down animation
      scale.value = withSpring(0.96, ANIMATIONS.spring.snappy);
      opacity.value = withTiming(0.8, {
        duration: ANIMATIONS.duration.fast,
      });
    }, [scale, opacity]);

    const handlePressOut = useCallback(() => {
      // Scale back to normal
      scale.value = withSpring(1, ANIMATIONS.spring.gentle);
      opacity.value = withTiming(1, {
        duration: ANIMATIONS.duration.fast,
      });
    }, [scale, opacity]);

    const handlePress = useCallback(() => {
      // Medium haptic for confirmed action
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress(id);
    }, [id, onPress]);

    // ========================================================================
    // ANIMATED STYLES
    // ========================================================================

    const animatedCardStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }));

    const animatedBorderStyle = useAnimatedStyle(() => ({
      opacity: borderOpacity.value,
    }));

    // ========================================================================
    // ACCESSIBILITY
    // ========================================================================

    const defaultAccessibilityLabel = `Module ${moduleNumber}: ${title}${
      isLocked ? '. Premium module, locked' : ''
    }${isCompleted ? '. Completed' : ''}${
      isActive ? '. Currently active' : ''
    }`;

    const defaultAccessibilityHint = isLocked
      ? 'Upgrade to premium to unlock this module'
      : isCompleted
        ? 'Review completed module'
        : 'Tap to start this module';

    const accessibilityState = {
      disabled: isLocked,
      selected: isActive,
    };

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
      <Animated.View style={[styles.container, animatedCardStyle, style]}>
        <Pressable
          onPress={isLocked ? undefined : handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isLocked}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel || defaultAccessibilityLabel}
          accessibilityHint={accessibilityHint || defaultAccessibilityHint}
          accessibilityState={accessibilityState}
          testID={testID || `module-card-${id}`}
          hitSlop={TOUCH_TARGET.hitSlopSmall}
          style={styles.pressable}
        >
          {/* Background gradient */}
          <LinearGradient
            colors={
              isActive
                ? [COLORS.primary[700], COLORS.primary[800]]
                : [COLORS.background.secondary, COLORS.background.tertiary]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            {/* Animated border overlay */}
            <Animated.View
              style={[
                styles.borderOverlay,
                animatedBorderStyle,
                {
                  borderColor: isActive
                    ? COLORS.primary[500]
                    : COLORS.border.default,
                },
              ]}
            />

            {/* Content container */}
            <View style={styles.content}>
              {/* Header row */}
              <View style={styles.header}>
                {/* Module number badge */}
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>{moduleNumber}</Text>
                </View>

                {/* Status badges */}
                <View style={styles.badges}>
                  {isLocked && (
                    <View style={styles.premiumBadge}>
                      <Text style={styles.premiumText}>PREMIUM</Text>
                    </View>
                  )}
                  {isCompleted && !isLocked && (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedText}>✓</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Icon */}
              <View style={styles.iconContainer}>
                <Icon
                  size={ICON_SIZE.xl}
                  color={
                    isLocked
                      ? COLORS.text.disabled
                      : isActive
                        ? COLORS.primary[300]
                        : COLORS.text.secondary
                  }
                  strokeWidth={2}
                />
              </View>

              {/* Text content */}
              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.title,
                    isLocked && styles.titleDisabled,
                    isActive && styles.titleActive,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {title}
                </Text>
                <Text
                  style={[
                    styles.description,
                    isLocked && styles.descriptionDisabled,
                  ]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {description}
                </Text>
              </View>

              {/* Progress bar */}
              {progress > 0 && !isCompleted && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${Math.min(progress, 100)}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  },
);

ModuleCard.displayName = 'ModuleCard';

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  pressable: {
    width: '100%',
  },

  gradient: {
    height: MODULE.card.height,
    borderRadius: MODULE.card.borderRadius,
    overflow: 'hidden',
    position: 'relative',
  },

  borderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: MODULE.card.borderRadius,
    borderWidth: MODULE.card.borderWidth,
    pointerEvents: 'none',
  },

  content: {
    flex: 1,
    padding: MODULE.card.padding,
    justifyContent: 'space-between',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },

  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },

  numberText: {
    ...TYPOGRAPHY.buttonSmall,
    color: COLORS.text.inverted,
  },

  badges: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },

  premiumBadge: {
    paddingHorizontal: MODULE.premiumBadge.paddingHorizontal,
    paddingVertical: MODULE.premiumBadge.paddingVertical,
    borderRadius: MODULE.premiumBadge.borderRadius,
    backgroundColor: COLORS.semantic.warning,
  },

  premiumText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.inverted,
    fontWeight: '700',
  },

  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.semantic.success,
    justifyContent: 'center',
    alignItems: 'center',
  },

  completedText: {
    fontSize: 12,
    color: COLORS.text.inverted,
    fontWeight: '700',
  },

  iconContainer: {
    marginBottom: SPACING.sm,
  },

  textContainer: {
    flex: 1,
    gap: SPACING.xs,
  },

  title: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text.primary,
  },

  titleDisabled: {
    color: COLORS.text.disabled,
  },

  titleActive: {
    color: COLORS.primary[200],
  },

  description: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
  },

  descriptionDisabled: {
    color: COLORS.text.disabled,
  },

  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },

  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.background.tertiary,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary[500],
    borderRadius: RADIUS.full,
  },

  progressText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    minWidth: 36,
    textAlign: 'right',
  },
});

export default ModuleCard;
