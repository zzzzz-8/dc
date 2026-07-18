import { UserRole, MembershipType, WordStatus, WordbookLevel, PronunciationPreference, VocabularyLevel } from './enums';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  membership: MembershipType;
  membershipExpiry?: string;
  credits: number;
  dailyGoal: number;
  reviewTime?: string;
  pronunciationPref: PronunciationPreference;
  cachedTotalWords: number;
  cachedLearnedWords: number;
  cachedMasteredWords: number;
  cachedErrorCount: number;
  studyStreak: number;
  createdAt: string;
}

export interface Wordbook {
  id: string;
  name: string;
  cover?: string;
  grade?: string;
  publisher?: string;
  level: WordbookLevel;
  totalWords: number;
  isPublic: boolean;
  downloadCount: number;
  isCustom: boolean;
}

export interface Word {
  id: string;
  word: string;
  phonetic?: string;
  phoneticUS?: string;
  phoneticUK?: string;
  meaning: string;
  partOfSpeech?: string;
  example?: string;
  exampleTrans?: string;
  rootAffix?: string;
  difficulty: number;
  examLevel?: string;
  wordbookId: string;
}

export interface UserWord {
  id: string;
  userId: string;
  wordId: string;
  word: Word;
  status: WordStatus;
  stage: number;
  errorCount: number;
  correctCount: number;
  consecutiveCorrect: number;
  firstLearned: string;
  lastReviewAt?: string;
  nextReviewAt?: string;
  isInErrorBook: boolean;
  isCollected: boolean;
  note?: string;
}

export interface DailyRecord {
  id: string;
  date: string;
  newWords: number;
  reviewedWords: number;
  totalWords: number;
  errorWords: number;
  masteredWords: number;
  wordbookId?: string;
}

export interface VocabularyTest {
  id: string;
  score: number;
  total: number;
  vocabulary: number;
  level: VocabularyLevel;
  levelLabel: string;
  testedAt: string;
}

export interface Schedule {
  id: string;
  teacherId: string;
  studentId: string;
  student?: StudentAccount;
  date: string;
  duration: number;
  content?: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

export interface StudentAccount {
  id: string;
  name: string;
  account: string;
  phone?: string;
  wordbookId?: string;
  reviewCount: number;
  remainingHours: number;
  note?: string;
  teacherId: string;
}

export interface Courseware {
  id: string;
  name: string;
  label: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
}

export interface ReferralRecord {
  id: string;
  type: string;
  commission: number;
  status: 'PENDING' | 'SETTLED';
  createdAt: string;
}
