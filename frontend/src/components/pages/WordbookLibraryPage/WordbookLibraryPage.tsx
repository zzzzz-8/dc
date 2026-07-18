import React, { useEffect, useState } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { wordbookApi } from '../../../services/api/wordbook';
import { useWordbookStore } from '../../../stores/wordbookStore';
import { useUIStore } from '../../../stores/uiStore';
import type { Wordbook } from '../../../types/models';

export const WordbookLibraryPage: React.FC = () => {
  const { showToast } = useUIStore();
  const { myWordbooks, loadMyWordbooks, isLoading } = useWordbookStore();
  const [allWordbooks, setAllWordbooks] = useState<Wordbook[]>([]);

  useEffect(() => {
    loadMyWordbooks();
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const res = await wordbookApi.list({ limit: 50 });
      setAllWordbooks(res.data.data?.items || []);
    } catch {
      // silent
    }
  };

  const handleSubscribe = async (id: string) => {
    try {
      await wordbookApi.subscribe(id);
      showToast('添加成功', 'success');
      loadMyWordbooks();
    } catch {
      showToast('操作失败', 'error');
    }
  };

  const handleUnsubscribe = async (id: string) => {
    try {
      await wordbookApi.unsubscribe(id);
      showToast('已移除', 'success');
      loadMyWordbooks();
    } catch {
      showToast('操作失败', 'error');
    }
  };

  const subscribedIds = new Set(myWordbooks?.map((uwb: any) => uwb.wordbookId) || []);

  return (
    <PageLayout>
      <TopNav title="词书库" />

      <div className="px-4 pb-4">
        <h2 className="text-sm font-medium text-text-secondary mb-2 mt-2">我的词书</h2>
        {myWordbooks.length === 0 ? (
          <Card className="text-center text-sm text-text-secondary py-6">
            还没有添加词书，从下方选择添加
          </Card>
        ) : (
          <div className="space-y-2 mb-4">
            {myWordbooks.map((uwb: any) => (
              <Card key={uwb.id} padding="sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{uwb.wordbook?.name}</p>
                    <p className="text-xs text-text-secondary">
                      已学 {uwb.learnedCount}/{uwb.wordbook?.totalWords || 0}
                    </p>
                  </div>
                  <button
                    onClick={() => handleUnsubscribe(uwb.wordbookId)}
                    className="text-xs text-error"
                  >
                    移除
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <h2 className="text-sm font-medium text-text-secondary mb-2">全部词书</h2>
        <div className="space-y-2">
          {allWordbooks.map(wb => (
            <Card key={wb.id} padding="sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📚</span>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{wb.name}</p>
                      <p className="text-xs text-text-secondary">
                        {wb.grade && `${wb.grade} · `}{wb.totalWords}词
                      </p>
                    </div>
                  </div>
                </div>
                {subscribedIds.has(wb.id) ? (
                  <span className="text-xs text-primary-500 font-medium">已添加</span>
                ) : (
                  <button
                    onClick={() => handleSubscribe(wb.id)}
                    className="px-3 py-1 bg-primary-500 text-white rounded-lg text-xs hover:bg-primary-600"
                  >
                    + 添加
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};
