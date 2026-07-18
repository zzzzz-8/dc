export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  user: import('./models').User;
  token: string;
}

export interface StudyTodayResponse {
  newWords: number;
  reviewWords: number;
  progress: { learned: number; goal: number };
  streak: number;
  nextWord: import('./models').Word | null;
  reviewList: any[];
}

export interface StudyRecordResponse {
  status: string;
  stage: number;
  isInErrorBook: boolean;
  nextReviewAt: string | null;
  dailyStats: {
    newWords: number;
    totalWords: number;
    errorWords: number;
    masteredWords: number;
  };
}

export interface VocabularyTestStartResponse {
  testId: string;
  questions: TestQuestion[];
}

export interface TestQuestion {
  id: string;
  word: string;
  options: string[];
  answerIndex: number;
}

export interface VocabularyTestResult {
  testId: string;
  score: number;
  vocabulary: number;
  level: string;
  levelLabel: string;
  interval: [number, number];
  correctRate: number;
  suggestions: string[];
}

export interface CycleStageData {
  stages: { stage: number; count: number; label: string }[];
  forgotten: number;
  mastered: number;
  total: number;
}
