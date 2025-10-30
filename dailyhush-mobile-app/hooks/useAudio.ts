/**
 * useAudio Hook
 * Audio playback for guided protocols using expo-audio
 */

import { useState, useEffect, useCallback } from 'react';
import { useAudioPlayer, AudioSource } from 'expo-audio';
import * as Haptics from 'expo-haptics';

export function useAudio() {
  const player = useAudioPlayer();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSource, setCurrentSource] = useState<AudioSource | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        if (player && currentSource) {
          player.remove();
        }
      } catch {
        // Ignore cleanup errors
      }
    };
  }, [currentSource]);

  /**
   * Load an audio file
   */
  const loadAudio = useCallback(
    async (audioSource: AudioSource, options?: { loop?: boolean }) => {
      setIsLoading(true);
      setError(null);

      try {
        // Replace current source
        player.replace(audioSource);

        // Set looping
        player.loop = options?.loop || false;

        setCurrentSource(audioSource);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load audio';
        setError(errorMessage);
        console.error('Error loading audio:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [player]
  );

  /**
   * Play the loaded audio
   */
  const play = useCallback(() => {
    if (!currentSource) return;

    try {
      player.play();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (err) {
      console.error('Error playing audio:', err);
    }
  }, [player, currentSource]);

  /**
   * Pause the audio
   */
  const pause = useCallback(() => {
    try {
      if (player && currentSource) {
        player.pause();
      }
    } catch {
      // Silently handle pause errors
    }
  }, [player, currentSource]);

  /**
   * Stop and reset the audio
   */
  const stop = useCallback(() => {
    try {
      if (player && currentSource) {
        player.pause();
        player.currentTime = 0;
      }
    } catch {
      // Silently handle stop errors - player may already be removed
    }
  }, [player, currentSource]);

  /**
   * Seek to a specific position (seconds)
   */
  const seek = useCallback(
    (positionSeconds: number) => {
      try {
        if (player && currentSource) {
          player.currentTime = positionSeconds;
        }
      } catch {
        // Silently handle seek errors
      }
    },
    [player, currentSource]
  );

  /**
   * Format time for display (mm:ss)
   */
  const formatTime = (seconds: number) => {
    const totalSeconds = Math.floor(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    loadAudio,
    play,
    pause,
    stop,
    seek,
    isPlaying: player.playing,
    isLoading,
    duration: player.duration,
    position: player.currentTime,
    error,
    formatTime,
    volume: player.volume,
    setVolume: (volume: number) => {
      player.volume = volume;
    },
  };
}
