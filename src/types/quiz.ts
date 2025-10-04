export type QuestionType = 'single' | 'scale' | 'multiple';

export interface QuizOption {
  id: string;
  text: string;
  value: number; // For scoring different overthinker types
}

export interface QuizQuestion {
  id: string;
  section: 'cognitive' | 'action' | 'emotional' | 'behavioral';
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
  | 'chronic-planner'
  | 'research-addict'
  | 'self-doubter'
  | 'vision-hopper';

export interface QuizResult {
  type: OverthinkerType;
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
