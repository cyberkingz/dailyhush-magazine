/**
 * Nœma - Therapeutic Suggestion Templates
 *
 * Pre-defined gentle activity suggestions for Step 4 of mood capture flow.
 * Each suggestion is tailored to specific moods and intensity levels.
 *
 * Designed with compassionate, supportive language for women 55-70.
 *
 * @see MOOD_CAPTURE_ROADMAP.md
 */

import type { Enums } from '@/types/supabase';
import type { IntensityValue } from './moodOptions';

// ============================================================================
// SUGGESTION TYPES
// ============================================================================

export type SuggestionCategory =
  | 'movement'
  | 'breathing'
  | 'reflection'
  | 'creative'
  | 'connection'
  | 'self-compassion'
  | 'grounding';

export interface SuggestionTemplate {
  id: string;
  /** Display title */
  title: string;
  /** Why this activity helps (1-2 sentences) */
  description: string;
  /** Step-by-step instructions (3-5 bullet points) */
  steps: readonly string[];
  /** Estimated time to complete */
  duration: string;
  /** Icon name from Lucide */
  icon: string;
  /** Category for grouping */
  category: SuggestionCategory;
  /** Which moods this suggestion is best for */
  relevantMoods: readonly Enums<'mood_type'>[];
  /** Intensity range this works for (1-5) */
  intensityRange: readonly [IntensityValue, IntensityValue];
}

// ============================================================================
// SUGGESTION TEMPLATES
// ============================================================================

/**
 * All available therapeutic suggestions
 * Organized by primary mood and category
 */
