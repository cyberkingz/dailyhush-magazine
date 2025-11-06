/**
 * DailyHush - Technique Library
 *
 * Rotating library of 5 spiral interrupt protocols for personalized anxiety relief.
 * Each technique targets different triggers and intensity levels.
 *
 * Target audience: Women 65+ with chronic rumination
 * Tone: Calm, validating, non-judgmental
 * Language: Simple, direct, no clinical jargon
 *
 * Design Philosophy:
 * - Grounding (sensory-based) for general anxiety
 * - Box Breathing (tactical) for acute panic
 * - Cognitive Reframe for rumination and overthinking
 * - Body Scan for physical tension and health anxiety
 * - Shift Sync (biometric) for severe episodes with device
 *
 * @see types/index.ts for Technique and TechniqueStep interfaces
 */

import type { Technique } from '@/types';
import { ANIMATIONS } from '@/constants/design-tokens';
import { colors } from '@/constants/colors';

// ============================================================================
// TECHNIQUE 1: GROUNDING 5-4-3-2-1
// ============================================================================

/**
 * Enhanced grounding technique using all five senses.
 * Most versatile protocol - works for general anxiety, overwhelm, and mild-to-moderate spirals.
 *
 * Evidence: CBT-approved sensory grounding technique. Forces immediate environment
 * processing, interrupting rumination loops.
 */
const GROUNDING_5_4_3_2_1: Technique = {
  id: 'grounding-5-4-3-2-1',
  name: 'Grounding 5-4-3-2-1',
  shortName: 'Grounding',
  description:
    "Use your five senses to reconnect with the present moment. Notice what's around you right now.",
  duration: 90, // seconds
  bestFor: ['anxiety', 'overwhelm', 'general'],
  intensityRange: 'moderate',
  requiresShift: false,

  steps: [
    // Introduction (10 seconds)
    {
      duration: 10,
      text: "Let's gently bring you back to right now.\n\nYou're going to notice things around you.\n\nThere's no rush.",
    },

    // Step 1: See (20 seconds)
    {
      duration: 20,
      text: 'Look around you.\n\nName 5 things you can see.\n\nBe specific.\n\nLike "blue mug" or "wall clock."',
      interactive: {
        type: 'list',
        prompt: '5 things you can see',
        placeholder:
          'Example: blue coffee mug with a chip\nExample: wall clock showing 3:15\nExample: green plant on windowsill',
        maxLength: 200,
      },
    },

    // Step 2: Touch (15 seconds)
    {
      duration: 15,
      text: 'Now feel your surroundings.\n\nName 4 things you can touch.\n\nMaybe the chair beneath you.\n\nOr your soft sweater.',
      interactive: {
        type: 'list',
        prompt: '4 things you can touch',
        placeholder:
          'Example: smooth wood armrest\nExample: soft cotton of my shirt\nExample: cool metal of my phone',
        maxLength: 200,
      },
    },

    // Step 3: Hear (15 seconds)
    {
      duration: 15,
      text: 'Listen quietly.\n\nName 3 things you can hear.\n\nMaybe distant traffic.\n\nOr the hum of the fridge.',
      interactive: {
        type: 'list',
        prompt: '3 things you can hear',
        placeholder:
          "Example: birds chirping outside\nExample: gentle hum of air conditioner\nExample: neighbor's muffled TV",
        maxLength: 200,
      },
    },

    // Step 4: Smell (10 seconds)
    {
      duration: 10,
      text: "Take a gentle breath.\n\nName 2 things you can smell.\n\nOr notice that you smell nothing at all.\n\nThat's okay too.",
    },

    // Step 5: Taste (10 seconds)
    {
      duration: 10,
      text: 'Finally, notice taste.\n\nName 1 thing you can taste.\n\nMaybe your morning coffee.\n\nOr just the taste of your mouth.',
    },

    // Closing (10 seconds)
    {
      duration: 10,
      text: "You're here.\n\nRight here, right now.\n\nYou pulled yourself back to this moment.\n\nThat took courage.",
    },
  ],
};

// ============================================================================
// TECHNIQUE 2: BOX BREATHING
// ============================================================================

