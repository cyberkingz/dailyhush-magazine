/**
 * useAudio Hook
 * Audio playback for guided protocols
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

export function useAudio() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const soundRef = useRef<Audio.Sound | null>(null);

  // Configure audio session
  useEffect(() => {
    configureAudio();
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const configureAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true, // Important for protocols
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (err) {
      console.error('Error configuring audio:', err);
    }
  };

  /**
   * Load an audio file
   */
  const loadAudio = useCallback(async (audioFile: string | number) => {
    setIsLoading(true);
    setError(null);

    try {
      // Unload previous sound
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      // Load new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        typeof audioFile === 'string' ? { uri: audioFile } : audioFile,
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );

      soundRef.current = newSound;
      setSound(newSound);

      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
      }

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load audio';
      setError(errorMessage);
      console.error('Error loading audio:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Play the loaded audio
   */
  const play = useCallback(async () => {
    if (!soundRef.current) return;

    try {
      await soundRef.current.playAsync();
      setIsPlaying(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (err) {
      console.error('Error playing audio:', err);
    }
  }, []);

  /**
   * Pause the audio
   */
  const pause = useCallback(async () => {
    if (!soundRef.current) return;

    try {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    } catch (err) {
      console.error('Error pausing audio:', err);
    }
  }, []);

  /**
   * Stop and reset the audio
   */
  const stop = useCallback(async () => {
    if (!soundRef.current) return;

    try {
      await soundRef.current.stopAsync();
      await soundRef.current.setPositionAsync(0);
      setIsPlaying(false);
      setPosition(0);
    } catch (err) {
      console.error('Error stopping audio:', err);
    }
  }, []);

  /**
   * Seek to a specific position (milliseconds)
   */
  const seek = useCallback(async (positionMs: number) => {
    if (!soundRef.current) return;

    try {
      await soundRef.current.setPositionAsync(positionMs);
      setPosition(positionMs);
    } catch (err) {
      console.error('Error seeking audio:', err);
    }
  }, []);

  /**
   * Playback status update callback
   */
  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setIsPlaying(status.isPlaying);

      // Auto-stop when finished
      if (status.didJustFinish) {
        setIsPlaying(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  /**
   * Format time for display (mm:ss)
   */
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    loadAudio,
    play,
    pause,
    stop,
    seek,
    isPlaying,
    isLoading,
    duration,
    position,
    error,
    formatTime,
  };
}
