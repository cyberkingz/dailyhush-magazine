export type QuestionType = 'single' | 'scale' | 'multiple';

export interface QuizOption {
  id: string;
  text: string;
  value: number; // For scoring different overthinker types
}

export interface QuizQuestion {
  id: string;
  section: 'trigger-type' | 'thought-loops' | 'emotional-drivers' | 'decision-fatigue' | 'self-image' | 'bedtime-rumination' | 'perfectionism' | 'emotional-bridge';
  type: QuestionType;
  question: string;
  description?: string;
  options?: QuizOption[];
  scaleMin?: number;
  scaleMax?: number;
  scaleLabels?: {
    min: string;
    max: string;
  };
}

export interface QuizAnswer {
  questionId: string;
  optionId?: string;
  scaleValue?: number;
  multipleOptionIds?: string[];
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
  score: number;
  title: string;
  description: string;
  insight: string;
  ctaHook: string;
}

export interface QuizState {
  currentQuestion: number;
  answers: QuizAnswer[];
  isComplete: boolean;
  result?: QuizResult;
}