/**
 * Navy SEAL tactical breathing for acute panic and severe anxiety.
 * Fast intervention (60 seconds). No interactive steps - too intense for typing.
 *
 * Evidence: 4-4-4-4 pattern activates parasympathetic nervous system.
 * Used by military for high-stress situations.
 */
const BOX_BREATHING: Technique = {
  id: 'box-breathing',
  name: 'Box Breathing',
  shortName: 'Box Breath',
  description:
    'A powerful 4-count breathing pattern. Used by Navy SEALs to stay calm under pressure.',
  duration: 60, // seconds - rapid intervention
  bestFor: ['panic', 'acute-stress', 'health-concerns'],
  intensityRange: 'severe',
  requiresShift: false,

  steps: [
    // Introduction (8 seconds)
    {
      duration: 8,
      text: 'This is a tactical breathing technique.\n\nIt works fast.\n\nJust follow the counts.',
    },

    // Cycle 1 (16 seconds)
    {
      duration: 16,
      text: 'Breathe in through your nose.\n\n1... 2... 3... 4...\n\nHold.\n\n1... 2... 3... 4...\n\nBreathe out through your mouth.\n\n1... 2... 3... 4...\n\nHold empty.\n\n1... 2... 3... 4...',
    },

    // Cycle 2 (16 seconds)
    {
      duration: 16,
      text: 'Again.\n\nIn: 1... 2... 3... 4...\n\nHold: 1... 2... 3... 4...\n\nOut: 1... 2... 3... 4...\n\nHold: 1... 2... 3... 4...',
    },

    // Cycle 3 (16 seconds)
    {
      duration: 16,
      text: 'One more.\n\nIn: 1... 2... 3... 4...\n\nHold: 1... 2... 3... 4...\n\nOut: 1... 2... 3... 4...\n\nHold: 1... 2... 3... 4...',
    },

    // Closing (4 seconds)
    {
      duration: 4,
      text: "You just calmed your nervous system.\n\nYou're in control.",
    },
  ],
};

// ============================================================================
// TECHNIQUE 3: COGNITIVE REFRAME
// ============================================================================

/**
 * Thought-focused intervention for rumination and overthinking.
 * Longer duration (120 seconds) - requires cognitive engagement.
 *
 * Evidence: CBT-based cognitive restructuring. Examines thoughts without
 * judgment, creating distance from rumination patterns.
 */
const COGNITIVE_REFRAME: Technique = {
  id: 'cognitive-reframe',
  name: 'Cognitive Reframe',
  shortName: 'Reframe',
  description:
    "Examine the thought that's bothering you. Look at it differently, without judgment.",
  duration: 120, // seconds - longer, thought-focused
  bestFor: ['conversations', 'rumination', 'work-stress', 'relationships'],
  intensityRange: 'mild',
  requiresShift: false,

  steps: [
    // Introduction (15 seconds)
    {
      duration: 15,
      text: "Let's look at what's bothering you.\n\nNot to judge it.\n\nJust to see it more clearly.",
    },

    // Step 1: Identify the thought (25 seconds)
    {
      duration: 25,
      text: "What's the main thought spinning in your mind?\n\nWrite it down exactly as you hear it.\n\nNo editing.",
      interactive: {
        type: 'text',
        prompt: "The thought that's bothering me",
        placeholder: 'Example: I should have said something different in that conversation',
        maxLength: 200,
      },
    },

    // Step 2: Reality check (20 seconds)
    {
      duration: 20,
      text: 'Now, a gentle question:\n\nIs this thought about something happening right now?\n\nOr something that already happened?\n\nOr something that might happen?',
      interactive: {
        type: 'text',
        prompt: 'This thought is about...',
        placeholder: 'Example: Something that already happened yesterday',
        maxLength: 200,
      },
    },

    // Step 3: Control assessment (20 seconds)
    {
      duration: 20,
      text: "One more question:\n\nWhat part of this situation can you actually control right now?\n\nEven if it's very small.",
      interactive: {
        type: 'text',
        prompt: 'What I can control',
        placeholder: 'Example: I can send a kind text message later',
        maxLength: 200,
      },
    },

    // Step 4: Alternative view (20 seconds)
    {
      duration: 20,
      text: 'If your best friend had this exact thought...\n\nWhat would you say to them?\n\nWhat kinder perspective might you offer?',
    },

    // Closing (20 seconds)
    {
      duration: 20,
      text: "You just did something powerful.\n\nYou looked at your thought without drowning in it.\n\nThat's the beginning of letting it go.",
    },
  ],
};

