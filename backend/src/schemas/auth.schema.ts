import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, '姓名至少2个字符').max(50, '姓名最多50个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6位').max(100, '密码最多100位'),
});

export const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(1, '请输入密码'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  phone: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号').optional().or(z.literal('')),
  dailyGoal: z.number().int().min(5, '每日目标至少5个').max(200, '每日目标最多200个').optional(),
  reviewTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, '请输入有效时间 HH:mm').optional().nullable(),
  pronunciationPref: z.enum(['US', 'UK']).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
