# Adaptive Protocol Implementation Guide

## No Machine Learning Required - Simple Math & SQL

**Last Updated:** November 5, 2025
**Status:** Ready for Implementation

---

## Executive Summary

Transform the spiral interrupt from a **memorizable technique** into a **personalized interrupt engine** using:

- ✅ Simple database queries (no ML)
- ✅ Basic averaging and counting
- ✅ Client-side calculations
- ✅ Zero additional costs

**Cost:** $0 (within Supabase free tier)
**Complexity:** Low (just SQL + JavaScript)
**Timeline:** 3-4 weeks

---

## The Problem We're Solving

### Current State (Self-Obsoleting Product)

```
User uses app → Learns 5-4-3-2-1 → Memorizes it → Doesn't need app
Result: Churn after 20 uses
```

### Future State (Personalized Engine)

```
User uses app → App learns what works → Gets better over time → Lock-in
Result: Increasing value with usage
```

---

## Architecture Overview

### Three Core Components

#### 1. **Technique Library** (Static)

5 different protocols that rotate based on effectiveness

#### 2. **Simple Scoring System** (Logic)

Basic math to pick the best technique for this moment

#### 3. **Effectiveness Tracking** (Data)

Store outcomes and calculate averages

---

## Phase 1: Core Adaptive System (Week 1-2)

### Task 1: Database Schema

**File:** `dailyhush-mobile-app/supabase/migrations/20251106_adaptive_protocols.sql`

```sql
-- Track technique effectiveness per user
CREATE TABLE user_technique_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  technique_id TEXT NOT NULL,

  -- Simple counters
  times_used INT DEFAULT 0,
  times_successful INT DEFAULT 0, -- reduction >= 2 points

  -- Simple averages (calculated from spiral_logs)
  avg_reduction DECIMAL(3,2) DEFAULT 0, -- Average pre_feeling - post_feeling

  -- Metadata
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, technique_id)
);

-- Index for fast lookups
CREATE INDEX idx_user_technique_stats ON user_technique_stats(user_id, technique_id);

-- Enhance spiral_logs with technique tracking
ALTER TABLE spiral_logs
ADD COLUMN IF NOT EXISTS technique_id TEXT,
ADD COLUMN IF NOT EXISTS technique_name TEXT,
ADD COLUMN IF NOT EXISTS protocol_duration INT, -- 60, 90, or 120
ADD COLUMN IF NOT EXISTS selection_confidence DECIMAL(3,2), -- 0-1
ADD COLUMN IF NOT EXISTS selection_rationale TEXT,
ADD COLUMN IF NOT EXISTS interactive_responses JSONB; -- User's inputs during protocol

-- Create function to update stats (called after each spiral)
CREATE OR REPLACE FUNCTION update_technique_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate if this was successful (reduction >= 2)
  DECLARE
    was_successful BOOLEAN := (NEW.pre_feeling - NEW.post_feeling) >= 2;
    reduction DECIMAL(3,2) := NEW.pre_feeling - NEW.post_feeling;
  BEGIN
    -- Upsert stats
    INSERT INTO user_technique_stats (
      user_id,
      technique_id,
      times_used,
      times_successful,
      avg_reduction,
      last_used_at
    )
    VALUES (
      NEW.user_id,
      NEW.technique_id,
      1,
      CASE WHEN was_successful THEN 1 ELSE 0 END,
      reduction,
      NEW.timestamp
    )
    ON CONFLICT (user_id, technique_id)
    DO UPDATE SET
      times_used = user_technique_stats.times_used + 1,
      times_successful = user_technique_stats.times_successful + CASE WHEN was_successful THEN 1 ELSE 0 END,
      -- Recalculate average as running average
      avg_reduction = (
        (user_technique_stats.avg_reduction * user_technique_stats.times_used) + reduction
      ) / (user_technique_stats.times_used + 1),
      last_used_at = NEW.timestamp,
      updated_at = NOW();

    RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update stats
CREATE TRIGGER trigger_update_technique_stats
AFTER INSERT ON spiral_logs
FOR EACH ROW
EXECUTE FUNCTION update_technique_stats();
```

