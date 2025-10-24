/**
 * DailyHush - Tropical Leaf SVG Component
 * Simple decorative leaf for tropical theme
 */

import Svg, { Path, G } from 'react-native-svg';
import { colors } from '@/constants/colors';

interface TropicalLeafProps {
  size?: number;
  color?: string;
  style?: any;
}

export function TropicalLeaf({ size = 48, color = colors.emerald[600], style }: TropicalLeafProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <G opacity={0.3}>
        <Path
          d="M12 2C12 2 7 7 7 12C7 15.866 9.134 19 12 19C14.866 19 17 15.866 17 12C17 7 12 2 12 2Z"
          fill={color}
          opacity={0.4}
        />
        <Path
          d="M12 2L12 19M7.5 8L16.5 8M8 12L16 12M9 15L15 15"
          stroke={color}
          strokeWidth={0.5}
          strokeLinecap="round"
          opacity={0.6}
        />
      </G>
    </Svg>
  );
}
