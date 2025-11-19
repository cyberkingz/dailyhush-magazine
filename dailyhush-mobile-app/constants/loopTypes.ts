/**
 * Nœma - Loop Type Constants
 *
 * Defines the 4 core overthinking loop types with their characteristics,
 * visual identities, and recommended interventions.
 *
 * These loop types are determined by the quiz and shape the user's
 * entire profile experience.
 */

export type LoopType = 'sleep-loop' | 'decision-loop' | 'social-loop' | 'perfectionism-loop';

// Icon names from lucide-react-native
export type LoopTypeIcon = 'Moon' | 'GitBranch' | 'MessageCircle' | 'Sparkles';

export interface LoopTypeConfig {
  type: LoopType;
  name: string;
  tagline: string;
  description: string;
  iconEmoji: string; // Kept for backwards compatibility
  iconName: LoopTypeIcon; // Lucide icon name
  gradient: readonly [string, string]; // [start, end] colors for LinearGradient
  accentColor: string; // Primary brand color for this loop
  characteristics: readonly string[];
  triggers: readonly string[];
  patterns: readonly string[];
  strengths: readonly string[];
  growthPath: readonly string[];
  recommendedActions: readonly {
    title: string;
    description: string;
    frequency: 'daily' | 'weekly' | 'as-needed';
  }[];
  relatedProducts: readonly string[]; // Product slugs
}

/**
 * Complete configuration for all 4 loop types.
 * Used throughout the app for loop-specific experiences.
 */