---

### Task 2: Technique Library

**File:** `dailyhush-mobile-app/constants/techniqueLibrary.ts`

```typescript
export interface TechniqueStep {
  duration: number; // seconds
  text: string;
  interactive?: {
    type: 'text' | 'list' | 'count';
    prompt: string;
    placeholder?: string;
    maxLength?: number;
  };
}

export interface Technique {
  id: string;
  name: string;
  shortName: string;
  description: string;
  duration: number; // total duration in seconds
  bestFor: string[]; // triggers this works well for
  intensityRange: 'severe' | 'moderate' | 'mild' | 'any';
  requiresShift: boolean;
  steps: TechniqueStep[];
}

export const TECHNIQUE_LIBRARY: Technique[] = [
  {
    id: 'grounding-5-4-3-2-1',
    name: '5-4-3-2-1 Grounding',
    shortName: 'Grounding',
    description: 'Sensory awareness to anchor you in the present moment',
    duration: 90,
    bestFor: ['anxiety', 'overwhelm', 'general'],
    intensityRange: 'moderate',
    requiresShift: false,
    steps: [
      {
        duration: 5,
        text: "That conversation isn't happening right now.\nBut your body thinks it is.\nLet's interrupt this loop. Together.",
      },
      {
        duration: 5,
        text: 'Notice where you are\nright now.\nNot in that argument. Here.',
      },
      {
        duration: 10,
        text: 'Name 5 things\nyou can see...',
        interactive: {
          type: 'list',
          prompt: 'Type them as you notice them:',
          placeholder: '1. The lamp\n2. My coffee mug\n3. ',
          maxLength: 200
        }
      },
      {
        duration: 8,
        text: '4 things\nyou can hear...',
        interactive: {
          type: 'list',
          prompt: 'What do you hear?',
          placeholder: '1. Birds outside\n2. ',
          maxLength: 200
        }
      },
      {
        duration: 8,
        text: '3 things\nyou can touch...',
        interactive: {
          type: 'list',
          prompt: 'What can you feel?',
          placeholder: '1. The chair\n2. ',
          maxLength: 200
        }
      },
      { duration: 5, text: 'Take a\ndeep breath' },
      { duration: 10, text: 'Breathe in slowly...\n1... 2... 3... 4...' },
      { duration: 15, text: 'Breathe out slowly...\n1... 2... 3... 4... 5...' },
      { duration: 15, text: 'Again...\nBreathe in... and hold...' },
      { duration: 10, text: 'And out...\nslowly... all the way...' },
      {
        duration: 5,
        text: "This rumination?\nIt's a loop, not reality.\nYou're breaking the pattern.",
      },
    ],
  },

  {
    id: 'box-breathing',
    name: 'Box Breathing Protocol',
    shortName: 'Box Breathing',
    description: 'Tactical breathing used by Navy SEALs for acute stress',
    duration: 60,
    bestFor: ['panic', 'acute-stress', 'health concerns'],
    intensityRange: 'severe',
    requiresShift: false,
    steps: [
      {
        duration: 5,
        text: "Your nervous system is in overdrive.\nLet's reset it.\nBox breathing - 4 counts each.",
      },
      { duration: 5, text: 'Breathe in...\n1... 2... 3... 4' },
      { duration: 5, text: 'Hold it...\n1... 2... 3... 4' },
      { duration: 5, text: 'Breathe out...\n1... 2... 3... 4' },
      { duration: 5, text: 'Hold empty...\n1... 2... 3... 4' },
      { duration: 5, text: 'Again.\nBreath in...\n1... 2... 3... 4' },
      { duration: 5, text: 'Hold it...\n1... 2... 3... 4' },
      { duration: 5, text: 'Breathe out...\n1... 2... 3... 4' },
      { duration: 5, text: 'Hold empty...\n1... 2... 3... 4' },
      { duration: 5, text: 'One more round.\nBreath in...\n1... 2... 3... 4' },
      { duration: 5, text: 'Hold it...\n1... 2... 3... 4' },
      { duration: 5, text: 'Breathe out...\n1... 2... 3... 4' },
      { duration: 5, text: "Notice the shift.\nYou just hacked your nervous system." },
    ],
  },

  {
    id: 'cognitive-reframe',
    name: 'Thought Interruption',
    shortName: 'Reframe',
    description: 'Catch and challenge the rumination pattern',
    duration: 120,
    bestFor: ['conversations', 'rumination', 'work stress', 'relationships'],
    intensityRange: 'mild',
    requiresShift: false,
    steps: [
      {
        duration: 10,
        text: "Let's name this thought.\nWhat's the story your brain is telling?",
        interactive: {
          type: 'text',
          prompt: 'In one sentence:',
          placeholder: 'They think I\'m...',
          maxLength: 100
        }
      },
      {
        duration: 10,
        text: 'Is this happening RIGHT now?\nOr is this a story about the past or future?',
      },
      {
        duration: 15,
        text: "Here's the truth:\nYour brain is running a prediction,\nnot reporting reality.",
      },
      {
        duration: 15,
        text: 'What's ONE thing you can control\nin this actual moment?',
        interactive: {
          type: 'text',
          prompt: 'Name it:',
          placeholder: 'I can...',
          maxLength: 100
        }
      },
      {
        duration: 10,
        text: 'That rumination wants to run for hours.\nYou just interrupted it in 60 seconds.',
      },
      { duration: 10, text: 'Take a breath.\n1... 2... 3... 4...' },
      { duration: 15, text: 'And release...\n1... 2... 3... 4... 5...' },
      {
        duration: 15,
        text: "The thought might come back.\nThat's normal.\nBut now you know how to catch it.",
      },
      {
        duration: 10,
        text: "This skill gets stronger every time.\nYou're building the pattern interrupt.",
      },
      { duration: 10, text: 'One more breath.' },
    ],
  },

  {
    id: 'body-scan-rapid',
    name: 'Rapid Body Scan',
    shortName: 'Body Scan',
    description: 'Release physical tension and return to your body',
    duration: 75,
    bestFor: ['physical-tension', 'health concerns', 'anxiety'],
    intensityRange: 'moderate',
    requiresShift: false,
    steps: [
      {
        duration: 5,
        text: "Rumination lives in your head.\nLet's drop into your body.",
      },
      { duration: 8, text: 'Notice your feet on the floor.\nAre they tense? Relaxed?' },
      { duration: 8, text: 'Your legs.\nWhere are you holding tension?' },
      { duration: 8, text: 'Your belly and chest.\nAre you breathing shallow?' },
      { duration: 8, text: 'Your shoulders.\nDrop them. Right now.' },
      { duration: 8, text: 'Your jaw.\nUnclench it.\nLet your tongue rest.' },
      { duration: 5, text: 'Big breath in...' },
      { duration: 10, text: 'And sigh it out.\nAudibly.\nLet it go.' },
      { duration: 5, text: 'Again. Breathe in...' },
      { duration: 10, text: 'And release with sound.\nAhhhhh...' },
    ],
  },

  {
    id: 'shift-biometric-sync',
    name: 'Biometric Sync Protocol',
    shortName: 'Shift Sync',
    description: 'Shift necklace guides your breathing with real-time feedback',
    duration: 90,
    bestFor: ['severe', 'panic', 'acute-stress'],
    intensityRange: 'severe',
    requiresShift: true,
    steps: [
      {
        duration: 5,
        text: "Grab your Shift necklace.\nLet it guide you back.",
      },
      {
        duration: 10,
        text: 'Feel the vibration.\nMatch your breath to its rhythm.',
      },
      { duration: 15, text: 'Breathe in as it expands...' },
      { duration: 15, text: 'Breathe out as it contracts...' },
      { duration: 10, text: "Don't force it.\nLet the necklace lead." },
      { duration: 15, text: 'Again. In...' },
      { duration: 15, text: 'And out...' },
      {
        duration: 5,
        text: "Your body is syncing.\nYour nervous system is calming.",
      },
    ],
  },
];
```

