import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';

// Dictionary sources configuration
const DICTIONARY_SOURCES = [
  { id: 'CIBA', label: '词霸' },
  { id: 'BING', label: '必应' },
  { id: 'YOUDAO', label: '有道' },
  { id: 'OULU', label: '欧路' },
  { id: 'ETY', label: 'Etymonline' },
  { id: 'CAMBRIDGE', label: '剑桥' },
  { id: 'MERRIAM', label: '韦氏' },
  { id: 'OXFORD', label: '牛津' },
  { id: 'VOCABULARY', label: 'Vocabulary' },
];

export async function searchDictionary(req: Request, res: Response, next: NextFunction) {
  try {
    const { q, source = 'CIBA' } = req.query;

    if (!q || (q as string).trim().length === 0) {
      throw new AppError(400, 'REQ_002', '请输入要查询的单词');
    }

    const word = (q as string).trim().toLowerCase();

    // Search from local database first
    const dbWord = await prisma.word.findFirst({
      where: { word },
      include: { wordbook: { select: { name: true } } },
    });

    if (!dbWord) {
      // Return basic info from database if word exists anywhere
      const anyWord = await prisma.word.findFirst({
        where: { word: { contains: word } },
        include: { wordbook: { select: { name: true } } },
      });

      if (!anyWord) {
        // Return a mock result so the UI works
        res.json({
          success: true,
          data: {
            word,
            phonetic: '',
            phoneticUS: '',
            phoneticUK: '',
            meanings: [{ partOfSpeech: '', definition: '未找到该词的释义' }],
            examples: [],
            synonyms: [],
            antonyms: [],
            related: [],
            examLevel: [],
            source,
            sourceName: DICTIONARY_SOURCES.find(s => s.id === source)?.label || source,
          },
        });
        return;
      }

      res.json({
        success: true,
        data: {
          word: anyWord.word,
          phonetic: anyWord.phonetic || '',
          phoneticUS: anyWord.phoneticUS || '',
          phoneticUK: anyWord.phoneticUK || '',
          meanings: [{ partOfSpeech: anyWord.partOfSpeech || '', definition: anyWord.meaning }],
          examples: anyWord.example ? [{ sentence: anyWord.example, translation: anyWord.exampleTrans || undefined }] : [],
          synonyms: [],
          antonyms: [],
          etymology: undefined,
          related: [],
          examLevel: anyWord.examLevel ? [anyWord.examLevel] : [],
          source,
          sourceName: DICTIONARY_SOURCES.find(s => s.id === source)?.label || source,
        },
      });
      return;
    }

    res.json({
      success: true,
      data: {
        word: dbWord.word,
        phonetic: dbWord.phonetic || '',
        phoneticUS: dbWord.phoneticUS || '',
        phoneticUK: dbWord.phoneticUK || '',
        meanings: [{ partOfSpeech: dbWord.partOfSpeech || '', definition: dbWord.meaning }],
        examples: dbWord.example ? [{ sentence: dbWord.example, translation: dbWord.exampleTrans || undefined }] : [],
        synonyms: [],
        antonyms: [],
        etymology: dbWord.rootAffix || undefined,
        related: [],
        examLevel: dbWord.examLevel ? [dbWord.examLevel] : [],
        source,
        sourceName: DICTIONARY_SOURCES.find(s => s.id === source)?.label || source,
        wordbookName: dbWord.wordbook?.name,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getDictionarySources(req: Request, res: Response) {
  res.json({ success: true, data: { sources: DICTIONARY_SOURCES } });
}
