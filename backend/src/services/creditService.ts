import prisma from '../utils/prisma';
import { PrismaClient } from '@prisma/client';

export const CREDIT_RULES = {
  SMART_COMPLETE: 2,
  UPLOAD_COURSEWARE: 5,
  DOWNLOAD_WORDBOOK: 1,
  EXPORT_REPORT: 1,
  AI_TRANSLATE: 3,
  VOICE_CLONE: 5,
} as const;

export type CreditAction = keyof typeof CREDIT_RULES;

export class CreditService {
  static canPerform(userCredits: number, action: CreditAction): boolean {
    const cost = CREDIT_RULES[action];
    return userCredits >= cost;
  }

  static async consumeCredits(userId: string, action: CreditAction): Promise<number> {
    const cost = CREDIT_RULES[action];
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    if (user.credits < cost) {
      throw new Error(`INSUFFICIENT_CREDITS: 需要 ${cost} 积分，当前 ${user.credits} 积分`);
    }

    const newBalance = user.credits - cost;
    await prisma.user.update({
      where: { id: userId },
      data: { credits: newBalance },
    });

    return newBalance;
  }

  static async addCredits(userId: string, amount: number): Promise<number> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    const newBalance = user.credits + amount;
    await prisma.user.update({
      where: { id: userId },
      data: { credits: newBalance },
    });

    return newBalance;
  }

  static getCreditRules() {
    return [
      { action: 'SMART_COMPLETE' as CreditAction, cost: CREDIT_RULES.SMART_COMPLETE, description: '智能补全单词信息（中文/音标）' },
      { action: 'UPLOAD_COURSEWARE' as CreditAction, cost: CREDIT_RULES.UPLOAD_COURSEWARE, description: '上传课件资料' },
      { action: 'DOWNLOAD_WORDBOOK' as CreditAction, cost: CREDIT_RULES.DOWNLOAD_WORDBOOK, description: '下载词书离线包' },
      { action: 'EXPORT_REPORT' as CreditAction, cost: CREDIT_RULES.EXPORT_REPORT, description: '导出学习报告' },
      { action: 'AI_TRANSLATE' as CreditAction, cost: CREDIT_RULES.AI_TRANSLATE, description: 'AI翻译服务' },
      { action: 'VOICE_CLONE' as CreditAction, cost: CREDIT_RULES.VOICE_CLONE, description: '语音克隆服务' },
    ];
  }
}
