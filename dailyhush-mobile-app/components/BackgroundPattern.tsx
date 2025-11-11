/**
 * Nœma - Subtle Background Pattern Component
 * Optional decorative background texture for premium feel
 */

import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';
import { colors } from '@/constants/colors';

interface BackgroundPatternProps {
  variant?: 'dots' | 'grid' | 'leaves';
}

export function BackgroundPattern({ variant = 'dots' }: BackgroundPatternProps) {
  if (variant === 'dots') {
    return (
      <View style={styles.container} pointerEvents="none">
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <Pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <Circle cx="2" cy="2" r="1" fill={colors.emerald[600]} opacity={0.05} />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#dots)" />
        </Svg>
      </View>
    );
  }

  if (variant === 'grid') {
    return (
      <View style={styles.container} pointerEvents="none">
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <Pattern id="grid" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <Rect x="0" y="0" width="50" height="1" fill={colors.emerald[600]} opacity={0.03} />
              <Rect x="0" y="0" width="1" height="50" fill={colors.emerald[600]} opacity={0.03} />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grid)" />
        </Svg>
      </View>
    );
  }

  // Default: no pattern (or leaves pattern if you want to add more complexity)
  return null;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
});
