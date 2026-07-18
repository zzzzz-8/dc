import React, { useState } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { speak } from '../../../services/tts/pronunciation';
import { useUIStore } from '../../../stores/uiStore';

const GAMES = [
  { id: 'flash', title: '闪卡速记', icon: '🃏', desc: '快速闪现单词，考验你的反应速度' },
  { id: 'match', title: '单词配对', icon: '🎯', desc: '将英文单词与中文释义配对' },
  { id: 'guess', title: '猜词游戏', icon: '🤔', desc: '看中文释义猜英文单词' },
  { id: 'chain', title: '单词接龙', icon: '🐉', desc: '用上一个单词的尾字母开始新单词' },
];

const FLASH_WORDS = [
  { word: 'apple', meaning: '苹果' },
  { word: 'book', meaning: '书' },
  { word: 'cat', meaning: '猫' },
  { word: 'dog', meaning: '狗' },
  { word: 'elephant', meaning: '大象' },
  { word: 'flower', meaning: '花' },
  { word: 'garden', meaning: '花园' },
  { word: 'house', meaning: '房子' },
  { word: 'island', meaning: '岛屿' },
  { word: 'juice', meaning: '果汁' },
];

const MATCH_WORDS = [
  { word: 'beautiful', meaning: '美丽的' },
  { word: 'important', meaning: '重要的' },
  { word: 'different', meaning: '不同的' },
  { word: 'wonderful', meaning: '精彩的' },
  { word: 'knowledge', meaning: '知识' },
  { word: 'experience', meaning: '经验' },
];

export const FunLearningPage: React.FC = () => {
  const { showToast } = useUIStore();
  const [game, setGame] = useState<string | null>(null);
  const [flashIdx, setFlashIdx] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [flashScore, setFlashScore] = useState(0);
  const [matchSelected, setMatchSelected] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [shuffledWords, setShuffledWords] = useState(() => [...MATCH_WORDS].sort(() => Math.random() - 0.5));
  const [shuffledMeanings, setShuffledMeanings] = useState(() => [...MATCH_WORDS].sort(() => Math.random() - 0.5));

  // Flash Card Game
  if (game === 'flash') {
    const flashWord = FLASH_WORDS[flashIdx];
    if (flashIdx >= FLASH_WORDS.length) {
      return (
        <PageLayout showBottomNav={false}>
          <TopNav title="闪卡速记" showBack />
          <Card className="mx-4 mt-8 text-center py-8">
            <p className="text-4xl mb-4">🎉</p>
            <p className="text-xl font-bold mb-2">完成！</p>
            <p className="text-lg text-primary-500 font-bold">{flashScore}/{FLASH_WORDS.length}</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => { setGame(null); setFlashIdx(0); setFlashScore(0); setShowMeaning(false); }} className="flex-1 py-2 bg-bg-tertiary rounded-xl text-sm">返回</button>
              <button onClick={() => { setFlashIdx(0); setFlashScore(0); setShowMeaning(false); }} className="flex-1 py-2 bg-primary-500 text-white rounded-xl text-sm">再来一次</button>
            </div>
          </Card>
        </PageLayout>
      );
    }

    return (
      <PageLayout showBottomNav={false}>
        <TopNav title={`闪卡速记 (${flashIdx + 1}/${FLASH_WORDS.length})`} showBack />
        <div className="px-4">
          <div className="w-full h-1.5 bg-primary-50 rounded-full mb-4">
            <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(flashIdx / FLASH_WORDS.length) * 100}%` }} />
          </div>
          <Card className="text-center py-12">
            <p className={`text-4xl font-bold mb-4 transition-all ${showMeaning ? 'text-primary-500' : 'text-text-primary'}`}>
              {showMeaning ? flashWord.meaning : flashWord.word}
            </p>
            <button onClick={() => { speak(flashWord.word, 'US'); setShowMeaning(true); }} className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm">
              {showMeaning ? '🔊 听发音' : '🔊 显示释义'}
            </button>
          </Card>
          {showMeaning && (
            <div className="flex gap-4 mt-4">
              <button onClick={() => { setFlashIdx(i => i + 1); setShowMeaning(false); }} className="flex-1 py-3 bg-error-bg text-error rounded-xl text-sm">❌ 没记住</button>
              <button onClick={() => { setFlashScore(s => s + 1); setFlashIdx(i => i + 1); setShowMeaning(false); }} className="flex-1 py-3 bg-success-bg text-success rounded-xl text-sm">✅ 记住了</button>
            </div>
          )}
        </div>
      </PageLayout>
    );
  }

  // Match Game
  if (game === 'match') {
    const handleSelectWord = (w: string) => {
      if (matchedPairs.includes(w)) return;
      setMatchSelected(w);
    };
    const handleSelectMeaning = (m: string) => {
      if (!matchSelected || matchedPairs.includes(matchSelected)) return;
      const correctMatch = MATCH_WORDS.find(p => p.word === matchSelected)?.meaning;
      if (correctMatch === m) {
        setMatchedPairs(p => [...p, matchSelected]);
        setMatchSelected(null);
        if (matchedPairs.length + 1 === MATCH_WORDS.length) {
          showToast('🎉 全部配对成功！', 'success');
        }
      } else {
        showToast('❌ 配对错误，再试试', 'error');
        setMatchSelected(null);
      }
    };

    const isComplete = matchedPairs.length === MATCH_WORDS.length;

    return (
      <PageLayout showBottomNav={false}>
        <TopNav title={`单词配对 (${matchedPairs.length}/${MATCH_WORDS.length})`} showBack />
        <div className="px-4 pb-8">
          <p className="text-sm text-text-secondary mb-3">点击英文单词，再点击对应释义</p>
          <div className="space-y-3">
            <p className="text-xs font-medium text-text-secondary">英文单词</p>
            <div className="flex flex-wrap gap-2">
              {shuffledWords.map(p => (
                <button key={p.word} onClick={() => handleSelectWord(p.word)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${matchedPairs.includes(p.word) ? 'bg-success-bg text-success border border-success' : matchSelected === p.word ? 'bg-primary-500 text-white' : 'bg-bg-secondary border border-border text-text-primary'}`}
                >{p.word}</button>
              ))}
            </div>
            <p className="text-xs font-medium text-text-secondary mt-4">中文释义</p>
            <div className="flex flex-wrap gap-2">
              {shuffledMeanings.map(p => {
                const isMatched = matchedPairs.includes(MATCH_WORDS.find(mw => mw.meaning === p.meaning)?.word || '');
                return (
                  <button key={p.meaning} onClick={() => handleSelectMeaning(p.meaning)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isMatched ? 'bg-success-bg text-success border border-success opacity-50' : 'bg-bg-secondary border border-border text-text-primary hover:border-primary-500'}`}
                  >{p.meaning}</button>
                );
              })}
            </div>
          </div>
          {isComplete && (
            <button onClick={() => { setGame(null); setMatchedPairs([]); setMatchSelected(null); }} className="w-full mt-4 py-3 bg-primary-500 text-white rounded-xl text-sm">返回</button>
          )}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showBottomNav={false}>
      <TopNav title="趣味学" showBack />
      <div className="px-4 pb-8">
        <div className="space-y-3">
          {GAMES.map(g => (
            <Card key={g.id} className="cursor-pointer active:scale-[0.98]" onClick={() => setGame(g.id)}>
              <div className="flex items-center gap-4">
                <span className="text-3xl">{g.icon}</span>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-text-primary">{g.title}</h3>
                  <p className="text-xs text-text-secondary mt-0.5">{g.desc}</p>
                </div>
                <span className="text-text-placeholder">→</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};