---

### Task 3: Simple Scoring Algorithm

**File:** `dailyhush-mobile-app/services/adaptiveProtocol.ts`

```typescript
import { supabase } from '@/utils/supabase';
import { TECHNIQUE_LIBRARY, type Technique } from '@/constants/techniqueLibrary';

interface TechniqueStats {
  techniqueId: string;
  timesUsed: number;
  avgReduction: number;
  lastUsedAt: Date | null;
}

interface AdaptiveProtocol {
  technique: Technique;
  confidence: number; // 0-1 scale
  rationale: string;
}

/**
 * Select the best protocol using simple math (no ML)
 */
export async function selectAdaptiveProtocol(
  userId: string,
  intensity: number, // 1-7 from pre-check
  trigger?: string,
  shiftConnected: boolean = false
): Promise<AdaptiveProtocol> {
  // 1. Get user's technique history (simple SQL query)
  const userStats = await getUserTechniqueStats(userId);

  // 2. Filter available techniques
  const available = TECHNIQUE_LIBRARY.filter((tech) => !tech.requiresShift || shiftConnected);

  // 3. Score each technique using SIMPLE MATH
  const scored = available.map((technique) => {
    let score = 0;
    const stats = userStats.find((s) => s.techniqueId === technique.id);

    // RULE 1: Past effectiveness (most important)
    if (stats && stats.timesUsed > 0) {
      score += stats.avgReduction * 10; // 0-30 points
    } else {
      score += 5; // Slight bonus for new techniques (exploration)
    }

    // RULE 2: Trigger match
    if (trigger) {
      const triggerLower = trigger.toLowerCase();
      if (technique.bestFor.some((t) => triggerLower.includes(t.toLowerCase()))) {
        score += 8; // Strong match bonus
      }
    }

    // RULE 3: Intensity match
    if (intensity <= 3 && technique.intensityRange === 'severe') {
      score += 6; // Severe spiral needs severe protocol
    } else if (intensity >= 5 && technique.intensityRange === 'mild') {
      score += 6; // Mild spiral needs quick protocol
    } else if (intensity === 4 && technique.intensityRange === 'moderate') {
      score += 6; // Moderate match
    }

    // RULE 4: Don't repeat same technique too often
    if (stats && stats.lastUsedAt) {
      const hoursSinceUse = (Date.now() - stats.lastUsedAt.getTime()) / (1000 * 60 * 60);
      if (hoursSinceUse < 24) {
        score -= 10; // Big penalty for same-day repeat
      } else if (hoursSinceUse < 72) {
        score -= 3; // Small penalty for recent use
      }
    }

    // RULE 5: Shift bonus if connected
    if (shiftConnected && technique.requiresShift) {
      score += 5;
    }

    return { technique, score };
  });

  // 4. Sort by score
  scored.sort((a, b) => b.score - a.score);

  // 5. Exploration vs Exploitation (80/20 rule)
  // 80% of time pick best, 20% of time try something new
  const shouldExplore = Math.random() < 0.2;
  const selected = shouldExplore && scored[1] ? scored[1] : scored[0];

  // 6. Calculate confidence (0-1)
  const maxPossibleScore = 59; // Sum of all bonuses
  const confidence = Math.min(selected.score / maxPossibleScore, 1);

  // 7. Generate human-readable rationale
  const rationale = generateRationale(selected, intensity, trigger, userStats);

  return {
    technique: selected.technique,
    confidence,
    rationale,
  };
}

/**
 * Get user's technique stats using simple SQL
 */
async function getUserTechniqueStats(userId: string): Promise<TechniqueStats[]> {
  const { data, error } = await supabase
    .from('user_technique_stats')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching technique stats:', error);
    return [];
  }

  return (data || []).map((row) => ({
    techniqueId: row.technique_id,
    timesUsed: row.times_used,
    avgReduction: row.avg_reduction,
    lastUsedAt: row.last_used_at ? new Date(row.last_used_at) : null,
  }));
}

/**
 * Generate human-readable explanation
 */
function generateRationale(
  selected: { technique: Technique; score: number },
  intensity: number,
  trigger: string | undefined,
  userStats: TechniqueStats[]
): string {
  const reasons = [];
  const stats = userStats.find((s) => s.techniqueId === selected.technique.id);

  // Effectiveness reason
  if (stats && stats.avgReduction > 2) {
    reasons.push(
      `Last time this reduced your intensity by ${stats.avgReduction.toFixed(1)} points`
    );
  } else if (stats && stats.avgReduction > 0) {
    reasons.push(`This usually helps you feel ${stats.avgReduction.toFixed(1)} points better`);
  }

  // Trigger reason
  if (trigger && selected.technique.bestFor.includes(trigger.toLowerCase())) {
    reasons.push(`Works well for ${trigger.toLowerCase()} spirals`);
  }

  // Intensity reason
  if (intensity <= 3) {
    reasons.push("You're in a strong spiral, so we're using a more intensive protocol");
  } else if (intensity >= 6) {
    reasons.push('You caught it early - this quick protocol should help');
  }

  // Novelty reason
  if (!stats || stats.timesUsed === 0) {
    reasons.push("Let's try something new to see if it works better");
  }

  // Default if no specific reasons
  if (reasons.length === 0) {
    reasons.push('This technique is effective for most people');
  }

  return reasons.slice(0, 2).join('. ') + '.';
}

/**
 * Record protocol outcome (updates stats automatically via trigger)
 */
export async function recordProtocolOutcome(
  userId: string,
  techniqueId: string,
  techniqueName: string,
  duration: number,
  preFeel: number,
  postFeel: number,
  confidence: number,
  rationale: string,
  trigger?: string,
  interactiveResponses?: Record<string, string>
): Promise<void> {
  // Just insert into spiral_logs
  // The database trigger will auto-update user_technique_stats
  const { error } = await supabase.from('spiral_logs').insert({
    user_id: userId,
    technique_id: techniqueId,
    technique_name: techniqueName,
    protocol_duration: duration,
    selection_confidence: confidence,
    selection_rationale: rationale,
    pre_feeling: preFeel,
    post_feeling: postFeel,
    trigger: trigger || null,
    interactive_responses: interactiveResponses || null,
    interrupted: true,
    duration_seconds: duration,
    timestamp: new Date().toISOString(),
  });

  if (error) {
    console.error('Error recording protocol outcome:', error);
    throw error;
  }
}
```

