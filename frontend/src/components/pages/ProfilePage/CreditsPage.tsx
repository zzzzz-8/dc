import React, { useEffect, useState } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { membershipApi } from '../../../services/api/membership';
import { useUIStore } from '../../../stores/uiStore';

export const CreditsPage: React.FC = () => {
  const { showToast } = useUIStore();
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await membershipApi.getCredits();
      setBalance(res.data.data?.balance || 0);
    } catch {} finally { setIsLoading(false); }
  };

  const handlePurchase = async (amount: number) => {
    try {
      const res = await membershipApi.purchaseCredits({ amount });
      showToast(`成功充值 ${amount} 积分！`, 'success');
      setBalance(res.data.data?.balance || 0);
    } catch { showToast('购买失败', 'error'); }
  };

  const CREDIT_RULES = [
    { action: '智能补全单词信息', cost: '2 积分/次' },
    { action: '上传课件资料', cost: '5 积分/次' },
    { action: '下载词书离线包', cost: '1 积分/次' },
    { action: '导出学习报告', cost: '1 积分/次' },
    { action: 'AI翻译服务', cost: '3 积分/次' },
  ];

  return (
    <PageLayout showBottomNav={false}>
      <TopNav title="积分中心" showBack />

      <div className="px-4 pb-8">
        {isLoading ? <LoadingSpinner /> : (
          <>
            <Card className="text-center py-6 mb-4">
              <p className="text-sm text-text-secondary mb-1">当前积分</p>
              <p className="text-5xl font-bold text-primary-500">{balance}</p>
            </Card>

            <h3 className="text-sm font-medium text-text-secondary mb-2">购买积分</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Card className="text-center cursor-pointer active:scale-[0.98]" onClick={() => handlePurchase(20)}>
                <p className="text-lg font-bold text-primary-500">20 积分</p>
                <p className="text-xs text-text-secondary mt-1">¥2</p>
                <Button size="sm" fullWidth className="mt-2">购买</Button>
              </Card>
              <Card className="text-center cursor-pointer active:scale-[0.98]" onClick={() => handlePurchase(200)}>
                <p className="text-lg font-bold text-primary-500">200 积分</p>
                <p className="text-xs text-text-secondary mt-1">¥18（省¥2）</p>
                <Button size="sm" fullWidth className="mt-2" variant="primary">购买</Button>
              </Card>
            </div>

            <h3 className="text-sm font-medium text-text-secondary mb-2">积分消耗说明</h3>
            <Card>
              <div className="space-y-2">
                {CREDIT_RULES.map((rule, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-text-primary">{rule.action}</span>
                    <span className="text-text-secondary text-xs">{rule.cost}</span>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </PageLayout>
  );
};
