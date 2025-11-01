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
    title: 'Sleep-Loop Chronic Overthinker',
    subtitle:
      "Your mind won't quiet at bedtime.\nYou replay conversations at 3AM.\nYou deserve rest.",
    features: [
      '3AM bedtime interrupt technique',
      'Evening rumination prevention',
      'Sleep-Loop trigger mapping',
      'Red-light night mode',
      'Voice journaling for 3AM spirals',
    ],
    urgency: 'Break the 3AM loop tonight',
  },
  'decision-loop': {
    icon: Brain,
    emoji: '🧠',
    title: 'Decision-Loop Overthinker',
    subtitle:
      "You analyze every option.\nYou need certainty before acting.\nYou're exhausted from deciding.",
    features: [
      'Decision fatigue reset protocol',
      '10-second decision framework',
      'Analysis paralysis breaker',
      'Choice mapping exercises',
      'Confident action templates',
    ],
    urgency: 'Stop second-guessing yourself',
  },
  'social-loop': {
    icon: MessageCircle,
    emoji: '💬',
    title: 'Social-Loop Overthinker',
    subtitle:
      'You replay what you said.\nYou worry how they saw you.\nYou need peace after social moments.',
    features: [
      'Post-conversation spiral interrupt',
      'Social interaction reframe toolkit',
      'Judgment-proof exercises',
      'Confidence-building practices',
      'Social anxiety relief protocols',
    ],
    urgency: 'Stop replaying conversations',
  },
  'perfectionism-loop': {
    icon: Target,
    emoji: '🎯',
    title: 'Perfectionism-Loop Overthinker',
    subtitle:
      "You focus on what went wrong.\nYou can't let mistakes go.\nYou deserve self-compassion.",
    features: [
      'Mistake release protocol',
      'Good-enough decision training',
      'Self-criticism interrupt',
      'Progress tracking (not perfection)',
      'Compassionate self-talk builder',
    ],
    urgency: 'Let go of perfect',
  },
} as const;
