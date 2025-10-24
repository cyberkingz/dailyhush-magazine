/**
 * DailyHush - Timing Constants
 * Centralized timing values for animations, delays, and protocol durations
 */

export const timing = {
  // Spiral interrupt protocol
  spiral: {
    totalSeconds: 90,
    steps: [
      { seconds: 0, instruction: 'Notice the spiral' },
      { seconds: 10, instruction: 'Name the pattern' },
      { seconds: 25, instruction: 'Shift your focus' },
      { seconds: 45, instruction: 'Take action' },
      { seconds: 70, instruction: 'Reflect' },
      { seconds: 90, instruction: 'Complete' },
    ],
  },

  // Debounce delays (milliseconds)
  debounce: {
    search: 300,
    input: 500,
    save: 1000,
  },

  // Animation durations (milliseconds)
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
  },

  // Haptic feedback delays
  haptic: {
    delay: 50,
  },
} as const;

export type Timing = typeof timing;
