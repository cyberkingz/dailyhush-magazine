import { Truck, Shield, Clock } from 'lucide-react';

export const fireStarterProductData = {
  // Research Section Data
  research: {
    title: 'The Research You\'re About to Google Anyway',
    subtitle: "Before you open another tab to verify these citations (I know you—you're about to do that), let me save you 20 minutes: Yes, these are real clinical frameworks from Yale, Exeter, and Manchester. Yes, therapists charge $150/hour to teach them. But reading about them doesn't help. Having a system in your hands at 2 AM does.",
    items: [
      {
        title: 'RF-CBT (Rumination-Focused CBT)',
        institution: 'University of Exeter',
        description: 'Targets rumination specifically—not just anxiety symptoms. 78% reduction in overthinking episodes in clinical trials.',
      },
      {
        title: 'Polyvagal Theory',
        institution: 'Yale School of Medicine',
        description: "Explains why your body gets stuck in fight-or-flight during thought spirals. F.I.R.E. uses vagal regulation techniques to interrupt the loop.",
      },
      {
        title: 'Metacognitive Therapy (MCT)',
        institution: 'University of Manchester',
        description: 'Teaches you to observe thoughts without engaging. 70% of patients showed significant improvement in worry reduction.',
      },
    ],
  },

  // Feature Sections Data
  features: [
    {
      title: 'How F.I.R.E. Interrupts the Loop',
      description: 'Most tools try to help you "think better." F.I.R.E. helps you <strong class="text-amber-700">interrupt the rumination cycle before it starts</strong>.',
      subdescription: 'The 4-step framework forces pattern interruption at the physiological level—targeting your nervous system, not just your thoughts.',
      features: [
        { text: '<strong>Focus:</strong> Identify the trigger before it cascades' },
        { text: '<strong>Interrupt:</strong> Break the loop at the body level (vagal activation)' },
        { text: '<strong>Reframe:</strong> Apply cognitive restructuring (RF-CBT technique)' },
        { text: '<strong>Execute:</strong> Take the smallest next action to close the loop' },
      ],
      imageUrl: '/src/assets/woman-holding-protocol-2.png',
      imageAlt: 'Woman with F.I.R.E. Protocol - Stop Overthinking',
      imagePosition: 'left' as const,
    },
    {
      title: 'Built For Your Overthinker Type',
      description: 'You already know your type from the quiz. This kit gives you the exact tools to break <em class="text-amber-700 not-italic font-semibold">your</em> specific pattern.',
      subdescription: "Whether you're a Mindful Thinker, Gentle Analyzer, Chronic Overthinker, or Overthinkaholic—the F.I.R.E. framework gives you the exact steps to interrupt your mental loops before they take over.",
      features: [],
      videoUrl: 'https://cdn.shopify.com/videos/c/o/v/a74214ac5a09432f95196a34001eaedd.mp4',
      imageAlt: 'Built For Your Overthinker Type',
      imagePosition: 'right' as const,
      testimonial: {
        text: "I scored 8/10. After difficult patient conversations, I'd physically tense up and replay everything I said. I didn't realize how much the physical stuff mattered. The body-based exercises are the only thing that's actually helped when I'm spiraling.",
        author: '— Emily R., Physician, 44',
      },
    },
  ],

  // Comparison Table Data
  comparison: {
    title: 'F.I.R.E. vs Other Solutions',
    columns: ['F.I.R.E. Protocol', 'Therapy', 'Meditation Apps', 'Journaling'],
    rows: [
      { feature: 'Targets rumination specifically', values: [true, true, false, false] },
      { feature: 'Works when dysregulated', values: [true, true, false, false] },
      { feature: 'Available at 2 AM', values: [true, false, true, true] },
      { feature: 'One-time cost', values: [true, false, false, true] },
      { feature: 'Clinical frameworks', values: [true, true, false, false] },
      { feature: 'Cost', values: ['$27', '$750-900', '$70-120/yr', '$0-30'] },
    ],
  },

  // Cost of Delay Section Data
  costOfDelay: {
    title: 'You\'re Overthinking This Purchase Right Now',
    intro: "Let me call it—right now, you're thinking: 'This sounds good, but let me research alternatives first' or 'Maybe I should read more reviews' or 'I should probably sleep on this.'",
    callout: "That IS your overthinking pattern. You're researching the solution to overthinking with the same pattern that got you here. You're not being smart. You're being stuck.",
    delayTitle: 'The Logical Cost of Waiting',
    delayPeriod: '2 Weeks',
    costs: [
      { metric: '336 hours', description: 'of potential overthinking episodes' },
      { metric: '14 nights', description: 'of delayed sleep from thought spirals' },
      { metric: '~28 hours', description: "replaying conversations you can't change" },
      { metric: "Risk that you'll talk yourself out of this entirely", description: '' },
    ],
    behavioralProof: "Join the 90% of F.I.R.E. Protocol buyers who made their decision within 48 hours—analytical thinkers who recognized that overthinking this purchase is exactly what they're trying to stop.",
    conclusion: "Smart people recognize when they have enough information to make a decision. You have the research (university-backed clinical frameworks with published trial results). You have social proof (847 analytical thinkers, 4.9 rating, 90-sec average reset). You have risk coverage (30-day guarantee, full refund if it doesn't work). The only thing stopping you is the pattern you're trying to break. Break it now.",
  },

  // Social Proof Stats
  socialProof: {
    stats: [
      { value: '847', label: 'Women Helped' },
      { value: '90sec', label: 'Avg. Reset Time' },
      { value: '4.9/5', label: 'Customer Rating' },
    ],
  },

  // Trust Signals
  trustSignals: [
    { icon: Truck, text: 'Instant digital delivery via email' },
    { icon: Shield, text: 'Secure checkout powered by Shopify' },
    { icon: Clock, text: 'Ready to use in under 2 minutes' },
  ],
};
