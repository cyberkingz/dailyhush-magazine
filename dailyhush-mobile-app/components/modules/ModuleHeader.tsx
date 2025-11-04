/**
 * ModuleHeader Component
 * Consistent header with back button, title, and optional progress indicators
 * Supports both progress dots and percentage display
 */

import React, { memo, useCallback } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ArrowLeft } from 'lucide-react-native';

import { Text } from '@/components/ui/text';
import {
  SPACING,
  COLORS,
  RADIUS,
  TYPOGRAPHY,
  MODULE,
  ANIMATIONS,
  TOUCH_TARGET,
  ICON_SIZE,
} from '@/constants/design-tokens';

// ============================================================================
// TYPES
// ============================================================================

export interface ModuleHeaderProps {
  /** Header title */
  title?: string;

  /** Subtitle (optional) */
  subtitle?: string;

  /** Current step/screen (for progress dots) */
  currentStep?: number;

  /** Total number of steps (for progress dots) */
  totalSteps?: number;

  /** Progress percentage (0-100) - alternative to dots */
  progressPercentage?: number;

  /** Show back button */
  showBackButton?: boolean;

  /** Back button press handler */
  onBackPress?: () => void;

  /** Custom right action component */
  rightAction?: React.ReactNode;

  /** Custom style overrides */
  style?: ViewStyle;

  /** Background color override */
  backgroundColor?: string;

  /** Test ID for testing */
  testID?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const ModuleHeader = memo<ModuleHeaderProps>(
  ({
    title,
    subtitle,
    currentStep,
    totalSteps,
    progressPercentage,
    showBackButton = true,
    onBackPress,
    rightAction,
    style,
    backgroundColor = 'transparent',
    testID,
  }) => {
    const insets = useSafeAreaInsets();
    const scale = useSharedValue(1);

    // ========================================================================
    // HANDLERS
    // ========================================================================

    const handleBackPressIn = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      scale.value = withSpring(0.9, ANIMATIONS.spring.snappy);
    }, [scale]);

    const handleBackPressOut = useCallback(() => {
      scale.value = withSpring(1, ANIMATIONS.spring.gentle);
    }, [scale]);

    const handleBackPress = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onBackPress?.();
    }, [onBackPress]);

    // ========================================================================
    // ANIMATED STYLES
    // ========================================================================

    const animatedBackButtonStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    // ========================================================================
    // RENDER HELPERS
    // ========================================================================

    const renderBackButton = () => {
      if (!showBackButton) return null;

      return (
        <Animated.View style={animatedBackButtonStyle}>
          <Pressable
            onPress={handleBackPress}
            onPressIn={handleBackPressIn}
            onPressOut={handleBackPressOut}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            accessibilityHint="Navigate to previous screen"
            hitSlop={TOUCH_TARGET.hitSlop}
            style={styles.backButton}
            testID={`${testID}-back-button`}
          >
            <View style={styles.backButtonInner}>
              <ArrowLeft
                size={ICON_SIZE.md}
                color={COLORS.text.primary}
                strokeWidth={2.5}
              />
            </View>
          </Pressable>
        </Animated.View>
      );
    };

    const renderProgressDots = () => {
      if (!currentStep || !totalSteps) return null;

      return (
        <View
          style={styles.progressDots}
          accessibilityLabel={`Step ${currentStep} of ${totalSteps}`}
          accessibilityRole="progressbar"
        >
          {Array.from({ length: totalSteps }).map((_, index) => {
            const isActive = index + 1 === currentStep;
            const isCompleted = index + 1 < currentStep;

            return (
              <View
                key={`dot-${index}`}
                style={[
                  styles.dot,
                  isActive && styles.dotActive,
                  isCompleted && styles.dotCompleted,
                ]}
              />
            );
          })}
        </View>
      );
    };

    const renderProgressBar = () => {
      if (progressPercentage === undefined) return null;

      const percentage = Math.min(Math.max(progressPercentage, 0), 100);

      return (
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${percentage}%` },
              ]}
            />
          </View>
          <Text style={styles.progressPercentageText}>
            {Math.round(percentage)}%
          </Text>
        </View>
      );
    };

    const renderTitle = () => {
      if (!title) return null;

      return (
        <View style={styles.titleContainer}>
          <Text
            style={styles.title}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={styles.subtitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {subtitle}
            </Text>
          )}
        </View>
      );
    };

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, SPACING.md),
            backgroundColor,
          },
          style,
        ]}
        testID={testID || 'module-header'}
      >
        {/* Main header row */}
        <View style={styles.mainRow}>
          {/* Left: Back button */}
          <View style={styles.leftSection}>
            {renderBackButton()}
          </View>

          {/* Center: Title */}
          <View style={styles.centerSection}>
            {renderTitle()}
          </View>

          {/* Right: Custom action or spacer */}
          <View style={styles.rightSection}>
            {rightAction || <View style={styles.spacer} />}
          </View>
        </View>

        {/* Progress indicators */}
        <View style={styles.progressSection}>
          {renderProgressDots()}
          {renderProgressBar()}
        </View>
      </View>
    );
  },
);

ModuleHeader.displayName = 'ModuleHeader';

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: MODULE.header.paddingHorizontal,
    paddingBottom: SPACING.md,
    gap: SPACING.md,
  },

  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: MODULE.header.height,
    gap: SPACING.md,
  },

  leftSection: {
    minWidth: MODULE.header.backButtonSize,
    justifyContent: 'center',
  },

  centerSection: {
    flex: 1,
    alignItems: 'center',
  },

  rightSection: {
    minWidth: MODULE.header.backButtonSize,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  spacer: {
    width: MODULE.header.backButtonSize,
  },

  backButton: {
    width: MODULE.header.backButtonSize,
    height: MODULE.header.backButtonSize,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backButtonInner: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background.tertiary,
    borderWidth: 1,
    borderColor: COLORS.border.default,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleContainer: {
    alignItems: 'center',
    gap: SPACING.xs,
    maxWidth: '100%',
  },

  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    textAlign: 'center',
  },

  subtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },

  progressSection: {
    alignItems: 'center',
    gap: SPACING.sm,
  },

  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: MODULE.progressDot.spacing,
  },

  dot: {
    width: MODULE.progressDot.size,
    height: MODULE.progressDot.size,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.background.tertiary,
    borderWidth: 1,
    borderColor: COLORS.border.default,
  },

  dotActive: {
    width: MODULE.progressDot.activeSize,
    height: MODULE.progressDot.activeSize,
    backgroundColor: COLORS.primary[500],
    borderColor: COLORS.primary[500],
  },

  dotCompleted: {
    backgroundColor: COLORS.primary[700],
    borderColor: COLORS.primary[700],
  },

  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    width: '100%',
  },

  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.background.tertiary,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary[500],
    borderRadius: RADIUS.full,
  },

  progressPercentageText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    minWidth: 36,
    textAlign: 'right',
    fontWeight: '600',
  },
});

export default ModuleHeader;
