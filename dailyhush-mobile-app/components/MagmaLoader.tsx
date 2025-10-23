/**
 * DailyHush - Magma Loader Component
 * Organic morphing loading animation with emerald theme
 */

import { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/text';

interface MagmaLoaderProps {
  text?: string;
  size?: number;
}

export function MagmaLoader({ text = 'Loading', size = 80 }: MagmaLoaderProps) {
  // Multiple morphing layers
  const blob1Scale = useRef(new Animated.Value(1)).current;
  const blob1Rotate = useRef(new Animated.Value(0)).current;
  const blob2Scale = useRef(new Animated.Value(1)).current;
  const blob2Rotate = useRef(new Animated.Value(0)).current;
  const blob3Scale = useRef(new Animated.Value(1)).current;
  const blob3Rotate = useRef(new Animated.Value(0)).current;

  // Letter animations
  const letterAnims = useRef(
    Array.from({ length: text.length }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Blob 1 - Slow rotation with scale
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(blob1Scale, {
            toValue: 1.3,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(blob1Scale, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(blob1Rotate, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Blob 2 - Fast rotation, offset
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(blob2Scale, {
            toValue: 1.2,
            duration: 1600,
            useNativeDriver: true,
          }),
          Animated.timing(blob2Scale, {
            toValue: 0.9,
            duration: 1600,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(blob2Rotate, {
          toValue: 1,
          duration: 3200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Blob 3 - Medium rotation
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(blob3Scale, {
            toValue: 1.1,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(blob3Scale, {
            toValue: 1.2,
            duration: 1800,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(blob3Rotate, {
          toValue: 1,
          duration: 3600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Letter wave animation
    const letterAnimations = letterAnims.map((anim, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 100),
          Animated.timing(anim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.delay((text.length - index) * 100),
        ])
      )
    );

    letterAnimations.forEach((anim) => anim.start());

    return () => {
      letterAnimations.forEach((anim) => anim.stop());
    };
  }, []);

  const blob1Spin = blob1Rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const blob2Spin = blob2Rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  const blob3Spin = blob3Rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View className="items-center justify-center">
      {/* Morphing blob loader */}
      <View style={{ width: size * 2, height: size * 2, marginBottom: 24 }}>
        <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }]}>
          {/* Blob Layer 1 */}
          <Animated.View
            style={{
              position: 'absolute',
              width: size * 1.4,
              height: size * 1.2,
              borderRadius: size * 0.7,
              backgroundColor: '#40916C',
              opacity: 0.4,
              transform: [
                { scale: blob1Scale },
                { rotate: blob1Spin },
                { scaleX: 1.2 },
              ],
            }}
          />

          {/* Blob Layer 2 */}
          <Animated.View
            style={{
              position: 'absolute',
              width: size * 1.3,
              height: size * 1.1,
              borderRadius: size * 0.65,
              backgroundColor: '#52B788',
              opacity: 0.5,
              transform: [
                { scale: blob2Scale },
                { rotate: blob2Spin },
                { scaleY: 1.3 },
              ],
            }}
          />

          {/* Blob Layer 3 */}
          <Animated.View
            style={{
              position: 'absolute',
              width: size * 1.2,
              height: size,
              borderRadius: size * 0.6,
              backgroundColor: '#2D6A4F',
              opacity: 0.6,
              transform: [
                { scale: blob3Scale },
                { rotate: blob3Spin },
                { scaleX: 0.9 },
              ],
            }}
          />

          {/* Core circle */}
          <View
            style={{
              width: size * 0.8,
              height: size * 0.8,
              borderRadius: size * 0.4,
              backgroundColor: '#1A4D3C',
            }}
          />
        </View>
      </View>

      {/* Animated text */}
      <View className="flex-row gap-1">
        {text.split('').map((letter, index) => {
          const letterScale = letterAnims[index].interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.15],
          });

          const letterOpacity = letterAnims[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.4, 1],
          });

          return (
            <Animated.View
              key={index}
              style={{
                transform: [{ scale: letterScale }],
                opacity: letterOpacity,
              }}
            >
              <Text className="text-[#E8F4F0] text-lg font-semibold">
                {letter}
              </Text>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}
