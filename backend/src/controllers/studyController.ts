import { Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { StudyService } from '../services/studyService';
import { recordStudySchema } from '../schemas/study.schema';

export async function getTodayStudy(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await StudyService.getTodayStudy(req.user!.userId);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function recordStudy(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { wordId, isCorrect, mode } = recordStudySchema.parse(req.body);
    const result = await StudyService.recordStudy(req.user!.userId, wordId, isCorrect, mode);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getProgress(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await StudyService.getProgress(req.user!.userId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getStudyRecords(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { startDate, endDate, page = '1', limit = '30' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: any = { userId: req.user!.userId };
    if (startDate) where.date = { ...where.date, gte: new Date(startDate as string) };
    if (endDate) where.date = { ...where.date, lte: new Date(endDate as string) };

    const [records, total] = await Promise.all([
      prisma.dailyRecord.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { date: 'desc' },
      }),
      prisma.dailyRecord.count({ where }),
    ]);

    res.json({
      success: true,
      data: { records, total, page: pageNum },
    });
  } catch (err) {
    next(err);
  }
}

export async function getUserWords(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { status, page = '1', limit = '200' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: any = { userId: req.user!.userId };
    if (status && status !== 'ALL') where.status = status;

    const [items, total] = await Promise.all([
      prisma.userWord.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        include: { word: true },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.userWord.count({ where }),
    ]);

    res.json({
      success: true,
      data: { items, total, page: pageNum },
    });
  } catch (err) {
    next(err);
  }
}
