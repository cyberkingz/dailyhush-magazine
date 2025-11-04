/**
 * DailyHush - Method Configuration
 * Defines how users can engage with each module
 *
 * Design Philosophy:
 * - Multiple pathways to solve the same problem
 * - Quick exercises for immediate relief (2-3 min)
 * - Anna conversations for deeper support (5-10 min)
 * - Breathing exercises for physiological calm (3 min)
 * - Progress dashboards for tracking and insights (premium)
 *
 * Inspired by: Stoic's "Exercises from Therapists" approach
 */

import { ModuleId } from './modules';

export type MethodId =
  | 'talk-to-anna'
  | 'quick-exercise'
  | 'breathing-exercise'
  | 'progress-dashboard';

export interface MethodNavigationParams {
  moduleId: ModuleId;
  moduleName?: string;
  source?: string;
  [key: string]: any; // Allow additional params
}

export interface Method {
  id: MethodId;
  moduleId: ModuleId; // Which module this method belongs to
  title: string;
  subtitle: string;
  description: string;
  icon: string; // Emoji icon
  duration: string; // Human-readable duration
  durationMinutes: number; // Machine-readable for sorting/filtering
  route: string; // Navigation route (Expo Router path)
  params?: MethodNavigationParams; // Navigation params to pass
  isPremium: boolean;
  isRecommended?: boolean; // Highlight as recommended for this module
  benefits: readonly string[]; // What user gets from this method
  bestFor: readonly string[]; // When to choose this method
}

/**
 * Method definitions by module
 * Each module can have multiple methods
 */

// STOP SPIRALING Methods
const stopSpiralingMethods: Method[] = [
  {
    id: 'talk-to-anna',
    moduleId: 'stop-spiraling',
    title: 'Talk to Anna',
    subtitle: 'Get personalized support',
    description:
      'Have a conversation with Anna, your AI therapist. She\'ll help you understand what\'s happening and guide you through it.',
    icon: '💬',
    duration: '5-10 min',
    durationMinutes: 7,
    route: '/anna/conversation',
    params: {
      moduleId: 'stop-spiraling',
      moduleName: 'Stop Spiraling',
      source: 'module-selection',
    },
    isPremium: false,
    isRecommended: true,
    benefits: [
      'Personalized guidance',
      'Understand your patterns',
      'Compassionate support',
      'Tailored exercises',
    ],
    bestFor: [
      'When you need to talk it out',
      'Understanding why you\'re spiraling',
      'First time using the app',
    ],
  },
  {
    id: 'quick-exercise',
    moduleId: 'stop-spiraling',
    title: 'Quick Exercise',
    subtitle: 'Break the loop now',
    description:
      'Jump straight into the 90-second spiral interrupt protocol. No conversation, just action.',
    icon: '⚡',
    duration: '2 min',
    durationMinutes: 2,
    route: '/spiral',
    params: {
      moduleId: 'stop-spiraling',
      source: 'module-selection',
    },
    isPremium: false,
    isRecommended: false,
    benefits: ['Fastest relief', 'Immediate action', 'Proven protocol', 'No thinking required'],
    bestFor: ['Crisis moments', 'When you just need it to stop', 'Repeat users who know the drill'],
  },
  {
    id: 'breathing-exercise',
    moduleId: 'stop-spiraling',
    title: 'Breathing Exercise',
    subtitle: 'Calm your nervous system',
    description: 'Guided breathing to physiologically interrupt the spiral and restore calm.',
    icon: '🫁',
    duration: '3 min',
    durationMinutes: 3,
    route: '/exercises/breathing',
    params: {
      moduleId: 'stop-spiraling',
      exerciseType: 'box-breathing',
      duration: 180,
    },
    isPremium: false,
    isRecommended: false,
    benefits: ['Physical calm', 'Reduced heart rate', 'Grounding', 'Portable technique'],
    bestFor: [
      'Physical anxiety symptoms',
      'Public places',
      'When you can\'t talk',
      'Building daily habits',
    ],
  },
];

