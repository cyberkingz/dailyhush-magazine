/**
 * MethodCard Component
 * Horizontal card for method/technique selection
 * Optimized for carousel/scrollable layouts
 */

import React, { memo, useCallback } from 'react';
import { View, Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
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

export interface MethodCardProps {
  /** Unique identifier for the method */
  id: string;

  /** Display title of the method */
  title: string;

  /** Short description */
  description: string;

  /** Icon component from lucide-react-native */
  icon: LucideIcon;

  /** Duration in minutes (optional) */
  duration?: number;

  /** Whether this method is selected */
  isSelected?: boolean;

  /** Whether this method is recommended */
  isRecommended?: boolean;

  /** Callback when card is pressed */
  onPress: (methodId: string) => void;

  /** Custom style overrides */
  style?: ViewStyle;

  /** Accessibility label override */
  accessibilityLabel?: string;

  /** Test ID for testing */
  testID?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const MethodCard = memo<MethodCardProps>(
  ({
    id,
    title,
    description,
    icon: Icon,
    duration,
    isSelected = false,
    isRecommended = false,
    onPress,
    style,
    accessibilityLabel,
    testID,
  }) => {
    // Animation values
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    // ========================================================================
    // HANDLERS
    // ========================================================================

    const handlePressIn = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      scale.value = withSpring(0.95, ANIMATIONS.spring.snappy);
      opacity.value = withTiming(0.8, {
        duration: ANIMATIONS.duration.fast,
      });
    }, [scale, opacity]);

    const handlePressOut = useCallback(() => {
      scale.value = withSpring(1, ANIMATIONS.spring.gentle);
      opacity.value = withTiming(1, {
        duration: ANIMATIONS.duration.fast,
      });
    }, [scale, opacity]);

    const handlePress = useCallback(() => {
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

    // ========================================================================
    // ACCESSIBILITY
    // ========================================================================

    const defaultAccessibilityLabel = `${title}${
      isRecommended ? '. Recommended' : ''
    }${isSelected ? '. Selected' : ''}${duration ? `. Duration: ${duration} minutes` : ''}`;

    const accessibilityState = {
      selected: isSelected,
    };

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
      <Animated.View style={[styles.container, animatedCardStyle, style]}>
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel || defaultAccessibilityLabel}
          accessibilityState={accessibilityState}
          testID={testID || `method-card-${id}`}
          hitSlop={TOUCH_TARGET.hitSlopSmall}
          style={styles.pressable}>
          <LinearGradient
            colors={
              isSelected
                ? [COLORS.primary[600], COLORS.primary[700]]
                : [COLORS.background.secondary, COLORS.background.tertiary]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradient, isSelected && styles.gradientSelected]}>
            {/* Border overlay */}
            <View
              style={[
                styles.borderOverlay,
                {
                  borderColor: isSelected ? COLORS.primary[500] : COLORS.border.default,
                  opacity: isSelected ? 1 : 0.3,
                },
              ]}
            />

            {/* Content */}
            <View style={styles.content}>
              {/* Icon and badge row */}
              <View style={styles.header}>
                <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
                  <Icon
                    size={ICON_SIZE.lg}
                    color={isSelected ? COLORS.primary[200] : COLORS.text.secondary}
                    strokeWidth={2}
                  />
                </View>

                {isRecommended && (
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedText}>★</Text>
                  </View>
                )}
              </View>

              {/* Text content */}
              <View style={styles.textContainer}>
                <Text
                  style={[styles.title, isSelected && styles.titleSelected]}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {title}
                </Text>
                <Text
                  style={[styles.description, isSelected && styles.descriptionSelected]}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {description}
                </Text>
              </View>

              {/* Duration footer */}
              {duration && (
                <View style={styles.footer}>
                  <Text style={[styles.duration, isSelected && styles.durationSelected]}>
                    {duration} min
                  </Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  }
);

MethodCard.displayName = 'MethodCard';

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    width: MODULE.methodCard.width,
    marginRight: SPACING.md,
  },

  pressable: {
    width: '100%',
  },

  gradient: {
    height: MODULE.methodCard.height,
    borderRadius: MODULE.methodCard.borderRadius,
    overflow: 'hidden',
    position: 'relative',
  },

  gradientSelected: {
    ...SHADOWS.emerald,
  },

  borderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: MODULE.methodCard.borderRadius,
    borderWidth: MODULE.methodCard.borderWidth,
    pointerEvents: 'none',
  },

  content: {
    flex: 1,
    padding: MODULE.methodCard.padding,
    justifyContent: 'space-between',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconContainerSelected: {
    backgroundColor: COLORS.primary[700],
  },

  recommendedBadge: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.semantic.warning,
    justifyContent: 'center',
    alignItems: 'center',
  },

  recommendedText: {
    fontSize: 14,
    color: COLORS.text.inverted,
  },

  textContainer: {
    flex: 1,
    gap: SPACING.xs,
  },

  title: {
    ...TYPOGRAPHY.h4,
    fontSize: 16,
    color: COLORS.text.primary,
  },

  titleSelected: {
    color: COLORS.primary[100],
  },

  description: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    lineHeight: 14,
  },

  descriptionSelected: {
    color: COLORS.primary[200],
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },

  duration: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.tertiary,
    fontWeight: '600',
  },

  durationSelected: {
    color: COLORS.primary[300],
  },
});

export default MethodCard;
