import React, { useEffect, useState } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { membershipApi } from '../../../services/api/membership';
import { useUIStore } from '../../../stores/uiStore';

const PLANS = [
  { id: 'PERSONAL_MONTHLY', name: '个人版月卡', price: 17, period: '月', credits: 50, desc: '适合自主学习，可管理2个学生', popular: false },
  { id: 'PERSONAL_YEARLY', name: '个人版年卡', price: 33, period: '月（年付）', credits: 50, desc: '年均仅396元，更划算', popular: false },
  { id: 'COACH_MONTHLY', name: '教练版月卡', price: 167, period: '月', credits: 100, desc: '适合家教/教练，学生不限量', popular: true },
  { id: 'COACH_YEARLY', name: '教练版年卡', price: 166, period: '月（年付）', credits: 100, desc: '年均仅1992元', popular: false },
  { id: 'COACH_PERMANENT', name: '教练版永久', price: 1998, period: '永久', credits: 100, desc: '一次购买，终身使用', popular: false },
  { id: 'INSTITUTION_YEARLY', name: '机构版年卡', price: 166, period: '月（年付）', credits: 100, desc: '含品牌定制功能', popular: false },
];

export const MembershipPage: React.FC = () => {
  const { showToast } = useUIStore();
  const [currentPlan, setCurrentPlan] = useState('FREE');
  const [expiry, setExpiry] = useState<string | null>(null);
  const [credits, setCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await membershipApi.getMembership();
      const data = res.data.data!;
      setCurrentPlan(data.current);
      setExpiry(data.expiry);
      setCredits(data.credits);
    } catch {} finally { setIsLoading(false); }
  };

  const handlePurchase = async (plan: string) => {
    try {
      await membershipApi.purchase({ plan });
      showToast('购买成功！', 'success');
      loadData();
    } catch { showToast('购买失败', 'error'); }
  };

  const planLabels: Record<string, string> = { FREE: '免费版', PERSONAL: '个人版', COACH: '教练版', INSTITUTION: '机构版' };

  return (
    <PageLayout showBottomNav={false}>
      <TopNav title="会员套餐" showBack />

      <div className="px-4 pb-8">
        {isLoading ? <LoadingSpinner /> : (
          <>
            <Card className="text-center mb-4">
              <p className="text-sm text-text-secondary">当前套餐</p>
              <p className="text-xl font-bold text-primary-500">{planLabels[currentPlan] || '免费版'}</p>
              {expiry && <p className="text-xs text-text-secondary mt-1">有效期至：{new Date(expiry).toLocaleDateString()}</p>}
              <p className="text-xs text-text-secondary mt-1">积分余额：{credits}</p>
            </Card>

            <div className="space-y-3">
              {PLANS.map(plan => (
                <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-primary-500' : ''}`}>
                  {plan.popular && <span className="absolute -top-2 right-4 px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full">推荐</span>}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-text-primary">{plan.name}</h3>
                      <p className="text-xs text-text-secondary mt-1">{plan.desc}</p>
                      <p className="text-xs text-text-secondary mt-1">赠送 {plan.credits} 积分</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary-500">¥{plan.price}</p>
                      <p className="text-xs text-text-secondary">/{plan.period}</p>
                    </div>
                  </div>
                  <Button fullWidth className="mt-3" variant={plan.popular ? 'primary' : 'secondary'} onClick={() => handlePurchase(plan.id)}>
                    立即开通
                  </Button>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
};
