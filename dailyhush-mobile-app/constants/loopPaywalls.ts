/**
 * DailyHush - Loop-Specific Paywall Configurations
 * Personalized messaging for each overthinker loop type
 */

import { Moon, Brain, MessageCircle, Target } from 'lucide-react-native';
import type { LoopType } from '@/data/quizQuestions';
import type { LucideIcon } from 'lucide-react-native';

export interface LoopPaywallConfig {
  icon: LucideIcon;
  emoji: string;
  title: string;
  subtitle: string;
  features: string[];
  urgency: string;
}

export const LOOP_PAYWALL_CONFIG: Record<LoopType, LoopPaywallConfig> = {
  'sleep-loop': {
    icon: Moon,
    emoji: '🌙',
    title: 'Stop Your 3AM Thought Spirals',
    subtitle:
      "You've identified the pattern.\nNow let's break it.\nPeaceful sleep is closer than you think.",
    features: [
      'Fall asleep in minutes, not hours',
      'Sleep through the night without waking',
      'Stop the 3AM thought spirals',
    ],
    urgency: 'Start sleeping peacefully tonight',
  },
  'decision-loop': {
    icon: Brain,
    emoji: '🧠',
    title: 'End Your Decision Paralysis',
    subtitle:
      "You've identified the pattern.\nNow let's break it.\nDecisive clarity is within reach.",
    features: [
      'Make decisions without second-guessing',
      'Stop analyzing every choice for hours',
      'Feel confident in your decisions',
    ],
    urgency: 'Start deciding with confidence',
  },
  'social-loop': {
    icon: MessageCircle,
    emoji: '💬',
    title: 'Stop Replaying Every Conversation',
    subtitle:
      "You've identified the pattern.\nNow let's break it.\nSocial peace is within your grasp.",
    features: [
      'Stop replaying conversations in your head',
      'Feel at peace after social interactions',
      'End the "what did they think?" spirals',
    ],
    urgency: 'Find peace in every conversation',
  },
  'perfectionism-loop': {
    icon: Target,
    emoji: '🎯',
    title: 'Release Your Perfectionism Trap',
    subtitle:
      "You've identified the pattern.\nNow let's break it.\nRelease is possible without perfection.",
    features: [
      'Stop beating yourself up over mistakes',
      'Let go of "not good enough" thoughts',
      'Feel proud of progress, not just perfection',
    ],
    urgency: 'Embrace progress over perfection',
  },
} as const;
