/**
 * Nœma - Voice to Text Button Component
 *
 * Floating microphone button for voice recording and transcription.
 * Designed for accessibility (55-70 age group) with clear visual feedback.
 *
 * Features:
 * - Multi-state display (idle → recording → processing → complete/error)
 * - Color-coded states (emerald → red → amber)
 * - Recording indicator overlay
 * - Permission handling
 * - Error recovery
 * - Haptic feedback
 *
 * @see MOOD_CAPTURE_ROADMAP.md
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { MotiView } from 'moti';
import { Mic, MicOff, AlertCircle } from 'lucide-react-native';
import { VOICE_BUTTON, RECORDING_INDICATOR, HAPTICS } from '@/constants/moodCaptureDesign';
import { colors } from '@/constants/colors';
import {
  useVoiceToText,
  type UseVoiceToTextOptions,
  type VoiceRecordingState,
} from '@/hooks/useVoiceToText';

// ============================================================================
// TYPES
// ============================================================================

interface VoiceToTextButtonProps {
  /**
   * Callback when transcription is ready
   * The parent should append this to the text area
   */
  onTranscription: (text: string) => void;

  /**
   * Optional callback for interim results (real-time transcription)
   */
  onInterim?: (text: string) => void;

  /**
   * Language code for transcription
   * @default 'en-US'
   */
  language?: string;

  /**
   * Maximum recording duration in milliseconds
   * @default 120000 (2 minutes)
   */
  maxDuration?: number;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Voice-to-text button with recording states
 * Shows as floating button over text area
 */
export function VoiceToTextButton({
  onTranscription,
  onInterim,
  language = 'en-US',
  maxDuration = 120000,
}: VoiceToTextButtonProps) {
  // Voice-to-text hook
  const voice = useVoiceToText({
    language,
    maxDuration,
    onTranscription,
    onInterim,
  });

  // Determine button style based on state
  const getButtonStyle = () => {
    switch (voice.state) {
      case 'recording':
        return VOICE_BUTTON.recording;
      case 'processing':
        return VOICE_BUTTON.processing;
      case 'error':
        return VOICE_BUTTON.error;
      default:
        return {};
    }
  };

  // Handle button press
  const handlePress = async () => {
    if (voice.state === 'error') {
      // Retry on error
      voice.reset();
    } else {
      // Toggle recording
      await voice.toggleRecording();
    }
  };

  // Get appropriate icon
  const renderIcon = () => {
    if (voice.state === 'processing') {
      return <ActivityIndicator size="small" color={colors.text.primary} />;
    }

    if (voice.state === 'error') {
      return (
        <AlertCircle
          size={VOICE_BUTTON.icon.size}
          color={VOICE_BUTTON.icon.color}
        />
      );
    }

    if (voice.isRecording) {
      return (
        <MicOff
          size={VOICE_BUTTON.icon.size}
          color={VOICE_BUTTON.icon.color}
        />
      );
    }

    return (
      <Mic
        size={VOICE_BUTTON.icon.size}
        color={VOICE_BUTTON.icon.color}
      />
    );
  };

  return (
    <>
      {/* Recording Indicator Overlay */}
      {voice.isRecording && <RecordingIndicator />}

      {/* Voice Button */}
      <MotiView
        from={{
          backgroundColor: VOICE_BUTTON.container.backgroundColor,
          scale: 1,
        }}
        animate={{
          backgroundColor:
            getButtonStyle().backgroundColor ||
            VOICE_BUTTON.container.backgroundColor,
          scale: voice.isRecording ? 1.05 : 1,
        }}
        transition={{
          type: 'timing',
          duration: 200,
        }}
        style={styles.container}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={handlePress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={
            voice.isRecording
              ? 'Stop voice recording'
              : voice.state === 'processing'
              ? 'Processing voice recording'
              : voice.state === 'error'
              ? 'Retry voice recording'
              : 'Start voice recording'
          }
          accessibilityHint={
            voice.isRecording
              ? 'Double tap to stop recording and transcribe your voice'
              : 'Double tap to start recording your voice for journaling'
          }
          accessibilityState={{
            disabled: voice.state === 'processing',
          }}
        >
          {renderIcon()}
        </TouchableOpacity>
      </MotiView>

      {/* Error Message */}
      {voice.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{voice.error.message}</Text>
          {voice.error.action && (
            <TouchableOpacity
              onPress={() => {
                if (voice.error?.code === 'permission_denied') {
                  voice.requestPermission();
                } else {
                  voice.reset();
                }
              }}
            >
              <Text style={styles.errorAction}>{voice.error.action}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </>
  );
}

// ============================================================================
// RECORDING INDICATOR
// ============================================================================

/**
 * Visual indicator shown at top of text area when recording
 * Includes pulsing dot animation
 */
function RecordingIndicator() {
  return (
    <View style={styles.indicatorContainer}>
      {/* Pulsing Dot */}
      <MotiView
        from={{ opacity: 1 }}
        animate={{ opacity: 0.3 }}
        transition={{
          type: 'timing',
          duration: 800,
          loop: true,
        }}
        style={styles.indicatorDot}
      />

      {/* Text */}
      <Text style={styles.indicatorText}>Recording...</Text>
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    ...VOICE_BUTTON.container,
  },
  button: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorContainer: {
    ...RECORDING_INDICATOR.container,
  },
  indicatorDot: {
    ...RECORDING_INDICATOR.dot,
  },
  indicatorText: {
    ...RECORDING_INDICATOR.text,
  },
  errorContainer: {
    position: 'absolute',
    bottom: -60,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.95)',
    borderRadius: 8,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  errorAction: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
});