export const SUGGESTION_TEMPLATES: readonly SuggestionTemplate[] = [
  // ========================================================================
  // CALM MOOD SUGGESTIONS
  // ========================================================================
  {
    id: 'reflection-time',
    title: 'Quiet Reflection',
    description:
      'When we feel calm, it\'s a perfect time to reflect on what\'s working well in our lives and appreciate the present moment.',
    steps: [
      'Find a comfortable, quiet spot',
      'Close your eyes and take three deep breaths',
      'Think of one thing that brought you joy recently',
      'Notice how that memory makes you feel',
      'Sit with that feeling for a few moments',
    ],
    duration: '5-10 minutes',
    icon: 'sparkles',
    category: 'reflection',
    relevantMoods: ['calm'],
    intensityRange: [1, 5],
  },
  {
    id: 'gratitude-walk',
    title: 'Gratitude Walk',
    description:
      'A gentle walk paired with gratitude can deepen feelings of contentment and connection to the world around us.',
    steps: [
      'Step outside for a slow, mindful walk',
      'As you walk, notice three things you\'re grateful for',
      'They can be big or small - a warm breeze, a kind neighbor, your health',
      'Take your time and walk at whatever pace feels right',
    ],
    duration: '10-15 minutes',
    icon: 'footprints',
    category: 'movement',
    relevantMoods: ['calm'],
    intensityRange: [1, 3],
  },
  {
    id: 'creative-moment',
    title: 'Creative Expression',
    description:
      'Calm moments are perfect for creativity. Let yourself explore without judgment or expectation.',
    steps: [
      'Choose a simple creative activity: drawing, coloring, writing, or arranging flowers',
      'Set aside 15 minutes with no specific goal',
      'Focus on the process, not the outcome',
      'Notice how the activity makes you feel',
    ],
    duration: '15-20 minutes',
    icon: 'palette',
    category: 'creative',
    relevantMoods: ['calm'],
    intensityRange: [1, 4],
  },

  // ========================================================================
  // ANXIOUS MOOD SUGGESTIONS
  // ========================================================================
  {
    id: 'gentle-walk',
    title: 'Gentle Walk',
    description:
      'When we feel anxious, gentle movement can help quiet the mind and ground us in the present moment.',
    steps: [
      'Find a quiet place to walk for 10-15 minutes',
      'No destination needed - just move at your own pace',
      'Notice 5 things you can see around you',
      'Feel your feet connecting with the ground',
      'Take slow, steady breaths as you walk',
    ],
    duration: '10-15 minutes',
    icon: 'footprints',
    category: 'movement',
    relevantMoods: ['anxious'],
    intensityRange: [3, 5],
  },
  {
    id: 'breathing-exercise',
    title: 'Deep Breathing Practice',
    description:
      'Focused breathing activates your body\'s natural calming response, helping ease anxious feelings.',
    steps: [
      'Find a comfortable seated position',
      'Place one hand on your heart, one on your belly',
      'Breathe in slowly through your nose for 4 counts',
      'Hold gently for 4 counts',
      'Breathe out slowly through your mouth for 6 counts',
      'Repeat 5-10 times, or until you feel more settled',
    ],
    duration: '5-7 minutes',
    icon: 'wind',
    category: 'breathing',
    relevantMoods: ['anxious'],
    intensityRange: [2, 5],
  },
  {
    id: 'grounding-5-4-3-2-1',
    title: 'Grounding: 5-4-3-2-1',
    description:
      'This grounding technique helps bring your attention back to the present moment, away from anxious thoughts.',
    steps: [
      'Name 5 things you can see',
      'Name 4 things you can touch',
      'Name 3 things you can hear',
      'Name 2 things you can smell',
      'Name 1 thing you can taste',
      'Notice how you feel after this exercise',
    ],
    duration: '3-5 minutes',
    icon: 'anchor',
    category: 'grounding',
    relevantMoods: ['anxious'],
    intensityRange: [3, 5],
  },
  {
    id: 'progressive-muscle',
    title: 'Progressive Relaxation',
    description:
      'Releasing physical tension can help ease mental anxiety. This technique systematically relaxes your whole body.',
    steps: [
      'Lie down or sit comfortably',
      'Starting with your toes, tense muscles for 5 seconds',
      'Release and notice the relaxation',
      'Move up through your body: legs, stomach, arms, shoulders, face',
      'End by taking three deep breaths',
    ],
    duration: '8-10 minutes',
    icon: 'zap-off',
    category: 'breathing',
    relevantMoods: ['anxious'],
    intensityRange: [2, 4],
  },

  // ========================================================================
  // SAD MOOD SUGGESTIONS
  // ========================================================================
  {
    id: 'gratitude-practice',
    title: 'Three Good Things',
    description:
      'Reflecting on positive moments can help lift our mood and remind us of life\'s small joys, even on difficult days.',
    steps: [
      'Think of three good things from today',
      'They can be big or small moments',
      'For each one, pause and remember how it made you feel',
      'Write them down if you\'d like',
      'End by placing your hand on your heart and taking a deep breath',
    ],
    duration: '5-8 minutes',
    icon: 'heart',
    category: 'reflection',
    relevantMoods: ['sad'],
    intensityRange: [1, 4],
  },
  {
    id: 'comfort-activity',
    title: 'Gentle Self-Care',
    description:
      'When we\'re feeling down, small acts of self-care can help us feel nurtured and cared for.',
    steps: [
      'Choose something that brings you comfort: a warm drink, soft music, a cozy blanket',
      'Give yourself permission to rest',
      'Notice what your body needs right now',
      'Remember: taking care of yourself is not selfish',
    ],
    duration: '15-30 minutes',
    icon: 'coffee',
    category: 'self-compassion',
    relevantMoods: ['sad'],
    intensityRange: [2, 5],
  },
  {
    id: 'reach-out',
    title: 'Gentle Connection',
    description:
      'Sometimes when we feel sad, reaching out to someone we trust - even briefly - can help us feel less alone.',
    steps: [
      'Think of someone who makes you feel safe and cared for',
      'Send a brief message or give them a call',
      'You don\'t have to explain everything - just say hello',
      'If you\'re not ready to reach out, that\'s okay too',
    ],
    duration: '5-15 minutes',
    icon: 'message-circle',
    category: 'connection',
    relevantMoods: ['sad'],
    intensityRange: [2, 5],
  },
  {
    id: 'nature-connection',
    title: 'Step Outside',
    description:
      'Fresh air and natural light can help lift our spirits, even if just for a few minutes.',
    steps: [
      'Step outside, even if just to your porch or balcony',
      'Stand or sit for a few minutes',
      'Feel the air on your skin',
      'Notice the sky, trees, or any nature around you',
      'Take three slow, deep breaths before going back inside',
    ],
    duration: '5-10 minutes',
    icon: 'sun',
    category: 'movement',
    relevantMoods: ['sad'],
    intensityRange: [1, 4],
  },

  // ========================================================================
  // FRUSTRATED MOOD SUGGESTIONS
  // ========================================================================
  {
    id: 'physical-release',
    title: 'Safe Movement',
    description:
      'When we\'re frustrated, our bodies hold tension. Safe, intentional movement can help release that energy.',
    steps: [
      'Find a private space where you feel comfortable',
      'Try these gentle releases: stretch your arms wide, roll your shoulders, squeeze and release your fists',
      'Move at your own pace for 5-10 minutes',
      'Notice the tension leaving your body',
    ],
    duration: '5-10 minutes',
    icon: 'move',
    category: 'movement',
    relevantMoods: ['frustrated'],
    intensityRange: [3, 5],
  },
  {
    id: 'journaling-release',
    title: 'Stream of Consciousness',
    description:
      'Sometimes frustration needs an outlet. Writing freely without editing can help release pent-up feelings.',
    steps: [
      'Get paper and pen (or open a notes app)',
      'Set a timer for 5 minutes',
      'Write whatever comes to mind without stopping',
      'Don\'t worry about grammar or making sense',
      'When done, you can keep it or tear it up - your choice',
    ],
    duration: '5-10 minutes',
    icon: 'pen-line',
    category: 'reflection',
    relevantMoods: ['frustrated'],
    intensityRange: [2, 5],
  },
  {
    id: 'change-environment',
    title: 'Change Your Space',
    description:
      'When frustration builds, changing your environment - even slightly - can shift your emotional state.',
    steps: [
      'If you\'re inside, step outside for a few minutes',
      'If you\'re sitting, stand and stretch',
      'Open a window for fresh air',
      'Move to a different room',
      'Notice how the change affects your mood',
    ],
    duration: '2-5 minutes',
    icon: 'door-open',
    category: 'movement',
    relevantMoods: ['frustrated'],
    intensityRange: [2, 5],
  },
  {
    id: 'cold-water-reset',
    title: 'Cool Water Reset',
    description:
      'Cold water on your face or hands can help reset your nervous system and provide relief from intense frustration.',
    steps: [
      'Go to a sink or bathroom',
      'Splash cool (not ice cold) water on your face',
      'Or hold your hands under cool running water for 30 seconds',
      'Pat dry and take three slow breaths',
      'Notice if you feel any shift',
    ],
    duration: '2-3 minutes',
    icon: 'droplets',
    category: 'grounding',
    relevantMoods: ['frustrated'],
    intensityRange: [3, 5],
  },

  // ========================================================================
  // MIXED FEELINGS SUGGESTIONS
  // ========================================================================
  {
    id: 'sorting-emotions',
    title: 'Name Your Feelings',
    description:
      'When emotions feel mixed, naming each one can help bring clarity and reduce overwhelm.',
    steps: [
      'Find a quiet moment and get comfortable',
      'List each emotion you\'re feeling (e.g., "I feel worried and also hopeful")',
      'For each emotion, notice where you feel it in your body',
      'Remember: feeling multiple emotions at once is completely natural',
      'Be gentle with yourself',
    ],
    duration: '5-8 minutes',
    icon: 'list-checks',
    category: 'reflection',
    relevantMoods: ['mixed'],
    intensityRange: [2, 5],
  },
  {
    id: 'both-and',
    title: 'The "Both-And" Practice',
    description:
      'Mixed feelings often involve opposites. This practice helps you hold space for complexity without needing to resolve it.',
    steps: [
      'Complete these sentences: "I feel ___ and I also feel ___"',
      'Example: "I feel scared and I also feel hopeful"',
      'Notice that both can be true at the same time',
      'You don\'t have to choose one over the other',
    ],
    duration: '3-5 minutes',
    icon: 'split',
    category: 'self-compassion',
    relevantMoods: ['mixed'],
    intensityRange: [1, 4],
  },
  {
    id: 'talk-it-out',
    title: 'Voice It Out',
    description:
      'Sometimes saying our mixed feelings out loud (even to ourselves) can help untangle them.',
    steps: [
      'Find a private space where you won\'t be interrupted',
      'Speak out loud: "Right now, I\'m feeling..."',
      'Name each emotion without judging it',
      'You can talk to yourself, a pet, or even record yourself',
      'Notice if speaking helps bring clarity',
    ],
    duration: '5-10 minutes',
    icon: 'mic',
    category: 'reflection',
    relevantMoods: ['mixed'],
    intensityRange: [2, 5],
  },

  // ========================================================================
  // UNIVERSAL SUGGESTIONS (work for any mood)
  // ========================================================================
  {
    id: 'hand-on-heart',
    title: 'Hand on Heart',
    description:
      'This simple self-compassion practice works for any emotional state. Physical touch can activate our soothing system.',
    steps: [
      'Place your hand over your heart',
      'Feel the warmth of your hand',
      'Take three slow, deep breaths',
      'Say to yourself: "This is a moment of difficulty. May I be kind to myself."',
      'Sit with this for as long as you need',
    ],
    duration: '2-5 minutes',
    icon: 'heart-handshake',
    category: 'self-compassion',
    relevantMoods: ['calm', 'anxious', 'sad', 'frustrated', 'mixed'],
    intensityRange: [1, 5],
  },
  {
    id: 'tea-ritual',
    title: 'Mindful Tea/Water',
    description:
      'The simple ritual of preparing and savoring a warm drink can be deeply soothing for any emotional state.',
    steps: [
      'Prepare a warm drink (tea, warm water with lemon, whatever sounds good)',
      'As you wait for it to brew/warm, take three deep breaths',
      'Hold the cup in both hands and feel the warmth',
      'Sip slowly, noticing the taste and temperature',
      'Give yourself this small moment of care',
    ],
    duration: '5-10 minutes',
    icon: 'coffee',
    category: 'self-compassion',
    relevantMoods: ['calm', 'anxious', 'sad', 'frustrated', 'mixed'],
    intensityRange: [1, 5],
  },
] as const;

