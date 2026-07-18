import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { EmptyState } from '../../common/EmptyState';
import { WordListItem, extractWord } from '../../common/WordListItem';
import { useWordbookStore } from '../../../stores/wordbookStore';
import { useUIStore } from '../../../stores/uiStore';
import { wordbookApi } from '../../../services/api/wordbook';
import { studyApi } from '../../../services/api/study';

type StudyPhase = 'loading' | 'no-wordbook' | 'ready' | 'first-pass' | 'second-pass' | 'done';

export const StudyPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useUIStore();
  const { myWordbooks, loadMyWordbooks, isLoading: wbLoading } = useWordbookStore();
  const [phase, setPhase] = useState<StudyPhase>('loading');
  const [allWords, setAllWords] = useState<any[]>([]);
  const [firstPassWords, setFirstPassWords] = useState<any[]>([]);
  const [secondPassWords, setSecondPassWords] = useState<any[]>([]);
  const [selections, setSelections] = useState<Record<string, 'know' | 'dontknow'>>({});
  const [completedCount, setCompletedCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMyWordbooks().then(() => {
      setPhase('ready');
    });
  }, []);

  useEffect(() => {
    if (phase === 'ready' && myWordbooks.length === 0) {
      showToast('请先选择词书', 'info');
      navigate('/wordbooks', { replace: true });
    } else if (phase === 'ready' && myWordbooks.length > 0 && allWords.length === 0) {
      loadWords();
    }
  }, [phase, myWordbooks]);

  const loadWords = async () => {
    try {
      const wb = myWordbooks[0]?.wordbook;
      if (!wb?.id) return;
      const res = await wordbookApi.getWords(wb.id, { limit: 500 });
      const words = res.data.data?.items || [];
      setAllWords(words);
      setFirstPassWords(words);
      setPhase('first-pass');
    } catch {
      showToast('加载单词失败', 'error');
    }
  };

  const toggleSelection = useCallback((wordId: string, type: 'know' | 'dontknow') => {
    setSelections(prev => {
      const current = prev[wordId];
      // If same type is clicked again, deselect
      if (current === type) {
        const n = { ...prev };
        delete n[wordId];
        return n;
      }
      return { ...prev, [wordId]: type };
    });
  }, []);

  const allSelected = (words: any[]) => words.length > 0 && words.every(w => selections[w.id]);

  const handleSubmit = async (words: any[], pass: 'first-pass' | 'second-pass') => {
    const unselected = words.filter(w => !selections[w.id]);
    if (unselected.length > 0) {
      showToast(`还有 ${unselected.length} 个单词未选择`, 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const knowIds: string[] = [];
      const dontKnowIds: string[] = [];

      for (const w of words) {
        const sel = selections[w.id];
        if (sel === 'know') knowIds.push(w.id);
        else dontKnowIds.push(w.id);
      }

      // Record results in batch
      for (const id of knowIds) {
        await studyApi.record({ wordId: id, isCorrect: true, mode: 'new' });
      }
      for (const id of dontKnowIds) {
        await studyApi.record({ wordId: id, isCorrect: false, mode: 'new' });
      }

      setCompletedCount(c => c + knowIds.length);

      if (pass === 'first-pass') {
        if (dontKnowIds.length === 0) {
          // All known - done!
          setPhase('done');
          showToast('🎉 全部认识！', 'success');
        } else {
          // Show ✗ words for second pass
          const unknownWords = words.filter(w => dontKnowIds.includes(w.id));
          setSecondPassWords(unknownWords);
          setSelections({});
          setPhase('second-pass');
          showToast(`🥶 ${dontKnowIds.length} 个不认识，再来一轮`, 'info');
        }
      } else {
        // second pass
        if (dontKnowIds.length === 0) {
          setPhase('done');
          showToast('🎉 全部掌握！进入抗遗忘复习', 'success');
        } else {
          // Loop: re-show remaining unknown words
          const stillUnknown = words.filter(w => dontKnowIds.includes(w.id));
          setSecondPassWords(stillUnknown);
          setSelections({});
          showToast(`还有 ${stillUnknown.length} 个不认识，再试一次`, 'warning');
        }
      }
    } catch {
      showToast('提交失败，请重试', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const currentWords = phase === 'first-pass' ? firstPassWords : secondPassWords;
  const selectedCount = Object.keys(selections).length;
  const knowCount = Object.values(selections).filter(v => v === 'know').length;
  const dontKnowCount = Object.values(selections).filter(v => v === 'dontknow').length;

  if (phase === 'loading' || wbLoading) {
    return (
      <PageLayout showBottomNav={false}>
        <TopNav title="学单词" showBack />
        <LoadingSpinner text="加载中..." />
      </PageLayout>
    );
  }

  if (phase === 'no-wordbook') {
    return (
      <PageLayout showBottomNav={false}>
        <TopNav title="学单词" showBack />
        <LoadingSpinner text="正在跳转词书库..." />
      </PageLayout>
    );
  }

  if (phase === 'done') {
    return (
      <PageLayout showBottomNav={false}>
        <TopNav title="学单词" showBack />
        <EmptyState
          icon="🎉"
          title="全部学完啦！"
          description={`本轮共完成 ${completedCount} 个单词`}
          actionText="进入抗遗忘复习"
          onAction={() => navigate('/review/anti-forget')}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout showBottomNav={false}>
      <TopNav
        title={phase === 'first-pass' ? `学单词 (${currentWords.length})` : `第二轮复习 (${currentWords.length})`}
        showBack
        rightAction={
          <span className="text-xs text-text-secondary">
            ✓{knowCount} ✗{dontKnowCount}
          </span>
        }
      />

      {/* Phase indicator */}
      <div className="px-4 mt-2">
        <div className="flex items-center gap-2 mb-1">
          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${phase === 'first-pass' ? 'bg-primary-100 text-primary-600' : 'bg-green-100 text-green-600'}`}>
            {phase === 'first-pass' ? '第一轮' : `第二轮 (${secondPassWords.length})`}
          </span>
          <span className="text-xs text-text-secondary">
            {allWords.length - firstPassWords.length + completedCount}/{allWords.length} 已完成
          </span>
        </div>
      </div>

      {/* Word list with selection mode */}
      <div className="px-4 pb-24 space-y-2">
        {currentWords.length === 0 ? (
          <LoadingSpinner text="加载单词..." />
        ) : (
          currentWords.map(item => (
            <WordListItem
              key={item.id}
              word={extractWord(item)}
              selectMode
              selected={selections[item.id] || null}
              onSelect={toggleSelection}
            />
          ))
        )}
      </div>

      {/* Floating submit button */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-bg-primary via-bg-primary/95 to-transparent pt-6 pb-4 px-4">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => handleSubmit(currentWords, phase)}
            disabled={submitting || !allSelected(currentWords)}
            className={`w-full py-3 rounded-xl font-medium text-base transition-all flex items-center justify-center gap-2 ${
              submitting ? 'bg-primary-300 text-white' :
              !allSelected(currentWords) ? 'bg-bg-tertiary text-text-disabled' :
              'bg-primary-500 text-white hover:bg-primary-600 shadow-lg'
            }`}
          >
            {submitting ? '⏳ 提交中...' :
             !allSelected(currentWords) ? `✓ 选择所有单词 (${selectedCount}/${currentWords.length})` :
             phase === 'first-pass' ? `📝 提交 (认识 ${knowCount} · 不认识 ${dontKnowCount})` :
             '📝 提交二轮结果'}
          </button>
          <p className="text-center text-[10px] text-text-placeholder mt-1">单击发音 · 双击翻译 · 全部选完才能提交</p>
        </div>
      </div>
    </PageLayout>
  );
};
