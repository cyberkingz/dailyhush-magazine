/**
 * DailyHush - Quiz Questions
 * Synced with web app quiz - 20 questions across 7 sections
 * Updated: 2025-10-31
 */

export interface QuizOption {
  id: string;
  text: string;
  value: number; // 0 (trigger/bridge), 1 (mild), 3 (moderate), 5 (severe)
}

export interface QuizQuestion {
  id: string;
  section: string;
  question: string;
  options: QuizOption[];
}

export type OverthinkerType =
  | 'mindful-thinker'
  | 'gentle-analyzer'
  | 'chronic-overthinker'
  | 'overthinkaholic';

export type LoopType =
  | 'sleep-loop'
  | 'decision-loop'
  | 'social-loop'
  | 'perfectionism-loop';

export interface QuizResult {
  type: OverthinkerType;
  loopType: LoopType;
  score: number; // Normalized 1-10
  rawScore: number; // Actual total
  title: string;
  description: string;
  insight: string;
  ctaHook: string;
}

export const quizQuestions: QuizQuestion[] = [
  // SECTION 0: Trigger Type (Initial routing seed)
  {
    id: 'q0',
    section: 'trigger-type',
    question: 'When your mind starts spinning, what usually triggers it?',
    options: [
      { id: 'q0_a', text: 'Something I said or did "wrong"', value: 0 },
      { id: 'q0_b', text: "A decision I'm unsure about", value: 0 },
      { id: 'q0_c', text: 'Worrying how someone saw me', value: 0 },
      { id: 'q0_d', text: 'It just starts for no reason', value: 0 },
    ],
  },

  // SECTION 1: Thought Loops (Cognitive)
  {
    id: 'q1',
    section: 'thought-loops',
    question:
      'How often do you replay small mistakes in your head (something you said or did "wrong")?',
    options: [
      { id: 'q1_a', text: 'Rarely — I move on fast', value: 1 },
      { id: 'q1_b', text: 'Sometimes — depends on the moment', value: 3 },
      { id: 'q1_c', text: "Almost always — I can't stop replaying", value: 5 },
    ],
  },
  {
    id: 'q2',
    section: 'thought-loops',
    question: 'When faced with a decision, what do you usually do first?',
    options: [
      { id: 'q2_a', text: 'Choose instinctively and go', value: 1 },
      { id: 'q2_b', text: 'List pros and cons', value: 3 },
      { id: 'q2_c', text: "Research until I'm mentally exhausted", value: 5 },
    ],
  },
  {
    id: 'q3',
    section: 'thought-loops',
    question: 'How often do your thoughts spiral from a small worry into worst-case scenarios?',
    options: [
      { id: 'q3_a', text: 'Never', value: 1 },
      { id: 'q3_b', text: 'Occasionally', value: 3 },
      { id: 'q3_c', text: 'Constantly', value: 5 },
    ],
  },
  {
    id: 'q4',
    section: 'thought-loops',
    question: "When someone disagrees with you, what's your mental response?",
    options: [
      { id: 'q4_a', text: '"That\'s fine — different opinions."', value: 1 },
      { id: 'q4_b', text: '"Maybe I didn\'t explain clearly."', value: 3 },
      { id: 'q4_c', text: '"They must think I\'m stupid."', value: 5 },
    ],
  },

  // SECTION 2: Emotional Drivers
  {
    id: 'q5',
    section: 'emotional-drivers',
    question: 'What emotion best sits underneath your overthinking?',
    options: [
      { id: 'q5_a', text: 'Curiosity — I like to understand', value: 1 },
      { id: 'q5_b', text: 'Anxiety — afraid of doing it wrong', value: 4 },
      { id: 'q5_c', text: "Fear of judgment — don't want to disappoint", value: 5 },
    ],
  },
  {
    id: 'q6',
    section: 'emotional-drivers',
    question: 'When you delay action, which thought feels most true?',
    options: [
      { id: 'q6_a', text: '"I\'m gathering info."', value: 2 },
      { id: 'q6_b', text: '"I\'m not ready yet."', value: 4 },
      { id: 'q6_c', text: '"If I fail, it proves I\'m not good enough."', value: 5 },
    ],
  },
  {
    id: 'q7',
    section: 'emotional-drivers',
    question: 'After social interactions, do you analyze what you said or how you came across?',
    options: [
      { id: 'q7_a', text: 'Rarely', value: 1 },
      { id: 'q7_b', text: 'Sometimes', value: 3 },
      { id: 'q7_c', text: 'Every time', value: 5 },
    ],
  },

  // SECTION 3: Decision Fatigue & Control
  {
    id: 'q8',
    section: 'decision-fatigue',
    question: 'How long do you compare options for everyday choices (outfit, restaurant, plan)?',
    options: [
      { id: 'q8_a', text: 'Under a minute', value: 1 },
      { id: 'q8_b', text: 'Several minutes', value: 3 },
      { id: 'q8_c', text: 'Way too long — I second-guess everything', value: 5 },
    ],
  },
  {
    id: 'q9',
    section: 'decision-fatigue',
    question: 'How comfortable are you making a decision that isn\'t "perfect"?',
    options: [
      { id: 'q9_a', text: 'Totally fine — I can adjust later', value: 1 },
      { id: 'q9_b', text: 'Slightly uneasy, but I decide anyway', value: 3 },
      { id: 'q9_c', text: 'Very uncomfortable — I need certainty', value: 5 },
    ],
  },
  {
    id: 'q10',
    section: 'decision-fatigue',
    question: 'How often do you need reassurance from others before deciding something small?',
    options: [
      { id: 'q10_a', text: 'Rarely', value: 1 },
      { id: 'q10_b', text: 'Sometimes', value: 3 },
      { id: 'q10_c', text: 'Often — I need validation first', value: 5 },
    ],
  },

  // SECTION 4: Self-Image & Comparison
  {
    id: 'q11',
    section: 'self-image',
    question: 'When you see confident people, your inner dialogue sounds like:',
    options: [
      { id: 'q11_a', text: '"Good for them."', value: 1 },
      { id: 'q11_b', text: '"I wish I felt like that."', value: 3 },
      { id: 'q11_c', text: '"Why can\'t I be like that?"', value: 5 },
    ],
  },
  {
    id: 'q12',
    section: 'self-image',
    question: 'After a small mistake, your self-talk is:',
    options: [
      { id: 'q12_a', text: '"Oops, next time."', value: 1 },
      { id: 'q12_b', text: '"I should\'ve known better."', value: 3 },
      { id: 'q12_c', text: '"I always mess things up."', value: 5 },
    ],
  },
  {
    id: 'q13',
    section: 'self-image',
    question: 'How often do you compare your looks, life, or progress to others online?',
    options: [
      { id: 'q13_a', text: 'Rarely', value: 1 },
      { id: 'q13_b', text: 'Sometimes', value: 3 },
      { id: 'q13_c', text: 'Daily', value: 5 },
    ],
  },

  // SECTION 5: Bedtime Rumination (High Signal)
  {
    id: 'q14',
    section: 'bedtime-rumination',
    question: 'When you get into bed, what usually happens in your mind?',
    options: [
      { id: 'q14_a', text: 'I switch off quickly and fall asleep', value: 1 },
      { id: 'q14_b', text: 'I think a little, then drift off', value: 3 },
      {
        id: 'q14_c',
        text: 'My brain starts racing; I replay the day or plan tomorrow',
        value: 5,
      },
    ],
  },
  {
    id: 'q15',
    section: 'bedtime-rumination',
    question: "How long do you typically lie awake because your thoughts won't stop?",
    options: [
      { id: 'q15_a', text: '< 10 minutes', value: 1 },
      { id: 'q15_b', text: '10–30 minutes', value: 3 },
      { id: 'q15_c', text: '30+ minutes / I check the clock', value: 5 },
    ],
  },
  {
    id: 'q16',
    section: 'bedtime-rumination',
    question: "What's your typical nighttime loop?",
    options: [
      { id: 'q16_a', text: 'Light review → sleep', value: 1 },
      { id: 'q16_b', text: 'Scroll + "one more thought" → sleep', value: 3 },
      {
        id: 'q16_c',
        text: 'Replay convos / imagine worst-cases / redo decisions',
        value: 5,
      },
    ],
  },

  // SECTION 6: Perfectionism
  {
    id: 'q17',
    section: 'perfectionism',
    question: 'When you achieve something, what do you focus on most?',
    options: [
      { id: 'q17_a', text: 'What went well', value: 1 },
      { id: 'q17_b', text: 'What could be better', value: 3 },
      { id: 'q17_c', text: "What I didn't do perfectly", value: 5 },
    ],
  },
  {
    id: 'q18',
    section: 'perfectionism',
    question: 'When you make a small mistake, your first thought is:',
    options: [
      { id: 'q18_a', text: '"Oh well, moving on"', value: 1 },
      { id: 'q18_b', text: '"I should\'ve done better"', value: 3 },
      { id: 'q18_c', text: '"I always mess things up"', value: 5 },
    ],
  },
  {
    id: 'q19',
    section: 'perfectionism',
    question: 'Before sending a message (text or email), you:',
    options: [
      { id: 'q19_a', text: 'Send it right away', value: 1 },
      { id: 'q19_b', text: 'Read it once, then send', value: 3 },
      { id: 'q19_c', text: 'Rewrite or check multiple times', value: 5 },
    ],
  },

  // SECTION 7: Emotional Bridge
  {
    id: 'q20',
    section: 'emotional-bridge',
    question: 'If you could quiet one part of your mind right now, which would it be?',
    options: [
      { id: 'q20_a', text: 'The part that replays mistakes', value: 0 },
      { id: 'q20_b', text: 'The part that needs control', value: 0 },
      { id: 'q20_c', text: 'The part that worries what others think', value: 0 },
      { id: 'q20_d', text: "The part that won't stop at night", value: 0 },
    ],
  },
];
