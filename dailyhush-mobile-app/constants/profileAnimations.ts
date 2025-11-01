/**
 * DailyHush - Profile Page Animation System
 * Calm, therapeutic animations for profile components
 * Using React Native Reanimated and Moti
 */

/**
 * Animation Durations (milliseconds)
 * Calm, not rushed - therapeutic feel
 */
export const animationDurations = {
  instant: 0, // No animation
  fast: 150, // Quick feedback (button press)
  normal: 300, // Standard transitions
  slow: 500, // Gentle, emphasized transitions
  relaxed: 800, // Very slow, calming
  breathing: 4000, // Breathing animation cycle
} as const;

/**
 * Animation Easing Curves
 * Smooth, natural motion
 */
export const animationEasing = {
  // Standard easings
  linear: [0, 0, 1, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1],

  // Custom therapeutic easings
  gentle: [0.25, 0.46, 0.45, 0.94], // Very smooth
  calm: [0.4, 0, 0.2, 1], // Material Design emphasized
  therapeutic: [0.34, 1.56, 0.64, 1], // Slight bounce for delight
  breathing: [0.37, 0, 0.63, 1], // Smooth breathing rhythm
} as const;

/**
 * Fade Animations
 * For component entrance and exit
 */
export const fadeAnimations = {
  // Fade in from 0 to 1 opacity
  fadeIn: {
    duration: animationDurations.normal,
    from: { opacity: 0 },
    to: { opacity: 1 },
    easing: 'easeOut' as const,
  },

  // Fade in with slide up
  fadeInUp: {
    duration: animationDurations.slow,
    from: { opacity: 0, translateY: 20 },
    to: { opacity: 1, translateY: 0 },
    easing: 'calm' as const,
  },

  // Fade in with slide down
  fadeInDown: {
    duration: animationDurations.slow,
    from: { opacity: 0, translateY: -20 },
    to: { opacity: 1, translateY: 0 },
    easing: 'calm' as const,
  },

  // Fade out
  fadeOut: {
    duration: animationDurations.fast,
    from: { opacity: 1 },
    to: { opacity: 0 },
    easing: 'easeIn' as const,
  },
} as const;

/**
 * Scale Animations
 * For press states and emphasis
 */
