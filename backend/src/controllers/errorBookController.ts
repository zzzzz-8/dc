import { Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { errorBookNoteSchema } from '../schemas/study.schema';

export async function getErrorBook(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { page = '1', limit = '20', filter = 'ALL' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const where: any = { userId: req.user!.userId, isInErrorBook: true };
    if (filter === 'COLLECTED') where.isCollected = true;

    const [items, total] = await Promise.all([
      prisma.userWord.findMany({
        where,
        include: { word: true },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.userWord.count({ where }),
    ]);

    const errorCount = await prisma.userWord.count({
      where: { userId: req.user!.userId, isInErrorBook: true },
    });

    res.json({
      success: true,
      data: {
        items: items.map(uw => ({
          id: uw.id,
          word: uw.word,
          meaning: uw.word.meaning,
          phonetic: uw.word.phonetic,
          errorCount: uw.errorCount,
          note: uw.note,
          isCollected: uw.isCollected,
          status: uw.status,
        })),
        total,
        errorCount,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function removeFromErrorBook(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { wordId } = req.params;
    await prisma.userWord.update({
      where: { userId_wordId: { userId: req.user!.userId, wordId } },
      data: { isInErrorBook: false },
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function addNote(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { wordId } = req.params;
    const { note } = errorBookNoteSchema.parse(req.body);
    await prisma.userWord.update({
      where: { userId_wordId: { userId: req.user!.userId, wordId } },
      data: { note, noteUpdatedAt: new Date() },
    });
    res.json({ success: true, data: { note } });
  } catch (err) {
    next(err);
  }
}

export async function exportToWordbook(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { name, wordIds } = req.body;
    const where: any = { userId: req.user!.userId, isInErrorBook: true };
    if (wordIds && Array.isArray(wordIds)) {
      where.wordId = { in: wordIds };
    }

    const userWords = await prisma.userWord.findMany({
      where,
      include: { word: true },
    });

    if (userWords.length === 0) {
      throw new AppError(400, 'BIZ_002', '没有可导出的错词');
    }

    const wordbook = await prisma.wordbook.create({
      data: {
        name: name || `错词本-${new Date().toLocaleDateString()}`,
        level: 'CUSTOM',
        isCustom: true,
        authorId: req.user!.userId,
        totalWords: userWords.length,
        words: {
          create: userWords.map(uw => ({
            word: uw.word.word,
            meaning: uw.word.meaning,
            phonetic: uw.word.phonetic,
          })),
        },
      },
    });

    res.json({
      success: true,
      data: { wordbookId: wordbook.id, wordCount: userWords.length },
    });
  } catch (err) {
    next(err);
  }
}

export async function toggleCollect(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { wordId } = req.params;
    const uw = await prisma.userWord.findUnique({
      where: { userId_wordId: { userId: req.user!.userId, wordId } },
    });
    if (!uw) throw new AppError(404, 'BIZ_002', '单词未找到');

    await prisma.userWord.update({
      where: { userId_wordId: { userId: req.user!.userId, wordId } },
      data: { isCollected: !uw.isCollected },
    });
    res.json({ success: true, data: { isCollected: !uw.isCollected } });
  } catch (err) {
    next(err);
  }
}
