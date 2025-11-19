/**
 * Nœma - Profile Design System Helpers
 * Utility functions for working with the profile visual design system
 */

import * as React from 'react';
import { Platform, Dimensions, AccessibilityInfo } from 'react-native';
import type { LoopType } from './loopTypeColors';
import { getLoopTypeColors } from './loopTypeColors';
import { loopTypeIcons } from './profileIcons';

/**
 * Screen Dimensions
 */
export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;
export const isSmallScreen = screenWidth < 375;
export const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
export const isLargeScreen = screenWidth >= 414;

/**
 * Generate LinearGradient props for loop types
 * Returns gradient colors array ready for expo-linear-gradient
 */
export const getLoopTypeGradient = (loopType: LoopType) => {
  const colors = getLoopTypeColors(loopType);
  return {
    colors: [colors.gradient.start, colors.gradient.middle, colors.gradient.end],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    locations: [0, 0.5, 1],
  };
};

/**
 * Generate weather gradient for EmotionalWeather component
 * Matches database schema: 'sunny' | 'cloudy' | 'rainy' | 'foggy'
 */
export const getWeatherGradient = (weather: string) => {
  const weatherGradients: Record<string, string[]> = {
    sunny: ['#FCD34D', '#FBBF24', '#F59E0B'],
    cloudy: ['#CBD5E1', '#94A3B8', '#64748B'],
    rainy: ['#7DD3FC', '#38BDF8', '#0EA5E9'],
    foggy: ['#A5B4FC', '#818CF8', '#6366F1'],
  };

  return {
    colors: weatherGradients[weather] || weatherGradients.cloudy,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    locations: [0, 0.5, 1],
  };
};

/**
 * Get loop type metadata for display
 */
export const getLoopTypeMetadata = (loopType: LoopType) => {
  const metadata = {
    'sleep-loop': {
      name: 'Sleep Loop',
      shortName: 'Sleep',
      description:
        'Your mind finds peace in the quiet hours, but struggles to rest when the world sleeps',
      theme: 'Bedtime Rumination',
      keywords: ['bedtime', 'nighttime', 'rumination', 'sleep', 'rest'],
      vibe: 'dreamy, cosmic, calming',
    },
    'decision-loop': {
      name: 'Decision Loop',
      shortName: 'Decision',
      description:
        'Your mind explores every path, seeking the perfect choice in a world of possibilities',
      theme: 'Analysis Paralysis',
      keywords: ['decisions', 'choices', 'analysis', 'overthinking', 'clarity'],
      vibe: 'thoughtful, contemplative, crossroads',
    },
    'social-loop': {
      name: 'Social Loop',
      shortName: 'Social',
      description:
        'Your heart seeks connection, but your mind replays every interaction in search of belonging',
      theme: 'Social Anxiety',
      keywords: ['social', 'connection', 'conversation', 'belonging', 'anxiety'],
      vibe: 'warm, gentle, human',
    },
    'perfectionism-loop': {
      name: 'Perfectionism Loop',
      shortName: 'Perfectionism',
      description:
        'Your spirit reaches for excellence, but your mind never quite accepts good enough',
      theme: 'Never Good Enough',
      keywords: ['perfection', 'growth', 'excellence', 'standards', 'self-compassion'],
      vibe: 'growth-focused, organic, natural',
    },
  };

  return metadata[loopType] || metadata['sleep-loop'];
};

/**
 * Generate share card data for social sharing
 */
export const generateShareCardData = (loopType: LoopType, userName?: string) => {
  const colors = getLoopTypeColors(loopType);
  const icon = loopTypeIcons[loopType];
  const metadata = getLoopTypeMetadata(loopType);

  return {
    backgroundColor: colors.gradient.start,
    gradientColors: [colors.gradient.start, colors.gradient.middle, colors.gradient.end],
    icon: icon.emoji,
    title: `I'm a ${metadata.name} Navigator ${icon.emoji}`,
    subtitle: userName ? `${userName} on Nœma` : 'on Nœma',
    cta: 'Discover your loop type at trynoema.com',
    dimensions: {
      width: 1080,
      height: 1920, // Instagram Story dimensions
    },
  };
};

/**
 * Calculate responsive font size based on screen width
 */
export const getResponsiveFontSize = (baseFontSize: number) => {
  const baseScreenWidth = 375; // iPhone SE width
  const scaleFactor = screenWidth / baseScreenWidth;
  const minScale = 0.9; // Don't scale down more than 10%
  const maxScale = 1.1; // Don't scale up more than 10%

  const scale = Math.max(minScale, Math.min(maxScale, scaleFactor));
  return Math.round(baseFontSize * scale);
};

/**
 * Calculate grid columns based on screen width
 */
export const getGridColumns = () => {
  if (isSmallScreen) return 1;
  if (isMediumScreen) return 2;
  return 2; // Even on large phones, 2 columns max for readability
};

/**
 * Check if user prefers reduced motion
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((isEnabled) => {
      setPrefersReducedMotion(isEnabled);
    });

    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (isEnabled) => {
      setPrefersReducedMotion(isEnabled);
    });

    return () => subscription.remove();
  }, []);

  return prefersReducedMotion;
};

/**
 * Get animation duration based on reduced motion preference
 * @param prefersReduced - Whether the user prefers reduced motion (get this from useReducedMotion hook)
 * @param normalDuration - Normal animation duration in ms
 * @param reducedDuration - Optional reduced duration, defaults to half of normal
 */
