import { Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { VocabularyService } from '../services/vocabularyService';
import { submitTestSchema } from '../schemas/study.schema';

export async function startTest(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    // Get random 60 words from user's wordbooks for the test
    const totalWords = await prisma.word.count();
    const skip = Math.max(0, Math.floor(Math.random() * Math.max(0, totalWords - 60)));

    const words = await prisma.word.findMany({
      take: 60,
      skip,
      orderBy: { id: 'asc' },
    });

    // If not enough words, pad with whatever we have
    const testWords = words.length >= 60 ? words : await prisma.word.findMany({ take: 60 });

    // Generate questions: each word with 5 random meanings + "不认识"
    const questions = testWords.map((w) => {
      // Get 5 random meanings (including the correct one + 4 distractors)
      const correctMeaning = w.meaning;
      const distractors: string[] = [];

      // Try to find 4 wrong meanings
      const otherMeanings = testWords
        .filter(other => other.id !== w.id)
        .map(other => other.meaning);

      // Shuffle and pick 4
      const shuffled = otherMeanings.sort(() => Math.random() - 0.5);
      for (let i = 0; i < Math.min(4, shuffled.length); i++) {
        distractors.push(shuffled[i]);
      }

      // Combine and shuffle options
      const allOptions = [correctMeaning, ...distractors, '不认识'];
      const shuffledOptions = allOptions
        .map((meaning, idx) => ({ meaning, originalIdx: idx }))
        .sort(() => Math.random() - 0.5);

      const answerIndex = shuffledOptions.findIndex(o => o.meaning === correctMeaning);

      return {
        id: w.id,
        word: w.word,
        options: shuffledOptions.map(o => o.meaning),
        answerIndex,
      };
    });

    // Create test record
    const test = await prisma.vocabularyTest.create({
      data: {
        userId: req.user!.userId,
        score: 0,
        total: 60,
        vocabulary: 0,
        level: 'L1',
        levelLabel: '测试中',
      },
    });

    res.json({
      success: true,
      data: {
        testId: test.id,
        questions,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function submitTest(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { testId, answers, timeUsed } = submitTestSchema.parse(req.body);
    const correctRate = answers.filter(a => a >= 0 && a <= 4).length;
    const score = Math.round(correctRate); // simplified: selected "不认识" or wrong = wrong

    const estimation = VocabularyService.estimateVocabulary(score);

    await prisma.vocabularyTest.update({
      where: { id: testId },
      data: {
        score,
        vocabulary: estimation.vocabulary,
        level: estimation.level,
        levelLabel: estimation.levelLabel,
        answers: JSON.stringify(answers),
        timeUsed,
      },
    });

    res.json({
      success: true,
      data: {
        testId,
        score,
        vocabulary: estimation.vocabulary,
        level: estimation.level,
        levelLabel: estimation.levelLabel,
        interval: estimation.interval,
        correctRate: score / 60,
        suggestions: estimation.suggestions,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getTestHistory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const [items, total] = await Promise.all([
      prisma.vocabularyTest.findMany({
        where: { userId: req.user!.userId },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { testedAt: 'desc' },
        select: {
          id: true,
          score: true,
          total: true,
          vocabulary: true,
          level: true,
          levelLabel: true,
          testedAt: true,
        },
      }),
      prisma.vocabularyTest.count({ where: { userId: req.user!.userId } }),
    ]);

    res.json({
      success: true,
      data: { items, total, page: pageNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
}

export async function getTestReport(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const test = await prisma.vocabularyTest.findFirst({
      where: { id, userId: req.user!.userId },
    });
    if (!test) {
      throw new AppError(404, 'BIZ_002', '测试记录不存在');
    }

    // Get chart data (previous tests for trend)
    const history = await prisma.vocabularyTest.findMany({
      where: { userId: req.user!.userId },
      orderBy: { testedAt: 'asc' },
      select: { level: true, vocabulary: true, testedAt: true },
    });

    res.json({
      success: true,
      data: {
        test,
        chartData: history.map(h => ({
          level: h.level,
          vocabulary: h.vocabulary,
          date: h.testedAt.toISOString().split('T')[0],
        })),
      },
    });
  } catch (err) {
    next(err);
  }
}
