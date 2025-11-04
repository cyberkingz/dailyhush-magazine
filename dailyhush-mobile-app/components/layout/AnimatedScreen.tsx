/**
 * AnimatedScreen Component
 * Wrapper component for consistent screen layouts with gradient, safe area, and keyboard handling
 * Provides smooth entrance/exit animations and keyboard avoidance
 */

import React, { memo, useEffect } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  SPACING,
  COLORS,
  ANIMATIONS,
  LAYOUT,
} from '@/constants/design-tokens';

// ============================================================================
// TYPES
// ============================================================================

export interface AnimatedScreenProps {
  /** Screen content */
  children: React.ReactNode;

  /** Enable scrolling (default: true) */
  scrollable?: boolean;

  /** Show gradient background (default: true) */
  showGradient?: boolean;

  /** Custom gradient colors */
  gradientColors?: readonly [string, string];

  /** Gradient start/end points */
  gradientStart?: { x: number; y: number };
  gradientEnd?: { x: number; y: number };

  /** Enable keyboard avoiding behavior (default: true) */
  keyboardAvoiding?: boolean;

  /** Keyboard vertical offset (default: 0) */
  keyboardVerticalOffset?: number;

  /** Content padding (default: LAYOUT.screenPadding) */
  contentPadding?: {
    horizontal?: number;
    vertical?: number;
  };

  /** Center content vertically (default: false) */
  centerContent?: boolean;

  /** Use safe area insets (default: true) */
  useSafeArea?: boolean;

  /** Animation type */
  animationType?: 'fade' | 'slide' | 'none';

  /** Custom entrance animation duration */
  entranceDuration?: number;

  /** Custom exit animation duration */
  exitDuration?: number;

  /** Background color (if not using gradient) */
  backgroundColor?: string;

  /** Custom content container style */
  contentContainerStyle?: ViewStyle;

  /** Custom style for root container */
  style?: ViewStyle;

  /** Callback when screen enters */
  onEnter?: () => void;

  /** Callback when screen exits */
  onExit?: () => void;

  /** Test ID for testing */
  testID?: string;

  /** Accessibility label */
  accessibilityLabel?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const AnimatedScreen = memo<AnimatedScreenProps>(
  ({
    children,
    scrollable = true,
    showGradient = true,
    gradientColors,
    gradientStart = { x: 0, y: 0 },
    gradientEnd = { x: 0, y: 1 },
    keyboardAvoiding = true,
    keyboardVerticalOffset = 0,
    contentPadding,
    centerContent = false,
    useSafeArea = true,
    animationType = 'fade',
    entranceDuration = ANIMATIONS.duration.normal,
    exitDuration = ANIMATIONS.duration.normal,
    backgroundColor = COLORS.background.primary,
    contentContainerStyle,
    style,
    onEnter,
    onExit,
    testID,
    accessibilityLabel,
  }) => {
    const insets = useSafeAreaInsets();
    const opacity = useSharedValue(0);

    // Default gradient colors
    const defaultGradientColors: readonly [string, string] = [
      COLORS.background.primary,
      COLORS.background.secondary,
    ];

    // ========================================================================
    // EFFECTS
    // ========================================================================

    useEffect(() => {
      // Entrance animation
      opacity.value = withTiming(1, {
        duration: entranceDuration,
      });
      onEnter?.();

      // Cleanup - exit animation
      return () => {
        opacity.value = withTiming(0, {
          duration: exitDuration,
        });
        onExit?.();
      };
    }, [opacity, entranceDuration, exitDuration, onEnter, onExit]);

    // ========================================================================
    // ANIMATED STYLES
    // ========================================================================

    const animatedContainerStyle = useAnimatedStyle(() => ({
      opacity: animationType === 'none' ? 1 : opacity.value,
    }));

    // ========================================================================
    // ANIMATION CONFIGURATIONS
    // ========================================================================

    const getEnteringAnimation = () => {
      switch (animationType) {
        case 'slide':
          return SlideInRight.duration(entranceDuration);
        case 'fade':
          return FadeIn.duration(entranceDuration);
        case 'none':
        default:
          return undefined;
      }
    };

    const getExitingAnimation = () => {
      switch (animationType) {
        case 'slide':
          return SlideOutLeft.duration(exitDuration);
        case 'fade':
          return FadeOut.duration(exitDuration);
        case 'none':
        default:
          return undefined;
      }
    };

    // ========================================================================
    // RENDER HELPERS
    // ========================================================================

    const renderBackground = () => {
      if (!showGradient) {
        return (
          <View
            style={[styles.background, { backgroundColor }]}
          />
        );
      }

      return (
        <LinearGradient
          colors={gradientColors || defaultGradientColors}
          start={gradientStart}
          end={gradientEnd}
          style={styles.gradient}
        />
      );
    };

    const renderContent = () => {
      const paddingHorizontal =
        contentPadding?.horizontal ?? LAYOUT.screenPadding.horizontal;
      const paddingVertical =
        contentPadding?.vertical ?? LAYOUT.screenPadding.vertical;

      const contentStyle: ViewStyle = {
        paddingHorizontal,
        paddingTop: useSafeArea
          ? Math.max(insets.top, paddingVertical)
          : paddingVertical,
        paddingBottom: useSafeArea
          ? Math.max(insets.bottom, paddingVertical)
          : paddingVertical,
      };

      if (scrollable) {
        return (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              contentStyle,
              centerContent && styles.centerContent,
              contentContainerStyle,
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={true}
            testID={`${testID}-scroll-view`}
          >
            {children}
          </ScrollView>
        );
      }

      return (
        <View
          style={[
            styles.contentContainer,
            contentStyle,
            centerContent && styles.centerContent,
            contentContainerStyle,
          ]}
        >
          {children}
        </View>
      );
    };

    const renderWithKeyboardAvoidance = (content: React.ReactNode) => {
      if (!keyboardAvoiding) {
        return content;
      }

      return (
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={keyboardVerticalOffset}
          enabled={keyboardAvoiding}
        >
          {content}
        </KeyboardAvoidingView>
      );
    };

    // ========================================================================
    // RENDER
    // ========================================================================

    return (
      <Animated.View
        style={[styles.container, animatedContainerStyle, style]}
        entering={getEnteringAnimation()}
        exiting={getExitingAnimation()}
        testID={testID || 'animated-screen'}
        accessibilityLabel={accessibilityLabel}
      >
        {/* Status bar */}
        <StatusBar style="light" />

        {/* Background */}
        {renderBackground()}

        {/* Content with keyboard avoidance */}
        {renderWithKeyboardAvoidance(renderContent())}
      </Animated.View>
    );
  },
);

AnimatedScreen.displayName = 'AnimatedScreen';

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    ...StyleSheet.absoluteFillObject,
  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
  },

  keyboardAvoidingView: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  contentContainer: {
    flex: 1,
  },

  centerContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AnimatedScreen;
