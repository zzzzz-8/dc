import { Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { MembershipService, MembershipType } from '../services/membershipService';
import { hashPassword } from '../utils/bcrypt';

export async function getStudents(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const students = await prisma.studentAccount.findMany({
      where: { teacherId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
    });

    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { membership: true },
    });

    const rights = MembershipService.getRights((user?.membership || 'FREE') as MembershipType);

    res.json({
      success: true,
      data: {
        students,
        canAddMore: rights.maxStudents === null || students.length < rights.maxStudents,
        maxStudents: rights.maxStudents,
        currentCount: students.length,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function createStudent(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { name, phone, wordbookId, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { membership: true },
    });

    const currentCount = await prisma.studentAccount.count({
      where: { teacherId: req.user!.userId },
    });

    const check = MembershipService.canAddStudent((user?.membership || 'FREE') as MembershipType, currentCount);
    if (!check.allowed) {
      throw new AppError(403, 'BIZ_005', check.message || '无法添加更多学生');
    }

    const account = `stu_${Date.now().toString(36)}`;
    const hashedPwd = await hashPassword(password || '123456');

    const student = await prisma.studentAccount.create({
      data: {
        name,
        account,
        password: hashedPwd,
        phone: phone || null,
        wordbookId: wordbookId || null,
        teacherId: req.user!.userId,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        student,
        remainingSlots: check.maxStudents !== null ? check.maxStudents - currentCount - 1 : null,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateStudent(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, phone, wordbookId, password, note } = req.body;

    const data: any = {};
    if (name) data.name = name;
    if (phone !== undefined) data.phone = phone;
    if (wordbookId !== undefined) data.wordbookId = wordbookId;
    if (note !== undefined) data.note = note;
    if (password) data.password = await hashPassword(password);

    const student = await prisma.studentAccount.update({
      where: { id },
      data,
    });

    res.json({ success: true, data: { student } });
  } catch (err) {
    next(err);
  }
}

export async function deleteStudent(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.studentAccount.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function getScheduleStats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { studentId, status, startDate, endDate } = req.query;

    const where: any = { teacherId: req.user!.userId };
    if (studentId) where.studentId = studentId;
    if (status) where.status = status;
    if (startDate) where.date = { ...where.date, gte: new Date(startDate as string) };
    if (endDate) where.date = { ...where.date, lte: new Date(endDate as string) };

    const records = await prisma.schedule.findMany({
      where,
      include: { student: { select: { name: true, account: true } } },
      orderBy: { date: 'desc' },
    });

    const totalHours = records.reduce((sum, r) => sum + r.duration, 0) / 60;
    const completedHours = records
      .filter(r => r.status === 'COMPLETED')
      .reduce((sum, r) => sum + r.duration, 0) / 60;

    res.json({
      success: true,
      data: {
        records,
        stats: {
          totalHours: Math.round(totalHours * 10) / 10,
          completedHours: Math.round(completedHours * 10) / 10,
          completedCourses: records.filter(r => r.status === 'COMPLETED').length,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}
