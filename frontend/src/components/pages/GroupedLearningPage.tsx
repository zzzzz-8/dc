import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageLayout } from '../layout/PageLayout';
import { TopNav } from '../layout/TopNav';
import { speak } from '../../services/tts/pronunciation';
import { Card } from '../common/Card';

interface UnknownWord {
  id: string;
  word: string;
  meaning: string;
  phonetic?: string;
  partOfSpeech?: string;
  example?: string;
  exampleTrans?: string;
}

const GROUP_SIZE_KEY = 'tdtd-group-size';

function getGroupSize(): number {
  try {
    const saved = localStorage.getItem(GROUP_SIZE_KEY);
    if (saved) {
      const n = parseInt(saved);
      if (n >= 1 && n <= 20) return n;
    }
  } catch {}
  return 5;
}

function setGroupSize(size: number) {
  localStorage.setItem(GROUP_SIZE_KEY, size.toString());
}

export const GroupedLearningPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const allWords: UnknownWord[] = location.state?.words || [];
  const mode = location.state?.mode || '不认识';

  const [groupSize, setLocalGroupSize] = useState(getGroupSize());
  const [currentGroup, setCurrentGroup] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [clickedId, setClickedId] = useState<string | null>(null);

  // Reset on words change
  useEffect(() => {
    setCurrentGroup(0);
    setRevealedIds(new Set());
  }, [allWords.length]);

  const totalGroups = useMemo(() => {
    return Math.max(1, Math.ceil(allWords.length / groupSize));
  }, [allWords.length, groupSize]);

  const currentWords = useMemo(() => {
    const start = currentGroup * groupSize;
    return allWords.slice(start, start + groupSize);
  }, [allWords, currentGroup, groupSize]);

  const handleKnow = (id: string) => {
    setRevealedIds(prev => { const n = new Set(prev); n.add(id); return n; });
  };

  const handleDontKnow = (id: string) => {
    setRevealedIds(prev => { const n = new Set(prev); n.add(id); return n; });
    speak(allWords.find(w => w.id === id)?.word || '', 'US');
  };

  const handleWordClick = (id: string) => {
    if (clickedId === id) {
      // Double click - toggle translation
      setRevealedIds(prev => {
        const n = new Set(prev);
        if (n.has(id)) n.delete(id); else n.add(id);
        return n;
      });
      setClickedId(null);
    } else {
      // Single click - pronounce
      const w = allWords.find(w => w.id === id);
      if (w) speak(w.word, 'US');
      setClickedId(id);
      setTimeout(() => setClickedId(null), 300);
    }
  };

  const handleGroupSizeChange = (size: number) => {
    setLocalGroupSize(size);
    setGroupSize(size);
    setCurrentGroup(0);
    setRevealedIds(new Set());
  };

  const progress = allWords.length > 0
    ? Math.round(((currentGroup * groupSize + currentWords.length) / allWords.length) * 100)
    : 0;

  // Fill grid cells to always show a full grid (3x3 = 9 cells)
  const gridSize = 9;
  const displayWords = [...currentWords];
  while (displayWords.length < gridSize && displayWords.length > 0) {
    const remaining = gridSize - displayWords.length;
    // Don't fill if under half full - use empty placeholders
    break;
  }

  return (
    <PageLayout showBottomNav={false}>
      <TopNav
        title={`${mode}词学习`}
        showBack
        rightAction={
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-xs text-primary-500 font-medium"
          >
            ⚙ 分组设置
          </button>
        }
      />

      {/* Settings panel */}
      {showSettings && (
        <Card className="mx-4 mt-2 p-3">
          <p className="text-sm font-medium text-text-primary mb-2">每组单词数</p>
          <div className="flex flex-wrap gap-2">
            {[3, 5, 6, 9, 10, 15].map(n => (
              <button
                key={n}
                onClick={() => handleGroupSizeChange(n)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  groupSize === n
                    ? 'bg-primary-500 text-white'
                    : 'bg-bg-tertiary text-text-secondary'
                }`}
              >
                {n}个/组
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Progress info */}
      <div className="px-4 mt-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-text-secondary">
            第 {currentGroup + 1}/{totalGroups} 组 · 共 {allWords.length} 词
          </span>
          <span className="text-xs text-primary-500 font-medium">{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-primary-50 rounded-full overflow-hidden">
          <div className="h-full bg-primary-500 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, progress)}%` }} />
        </div>
      </div>

      {/* 九宫格 Grid (3x3) */}
      <div className="px-4 mt-3">
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: gridSize }).map((_, idx) => {
            const w = displayWords[idx];
            if (!w) {
              return <div key={`empty-${idx}`} className="aspect-[3/2]" />;
            }

            const isRevealed = revealedIds.has(w.id);

            return (
              <div
                key={w.id}
                onClick={() => handleWordClick(w.id)}
                className={`aspect-[3/2] rounded-xl flex flex-col items-center justify-center p-2 cursor-pointer transition-all duration-200 border-2 ${
                  isRevealed
                    ? 'bg-primary-50 border-primary-200'
                    : 'bg-bg-secondary border-border shadow-card hover:shadow-md'
                }`}
              >
                <p className={`text-sm font-semibold font-english text-center leading-tight ${
                  isRevealed ? 'text-primary-600' : 'text-text-primary'
                }`}>
                  {w.word}
                </p>
                {w.phonetic && !isRevealed && (
                  <p className="text-[10px] text-text-placeholder mt-0.5">/{w.phonetic}/</p>
                )}
                {isRevealed && (
                  <p className="text-xs text-primary-500 font-medium mt-1 text-center leading-tight">
                    {w.meaning}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 mt-4 space-y-2">
        {currentWords.map(w => {
          const isRevealed = revealedIds.has(w.id);
          return (
            <div key={w.id} className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
              isRevealed ? 'bg-primary-50' : 'bg-bg-secondary shadow-card'
            }`}>
              <div className="flex-1 min-w-0 mr-2">
                <p className="text-sm font-medium text-text-primary font-english">{w.word}</p>
                {isRevealed && (
                  <p className="text-xs text-primary-600">{w.meaning}</p>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {isRevealed ? (
                  <>
                    <button
                      onClick={() => handleDontKnow(w.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-error-bg text-error text-sm hover:bg-red-100"
                      title="不认识"
                    >
                      ✗
                    </button>
                    <button
                      onClick={() => handleKnow(w.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-success-bg text-success text-sm hover:bg-green-100"
                      title="认识"
                    >
                      ✓
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleKnow(w.id)}
                    className="text-xs text-primary-500 px-2"
                  >
                    显示释义
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Group navigation */}
      <div className="px-4 mt-4 flex gap-3">
        <button
          onClick={() => {
            if (currentGroup > 0) {
              setCurrentGroup(g => g - 1);
              setRevealedIds(new Set());
              setClickedId(null);
            }
          }}
          disabled={currentGroup === 0}
          className="flex-1 py-2.5 bg-bg-secondary border border-border rounded-xl text-sm font-medium text-text-primary disabled:opacity-40 hover:bg-bg-tertiary transition-colors"
        >
          ← 上一组
        </button>
        <button
          onClick={() => {
            if (currentGroup < totalGroups - 1) {
              setCurrentGroup(g => g + 1);
              setRevealedIds(new Set());
              setClickedId(null);
            }
          }}
          disabled={currentGroup >= totalGroups - 1}
          className="flex-1 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-primary-600 transition-colors"
        >
          下一组 →
        </button>
      </div>

      {/* All done */}
      {currentGroup >= totalGroups - 1 && (
        <div className="px-4 mt-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
          >
            🎉 全部完成，回首页
          </button>
        </div>
      )}

      <div className="h-8" />
    </PageLayout>
  );
};

export default GroupedLearningPage;
