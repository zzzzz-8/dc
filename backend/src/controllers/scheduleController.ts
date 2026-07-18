import { Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

export async function getSchedule(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { month, studentId } = req.query;
    const where: any = { teacherId: req.user!.userId };

    if (studentId) where.studentId = studentId;
    if (month) {
      const [year, m] = (month as string).split('-').map(Number);
      const startDate = new Date(year, m - 1, 1);
      const endDate = new Date(year, m, 0, 23, 59, 59, 999);
      where.date = { gte: startDate, lte: endDate };
    }

    const schedule = await prisma.schedule.findMany({
      where,
      include: { student: { select: { name: true, account: true } } },
      orderBy: { date: 'asc' },
    });

    res.json({ success: true, data: { schedule, month: month as string } });
  } catch (err) {
    next(err);
  }
}

export async function createSchedule(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { studentId, date, duration, content } = req.body;
    const schedule = await prisma.schedule.create({
      data: {
        teacherId: req.user!.userId,
        studentId,
        date: new Date(date),
        duration,
        content: content || null,
      },
    });
    res.status(201).json({ success: true, data: { schedule } });
  } catch (err) {
    next(err);
  }
}

export async function completeSchedule(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const schedule = await prisma.schedule.findFirst({
      where: { id, teacherId: req.user!.userId },
    });

    if (!schedule) {
      throw new AppError(404, 'BIZ_002', '排课记录不存在');
    }

    const updated = await prisma.schedule.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });

    // Deduct remaining hours from student
    await prisma.studentAccount.update({
      where: { id: schedule.studentId },
      data: { remainingHours: { decrement: schedule.duration / 60 } },
    });

    res.json({ success: true, data: { schedule: updated } });
  } catch (err) {
    next(err);
  }
}

export async function cancelSchedule(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.schedule.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