// ============================================================================
// SUGGESTION SELECTION LOGIC
// ============================================================================

/**
 * Get the best suggestion for a given mood and intensity
 * Returns the most relevant template based on mood match and intensity range
 */
export function getSuggestionForMood(
  mood: Enums<'mood_type'>,
  intensity: IntensityValue
): SuggestionTemplate {
  // Filter suggestions that match the mood
  const moodMatches = SUGGESTION_TEMPLATES.filter((template) =>
    template.relevantMoods.includes(mood)
  );

  // Further filter by intensity range
  const intensityMatches = moodMatches.filter(
    (template) =>
      intensity >= template.intensityRange[0] &&
      intensity <= template.intensityRange[1]
  );

  // If we have intensity-specific matches, use those
  if (intensityMatches.length > 0) {
    // Return a random match to add variety
    const randomIndex = Math.floor(Math.random() * intensityMatches.length);
    return intensityMatches[randomIndex];
  }

  // If we have mood matches but not intensity, use those
  if (moodMatches.length > 0) {
    const randomIndex = Math.floor(Math.random() * moodMatches.length);
    return moodMatches[randomIndex];
  }

  // Fallback to universal suggestions
  const universal = SUGGESTION_TEMPLATES.filter((template) =>
    template.relevantMoods.includes(mood as any)
  );

  // Ultimate fallback
  return (
    universal[0] ?? SUGGESTION_TEMPLATES.find((t) => t.id === 'hand-on-heart')!
  );
}

/**
 * Get multiple suggestions for variety
 * Returns up to 3 relevant suggestions
 */
export function getSuggestionsForMood(
  mood: Enums<'mood_type'>,
  intensity: IntensityValue,
  count: number = 3
): readonly SuggestionTemplate[] {
  const matches = SUGGESTION_TEMPLATES.filter(
    (template) =>
      template.relevantMoods.includes(mood) &&
      intensity >= template.intensityRange[0] &&
      intensity <= template.intensityRange[1]
  );

  // Shuffle and return requested count
  const shuffled = [...matches].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get suggestion by ID
 */
export function getSuggestionById(
  id: string
): SuggestionTemplate | undefined {
  return SUGGESTION_TEMPLATES.find((template) => template.id === id);
}

/**
 * Get all suggestions for a specific category
 */
export function getSuggestionsByCategory(
  category: SuggestionCategory
): readonly SuggestionTemplate[] {
  return SUGGESTION_TEMPLATES.filter(
    (template) => template.category === category
  );
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type SuggestionId = typeof SUGGESTION_TEMPLATES[number]['id'];
