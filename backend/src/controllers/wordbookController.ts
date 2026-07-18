import { Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { createCustomWordbookSchema, updateWordbookSchema } from '../schemas/wordbook.schema';

export async function listWordbooks(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { level, publisher, search, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: any = { isPublic: true, isCustom: false };
    if (level) where.level = level;
    if (publisher) where.publisher = { contains: publisher as string };
    if (search) where.name = { contains: search as string };

    const [items, total] = await Promise.all([
      prisma.wordbook.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { downloadCount: 'desc' },
      }),
      prisma.wordbook.count({ where }),
    ]);

    res.json({
      success: true,
      data: { items, total, page: pageNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
}

export async function getWordbook(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const wordbook = await prisma.wordbook.findUnique({
      where: { id },
      include: { words: { take: 100, orderBy: { word: 'asc' } } },
    });
    if (!wordbook) {
      throw new AppError(404, 'BIZ_001', '词书不存在');
    }

    let progress = { learned: 0, total: 0, mastered: 0 };
    if (req.user) {
      const uwb = await prisma.userWordbook.findUnique({
        where: { userId_wordbookId: { userId: req.user.userId, wordbookId: id } },
      });
      if (uwb) {
        progress = { learned: uwb.learnedCount, total: wordbook.totalWords, mastered: uwb.masteredCount };
      }
    }

    res.json({ success: true, data: { wordbook, words: wordbook.words, progress } });
  } catch (err) {
    next(err);
  }
}

export async function getWordbookWords(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { page = '1', limit = '50', sort = 'alphabetical' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    let orderBy: any = { word: 'asc' };
    if (sort === 'stage') orderBy = { userWords: { stage: 'asc' } };
    if (sort === 'random') orderBy = { id: 'asc' }; // Simplified

    const [items, total] = await Promise.all([
      prisma.word.findMany({
        where: { wordbookId: id as string },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy,
      }),
      prisma.word.count({ where: { wordbookId: id as string } }),
    ]);

    res.json({
      success: true,
      data: { items, total, page: pageNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
}

export async function createCustomWordbook(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = createCustomWordbookSchema.parse(req.body);
    const wordbook = await prisma.wordbook.create({
      data: {
        name: data.name,
        grade: data.label,
        level: 'CUSTOM',
        isCustom: true,
        authorId: req.user!.userId,
        totalWords: data.words.length,
        words: {
          create: data.words.map(w => ({
            word: w.word,
            meaning: w.meaning,
            phonetic: w.phonetic || null,
          })),
        },
      },
      include: { _count: { select: { words: true } } },
    });

    res.status(201).json({
      success: true,
      data: { wordbook, wordCount: data.words.length },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateWordbook(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const data = updateWordbookSchema.parse(req.body);
    const wordbook = await prisma.wordbook.update({
      where: { id },
      data,
    });
    res.json({ success: true, data: { wordbook } });
  } catch (err) {
    next(err);
  }
}

export async function deleteWordbook(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.wordbook.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function addToMyWordbooks(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const existing = await prisma.userWordbook.findUnique({
      where: { userId_wordbookId: { userId: req.user!.userId, wordbookId: id } },
    });
    if (existing) {
      throw new AppError(400, 'BIZ_006', '该词书已添加');
    }
    await prisma.userWordbook.create({
      data: { userId: req.user!.userId, wordbookId: id },
    });
    res.json({ success: true, data: { message: '添加成功' } });
  } catch (err) {
    next(err);
  }
}

export async function getMyWordbooks(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const items = await prisma.userWordbook.findMany({
      where: { userId: req.user!.userId },
      include: {
        wordbook: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
    res.json({ success: true, data: { items } });
  } catch (err) {
    next(err);
  }
}

export async function removeMyWordbook(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.userWordbook.delete({
      where: { userId_wordbookId: { userId: req.user!.userId, wordbookId: id } },
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
