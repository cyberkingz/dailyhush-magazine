/**
 * Nœma - Profile Page Icon System
 * Consistent icon mapping for loop types, insights, and UI elements
 * Using emoji for primary icons and lucide-react-native for UI
 */

import type { LucideIcon } from 'lucide-react-native';

/**
 * Loop Type Primary Icons
 * Large display icons for hero cards and identity
 */
export const loopTypeIcons = {
  'sleep-loop': {
    emoji: '🌙',
    name: 'Moon',
    alt: 'Crescent moon - Sleep Loop',
    // Supporting icons for this loop type
    supporting: ['⭐', '🛌', '✨', '🌌', '💤'],
  },
  'decision-loop': {
    emoji: '🔄',
    name: 'Circular Arrows',
    alt: 'Circular arrows - Decision Loop',
    supporting: ['🧭', '🤔', '🗺️', '⚖️', '💭'],
  },
  'social-loop': {
    emoji: '💭',
    name: 'Thought Bubble',
    alt: 'Thought bubble - Social Loop',
    supporting: ['💬', '🤝', '🌸', '💫', '🦋'],
  },
  'perfectionism-loop': {
    emoji: '✨',
    name: 'Sparkles',
    alt: 'Sparkles - Perfectionism Loop',
    supporting: ['🌱', '🎯', '🌿', '🌻', '🌳'],
  },
} as const;

/**
 * Emotional Weather Icons
 * For EmotionalWeather widget
 * Matches database schema: 'sunny' | 'cloudy' | 'rainy' | 'foggy'
 */
export const weatherIcons = {
  sunny: { emoji: '☀️', name: 'Sunny', lucide: 'Sun' },
  cloudy: { emoji: '☁️', name: 'Cloudy', lucide: 'Cloud' },
  rainy: { emoji: '🌧️', name: 'Rainy', lucide: 'CloudRain' },
  foggy: { emoji: '🌫️', name: 'Foggy', lucide: 'CloudFog' },
} as const;

/**
 * Pattern Insight Icons
 * For PatternInsightCard components
 */
export const insightIcons = {
  // Time-based patterns
  'morning-peak': '🌅',
  'evening-valley': '🌙',
  'weekend-pattern': '📅',
  'weekly-cycle': '📊',

  // Emotional patterns
  'rumination-spike': '🌀',
  'clarity-moment': '💡',
  'peace-found': '🕊️',
  'stress-trigger': '⚡',

  // Growth indicators
  'progress-made': '📈',
  'consistency-streak': '🔥',
  'milestone-reached': '🎯',
  'breakthrough': '✨',

  // Activity patterns
  'journaling-habit': '📖',
  'meditation-practice': '🧘',
  'walking-routine': '🚶',
  'reading-time': '📚',
} as const;

/**
 * Insight Category Icons
 * For categorizing AI-generated insights
 * Matches database schema: 'pattern' | 'progress' | 'recommendation' | 'celebration'
 */
export const insightCategoryIcons = {
  pattern: { emoji: '🔍', name: 'Pattern Detection', lucide: 'Search' },
  progress: { emoji: '📈', name: 'Progress Tracking', lucide: 'TrendingUp' },
  recommendation: { emoji: '💡', name: 'Recommendation', lucide: 'Lightbulb' },
  celebration: { emoji: '🎉', name: 'Celebration', lucide: 'PartyPopper' },
} as const;

/**
 * UI Element Icons
 * Lucide icon names for React Native components
 */
export const uiIcons = {
  // Navigation
  back: 'ChevronLeft',
  forward: 'ChevronRight',
  close: 'X',
  menu: 'Menu',
  home: 'Home',

  // Actions
  share: 'Share2',
  edit: 'Edit3',
  save: 'Save',
  delete: 'Trash2',
  refresh: 'RefreshCw',
  download: 'Download',

  // Status
  checkmark: 'Check',
  warning: 'AlertCircle',
  error: 'XCircle',
  info: 'Info',
  lock: 'Lock',
  unlock: 'Unlock',

  // Content
  calendar: 'Calendar',
  clock: 'Clock',
  heart: 'Heart',
  star: 'Star',
  bookmark: 'Bookmark',
  tag: 'Tag',

  // Profile
  user: 'User',
  settings: 'Settings',
  bell: 'Bell',
  mail: 'Mail',

  // Data visualization
  trendingUp: 'TrendingUp',
  trendingDown: 'TrendingDown',
  activity: 'Activity',
  barChart: 'BarChart3',
  pieChart: 'PieChart',

  // Commerce
  shoppingBag: 'ShoppingBag',
  package: 'Package',
  creditCard: 'CreditCard',
  gift: 'Gift',

  // Wellness
  sparkles: 'Sparkles',
  zap: 'Zap',
  moon: 'Moon',
  sun: 'Sun',
  leaf: 'Leaf',
} as const;

/**
 * Icon Size Scale
 * Consistent sizing across the app
 */
export const iconSizes = {
  xs: 16, // Small inline icons
  sm: 20, // Secondary icons, badges
  md: 24, // Standard UI icons
  lg: 32, // Section icons, feature icons
  xl: 48, // Large display icons
  '2xl': 64, // Hero icons (loop type hero)
  '3xl': 80, // Extra large (weather widget)
} as const;

/**
 * Icon Container Sizes
 * For circular icon containers with background
 */
export const iconContainerSizes = {
  xs: 24, // Container for 16px icon
  sm: 32, // Container for 20px icon
  md: 40, // Container for 24px icon
  lg: 56, // Container for 32px icon
  xl: 80, // Container for 48px icon
  '2xl': 96, // Container for 64px icon
} as const;

/**
 * Lucide Icon Stroke Widths
 * For consistent line weight
 */
export const iconStrokeWidths = {
  thin: 1.5,
  regular: 2,
  medium: 2.5,
  bold: 3,
} as const;

/**
 * Helper Types
 */
export type LoopTypeIconKey = keyof typeof loopTypeIcons;
export type WeatherIconKey = keyof typeof weatherIcons;
export type InsightIconKey = keyof typeof insightIcons;
export type InsightCategoryIconKey = keyof typeof insightCategoryIcons;
export type UIIconKey = keyof typeof uiIcons;
export type IconSize = keyof typeof iconSizes;
export type IconContainerSize = keyof typeof iconContainerSizes;
export type IconStrokeWidth = keyof typeof iconStrokeWidths;

/**
 * Helper Functions
 */
export const getLoopTypeIcon = (loopType: LoopTypeIconKey) => {
  return loopTypeIcons[loopType] || loopTypeIcons['sleep-loop'];
};

export const getWeatherIcon = (weather: WeatherIconKey) => {
  return weatherIcons[weather] || weatherIcons.cloudy;
};

export const getInsightIcon = (insightType: InsightIconKey) => {
  return insightIcons[insightType] || '💡';
};

export const getInsightCategoryIcon = (category: InsightCategoryIconKey) => {
  return insightCategoryIcons[category] || insightCategoryIcons.pattern;
};

export const getUIIcon = (iconName: UIIconKey) => {
  return uiIcons[iconName];
};

export const getIconSize = (size: IconSize = 'md') => {
  return iconSizes[size];
};

export const getContainerSize = (size: IconContainerSize = 'md') => {
  return iconContainerSizes[size];
};

export const getStrokeWidth = (weight: IconStrokeWidth = 'regular') => {
  return iconStrokeWidths[weight];
};
