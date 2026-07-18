export type MembershipType = 'FREE' | 'PERSONAL' | 'COACH' | 'INSTITUTION';

export interface MembershipRights {
  canCreateStudent: boolean;
  maxStudents: number | null;
  hasReferral: boolean;
  canCustomizeBranding: boolean;
  freeCredits: number;
  planLabel: string;
}

export class MembershipService {
  private static readonly RIGHTS: Record<MembershipType, MembershipRights> = {
    FREE: {
      canCreateStudent: false,
      maxStudents: 0,
      hasReferral: false,
      canCustomizeBranding: false,
      freeCredits: 0,
      planLabel: '免费版',
    },
    PERSONAL: {
      canCreateStudent: true,
      maxStudents: 2,
      hasReferral: false,
      canCustomizeBranding: false,
      freeCredits: 50,
      planLabel: '个人版',
    },
    COACH: {
      canCreateStudent: true,
      maxStudents: null,
      hasReferral: true,
      canCustomizeBranding: false,
      freeCredits: 100,
      planLabel: '教练版',
    },
    INSTITUTION: {
      canCreateStudent: true,
      maxStudents: null,
      hasReferral: true,
      canCustomizeBranding: true,
      freeCredits: 100,
      planLabel: '机构版',
    },
  };

  static getRights(membership: MembershipType): MembershipRights {
    return this.RIGHTS[membership] || this.RIGHTS.FREE;
  }

  static canAddStudent(membership: MembershipType, currentCount: number) {
    const rights = this.getRights(membership);
    if (!rights.canCreateStudent) {
      return { allowed: false, maxStudents: 0, message: '当前会员无法创建学生账号' };
    }
    if (rights.maxStudents !== null && currentCount >= rights.maxStudents) {
      return {
        allowed: false,
        maxStudents: rights.maxStudents,
        message: `个人版会员最多只能同时添加${rights.maxStudents}个学生，升级会员？`,
      };
    }
    return { allowed: true, maxStudents: rights.maxStudents };
  }

  static getPlanPrice(plan: string): { price: number; period: string; label: string } {
    const prices: Record<string, { price: number; period: string; label: string }> = {
      'PERSONAL_MONTHLY': { price: 17, period: '月', label: '个人版月卡' },
      'PERSONAL_YEARLY': { price: 33, period: '月（年付）', label: '个人版年卡' },
      'COACH_MONTHLY': { price: 167, period: '月', label: '教练版月卡' },
      'COACH_YEARLY': { price: 166, period: '月（年付）', label: '教练版年卡' },
      'COACH_PERMANENT': { price: 1998, period: '永久', label: '教练版永久' },
      'INSTITUTION_YEARLY': { price: 166, period: '月（年付）', label: '机构版年卡' },
    };
    return prices[plan] || { price: 0, period: '未知', label: '未知套餐' };
  }
}
