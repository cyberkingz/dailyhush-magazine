/**
 * Nœma - Module Configuration
 * Defines the core help modules users can access based on their needs
 *
 * Design Philosophy:
 * - Urgent/free modules first (Stop Spiraling, Calm Anxiety)
 * - Premium modules provide deeper, ongoing support
 * - Each module offers multiple methods (talk to Anna, exercises, etc.)
 */

export type ModuleId =
  | 'stop-spiraling'
  | 'calm-anxiety'
  | 'process-emotions'
  | 'better-sleep'
  | 'gain-focus';

export type ModuleColor = {
  primary: string;
  gradient: readonly [string, string];
  background: string;
  border: string;
};

export interface Module {
  id: ModuleId;
  title: string;
  subtitle: string;
  description: string;
  icon: string; // Emoji icon
  color: ModuleColor;
  isEnabled: boolean;
  isPremium: boolean;
  isUrgent?: boolean; // Flag for immediate intervention needs
  estimatedDuration: string; // Display duration range
  methods: string[]; // Array of method IDs available for this module
  tags: readonly string[]; // Searchable tags for discovery
}

/**
 * Module color definitions
 * Using the app's design system for consistency
 */
const moduleColors = {
  red: {
    primary: '#DC2626',
    gradient: ['#DC2626', '#EF4444'] as const,
    background: 'rgba(220, 38, 38, 0.1)',
    border: 'rgba(220, 38, 38, 0.3)',
  },
  orange: {
    primary: '#F97316',
    gradient: ['#F97316', '#FB923C'] as const,
    background: 'rgba(249, 115, 22, 0.1)',
    border: 'rgba(249, 115, 22, 0.3)',
  },
  purple: {
    primary: '#7C3AED',
    gradient: ['#5B21B6', '#C4B5FD'] as const,
    background: 'rgba(124, 58, 237, 0.1)',
    border: 'rgba(124, 58, 237, 0.3)',
  },
  blue: {
    primary: '#3B82F6',
    gradient: ['#2563EB', '#60A5FA'] as const,
    background: 'rgba(59, 130, 246, 0.1)',
    border: 'rgba(59, 130, 246, 0.3)',
  },
  green: {
    primary: '#059669',
    gradient: ['#047857', '#059669'] as const,
    background: 'rgba(5, 150, 105, 0.1)',
    border: 'rgba(5, 150, 105, 0.3)',
  },
} as const;

/**
 * Module configuration
 * Ordered by urgency and premium status
 */
export const MODULES: Record<ModuleId, Module> = {
  'stop-spiraling': {
    id: 'stop-spiraling',
    title: 'Stop Spiraling',
    subtitle: 'Interrupt rumination right now',
    description:
      "You're stuck in a thought loop and need to break out. Get immediate relief through guided exercises or talk to Anna for personalized support.",
    icon: '🌀',
    color: moduleColors.red,
    isEnabled: true,
    isPremium: false,
    isUrgent: true,
    estimatedDuration: '2-10 min',
    methods: ['talk-to-anna', 'quick-exercise', 'breathing-exercise'],
    tags: ['urgent', 'rumination', 'anxiety', 'overthinking', 'spiral', 'intrusive-thoughts'],
  },

  'calm-anxiety': {
    id: 'calm-anxiety',
    title: 'Calm Anxiety',
    subtitle: 'Reduce stress and find peace',
    description:
      'Feeling anxious, stressed, or overwhelmed? Use proven techniques to calm your nervous system and regain control.',
    icon: '🍃',
    color: moduleColors.orange,
    isEnabled: true,
    isPremium: false,
    isUrgent: false,
    estimatedDuration: '3-15 min',
    methods: ['talk-to-anna', 'quick-exercise', 'breathing-exercise'],
    tags: ['anxiety', 'stress', 'overwhelm', 'calm', 'grounding', 'relaxation'],
  },

  'process-emotions': {
    id: 'process-emotions',
    title: 'Process Emotions',
    subtitle: "Understand what you're feeling",
    description:
      'Work through difficult emotions with compassionate guidance. Learn to identify, accept, and move through your feelings in healthy ways.',
    icon: '💜',
    color: moduleColors.purple,
    isEnabled: true,
    isPremium: true,
    isUrgent: false,
    estimatedDuration: '5-20 min',
    methods: ['talk-to-anna', 'quick-exercise', 'progress-dashboard'],
    tags: ['emotions', 'feelings', 'processing', 'emotional-intelligence', 'self-awareness'],
  },

  'better-sleep': {
    id: 'better-sleep',
    title: 'Better Sleep',
    subtitle: 'Quiet your mind for rest',
    description:
      'Racing thoughts keeping you up? Learn techniques to calm your mind before bed and break the nighttime rumination cycle.',
    icon: '🌙',
    color: moduleColors.blue,
    isEnabled: true,
    isPremium: true,
    isUrgent: false,
    estimatedDuration: '5-15 min',
    methods: ['talk-to-anna', 'quick-exercise', 'breathing-exercise', 'progress-dashboard'],
    tags: ['sleep', 'insomnia', 'bedtime', 'night-anxiety', 'wind-down', 'rest'],
  },

  'gain-focus': {
    id: 'gain-focus',
    title: 'Gain Focus',
    subtitle: 'Clear mental clutter',
    description:
      'Scattered thoughts preventing productivity? Get tools to quiet the mental noise and concentrate on what matters.',
    icon: '🎯',
    color: moduleColors.green,
    isEnabled: true,
    isPremium: true,
    isUrgent: false,
    estimatedDuration: '3-10 min',
    methods: ['talk-to-anna', 'quick-exercise', 'progress-dashboard'],
    tags: ['focus', 'concentration', 'productivity', 'mental-clarity', 'distraction', 'adhd'],
  },
};

/**
 * Helper Functions
 */

/**
 * Get module configuration by ID
 */
export const getModule = (moduleId: ModuleId): Module => {
  return MODULES[moduleId];
};

/**
 * Get all enabled modules
 */
export const getEnabledModules = (): Module[] => {
  return Object.values(MODULES).filter((module) => module.isEnabled);
};

/**
 * Get free modules only
 */
export const getFreeModules = (): Module[] => {
  return Object.values(MODULES).filter((module) => module.isEnabled && !module.isPremium);
};

/**
 * Get premium modules only
 */
export const getPremiumModules = (): Module[] => {
  return Object.values(MODULES).filter((module) => module.isEnabled && module.isPremium);
};

/**
 * Get urgent modules (for crisis intervention)
 */
export const getUrgentModules = (): Module[] => {
  return Object.values(MODULES).filter((module) => module.isEnabled && module.isUrgent);
};

/**
 * Check if user has access to module based on premium status
 */
export const hasModuleAccess = (moduleId: ModuleId, isPremiumUser: boolean): boolean => {
  const module = MODULES[moduleId];
  return module.isEnabled && (!module.isPremium || isPremiumUser);
};

/**
 * Get module by tag (for search/discovery)
 */
export const getModulesByTag = (tag: string): Module[] => {
  const normalizedTag = tag.toLowerCase();
  return Object.values(MODULES).filter(
    (module) => module.isEnabled && module.tags.some((t) => t.includes(normalizedTag))
  );
};

/**
 * Get all module IDs as an array
 */
export const ALL_MODULE_IDS: readonly ModuleId[] = [
  'stop-spiraling',
  'calm-anxiety',
  'process-emotions',
  'better-sleep',
  'gain-focus',
] as const;