// CALM ANXIETY Methods
const calmAnxietyMethods: Method[] = [
  {
    id: 'talk-to-anna',
    moduleId: 'calm-anxiety',
    title: 'Talk to Anna',
    subtitle: 'Work through your anxiety',
    description:
      'Discuss what\'s making you anxious with Anna. She\'ll help you identify triggers and develop coping strategies.',
    icon: '💬',
    duration: '5-10 min',
    durationMinutes: 7,
    route: '/anna/conversation',
    params: {
      moduleId: 'calm-anxiety',
      moduleName: 'Calm Anxiety',
      source: 'module-selection',
    },
    isPremium: false,
    isRecommended: true,
    benefits: [
      'Identify anxiety triggers',
      'Develop coping strategies',
      'Compassionate listening',
      'Personalized advice',
    ],
    bestFor: ['General anxiety', 'Unclear triggers', 'Need to process verbally'],
  },
  {
    id: 'quick-exercise',
    moduleId: 'calm-anxiety',
    title: 'Grounding Exercise',
    subtitle: '5-4-3-2-1 technique',
    description:
      'Use your senses to anchor yourself in the present moment and interrupt anxious thoughts.',
    icon: '🌿',
    duration: '3 min',
    durationMinutes: 3,
    route: '/exercises/grounding',
    params: {
      moduleId: 'calm-anxiety',
      exerciseType: '5-4-3-2-1',
    },
    isPremium: false,
    isRecommended: false,
    benefits: ['Immediate grounding', 'Present-moment awareness', 'Sensory focus', 'Portable'],
    bestFor: ['Panic attacks', 'Dissociation', 'Overwhelming situations', 'Public spaces'],
  },
  {
    id: 'breathing-exercise',
    moduleId: 'calm-anxiety',
    title: 'Calming Breath',
    subtitle: '4-7-8 breathing',
    description: 'Research-backed breathing pattern to activate your parasympathetic nervous system.',
    icon: '🫁',
    duration: '3 min',
    durationMinutes: 3,
    route: '/exercises/breathing',
    params: {
      moduleId: 'calm-anxiety',
      exerciseType: '4-7-8',
      duration: 180,
    },
    isPremium: false,
    isRecommended: false,
    benefits: [
      'Activates calm response',
      'Reduces heart rate',
      'Evidence-based',
      'Builds resilience',
    ],
    bestFor: ['Physical anxiety', 'Sleep prep', 'Daily practice', 'Before stressful events'],
  },
];

// PROCESS EMOTIONS Methods (Premium)
const processEmotionsMethods: Method[] = [
  {
    id: 'talk-to-anna',
    moduleId: 'process-emotions',
    title: 'Emotional Check-In',
    subtitle: 'Name and process what you feel',
    description:
      'Anna guides you through identifying, accepting, and processing complex emotions with compassion.',
    icon: '💬',
    duration: '10-15 min',
    durationMinutes: 12,
    route: '/anna/conversation',
    params: {
      moduleId: 'process-emotions',
      moduleName: 'Process Emotions',
      source: 'module-selection',
      conversationType: 'emotional-processing',
    },
    isPremium: true,
    isRecommended: true,
    benefits: [
      'Emotional clarity',
      'Self-compassion',
      'Pattern recognition',
      'Healthy processing',
    ],
    bestFor: [
      'Complex feelings',
      'After difficult events',
      'Building emotional intelligence',
      'Relationship issues',
    ],
  },
  {
    id: 'quick-exercise',
    moduleId: 'process-emotions',
    title: 'Emotion Wheel',
    subtitle: 'Identify what you\'re feeling',
    description: 'Use the emotion wheel to pinpoint exactly what you\'re experiencing and why.',
    icon: '🎨',
    duration: '5 min',
    durationMinutes: 5,
    route: '/exercises/emotion-wheel',
    params: {
      moduleId: 'process-emotions',
    },
    isPremium: true,
    isRecommended: false,
    benefits: ['Emotional vocabulary', 'Self-awareness', 'Pattern spotting', 'Validation'],
    bestFor: [
      'Confused about feelings',
      'Emotional numbness',
      'Building awareness',
      'Journaling prep',
    ],
  },
  {
    id: 'progress-dashboard',
    moduleId: 'process-emotions',
    title: 'Emotion Insights',
    subtitle: 'Track your emotional patterns',
    description: 'See your emotional trends over time and understand your patterns better.',
    icon: '📊',
    duration: 'Explore',
    durationMinutes: 0,
    route: '/insights/emotions',
    params: {
      moduleId: 'process-emotions',
      view: 'emotions',
    },
    isPremium: true,
    isRecommended: false,
    benefits: ['Pattern recognition', 'Long-term trends', 'Trigger identification', 'Progress'],
    bestFor: [
      'Regular users',
      'Understanding patterns',
      'Celebrating progress',
      'Sharing with therapist',
    ],
  },
];

