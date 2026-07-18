import { z } from 'zod';

export const recordStudySchema = z.object({
  wordId: z.string(),
  isCorrect: z.boolean(),
  mode: z.enum(['new', 'review']),
});

export const submitTestSchema = z.object({
  testId: z.string(),
  answers: z.array(z.number().int().min(0).max(5)).length(60),
  timeUsed: z.number().int().positive(),
});

export const cycleReviewSchema = z.object({
  isCorrect: z.boolean(),
});

export const errorBookNoteSchema = z.object({
  note: z.string().max(500, '笔记最多500字'),
});

export type RecordStudyInput = z.infer<typeof recordStudySchema>;
export type SubmitTestInput = z.infer<typeof submitTestSchema>;
