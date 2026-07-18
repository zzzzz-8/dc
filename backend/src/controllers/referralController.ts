import { Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

export async function getReferralStats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const records = await prisma.referralRecord.findMany({
      where: { userId: req.user!.userId },
    });

    const totalEarned = records.reduce((sum, r) => sum + r.commission, 0);
    const pending = records.filter(r => r.status === 'PENDING').reduce((sum, r) => sum + r.commission, 0);
    const settled = records.filter(r => r.status === 'SETTLED').reduce((sum, r) => sum + r.commission, 0);

    res.json({
      success: true,
      data: { totalEarned, pending, settled },
    });
  } catch (err) {
    next(err);
  }
}

export async function getReferralRecords(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const [items, total] = await Promise.all([
      prisma.referralRecord.findMany({
        where: { userId: req.user!.userId },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.referralRecord.count({ where: { userId: req.user!.userId } }),
    ]);

    res.json({
      success: true,
      data: { items, total, page: pageNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
}