export const scaleAnimations = {
  // Gentle press down
  pressDown: {
    duration: animationDurations.fast,
    from: { scale: 1 },
    to: { scale: 0.97 },
    easing: 'easeOut' as const,
  },

  // Release from press
  pressRelease: {
    duration: animationDurations.normal,
    from: { scale: 0.97 },
    to: { scale: 1 },
    easing: 'therapeutic' as const, // Slight bounce
  },

  // Pop in (entrance)
  popIn: {
    duration: animationDurations.slow,
    from: { scale: 0.8, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    easing: 'therapeutic' as const,
  },

  // Gentle pulse (attention)
  pulse: {
    duration: animationDurations.breathing,
    from: { scale: 1 },
    to: { scale: 1.05 },
    loop: true,
    easing: 'breathing' as const,
  },
} as const;

/**
 * Scroll Parallax Parameters
 * For hero card and background elements
 */
export const parallaxConfig = {
  // Hero card - slower than scroll
  heroCard: {
    multiplier: 0.3, // 30% of scroll speed
    maxOffset: 100, // Maximum offset in pixels
  },

  // Background gradient - very slow
  backgroundGradient: {
    multiplier: 0.15, // 15% of scroll speed
    maxOffset: 150,
  },

  // Floating icons - medium speed
  floatingIcons: {
    multiplier: 0.5, // 50% of scroll speed
    maxOffset: 80,
  },
} as const;

/**
 * Stagger Animation
 * For lists of cards appearing in sequence
 */
export const staggerConfig = {
  // Pattern insight cards
  insightCards: {
    baseDelay: 0, // Start immediately
    incrementDelay: 100, // 100ms between each card
    maxCards: 10, // Stagger up to 10 cards
    animation: fadeAnimations.fadeInUp,
  },

  // Product cards
  productCards: {
    baseDelay: 200, // Wait 200ms before starting
    incrementDelay: 80,
    maxCards: 8,
    animation: fadeAnimations.fadeInUp,
  },

  // Timeline data points
  timelinePoints: {
    baseDelay: 300,
    incrementDelay: 50,
    maxCards: 30,
    animation: fadeAnimations.fadeIn,
  },
} as const;

/**
 * Loading State Animations
 * For skeleton loaders and spinners
 */
export const loadingAnimations = {
  // Skeleton shimmer effect
  shimmer: {
    duration: 1500,
    from: { opacity: 0.4, translateX: -100 },
    to: { opacity: 1, translateX: 100 },
    loop: true,
    easing: 'linear' as const,
  },

  // Breathing circle (pull to refresh)
  breathing: {
    duration: animationDurations.breathing,
    from: { scale: 0.9, opacity: 0.5 },
    to: { scale: 1, opacity: 1 },
    loop: true,
    easing: 'breathing' as const,
  },

  // Spinner rotation
  spinner: {
    duration: 1000,
    from: { rotate: '0deg' },
    to: { rotate: '360deg' },
    loop: true,
    easing: 'linear' as const,
  },
} as const;

/**
 * Gesture Animation Parameters
 * For swipe, drag, and interactive gestures
 */
export const gestureConfig = {
  // Swipeable card dismiss
  swipeDismiss: {
    threshold: 120, // Pixels to swipe before dismiss
    velocity: 0.5, // Minimum velocity for quick swipe
    snapDuration: 300,
    easing: 'calm' as const,
  },

  // Pull to refresh
  pullToRefresh: {
    threshold: 80, // Pull distance to trigger
    maxPull: 120, // Maximum pull distance
    snapDuration: 400,
    easing: 'therapeutic' as const,
  },

  // Drag to reorder
  dragReorder: {
    activationDelay: 150, // Long press duration
    liftScale: 1.05, // Scale when lifted
    dropDuration: 200,
    easing: 'calm' as const,
  },
} as const;

/**
 * Micro-interaction Timings
 * For subtle feedback moments
 */
export const microInteractions = {
  // Haptic feedback timing
  haptic: {
    delay: 0, // Immediate
    type: 'light' as const, // Light, Medium, or Heavy
  },

  // Button press feedback
  buttonPress: {
    scaleDownDuration: animationDurations.fast,
    scaleUpDuration: animationDurations.normal,
    hapticDelay: 0,
  },

  // Toggle switch
  toggle: {
    duration: animationDurations.normal,
    easing: 'therapeutic' as const,
    hapticDelay: 50,
  },

  // Checkbox check
  checkbox: {
    duration: animationDurations.fast,
    easing: 'easeOut' as const,
    hapticDelay: 0,
  },
} as const;

/**
 * Page Transition Animations
 * For navigation between screens
 */
export const pageTransitions = {
  // Slide from right (default)
  slideRight: {
    duration: animationDurations.normal,
    from: { translateX: 300, opacity: 0 },
    to: { translateX: 0, opacity: 1 },
    easing: 'calm' as const,
  },

  // Slide from bottom (modal)
  slideUp: {
    duration: animationDurations.slow,
    from: { translateY: 300, opacity: 0.9 },
    to: { translateY: 0, opacity: 1 },
    easing: 'calm' as const,
  },

  // Fade (subtle)
  fade: {
    duration: animationDurations.normal,
    from: { opacity: 0 },
    to: { opacity: 1 },
    easing: 'easeOut' as const,
  },

  // Scale up (emphasis)
  scaleUp: {
    duration: animationDurations.slow,
    from: { scale: 0.95, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    easing: 'therapeutic' as const,
  },
} as const;

/**
 * Chart/Timeline Animations
 * For data visualization components
 */
export const chartAnimations = {
  // Line drawing animation
  lineDraw: {
    duration: animationDurations.relaxed,
    from: { strokeDashoffset: 1000 },
    to: { strokeDashoffset: 0 },
    easing: 'calm' as const,
  },

  // Bar chart growth
  barGrow: {
    duration: animationDurations.slow,
    from: { scaleY: 0, transformOrigin: 'bottom' },
    to: { scaleY: 1, transformOrigin: 'bottom' },
    easing: 'therapeutic' as const,
  },

  // Dot/point appearance
  pointAppear: {
    duration: animationDurations.normal,
    from: { scale: 0, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    easing: 'therapeutic' as const,
  },

  // Gradient fill
  gradientFill: {
    duration: animationDurations.relaxed,
    from: { opacity: 0, scaleY: 0 },
    to: { opacity: 0.3, scaleY: 1 },
    easing: 'calm' as const,
  },
} as const;

/**
 * Growth Garden Animations
 * Special animations for the growth garden component
 */
export const gardenAnimations = {
  // Plant growing from seed
  plantGrow: {
    duration: 2000,
    from: { scale: 0.3, translateY: 20, opacity: 0 },
    to: { scale: 1, translateY: 0, opacity: 1 },
    easing: 'therapeutic' as const,
  },

  // Gentle sway (wind effect)
  sway: {
    duration: 3000,
    from: { rotate: '-2deg' },
    to: { rotate: '2deg' },
    loop: true,
    easing: 'breathing' as const,
  },

  // Bloom effect
  bloom: {
    duration: 1500,
    from: { scale: 0.8, rotate: '-10deg', opacity: 0 },
    to: { scale: 1, rotate: '0deg', opacity: 1 },
    easing: 'therapeutic' as const,
  },
} as const;

/**
 * Helper Types
 */
export type AnimationDuration = keyof typeof animationDurations;
export type AnimationEasing = keyof typeof animationEasing;
export type FadeAnimation = keyof typeof fadeAnimations;
export type ScaleAnimation = keyof typeof scaleAnimations;

/**
 * Helper Functions
 */
export const getDuration = (duration: AnimationDuration = 'normal') => {
  return animationDurations[duration];
};

export const getEasing = (easing: AnimationEasing = 'calm') => {
  return animationEasing[easing];
};

/**
 * Moti Presets
 * Ready-to-use animation configs for Moti components
 */
export const motiPresets = {
  fadeIn: {
    from: fadeAnimations.fadeIn.from,
    animate: fadeAnimations.fadeIn.to,
    transition: {
      type: 'timing',
      duration: fadeAnimations.fadeIn.duration,
    },
  },
  fadeInUp: {
    from: fadeAnimations.fadeInUp.from,
    animate: fadeAnimations.fadeInUp.to,
    transition: {
      type: 'timing',
      duration: fadeAnimations.fadeInUp.duration,
    },
  },
  pressDown: {
    from: scaleAnimations.pressDown.from,
    animate: scaleAnimations.pressDown.to,
    transition: {
      type: 'timing',
      duration: scaleAnimations.pressDown.duration,
    },
  },
  pulse: {
    from: scaleAnimations.pulse.from,
    animate: scaleAnimations.pulse.to,
    transition: {
      type: 'timing',
      duration: scaleAnimations.pulse.duration,
      loop: true,
    },
  },
} as const;
