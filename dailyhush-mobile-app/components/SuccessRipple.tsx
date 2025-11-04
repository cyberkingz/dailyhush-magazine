/**
 * DailyHush - Success Animation
 * Celebratory sparkle animation for completion states
 */

import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { colors } from '@/constants/colors';

interface SuccessRippleProps {
  size?: number;
  onAnimationComplete?: () => void;
}

export function SuccessRipple({ size = 80, onAnimationComplete }: SuccessRippleProps) {
  const scale = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const sparkle1 = useRef(new Animated.Value(0)).current;
  const sparkle2 = useRef(new Animated.Value(0)).current;
  const sparkle3 = useRef(new Animated.Value(0)).current;
  const sparkle4 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      // Main star scale in
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      // Continuous rotation
      Animated.loop(
        Animated.timing(rotate, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ),
      // Sparkle animations (staggered)
      Animated.sequence([
        Animated.delay(200),
        Animated.spring(sparkle1, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(300),
        Animated.spring(sparkle2, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(400),
        Animated.spring(sparkle3, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(500),
        Animated.spring(sparkle4, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onAnimationComplete?.();
    });
  }, []);

  const rotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const Sparkle = ({ animValue, angle }: { animValue: Animated.Value; angle: number }) => {
    const distance = size * 1.2;
    const x = Math.cos((angle * Math.PI) / 180) * distance;
    const y = Math.sin((angle * Math.PI) / 180) * distance;

    return (
      <Animated.View
        style={{
          position: 'absolute',
          width: size * 0.3,
          height: size * 0.3,
          transform: [{ translateX: x }, { translateY: y }, { scale: animValue }],
        }}>
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: colors.lime[500],
            borderRadius: (size * 0.3) / 2,
            shadowColor: colors.lime[500],
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 8,
            elevation: 5,
          }}
        />
      </Animated.View>
    );
  };

  return (
    <View
      style={{
        width: size * 3,
        height: size * 3,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {/* Sparkles around the center */}
      <Sparkle animValue={sparkle1} angle={45} />
      <Sparkle animValue={sparkle2} angle={135} />
      <Sparkle animValue={sparkle3} angle={225} />
      <Sparkle animValue={sparkle4} angle={315} />

      {/* Center star/burst */}
      <Animated.View
        style={{
          width: size,
          height: size,
          justifyContent: 'center',
          alignItems: 'center',
          transform: [{ scale }, { rotate: rotation }],
        }}>
        {/* Star shape using overlapping diamonds */}
        <View
          style={{
            width: size,
            height: size,
            backgroundColor: colors.lime[500],
            transform: [{ rotate: '0deg' }],
            shadowColor: colors.lime[500],
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 15,
            elevation: 8,
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: size,
            height: size,
            backgroundColor: colors.lime[400],
            transform: [{ rotate: '45deg' }],
          }}
        />
      </Animated.View>
    </View>
  );
}