export const LOOP_TYPE_CONFIGS: Record<LoopType, LoopTypeConfig> = {
  'sleep-loop': {
    type: 'sleep-loop',
    name: 'Sleep Loop',
    tagline: 'Your mind finds its deepest wisdom in the quiet hours',
    description:
      'You experience overthinking most intensely at night, when the world goes quiet and your mind grows loud. Your thoughts replay conversations, plan tomorrow, and spiral through scenarios just when you need rest most.',
    iconEmoji: '🌙',
    iconName: 'Moon',
    gradient: ['#5B21B6', '#C4B5FD'], // Deep violet to soft lavender
    accentColor: '#7C3AED',
    characteristics: [
      'Mind races when trying to sleep',
      'Replay conversations from the day',
      'Plan and re-plan tomorrow',
      'Check the clock multiple times',
      'Wake up feeling mentally exhausted',
    ],
    triggers: [
      'Getting into bed',
      'Turning off the lights',
      'Quiet, unstructured time',
      'End-of-day reflection',
      "Tomorrow's uncertainties",
    ],
    patterns: [
      'Thoughts intensify as the day ends',
      'Seek control over the uncontrollable future',
      'Use phone/scrolling to distract from thoughts',
      'Feel tired but "wired"',
      'Morning clarity that fades by evening',
    ],
    strengths: [
      'Deeply reflective and introspective',
      'Notice subtle patterns others miss',
      'Care deeply about doing things right',
      'High emotional intelligence',
      'Thoughtful decision-maker',
    ],
    growthPath: [
      'Learn to recognize rumination vs. productive thinking',
      'Develop a consistent wind-down ritual',
      'Practice thought-observation without engagement',
      "Build trust in tomorrow's perspective",
      'Separate rest from problem-solving',
    ],
    recommendedActions: [
      {
        title: 'Bedtime Brain Dump',
        description: "Write down tomorrow's worries 30 minutes before bed to clear your mind",
        frequency: 'daily',
      },
      {
        title: 'Progressive Muscle Relaxation',
        description: 'Release physical tension that keeps your mind alert',
        frequency: 'daily',
      },
      {
        title: 'Morning Gratitude Check-In',
        description: 'Start the day with perspective to reduce evening anxiety',
        frequency: 'daily',
      },
    ],
    relatedProducts: ['sleep-loop-workbook', 'premium-membership'],
  },

  'decision-loop': {
    type: 'decision-loop',
    name: 'Decision Loop',
    tagline: 'You see every angle, every possibility, every outcome',
    description:
      'Your overthinking centers around choices. You analyze options endlessly, seeking the "perfect" decision while drowning in pros and cons. Even small choices feel weighted with consequences.',
    iconEmoji: '🔄',
    iconName: 'GitBranch',
    gradient: ['#D97706', '#FDE68A'], // Warm amber to soft gold
    accentColor: '#F59E0B',
    characteristics: [
      'Analyze decisions endlessly',
      'Create mental pros/cons lists',
      'Seek external validation before choosing',
      'Fear making the "wrong" choice',
      'Feel paralyzed by options',
    ],
    triggers: [
      'Multiple viable options',
      'High-stakes decisions',
      'Uncertainty about outcomes',
      "Others' opinions and advice",
      'Past mistakes replaying',
    ],
    patterns: [
      'Research exhaustively before deciding',
      'Ask multiple people for input',
      'Second-guess after making a choice',
      'Avoid decisions to avoid regret',
      'Feel relief then doubt your decision',
    ],
    strengths: [
      'Thorough and detail-oriented',
      'Consider multiple perspectives',
      'Careful risk assessment',
      'High standards for quality',
      'Learn deeply from experience',
    ],
    growthPath: [
      'Recognize when you have "enough" information',
      'Set decision deadlines to prevent paralysis',
      'Accept that most decisions are reversible',
      'Trust your intuition alongside analysis',
      'Practice small daily decisions without overthinking',
    ],
    recommendedActions: [
      {
        title: 'The 10-Minute Rule',
        description: 'Give yourself exactly 10 minutes to decide on low-stakes choices',
        frequency: 'as-needed',
      },
      {
        title: 'Decision Journal',
        description: 'Track decisions and outcomes to build trust in your judgment',
        frequency: 'weekly',
      },
      {
        title: 'Gut Check Practice',
        description: 'Notice your first instinct before the analysis begins',
        frequency: 'daily',
      },
    ],
    relatedProducts: ['decision-loop-clarity-bundle', 'premium-membership'],
  },

  'social-loop': {
    type: 'social-loop',
    name: 'Social Loop',
    tagline: 'You feel every nuance, every shift, every unspoken word',
    description:
      "Your overthinking focuses on relationships and social interactions. You replay conversations, analyze how you came across, and worry about others' perceptions. Social situations drain you not from interaction, but from the mental aftermath.",
    iconEmoji: '💭',
    iconName: 'MessageCircle',
    gradient: ['#F97316', '#FED7AA'], // Vibrant coral to warm peach
    accentColor: '#FB923C',
    characteristics: [
      'Replay social interactions constantly',
      'Analyze what you said and how you said it',
      "Worry about others' perceptions",
      'Feel drained after social events',
      'Seek reassurance about how you came across',
    ],
    triggers: [
      'Awkward silences or moments',
      'Disagreements or tension',
      'Meeting new people',
      'Group settings and dynamics',
      'Ambiguous social cues',
    ],
    patterns: [
      'Mental post-mortem after interactions',
      'Interpret neutral reactions as negative',
      'Rehearse conversations before they happen',
      'Avoid social situations to avoid anxiety',
      'Feel better when alone, then lonely',
    ],
    strengths: [
      'Highly empathetic and attuned',
      'Notice emotional subtleties',
      'Care deeply about relationships',
      'Thoughtful communicator',
      'Strong emotional awareness',
    ],
    growthPath: [
      "Learn that most people aren't analyzing you",
      'Practice self-compassion for "imperfect" moments',
      'Trust that relationships survive awkwardness',
      'Develop post-social recovery rituals',
      "Separate your worth from others' opinions",
    ],
    recommendedActions: [
      {
        title: 'Social Reframe Exercise',
        description: 'Challenge negative interpretations of social moments',
        frequency: 'as-needed',
      },
      {
        title: 'Compassion Break',
        description: 'Treat yourself like a friend after social interactions',
        frequency: 'as-needed',
      },
      {
        title: 'Connection Check-In',
        description: 'Notice moments of genuine connection, not just awkwardness',
        frequency: 'weekly',
      },
    ],
    relatedProducts: ['social-loop-confidence-course', 'premium-membership'],
  },

  'perfectionism-loop': {
    type: 'perfectionism-loop',
    name: 'Perfectionism Loop',
    tagline: 'You hold yourself to impossible standards, then punish yourself for being human',
    description:
      "Your overthinking is driven by perfectionism. You focus on what wasn't perfect, replay mistakes endlessly, and struggle to celebrate achievements because you only see what could've been better.",
    iconEmoji: '✨',
    iconName: 'Sparkles',
    gradient: ['#10B981', '#D1FAE5'], // Emerald green to soft mint
    accentColor: '#6EE7B7',
    characteristics: [
      'Focus on flaws over successes',
      "Can't celebrate achievements fully",
      'Harsh self-criticism for mistakes',
      'Rewrite messages multiple times',
      'Feel like you\'re never "good enough"',
    ],
    triggers: [
      'Any perceived mistake or flaw',
      "Comparison to others' work",
      'Receiving constructive feedback',
      'Projects that "should" be flawless',
      'Your own high standards',
    ],
    patterns: [
      'Set unrealistic expectations',
      'Procrastinate to avoid imperfect work',
      'Overwork to reach impossible standards',
      'Dismiss compliments and praise',
      'Feel relief then immediately find flaws',
    ],
    strengths: [
      'High attention to quality',
      'Strong work ethic and dedication',
      'Notice details others miss',
      'Drive for excellence and growth',
      'Care deeply about impact',
    ],
    growthPath: [
      'Recognize "good enough" as valuable',
      'Practice self-compassion over self-criticism',
      'Celebrate progress, not just perfection',
      'Set realistic, human standards',
      'Learn that mistakes are data, not failures',
    ],
    recommendedActions: [
      {
        title: 'Done is Better Than Perfect',
        description: 'Complete one "good enough" task without revision today',
        frequency: 'daily',
      },
      {
        title: 'Failure Resume',
        description: 'Document lessons learned from imperfect moments',
        frequency: 'weekly',
      },
      {
        title: 'Self-Compassion Break',
        description: 'Respond to mistakes with kindness, not criticism',
        frequency: 'as-needed',
      },
    ],
    relatedProducts: ['perfectionism-loop-journal', 'premium-membership'],
  },
};

