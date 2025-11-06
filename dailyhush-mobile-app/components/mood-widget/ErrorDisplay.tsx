/**
 * ErrorDisplay Component
 *
 * Inline error message with retry and cancel actions.
 * Provides user-friendly messages based on error type.
 *
 * @module components/mood-widget/ErrorDisplay
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertCircle, WifiOff, Clock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PillButton } from '@/components/ui/pill-button';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/designTokens';

interface ErrorDisplayProps {
  error: string | null;
  onRetry: () => void;
  onCancel: () => void;
  visible: boolean;
}

/**
 * Get user-friendly error message and icon based on error text
 */
function getErrorDetails(error: string): {
  title: string;
  message: string;
  icon: typeof AlertCircle;
  showRetry: boolean;
} {
  // Network/connection errors
  if (
    error.toLowerCase().includes('network') ||
    error.toLowerCase().includes('connection') ||
    error.toLowerCase().includes('fetch')
  ) {
    return {
      title: 'Connection Issue',
      message: "We couldn't reach our servers. Check your internet connection and try again.",
      icon: WifiOff,
      showRetry: true,
    };
  }

  // Timeout errors
  if (error.toLowerCase().includes('timeout') || error.toLowerCase().includes('timed out')) {
    return {
      title: 'Request Timed Out',
      message: 'The request took too long. Please try again.',
      icon: Clock,
      showRetry: true,
    };
  }

  // Auth errors
  if (
    error.toLowerCase().includes('unauthorized') ||
    error.toLowerCase().includes('authentication')
  ) {
    return {
      title: 'Session Expired',
      message: 'Your session has expired. Please sign in again.',
      icon: AlertCircle,
      showRetry: false,
    };
  }

  // Validation errors
  if (error.toLowerCase().includes('validation') || error.toLowerCase().includes('invalid')) {
    return {
      title: 'Invalid Data',
      message: 'Something went wrong with your submission. Please try again.',
      icon: AlertCircle,
      showRetry: true,
    };
  }

  // Default generic error
  return {
    title: 'Something Went Wrong',
    message: error || 'An unexpected error occurred. Please try again.',
    icon: AlertCircle,
    showRetry: true,
  };
}

/**
 * ErrorDisplay component
 * Shows error with retry/cancel options
 */
export function ErrorDisplay({ error, onRetry, onCancel, visible }: ErrorDisplayProps) {
  const [isRetrying, setIsRetrying] = React.useState(false);

  // Trigger error haptic when error appears
  useEffect(() => {
    if (visible && error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [visible, error]);

  // Reset retry state when error changes
  useEffect(() => {
    setIsRetrying(false);
  }, [error]);

  if (!visible || !error) {
    return null;
  }

  const { title, message, icon: Icon, showRetry } = getErrorDetails(error);

  const handleRetry = async () => {
    if (isRetrying) return; // Prevent double-click

    console.log('[ErrorDisplay] Try Again clicked');
    setIsRetrying(true);

    try {
      await onRetry();
    } catch (err) {
      console.error('[ErrorDisplay] Retry failed:', err);
    } finally {
      // Keep button disabled slightly longer to prevent rapid clicks
      setTimeout(() => {
        setIsRetrying(false);
      }, 500);
    }
  };

  const handleCancel = () => {
    if (isRetrying) return; // Prevent cancel during retry
    console.log('[ErrorDisplay] Close clicked');
    onCancel();
  };

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel={`Error: ${title}. ${message}`}
      accessibilityLiveRegion="assertive"
      accessibilityRole="alert">
      {/* Error icon */}
      <Icon size={40} color={colors.status.error} strokeWidth={2} />

      {/* Error title */}
      <Text style={styles.title}>{title}</Text>

      {/* Error message */}
      <Text style={styles.message}>{message}</Text>

      {/* Actions */}
      <View style={styles.actions}>
        {showRetry && (
          <PillButton
            label={isRetrying ? "Retrying..." : "Try Again"}
            onPress={handleRetry}
            variant="primary"
            style={styles.actionButton}
            disabled={isRetrying}
          />
        )}
        <PillButton
          label="Close"
          onPress={handleCancel}
          variant="secondary"
          style={[styles.actionButton, !showRetry && styles.fullWidthButton]}
          disabled={isRetrying}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    minHeight: 280, // Ensure enough space for content and buttons
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
  message: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
    lineHeight: 22,
    paddingHorizontal: SPACING.sm,
    maxWidth: 320, // Prevent message from being too wide
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    width: '100%',
    marginTop: 'auto', // Push buttons to bottom
    paddingHorizontal: SPACING.sm,
  },
  actionButton: {
    flex: 1,
    minWidth: 120, // Ensure buttons aren't too narrow
  },
  fullWidthButton: {
    flex: 1,
    minWidth: 120,
  },
});
