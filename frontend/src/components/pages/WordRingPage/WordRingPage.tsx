import React, { useState } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { speak } from '../../../services/tts/pronunciation';

const WORD_RINGS = [
  { category: '动物', icon: '🐾', words: ['dog', 'cat', 'fish', 'bird', 'horse', 'elephant', 'tiger', 'rabbit'] },
  { category: '水果', icon: '🍎', words: ['apple', 'banana', 'orange', 'grape', 'strawberry', 'mango', 'peach', 'lemon'] },
  { category: '颜色', icon: '🎨', words: ['red', 'blue', 'green', 'yellow', 'white', 'black', 'purple', 'pink'] },
  { category: '身体', icon: '🧍', words: ['head', 'hand', 'eye', 'ear', 'nose', 'mouth', 'arm', 'leg'] },
  { category: '天气', icon: '🌤', words: ['sunny', 'rainy', 'cloudy', 'windy', 'snowy', 'stormy', 'warm', 'cold'] },
  { category: '运动', icon: '⚽', words: ['football', 'basketball', 'swimming', 'running', 'tennis', 'baseball', 'cycling', 'volleyball'] },
];

export const WordRingPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentWordIdx, setCurrentWordIdx] = useState(0);

  const ring = WORD_RINGS.find(r => r.category === selectedCategory);
  const currentWord = ring?.words[currentWordIdx];

  if (selectedCategory && ring) {
    return (
      <PageLayout showBottomNav={false}>
        <TopNav title={ring.category} showBack />
        <div className="px-4">
          <button onClick={() => setSelectedCategory(null)} className="text-sm text-primary-500 mb-3">← 返回分类</button>

          <Card className="text-center py-8">
            <p className="text-5xl mb-4">{ring.icon}</p>
            <p className="text-4xl font-bold text-text-primary font-english mb-4">{currentWord}</p>
            <div className="flex justify-center gap-4 mb-4">
              <button onClick={() => speak(currentWord!, 'US')} className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg">🔊 美式</button>
              <button onClick={() => speak(currentWord!, 'UK')} className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg">🔊 英式</button>
            </div>
            <p className="text-sm text-text-secondary">{ring.category} · {currentWordIdx + 1}/{ring.words.length}</p>
          </Card>

          {/* Ring navigation */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {ring.words.map((w, i) => (
              <button key={w} onClick={() => setCurrentWordIdx(i)}
                className={`w-10 h-10 rounded-full text-xs font-medium transition-all ${i === currentWordIdx ? 'bg-primary-500 text-white scale-110' : 'bg-bg-tertiary text-text-secondary'}`}
              >{w[0].toUpperCase()}</button>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <button disabled={currentWordIdx === 0} onClick={() => setCurrentWordIdx(i => i - 1)}
              className="px-4 py-2 bg-bg-tertiary rounded-lg text-text-secondary disabled:opacity-30">← 上一个</button>
            <button disabled={currentWordIdx === ring.words.length - 1} onClick={() => setCurrentWordIdx(i => i + 1)}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg disabled:opacity-30">下一个 →</button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <TopNav title="单词环" showBack />
      <div className="px-4 pb-8">
        <p className="text-sm text-text-secondary mb-3">选择分类，按主题学习单词</p>
        <div className="grid grid-cols-2 gap-3">
          {WORD_RINGS.map(ring => (
            <button key={ring.category} onClick={() => { setSelectedCategory(ring.category); setCurrentWordIdx(0); }}
              className="p-4 bg-bg-secondary rounded-xl shadow-card text-center hover:shadow-md active:scale-95 transition-all"
            >
              <p className="text-3xl mb-2">{ring.icon}</p>
              <p className="text-sm font-medium text-text-primary">{ring.category}</p>
              <p className="text-xs text-text-secondary mt-1">{ring.words.length} 个单词</p>
            </button>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};
