export const FIRE_MODULES = [
  {
    id: 'focus',
    title: 'Focus',
    subtitle: 'The Foundation',
    description: 'Learn to direct your attention and break the cycle of rumination.',
    duration: '5 min',
  },
  {
    id: 'interrupt',
    title: 'Interrupt',
    subtitle: 'Breaking the Loop',
    description: 'Techniques to physically and mentally stop the spiral.',
    duration: '7 min',
  },
  {
    id: 'reframe',
    title: 'Reframe',
    subtitle: 'Changing Perspective',
    description: 'Cognitive tools to challenge and change negative thought patterns.',
    duration: '10 min',
  },
  {
    id: 'execute',
    title: 'Execute',
    subtitle: 'Taking Action',
    description: 'Moving from thought to action to build confidence and momentum.',
    duration: '8 min',
  },
] as const;

export type FireModuleId = (typeof FIRE_MODULES)[number]['id'];
