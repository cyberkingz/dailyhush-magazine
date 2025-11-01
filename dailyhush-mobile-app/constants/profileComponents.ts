/**
 * DailyHush - Profile Component Visual Specifications
 * Complete styling constants for all profile page components
 * Glassmorphism, shadows, borders, and layout specs
 */

import { Platform } from 'react-native';

/**
 * LOOP TYPE HERO CARD
 * The primary identity card at the top of the profile
 */
export const loopTypeHeroStyles = {
  container: {
    height: 240, // Reduced from 320px for visual balance with EmotionalWeather
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden' as const,
    marginBottom: 24,
    backgroundColor: '#0F1F1A', // Solid background like stat cards
    borderWidth: 1,
    borderColor: 'rgba(64, 145, 108, 0.15)', // Subtle border
  },

  // Gradient background layer
  gradientLayer: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.95,
  },

  // Frosted glass overlay
  glassOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px)',
  },

  // Content container
  content: {
    flex: 1,
    padding: 32,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    zIndex: 1,
  },

  // Icon container
  iconContainer: {
    width: 64, // Reduced from 96px for better proportions at 240px card height
    height: 64,
    borderRadius: 32, // Half of width/height
    backgroundColor: 'rgba(5, 150, 105, 0.15)', // Dark emerald tint
    borderWidth: 2,
    borderColor: 'rgba(5, 150, 105, 0.3)', // Dark emerald border
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 16, // Reduced from 24px for tighter spacing
    ...Platform.select({
      ios: {
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  // Share button
  shareButton: {
    position: 'absolute' as const,
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(5, 150, 105, 0.15)', // Dark emerald tint
    borderWidth: 1,
    borderColor: 'rgba(5, 150, 105, 0.3)', // Dark emerald border
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },

  // Shadow for the entire card
  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
    },
    android: {
      elevation: 12,
    },
  }),
} as const;

/**
 * EMOTIONAL WEATHER WIDGET
 * Weather-based mood visualization
 */
export const emotionalWeatherStyles = {
  container: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    backgroundColor: 'rgba(26, 77, 60, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(82, 183, 136, 0.2)',
  },

  // Weather icon container
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    alignSelf: 'center' as const,
    marginVertical: 16,
  },

  // Gradient background for weather types
  weatherGradient: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2,
    borderRadius: 20,
  },

  // Content area
  content: {
    alignItems: 'center' as const,
  },

  // Metadata container
  metadata: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },

  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
    },
    android: {
      elevation: 4,
    },
  }),
} as const;

/**
 * JOURNEY TIMELINE
 * Organic curve visualization of emotional journey
 */
export const journeyTimelineStyles = {
  container: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    backgroundColor: 'rgba(26, 77, 60, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(82, 183, 136, 0.2)',
  },

  // Chart area
  chartArea: {
    height: 200,
    marginVertical: 16,
  },

  // Organic curve path
  curvePath: {
    strokeWidth: 3,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  },

  // Gradient fill under curve
  curveGradient: {
    opacity: 0.3,
  },

  // Data point circles
  dataPoint: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
  },

  // Active data point (when tapped)
  activeDataPoint: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    ...Platform.select({
      ios: {
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  // Axis labels
  axisLabel: {
    position: 'absolute' as const,
  },

  // Legend container
  legend: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },

  legendItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },

  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
} as const;

/**
 * PATTERN INSIGHT CARD
 * Individual cards showing detected patterns
 */
export const patternInsightCardStyles = {
  container: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    backgroundColor: 'rgba(26, 77, 60, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(82, 183, 136, 0.25)',
    minHeight: 140,
  },

  // Frosted glass effect
  glassEffect: {
    backdropFilter: 'blur(10px)',
  },

  // Icon container
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },

  // Premium badge
  premiumBadge: {
    position: 'absolute' as const,
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.4)',
  },

  // Content area
  content: {
    flex: 1,
  },

  // Card pressed state
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },

  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
    },
    android: {
      elevation: 4,
    },
  }),
} as const;

