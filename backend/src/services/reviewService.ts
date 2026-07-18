import prisma from '../utils/prisma';

export class ReviewService {
  private static readonly STAGE_INTERVALS: Record<number, number> = {
    0: 1,
    1: 1,
    2: 2,
    3: 4,
    4: 7,
    5: 15,
    6: 30,
  };

  static getNextReviewDate(currentStage: number, fromDate: Date = new Date()): Date {
    const days = this.STAGE_INTERVALS[currentStage] || 30;
    const date = new Date(fromDate);
    date.setDate(date.getDate() + days);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  static async getTodayReviewWords(userId: string, date: Date = new Date()) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await prisma.userWord.findMany({
      where: {
        userId,
        nextReviewAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          not: 'MASTERED',
        },
      },
      include: {
        word: true,
      },
      orderBy: {
        nextReviewAt: 'asc',
      },
    });
  }

  static async getCycleStages(userId: string, wordbookId?: string) {
    const where: any = { userId };
    if (wordbookId) {
      where.word = { wordbookId };
    }

    const userWords = await prisma.userWord.findMany({
      where,
      select: { stage: true, status: true },
    });

    const stageCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    let forgotten = 0;
    let mastered = 0;

    for (const uw of userWords) {
      if (uw.status === 'MASTERED') {
        mastered++;
      } else if (uw.status === 'FORGOTTEN') {
        forgotten++;
      } else {
        stageCounts[uw.stage] = (stageCounts[uw.stage] || 0) + 1;
      }
    }

    const stageLabels = ['遗忘', '一阶', '二阶', '三阶', '四阶', '五阶', '六阶'];
    const stages = Object.entries(stageCounts).map(([stage, count]) => ({
      stage: parseInt(stage),
      count,
      label: stageLabels[parseInt(stage)],
    }));

    const total = userWords.length;

    return { stages, forgotten, mastered, total };
  }

  static async processCycleReview(wordId: string, userId: string, isCorrect: boolean) {
    const userWord = await prisma.userWord.findUnique({
      where: { userId_wordId: { userId, wordId } },
    });

    if (!userWord) {
      throw new Error('WORD_NOT_FOUND');
    }

    let newStage = userWord.stage;
    let isError = false;
    let isInErrorBook = userWord.isInErrorBook;
    let status: string = userWord.status;

    if (isCorrect) {
      newStage = Math.min(userWord.stage + 1, 6);
      if (newStage === 6) {
        status = 'MASTERED';
        isInErrorBook = false;
      } else {
        status = 'LEARNING';
      }
    } else {
      newStage = 0;
      isError = true;
      isInErrorBook = true;
      status = 'FORGOTTEN';
    }

    const nextReviewAt = this.getNextReviewDate(newStage);

    await prisma.userWord.update({
      where: { userId_wordId: { userId, wordId } },
      data: {
        stage: newStage,
        status,
        isInErrorBook,
        nextReviewAt,
        lastReviewAt: new Date(),
        errorCount: isCorrect ? userWord.errorCount : userWord.errorCount + 1,
        correctCount: isCorrect ? userWord.correctCount + 1 : userWord.correctCount,
        consecutiveCorrect: isCorrect ? userWord.consecutiveCorrect + 1 : 0,
        updatedAt: new Date(),
      },
    });

    return { newStage, isError, isInErrorBook, nextReviewAt, status };
  }
}
