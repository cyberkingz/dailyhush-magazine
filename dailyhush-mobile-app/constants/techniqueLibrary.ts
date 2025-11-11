/**
 * DailyHush - Technique Library
 *
 * Rotating library of 3 spiral interrupt protocols for personalized anxiety relief.
 * Each technique targets different triggers and intensity levels.
 *
 * Target audience: Women 65+ with chronic rumination
 * Tone: Calm, validating, non-judgmental
 * Language: Simple, direct, no clinical jargon
 *
 * Design Philosophy (Rebalanced Nov 2025):
 * - Cyclic Sigh (physiological) for acute panic - Stanford-tested most effective
 * - Grounding (sensory-based) for general anxiety and overwhelm
 * - Cognitive Reframe for rumination and overthinking
 *
 * Gateway Protocol: 60-second sessions are the START of the protocol.
 * Research shows 5+ minutes is optimal, but 60 seconds provides immediate relief.
 * Users are prompted to continue after initial session.
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
 * processing, interrupting rumination loops. Most popular technique in DailyHush library.
 */
const GROUNDING_5_4_3_2_1: Technique = {
  id: 'grounding-5-4-3-2-1',
  name: 'Grounding 5-4-3-2-1',
  shortName: 'Grounding',
  description:
    "Use your five senses to reconnect with the present moment. CBT-approved sensory technique that interrupts rumination by engaging with your immediate environment.",
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
// TECHNIQUE 2: CYCLIC PHYSIOLOGICAL SIGH
// ============================================================================

/**
 * Stanford-tested rapid calm-down technique using double inhales and extended exhales.
 * Most effective breathing intervention for acute panic (2023 research).
 *
 * Evidence: Stanford neuroscientists tested 5 breathing techniques.
 * Cyclic Sigh reduced anxiety fastest by maximizing CO₂ offload.
 * Research shows 5 minutes is optimal, but 60 seconds provides immediate relief.
 *
 * Gateway Protocol: This 60-second version is the START of the protocol.
 * Users are prompted to continue after completion for full benefit.
 *
 * Mechanism: Two inhales fully expand lungs (including collapsed alveoli),
 * then long exhale dumps CO₂ and signals parasympathetic activation.
 */
const CYCLIC_SIGH: Technique = {
  id: 'cyclic-sigh',
  name: 'Cyclic Physiological Sigh',
  shortName: 'Cyclic Sigh',
  description:
    "Two quick inhales through your nose, then one long exhale through your mouth. Stanford research shows 5 minutes is optimal - we'll start with 60 seconds, you can continue as long as you need.",
  duration: 60, // seconds - gateway to longer session
  bestFor: ['panic', 'acute-stress', 'severe'],
  intensityRange: 'severe',
  requiresShift: false,

  steps: [
    // Introduction (8 seconds) - Gateway Protocol transparency
    {
      duration: 8,
      text: 'This is the most effective breathing technique.\n\nStanford-tested.\n\nResearch shows 5 minutes is optimal.\n\nWe will start with 60 seconds.',
    },

    // Instruction (10 seconds)
    {
      duration: 10,
      text: "Here's how it works:\n\nTwo quick inhales through your nose.\n\nThen one long exhale through your mouth.\n\nLet's begin.",
    },

    // Cycle 1 (12 seconds)
    {
      duration: 12,
      text: 'Breathe in through your nose.\n\nNow take one more quick inhale.\n\n...\n\nNow exhale slowly through your mouth.\n\nAll the way out.',
    },

    // Cycle 2 (12 seconds)
    {
      duration: 12,
      text: 'Again.\n\nDouble inhale through your nose.\n\nSniff... sniff.\n\n...\n\nLong exhale out your mouth.\n\nEmpty your lungs.',
    },

    // Cycle 3 (12 seconds)
    {
      duration: 12,
      text: "You're doing it.\n\nTwo inhales in.\n\nSniff... sniff.\n\n...\n\nOne long exhale out.\n\nFeel the release.",
    },

    // Closing with continuation prompt (6 seconds)
    {
      duration: 6,
      text: 'You just dumped CO₂ from your bloodstream.\n\nYour nervous system is calming.\n\nContinue longer for full effect.',
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
 * judgment, creating distance from rumination patterns. Expert consensus:
 * Perfect perceived value - users report feeling like they've done "real psychological work."
 */
const COGNITIVE_REFRAME: Technique = {
  id: 'cognitive-reframe',
  name: 'Cognitive Reframe',
  shortName: 'Reframe',
  description:
    "Examine the thought that's bothering you without judgment. CBT cognitive restructuring technique designed specifically for rumination and overthinking patterns.",
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
// REMOVED TECHNIQUES (Nov 2025 Rebalancing)
// ============================================================================
// - BODY_SCAN_RAPID: Removed per expert consensus (all 5 experts flagged as problematic)
// - SHIFT_BIOMETRIC_SYNC: Removed per business decision (app should be standalone)
// - BOX_BREATHING: Removed per 11-expert brainstorm consensus
//   * Reason: Cyclic Sigh is research-proven superior for acute anxiety
//   * Phase 2: May return in separate "Focus & Performance" section for non-crisis use

// ============================================================================
// TECHNIQUE LIBRARY EXPORT
// ============================================================================

/**
 * Complete technique library array (3 techniques).
 * Used by adaptive protocol selector to choose personalized interventions.
 *
 * Final rebalancing (Nov 2025):
 * - 33% breathing (Cyclic Sigh only - research-proven most effective)
 * - 33% sensory grounding (5-4-3-2-1)
 * - 33% cognitive (Reframe)
 *
 * Based on consensus from 11 experts (5 psychology + 6 marketing/copywriting).
 * Box Breathing removed - redundant with superior Cyclic Sigh technique.
 *
 * Gateway Protocol: All breathing techniques start at 60s with prompt to continue.
 * Research shows 5+ minutes optimal, but 60s provides immediate relief.
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
  CYCLIC_SIGH,
  GROUNDING_5_4_3_2_1,
  COGNITIVE_REFRAME,
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
  'cyclic-sigh': {
    icon: '🫁',
    color: colors.lime[600],
    badge: 'Most Effective',
    authorityNote: 'Stanford-tested 2023',
  },
  'grounding-5-4-3-2-1': {
    icon: '👁️',
    color: colors.emerald[600],
    badge: 'Most Popular',
    authorityNote: 'CBT-approved sensory grounding',
  },
  'cognitive-reframe': {
    icon: '🧠',
    color: colors.emerald[500],
    badge: 'For Overthinking',
    authorityNote: 'CBT cognitive restructuring',
  },
} as const;

/**
 * Get metadata for a technique
 */
export function getTechniqueMetadata(id: string) {
  return TECHNIQUE_METADATA[id as keyof typeof TECHNIQUE_METADATA];
}
