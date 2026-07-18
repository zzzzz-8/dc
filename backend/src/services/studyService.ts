import prisma from '../utils/prisma';
import { ReviewService } from './reviewService';

export class StudyService {
  static async getTodayStudy(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { dailyGoal: true, studyStreak: true, lastStudyDate: true },
    });

    if (!user) throw new Error('USER_NOT_FOUND');

    // Count today's learned words
    const todayRecord = await prisma.dailyRecord.findUnique({
      where: { userId_date: { userId, date: today } },
    });

    const learned = todayRecord?.totalWords || 0;

    // Count review words due today
    const reviewWords = await ReviewService.getTodayReviewWords(userId);

    // Count new words available (words in active wordbook not yet started)
    const activeUserWordbook = await prisma.userWordbook.findFirst({
      where: { userId },
      include: { wordbook: { include: { words: true } } },
    });

    let nextWord = null;
    if (activeUserWordbook) {
      const learnedWordIds = await prisma.userWord.findMany({
        where: { userId },
        select: { wordId: true },
      });
      const learnedSet = new Set(learnedWordIds.map(w => w.wordId));
      const availableWord = activeUserWordbook.wordbook.words.find(w => !learnedSet.has(w.id));
      if (availableWord) {
        nextWord = availableWord;
      }
    }

    return {
      newWords: Math.max(0, user.dailyGoal - learned - reviewWords.length),
      reviewWords: reviewWords.length,
      progress: { learned, goal: user.dailyGoal },
      streak: user.studyStreak,
      nextWord,
      reviewList: reviewWords,
    };
  }

  static async recordStudy(userId: string, wordId: string, isCorrect: boolean, mode: 'new' | 'review') {
    let userWord = await prisma.userWord.findUnique({
      where: { userId_wordId: { userId, wordId } },
    });

    if (!userWord) {
      // Create new UserWord record
      userWord = await prisma.userWord.create({
        data: {
          userId,
          wordId,
          status: 'NEW',
          stage: 0,
          firstLearned: new Date(),
        },
      });
    }

    let status = userWord.status;
    let stage = userWord.stage;
    let isInErrorBook = userWord.isInErrorBook;
    let nextReviewAt: Date | null = null;

    if (mode === 'new') {
      if (isCorrect) {
        status = 'LEARNING';
        stage = 1;
        nextReviewAt = ReviewService.getNextReviewDate(1);
      } else {
        status = 'LEARNING';
        isInErrorBook = true;
        stage = 0;
        nextReviewAt = ReviewService.getNextReviewDate(0);
      }
    } else {
      // review mode
      if (isCorrect) {
        stage = Math.min(userWord.stage + 1, 6);
        if (stage === 6) {
          status = 'MASTERED';
          isInErrorBook = false;
        } else {
          status = 'LEARNING';
        }
        nextReviewAt = ReviewService.getNextReviewDate(stage);
      } else {
        stage = 0;
        isInErrorBook = true;
        status = 'FORGOTTEN';
        nextReviewAt = ReviewService.getNextReviewDate(0);
      }
    }

    await prisma.userWord.update({
      where: { userId_wordId: { userId, wordId } },
      data: {
        status,
        stage,
        isInErrorBook,
        nextReviewAt,
        lastReviewAt: new Date(),
        errorCount: isCorrect ? userWord.errorCount : userWord.errorCount + 1,
        correctCount: isCorrect ? userWord.correctCount + 1 : userWord.correctCount,
        consecutiveCorrect: isCorrect ? userWord.consecutiveCorrect + 1 : 0,
      },
    });

    // Update daily record
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await prisma.dailyRecord.upsert({
      where: { userId_date: { userId, date: today } },
      update: {
        totalWords: { increment: 1 },
        newWords: mode === 'new' ? { increment: 1 } : undefined,
        reviewedWords: mode === 'review' ? { increment: 1 } : undefined,
        errorWords: !isCorrect ? { increment: 1 } : undefined,
        masteredWords: status === 'MASTERED' ? { increment: 1 } : undefined,
      },
      create: {
        userId,
        date: today,
        totalWords: 1,
        newWords: mode === 'new' ? 1 : 0,
        reviewedWords: mode === 'review' ? 1 : 0,
        errorWords: !isCorrect ? 1 : 0,
        masteredWords: status === 'MASTERED' ? 1 : 0,
      },
    });

    // Update streak
    await this.updateStreak(userId);

    // Get updated daily stats
    const dailyRecord = await prisma.dailyRecord.findUnique({
      where: { userId_date: { userId, date: today } },
    });

    return {
      status,
      stage,
      isInErrorBook,
      nextReviewAt,
      dailyStats: dailyRecord || {
        newWords: mode === 'new' ? 1 : 0,
        totalWords: 1,
        errorWords: isCorrect ? 0 : 1,
        masteredWords: status === 'MASTERED' ? 1 : 0,
      },
    };
  }

  static async getProgress(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        cachedTotalWords: true,
        cachedLearnedWords: true,
        cachedMasteredWords: true,
        cachedErrorCount: true,
        studyStreak: true,
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRecord = await prisma.dailyRecord.findUnique({
      where: { userId_date: { userId, date: today } },
    });

    const wordbookProgress = await prisma.userWordbook.findMany({
      where: { userId },
      include: { wordbook: { select: { name: true, totalWords: true } } },
    });

    const forgottenWords = await prisma.userWord.count({
      where: { userId, status: 'FORGOTTEN' },
    });

    return {
      totalWords: user?.cachedTotalWords || 0,
      learnedWords: user?.cachedLearnedWords || 0,
      masteredWords: user?.cachedMasteredWords || 0,
      forgottenWords,
      errorCount: user?.cachedErrorCount || 0,
      todayLearned: todayRecord?.totalWords || 0,
      totalLearned: user?.cachedLearnedWords || 0,
      streak: user?.studyStreak || 0,
      wordbookProgress: wordbookProgress.map(wp => ({
        wordbookId: wp.wordbookId,
        name: wp.wordbook.name,
        learned: wp.learnedCount,
        total: wp.wordbook.totalWords,
      })),
    };
  }

  private static async updateStreak(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lastStudyDate: true, studyStreak: true },
    });

    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (!user.lastStudyDate) {
      await prisma.user.update({
        where: { id: userId },
        data: { studyStreak: 1, lastStudyDate: today },
      });
    } else {
      const lastDate = new Date(user.lastStudyDate);
      lastDate.setHours(0, 0, 0, 0);

      if (lastDate.getTime() === yesterday.getTime()) {
        // Consecutive day
        await prisma.user.update({
          where: { id: userId },
          data: {
            studyStreak: user.studyStreak + 1,
            lastStudyDate: today,
          },
        });
      } else if (lastDate.getTime() < yesterday.getTime()) {
        // Streak broken
        await prisma.user.update({
          where: { id: userId },
          data: { studyStreak: 1, lastStudyDate: today },
        });
      }
    }
  }
}
