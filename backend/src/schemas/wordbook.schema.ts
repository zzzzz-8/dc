import { z } from 'zod';

export const createCustomWordbookSchema = z.object({
  name: z.string().min(2, '词书名称至少2个字符').max(50, '词书名称最多50个字符'),
  label: z.string().min(1, '请选择分类标签'),
  words: z.array(z.object({
    word: z.string().min(1, '单词不能为空').max(100),
    meaning: z.string().min(1, '释义不能为空').max(500),
    phonetic: z.string().optional(),
  })).min(1, '至少添加1个单词').max(5000, '最多5000个单词'),
});

export const wordSchema = z.object({
  word: z.string().min(1).max(100).regex(/^[a-zA-Z\s\-']+$/, '仅支持英文字母、空格、连字符和撇号'),
  meaning: z.string().min(1).max(500),
  phonetic: z.string().max(50).optional(),
  partOfSpeech: z.enum(['n.', 'v.', 'adj.', 'adv.', 'pron.', 'prep.', 'conj.', 'interj.', 'art.']).optional(),
  example: z.string().max(1000).optional(),
});

export const updateWordbookSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  grade: z.string().optional(),
  publisher: z.string().optional(),
});

export type CreateCustomWordbookInput = z.infer<typeof createCustomWordbookSchema>;
export type WordInput = z.infer<typeof wordSchema>;
