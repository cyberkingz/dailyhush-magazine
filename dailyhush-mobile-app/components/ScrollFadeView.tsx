import React, { useState, useRef } from 'react';
import {
  ScrollView,
  ScrollViewProps,
  View,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useScrollControl } from '@/components/mood-widget/ScrollControlContext';

export interface ScrollFadeViewProps extends ScrollViewProps {
  /**
   * Background color for the fade gradient
   * @default '#0A1612'
   */
  fadeColor?: string;

  /**
   * Height of the fade gradient in pixels
   * For 55-70 demographic: larger, more obvious fade (40-50px)
   * @default 48
   */
  fadeHeight?: number;

  /**
   * Whether to show top fade
   * @default true
   */
  showTopFade?: boolean;

  /**
   * Whether to show bottom fade
   * @default true
   */
  showBottomFade?: boolean;

  /**
   * Always show fades or only when scrolling
   * For older demographic: always visible is better for discoverability
   * @default 'always'
   */
  fadeVisibility?: 'always' | 'dynamic' | 'scrolling';

  /**
   * Opacity of the fade at full intensity
   * Higher values = more pronounced fade
   * @default 0.95
   */
  fadeIntensity?: number;

  /**
   * Threshold in pixels before showing fade indicators
   * @default 10
   */
  scrollThreshold?: number;
}

/**
 * ScrollView with elegant fade indicators at top/bottom
 * Optimized for dark theme (#0A1612) and 55-70 demographic
 *
 * Features:
 * - Subtle visual affordance for scrollable content
 * - Dynamic fade visibility based on scroll position
 * - Proper pointer events to maintain touch handling
 * - iOS and Android compatible
 * - Accessible for older users with larger, more obvious fades
 */
export const ScrollFadeView: React.FC<ScrollFadeViewProps> = ({
  children,
  fadeColor = '#0A1612',
  fadeHeight = 48,
  showTopFade = true,
  showBottomFade = true,
  fadeVisibility = 'always',
  fadeIntensity = 0.95,
  scrollThreshold = 10,
  onScroll,
  contentContainerStyle,
  style,
  ...scrollViewProps
}) => {
  const [scrollState, setScrollState] = useState({
    isAtTop: true,
    isAtBottom: false,
    isScrolling: false,
  });

  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Get scroll control from context (allows nested components to disable scroll)
  const { scrollEnabled: scrollEnabledFromContext } = useScrollControl();

  /**
   * Handle scroll events to determine fade visibility
   */
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;

    // Calculate scroll position
    const scrollY = contentOffset.y;
    const contentHeight = contentSize.height;
    const scrollViewHeight = layoutMeasurement.height;

    // Determine if at top or bottom (with threshold)
    const isAtTop = scrollY <= scrollThreshold;
    const isAtBottom = scrollY + scrollViewHeight >= contentHeight - scrollThreshold;

    setScrollState({
      isAtTop,
      isAtBottom,
      isScrolling: true,
    });

    // For 'scrolling' mode: hide fades after scrolling stops
    if (fadeVisibility === 'scrolling') {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        setScrollState((prev) => ({ ...prev, isScrolling: false }));
      }, 1500); // Hide after 1.5s of no scrolling
    }

    // Forward to parent onScroll handler
    onScroll?.(event);
  };

  /**
   * Track container height for proper fade positioning
   */
  // const handleLayout = (event: LayoutChangeEvent) => {
  //   setContainerHeight(event.nativeEvent.layout.height);
  // };

  /**
   * Determine if fade should be visible based on mode and scroll position
   */
  const shouldShowTopFade = (): boolean => {
    if (!showTopFade) return false;

    switch (fadeVisibility) {
      case 'always':
        return !scrollState.isAtTop;
      case 'dynamic':
        return !scrollState.isAtTop;
      case 'scrolling':
        return !scrollState.isAtTop && scrollState.isScrolling;
      default:
        return false;
    }
  };

  const shouldShowBottomFade = (): boolean => {
    if (!showBottomFade) return false;

    switch (fadeVisibility) {
      case 'always':
        return !scrollState.isAtBottom;
      case 'dynamic':
        return !scrollState.isAtBottom;
      case 'scrolling':
        return !scrollState.isAtBottom && scrollState.isScrolling;
      default:
        return false;
    }
  };

  /**
   * Generate gradient color stops with transparency
   * Creates smooth fade from transparent to solid background color
   */
  const getGradientColors = (isTop: boolean) => {
    // Convert hex to rgba for gradient stops
    const rgb = hexToRgb(fadeColor);

    if (isTop) {
      // Top fade: solid at top, transparent at bottom
      return [
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${fadeIntensity})`,
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${fadeIntensity * 0.8})`,
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${fadeIntensity * 0.5})`,
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`,
      ] as const;
    } else {
      // Bottom fade: transparent at top, solid at bottom
      return [
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`,
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${fadeIntensity * 0.5})`,
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${fadeIntensity * 0.8})`,
        `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${fadeIntensity})`,
      ] as const;
    }
  };

  const showTop = shouldShowTopFade();
  const showBottom = shouldShowBottomFade();

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        {...scrollViewProps}
        style={styles.scrollView}
        contentContainerStyle={contentContainerStyle}
        onScroll={handleScroll}
        scrollEventThrottle={16} // Smooth 60fps scroll updates
        scrollEnabled={scrollEnabledFromContext} // Allow nested components to disable scroll
      >
        {children}
      </ScrollView>

      {/* Top Fade Gradient */}
      {showTop && (
        <LinearGradient
          colors={getGradientColors(true)}
          locations={[0, 0.4, 0.7, 1]}
          style={[styles.fadeGradient, styles.topFade, { height: fadeHeight }]}
          pointerEvents="none" // Allow touches to pass through
        />
      )}

      {/* Bottom Fade Gradient */}
      {showBottom && (
        <LinearGradient
          colors={getGradientColors(false)}
          locations={[0, 0.3, 0.6, 1]}
          style={[styles.fadeGradient, styles.bottomFade, { height: fadeHeight }]}
          pointerEvents="none" // Allow touches to pass through
        />
      )}
    </View>
  );
};

/**
 * Convert hex color to RGB values
 */
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Parse hex values
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return { r, g, b };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  fadeGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topFade: {
    top: 0,
  },
  bottomFade: {
    bottom: 0,
  },
});
