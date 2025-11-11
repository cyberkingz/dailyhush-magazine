/**
 * Nœma - Timing Constants
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

  // Navigation delays (milliseconds)
  navigation: {
    redirectDelay: 1500, // Delay before auto-redirecting (e.g., login after account detection)
    successMessageDelay: 1000, // How long to show success message before navigation
  },
} as const;

export type Timing = typeof timing;
