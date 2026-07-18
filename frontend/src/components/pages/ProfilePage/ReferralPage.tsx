import React, { useEffect, useState } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { EmptyState } from '../../common/EmptyState';
import { referralApi } from '../../../services/api/referral';
import { useUIStore } from '../../../stores/uiStore';

export const ReferralPage: React.FC = () => {
  const { showToast } = useUIStore();
  const [stats, setStats] = useState({ totalEarned: 0, pending: 0, settled: 0 });
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [statsRes, recordsRes] = await Promise.all([
        referralApi.getStats(),
        referralApi.getRecords({ limit: 50 }),
      ]);
      setStats(statsRes.data.data!);
      setRecords(recordsRes.data.data?.items || []);
    } catch {} finally { setIsLoading(false); }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://tdtd.com/referral?ref=' + Date.now());
    showToast('推广链接已复制', 'success');
  };

  return (
    <PageLayout showBottomNav={false}>
      <TopNav title="推广奖励" showBack />

      <div className="px-4 pb-8">
        {isLoading ? <LoadingSpinner /> : (
          <>
            <Card className="text-center py-6 mb-4">
              <p className="text-3xl mb-2">🎁</p>
              <p className="text-sm text-text-secondary mb-1">累计推广收益</p>
              <p className="text-4xl font-bold text-primary-500">¥{stats.totalEarned}</p>
            </Card>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <Card className="text-center">
                <p className="text-lg font-bold text-warning">¥{stats.pending}</p>
                <p className="text-xs text-text-secondary">待结算</p>
              </Card>
              <Card className="text-center">
                <p className="text-lg font-bold text-success">¥{stats.settled}</p>
                <p className="text-xs text-text-secondary">已结算</p>
              </Card>
            </div>

            <Card className="mb-4">
              <h3 className="text-sm font-medium text-text-primary mb-2">推广方式</h3>
              <p className="text-xs text-text-secondary mb-3">分享教练版月卡给好友，好友购买后你可获得佣金</p>
              <button onClick={handleCopyLink} className="w-full py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium">
                复制推广链接
              </button>
            </Card>

            <h3 className="text-sm font-medium text-text-secondary mb-2">推广记录</h3>
            {records.length === 0 ? (
              <EmptyState icon="📋" title="暂无记录" description="分享推广链接获取收益" />
            ) : (
              <div className="space-y-2">
                {records.map((r: any) => (
                  <Card key={r.id} padding="sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-text-primary">{r.type}</p>
                        <p className="text-xs text-text-secondary">{new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary-500">¥{r.commission}</p>
                        <span className={`text-xs ${r.status === 'SETTLED' ? 'text-success' : 'text-warning'}`}>
                          {r.status === 'SETTLED' ? '已结算' : '待结算'}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
};
