/**
 * Nœma - useVoiceToText Hook
 *
 * Voice recording and transcription for mood capture writing step.
 * Uses Expo Speech Recognition for accessibility (55-70 demographic).
 *
 * Follows best practices:
 * - Permission handling with user-friendly messages
 * - State machine for recording states (idle → recording → processing → complete/error)
 * - Cleanup on unmount
 * - Error recovery
 *
 * @see MOOD_CAPTURE_ROADMAP.md
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import * as Speech from 'expo-speech';
// Note: Expo doesn't have built-in speech recognition yet
// Using placeholder for now - will need @react-native-voice/voice or similar
// For this implementation, we'll create the interface that would work with such a library

// ============================================================================
// TYPES
// ============================================================================

export type VoiceRecordingState = 'idle' | 'recording' | 'processing' | 'error';

export interface VoiceError {
  code:
    | 'permission_denied'
    | 'not_available'
    | 'recording_failed'
    | 'transcription_failed'
    | 'timeout';
  message: string;
  action?: string;
}

export interface UseVoiceToTextOptions {
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

  /**
   * Callback when transcription is ready
   */
  onTranscription?: (text: string) => void;

  /**
   * Callback for interim results (real-time transcription)
   */
  onInterim?: (text: string) => void;

  /**
   * Callback for errors
   */
  onError?: (error: VoiceError) => void;
}

export interface UseVoiceToTextReturn {
  /** Current recording state */
  state: VoiceRecordingState;

  /** Is currently recording */
  isRecording: boolean;

  /** Is processing transcription */
  isProcessing: boolean;

  /** Final transcription result */
  transcription: string;

  /** Interim transcription (real-time) */
  interimTranscription: string;

  /** Error information */
  error?: VoiceError;

  /** Has microphone permission */
  hasPermission: boolean;

  /** Start recording */
  startRecording: () => Promise<void>;

  /** Stop recording */
  stopRecording: () => Promise<void>;

  /** Toggle recording on/off */
  toggleRecording: () => Promise<void>;

  /** Request microphone permission */
  requestPermission: () => Promise<boolean>;

  /** Clear transcription and reset */
  reset: () => void;
}

// ============================================================================
// MOCK SPEECH RECOGNITION API
// ============================================================================

/**
 * Mock implementation for speech recognition
 * In production, replace with actual library like @react-native-voice/voice
 */
class MockSpeechRecognition {
  private listeners: Map<string, Function[]> = new Map();
  private isRecording = false;
  private mockTimer: NodeJS.Timeout | null = null;

  start() {
    this.isRecording = true;
    this.emit('start');

    // Simulate transcription after 2 seconds
    this.mockTimer = setTimeout(() => {
      this.emit('result', [
        { transcript: 'This is a test transcription from voice input' },
      ]);
      this.stop();
    }, 2000);
  }

  stop() {
    this.isRecording = false;
    if (this.mockTimer) {
      clearTimeout(this.mockTimer);
      this.mockTimer = null;
    }
    this.emit('end');
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, ...args: any[]) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(...args));
    }
  }

  async requestPermission(): Promise<boolean> {
    // In real implementation, this would request actual permission
    return true;
  }

  async checkPermission(): Promise<boolean> {
    return true;
  }
}

// Singleton instance
const speechRecognition = new MockSpeechRecognition();

// ============================================================================
// HOOK
// ============================================================================

/**
 * Voice-to-text hook for recording and transcription
 *
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * const voice = useVoiceToText({
 *   onTranscription: (text) => {
 *     setWritingContent(prev => `${prev} ${text}`);
 *   },
 * });
 *
 * <TouchableOpacity onPress={voice.toggleRecording}>
 *   <Mic color={voice.isRecording ? 'red' : 'emerald'} />
 * </TouchableOpacity>
 * ```
 */
