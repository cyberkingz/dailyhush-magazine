/**
 * WeatherDisplay Component
 *
 * Shows the logged mood as weather visualization.
 * Displays weather icon, mood rating dots, notes preview, and update button.
 *
 * @module components/mood-widget/WeatherDisplay
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import type { WeatherDisplayProps } from '@/types/widget.types';
import { emotionalWeatherColors } from '@/constants/loopTypeColors';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/designTokens';
import { ACCESSIBILITY_LABELS } from '@/constants/widgetConfig';

/**
 * WeatherDisplay component
 * Shows logged mood as weather
 */
export function WeatherDisplay({
  weather,
  moodRating,
  notes,
  createdAt,
  updatedAt,
  onUpdate,
  visible,
}: WeatherDisplayProps) {
  // Get weather config for icon display
  const weatherConfig = emotionalWeatherColors[weather as keyof typeof emotionalWeatherColors] || emotionalWeatherColors.cloudy;

  // Format timestamp for display
  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return null;

    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const timeString = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    if (isToday) {
      return `Today at ${timeString}`;
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Determine which timestamp to show
  const displayTimestamp = updatedAt && updatedAt !== createdAt
    ? `Updated ${formatTimestamp(updatedAt)}`
    : `Logged ${formatTimestamp(createdAt)}`;

  if (!visible) {
    return null;
  }

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 500 }}
      style={styles.container}
    >
      {/* Weather icon */}
      <Text style={styles.weatherIcon} accessible={false}>
        {weatherConfig.icon}
      </Text>

      {/* Weather description */}
      <View style={styles.textContent}>
        <Text
          style={styles.weatherTitle}
          accessibilityRole="header"
        >
          {weatherConfig.name}
        </Text>

        {/* Mood rating dots */}
        {moodRating !== undefined && (
          <View
            style={styles.moodRating}
            accessible={true}
            accessibilityLabel={`Mood rating: ${moodRating} out of 5`}
            accessibilityRole="text"
          >
            {[...Array(5)].map((_, i) => (
              <Text
                key={i}
                style={[
                  styles.moodDot,
                  i < moodRating ? styles.moodDotFilled : styles.moodDotEmpty,
                ]}
                accessible={false}
              >
                {i < moodRating ? '●' : '○'}
              </Text>
            ))}
          </View>
        )}

        {/* Notes preview */}
        {notes && (
          <Text
            style={styles.notes}
            numberOfLines={2}
            accessible={true}
            accessibilityLabel={`Your notes: ${notes}`}
          >
            "{notes}"
          </Text>
        )}

        {/* Today label */}
        <Text style={styles.todayLabel}>
          Today's Check-In
        </Text>

        {/* Timestamp */}
        {displayTimestamp && (
          <Text
            style={styles.timestamp}
            accessible={true}
            accessibilityLabel={displayTimestamp}
          >
            {displayTimestamp}
          </Text>
        )}
      </View>

      {/* Update button */}
      <TouchableOpacity
        style={styles.updateButton}
        onPress={() => {
          console.log('[WeatherDisplay] Update button pressed');
          onUpdate();
        }}
        accessibilityLabel={ACCESSIBILITY_LABELS.weatherDisplay.updateButton}
        accessibilityHint={ACCESSIBILITY_LABELS.weatherDisplay.updateHint}
        accessibilityRole="button"
      >
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative', // Ensure absolute children position relative to this
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
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
    color: colors.lime[500],
    opacity: 1,
  },
  moodDotEmpty: {
    color: colors.text.primary,
    opacity: 0.3,
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
    opacity: 0.7,
  },
  timestamp: {
    fontSize: 11,
    color: colors.text.secondary,
    textAlign: 'center',
    opacity: 0.6,
    marginTop: SPACING.xs,
  },
  updateButton: {
    position: 'absolute',
    top: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: 'rgba(122, 248, 89, 0.25)', // Lime with 25% opacity
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: SPACING.xl,
    borderWidth: 1,
    borderColor: colors.lime[500] + '40', // Lime with 25% opacity
    zIndex: 10, // Ensure button is above other content
    elevation: 5, // Android shadow/elevation
  },
  updateButtonText: {
    color: colors.lime[500],
    fontSize: 14,
    fontWeight: '600',
  },
});
