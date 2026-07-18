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

interface StageCell {
  stage: number;
  label: string;
  count: number;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
}

const STAGE_CELLS: StageCell[] = [
  { stage: 0, label: '遗忘', icon: '❌', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  { stage: 1, label: '一阶', icon: '🌱', color: 'text-blue-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { stage: 2, label: '二阶', icon: '🌿', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { stage: 3, label: '三阶', icon: '🌳', color: 'text-indigo-500', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
  { stage: 4, label: '四阶', icon: '🔥', color: 'text-purple-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  { stage: 5, label: '五阶', icon: '💎', color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  { stage: 6, label: '六阶', icon: '🏆', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  { stage: -1, label: '掌握', icon: '✅', color: 'text-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  { stage: -2, label: '统计', icon: '📊', color: 'text-text-secondary', bgColor: 'bg-bg-tertiary', borderColor: 'border-border' },
];

export const CycleReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useUIStore();

  // Grid view
  const [stageData, setStageData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [masteredCount, setMasteredCount] = useState(0);

  // Word list view (inside a cell)
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const [stageWords, setStageWords] = useState<any[]>([]);
  const [selections, setSelections] = useState<Record<string, 'know' | 'dontknow'>>({});
  const [submitting, setSubmitting] = useState(false);
  const [stageStats, setStageStats] = useState({ known: 0, forgotten: 0 });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [stageRes, wordsRes] = await Promise.all([
        reviewApi.getCycleStages(),
        reviewApi.getCycleWords(),
      ]);
      const sd = stageRes.data.data!;
      setStageData(sd);
      setMasteredCount(sd.mastered);

      // Group words by stage for quick access
      const allWords = wordsRes.data.data?.items || [];
      // Store all words for later filtering
      (window as any).__cycleWords = allWords;
    } catch { showToast('加载失败', 'error'); }
    finally { setIsLoading(false); }
  };

  const openStage = async (stage: number) => {
    setActiveStage(stage);
    setSelections({});
    setStageStats({ known: 0, forgotten: 0 });

    const allWords = (window as any).__cycleWords || [];
    if (stage === -2) return; // Stats cell - not clickable for words

    let words: any[];
    if (stage === -1) {
      // Mastered words - get from API with MASTERED status
      try {
        const res = await reviewApi.getCycleWords();
        words = res.data.data?.items?.filter((w: any) => w.status === 'MASTERED') || [];
      } catch { words = []; }
    } else {
      words = allWords.filter((w: any) => w.stage === stage && w.status !== 'MASTERED');
    }
    setStageWords(words);
  };

  const closeStage = () => {
    setActiveStage(null);
    setStageWords([]);
    setSelections({});
    loadData(); // Refresh stats
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

  const allSelected = stageWords.length > 0 && stageWords.every(w => selections[w.id || w.wordId]);

  const handleSubmit = async () => {
    if (!allSelected) {
      showToast('请选择所有单词', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      let known = 0, forgotten = 0;
      for (const w of stageWords) {
        const wid = w.wordId || w.id;
        const sel = selections[wid];
        if (sel === 'know') {
          await reviewApi.processCycleReview(wid, { isCorrect: true });
          known++;
        } else {
          await reviewApi.processCycleReview(wid, { isCorrect: false });
          forgotten++;
        }
      }
      setStageStats({ known, forgotten });
      showToast(`✅ 记住 ${known} · ❌ 忘记 ${forgotten}`, 'success');
      closeStage();
    } catch { showToast('提交失败', 'error'); }
    finally { setSubmitting(false); }
  };

  const getStageData = (stage: number): { count: number; label: string } => {
    if (stage === -1) return { count: masteredCount, label: '掌握' };
    if (stage === -2) return { count: stageData?.total || 0, label: '统计' };
    const s = stageData?.stages?.find((st: any) => st.stage === stage);
    return { count: s?.count || 0, label: s?.label || '' };
  };

  if (isLoading) {
    return (<PageLayout><TopNav title="循环记" showBack /><LoadingSpinner text="加载中..." /></PageLayout>);
  }

  // ----- Word List View (inside a cell) -----
  if (activeStage !== null && activeStage >= -1) {
    const cell = STAGE_CELLS.find(c => c.stage === activeStage) || STAGE_CELLS[0];
    const isMastered = activeStage === -1;
    const selectedCount = Object.keys(selections).length;
    const knowC = Object.values(selections).filter(v => v === 'know').length;
    const dontKnowC = Object.values(selections).filter(v => v === 'dontknow').length;

    return (
      <PageLayout showBottomNav={false}>
        <TopNav title={`${cell.label} (${stageWords.length})`} showBack onBack={closeStage} />

        {stageWords.length === 0 ? (
          <EmptyState
            icon={cell.icon}
            title={isMastered ? '暂无已掌握单词' : `${cell.label} 暂无单词`}
            description="继续学习新词来充实这里吧"
            actionText="回九宫格"
            onAction={closeStage}
          />
        ) : (
          <>
            <div className="px-4 pb-24 space-y-2 mt-2">
              {stageWords.map((item: any) => {
                const wid = item.wordId || item.id;
                return (
                  <WordListItem
                    key={item.id}
                    word={extractWord(item)}
                    selectMode={!isMastered}
                    selected={selections[wid] || null}
                    onSelect={toggleSelection}
                    stage={activeStage === -1 ? undefined : activeStage}
                    errorCount={item.errorCount}
                    isReview={isMastered}
                    showActions={!isMastered}
                  />
                );
              })}
            </div>

            {!isMastered && (
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
                     !allSelected ? `✓ 选择所有 (${selectedCount}/${stageWords.length})` :
                     `📝 提交 (记住 ${knowC} · 忘记 ${dontKnowC})`}
                  </button>
                  <p className="text-center text-[10px] text-text-placeholder mt-1">单击发音 · 双击翻译</p>
                </div>
              </div>
            )}
          </>
        )}
        <div className="h-8" />
      </PageLayout>
    );
  }

  // ----- 九宫格 Grid View (default) -----
  return (
    <PageLayout>
      <TopNav title="循环记" showBack />

      {/* Overview stats */}
      {stageData && (
        <Card className="mx-4 mt-2">
          <div className="flex justify-around text-center">
            <div>
              <p className="text-lg font-bold text-red-500">{stageData.forgotten}</p>
              <p className="text-[10px] text-text-secondary">遗忘</p>
            </div>
            <div className="w-px bg-border" />
            <div>
              <p className="text-lg font-bold text-green-500">{stageData.mastered}</p>
              <p className="text-[10px] text-text-secondary">掌握</p>
            </div>
            <div className="w-px bg-border" />
            <div>
              <p className="text-lg font-bold text-text-primary">{stageData.total}</p>
              <p className="text-[10px] text-text-secondary">总词数</p>
            </div>
          </div>
        </Card>
      )}

      {/* 九宫格 (3×3) */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-3 gap-3">
          {STAGE_CELLS.map(cell => {
            const info = getStageData(cell.stage);
            return (
              <button
                key={cell.stage}
                onClick={() => cell.stage >= -1 ? openStage(cell.stage) : null}
                className={`aspect-square rounded-xl ${cell.bgColor} border-2 ${cell.borderColor} flex flex-col items-center justify-center p-2 transition-all hover:shadow-md active:scale-95 ${cell.stage === -2 ? 'opacity-70' : ''}`}
              >
                <span className="text-xl mb-1">{cell.icon}</span>
                <span className={`text-xs font-semibold ${cell.color}`}>{cell.label}</span>
                <span className={`text-lg font-bold ${cell.color}`}>{info.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <Card className="mx-4 mt-4 bg-primary-50">
        <h4 className="text-sm font-medium text-primary-700 mb-2">💡 使用说明</h4>
        <ul className="text-xs text-primary-600 space-y-1">
          <li>• 点击宫格进入该阶段的单词列表</li>
          <li>• 每个单词选择 ✓认识 或 ✗不认识</li>
          <li>• 全部选完后点击"提交"</li>
          <li>• ✓的进入下一阶段，✗的退回遗忘</li>
          <li>• 六阶升级为"掌握"，不再出现</li>
        </ul>
      </Card>

      <div className="h-8" />
    </PageLayout>
  );
};