// ============================================================================
// TECHNIQUE 4: RAPID BODY SCAN
// ============================================================================

/**
 * Quick body awareness for physical tension and health anxiety.
 * Focuses on releasing tension systematically.
 *
 * Evidence: Mindfulness-based body scan reduces somatic anxiety symptoms.
 * Particularly effective for health-related rumination.
 */
const BODY_SCAN_RAPID: Technique = {
  id: 'body-scan-rapid',
  name: 'Rapid Body Scan',
  shortName: 'Body Scan',
  description: 'Notice tension in your body, then gently release it. From feet to head.',
  duration: 75, // seconds
  bestFor: ['physical-tension', 'health-concerns', 'anxiety'],
  intensityRange: 'moderate',
  requiresShift: false,

  steps: [
    // Introduction (10 seconds)
    {
      duration: 10,
      text: "Let's check in with your body.\n\nNotice where you're holding tension.\n\nNo judgment. Just awareness.",
    },

    // Feet and legs (15 seconds)
    {
      duration: 15,
      text: 'Start with your feet.\n\nNotice your toes. Your ankles. Your legs.\n\nAre they tense?\n\nGently wiggle your toes. Soften your feet.',
    },

    // Belly and chest (15 seconds)
    {
      duration: 15,
      text: 'Move to your belly.\n\nIs it tight? Holding?\n\nTake a slow breath into your belly.\n\nLet it soften and expand.',
    },

    // Shoulders and neck (15 seconds)
    {
      duration: 15,
      text: 'Notice your shoulders.\n\nAre they up by your ears?\n\nGently roll them back and down.\n\nLet your neck lengthen.',
    },

    // Jaw and face (10 seconds)
    {
      duration: 10,
      text: 'Check your jaw.\n\nUnclench your teeth.\n\nRelax your tongue.\n\nSoften the space between your eyebrows.',
    },

    // Closing (10 seconds)
    {
      duration: 10,
      text: "Your body was holding your worry.\n\nNow it's letting go.\n\nNotice how different you feel.",
    },
  ],
};

// ============================================================================
// TECHNIQUE 5: SHIFT BIOMETRIC SYNC
// ============================================================================

/**
 * Advanced protocol for Shift necklace users.
 * Syncs breathing with device vibrations for severe anxiety episodes.
 *
 * Evidence: Biometric feedback + breathing creates faster parasympathetic
 * activation than breathing alone.
 */
const SHIFT_BIOMETRIC_SYNC: Technique = {
  id: 'shift-biometric-sync',
  name: 'Shift Biometric Sync',
  shortName: 'Shift Sync',
  description:
    'Let your Shift necklace guide your breathing. Sync with the vibrations for maximum calm.',
  duration: 90, // seconds
  bestFor: ['severe', 'panic', 'acute-stress'],
  intensityRange: 'severe',
  requiresShift: true, // Only available to necklace users

  steps: [
    // Introduction (12 seconds)
    {
      duration: 12,
      text: 'Your Shift necklace is ready.\n\nIt will guide your breathing with gentle vibrations.\n\nJust follow along.',
    },

    // Sync preparation (10 seconds)
    {
      duration: 10,
      text: 'Hold your Shift gently.\n\nFeel its weight in your hand.\n\nOr rest it against your chest.',
    },

    // Synced breathing - Cycle 1 (20 seconds)
    {
      duration: 20,
      text: 'The vibration starts...\n\nBreathe in as it pulses.\n\n...\n\nBreathe out as it fades.\n\nLet the necklace set the rhythm.',
    },

    // Synced breathing - Cycle 2 (20 seconds)
    {
      duration: 20,
      text: 'Keep following.\n\nIn with the pulse.\n\nOut with the fade.\n\nYour breath and the device are one.',
    },

    // Synced breathing - Cycle 3 (20 seconds)
    {
      duration: 20,
      text: "You're in sync now.\n\nIn... and out...\n\nYour nervous system is calming.\n\nYou can feel it.",
    },

    // Closing (8 seconds)
    {
      duration: 8,
      text: "Your Shift guided you back to calm.\n\nYou worked together.\n\nYou're safe.",
    },
  ],
};

