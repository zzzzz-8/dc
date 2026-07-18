import { Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { ReviewService } from '../services/reviewService';
import { cycleReviewSchema } from '../schemas/study.schema';

export async function getReviewPlan(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { date } = req.query;
    const reviewDate = date ? new Date(date as string) : new Date();
    const reviewWords = await ReviewService.getTodayReviewWords(req.user!.userId, reviewDate);

    res.json({
      success: true,
      data: {
        date: reviewDate.toISOString().split('T')[0],
        reviewWords,
        totalCount: reviewWords.length,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getCycleStages(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { wordbookId } = req.query;
    const result = await ReviewService.getCycleStages(
      req.user!.userId,
      wordbookId as string | undefined
    );
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function processCycleReview(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { wordId } = req.params;
    const { isCorrect } = cycleReviewSchema.parse(req.body);
    const result = await ReviewService.processCycleReview(wordId, req.user!.userId, isCorrect);
    res.json({ success: true, data: result });
  } catch (err) {
    if (err instanceof Error && err.message === 'WORD_NOT_FOUND') {
      next(new AppError(404, 'BIZ_002', '单词未找到'));
    } else {
      next(err);
    }
  }
}

export async function getCycleWords(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { wordbookId } = req.query;
    const where: any = { userId: req.user!.userId };
    if (wordbookId) where.word = { wordbookId };

    const items = await prisma.userWord.findMany({
      where,
      include: { word: true },
      orderBy: { stage: 'asc' },
    });

    res.json({ success: true, data: { items, total: items.length } });
  } catch (err) {
    next(err);
  }
}
