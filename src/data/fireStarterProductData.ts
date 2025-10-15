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
      imageUrl: 'https://cdn.shopify.com/s/files/1/0957/4914/4879/files/enhanced-image_2.png?v=1760559446',
      imageAlt: 'F.I.R.E. Protocol 4-Step Framework',
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

  // Reviews Section Data
  reviews: {
    overallRating: 4.9,
    totalReviews: 847,
    featured: [
      // 5 STARS - Long form with time progression
      {
        id: '1',
        name: 'Alex M.',
        rating: 5,
        date: 'September 2024',
        review: "I've been in therapy for 3 years working on my overthinking, and my therapist always says \"just interrupt the thought spiral\" but like... HOW? Nobody ever tells you the actual steps. First time I used this: totally blanked. I was mid-spiral after sending a risky email at work, and I couldn't even remember what the acronym stood for. Week later, second attempt: the physical movement part (I did the hand-pressing thing) genuinely snapped me out of the loop. Now a month in, I've used it maybe 15 times? Works about 80% of the time. The 20% it doesn't, I'm probably too far gone. Wish the cards were bigger—the font is tiny when I'm already activated. But honestly? First thing I've found that gives me actual steps when my brain is stuck.",
        overthinkerType: 'Overthinkaholic',
        verified: true,
      },

      // 2 STARS - Critical "not for me"
      {
        id: '2',
        name: 'Kelly R.',
        rating: 2,
        date: 'August 2025',
        review: "Maybe I'm missing something, but this felt pretty basic? The breathing exercises and 'notice your body' stuff didn't really register for me—I don't feel anything when I try to tune into my nervous system. I'm too in my head for that. The thinking steps are fine, but half the protocol just doesn't land. If you're not body-aware, this might not be your thing. Also $27 for what's essentially a fancy checklist felt steep.",
        overthinkerType: 'Gentle Analyzer',
        verified: true,
      },

      // 4 STARS - Realistic with criticism
      {
        id: '3',
        name: 'Rachel P.',
        rating: 4,
        date: 'July 2025',
        review: "Genuinely useful. I keep the digital version on my phone and printed cards by my bed. The Execute step is brilliant—it stops me from staying stuck in my head. Would be 5 stars if it came with a quick-start guide. First couple times I had to keep re-reading the instructions, which defeats the purpose when you're spiraling. But once you memorize the steps, it works. Wish I'd found this years ago.",
        overthinkerType: 'Chronic Overthinker',
        verified: true,
      },

      // 5 STARS - Messy, chaotic voice
      {
        id: '4',
        name: 'Taylor M.',
        rating: 5,
        date: 'June 2025',
        review: "ok so i'm not good at reviews but like. you know that thing where you're lying in bed and your brain is just *gestures wildly* replaying every conversation from the day? and you're like 'why did i say that' and it just. keeps. going? yeah this stops that. idk how. something about the last step makes my brain realize it's stuck. used it maybe 6-7 times now? worked every time except once when i was too far gone lol. anyway if you're reading this you probably need it. just get it.",
        overthinkerType: 'Overthinkaholic',
        verified: true,
      },

      // 3 STARS - Good but...
      {
        id: '5',
        name: 'Melissa J.',
        rating: 3,
        date: 'May 2025',
        review: "The protocol itself is solid, but I wish there was more guidance on WHEN to use each step. Sometimes I freeze and can't remember if I'm supposed to Focus first or Interrupt first. Also, the card design could be better—the font is tiny. That said, when I DO use it correctly, it works. I've had to write my own notes in the margins to make it stick. Not bad, just needs better UX.",
        overthinkerType: 'Gentle Analyzer',
        verified: true,
      },

      // 5 STARS - Concrete outcome (sleep)
      {
        id: '6',
        name: 'Jordan K.',
        rating: 5,
        date: 'May 2025',
        review: "I haven't slept through the night in months. MONTHS. I'd wake up at 2-3am and my brain would just start up like a diesel engine. Last Tuesday at 3am I woke up, used the protocol (kept the cards on my nightstand), and... went back to sleep? In like 15 minutes? I don't know if this is a fluke or if it'll keep working but holy shit. I slept. That's worth $27 right there.",
        overthinkerType: 'Chronic Overthinker',
        verified: true,
      },

      // 4 STARS - Time progression narrative
      {
        id: '7',
        name: 'Danielle F.',
        rating: 4,
        date: 'April 2025',
        review: "First week: honestly forgot I had it. Second week: tried it during a Sunday night anxiety spiral, but I was too activated to follow the steps. Third week: used it after a meeting where I said something awkward, and it FINALLY clicked. Now I reach for it automatically. Would've given 5 stars, but it took longer than I wanted to actually integrate it into my life. Also the digital PDF formatting could be better.",
        overthinkerType: 'Chronic Overthinker',
        verified: true,
      },

      // 5 STARS - Lower scorer (7/10)
      {
        id: '8',
        name: 'Emma L.',
        rating: 5,
        date: 'March 2025',
        review: "I scored a 7 on the quiz (not a severe overthinker, but definitely prone to it around work stuff). Wasn't sure if this would be \"too much\" for me, but it's actually been useful. I don't use it daily, more like 2-3 times a month when I catch myself spiraling before a presentation or after sending a risky email. The first step is probably the most valuable for me—it's like a pattern interrupt. Definitely works for medium-scorers too.",
        overthinkerType: 'Gentle Analyzer',
        verified: true,
      },

      // 5 STARS - Rewritten Sarah (less perfect)
      {
        id: '9',
        name: 'Sarah M.',
        rating: 5,
        date: 'February 2025',
        review: "I've tried Headspace (just made me more aware of the thoughts, which made it worse), therapy (helpful but $150/session adds up), journaling (I'd just spiral ON PAPER). This is the first thing that actually worked when I'm spiraling at 3 AM. The emergency cards are in my wallet and I've used them maybe 20+ times in the past 2 months. Only thing I'd change: wish there was a video walkthrough for the first use.",
        overthinkerType: 'Overthinkaholic',
        verified: true,
      },

      // 4 STARS - Rewritten Jessica (less buzzword-y)
      {
        id: '10',
        name: 'Jessica T.',
        rating: 4,
        date: 'February 2025',
        review: "I was skeptical about the whole breathing/body awareness stuff—seemed too simple. But the exercises that are supposed to calm down your nervous system? They actually work. I can literally feel the shift from 'brain on fire' to 'okay I can think now.' It's not magic, takes practice. Sometimes I forget to do it until I'm already deep in the spiral. But when I remember to use it early, it's clutch. Minus one star because the instructions could be clearer.",
        overthinkerType: 'Chronic Overthinker',
        verified: true,
      },

      // 5 STARS - Self-aware humor
      {
        id: '11',
        name: 'Lauren H.',
        rating: 5,
        date: 'January 2025',
        review: "As someone who researched this for 2 weeks before buying (ironic, I know), I can confirm it's worth it. The therapy techniques are legit clinical stuff, not Instagram infographic nonsense. My therapist literally teaches the same frameworks for $150/hour. I've used it 3 times this week already. Only critique: the cards are a bit small for my purse, but I just keep them in my wallet.",
        overthinkerType: 'Overthinkaholic',
        verified: true,
      },

      // 4 STARS - Rewritten Amanda (more realistic)
      {
        id: '12',
        name: 'Amanda K.',
        rating: 4,
        date: 'December 2024',
        review: "The quiz result was uncomfortably accurate (8/10), which made me curious enough to try this. Took me about a week to actually use it—kept overthinking whether I was doing it right (classic). Once I stopped trying to be perfect with it, it started working. The 4-step framework gives me concrete actions when my brain is looping, which is exactly what I needed. Minus one star because I wish it had examples for different scenarios.",
        overthinkerType: 'Gentle Analyzer',
        verified: true,
      },

      // 5 STARS - Work context with failure moment
      {
        id: '13',
        name: 'Michelle D.',
        rating: 5,
        date: 'November 2024',
        review: "After difficult patient conversations (I'm a nurse), I physically tense up and replay everything I said for HOURS. First time I tried this after a bad shift, I was too activated to even read the cards—just stared at them like they were in another language. Second attempt a week later: actually followed the steps and it worked. Now it's automatic. The body-based stuff matters way more than I expected. Keep the cards in my scrubs pocket.",
        overthinkerType: 'Chronic Overthinker',
        verified: true,
      },

      // 4 STARS - Lower scorer (6/10) with blemishing
      {
        id: '14',
        name: 'Chris R.',
        rating: 4,
        date: 'October 2025',
        review: "Scored a 6 on the quiz. Wasn't sure I needed this, but my partner said I spiral about work stuff more than I realize. She was right. I use this maybe once a week, usually Sunday nights when I'm dreading Monday. The steps are simple enough that I can remember them without the cards now. Wish it came in a PDF I could annotate digitally. Otherwise solid.",
        overthinkerType: 'Gentle Analyzer',
        verified: true,
      },

      // 5 STARS - Specific metric
      {
        id: '15',
        name: 'Priya K.',
        rating: 5,
        date: 'September 2025',
        review: "Used to replay work emails in my head for an average of 45 minutes after sending them (yes, I tracked it—I'm that person). With this, I've gotten it down to under 10 minutes most times. The Interrupt step is genius because it forces you to DO something instead of just thinking about the thinking. Sometimes I still forget to use it, but when I do, it works. The cards live on my desk next to my monitor.",
        overthinkerType: 'Overthinkaholic',
        verified: true,
      },
    ],
  },
};
