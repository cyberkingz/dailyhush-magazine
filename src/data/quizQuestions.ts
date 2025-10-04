import type { QuizQuestion } from '../types/quiz'

export const quizQuestions: QuizQuestion[] = [
  // SECTION 1: Cognitive Overload (Mental Noise)
  {
    id: 'q1',
    section: 'cognitive',
    type: 'scale',
    question:
      'How often do you replay past decisions in your head, wondering if you could have done better?',
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: {
      min: 'Rarely',
      max: 'Constantly',
    },
  },
  {
    id: 'q2',
    section: 'cognitive',
    type: 'single',
    question: 'When you have an idea, what happens first?',
    options: [
      { id: 'q2_a', text: 'I jump in quickly', value: 1 },
      { id: 'q2_b', text: 'I plan it out', value: 3 },
      { id: 'q2_c', text: 'I research endlessly', value: 5 },
    ],
  },
  {
    id: 'q3',
    section: 'cognitive',
    type: 'scale',
    question:
      'Do you tend to mentally "rehearse" conversations or actions before doing them?',
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: {
      min: 'Never',
      max: 'Always',
    },
  },

  // SECTION 2: Action Avoidance (Procrastination Disguised as Planning)
  {
    id: 'q4',
    section: 'action',
    type: 'single',
    question: 'Do you tell yourself "I will start once it is clearer"?',
    options: [
      { id: 'q4_a', text: 'Rarely - I start messy', value: 1 },
      { id: 'q4_b', text: 'Sometimes - depends on the project', value: 3 },
      { id: 'q4_c', text: 'Often - I need clarity first', value: 5 },
    ],
  },
  {
    id: 'q5',
    section: 'action',
    type: 'single',
    question: 'When you hit uncertainty, what do you usually do?',
    options: [
      { id: 'q5_a', text: 'Simplify and move forward', value: 1 },
      { id: 'q5_b', text: 'Re-plan the approach', value: 3 },
      { id: 'q5_c', text: 'Research more options', value: 5 },
    ],
  },

  // SECTION 3: Emotional Drivers (Fear of Mistakes / Control / Identity)
  {
    id: 'q6',
    section: 'emotional',
    type: 'single',
    question: 'When you delay action, what emotion fits best?',
    options: [
      { id: 'q6_a', text: 'Fear of failure', value: 4 },
      { id: 'q6_b', text: 'Fear of judgment', value: 5 },
      { id: 'q6_c', text: 'Need for control', value: 4 },
      { id: 'q6_d', text: 'Exhaustion / burnout', value: 2 },
    ],
  },
  {
    id: 'q7',
    section: 'emotional',
    type: 'single',
    question: 'If a friend launched something imperfect, how would you react?',
    options: [
      { id: 'q7_a', text: 'I would be proud of them', value: 1 },
      { id: 'q7_b', text: 'I would be anxious for them', value: 4 },
      { id: 'q7_c', text: 'I would secretly compare myself 😅', value: 5 },
    ],
  },

  // SECTION 4: Behavioral Output (Pattern Recognition)
  {
    id: 'q8',
    section: 'behavioral',
    type: 'single',
    question:
      'How many unfinished ideas/projects are on your list right now?',
    options: [
      { id: 'q8_a', text: '1-2 (I finish before starting new)', value: 1 },
      { id: 'q8_b', text: '3-5 (Some complete, some stalled)', value: 3 },
      { id: 'q8_c', text: '6-10 (Too many to count)', value: 4 },
      { id: 'q8_d', text: '10+ (Send help 😅)', value: 5 },
    ],
  },
  {
    id: 'q9',
    section: 'behavioral',
    type: 'scale',
    question:
      'How often do you say "I just need one more thing before launching"?',
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: {
      min: 'Never',
      max: 'Every time',
    },
  },
  {
    id: 'q10',
    section: 'behavioral',
    type: 'scale',
    question:
      'How often do you compare yourself to others who already launched?',
    scaleMin: 1,
    scaleMax: 5,
    scaleLabels: {
      min: 'Rarely',
      max: 'Daily',
    },
  },
]
