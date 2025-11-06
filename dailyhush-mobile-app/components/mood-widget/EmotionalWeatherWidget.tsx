/**
 * EmotionalWeatherWidget Component
 *
 * Main container orchestrating the inline mood logging widget.
 * Manages state transitions, animations, and user interactions.
 *
 * Flow: empty → mood → intensity → notes → success → display
 *
 * ADDRESSES ALL UX P0 FINDINGS:
 * #1 Close button always visible
 * #2 Tap-outside-to-cancel with backdrop
 * #3 Slider tap alternative (in IntensitySlider)
 * #4 Intensity scale labels (in IntensitySlider)
 * #5 Notes optional with equal-weight buttons (in QuickNotesInput)
 * #6 Screen reader announcements (accessibility labels throughout)
 * #7 Android back button handler
 * #8 Loading states
 * #9 Update vs. log flow
 *
 * @module components/mood-widget/EmotionalWeatherWidget
 */

import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, BackHandler, Platform } from 'react-native';
import * as Network from 'expo-network';
import Animated from 'react-native-reanimated';
import type { EmotionalWeatherWidgetProps } from '@/types/widget.types';
import { useCardExpansion, useWidgetStateMachine } from '@/hooks/widget';
import {
  DEFAULT_WIDGET_CONFIG,
  ANALYTICS_EVENTS,
  ACCESSIBILITY_LABELS,
} from '@/constants/widgetConfig';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/designTokens';

// Import all child components
import { EmptyState } from './EmptyState';
import { MoodSelector } from './MoodSelector';
import { IntensityCircular } from './IntensityCircular';
import { QuickNotesInput } from './QuickNotesInput';
import { SuccessCheckmark } from './SuccessCheckmark';
import { WeatherDisplay } from './WeatherDisplay';
import { CloseButton } from './CloseButton';
import { ProgressIndicator } from './ProgressIndicator';
import { LoadingOverlay } from './LoadingOverlay';
import { ErrorDisplay } from './ErrorDisplay';
import { OfflineIndicator } from './OfflineIndicator';
import { Backdrop } from './Backdrop';
import { PillButton } from '@/components/ui/pill-button';

/**
 * EmotionalWeatherWidget
 * Main mood logging widget container
 */
