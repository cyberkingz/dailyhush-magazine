/**
 * DailyHush - Premium Pulse Button Component
 * Enhanced animated button with gradient, glow, and organic pulsing aura
 */

import { useState, useEffect, useRef } from 'react';
import { Pressable, Animated, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/text';
import { colors } from '@/constants/colors';

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

  // Pulse animations (only if enabled)
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0)).current;

  // Press animation
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (enablePulse) {
      // Continuous gentle pulse
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseScale, {
              toValue: 1.15,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(pulseOpacity, {
              toValue: 0.4,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pulseScale, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(pulseOpacity, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
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
      {/* Outer glow (always visible for depth) */}
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: 24,
          backgroundColor: colorScheme.glow,
          opacity: 0.4,
          transform: [{ scale: 1.02 }],
        }}
      />

      {/* Pulse aura (only if enabled) */}
      {enablePulse && (
        <Animated.View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: 24,
            backgroundColor: colorScheme.pulse,
            opacity: pulseOpacity,
            transform: [{ scale: pulseScale }],
          }}
        />
      )}

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
            {icon && <View style={{ marginRight: 12 }}>{icon}</View>}

            <View style={{ alignItems: 'center', flex: icon ? 1 : 0 }}>
              <Text
                style={{
                  color: colorScheme.text,
                  fontSize: subtitle ? 22 : 20,
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
                    fontSize: 15,
                    opacity: 0.9,
                    marginTop: 6,
                    textAlign: 'center',
                    lineHeight: 21,
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