export function useVoiceToText(
  options: UseVoiceToTextOptions = {}
): UseVoiceToTextReturn {
  const {
    language = 'en-US',
    maxDuration = 120000, // 2 minutes
    onTranscription,
    onInterim,
    onError,
  } = options;

  // State
  const [state, setState] = useState<VoiceRecordingState>('idle');
  const [transcription, setTranscription] = useState('');
  const [interimTranscription, setInterimTranscription] = useState('');
  const [error, setError] = useState<VoiceError | undefined>();
  const [hasPermission, setHasPermission] = useState(false);

  // Refs
  const maxDurationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Derived state
  const isRecording = state === 'recording';
  const isProcessing = state === 'processing';

  // ========================================================================
  // PERMISSION
  // ========================================================================

  /**
   * Request microphone permission
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const granted = await speechRecognition.requestPermission();
      setHasPermission(granted);

      if (!granted) {
        const permissionError: VoiceError = {
          code: 'permission_denied',
          message: 'Microphone access is required to use voice-to-text.',
          action: 'Open Settings',
        };
        setError(permissionError);
        onError?.(permissionError);
      }

      return granted;
    } catch (err) {
      console.error('Permission request failed:', err);
      setHasPermission(false);
      return false;
    }
  }, [onError]);

  /**
   * Check permission on mount
   */
  useEffect(() => {
    speechRecognition.checkPermission().then((granted) => {
      if (isMountedRef.current) {
        setHasPermission(granted);
      }
    });
  }, []);

  // ========================================================================
  // RECORDING CONTROL
  // ========================================================================

  /**
   * Start recording
   */
  const startRecording = useCallback(async () => {
    // Check permission first
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) return;
    }

    try {
      // Reset previous state
      setError(undefined);
      setTranscription('');
      setInterimTranscription('');
      setState('recording');

      // Start recognition
      speechRecognition.start();

      // Set max duration timer
      maxDurationTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          stopRecording();
        }
      }, maxDuration);
    } catch (err) {
      const recordingError: VoiceError = {
        code: 'recording_failed',
        message: 'Could not start recording. Please check your microphone.',
        action: 'Try Again',
      };
      setError(recordingError);
      setState('error');
      onError?.(recordingError);
    }
  }, [hasPermission, requestPermission, maxDuration, onError]);

  /**
   * Stop recording
   */
  const stopRecording = useCallback(async () => {
    if (state !== 'recording') return;

    // Clear max duration timer
    if (maxDurationTimerRef.current) {
      clearTimeout(maxDurationTimerRef.current);
      maxDurationTimerRef.current = null;
    }

    try {
      setState('processing');
      speechRecognition.stop();

      // Processing will transition to idle when result arrives
    } catch (err) {
      const stopError: VoiceError = {
        code: 'recording_failed',
        message: 'Error stopping recording.',
      };
      setError(stopError);
      setState('error');
      onError?.(stopError);
    }
  }, [state, onError]);

  /**
   * Toggle recording on/off
   */
  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  // ========================================================================
  // SPEECH RECOGNITION EVENTS
  // ========================================================================

  useEffect(() => {
    /**
     * Handle recognition start
     */
    const handleStart = () => {
      if (isMountedRef.current) {
        setState('recording');
      }
    };

    /**
     * Handle recognition results
     */
    const handleResult = (results: any[]) => {
      if (!isMountedRef.current) return;

      const result = results[0];
      const text = result.transcript || '';

      // Check if this is a final result or interim
      if (result.isFinal) {
        setTranscription(text);
        onTranscription?.(text);
        setState('idle');
      } else {
        setInterimTranscription(text);
        onInterim?.(text);
      }
    };

    /**
     * Handle recognition end
     */
    const handleEnd = () => {
      if (isMountedRef.current) {
        setState('idle');
      }
    };

    /**
     * Handle recognition error
     */
    const handleError = (errorEvent: any) => {
      if (!isMountedRef.current) return;

      const transcriptionError: VoiceError = {
        code: 'transcription_failed',
        message:
          errorEvent.message ||
          'Could not transcribe audio. Please try speaking again.',
        action: 'Try Again',
      };

      setError(transcriptionError);
      setState('error');
      onError?.(transcriptionError);
    };

    // Register listeners
    speechRecognition.on('start', handleStart);
    speechRecognition.on('result', handleResult);
    speechRecognition.on('end', handleEnd);
    speechRecognition.on('error', handleError);

    // Cleanup
    return () => {
      speechRecognition.off('start', handleStart);
      speechRecognition.off('result', handleResult);
      speechRecognition.off('end', handleEnd);
      speechRecognition.off('error', handleError);
    };
  }, [onTranscription, onInterim, onError]);

  // ========================================================================
  // RESET
  // ========================================================================

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setTranscription('');
    setInterimTranscription('');
    setError(undefined);
    setState('idle');
  }, []);

  // ========================================================================
  // CLEANUP
  // ========================================================================

  useEffect(() => {
    return () => {
      isMountedRef.current = false;

      // Stop recording if active
      if (state === 'recording') {
        speechRecognition.stop();
      }

      // Clear timers
      if (maxDurationTimerRef.current) {
        clearTimeout(maxDurationTimerRef.current);
      }
    };
  }, [state]);

  // ========================================================================
  // RETURN
  // ========================================================================

  return {
    state,
    isRecording,
    isProcessing,
    transcription,
    interimTranscription,
    error,
    hasPermission,
    startRecording,
    stopRecording,
    toggleRecording,
    requestPermission,
    reset,
  };
}

/**
 * Helper: Format recording duration
 */
export function formatRecordingDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
