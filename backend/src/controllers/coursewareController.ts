import { Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { CreditService } from '../services/creditService';

export async function listCoursewares(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { label, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: any = { userId: req.user!.userId };
    if (label) where.label = label;

    const [items, total] = await Promise.all([
      prisma.courseware.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.courseware.count({ where }),
    ]);

    res.json({
      success: true,
      data: { items, total, page: pageNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
}

export async function uploadCourseware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      throw new AppError(400, 'REQ_002', '请选择要上传的文件');
    }

    const { name, label } = req.body;

    // Consume credits
    const remainingCredits = await CreditService.consumeCredits(req.user!.userId, 'UPLOAD_COURSEWARE');

    const courseware = await prisma.courseware.create({
      data: {
        name: name || req.file.originalname,
        label: label || '通用',
        fileUrl: `/uploads/${req.file.filename}`,
        fileType: req.file.mimetype.includes('pdf') ? 'PDF' : 'image',
        fileSize: req.file.size,
        userId: req.user!.userId,
      },
    });

    res.status(201).json({
      success: true,
      data: { courseware, creditsUsed: 5, remainingCredits },
    });
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('INSUFFICIENT_CREDITS')) {
      next(new AppError(403, 'BIZ_003', err.message));
    } else {
      next(err);
    }
  }
}

export async function deleteCourseware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.courseware.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
