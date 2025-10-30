/**
 * DailyHush - Success Ripple Animation
 * Expanding ripple effect for completion states
 */

import { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { Check } from 'lucide-react-native';

interface SuccessRippleProps {
  size?: number;
  onAnimationComplete?: () => void;
}

export function SuccessRipple({ size = 80, onAnimationComplete }: SuccessRippleProps) {
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const ripple3 = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered ripple animations
    Animated.parallel([
      // Ripple 1
      Animated.sequence([
        Animated.delay(0),
        Animated.timing(ripple1, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Ripple 2
      Animated.sequence([
        Animated.delay(200),
        Animated.timing(ripple2, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Ripple 3
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(ripple3, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Check mark bounce in
      Animated.sequence([
        Animated.delay(300),
        Animated.spring(checkScale, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
      ]),
      // Check mark rotate
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(checkRotate, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onAnimationComplete?.();
    });
  }, []);

  const createRippleStyle = (animValue: Animated.Value) => {
    return {
      scale: animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.5, 2.5],
      }),
      opacity: animValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.6, 0.3, 0],
      }),
    };
  };

  const rotation = checkRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-180deg', '0deg'],
  });

  return (
    <View
      style={{
        width: size * 3,
        height: size * 3,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {/* Ripple layers */}
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#40916C',
          transform: [{ scale: createRippleStyle(ripple1).scale }],
          opacity: createRippleStyle(ripple1).opacity,
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#52B788',
          transform: [{ scale: createRippleStyle(ripple2).scale }],
          opacity: createRippleStyle(ripple2).opacity,
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#B7E4C7',
          transform: [{ scale: createRippleStyle(ripple3).scale }],
          opacity: createRippleStyle(ripple3).opacity,
        }}
      />

      {/* Check mark circle */}
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#2D6A4F',
          justifyContent: 'center',
          alignItems: 'center',
          transform: [{ scale: checkScale }, { rotate: rotation }],
          shadowColor: '#40916C',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 15,
          elevation: 8,
        }}>
        <Check size={size * 0.5} color="#B7E4C7" strokeWidth={3} />
      </Animated.View>
    </View>
  );
}