// ============================================================================
// TECHNIQUE LIBRARY EXPORT
// ============================================================================

/**
 * Complete technique library array.
 * Used by adaptive protocol selector to choose personalized interventions.
 *
 * Rotation strategy:
 * 1. Filter by intensity match
 * 2. Filter by trigger match (bestFor)
 * 3. Prioritize techniques with higher success rates (from user stats)
 * 4. Rotate to prevent habituation
 *
 * @see app/(authenticated)/spiral/hooks/useAdaptiveProtocol.ts for selection logic
 */
export const TECHNIQUE_LIBRARY: readonly Technique[] = [
  GROUNDING_5_4_3_2_1,
  BOX_BREATHING,
  COGNITIVE_REFRAME,
  BODY_SCAN_RAPID,
  SHIFT_BIOMETRIC_SYNC,
] as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get technique by ID
 */
export function getTechniqueById(id: string): Technique | undefined {
  return TECHNIQUE_LIBRARY.find((technique) => technique.id === id);
}

/**
 * Get techniques by intensity range
 */
export function getTechniquesByIntensity(intensity: 'severe' | 'moderate' | 'mild'): Technique[] {
  return TECHNIQUE_LIBRARY.filter(
    (technique) => technique.intensityRange === intensity || technique.intensityRange === 'any'
  );
}

/**
 * Get techniques that match a specific trigger
 */
export function getTechniquesByTrigger(trigger: string): Technique[] {
  return TECHNIQUE_LIBRARY.filter((technique) => technique.bestFor.includes(trigger));
}

/**
 * Get techniques available to user (filters by Shift ownership)
 */
export function getAvailableTechniques(hasShift: boolean): Technique[] {
  if (hasShift) {
    return [...TECHNIQUE_LIBRARY];
  }

  // Filter out Shift-only techniques
  return TECHNIQUE_LIBRARY.filter((technique) => !technique.requiresShift);
}

/**
 * Get all technique IDs (useful for analytics and stats queries)
 */
export function getAllTechniqueIds(): string[] {
  return TECHNIQUE_LIBRARY.map((technique) => technique.id);
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type TechniqueId = (typeof TECHNIQUE_LIBRARY)[number]['id'];
export type IntensityRange = 'severe' | 'moderate' | 'mild' | 'any';
export type TriggerCategory = string; // Flexible - can expand as needed

// ============================================================================
// METADATA
// ============================================================================

/**
 * Technique metadata for UI display
 * Maps technique IDs to display properties
 */
export const TECHNIQUE_METADATA = {
  'grounding-5-4-3-2-1': {
    icon: '👁️',
    color: colors.emerald[600],
    badge: 'Most Popular',
    authorityNote: 'CBT-approved sensory grounding',
  },
  'box-breathing': {
    icon: '🔲',
    color: colors.lime[500],
    badge: 'Fast Acting',
    authorityNote: 'Navy SEAL technique',
  },
  'cognitive-reframe': {
    icon: '🧠',
    color: colors.emerald[500],
    badge: 'For Overthinking',
    authorityNote: 'CBT cognitive restructuring',
  },
  'body-scan-rapid': {
    icon: '🌊',
    color: colors.emerald[400],
    badge: 'For Physical Tension',
    authorityNote: 'Mindfulness-based body awareness',
  },
  'shift-biometric-sync': {
    icon: '💎',
    color: colors.lime[600],
    badge: 'Premium',
    authorityNote: 'Biometric feedback enhanced',
  },
} as const;

/**
 * Get metadata for a technique
 */
export function getTechniqueMetadata(id: string) {
  return TECHNIQUE_METADATA[id as keyof typeof TECHNIQUE_METADATA];
}
