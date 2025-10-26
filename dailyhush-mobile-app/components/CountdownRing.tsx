/**
 * DailyHush - Countdown Ring Component
 * Solid green progress ring with enhanced glow effect
 * Optimized for anxiety relief - no visual complexity
 */

import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CountdownRingProps {
  size?: number;
  strokeWidth?: number;
  color?: string;
  glowColor?: string;
  progress?: number; // 0-100
}

export function CountdownRing({
  size = 240,
  strokeWidth = 6,
  color = '#40916C',
  glowColor = '#52B788',
  progress = 0,
}: CountdownRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Intensify glow as progress increases (0.3 to 0.6)
  const glowIntensity = 0.3 + (progress / 100) * 0.3;

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size}>
        {/* Solid green progress ring - no glow */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
          opacity={1}
        />
      </Svg>
    </View>
  );
}
