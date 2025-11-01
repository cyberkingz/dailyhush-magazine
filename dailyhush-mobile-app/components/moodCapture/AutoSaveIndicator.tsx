/**
 * DailyHush - Auto Save Indicator Component
 *
 * Shows save status for mood capture writing (Step 3).
 * Displays "Saving...", "Saved ✓", or error state.
 *
 * Features:
 * - Real-time save status from useAutoSave hook
 * - Animated transitions between states
 * - Auto-hides "Saved" indicator after 2 seconds
 * - Error retry functionality
 *
 * @see MOOD_CAPTURE_ROADMAP.md
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { MotiView } from 'moti';
import { Check, AlertCircle } from 'lucide-react-native';
import { STATUS_INDICATORS } from '@/constants/moodCaptureDesign';
import { colors } from '@/constants/colors';
import type { AutoSaveStatus } from '@/hooks/useAutoSave';

// ============================================================================
// TYPES
// ============================================================================

interface AutoSaveIndicatorProps {
  /**
   * Current auto-save status
   */
  status: AutoSaveStatus;

  /**
   * Timestamp of last successful save
   */
  lastSaved?: Date;

  /**
   * Error message if save failed
   */
  error?: string;

  /**
   * Callback to retry failed save
   */
  onRetry?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Auto-save status indicator
 * Shows current save state with appropriate icon and message
 */
export function AutoSaveIndicator({
  status,
  lastSaved,
  error,
  onRetry,
}: AutoSaveIndicatorProps) {
  // Don't render if idle and no last saved time
  if (status === 'idle' && !lastSaved) {
    return null;
  }

  // Get display text and icon based on status
  const getStatusDisplay = () => {
    switch (status) {
      case 'saving':
        return {
          text: 'Saving...',
          icon: <ActivityIndicator size="small" color={colors.emerald[500]} />,
          color: colors.text.secondary,
        };

      case 'saved':
        return {
          text: 'Saved',
          icon: (
            <Check
              size={STATUS_INDICATORS.autoSave.icon.size}
              color={STATUS_INDICATORS.autoSave.icon.color}
              strokeWidth={2.5}
            />
          ),
          color: colors.emerald[500],
        };

      case 'error':
        return {
          text: error || 'Failed to save',
          icon: (
            <AlertCircle
              size={STATUS_INDICATORS.autoSave.icon.size}
              color="#EF4444"
              strokeWidth={2.5}
            />
          ),
          color: '#EF4444',
        };

      case 'idle':
      default:
        // Show last saved time if available
        if (lastSaved) {
          const timeAgo = getTimeAgo(lastSaved);
          return {
            text: `Saved ${timeAgo}`,
            icon: (
              <Check
                size={STATUS_INDICATORS.autoSave.icon.size}
                color={colors.text.muted}
                strokeWidth={2.5}
              />
            ),
            color: colors.text.muted,
          };
        }
        return null;
    }
  };

  const display = getStatusDisplay();

  if (!display) {
    return null;
  }

  return (
    <MotiView
      from={{ opacity: 0, translateY: -10 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -10 }}
      transition={{
        type: 'timing',
        duration: 200,
      }}
    >
      <View
        style={styles.container}
        accessibilityRole="status"
        accessibilityLabel={`Save status: ${display.text}`}
        accessibilityLive="polite"
      >
        {display.icon}
        <Text style={[styles.text, { color: display.color }]}>{display.text}</Text>

        {/* Retry button for errors */}
        {status === 'error' && onRetry && (
          <TouchableOpacity
            onPress={onRetry}
            accessibilityRole="button"
            accessibilityLabel="Retry saving"
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    </MotiView>
  );
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Convert date to relative time string
 * e.g., "just now", "1m ago", "5m ago"
 */
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);

  if (diffSec < 10) {
    return 'just now';
  } else if (diffSec < 60) {
    return `${diffSec}s ago`;
  } else if (diffMin < 60) {
    return `${diffMin}m ago`;
  } else {
    const diffHour = Math.floor(diffMin / 60);
    return `${diffHour}h ago`;
  }
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    ...STATUS_INDICATORS.autoSave,
  },
  text: {
    ...STATUS_INDICATORS.autoSave.text,
  },
  retryButton: {
    marginLeft: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 4,
  },
  retryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
    letterSpacing: 0.5,
  },
});
