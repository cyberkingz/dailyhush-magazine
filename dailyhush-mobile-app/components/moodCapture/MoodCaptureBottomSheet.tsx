/**
 * DailyHush - Mood Capture Bottom Sheet (Orchestrator)
 *
 * Main orchestrator component that manages the 4-step mood capture flow.
 * Handles navigation, state management, data persistence, and animations.
 *
 * Flow:
 * 1. Mood Selection (required)
 * 2. Intensity Rating (required)
 * 3. Free Writing (optional but encouraged)
 * 4. Gentle Suggestion (informational)
 *
 * @see MOOD_CAPTURE_ROADMAP.md
 */

import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Modal, Pressable, Platform, StatusBar } from 'react-native';
import { MotiView } from 'moti';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BOTTOM_SHEET_CONFIG, ANIMATIONS } from '@/constants/moodCaptureDesign';
import { colors } from '@/constants/colors';
import { useMoodCapture, type MoodCaptureData } from '@/hooks/useMoodCapture';
import { ProgressIndicator } from './ProgressIndicator';
import { BackButton, CloseButton, ContinueButton, SecondaryButton } from './NavigationButtons';
import { MoodSelector } from './steps/MoodSelector';
import { IntensityScale } from './steps/IntensityScale';
import { FreeWriting } from './steps/FreeWriting';
import { GentleSuggestion } from './steps/GentleSuggestion';
import { createMoodEntry, updateMoodEntry } from '@/lib/mood-entries';
import type { MoodEntry } from '@/types/mood-entries';

// ============================================================================
// TYPES
// ============================================================================

interface MoodCaptureBottomSheetProps {
  /**
   * Whether bottom sheet is visible
   */
  visible: boolean;

  /**
   * Callback to close bottom sheet
   */
  onClose: () => void;

  /**
   * Callback when mood capture is completed
   * Receives the final mood entry data
   */
  onComplete?: (data: MoodCaptureData) => void;

  /**
   * Existing mood entry to edit (optional)
   * If provided, pre-fills the form
   */
  existingEntry?: MoodEntry;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Mood capture bottom sheet orchestrator
 * Manages the complete 4-step flow
 */
export function MoodCaptureBottomSheet({
  visible,
  onClose,
  onComplete,
  existingEntry,
}: MoodCaptureBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entryId, setEntryId] = useState<string | undefined>(existingEntry?.id);

  // Mood capture state management
  const moodCapture = useMoodCapture({
    initialStep: existingEntry ? 3 : 1, // If editing, start at writing step
    onComplete: handleFlowComplete,
  });

  // Pre-fill data if editing existing entry
  useEffect(() => {
    if (existingEntry) {
      // TODO: Pre-fill mood, intensity, content from existingEntry
    }
  }, [existingEntry]);

  // Get bottom sheet height for current step
  const getSheetHeight = () => {
    const heights = BOTTOM_SHEET_CONFIG.heights;
    switch (moodCapture.currentStep) {
      case 1:
        return heights.step1;
      case 2:
        return heights.step2;
      case 3:
        return heights.step3;
      case 4:
        return heights.step4;
      default:
        return heights.step1;
    }
  };

  /**
   * Handle close button press
   * Shows confirmation if user has entered data
   */
  const handleClose = () => {
    // TODO: Show confirmation dialog if data exists
    onClose();
    setTimeout(() => {
      moodCapture.reset();
    }, 300); // Reset after close animation
  };

  /**
   * Handle continue button press
   * Validates current step and advances
   */
  const handleContinue = async () => {
    // Step 4: Complete the flow
    if (moodCapture.currentStep === 4) {
      await handleSaveAndComplete();
      return;
    }

    // Other steps: advance normally
    moodCapture.goToNextStep();
  };

  /**
   * Handle "Save & Close" from Step 4
   */
  const handleSaveAndClose = async () => {
    await handleSaveAndComplete();
    onClose();
  };

  /**
   * Save mood entry and complete flow
   */
  async function handleSaveAndComplete() {
    if (!moodCapture.data.mood || !moodCapture.data.intensity) {
      console.warn('Cannot save: missing required data');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create or update mood entry
      const entryData = {
        mood: moodCapture.data.mood.id,
        intensity: moodCapture.data.intensity,
        content: moodCapture.data.writingContent || null,
        voice_transcription: moodCapture.data.voiceTranscription || null,
        suggested_activity: moodCapture.data.suggestion?.id || null,
        suggestion_accepted: moodCapture.data.suggestionAccepted || false,
      };

      if (entryId) {
        // Update existing entry
        await updateMoodEntry(entryId, entryData);
      } else {
        // Create new entry
        const newEntry = await createMoodEntry(entryData);
        setEntryId(newEntry.id);
      }

      // Notify parent
      onComplete?.(moodCapture.data);

      // Close and reset
      onClose();
      setTimeout(() => {
        moodCapture.reset();
        setIsSubmitting(false);
      }, 300);
    } catch (error) {
      console.error('Failed to save mood entry:', error);
      setIsSubmitting(false);
      // TODO: Show error toast
    }
  }