---

### Task 4: Simple Pattern Detection

**File:** `dailyhush-mobile-app/services/patternDetection.ts`

```typescript
import { supabase } from '@/utils/supabase';

/**
 * Get user's peak spiral time (simple counting)
 */
export async function getPeakSpiralTime(userId: string): Promise<number | null> {
  const { data, error } = await supabase
    .from('spiral_logs')
    .select('timestamp')
    .eq('user_id', userId)
    .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days

  if (error || !data || data.length === 0) {
    return null;
  }

  // Count spirals by hour
  const hourCounts: Record<number, number> = {};
  data.forEach((log) => {
    const hour = new Date(log.timestamp).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  // Find peak hour
  const entries = Object.entries(hourCounts);
  if (entries.length === 0) return null;

  entries.sort(([, a], [, b]) => (b as number) - (a as number));
  return parseInt(entries[0][0]);
}

/**
 * Get most common trigger
 */
export async function getMostCommonTrigger(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('spiral_logs')
    .select('trigger')
    .eq('user_id', userId)
    .not('trigger', 'is', null)
    .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  if (error || !data || data.length === 0) {
    return null;
  }

  // Count triggers
  const triggerCounts: Record<string, number> = {};
  data.forEach((log) => {
    if (log.trigger) {
      triggerCounts[log.trigger] = (triggerCounts[log.trigger] || 0) + 1;
    }
  });

  // Find most common
  const entries = Object.entries(triggerCounts);
  if (entries.length === 0) return null;

  entries.sort(([, a], [, b]) => (b as number) - (a as number));
  return entries[0][0];
}

/**
 * Calculate technique rankings for user
 */
export async function getTechniqueRankings(userId: string) {
  const { data, error } = await supabase
    .from('user_technique_stats')
    .select('*')
    .eq('user_id', userId)
    .order('avg_reduction', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((stat, index) => ({
    rank: index + 1,
    techniqueName:
      TECHNIQUE_LIBRARY.find((t) => t.id === stat.technique_id)?.name || stat.technique_id,
    avgReduction: stat.avg_reduction,
    timesUsed: stat.times_used,
    successRate: stat.times_successful / stat.times_used,
  }));
}
```