export function EmotionalWeatherWidget({
  weather,
  moodRating,
  notes,
  createdAt,
  updatedAt,
  onMoodSubmit,
  onUpdate,
  config: customConfig,
  style,
}: EmotionalWeatherWidgetProps) {
  // Merge custom config with defaults
  const config = { ...DEFAULT_WIDGET_CONFIG, ...customConfig };

  // Card expansion animation
  const { expand, collapse, animatedCardStyle, isExpanded } = useCardExpansion({
    collapsedHeight: config.dimensions.collapsedHeight,
    expandedHeight: config.dimensions.expandedHeight,
    expansionDuration: config.animation.expansionDuration,
    collapseDuration: config.animation.collapseDuration,
  });

  // Widget state machine
  const {
    state,
    data,
    startFlow,
    selectMood,
    selectIntensity,
    submitNotes,
    skipNotes,
    completeSuccess,
    reset,
    cancel,
    isLoading,
    error,
    clearError,
    updateNotes,
  } = useWidgetStateMachine({
    enableQuickNotes: config.features.enableQuickNotes,
    onSuccess: (submittedData) => {
      // Analytics: Mood log completed
      console.log(ANALYTICS_EVENTS.MOOD_LOG_COMPLETED, submittedData);

      // Call parent callback to refresh home screen
      onMoodSubmit?.({
        mood: submittedData.mood,
        intensity: submittedData.intensity,
        notes: submittedData.notes,
      });
    },
    onCancel: () => {
      // Analytics: Widget canceled
      console.log(ANALYTICS_EVENTS.WIDGET_CANCELED, { state });
    },
  });

  // ========================================================================
  // INITIALIZE STATE BASED ON EXISTING DATA
  // ========================================================================

  // When mood data is loaded from props, transition to display state
  useEffect(() => {
    console.log('[Widget] Checking state sync:', {
      hasWeather: !!weather,
      hasMoodRating: moodRating !== undefined,
      currentState: state,
      weather,
      moodRating,
      notes,
      hasInternalData: !!(data.mood && data.intensity),
    });

    // Transition to display when mood data is present
    if (weather && moodRating !== undefined && state === 'empty') {
      console.log('[Widget] ✅ Mood data present, transitioning to display state');
      completeSuccess();
    }
    // Reset to empty when mood data is cleared (new day)
    // BUT only if we don't have internal data (meaning it's not a fresh submission)
    else if (!weather && !moodRating && state === 'display' && !data.mood && !data.intensity) {
      console.log('[Widget] ⚠️ Mood data cleared externally, resetting to empty state');
      reset();
    }
  }, [weather, moodRating, state, data.mood, data.intensity, completeSuccess, reset]);

  // ========================================================================
  // NETWORK STATUS
  // ========================================================================

  const [isOffline, setIsOffline] = useState(false);

  // Check network status on mount and when expanded
  useEffect(() => {
    async function checkNetwork() {
      try {
        const networkState = await Network.getNetworkStateAsync();
        const offline = !networkState.isConnected || !networkState.isInternetReachable;
        setIsOffline(offline);
      } catch {
        // Assume online if check fails
        setIsOffline(false);
      }
    }

    if (isExpanded) {
      checkNetwork();
      // Recheck every 5 seconds while widget is open
      const interval = setInterval(checkNetwork, 5000);
      return () => clearInterval(interval);
    }
  }, [isExpanded]);

  // ========================================================================
  // HANDLERS
  // ========================================================================

  /**
   * Start flow (empty → mood)
   * Expands card and begins mood selection
   *
   * TODO: Add shared element transition animation where Log Mood button
   * morphs and moves UP to become the first mood choice button.
   * This requires Reanimated shared element transitions.
   */
  const handleStartFlow = () => {
    expand();
    startFlow();

    // Analytics: Widget expanded
    console.log(ANALYTICS_EVENTS.WIDGET_EXPANDED, {
      source: 'home_page',
      hasExistingMood: !!(weather && moodRating),
    });
  };

  /**
   * Cancel flow
   * Collapses card and resets state
   */
  const handleCancel = () => {
    console.log('[Widget] Cancel clicked');
    clearError(); // Ensure error is cleared
    collapse();
    cancel();
  };

  /**
   * Complete success animation
   * Collapses card and transitions to display
   */
  const handleCompleteSuccess = () => {
    collapse();
    completeSuccess();
  };

  /**
   * Update existing mood
   * Re-opens widget with pre-populated data
   */
  const handleUpdate = () => {
    console.log('[Widget] Update button clicked');
    console.log('[Widget] Current state:', state);
    console.log('[Widget] Existing data:', { weather, moodRating, notes });

    // TODO: Pre-populate with existing weather, moodRating, notes
    handleStartFlow();
  };

  // ========================================================================
  // ANDROID BACK BUTTON (UX P0 fix #7)
  // ========================================================================

  useEffect(() => {
    if (Platform.OS === 'android' && isExpanded) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (isExpanded) {
          handleCancel();
          return true; // Prevent default (app navigation)
        }
        return false;
      });

      return () => backHandler.remove();
    }
  }, [isExpanded]);

  // ========================================================================
  // STEP CALCULATION
  // ========================================================================

  const getStepNumber = () => {
    switch (state) {
      case 'mood':
        return 1;
      case 'intensity':
        return 2;
      case 'notes':
        return 3;
      default:
        return 1;
    }
  };

  const totalSteps = config.features.enableQuickNotes ? 3 : 2;
  const cardPaddingStyle = useMemo(
    () => ({
      paddingHorizontal: config.dimensions.cardPadding,
      paddingTop: config.dimensions.cardPadding + SPACING.md,
      paddingBottom:
        config.dimensions.cardPadding +
        (state === 'empty' || state === 'display' ? SPACING.xxxl + SPACING.xl : 0), // Extra 20px for balance
    }),
    [config.dimensions.cardPadding, state]
  );

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <View style={[styles.wrapper, style]}>
      {/* Backdrop (tap-outside-to-cancel - UX P0 fix #2) */}
      {config.features.enableTapOutside && isExpanded && (
        <Backdrop visible={isExpanded} onPress={handleCancel} />
      )}

      {/* Main card */}
      <Animated.View
        style={[styles.card, animatedCardStyle, cardPaddingStyle]}
        accessible={true}
        accessibilityLabel="Mood logging widget"
        accessibilityLiveRegion="polite">
        {/* Close button (UX P0 fix #1) */}
        {isExpanded && <CloseButton onPress={handleCancel} />}

        {/* Progress indicator */}
        {config.features.showProgress && isExpanded && state !== 'success' && (
          <ProgressIndicator
            currentStep={getStepNumber()}
            totalSteps={totalSteps}
            visible={state !== 'empty' && state !== 'display'}
          />
        )}

        {/* Offline indicator */}
        {isExpanded && isOffline && <OfflineIndicator visible={isOffline} />}

        {/* Content based on state - or error if present */}
        {(() => {
          console.log('[Widget] Rendering state:', state, 'hasError:', !!error);
          return null;
        })()}
        {error ? (
          <ErrorDisplay
            error={error}
            onRetry={async () => {
              console.log('[Widget] Retry clicked. Current data:', {
                mood: data.mood,
                intensity: data.intensity,
                hasNotes: !!data.notes,
                currentState: state,
              });

              // Clear error first
              clearError();

              // Retry submission with existing data
              if (data.mood && data.intensity) {
                console.log('[Widget] Retrying submission with saved data...');
                try {
                  await submitNotes(data.notes);
                } catch (err) {
                  console.error('[Widget] Retry submission failed:', err);
                }
              } else {
                // Data incomplete - this shouldn't happen but handle gracefully
                console.log('[Widget] Data incomplete, restarting flow');
                handleCancel();
              }
            }}
            onCancel={() => {
              clearError();
              handleCancel();
            }}
            visible={!!error}
          />
        ) : (
          <>
            {state === 'empty' && <EmptyState isLoading={isLoading} />}

            {state === 'mood' && (
              <MoodSelector
                moods={config.moodSelector.moods}
                onSelect={(mood) => {
                  console.log(ANALYTICS_EVENTS.MOOD_SELECTED, { mood: mood.value });
                  selectMood(mood.value);
                }}
                selected={data.mood}
                visible={state === 'mood'}
                config={config.moodSelector}
              />
            )}

            {state === 'intensity' && data.mood && (
              <IntensityCircular
                selectedIntensity={data.intensity}
                onIntensitySelect={(intensity) => {
                  console.log(ANALYTICS_EVENTS.INTENSITY_SELECTED, { intensity });
                  selectIntensity(intensity);
                }}
              />
            )}

            {state === 'notes' && config.features.enableQuickNotes && (
              <QuickNotesInput
                value={data.notes || ''}
                onChange={(text) => {
                  updateNotes(text);
                }}
                onSkip={async () => {
                  console.log(ANALYTICS_EVENTS.NOTES_SKIPPED);
                  await skipNotes();
                }}
                onSubmit={async () => {
                  console.log(ANALYTICS_EVENTS.NOTES_SUBMITTED, {
                    notesLength: data.notes?.length || 0,
                  });
                  await submitNotes(data.notes);
                }}
                visible={state === 'notes'}
                config={config.quickNotes}
                isSubmitting={isLoading}
              />
            )}

            {state === 'success' && (
              <SuccessCheckmark
                visible={state === 'success'}
                onComplete={handleCompleteSuccess}
                config={config.success}
              />
            )}

            {state === 'display' && weather && moodRating !== undefined && (
              <WeatherDisplay
                weather={weather as any}
                moodRating={moodRating}
                notes={notes}
                createdAt={createdAt}
                updatedAt={updatedAt}
                onUpdate={onUpdate || handleUpdate}
                visible={state === 'display'}
              />
            )}
          </>
        )}

        {/* Loading overlay (UX P0 fix #8) */}
        <LoadingOverlay visible={isLoading} message="Saving your mood..." />
      </Animated.View>
      {/* Action button - hidden when error is showing */}
      {!error && (state === 'empty' || state === 'display') && (
        <PillButton
          label={state === 'empty' ? (isLoading ? 'Logging...' : 'Log Mood') : 'Update Mood'}
          onPress={state === 'empty' ? handleStartFlow : handleUpdate}
          disabled={isLoading}
          style={styles.actionButton}
          accessibilityHint={
            state === 'empty'
              ? ACCESSIBILITY_LABELS.emptyState.logMoodHint
              : ACCESSIBILITY_LABELS.weatherDisplay.updateHint
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    position: 'relative',
    marginBottom: SPACING.xxl * 2, // 48px - proper spacing for floating button (match profile page)
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: SPACING.xxl,
    borderWidth: 1,
    borderColor: colors.lime[600] + '20',
    overflow: 'hidden',
    position: 'relative',
  },
  actionButton: {
    position: 'absolute',
    bottom: -SPACING.lg,
    alignSelf: 'center',
    width: 'auto',
  },
});
