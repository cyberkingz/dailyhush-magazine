/**
 * DailyHush - Countdown Ring Component
 * Elegant, minimal progress ring with gradient stroke
 */

import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

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

  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      {/* Main ring with gradient */}
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity="1" />
            <Stop offset="50%" stopColor={glowColor} stopOpacity="0.9" />
            <Stop offset="100%" stopColor={color} stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Progress ring with gradient */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ringGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
          opacity={0.95}
        />
      </Svg>
    </View>
  );
}
