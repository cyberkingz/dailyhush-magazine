/**
 * EmotionalWeather Component
 *
 * Beautiful widget showing today's emotional state as weather
 * Displays mood rating, weather type, and today's notes
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import type { Enums } from '@/types/supabase';
import { emotionalWeatherColors } from '@/constants/loopTypeColors';
import { profileTypography } from '@/constants/profileTypography';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/designTokens';
import { PillButton } from '@/components/ui/pill-button';

interface EmotionalWeatherProps {
  weather?: Enums<'emotional_weather'>;
  moodRating?: number;
  notes?: string;
  onPress?: () => void;
}

export function EmotionalWeather({
  weather,
  moodRating,
  notes,
  onPress,
}: EmotionalWeatherProps) {
  // If no check-in today, show prompt (matching home page layout)
  if (!weather && !moodRating) {
    return (
      <View style={styles.containerWrapper}>
        <View style={styles.container}>
          <Text style={styles.emptyTitle}>How are you feeling today?</Text>

          {/* Icon Circle */}
          <View style={styles.iconCircle}>
            <Text style={styles.sunEmoji}>🌤️</Text>
          </View>

          {/* Description */}
          <Text style={styles.emptyDescription}>
            Check in with your emotional weather
          </Text>
        </View>

        {/* Floating Log Mood Button */}
        <PillButton
          label="Log Mood"
          onPress={onPress}
          variant="primary"
          style={styles.floatingButton}
          accessibilityLabel="Log your mood"
          accessibilityHint="Opens mood capture to record how you're feeling"
        />
      </View>
    );
  }

  // Get weather config for icon display
  const weatherConfig = weather ? emotionalWeatherColors[weather] : null;

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 500 }}
      style={styles.activeContainer}
    >
      {/* Content */}
      <View style={styles.content}>
        {/* Weather icon */}
        <Text style={styles.weatherIcon}>{weatherConfig?.icon || '☁️'}</Text>

        {/* Weather description */}
        <View style={styles.textContent}>
          <Text style={styles.weatherTitle}>
            {weatherConfig?.name || 'Your Emotional Weather'}
          </Text>

          {/* Mood rating */}
          {moodRating && (
            <View style={styles.moodRating}>
              {[...Array(5)].map((_, i) => (
                <Text
                  key={i}
                  style={[
                    styles.moodDot,
                    i < moodRating ? styles.moodDotFilled : styles.moodDotEmpty,
                  ]}
                >
                  {i < moodRating ? '●' : '○'}
                </Text>
              ))}
            </View>
          )}

          {/* Notes preview */}
          {notes && (
            <Text style={styles.notes} numberOfLines={2}>
              "{notes}"
            </Text>
          )}

          {/* Today label */}
          <Text style={styles.todayLabel}>Today's Check-In</Text>
        </View>
      </View>

      {/* Edit button */}
      {onPress && (
        <TouchableOpacity style={styles.editButton} onPress={onPress}>
          <Text style={styles.editButtonText}>Update</Text>
        </TouchableOpacity>
      )}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  // Empty State Container (matching home MoodCard)
  containerWrapper: {
    position: 'relative',
    width: '100%',
    marginBottom: SPACING.xxl * 2, // 48px - proper spacing before next section
  },
  container: {
    backgroundColor: colors.background.card,
    borderRadius: SPACING.xxl,
    paddingTop: SPACING.xxl + SPACING.xs, // 28px
    paddingHorizontal: SPACING.xxl + SPACING.xs, // 28px
    paddingBottom: SPACING.xxl * 2 + SPACING.lg, // 64px - extra padding for floating button
    borderWidth: 1,
    borderColor: colors.emerald[600] + '20',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: SPACING.xxl + SPACING.xs, // 28px
    textAlign: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.emerald[500] + '30',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.xxl,
  },
  sunEmoji: {
    fontSize: 64,
    lineHeight: 64,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    opacity: 0.8,
    lineHeight: 22,
  },
  floatingButton: {
    position: 'absolute',
    bottom: -SPACING.lg, // -16px - floating below the card
    alignSelf: 'center',
    width: 'auto',
  },

  // Active State Styles (with weather data)
  activeContainer: {
    borderRadius: SPACING.xxl,
    overflow: 'hidden',
    marginBottom: SPACING.xxl,
    height: 240,
    borderWidth: 1,
    borderColor: colors.background.border,
    backgroundColor: colors.background.secondary,
  },
  content: {
    flex: 1,
    padding: SPACING.xxl,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
  },
  weatherIcon: {
    fontSize: 72,
    marginBottom: SPACING.sm,
  },
  textContent: {
    alignItems: 'center',
    width: '100%',
  },
  weatherTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  moodRating: {
    flexDirection: 'row',
    gap: SPACING.xs + 2, // 6px
    marginBottom: SPACING.md,
    justifyContent: 'center',
  },
  moodDot: {
    fontSize: 16,
  },
  moodDotFilled: {
    color: colors.text.primary,
    opacity: 1,
  },
  moodDotEmpty: {
    color: colors.text.primary,
    opacity: 0.4,
  },
  notes: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  todayLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
  editButton: {
    position: 'absolute',
    top: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: SPACING.xl,
  },
  editButtonText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
