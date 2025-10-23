/**
 * DailyHush - Pulse Button Component
 * Animated button with organic pulsing aura for important CTAs
 */

import { useState, useEffect, useRef } from 'react';
import { Pressable, Animated, View, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from '@/components/ui/text';

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

  const colors = {
    primary: {
      bg: '#40916C',
      pulse: '#52B788',
      text: '#FFFFFF',
    },
    secondary: {
      bg: '#1A4D3C',
      pulse: '#2D6A4F',
      text: '#E8F4F0',
    },
    danger: {
      bg: '#DC2626',
      pulse: '#EF4444',
      text: '#FFFFFF',
    },
  };

  const colorScheme = colors[variant];

  return (
    <View style={[{ position: 'relative', alignItems: 'center' }, style]}>
      {/* Pulse aura (only if enabled) */}
      {enablePulse && (
        <Animated.View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: 16,
            backgroundColor: colorScheme.pulse,
            opacity: pulseOpacity,
            transform: [{ scale: pulseScale }],
          }}
        />
      )}

      {/* Button */}
      <Animated.View style={{ transform: [{ scale: pressScale }], width: '100%' }}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          style={{
            backgroundColor: colorScheme.bg,
            paddingVertical: subtitle ? 20 : 16,
            paddingHorizontal: 24,
            borderRadius: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: colorScheme.pulse,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          {icon && <View style={{ marginRight: 12 }}>{icon}</View>}

          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text
              style={{
                color: colorScheme.text,
                fontSize: subtitle ? 20 : 18,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                style={{
                  color: colorScheme.text,
                  fontSize: 14,
                  opacity: 0.8,
                  marginTop: 4,
                  textAlign: 'center',
                }}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}
