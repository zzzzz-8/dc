import { Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { MembershipService, MembershipType } from '../services/membershipService';

export async function getMembership(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { membership: true, membershipExpiry: true, credits: true },
    });

    const rights = MembershipService.getRights((user?.membership || 'FREE') as MembershipType);

    res.json({
      success: true,
      data: {
        current: user?.membership || 'FREE',
        expiry: user?.membershipExpiry,
        credits: user?.credits || 0,
        rights,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function purchaseMembership(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { plan } = req.body;
    const planInfo = MembershipService.getPlanPrice(plan);

    const planToMembership: Record<string, MembershipType> = {
      PERSONAL_MONTHLY: 'PERSONAL',
      PERSONAL_YEARLY: 'PERSONAL',
      COACH_MONTHLY: 'COACH',
      COACH_YEARLY: 'COACH',
      COACH_PERMANENT: 'COACH',
      INSTITUTION_YEARLY: 'INSTITUTION',
    };

    const membershipType = planToMembership[plan] || 'PERSONAL';
    const isPermanent = plan === 'COACH_PERMANENT';
    const expiry = isPermanent
      ? new Date('2099-12-31')
      : new Date(Date.now() + (plan.includes('YEARLY') ? 365 : 30) * 86400000);

    await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        membership: membershipType,
        membershipExpiry: expiry,
        credits: plan.includes('COACH') ? 100 : 50,
      },
    });

    res.json({
      success: true,
      data: {
        membership: membershipType,
        expiry,
        transactionId: `txn_${Date.now()}`,
        planLabel: planInfo.label,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getCredits(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { credits: true },
    });
    res.json({ success: true, data: { balance: user?.credits || 0 } });
  } catch (err) {
    next(err);
  }
}

export async function purchaseCredits(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { amount } = req.body;
    const validAmounts = [20, 200];
    if (!validAmounts.includes(amount)) {
      throw new Error('INVALID_AMOUNT');
    }

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { credits: { increment: amount } },
      select: { credits: true },
    });

    res.json({
      success: true,
      data: {
        balance: user.credits,
        transactionId: `txn_${Date.now()}`,
      },
    });
  } catch (err) {
    next(err);
  }
}
