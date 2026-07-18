import React, { useState, useRef } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { speak } from '../../../services/tts/pronunciation';
import { useUIStore } from '../../../stores/uiStore';

const SPELLING_WORDS = ['beautiful', 'important', 'knowledge', 'experience', 'education', 'environment', 'government', 'necessary', 'different', 'difficult'];

export const SpellingPage: React.FC = () => {
  const { showToast } = useUIStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState('');
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const [showingWord, setShowingWord] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const word = SPELLING_WORDS[currentIdx];

  const handlePlay = () => {
    speak(word, 'US');
    setShowingWord(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleCheck = () => {
    if (!input.trim()) {
      showToast('请输入拼写', 'warning');
      return;
    }
    const isCorrect = input.trim().toLowerCase() === word;
    setShowResult(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setStats(s => ({ ...s, correct: s.correct + 1 }));
    else setStats(s => ({ ...s, wrong: s.wrong + 1 }));
  };

  const handleNext = () => {
    if (currentIdx < SPELLING_WORDS.length - 1) {
      setCurrentIdx(i => i + 1);
      setInput('');
      setShowResult(null);
      setShowingWord(false);
      if (inputRef.current) inputRef.current.focus();
    } else {
      showToast(`🎉 完成！正确率：${Math.round((stats.correct / SPELLING_WORDS.length) * 100)}%`, 'success');
    }
  };

  const handleShowWord = () => setShowingWord(true);

  return (
    <PageLayout showBottomNav={false}>
      <TopNav title={`练拼写 (${currentIdx + 1}/${SPELLING_WORDS.length})`} showBack />

      <div className="flex justify-center gap-4 px-4 py-2 text-sm">
        <span className="text-success">✅ {stats.correct}</span>
        <span className="text-error">❌ {stats.wrong}</span>
      </div>

      <div className="px-4">
        <Card className="text-center py-6">
          <button onClick={handlePlay} className="w-16 h-16 mx-auto mb-3 bg-primary-50 rounded-full flex items-center justify-center hover:bg-primary-100">
            <span className="text-2xl">🔊</span>
          </button>
          <p className="text-sm text-text-secondary mb-3">听发音，拼写单词</p>

          {showingWord && (
            <p className="text-3xl font-bold text-primary-500 font-english mb-4">{word}</p>
          )}

          {!showResult && !showingWord && (
            <Button variant="secondary" size="sm" onClick={handleShowWord}>显示单词</Button>
          )}

          <div className="mt-4">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (showResult ? handleNext() : handleCheck())}
              placeholder="输入拼写..."
              className="w-full px-4 py-3 text-center text-lg font-english border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
          </div>

          {showResult && (
            <p className={`mt-3 text-lg font-medium ${showResult === 'correct' ? 'text-success' : 'text-error'}`}>
              {showResult === 'correct' ? '✅ 拼写正确！' : `❌ 正确拼写：${word}`}
            </p>
          )}
        </Card>

        <div className="flex gap-3 mt-4">
          {!showResult ? (
            <Button fullWidth onClick={handleCheck}>检查拼写</Button>
          ) : (
            <Button fullWidth onClick={handleNext}>{currentIdx < SPELLING_WORDS.length - 1 ? '下一题' : '完成'}</Button>
          )}
        </div>
      </div>
    </PageLayout>
  );
};