/**
 * Helper function to get loop type configuration
 */
export const getLoopTypeConfig = (loopType: LoopType): LoopTypeConfig => {
  return LOOP_TYPE_CONFIGS[loopType];
};

/**
 * Helper function to get loop type name for display
 */
export const getLoopTypeName = (loopType: LoopType): string => {
  return LOOP_TYPE_CONFIGS[loopType].name;
};

/**
 * Helper function to get loop type emoji icon
 */
export const getLoopTypeEmoji = (loopType: LoopType): string => {
  return LOOP_TYPE_CONFIGS[loopType].iconEmoji;
};

/**
 * Helper function to get loop type gradient colors
 */
export const getLoopTypeGradient = (loopType: LoopType): readonly [string, string] => {
  return LOOP_TYPE_CONFIGS[loopType].gradient;
};

/**
 * All loop types as an array (useful for iteration)
 */
export const ALL_LOOP_TYPES: readonly LoopType[] = [
  'sleep-loop',
  'decision-loop',
  'social-loop',
  'perfectionism-loop',
] as const;

/**
 * Map quiz trigger question to loop type (used in quiz result calculation)
 */
export const TRIGGER_TO_LOOP_TYPE: Record<string, LoopType> = {
  q0_a: 'perfectionism-loop', // "Something I said or did 'wrong'"
  q0_b: 'decision-loop', // "A decision I'm unsure about"
  q0_c: 'social-loop', // "Worrying how someone saw me"
  q0_d: 'sleep-loop', // "It just starts for no reason"
};

/**
 * Map final question (emotional bridge) to loop type
 */
export const BRIDGE_TO_LOOP_TYPE: Record<string, LoopType> = {
  q20_a: 'perfectionism-loop', // "The part that replays mistakes"
  q20_b: 'decision-loop', // "The part that needs control"
  q20_c: 'social-loop', // "The part that worries what others think"
  q20_d: 'sleep-loop', // "The part that won't stop at night"
};
