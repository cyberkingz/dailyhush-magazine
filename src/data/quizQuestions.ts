import type { QuizQuestion } from '../types/quiz'

export const quizQuestions: QuizQuestion[] = [
  // SECTION 1: Mental Loops (How Your Mind Works)
  {
    id: 'q1',
    section: 'mental',
    type: 'single',
    question:
      "How often do you replay past decisions in your head, wondering if you could've done better?",
    options: [
      { id: 'q1_a', text: 'Rarely — I move on fast', value: 1 },
      { id: 'q1_b', text: 'Sometimes — depends on the decision', value: 3 },
      { id: 'q1_c', text: "Constantly — I can't stop reanalyzing things", value: 5 },
    ],
  },
  {
    id: 'q2',
    section: 'mental',
    type: 'single',
    question: "When you get a new idea, what's the first thing you do?",
    options: [
      { id: 'q2_a', text: "I take quick action, even if it's messy", value: 1 },
      { id: 'q2_b', text: 'I outline a plan before moving', value: 3 },
      { id: 'q2_c', text: 'I start researching to make sure it\'s "the right" idea', value: 5 },
    ],
  },
  {
    id: 'q3',
    section: 'mental',
    type: 'single',
    question:
      'Before you send a message, email, or post — do you mentally rehearse it?',
    options: [
      { id: 'q3_a', text: 'Never', value: 1 },
      { id: 'q3_b', text: 'Sometimes', value: 3 },
      { id: 'q3_c', text: 'Always (and sometimes I never send it)', value: 5 },
    ],
  },
  {
    id: 'q4',
    section: 'mental',
    type: 'single',
    question: 'When you have to make a big decision, how do you usually feel?',
    options: [
      { id: 'q4_a', text: "Excited — I'll figure it out as I go", value: 1 },
      { id: 'q4_b', text: 'Torn — I overthink pros and cons', value: 3 },
      { id: 'q4_c', text: 'Frozen — I end up avoiding the decision', value: 5 },
    ],
  },

  // SECTION 2: Action Tendencies (What You Actually Do)
  {
    id: 'q5',
    section: 'action',
    type: 'single',
    question: "You often tell yourself: \"I'll start once it's clearer.\"",
    options: [
      { id: 'q5_a', text: "Nope — I start before I'm ready", value: 1 },
      { id: 'q5_b', text: 'Sometimes — I need a bit more clarity', value: 3 },
      { id: 'q5_c', text: 'Always — I need to be sure before starting', value: 5 },
    ],
  },
  {
    id: 'q6',
    section: 'action',
    type: 'single',
    question: "When something gets messy or unclear, what's your usual reaction?",
    options: [
      { id: 'q6_a', text: 'I simplify and move forward', value: 1 },
      { id: 'q6_b', text: 'I pause and rethink my plan', value: 3 },
      { id: 'q6_c', text: 'I go back to research or tweak things again', value: 5 },
    ],
  },
  {
    id: 'q7',
    section: 'action',
    type: 'single',
    question: 'How do you handle unfinished work?',
    options: [
      { id: 'q7_a', text: 'I wrap things up fast — I like closure', value: 1 },
      { id: 'q7_b', text: "I keep them on hold — I'll get back \"soon\"", value: 3 },
      { id: 'q7_c', text: 'I start new things before finishing the old ones', value: 5 },
    ],
  },

  // SECTION 3: Emotional Drivers (Why You Do It)
  {
    id: 'q8',
    section: 'emotional',
    type: 'single',
    question: "When you delay something, which emotion best fits what's going on?",
    options: [
      { id: 'q8_a', text: 'Fear of failure — "What if it flops?"', value: 4 },
      { id: 'q8_b', text: 'Fear of judgment — "What will people think?"', value: 5 },
      { id: 'q8_c', text: 'Need for control — "It has to be perfect"', value: 4 },
      { id: 'q8_d', text: "Exhaustion — \"I'm too drained to start\"", value: 2 },
    ],
  },
  {
    id: 'q9',
    section: 'emotional',
    type: 'single',
    question: "When a friend launches something imperfectly, what's your first thought?",
    options: [
      { id: 'q9_a', text: 'I admire them for taking action', value: 1 },
      { id: 'q9_b', text: 'I feel nervous for them', value: 4 },
      { id: 'q9_c', text: 'I compare myself and wish I could do the same', value: 5 },
    ],
  },

  // SECTION 4: Everyday Habits (How It Shows Up in Your Life)
  {
    id: 'q10',
    section: 'habits',
    type: 'single',
    question:
      'How many unfinished ideas or projects are you currently juggling?',
    options: [
      { id: 'q10_a', text: '1–2 — I usually finish what I start', value: 1 },
      { id: 'q10_b', text: '3–5 — A few are half-done', value: 3 },
      { id: 'q10_c', text: '6–10 — I lose track sometimes', value: 4 },
      { id: 'q10_d', text: '10+ — My notes app is chaos 😅', value: 5 },
    ],
  },
  {
    id: 'q11',
    section: 'habits',
    type: 'single',
    question:
      "How often do you say, \"Just one more tweak, then I'll launch\"?",
    options: [
      { id: 'q11_a', text: 'Never', value: 1 },
      { id: 'q11_b', text: 'Sometimes', value: 3 },
      { id: 'q11_c', text: 'Every single time', value: 5 },
    ],
  },
  {
    id: 'q12',
    section: 'habits',
    type: 'single',
    question:
      'How often do you compare yourself to others who seem to "have it figured out"?',
    options: [
      { id: 'q12_a', text: 'Rarely — I stay in my lane', value: 1 },
      { id: 'q12_b', text: "Sometimes — it sneaks up on me", value: 3 },
      { id: 'q12_c', text: "Every day — it's exhausting", value: 5 },
    ],
  },

  // SECTION 5: Final Self-Reflection (Bridge Question)
  {
    id: 'q13',
    section: 'reflection',
    type: 'single',
    question: 'If you could fix one thing this week, what would it be?',
    options: [
      { id: 'q13_a', text: 'Finally launch something — no matter how small', value: 1 },
      { id: 'q13_b', text: 'Stop second-guessing myself', value: 3 },
      { id: 'q13_c', text: 'Feel confident in my ideas again', value: 4 },
      { id: 'q13_d', text: 'Finish what I started', value: 2 },
    ],
  },
]
