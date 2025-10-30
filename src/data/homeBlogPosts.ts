import type { PostCardProps } from '@/components/blog/PostCard'

type HomeBlogPost = PostCardProps & {
  slug: string
  funnelStage: 'Top of Funnel' | 'Middle of Funnel' | 'Activation' | 'Conversion'
}

export const homeBlogPosts: HomeBlogPost[] = [
  {
    slug: 'stop-overthinking-dailyhush-method',
    title: 'Stop Overthinking — The DailyHush Method',
    excerpt:
      'Your brain is not broken—it is cycling through shame-driven loops. Learn how the DailyHush method interrupts the 7-second pre-conscious window before the spiral begins.',
    category: 'Overthinking & Loops',
    author: 'DailyHush Editorial',
    date: 'Jan 18, 2025',
    readTime: '9 min read',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
    href: '/blog/stop-overthinking-dailyhush-method',
    intentLabel: 'Top of Funnel',
    keywords: ['stop overthinking', 'loop theory', 'dailyhush method'],
    funnelStage: 'Top of Funnel',
  },
  {
    slug: 'how-to-stop-ruminating-night-90-seconds',
    title: 'How to Stop Ruminating at Night in 90 Seconds',
    excerpt:
      'When shame spikes at 2 AM, you need a protocol— not breathwork. Walk through the F.I.R.E. reset, step-by-step, to quiet your mind before the replay starts.',
    category: 'Rumination Psychology',
    author: 'Anna from DailyHush',
    date: 'Jan 11, 2025',
    readTime: '7 min read',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    href: '/blog/how-to-stop-ruminating-night-90-seconds',
    intentLabel: 'Activation',
    keywords: ['stop ruminating', 'night rumination', 'fire protocol'],
    funnelStage: 'Activation',
  },
  {
    slug: 'science-behind-fire-reset',
    title: 'The Science Behind the 90s F.I.R.E. Reset',
    excerpt:
      'F.I.R.E. is not mindset work; it is nervous system timing. See the research, the biology, and why traditional anxiety tools fail when shame runs the loop.',
    category: 'The Method',
    author: 'Dr. Elise Bennett',
    date: 'Jan 9, 2025',
    readTime: '10 min read',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
    href: '/blog/science-behind-fire-reset',
    intentLabel: 'Middle of Funnel',
    keywords: ['fire protocol', 'nervous system reset', 'dailyhush research'],
    funnelStage: 'Middle of Funnel',
  },
  {
    slug: 'perfectionism-loop-feels-like-control',
    title: 'Perfectionism: The Loop That Feels Like Control',
    excerpt:
      'Perfectionism disguises itself as excellence, yet it is the most punishing loop DailyHush women report. Learn the somatic signposts before the spiral catches you.',
    category: 'Loop Types',
    author: 'DailyHush Editorial',
    date: 'Dec 18, 2024',
    readTime: '8 min read',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    href: '/blog/perfectionism-loop-feels-like-control',
    intentLabel: 'Top of Funnel',
    keywords: ['perfectionism', 'loop types', 'shame spiral'],
    funnelStage: 'Top of Funnel',
  },
  {
    slug: 'loop-types-sleep-decision-social',
    title: 'Loop Types: Sleep, Decision, Social & Perfectionism',
    excerpt:
      'DailyHush maps four dominant loop archetypes. Identify yours and tailor the F.I.R.E. and Shift tools to the exact shame trigger pattern you run.',
    category: 'Loop Atlas',
    author: 'DailyHush Research Team',
    date: 'Dec 11, 2024',
    readTime: '11 min read',
    imageUrl: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1200&q=80',
    href: '/blog/loop-types-sleep-decision-social',
    intentLabel: 'Middle of Funnel',
    keywords: ['sleep loop', 'decision fatigue', 'social overthinking'],
    funnelStage: 'Middle of Funnel',
  },
  {
    slug: 'body-reset-vs-mindfulness',
    title: 'Body Reset vs Mindfulness: Why Calm Apps Fail Loopers',
    excerpt:
      'Mindfulness increases awareness—but loops activate in the body first. Compare the Body Reset Technique to popular calm apps and see why DailyHush users convert.',
    category: 'Emotional Education',
    author: 'DailyHush Editorial',
    date: 'Nov 28, 2024',
    readTime: '9 min read',
    imageUrl: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200&q=80',
    href: '/blog/body-reset-vs-mindfulness',
    intentLabel: 'Conversion',
    keywords: ['body reset', 'mindfulness', 'calm app alternative'],
    funnelStage: 'Conversion',
  },
]

export type { HomeBlogPost }