// BETTER SLEEP Methods (Premium)
const betterSleepMethods: Method[] = [
  {
    id: 'talk-to-anna',
    moduleId: 'better-sleep',
    title: 'Bedtime Check-In',
    subtitle: 'Clear your mind for sleep',
    description: 'Talk through what\'s keeping you up. Anna helps you process and release it.',
    icon: '💬',
    duration: '5-10 min',
    durationMinutes: 7,
    route: '/anna/conversation',
    params: {
      moduleId: 'better-sleep',
      moduleName: 'Better Sleep',
      source: 'module-selection',
      conversationType: 'sleep-prep',
    },
    isPremium: true,
    isRecommended: true,
    benefits: [
      'Mental clarity',
      'Tomorrow planning',
      'Worry offloading',
      'Sleep-ready mindset',
    ],
    bestFor: [
      'Racing thoughts at night',
      'Tomorrow\'s worries',
      'Bedtime routine',
      'First-time insomnia',
    ],
  },
  {
    id: 'quick-exercise',
    moduleId: 'better-sleep',
    title: 'Brain Dump',
    subtitle: 'Write it all down',
    description:
      'Get every thought out of your head and onto paper. Clear your mental cache before sleep.',
    icon: '📝',
    duration: '5 min',
    durationMinutes: 5,
    route: '/exercises/brain-dump',
    params: {
      moduleId: 'better-sleep',
    },
    isPremium: true,
    isRecommended: false,
    benefits: ['Mental clearing', 'Tomorrow planning', 'Anxiety relief', 'Habit building'],
    bestFor: [
      'Planning anxiety',
      'Task overwhelm',
      'Regular nighttime routine',
      'Decision fatigue',
    ],
  },
  {
    id: 'breathing-exercise',
    moduleId: 'better-sleep',
    title: 'Sleep Breathing',
    subtitle: 'Progressive relaxation',
    description: 'Gentle breathing combined with body relaxation to prepare for sleep.',
    icon: '🫁',
    duration: '10 min',
    durationMinutes: 10,
    route: '/exercises/breathing',
    params: {
      moduleId: 'better-sleep',
      exerciseType: 'sleep-breathing',
      duration: 600,
    },
    isPremium: true,
    isRecommended: false,
    benefits: ['Physical relaxation', 'Sleep onset', 'Body awareness', 'Anxiety reduction'],
    bestFor: [
      'Physical tension',
      'Wired but tired',
      'Consistent sleep routine',
      'Medication alternative',
    ],
  },
  {
    id: 'progress-dashboard',
    moduleId: 'better-sleep',
    title: 'Sleep Patterns',
    subtitle: 'Track your sleep quality',
    description: 'See how your mental patterns affect sleep and what\'s improving.',
    icon: '📊',
    duration: 'Explore',
    durationMinutes: 0,
    route: '/insights/sleep',
    params: {
      moduleId: 'better-sleep',
      view: 'sleep',
    },
    isPremium: true,
    isRecommended: false,
    benefits: ['Pattern insights', 'Quality tracking', 'Trigger identification', 'Improvement'],
    bestFor: [
      'Chronic insomnia',
      'Understanding sleep disruptions',
      'Optimizing routine',
      'Medical consultation prep',
    ],
  },
];

