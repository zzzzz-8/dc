import React, { useState } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { speak } from '../../../services/tts/pronunciation';
import { useUIStore } from '../../../stores/uiStore';

const TEST_WORDS = [
  { word: 'beautiful', meaning: '美丽的' },
  { word: 'important', meaning: '重要的' },
  { word: 'knowledge', meaning: '知识' },
  { word: 'experience', meaning: '经验' },
  { word: 'different', meaning: '不同的' },
  { word: 'education', meaning: '教育' },
  { word: 'environment', meaning: '环境' },
  { word: 'wonderful', meaning: '精彩的' },
  { word: 'necessary', meaning: '必要的' },
  { word: 'difficult', meaning: '困难的' },
  { word: 'government', meaning: '政府' },
  { word: 'condition', meaning: '条件' },
  { word: 'attention', meaning: '注意' },
  { word: 'situation', meaning: '情况' },
  { word: 'direction', meaning: '方向' },
];

type TestMode = 'en2cn' | 'cn2en' | 'listen';

export const RandomTestPage: React.FC = () => {
  const { showToast } = useUIStore();
  const [mode, setMode] = useState<TestMode>('en2cn');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  const shuffled = [...TEST_WORDS].sort(() => Math.random() - 0.5);
  const current = shuffled[currentIdx % shuffled.length];

  const handleStart = () => {
    setStarted(true);
    setCurrentIdx(0);
    setCorrect(0);
    setWrong(0);
    setIsFlipped(false);
    setFinished(false);
  };

  const handleResult = (isCorrect: boolean) => {
    if (isCorrect) setCorrect(c => c + 1);
    else setWrong(w => w + 1);
    if (currentIdx < 9) {
      setCurrentIdx(i => i + 1);
      setIsFlipped(false);
    } else {
      setFinished(true);
    }
  };

  const prompt = mode === 'en2cn' ? current.word : mode === 'cn2en' ? current.meaning : '🔊 听发音';

  if (finished) {
    const total = correct + wrong;
    return (
      <PageLayout showBottomNav={false}>
        <TopNav title="随机测" showBack />
        <Card className="mx-4 mt-8 text-center py-8">
          <p className="text-4xl mb-4">📊</p>
          <p className="text-xl font-bold text-text-primary mb-2">测试完成！</p>
          <p className="text-3xl font-bold text-primary-500 mb-2">{correct}/{total}</p>
          <p className="text-sm text-text-secondary mb-2">正确率：{Math.round((correct / total) * 100)}%</p>
          <div className="flex gap-3 mt-4">
            <Button variant="secondary" onClick={() => setStarted(false)}>选择模式</Button>
            <Button onClick={handleStart}>再来一次</Button>
          </div>
        </Card>
      </PageLayout>
    );
  }

  if (!started) {
    return (
      <PageLayout showBottomNav={false}>
        <TopNav title="随机测" showBack />
        <div className="px-4 mt-4">
          <Card className="text-center py-8">
            <p className="text-4xl mb-4">🎲</p>
            <h2 className="text-xl font-bold text-text-primary mb-2">随机测试</h2>
            <p className="text-sm text-text-secondary mb-6">每次随机抽取10个单词进行测试</p>
            <div className="space-y-2 mb-6">
              {([['en2cn', '📖 英文→中文'], ['cn2en', '📝 中文→英文'], ['listen', '🎧 听力→中文']] as const).map(([key, label]) => (
                <button key={key} onClick={() => setMode(key)}
                  className={`w-full p-3 rounded-xl text-sm text-left transition-all ${mode === key ? 'bg-primary-500 text-white' : 'bg-bg-tertiary text-text-primary'}`}
                >{label}</button>
              ))}
            </div>
            <Button size="lg" fullWidth onClick={handleStart}>开始测试</Button>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showBottomNav={false}>
      <TopNav title={`随机测 (${currentIdx + 1}/10)`} showBack />

      <div className="flex justify-center gap-4 px-4 py-2 text-sm">
        <span className="text-success">✅ {correct}</span>
        <span className="text-error">❌ {wrong}</span>
      </div>

      <div className="w-full h-1.5 bg-primary-50">
        <div className="h-full bg-primary-500 transition-all" style={{ width: `${((currentIdx) / 10) * 100}%` }} />
      </div>

      <div className="px-4 mt-4">
        <Card className="text-center py-10">
          {mode === 'listen' && (
            <button onClick={() => speak(current.word, 'US')} className="w-20 h-20 mx-auto mb-4 bg-primary-50 rounded-full flex items-center justify-center hover:bg-primary-100">
              <span className="text-3xl">🔊</span>
            </button>
          )}
          <p className={`text-3xl font-bold ${mode === 'listen' ? '' : 'text-text-primary'} font-english mb-4`}>
            {mode === 'en2cn' ? current.word : mode === 'cn2en' ? current.meaning : '点击喇叭听发音'}
          </p>
          {isFlipped && (
            <p className="text-xl text-primary-600">
              {mode === 'en2cn' ? current.meaning : current.word}
            </p>
          )}
          {!isFlipped && mode !== 'listen' && (
            <button onClick={() => setIsFlipped(true)} className="text-sm text-primary-500 mt-2">显示答案</button>
          )}
          {mode === 'listen' && !isFlipped && (
            <button onClick={() => setIsFlipped(true)} className="text-sm text-primary-500 mt-2">显示单词</button>
          )}
        </Card>

        {isFlipped && (
          <div className="flex gap-4 mt-4">
            <Button variant="danger" fullWidth onClick={() => handleResult(false)}>❌ 答错了</Button>
            <Button variant="primary" fullWidth onClick={() => handleResult(true)}>✅ 答对了</Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};
