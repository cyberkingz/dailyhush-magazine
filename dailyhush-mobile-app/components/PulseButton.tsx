/**
 * DailyHush - Premium Pulse Button Component
 * Enhanced animated button with gradient, glow, and organic pulsing aura
 */

import { useState, useEffect, useRef } from 'react';
import { Pressable, Animated, View, ViewStyle, Dimensions, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface PulseButtonProps {
  onPress: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  enablePulse?: boolean;
  style?: ViewStyle;
}

export function PulseButton({
  onPress,
  title,
  subtitle,
  icon,
  variant = 'primary',
  enablePulse = true,
  style,
}: PulseButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  // Breathing glow animation
  const glowOpacity = useRef(new Animated.Value(0)).current;

  // Press animation
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (enablePulse) {
      // Smooth breathing glow (like a calm heartbeat)
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
            easing: Easing.bezier(0.4, 0.0, 0.6, 1.0), // Smooth ease in-out
          }),
          Animated.timing(glowOpacity, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
            easing: Easing.bezier(0.4, 0.0, 0.6, 1.0),
          }),
        ])
      ).start();
    }
  }, [enablePulse]);

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(pressScale, {
      toValue: 0.95,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(pressScale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const colorSchemes = {
    primary: {
      gradient: colors.button.primaryGradient,
      pulse: colors.emerald[500],
      glow: colors.gradients.glow,
      text: colors.white,
    },
    secondary: {
      gradient: [colors.emerald[800], colors.emerald[700]],
      pulse: colors.emerald[600],
      glow: colors.shadow.light,
      text: colors.text.primary,
    },
    danger: {
      gradient: ['#EF4444', '#DC2626'],
      pulse: '#EF4444',
      glow: 'rgba(239, 68, 68, 0.3)',
      text: colors.white,
    },
  };

  const colorScheme = colorSchemes[variant];

  return (
    <View style={[{ position: 'relative', alignItems: 'center' }, style]}>
      {/* Button with gradient */}
      <Animated.View style={{ transform: [{ scale: pressScale }], width: '100%' }}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          style={{
            overflow: 'hidden',
            borderRadius: 24,
            shadowColor: colorScheme.pulse,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <LinearGradient
            colors={colorScheme.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              paddingVertical: subtitle ? 24 : 20,
              paddingHorizontal: 32,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Breathing glow overlay (only if enabled) */}
            {enablePulse && (
              <Animated.View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  opacity: glowOpacity,
                }}
              />
            )}
            {icon && <View style={{ marginRight: 12 }}>{icon}</View>}

            <View style={{ alignItems: 'center', flex: icon ? 1 : 0 }}>
              <Text
                style={{
                  color: colorScheme.text,
                  fontSize: subtitle ? 24 : 22,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  letterSpacing: 0.5,
                }}
              >
                {title}
              </Text>
              {subtitle && (
                <Text
                  style={{
                    color: colorScheme.text,
                    fontSize: 17,
                    opacity: 0.9,
                    marginTop: 6,
                    textAlign: 'center',
                    lineHeight: 24,
                  }}
                >
                  {subtitle}
                </Text>
              )}
            </View>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}
