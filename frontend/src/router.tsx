import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { HomePage } from './components/pages/HomePage/HomePage';
import { StudyPage } from './components/pages/StudyPage/StudyPage';
import { LoginPage } from './components/pages/ProfilePage/LoginPage';
import { ProfileMenu } from './components/pages/ProfilePage/ProfileMenu';
import { CycleReviewPage } from './components/pages/ReviewPage/CycleReviewPage';
import { AntiForgetPage } from './components/pages/ReviewPage/AntiForgetPage';
import { ErrorBookPage } from './components/pages/ErrorBookPage/ErrorBookPage';
import { DictionaryPage } from './components/pages/DictionaryPage/DictionaryPage';
import { VocabularyTestPage } from './components/pages/VocabularyTestPage/VocabularyTestPage';
import { GrammarPage } from './components/pages/GrammarPage/GrammarPage';
import { WordbookLibraryPage } from './components/pages/WordbookLibraryPage/WordbookLibraryPage';
import { LearnedWordsPage } from './components/pages/HomePage/LearnedWordsPage';
import { ReadingPage } from './components/pages/ReadingPage/ReadingPage';
import { NewsReadingPage } from './components/pages/ReadingPage/NewsReadingPage';
import { ClozePage } from './components/pages/ClozePage/ClozePage';
import { ContextPage } from './components/pages/ContextPage/ContextPage';
import { MultipleChoicePage } from './components/pages/MultipleChoicePage/MultipleChoicePage';
import { ListeningPage } from './components/pages/ListeningPage/ListeningPage';
import { RootAffixPage } from './components/pages/RootAffixPage/RootAffixPage';
import { WordRingPage } from './components/pages/WordRingPage/WordRingPage';
import { SpellingPage } from './components/pages/SpellingPage/SpellingPage';
import { PhoneticsPage } from './components/pages/PhoneticsPage/PhoneticsPage';
import { PhonicsPage } from './components/pages/PhonicsPage/PhonicsPage';
import { WorksheetPage } from './components/pages/WorksheetPage/WorksheetPage';
import { FunLearningPage } from './components/pages/FunLearningPage/FunLearningPage';
import { RandomTestPage } from './components/pages/RandomTestPage/RandomTestPage';
import { TimerPage } from './components/pages/HomePage/TimerModal';
import { GroupedLearningPage } from './components/pages/GroupedLearningPage';
import { StudentManagementPage } from './components/pages/ProfilePage/StudentManagementPage';
import { MembershipPage } from './components/pages/ProfilePage/MembershipPage';
import { CreditsPage } from './components/pages/ProfilePage/CreditsPage';
import { ReferralPage } from './components/pages/ProfilePage/ReferralPage';
import { CoursewarePage } from './components/pages/ProfilePage/CoursewarePage';
import { ReportsPage } from './components/pages/ProfilePage/ReportsPage';
import { PlaceholderPage } from './components/common/PlaceholderPage';

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/study', element: <StudyPage /> },
  { path: '/review/cycle', element: <CycleReviewPage /> },
  { path: '/review/anti-forget', element: <AntiForgetPage /> },
  { path: '/error-book', element: <ErrorBookPage /> },
  { path: '/dictionary', element: <DictionaryPage /> },
  { path: '/vocabulary-test', element: <VocabularyTestPage /> },
  { path: '/grammar', element: <GrammarPage /> },
  { path: '/wordbooks', element: <WordbookLibraryPage /> },
  { path: '/profile', element: <ProfileMenu /> },
  { path: '/profile/students', element: <StudentManagementPage /> },
  { path: '/profile/membership', element: <MembershipPage /> },
  { path: '/profile/credits', element: <CreditsPage /> },
  { path: '/profile/referral', element: <ReferralPage /> },
  { path: '/profile/courseware', element: <CoursewarePage /> },
  { path: '/profile/reports', element: <ReportsPage /> },
  { path: '/records', element: <LearnedWordsPage /> },
  { path: '/reading', element: <ReadingPage /> },
  { path: '/reading/news', element: <NewsReadingPage /> },
  { path: '/cloze', element: <ClozePage /> },
  { path: '/context', element: <ContextPage /> },
  { path: '/multiple-choice', element: <MultipleChoicePage /> },
  { path: '/listening', element: <ListeningPage /> },
  { path: '/root-affix', element: <RootAffixPage /> },
  { path: '/word-ring', element: <WordRingPage /> },
  { path: '/spelling', element: <SpellingPage /> },
  { path: '/phonetics', element: <PhoneticsPage /> },
  { path: '/phonics', element: <PhonicsPage /> },
  { path: '/worksheet', element: <WorksheetPage /> },
  { path: '/fun-learning', element: <FunLearningPage /> },
  { path: '/random-test', element: <RandomTestPage /> },
  { path: '/timer', element: <TimerPage /> },
  { path: '/grouped-learning', element: <GroupedLearningPage /> },
  { path: '*', element: <Navigate to="/" replace /> },
]);
