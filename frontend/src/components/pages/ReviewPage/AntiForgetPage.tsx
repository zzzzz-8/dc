import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { EmptyState } from '../../common/EmptyState';
import { WordListItem, extractWord } from '../../common/WordListItem';
import { reviewApi } from '../../../services/api/review';
import { useUIStore } from '../../../stores/uiStore';

const EBBINGHAUS_SCHEDULE = [
  { stage: 0, label: '第1天', desc: '初次学习', interval: '20分钟' },
  { stage: 1, label: '第1天', desc: '第一次复习', interval: '1小时' },
  { stage: 2, label: '第2天', desc: '第二次复习', interval: '1天' },
  { stage: 3, label: '第4天', desc: '第三次复习', interval: '2天' },
  { stage: 4, label: '第7天', desc: '第四次复习', interval: '4天' },
  { stage: 5, label: '第15天', desc: '第五次复习', interval: '7天' },
  { stage: 6, label: '第30天', desc: '第六次复习', interval: '15天' },
];

export const AntiForgetPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useUIStore();
  const [reviewWords, setReviewWords] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selections, setSelections] = useState<Record<string, 'know' | 'dontknow'>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadReviewWords(); }, []);

  const loadReviewWords = async () => {
    try {
      const res = await reviewApi.getPlan();
      const words = res.data.data?.reviewWords || [];
      setReviewWords(words);
      setTotalCount(res.data.data?.totalCount || words.length);
    } catch { showToast('加载失败', 'error'); }
    finally { setIsLoading(false); }
  };

  const toggleSelection = useCallback((wordId: string, type: 'know' | 'dontknow') => {
    setSelections(prev => {
      const current = prev[wordId];
      if (current === type) {
        const n = { ...prev };
        delete n[wordId];
        return n;
      }
      return { ...prev, [wordId]: type };
    });
  }, []);

  const allSelected = reviewWords.length > 0 && reviewWords.every(w => selections[w.wordId || w.id]);

  const handleSubmit = async () => {
    if (!allSelected) {
      showToast('请选择所有单词', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      let correct = 0, wrong = 0;
      for (const w of reviewWords) {
        const wid = w.wordId || w.id;
        const sel = selections[wid];
        await reviewApi.processCycleReview(wid, { isCorrect: sel === 'know' });
        if (sel === 'know') correct++; else wrong++;
      }
      showToast(`✅ 记住 ${correct} · ❌ 忘记 ${wrong}`, 'success');
      setReviewWords([]);
    } catch { showToast('提交失败', 'error'); }
    finally { setSubmitting(false); }
  };

  const selectedCount = Object.keys(selections).length;
  const knowC = Object.values(selections).filter(v => v === 'know').length;
  const dontKnowC = Object.values(selections).filter(v => v === 'dontknow').length;

  if (isLoading) {
    return (
      <PageLayout showBottomNav={false}>
        <TopNav title="抗遗忘复习" showBack />
        <LoadingSpinner text="加载复习计划..." />
      </PageLayout>
    );
  }

  if (reviewWords.length === 0) {
    return (
      <PageLayout showBottomNav={false}>
        <TopNav title="抗遗忘复习" showBack />
        <EmptyState
          icon="🎉"
          title="暂无待复习单词"
          description="今日抗遗忘复习任务已完成！继续学新词吧"
          actionText="去学单词"
          onAction={() => navigate('/study')}
        />
      </PageLayout>
    );
  }

  // Group words by their current stage for display
  const stageGroups = EBBINGHAUS_SCHEDULE.map(s => ({
    ...s,
    words: reviewWords.filter(w => w.stage === s.stage),
  })).filter(g => g.words.length > 0);

  return (
    <PageLayout showBottomNav={false}>
      <TopNav
        title={`抗遗忘 (${reviewWords.length})`}
        showBack
        rightAction={<span className="text-xs text-text-secondary">✓{knowC} ✗{dontKnowC}</span>}
      />

      {/* Ebbinghaus curve info */}
      {stageGroups.length > 0 && (
        <div className="px-4 mt-2">
          <Card className="bg-primary-50 !p-3">
            <p className="text-xs font-medium text-primary-700 mb-1.5">🧠 艾宾浩斯遗忘曲线</p>
            <div className="flex flex-wrap gap-1.5">
              {stageGroups.map(g => (
                <span key={g.stage} className={`px-2 py-0.5 rounded text-[10px] ${
                  g.stage === 0 ? 'bg-red-100 text-red-600' :
                  g.stage >= 5 ? 'bg-green-100 text-green-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {g.desc} ({g.words.length})
                </span>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Word list with select mode */}
      <div className="px-4 pb-24 space-y-2 mt-2">
        {reviewWords.map(item => (
          <WordListItem
            key={item.id}
            word={extractWord(item)}
            selectMode
            selected={selections[item.wordId || item.id] || null}
            onSelect={toggleSelection}
            stage={item.stage}
            errorCount={item.errorCount}
            isReview
          />
        ))}
      </div>

      {/* Floating submit button */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-bg-primary via-bg-primary/95 to-transparent pt-6 pb-4 px-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleSubmit}
            disabled={submitting || !allSelected}
            className={`w-full py-3 rounded-xl font-medium text-base transition-all ${
              submitting ? 'bg-primary-300 text-white' :
              !allSelected ? 'bg-bg-tertiary text-text-disabled' :
              'bg-primary-500 text-white hover:bg-primary-600 shadow-lg'
            }`}
          >
            {submitting ? '⏳ 提交中...' :
             !allSelected ? `✓ 选择所有单词 (${selectedCount}/${reviewWords.length})` :
             `📝 提交 (记住 ${knowC} · 忘记 ${dontKnowC})`}
          </button>
          <p className="text-center text-[10px] text-text-placeholder mt-1">单击发音 · 双击翻译</p>
        </div>
      </div>
    </PageLayout>
  );
};