/**
 * PRODUCT CARD
 * E-commerce product cards for recommendations
 */
export const productCardStyles = {
  container: {
    width: 180,
    borderRadius: 16,
    backgroundColor: 'rgba(26, 77, 60, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(82, 183, 136, 0.2)',
    overflow: 'hidden' as const,
    marginRight: 16,
  },

  // Product image container
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    position: 'relative' as const,
  },

  // Image overlay gradient
  imageOverlay: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    opacity: 0.8,
  },

  // Recommended badge
  recommendedBadge: {
    position: 'absolute' as const,
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(110, 231, 183, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(110, 231, 183, 0.5)',
  },

  // Content padding
  content: {
    padding: 16,
  },

  // Rating container
  ratingContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
    marginTop: 8,
  },

  // Price container
  priceContainer: {
    flexDirection: 'row' as const,
    alignItems: 'baseline' as const,
    gap: 4,
    marginTop: 12,
  },

  // CTA button
  ctaButton: {
    marginTop: 12,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(64, 145, 108, 0.8)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },

  shadow: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    android: {
      elevation: 6,
    },
  }),
} as const;

/**
 * GROWTH GARDEN
 * Plant metaphor for progress visualization
 */
export const growthGardenStyles = {
  container: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    backgroundColor: 'rgba(26, 77, 60, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(82, 183, 136, 0.2)',
    minHeight: 200,
  },

  // Soil/ground visual
  ground: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(45, 106, 79, 0.4)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  // Plant container
  plantContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    alignItems: 'flex-end' as const,
    height: 120,
    marginBottom: 40,
  },

  // Individual plant
  plant: {
    alignItems: 'center' as const,
  },

  // Stats container
  statsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },

  statRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },

  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
} as const;

/**
 * SECTION CONTAINER
 * Generic container for profile sections
 */
export const sectionContainerStyles = {
  default: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },

  withCard: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },

  // Header area
  header: {
    marginBottom: 16,
  },

  // Title with action button
  headerWithAction: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },

  // Action button in header
  headerAction: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(82, 183, 136, 0.15)',
  },
} as const;

/**
 * PREMIUM UPGRADE CARD
 * Soft upsell for premium features
 */
export const premiumUpgradeStyles = {
  container: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(124, 58, 237, 0.3)',
    alignItems: 'center' as const,
  },

  // Gradient overlay
  gradientOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    borderRadius: 20,
  },

  // Icon container
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },

  // Feature list
  featureList: {
    width: '100%',
    marginVertical: 16,
    gap: 12,
  },

  featureItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
  },

  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },

  // CTA button
  ctaButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    backgroundColor: '#7C3AED',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  // Price display
  priceContainer: {
    marginTop: 16,
    alignItems: 'center' as const,
  },
} as const;

/**
 * GLASSMORPHISM PRESETS
 * Ready-to-use glass effect configurations
 */
export const glassmorphismPresets = {
  // Subtle glass (for backgrounds)
  subtle: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },

  // Medium glass (for cards)
  medium: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },

  // Strong glass (for modals)
  strong: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(30px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },

  // Dark glass (for overlays on light backgrounds)
  dark: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
} as const;

/**
 * BORDER RADIUS SCALE
 * Consistent rounded corners
 */
export const profileBorderRadius = {
  none: 0,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  full: 9999,
} as const;

/**
 * SPACING SCALE
 * Consistent spacing for profile components
 */
export const profileSpacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
} as const;

/**
 * Helper Types
 */
export type GlassmorphismPreset = keyof typeof glassmorphismPresets;
export type ProfileBorderRadius = keyof typeof profileBorderRadius;
export type ProfileSpacing = keyof typeof profileSpacing;

/**
 * Helper Functions
 */
export const getGlassEffect = (preset: GlassmorphismPreset = 'medium') => {
  return glassmorphismPresets[preset];
};

export const getBorderRadius = (size: ProfileBorderRadius = 'md') => {
  return profileBorderRadius[size];
};

export const getProfileSpacing = (size: ProfileSpacing = 'md') => {
  return profileSpacing[size];
};