export const getAccessibleDuration = (
  prefersReduced: boolean,
  normalDuration: number,
  reducedDuration?: number
) => {
  return prefersReduced ? reducedDuration || normalDuration * 0.5 : normalDuration;
};

/**
 * Platform-specific shadow generator
 */
export const createShadow = (
  elevation: number,
  shadowColor: string = '#000',
  shadowOpacity: number = 0.2
) => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor,
      shadowOffset: {
        width: 0,
        height: elevation / 2,
      },
      shadowOpacity,
      shadowRadius: elevation,
    };
  }

  return {
    elevation,
  };
};

/**
 * Generate glassmorphism style
 */
export const createGlassmorphism = (
  opacity: number = 0.08,
  blur: number = 20,
  borderOpacity: number = 0.12
) => {
  return {
    backgroundColor: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${blur}px)`,
    borderWidth: 1,
    borderColor: `rgba(255, 255, 255, ${borderOpacity})`,
  };
};

/**
 * Format numbers for display (with commas)
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format currency for product prices
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Get greeting based on time of day
 */
export const getGreeting = (hour?: number): string => {
  const currentHour = hour || new Date().getHours();

  if (currentHour < 12) return 'Good morning';
  if (currentHour < 18) return 'Good afternoon';
  return 'Good evening';
};

/**
 * Get time-based emoji
 */
export const getTimeEmoji = (hour?: number): string => {
  const currentHour = hour || new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) return '☀️'; // Morning
  if (currentHour >= 12 && currentHour < 17) return '🌤️'; // Afternoon
  if (currentHour >= 17 && currentHour < 21) return '🌅'; // Evening
  return '🌙'; // Night
};

/**
 * Calculate reading time for text content
 */
export const calculateReadingTime = (text: string, wordsPerMinute: number = 200): number => {
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Generate rating stars display
 */
export const generateStarRating = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return '⭐'.repeat(fullStars) + (hasHalfStar ? '⭐' : '') + '☆'.repeat(emptyStars);
};

/**
 * Get loop-specific product tags
 */
export const getLoopTypeProductTags = (loopType: LoopType): string[] => {
  const tags = {
    'sleep-loop': ['sleep', 'bedtime', 'relaxation', 'nighttime', 'rest'],
    'decision-loop': ['clarity', 'focus', 'planning', 'organization', 'mindfulness'],
    'social-loop': ['connection', 'confidence', 'communication', 'relationships', 'self-care'],
    'perfectionism-loop': ['growth', 'progress', 'self-compassion', 'balance', 'mindset'],
  };

  return tags[loopType] || [];
};

/**
 * Generate accessibility label for components
 */
export const createAccessibilityLabel = (component: string, data: Record<string, any>): string => {
  switch (component) {
    case 'loopTypeHero':
      return `Your loop type: ${data.loopType}. ${data.description}`;

    case 'insightCard':
      return `Pattern detected: ${data.title}. ${data.description}`;

    case 'productCard':
      return `Product: ${data.name}. Price: ${data.price}. Rating: ${data.rating} out of 5 stars.`;

    case 'weatherWidget':
      return `Today's emotional weather: ${data.condition}. ${data.description}`;

    default:
      return '';
  }
};

/**
 * Create accessibility hint for actions
 */
export const createAccessibilityHint = (action: string): string => {
  const hints: Record<string, string> = {
    share: 'Double tap to share your loop type',
    viewDetails: 'Double tap to view detailed insights',
    addToCart: 'Double tap to add to cart',
    upgrade: 'Double tap to unlock premium features',
    openLink: 'Double tap to open in browser',
  };

  return hints[action] || 'Double tap to activate';
};

/**
 * Check if premium feature
 */
export const isPremiumFeature = (featureName: string): boolean => {
  const premiumFeatures = [
    'fullTimeline',
    'advancedInsights',
    'privateJournaling',
    'meditationLibrary',
    'pdfExport',
    'exclusiveProducts',
  ];

  return premiumFeatures.includes(featureName);
};

/**
 * Generate plant emoji based on growth stage
 */
export const getPlantEmoji = (stage: 'seed' | 'sprout' | 'bloom' | 'flourish'): string => {
  const plants = {
    seed: '🌱',
    sprout: '🌿',
    bloom: '🌸',
    flourish: '🌺',
  };

  return plants[stage] || plants.seed;
};

/**
 * Calculate growth stage based on activity
 */
export const calculateGrowthStage = (
  newsletterOpens: number,
  checkIns: number,
  reflections: number
): 'seed' | 'sprout' | 'bloom' | 'flourish' => {
  const totalActivity = newsletterOpens + checkIns * 2 + reflections * 3;

  if (totalActivity >= 50) return 'flourish';
  if (totalActivity >= 30) return 'bloom';
  if (totalActivity >= 15) return 'sprout';
  return 'seed';
};

/**
 * Get encouraging message based on growth stage
 */
export const getGrowthMessage = (stage: 'seed' | 'sprout' | 'bloom' | 'flourish'): string => {
  const messages = {
    seed: "You've planted the seed. Every small step counts. 🌱",
    sprout: 'Your garden is starting to grow. Keep nurturing it. 🌿',
    bloom: 'Beautiful progress! Your consistency is blooming. 🌸',
    flourish: 'Your garden is flourishing beautifully! Keep it up. 🌺',
  };

  return messages[stage];
};

/**
 * Type guards
 */
export const isLoopType = (value: any): value is LoopType => {
  return ['sleep-loop', 'decision-loop', 'social-loop', 'perfectionism-loop'].includes(value);
};
