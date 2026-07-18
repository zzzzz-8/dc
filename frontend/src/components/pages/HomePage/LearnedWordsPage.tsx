import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { EmptyState } from '../../common/EmptyState';
import { WordListItem, extractWord } from '../../common/WordListItem';
import { studyApi } from '../../../services/api/study';
import { reviewApi } from '../../../services/api/review';
import { useUIStore } from '../../../stores/uiStore';

type WordFilter = 'ALL' | 'LEARNING' | 'MASTERED' | 'FORGOTTEN';

export const LearnedWordsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useUIStore();
  const [allWords, setAllWords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<any>(null);
  const [filter, setFilter] = useState<WordFilter>('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [wordRes, progRes] = await Promise.all([
        studyApi.getUserWords({ limit: 500 }),
        studyApi.getProgress(),
      ]);
      setAllWords(wordRes.data.data?.items || []);
      setProgress(progRes.data.data);
    } catch {} finally {
      setIsLoading(false);
    }
  };

  const handleKnow = async (wordId: string) => {
    try {
      await reviewApi.processCycleReview(wordId, { isCorrect: true });
      showToast('✅ 已标记掌握', 'success');
      setAllWords(prev => prev.filter(w => (w.wordId || w.id) !== wordId));
    } catch {
      showToast('操作失败', 'error');
    }
  };

  const handleDontKnow = async (wordId: string) => {
    try {
      await reviewApi.processCycleReview(wordId, { isCorrect: false });
      showToast('📕 已标记遗忘', 'info');
      setAllWords(prev => prev.map(w =>
        (w.wordId || w.id) === wordId ? { ...w, status: 'FORGOTTEN', stage: 0 } : w
      ));
    } catch {
      showToast('操作失败', 'error');
    }
  };

  const filteredWords = allWords.filter(item => {
    if (filter === 'ALL') return true;
    return item.status === filter;
  });

  const filterLabels: Record<WordFilter, string> = {
    ALL: '全部',
    LEARNING: '学习中',
    MASTERED: '已掌握',
    FORGOTTEN: '待复习',
  };

  if (isLoading) return (
    <PageLayout showBottomNav={false}>
      <TopNav title="已学词" showBack />
      <LoadingSpinner />
    </PageLayout>
  );

  return (
    <PageLayout showBottomNav={false}>
      <TopNav title={`已学词 (${allWords.length})`} showBack />

      {/* Stats cards */}
      {progress && (
        <div className="grid grid-cols-4 gap-2 px-4 mt-2">
          <Card className="text-center !p-2">
            <p className="text-lg font-bold text-primary-500">{progress.learnedWords}</p>
            <p className="text-[10px] text-text-secondary">已学</p>
          </Card>
          <Card className="text-center !p-2">
            <p className="text-lg font-bold text-green-500">{progress.masteredWords}</p>
            <p className="text-[10px] text-text-secondary">已掌握</p>
          </Card>
          <Card className="text-center !p-2">
            <p className="text-lg font-bold text-red-500">{progress.forgottenWords || 0}</p>
            <p className="text-[10px] text-text-secondary">待复习</p>
          </Card>
          <Card className="text-center !p-2">
            <p className="text-lg font-bold text-warning">{progress.streak}</p>
            <p className="text-[10px] text-text-secondary">连续</p>
          </Card>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 px-4 py-2 overflow-x-auto">
        {(['ALL', 'LEARNING', 'MASTERED', 'FORGOTTEN'] as WordFilter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f
                ? 'bg-primary-500 text-white'
                : 'bg-bg-tertiary text-text-secondary'
            }`}
          >
            {filterLabels[f]} ({f === 'ALL' ? allWords.length : allWords.filter(w => w.status === f).length})
          </button>
        ))}
      </div>

      {/* Word list */}
      <div className="px-4 pb-4 space-y-2">
        {filteredWords.length === 0 ? (
          <EmptyState
            icon="📖"
            title="暂无单词"
            description="开始学习吧！"
            actionText="去学单词"
            onAction={() => navigate('/study')}
          />
        ) : (
          filteredWords.map(item => (
            <WordListItem
              key={item.id}
              word={extractWord(item)}
              onKnow={handleKnow}
              onDontKnow={handleDontKnow}
              stage={item.stage}
              errorCount={item.errorCount}
              isReview
            />
          ))
        )}
      </div>

      <div className="h-8" />
    </PageLayout>
  );
};