---

## Phase 2: User-Facing Features (Week 3)

### Task 5: Interactive Steps Component

**File:** `dailyhush-mobile-app/components/InteractiveStepInput.tsx`

```typescript
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { RADIUS, SPACING } from '@/constants/design-tokens';

interface InteractiveStepInputProps {
  type: 'text' | 'list' | 'count';
  prompt: string;
  placeholder?: string;
  maxLength?: number;
  value: string;
  onChangeText: (text: string) => void;
}

export function InteractiveStepInput({
  type,
  prompt,
  placeholder,
  maxLength = 200,
  value,
  onChangeText
}: InteractiveStepInputProps) {

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>{prompt}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.muted}
        multiline={type === 'text' || type === 'list'}
        numberOfLines={type === 'list' ? 5 : 3}
        maxLength={maxLength}
        style={[
          styles.input,
          (type === 'text' || type === 'list') && styles.multiline
        ]}
        returnKeyType="done"
        blurOnSubmit
      />
      <Text style={styles.helper}>
        {value.length}/{maxLength} • This helps us personalize your experience
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: colors.lime[800] + '20',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: colors.lime[600] + '30',
  },
  prompt: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: colors.lime[400],
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: colors.background.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.lime[700] + '40',
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  helper: {
    marginTop: SPACING.sm,
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: colors.text.muted,
  },
});
```

