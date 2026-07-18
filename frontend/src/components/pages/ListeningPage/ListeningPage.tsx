import React, { useState } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { speak } from '../../../services/tts/pronunciation';

const LISTENING_EXERCISES = [
  { id: 1, word: 'beautiful', meaning: '美丽的', sentence: 'The flowers are beautiful.' },
  { id: 2, word: 'important', meaning: '重要的', sentence: 'This is very important.' },
  { id: 3, word: 'different', meaning: '不同的', sentence: 'We have different opinions.' },
  { id: 4, word: 'wonderful', meaning: '精彩的', sentence: 'What a wonderful day!' },
  { id: 5, word: 'knowledge', meaning: '知识', sentence: 'Knowledge is power.' },
  { id: 6, word: 'experience', meaning: '经验；经历', sentence: 'I had a great experience.' },
  { id: 7, word: 'education', meaning: '教育', sentence: 'Education is important for everyone.' },
  { id: 8, word: 'environment', meaning: '环境', sentence: 'We must protect the environment.' },
];

export const ListeningPage: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [finished, setFinished] = useState(false);

  const ex = LISTENING_EXERCISES[currentIdx];

  const handlePlay = () => {
    speak(ex.word, 'US');
    speak(ex.sentence, 'US');
  };

  const handleResult = (isCorrect: boolean) => {
    if (isCorrect) setCorrect(c => c + 1);
    else setWrong(w => w + 1);

    if (currentIdx < LISTENING_EXERCISES.length - 1) {
      setCurrentIdx(i => i + 1);
      setShowAnswer(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <PageLayout showBottomNav={false}>
        <TopNav title="学听力" showBack />
        <Card className="mx-4 mt-8 text-center py-8">
          <p className="text-4xl mb-4">🎧</p>
          <p className="text-xl font-bold text-text-primary mb-2">练习完成！</p>
          <p className="text-lg text-primary-500 font-bold">{correct}/{LISTENING_EXERCISES.length}</p>
          <p className="text-sm text-text-secondary mb-4">正确率：{Math.round((correct / LISTENING_EXERCISES.length) * 100)}%</p>
          <Button fullWidth onClick={() => { setCurrentIdx(0); setCorrect(0); setWrong(0); setShowAnswer(false); setFinished(false); }}>
            再来一次
          </Button>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout showBottomNav={false}>
      <TopNav title={`学听力 (${currentIdx + 1}/${LISTENING_EXERCISES.length})`} showBack />

      <div className="flex justify-center gap-4 px-4 py-2 text-sm">
        <span className="text-success">✅ {correct}</span>
        <span className="text-error">❌ {wrong}</span>
      </div>

      <div className="px-4">
        <Card className="text-center py-8">
          <button onClick={handlePlay} className="w-20 h-20 mx-auto mb-4 bg-primary-50 rounded-full flex items-center justify-center hover:bg-primary-100 active:scale-95 transition-all">
            <span className="text-3xl">🔊</span>
          </button>
          <p className="text-sm text-text-secondary mb-2">点击播放按钮听单词发音和例句</p>

          {showAnswer ? (
            <div className="mt-4">
              <p className="text-2xl font-bold text-text-primary font-english mb-2">{ex.word}</p>
              <p className="text-lg text-primary-600 mb-2">{ex.meaning}</p>
              <p className="text-sm text-text-secondary italic">{ex.sentence}</p>
            </div>
          ) : (
            <Button variant="secondary" onClick={() => setShowAnswer(true)} className="mt-4">
              显示答案
            </Button>
          )}
        </Card>

        {showAnswer && (
          <div className="flex gap-4 mt-4">
            <Button variant="danger" fullWidth onClick={() => handleResult(false)}>❌ 没听清</Button>
            <Button variant="primary" fullWidth onClick={() => handleResult(true)}>✅ 听清了</Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};
