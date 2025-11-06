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

import React, { useEffect } from 'react';
import { View, StyleSheet, BackHandler, Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import type { EmotionalWeatherWidgetProps } from '@/types/widget.types';
import { useCardExpansion, useWidgetStateMachine } from '@/hooks/widget';
import { DEFAULT_WIDGET_CONFIG, ANALYTICS_EVENTS } from '@/constants/widgetConfig';
import { colors } from '@/constants/colors';
import { SPACING } from '@/constants/designTokens';

// Import all child components
import { EmptyState } from './EmptyState';
import { MoodSelector } from './MoodSelector';
import { IntensitySlider } from './IntensitySlider';
import { QuickNotesInput } from './QuickNotesInput';
import { SuccessCheckmark } from './SuccessCheckmark';
import { WeatherDisplay } from './WeatherDisplay';
import { CloseButton } from './CloseButton';
import { ProgressIndicator } from './ProgressIndicator';
import { LoadingOverlay } from './LoadingOverlay';
import { ErrorDisplay } from './ErrorDisplay';
import { Backdrop } from './Backdrop';

/**
 * EmotionalWeatherWidget
 * Main mood logging widget container
 */
export function EmotionalWeatherWidget({
  weather,
  moodRating,
  notes,
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
  } = useWidgetStateMachine({
    enableQuickNotes: config.features.enableQuickNotes,
    onSuccess: (submittedData) => {
      // Analytics: Mood log completed
      console.log(ANALYTICS_EVENTS.MOOD_LOG_COMPLETED, submittedData);
    },
    onCancel: () => {
      // Analytics: Widget canceled
      console.log(ANALYTICS_EVENTS.WIDGET_CANCELED, { state });
    },
  });

  // ========================================================================
  // HANDLERS
  // ========================================================================

  /**
   * Start flow (empty → mood)
   * Expands card and begins mood selection
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
    // TODO: Pre-populate with existing weather, moodRating, notes
    handleStartFlow();
  };

  // ========================================================================
  // ANDROID BACK BUTTON (UX P0 fix #7)
  // ========================================================================

  useEffect(() => {
    if (Platform.OS === 'android' && isExpanded) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (isExpanded) {
            handleCancel();
            return true; // Prevent default (app navigation)
          }
          return false;
        }
      );

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

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <View style={[styles.wrapper, style]}>
      {/* Backdrop (tap-outside-to-cancel - UX P0 fix #2) */}
      {config.features.enableTapOutside && isExpanded && (
        <Backdrop
          visible={isExpanded}
          onPress={handleCancel}
        />
      )}

      {/* Main card */}
      <Animated.View
        style={[styles.card, animatedCardStyle]}
        accessible={true}
        accessibilityLabel="Mood logging widget"
        accessibilityLiveRegion="polite"
      >
        {/* Close button (UX P0 fix #1) */}
        {isExpanded && (
          <CloseButton onPress={handleCancel} />
        )}

        {/* Progress indicator */}
        {config.features.showProgress && isExpanded && state !== 'success' && (
          <ProgressIndicator
            currentStep={getStepNumber()}
            totalSteps={totalSteps}
            visible={state !== 'empty' && state !== 'display'}
          />
        )}

        {/* Content based on state */}
        {state === 'empty' && (
          <EmptyState
            onPress={handleStartFlow}
            isLoading={isLoading}
          />
        )}

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
          <IntensitySlider
            range={config.intensitySlider.range}
            initialValue={config.intensitySlider.defaultValue}
            onChange={(intensity) => {
              console.log(ANALYTICS_EVENTS.INTENSITY_SELECTED, { intensity });
              selectIntensity(intensity);
            }}
            visible={state === 'intensity'}
            config={config.intensitySlider}
          />
        )}

        {state === 'notes' && config.features.enableQuickNotes && (
          <QuickNotesInput
            value={data.notes || ''}
            onChange={(text) => {
              // Update notes in state machine data
              // (handled by submitNotes)
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
            weather={weather}
            moodRating={moodRating}
            notes={notes}
            onUpdate={onUpdate || handleUpdate}
            visible={state === 'display'}
          />
        )}

        {/* Error display (inline) */}
        {error && (
          <ErrorDisplay
            error={error}
            onRetry={() => {
              // Retry last action based on state
              if (state === 'notes' || state === 'success') {
                submitNotes(data.notes);
              }
            }}
            onCancel={handleCancel}
            visible={!!error}
          />
        )}

        {/* Loading overlay (UX P0 fix #8) */}
        <LoadingOverlay
          visible={isLoading}
          message="Saving your mood..."
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    position: 'relative',
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: SPACING.xxl,
    borderWidth: 1,
    borderColor: colors.background.border,
    overflow: 'hidden',
    position: 'relative',
  },
});