---

### Task 6: Insights Screen

**File:** `dailyhush-mobile-app/app/insights/protocol-intelligence.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/text';
import { useUser } from '@/store/useStore';
import { getTechniqueRankings, getPeakSpiralTime, getMostCommonTrigger } from '@/services/patternDetection';
import { colors } from '@/constants/colors';
import { SPACING, RADIUS } from '@/constants/design-tokens';

export default function ProtocolIntelligence() {
  const user = useUser();
  const [rankings, setRankings] = useState([]);
  const [peakTime, setPeakTime] = useState<number | null>(null);
  const [commonTrigger, setCommonTrigger] = useState<string | null>(null);

  useEffect(() => {
    if (user?.user_id) {
      loadInsights();
    }
  }, [user]);

  async function loadInsights() {
    const [ranks, peak, trigger] = await Promise.all([
      getTechniqueRankings(user.user_id),
      getPeakSpiralTime(user.user_id),
      getMostCommonTrigger(user.user_id)
    ]);

    setRankings(ranks);
    setPeakTime(peak);
    setCommonTrigger(trigger);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Protocol Intelligence</Text>
      <Text style={styles.subtitle}>
        What works specifically for you
      </Text>

      {/* Technique Rankings */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Most Effective Techniques</Text>
        {rankings.length > 0 ? (
          rankings.map((rank) => (
            <View key={rank.rank} style={styles.rankItem}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankNumber}>{rank.rank}</Text>
              </View>
              <View style={styles.rankInfo}>
                <Text style={styles.techniqueName}>{rank.techniqueName}</Text>
                <Text style={styles.techniqueStats}>
                  Reduces intensity by {rank.avgReduction.toFixed(1)} points • Used {rank.timesUsed}x
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>
            Complete a few protocols to see what works best for you
          </Text>
        )}
      </View>

      {/* Patterns */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Spiral Patterns</Text>
        {peakTime !== null && (
          <Text style={styles.patternText}>
            📊 Peak vulnerability: {formatHour(peakTime)}
          </Text>
        )}
        {commonTrigger && (
          <Text style={styles.patternText}>
            🎯 Most common trigger: {commonTrigger}
          </Text>
        )}
        {(!peakTime && !commonTrigger) && (
          <Text style={styles.emptyText}>
            Keep logging spirals to discover your patterns
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

function formatHour(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:00 ${period}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    color: colors.text.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: colors.text.secondary,
    marginBottom: SPACING.xl,
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: colors.lime[700] + '30',
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.text.primary,
    marginBottom: SPACING.md,
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: colors.lime[800] + '20',
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.lime[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  rankNumber: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: colors.background.primary,
  },
  rankInfo: {
    flex: 1,
  },
  techniqueName: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: colors.text.primary,
  },
  techniqueStats: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: colors.text.secondary,
  },
  patternText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: colors.text.primary,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: colors.text.muted,
    fontStyle: 'italic',
  },
});
```