  /**
   * Flow complete callback
   */
  function handleFlowComplete(data: MoodCaptureData) {
    // Auto-save is already handled by handleSaveAndComplete
    console.log('Mood capture flow complete:', data);
  }

  /**
   * Auto-save for Step 3 (writing)
   */
  const handleAutoSave = async (content: string) => {
    if (!moodCapture.data.mood || !moodCapture.data.intensity) {
      return; // Can't save without mood and intensity
    }

    try {
      const entryData = {
        mood: moodCapture.data.mood.id,
        intensity: moodCapture.data.intensity,
        content: content || null,
      };

      if (entryId) {
        // Update existing entry
        await updateMoodEntry(entryId, entryData);
      } else {
        // Create draft entry
        const newEntry = await createMoodEntry(entryData);
        setEntryId(newEntry.id);
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
      throw error; // Propagate to useAutoSave for error handling
    }
  };

  /**
   * Render current step content
   */
  const renderStepContent = () => {
    switch (moodCapture.currentStep) {
      case 1:
        return (
          <MoodSelector
            selectedMood={moodCapture.data.mood?.id}
            onMoodSelect={(mood) => {
              moodCapture.setMood(mood);
              // Auto-advance after brief delay
              setTimeout(() => {
                moodCapture.goToNextStep();
              }, 400);
            }}
            autoAdvance
          />
        );

      case 2:
        return moodCapture.data.mood ? (
          <IntensityScale
            selectedMood={moodCapture.data.mood.id}
            selectedIntensity={moodCapture.data.intensity}
            onIntensitySelect={(intensity) => {
              moodCapture.setIntensity(intensity);
              // Auto-advance after brief delay
              setTimeout(() => {
                moodCapture.goToNextStep();
              }, 400);
            }}
            autoAdvance
          />
        ) : null;

      case 3:
        return (
          <FreeWriting
            selectedMood={moodCapture.data.mood?.id}
            content={moodCapture.data.writingContent || ''}
            onContentChange={moodCapture.setWritingContent}
            onSave={handleAutoSave}
            enableVoice
            showCharacterCount
          />
        );

      case 4:
        return moodCapture.data.mood && moodCapture.data.intensity ? (
          <GentleSuggestion
            selectedMood={moodCapture.data.mood.id}
            selectedIntensity={moodCapture.data.intensity}
            onAcceptSuggestion={(suggestion) => {
              moodCapture.setSuggestion(suggestion, true);
            }}
          />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <Pressable
        style={styles.backdrop}
        onPress={handleClose}
        accessibilityRole="button"
        accessibilityLabel="Close mood capture"
      >
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            type: 'timing',
            duration: ANIMATIONS.stepTransition.forward.duration,
          }}
          style={StyleSheet.absoluteFill}
        >
          <View style={[StyleSheet.absoluteFill, styles.backdropOverlay]} />
        </MotiView>
      </Pressable>

      {/* Bottom Sheet */}
      <MotiView
        from={{ translateY: 1000 }}
        animate={{ translateY: 0 }}
        exit={{ translateY: 1000 }}
        transition={{
          type: 'spring',
          damping: BOTTOM_SHEET_CONFIG.animation.entrance.springDamping,
          duration: BOTTOM_SHEET_CONFIG.animation.entrance.duration,
        }}
        style={[
          styles.sheet,
          {
            height: getSheetHeight(),
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom || 20,
          },
        ]}
      >
        {/* Top Navigation */}
        <View style={styles.topNav}>
          {/* Back Button (Steps 2-4) */}
          {moodCapture.currentStep > 1 && (
            <BackButton onPress={moodCapture.goToPreviousStep} />
          )}

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <ProgressIndicator currentStep={moodCapture.currentStep} totalSteps={4} />
          </View>

          {/* Close Button */}
          <CloseButton onPress={handleClose} />
        </View>

        {/* Step Content */}
        <View style={styles.content}>{renderStepContent()}</View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          {moodCapture.currentStep === 4 ? (
            // Step 4: Two button layout
            <>
              <SecondaryButton
                label="Save & Close"
                onPress={handleSaveAndClose}
                loading={isSubmitting}
              />
              <ContinueButton
                label="Complete"
                onPress={handleContinue}
                loading={isSubmitting}
              />
            </>
          ) : (
            // Steps 1-3: Single continue button
            <ContinueButton
              label={moodCapture.currentStep === 3 ? 'Continue' : 'Continue'}
              onPress={handleContinue}
              disabled={!moodCapture.canContinueFromStep(moodCapture.currentStep)}
            />
          )}
        </View>
      </MotiView>
    </Modal>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  backdropOverlay: {
    ...BOTTOM_SHEET_CONFIG.overlay,
  },
  sheet: {
    ...BOTTOM_SHEET_CONFIG.container,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
    height: 56,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});
