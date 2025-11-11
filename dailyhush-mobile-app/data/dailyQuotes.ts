/**
 * Nœma - Daily Mindful Quotes
 * Curated collection of wisdom for people who ruminate
 * Focus: Self-compassion, growth mindset, interrupting spirals
 */

export interface Quote {
  id: number;
  text: string;
  author?: string;
  category: 'compassion' | 'growth' | 'presence' | 'interrupt' | 'wisdom';
}

export const dailyQuotes: Quote[] = [
  // Self-Compassion
  {
    id: 1,
    text: "That spiral doesn't define you. But breaking it? That's who you're becoming.",
    category: 'compassion',
  },
  {
    id: 2,
    text: "You're not broken for ruminating. You're learning to interrupt a pattern your brain has practiced for years.",
    category: 'compassion',
  },
  {
    id: 3,
    text: "Self-compassion isn't self-pity. It's recognizing that struggle is part of being human.",
    category: 'compassion',
  },
  {
    id: 4,
    text: "The fact that you're here, trying, is proof you haven't given up. That matters.",
    category: 'compassion',
  },
  {
    id: 5,
    text: "Healing isn't linear. Some days are harder. That doesn't mean you're going backward.",
    category: 'compassion',
  },

  // Growth Mindset
  {
    id: 6,
    text: "Every time you catch a spiral early, you're rewiring your brain. Progress is happening.",
    category: 'growth',
  },
  {
    id: 7,
    text: "You don't need to be perfect at interrupting. You just need to be consistent.",
    category: 'growth',
  },
  {
    id: 8,
    text: "Noticing the pattern is the first step. You're further along than you think.",
    category: 'growth',
  },
  {
    id: 9,
    text: 'Your brain learned to ruminate. It can learn not to. Neural pathways change with practice.',
    category: 'growth',
  },
  {
    id: 10,
    text: "Reducing rumination from 2 hours to 20 minutes is a win. Progress isn't all-or-nothing.",
    category: 'growth',
  },

  // Presence & Grounding
  {
    id: 11,
    text: "The spiral lives in the past or future. Right now, in this moment, you're safe.",
    category: 'presence',
  },
  {
    id: 12,
    text: 'Name 5 things you can see. Your nervous system will thank you.',
    category: 'presence',
  },
  {
    id: 13,
    text: "Your body knows you're spiraling before your mind does. Learn to trust those signals.",
    category: 'presence',
  },
  {
    id: 14,
    text: 'Breath is the bridge between rumination and presence. Use it.',
    category: 'presence',
  },
  {
    id: 15,
    text: "You can't control your thoughts. But you can control what you do when they spiral.",
    category: 'presence',
  },

  // Interrupt Wisdom
  {
    id: 16,
    text: 'The 10-second window is real. Catch it there, and the spiral never starts.',
    category: 'interrupt',
  },
  {
    id: 17,
    text: "You're not processing. You're replaying. Replaying is punishment. We can interrupt that together.",
    category: 'interrupt',
  },
  {
    id: 18,
    text: "You don't need to solve the thought. You need to interrupt the loop.",
    category: 'interrupt',
  },
  {
    id: 19,
    text: "Spirals thrive in isolation. Name it out loud: 'I'm ruminating.' Watch it lose power.",
    category: 'interrupt',
  },
  {
    id: 20,
    text: 'Most spirals peak at 90 seconds. If you can interrupt then, you win.',
    category: 'interrupt',
  },

  // General Wisdom
  {
    id: 21,
    text: "Your brain is trying to protect you. It just doesn't know that overthinking isn't safety.",
    category: 'wisdom',
  },
  {
    id: 22,
    text: 'Shame thrives in secret. Rumination thrives in loops. Break the pattern, break the power.',
    category: 'wisdom',
  },
  {
    id: 23,
    text: "You're not analyzing. You're punishing. Once you see it, you can change it.",
    category: 'wisdom',
  },
  {
    id: 24,
    text: 'The conversations you replay never happened the way you remember them. Your spiral is fiction.',
    category: 'wisdom',
  },
  {
    id: 25,
    text: "Recovery isn't about never spiraling. It's about catching it in the first 10 seconds.",
    category: 'wisdom',
  },
  {
    id: 26,
    text: "You've survived every spiral so far. This one won't be different.",
    category: 'wisdom',
  },
  {
    id: 27,
    text: 'The mind that creates the spiral is the same mind that can interrupt it.',
    category: 'wisdom',
  },
  {
    id: 28,
    text: 'Rumination is a habit, not a personality trait. Habits can change.',
    category: 'wisdom',
  },
  {
    id: 29,
    text: "Your anxiety thinks it's helping. Thank it, then redirect it.",
    category: 'wisdom',
  },
  {
    id: 30,
    text: "The goal isn't peace. The goal is knowing what to do when peace is disrupted.",
    category: 'wisdom',
  },
  {
    id: 31,
    text: "Some days you'll catch every spiral. Some days you'll catch none. Keep showing up.",
    category: 'compassion',
  },
  {
    id: 32,
    text: "You're not overthinking. You're replaying. There's a difference. And we get it.",
    category: 'wisdom',
  },
  {
    id: 33,
    text: "That conversation isn't happening right now. But your body thinks it is. Let's interrupt this loop.",
    category: 'interrupt',
  },
  {
    id: 34,
    text: "You're not alone in this. 50,000+ women have interrupted their loops at 3AM. You can too.",
    category: 'compassion',
  },
  {
    id: 35,
    text: "We're here. Whether it's 3AM or 3PM. You're not going through this alone.",
    category: 'compassion',
  },
];

/**
 * Get quote for a specific day (rotates based on day of year)
 */
export function getQuoteOfTheDay(): Quote {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

  const index = dayOfYear % dailyQuotes.length;
  return dailyQuotes[index];
}

/**
 * Get a random quote (useful for testing or variety)
 */
export function getRandomQuote(): Quote {
  const index = Math.floor(Math.random() * dailyQuotes.length);
  return dailyQuotes[index];
}

/**
 * Get quotes by category
 */
export function getQuotesByCategory(category: Quote['category']): Quote[] {
  return dailyQuotes.filter((quote) => quote.category === category);
}