---

## Implementation Timeline

### Week 1: Database & Core Logic

- ✅ Day 1-2: Database migration
- ✅ Day 3-4: Technique library
- ✅ Day 5-7: Scoring algorithm

### Week 2: Integration

- ✅ Day 8-10: Update spiral.tsx to use adaptive selection
- ✅ Day 11-12: Add interactive steps
- ✅ Day 13-14: Testing with mock data

### Week 3: User-Facing Features

- ✅ Day 15-17: Insights screen
- ✅ Day 18-19: Pattern detection
- ✅ Day 20-21: Polish and bug fixes

---

## Testing Strategy

### 1. Seed Test Data

```sql
-- Create test spiral logs with varied outcomes
INSERT INTO spiral_logs (user_id, technique_id, technique_name, pre_feeling, post_feeling, trigger, timestamp)
VALUES
  ('test-user-id', 'box-breathing', 'Box Breathing', 7, 3, 'panic', NOW() - INTERVAL '5 days'),
  ('test-user-id', 'box-breathing', 'Box Breathing', 6, 2, 'panic', NOW() - INTERVAL '3 days'),
  ('test-user-id', 'grounding-5-4-3-2-1', 'Grounding', 5, 3, 'anxiety', NOW() - INTERVAL '2 days'),
  ('test-user-id', 'box-breathing', 'Box Breathing', 7, 4, 'panic', NOW() - INTERVAL '1 day');
```

### 2. Verify Stats Auto-Update

```typescript
// Should show box-breathing has avgReduction of 3.33
const stats = await getUserTechniqueStats('test-user-id');
console.log(stats);
```

### 3. Test Selection Logic

```typescript
// For panic trigger at intensity 2, should select box-breathing
const protocol = await selectAdaptiveProtocol('test-user-id', 2, 'panic', false);
console.log(protocol.technique.name); // "Box Breathing Protocol"
console.log(protocol.rationale); // "Last time this reduced your intensity by 3.3 points. Works well for panic spirals."
```

---

## Success Metrics

Track these to validate the system works:

1. **Technique Diversity**
   - Target: Users try 3+ different techniques in first month
   - Query: `SELECT user_id, COUNT(DISTINCT technique_id) FROM spiral_logs GROUP BY user_id`

2. **Improvement Over Time**
   - Target: Average reduction increases with usage
   - Query: Compare first 5 spirals vs last 5 spirals per user

3. **Retention Impact**
   - Target: 30% higher D30 retention vs control
   - Track: Users who see adaptive protocols vs legacy fixed protocol

---

## Cost Analysis

**Current Costs:** $0
**Additional Costs:** $0

**Why it's free:**

- No external APIs
- All logic runs client-side
- Database queries covered by Supabase free tier (500MB)
- Average user generates ~1KB per spiral
- 10,000 spirals = 10MB (well within limits)

---

## Next Steps

1. Review this document
2. Approve database schema
3. Start with Week 1 tasks
4. Test with real users in Week 3

Want me to start implementing? I'll begin with the database migration.
