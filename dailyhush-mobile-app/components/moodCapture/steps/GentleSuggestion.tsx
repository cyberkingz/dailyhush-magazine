/**
 * Nœma - Step 4: Gentle Suggestion Component
 *
 * Final step in mood capture flow showing a personalized therapeutic activity.
 * Suggestions are matched to mood and intensity for relevance.
 *
 * Features:
 * - Personalized activity based on mood/intensity
 * - Visual card with icon illustration
 * - Step-by-step instructions
 * - Two action options: "Try This Exercise" or "Save & Close"
 * - Non-prescriptive, gentle language
 *
 * @see MOOD_CAPTURE_ROADMAP.md
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MotiView } from 'moti';
import {
  Heart,
  Wind,
  Footprints,
  Moon,
  Coffee,
  BookOpen,
  Music,
  Flower,
  type LucideIcon,
} from 'lucide-react-native';
import {
  STEP_HEADER,
  SUGGESTION_CARD,
  ANIMATIONS,
} from '@/constants/moodCaptureDesign';
import {
  getSuggestionForMood,
  type SuggestionTemplate,
} from '@/constants/suggestions';
import { STEP_SUBTITLES, getMoodEmoji } from '@/constants/moodOptions';
import type { Enums } from '@/types/supabase';
import type { IntensityValue } from '@/constants/moodOptions';

// ============================================================================
// TYPES
// ============================================================================

interface GentleSuggestionProps {
  /**
   * Currently selected mood (from Step 1)
   */
  selectedMood: Enums<'mood_type'>;

  /**
   * Currently selected intensity (from Step 2)
   */
  selectedIntensity: IntensityValue;

  /**
   * Callback when user accepts suggestion
   * (Clicking "Try This Exercise")
   */
  onAcceptSuggestion?: (suggestion: SuggestionTemplate) => void;
}

// Icon mapping for suggestion categories
const ICON_MAP: Record<string, LucideIcon> = {
  breathing: Wind,
  movement: Footprints,
  mindfulness: Heart,
  rest: Moon,
  connection: Coffee,
  creative: BookOpen,
  sensory: Music,
  nature: Flower,
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Step 4: Gentle suggestion screen
 * Shows a personalized therapeutic activity recommendation
 */
export function GentleSuggestion({
  selectedMood,
  selectedIntensity,
  onAcceptSuggestion,
}: GentleSuggestionProps) {
  // Get personalized suggestion based on mood and intensity
  const [suggestion, setSuggestion] = useState<SuggestionTemplate | null>(null);

  useEffect(() => {
    const matched = getSuggestionForMood(selectedMood, selectedIntensity);
    setSuggestion(matched);

    // Notify parent if provided
    if (matched && onAcceptSuggestion) {
      // Don't call immediately - wait for user interaction
    }
  }, [selectedMood, selectedIntensity]);

  if (!suggestion) {
    return null;
  }

  // Get icon component for this suggestion
  const IconComponent = ICON_MAP[suggestion.category] || Heart;
  const moodEmoji = getMoodEmoji(selectedMood);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: 'timing',
          duration: ANIMATIONS.fadeIn.duration,
        }}
      >
        {/* Step Header */}
        <View style={styles.header}>
          <Text style={styles.title}>A gentle suggestion for you {moodEmoji}</Text>
          <Text style={styles.subtitle}>{STEP_SUBTITLES.step4}</Text>
        </View>

        {/* Suggestion Card */}
        <View style={styles.card}>
          {/* Icon Illustration */}
          <View style={styles.illustration}>
            <IconComponent
              size={SUGGESTION_CARD.illustration.icon.size}
              color={SUGGESTION_CARD.illustration.icon.color}
              strokeWidth={1.5}
            />
          </View>

          {/* Badge (if relevant loop type) */}
          {suggestion.relevantLoops && suggestion.relevantLoops.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                Recommended for your loops
              </Text>
            </View>
          )}

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{suggestion.title}</Text>
          </View>

          {/* Description */}
          <Text style={styles.description}>{suggestion.description}</Text>

          {/* Duration Badge */}
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>⏱️ {suggestion.duration}</Text>
          </View>

          {/* Steps */}
          <View style={styles.stepsContainer}>
            {suggestion.steps.map((step, index) => (
              <View key={index} style={styles.stepRow}>
                <View style={styles.stepBullet} />
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          {/* Reassuring Note */}
          <View style={styles.note}>
            <Text style={styles.noteText}>
              💚 Remember: This is just a suggestion. Do what feels right for you.
            </Text>
          </View>
        </View>
      </MotiView>
    </ScrollView>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100, // Extra space for bottom button
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    ...STEP_HEADER.title,
  },
  subtitle: {
    ...STEP_HEADER.subtitle,
  },
  card: {
    ...SUGGESTION_CARD.container,
  },
  illustration: {
    ...SUGGESTION_CARD.illustration,
  },
  badge: {
    ...SUGGESTION_CARD.badge,
  },
  badgeText: {
    ...SUGGESTION_CARD.badge.text,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleText: {
    ...SUGGESTION_CARD.title.text,
  },
  description: {
    ...SUGGESTION_CARD.description,
  },
  durationBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(64, 145, 108, 0.25)',
    borderRadius: 8,
    marginBottom: 20,
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
    color: SUGGESTION_CARD.description.color,
    letterSpacing: 0.3,
  },
  stepsContainer: {
    ...SUGGESTION_CARD.steps,
  },
  stepRow: {
    ...SUGGESTION_CARD.steps.step,
  },
  stepBullet: {
    ...SUGGESTION_CARD.steps.step.bullet,
  },
  stepText: {
    ...SUGGESTION_CARD.steps.step.text,
  },
  note: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(64, 145, 108, 0.2)',
  },
  noteText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: SUGGESTION_CARD.description.color,
    opacity: 0.9,
    textAlign: 'center',
  },
});
