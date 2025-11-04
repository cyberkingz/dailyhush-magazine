/**
 * CTAButton Component
 * Large, prominent call-to-action button with premium micro-interactions
 * Optimized for 55-70 demographic - clear, responsive, accessible
 */

import { useState, useEffect, useRef } from 'react';
import { Pressable, View, Text, Animated, AccessibilityInfo, Easing } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { LucideIcon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '@/constants/colors';

interface CTAButtonProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  onPress: () => void;
  iconSize?: number;
  backgroundColor?: string;
  pressedColor?: string;
}

export function CTAButton({
  title,
  subtitle,
  icon: Icon,
  onPress,
  iconSize = 32,
  backgroundColor = colors.crisis.lime, // NEON LIME - Crisis monopoly branding
  pressedColor = colors.crisis.limeDark, // Darker lime on press
}: CTAButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Breathing glow animation for emphasis
  const glowOpacity = useRef(new Animated.Value(0)).current;

  // Press animation
  const pressScale = useRef(new Animated.Value(1)).current;

  // Check reduced motion preference
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  // Continuous breathing glow effect (like a heartbeat)
  useEffect(() => {
    if (!reduceMotion) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(glowOpacity, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ])
      ).start();
    }
  }, [reduceMotion, glowOpacity]);

  const handlePressIn = () => {
    setIsPressed(true);
    if (!reduceMotion) {
      Animated.spring(pressScale, {
        toValue: 0.96,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!reduceMotion) {
      Animated.spring(pressScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }

    // Keep pressed state for ripple animation
    setTimeout(() => setIsPressed(false), 600);
  };

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Delay navigation to let animations complete
    // This allows users to see the ripple and icon pulse
    if (!reduceMotion) {
      setTimeout(() => {
        onPress();
      }, 400); // Wait for most of the animation to be visible
    } else {
      onPress(); // No delay if reduced motion
    }
  };

  return (
    <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
      <Animated.View
        style={{
          transform: [{ scale: reduceMotion ? 1 : pressScale }],
        }}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel={`${title} - ${subtitle}`}
          accessibilityHint="Emergency action to start spiral interrupt protocol"
          style={{
            borderRadius: 24,
            overflow: 'hidden',
            shadowColor: colors.crisis.lime, // Neon lime glow
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.6, // Stronger glow for crisis button
            shadowRadius: 20,
            elevation: 12,
          }}>
          <LinearGradient
            colors={[backgroundColor, pressedColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              padding: 24,
              alignItems: 'center',
              position: 'relative',
            }}>
            {/* Breathing glow overlay */}
            {!reduceMotion && (
              <Animated.View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  opacity: glowOpacity,
                }}
              />
            )}

            {/* Ripple effect on press */}
            {!reduceMotion && (
              <AnimatePresence>
                {isPressed && (
                  <>
                    <MotiView
                      key="ripple-1"
                      from={{ scale: 0.8, opacity: 0.6 }}
                      animate={{ scale: 2.5, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 600,
                        type: 'timing',
                      }}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: 200,
                        height: 200,
                        marginLeft: -100,
                        marginTop: -100,
                        borderRadius: 100,
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        pointerEvents: 'none',
                      }}
                    />
                    <MotiView
                      key="ripple-2"
                      from={{ scale: 0.8, opacity: 0.4 }}
                      animate={{ scale: 3, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 800,
                        type: 'timing',
                        delay: 100,
                      }}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: 200,
                        height: 200,
                        marginLeft: -100,
                        marginTop: -100,
                        borderRadius: 100,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        pointerEvents: 'none',
                      }}
                    />
                  </>
                )}
              </AnimatePresence>
            )}

            {/* Icon container with pulse animation */}
            <MotiView
              animate={{
                scale: reduceMotion ? 1 : isPressed ? [1, 1.15, 1] : 1,
                rotate: reduceMotion
                  ? '0deg'
                  : isPressed
                    ? ['0deg', '5deg', '-5deg', '0deg']
                    : '0deg',
              }}
              transition={{
                duration: reduceMotion ? 0 : 500,
                type: 'timing',
              }}
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: 'rgba(10, 22, 18, 0.3)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}>
              <Icon size={iconSize} color={colors.background.primary} strokeWidth={2.5} />
            </MotiView>

            {/* Title text */}
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: colors.background.primary,
                marginBottom: 8,
                letterSpacing: 1,
              }}>
              {title}
            </Text>

            {/* Subtitle text */}
            <Text
              style={{
                fontSize: 15,
                color: colors.background.primary,
                opacity: 0.9,
              }}>
              {subtitle}
            </Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}
