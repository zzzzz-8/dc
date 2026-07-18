import React, { useEffect, useState } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { studyApi } from '../../../services/api/study';
import { vocabularyTestApi } from '../../../services/api/vocabularyTest';
import { useUIStore } from '../../../stores/uiStore';

export const ReportsPage: React.FC = () => {
  const { showToast } = useUIStore();
  const [progress, setProgress] = useState<any>(null);
  const [tests, setTests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [progRes, testRes] = await Promise.all([
        studyApi.getProgress(),
        vocabularyTestApi.getHistory({ limit: 10 }),
      ]);
      setProgress(progRes.data.data);
      setTests(testRes.data.data?.items || []);
    } catch {} finally { setIsLoading(false); }
  };

  const handleExport = () => {
    showToast('报告导出功能开发中', 'info');
  };

  return (
    <PageLayout showBottomNav={false}>
      <TopNav title="学习报告" showBack rightAction={
        <button onClick={handleExport} className="text-sm text-primary-500 font-medium">导出</button>
      } />

      <div className="px-4 pb-8">
        {isLoading ? <LoadingSpinner /> : (
          <>
            {/* Overview */}
            <Card className="mb-4">
              <h3 className="text-sm font-medium text-text-primary mb-3">学习概览</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-primary-50 rounded-xl text-center">
                  <p className="text-xl font-bold text-primary-500">{progress?.totalWords || 0}</p>
                  <p className="text-xs text-text-secondary">词书总词数</p>
                </div>
                <div className="p-3 bg-success-bg rounded-xl text-center">
                  <p className="text-xl font-bold text-success">{progress?.learnedWords || 0}</p>
                  <p className="text-xs text-text-secondary">已学单词</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl text-center">
                  <p className="text-xl font-bold text-blue-500">{progress?.masteredWords || 0}</p>
                  <p className="text-xs text-text-secondary">已掌握</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-xl text-center">
                  <p className="text-xl font-bold text-orange-500">{progress?.streak || 0}</p>
                  <p className="text-xs text-text-secondary">连续学习天数</p>
                </div>
              </div>
            </Card>

            {/* Today's stats */}
            <Card className="mb-4">
              <h3 className="text-sm font-medium text-text-primary mb-3">今日学习</h3>
              <div className="flex items-center justify-around text-center">
                <div>
                  <p className="text-lg font-bold text-new-word">{progress?.todayLearned || 0}</p>
                  <p className="text-xs text-text-secondary">今日学习</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <p className="text-lg font-bold text-forgotten">{progress?.forgottenWords || 0}</p>
                  <p className="text-xs text-text-secondary">待复习</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <p className="text-lg font-bold text-error">{progress?.errorCount || 0}</p>
                  <p className="text-xs text-text-secondary">累计错词</p>
                </div>
              </div>
            </Card>

            {/* Wordbook progress */}
            {progress?.wordbookProgress?.length > 0 && (
              <Card className="mb-4">
                <h3 className="text-sm font-medium text-text-primary mb-3">词书进度</h3>
                <div className="space-y-3">
                  {progress.wordbookProgress.map((wp: any) => (
                    <div key={wp.wordbookId}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-text-primary">{wp.name}</span>
                        <span className="text-text-secondary">{wp.learned}/{wp.total}</span>
                      </div>
                      <div className="w-full h-2 bg-primary-50 rounded-full">
                        <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${(wp.learned / wp.total) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Test history */}
            {tests.length > 0 && (
              <Card>
                <h3 className="text-sm font-medium text-text-primary mb-3">词汇量测试历史</h3>
                <div className="space-y-2">
                  {tests.map((t: any) => (
                    <div key={t.id} className="flex items-center justify-between py-1">
                      <span className="text-xs text-text-secondary">{new Date(t.testedAt).toLocaleDateString()}</span>
                      <span className="text-sm font-medium text-text-primary">{t.vocabulary} 词</span>
                      <span className="text-xs text-primary-500">{t.score}/{t.total}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Button variant="secondary" fullWidth className="mt-4" onClick={handleExport}>
              导出完整报告 (消耗1积分)
            </Button>
          </>
        )}
      </div>
    </PageLayout>
  );
};