// GAIN FOCUS Methods (Premium)
const gainFocusMethods: Method[] = [
  {
    id: 'talk-to-anna',
    moduleId: 'gain-focus',
    title: 'Focus Session',
    subtitle: 'Clear mental clutter',
    description: 'Work with Anna to identify what\'s distracting you and create a focus plan.',
    icon: '💬',
    duration: '5-8 min',
    durationMinutes: 6,
    route: '/anna/conversation',
    params: {
      moduleId: 'gain-focus',
      moduleName: 'Gain Focus',
      source: 'module-selection',
      conversationType: 'focus-prep',
    },
    isPremium: true,
    isRecommended: true,
    benefits: [
      'Distraction identification',
      'Priority clarity',
      'Focus plan',
      'Motivation boost',
    ],
    bestFor: [
      'Starting work sessions',
      'Scattered thoughts',
      'Procrastination',
      'Important tasks',
    ],
  },
  {
    id: 'quick-exercise',
    moduleId: 'gain-focus',
    title: 'Mind Clear',
    subtitle: '2-minute mental reset',
    description: 'Quick mental clearing exercise to restore concentration and mental energy.',
    icon: '🧠',
    duration: '2 min',
    durationMinutes: 2,
    route: '/exercises/mind-clear',
    params: {
      moduleId: 'gain-focus',
    },
    isPremium: true,
    isRecommended: false,
    benefits: ['Quick reset', 'Energy boost', 'Mental clarity', 'Portable technique'],
    bestFor: [
      'Between tasks',
      'Afternoon slumps',
      'Meeting transitions',
      'Pomodoro breaks',
    ],
  },
  {
    id: 'progress-dashboard',
    moduleId: 'gain-focus',
    title: 'Productivity Insights',
    subtitle: 'When you focus best',
    description: 'Discover your peak focus times and what helps you concentrate.',
    icon: '📊',
    duration: 'Explore',
    durationMinutes: 0,
    route: '/insights/focus',
    params: {
      moduleId: 'gain-focus',
      view: 'focus',
    },
    isPremium: true,
    isRecommended: false,
    benefits: [
      'Peak time identification',
      'Distraction patterns',
      'Optimization',
      'Work planning',
    ],
    bestFor: [
      'Optimizing schedule',
      'Understanding patterns',
      'Workplace planning',
      'ADHD management',
    ],
  },
];

/**
 * Combined method registry
 * All methods across all modules
 */
const allMethodsArray: Method[] = [
  ...stopSpiralingMethods,
  ...calmAnxietyMethods,
  ...processEmotionsMethods,
  ...betterSleepMethods,
  ...gainFocusMethods,
];

/**
 * Method lookup by module + method ID
 */
export const METHODS: Record<string, Method> = allMethodsArray.reduce(
  (acc, method) => {
    const key = `${method.moduleId}:${method.id}`;
    acc[key] = method;
    return acc;
  },
  {} as Record<string, Method>
);

/**
 * Helper Functions
 */

/**
 * Get all methods for a specific module
 */
export const getMethodsForModule = (moduleId: ModuleId): Method[] => {
  return allMethodsArray.filter((method) => method.moduleId === moduleId);
};

/**
 * Get a specific method
 */
export const getMethod = (moduleId: ModuleId, methodId: MethodId): Method | undefined => {
  const key = `${moduleId}:${methodId}`;
  return METHODS[key];
};

/**
 * Get recommended method for a module
 */
export const getRecommendedMethod = (moduleId: ModuleId): Method | undefined => {
  return allMethodsArray.find(
    (method) => method.moduleId === moduleId && method.isRecommended
  );
};

/**
 * Get free methods for a module
 */
export const getFreeMethods = (moduleId: ModuleId): Method[] => {
  return allMethodsArray.filter(
    (method) => method.moduleId === moduleId && !method.isPremium
  );
};

/**
 * Get premium methods for a module
 */
export const getPremiumMethods = (moduleId: ModuleId): Method[] => {
  return allMethodsArray.filter(
    (method) => method.moduleId === moduleId && method.isPremium
  );
};

/**
 * Get methods sorted by duration (fastest first)
 */
export const getMethodsByDuration = (moduleId: ModuleId): Method[] => {
  return getMethodsForModule(moduleId).sort((a, b) => a.durationMinutes - b.durationMinutes);
};

/**
 * Check if user has access to method
 */
export const hasMethodAccess = (
  moduleId: ModuleId,
  methodId: MethodId,
  isPremiumUser: boolean
): boolean => {
  const method = getMethod(moduleId, methodId);
  return !!method && (!method.isPremium || isPremiumUser);
};

/**
 * Get navigation params for method
 */
export const getMethodNavigationParams = (
  moduleId: ModuleId,
  methodId: MethodId
): { route: string; params: MethodNavigationParams } | null => {
  const method = getMethod(moduleId, methodId);
  if (!method) return null;

  return {
    route: method.route,
    params: method.params || { moduleId },
  };
};

/**
 * All method IDs as an array
 */
export const ALL_METHOD_IDS: readonly MethodId[] = [
  'talk-to-anna',
  'quick-exercise',
  'breathing-exercise',
  'progress-dashboard',
] as const;
