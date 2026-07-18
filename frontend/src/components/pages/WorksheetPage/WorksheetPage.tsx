import React, { useState } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { useUIStore } from '../../../stores/uiStore';

interface WorksheetExercise {
  type: string;
  title: string;
  instructions: string;
  questions: { text: string; answer: string }[];
}

const WORKSHEETS: WorksheetExercise[] = [
  {
    type: 'fill-blank', title: '选词填空', instructions: '从方框中选择合适的词填入空白处',
    questions: [
      { text: 'I ___ a student.', answer: 'am' },
      { text: 'She ___ to school every day.', answer: 'goes' },
      { text: 'They ___ playing football now.', answer: 'are' },
      { text: 'He ___ a new book yesterday.', answer: 'bought' },
      { text: 'We ___ going to visit Beijing next week.', answer: 'are' },
    ],
  },
  {
    type: 'translation', title: '英译中', instructions: '将下列英文句子翻译成中文',
    questions: [
      { text: 'I love reading books.', answer: '我喜欢读书。' },
      { text: 'She is a good teacher.', answer: '她是一位好老师。' },
      { text: 'They went to the park yesterday.', answer: '他们昨天去了公园。' },
      { text: 'The weather is beautiful today.', answer: '今天天气很好。' },
    ],
  },
  {
    type: 'sentence', title: '连词成句', instructions: '将下列单词连成完整句子',
    questions: [
      { text: 'like / I / reading / books', answer: 'I like reading books.' },
      { text: 'she / to / goes / school / bus / by', answer: 'She goes to school by bus.' },
      { text: 'they / playing / are / in / park / the', answer: 'They are playing in the park.' },
    ],
  },
];

export const WorksheetPage: React.FC = () => {
  const { showToast } = useUIStore();
  const [currentWs, setCurrentWs] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const ws = WORKSHEETS[currentWs];
  const q = ws.questions[currentQ];

  const handleAnswer = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQ] = answer;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (!userAnswers[currentQ]) {
      showToast('请先作答', 'warning');
      return;
    }
    if (currentQ < ws.questions.length - 1) {
      setCurrentQ(q => q + 1);
    } else {
      let s = 0;
      ws.questions.forEach((q, i) => {
        if (userAnswers[i]?.toLowerCase().trim() === q.answer.toLowerCase().trim()) s++;
      });
      setScore(s);
      setShowResult(true);
      showToast(`得分：${s}/${ws.questions.length}`, s === ws.questions.length ? 'success' : 'info');
    }
  };

  const wsTypes = ['fill-blank', 'translation', 'sentence'];
  const wsTitles = ['选词填空', '英译中', '连词成句'];

  return (
    <PageLayout showBottomNav={false}>
      <TopNav title={`作业单 - ${ws.title}`} showBack />

      <div className="px-4 pb-8">
        <div className="flex gap-1 mb-3">
          {wsTitles.map((t, i) => (
            <div key={t} onClick={() => { setCurrentWs(i); setCurrentQ(0); setUserAnswers([]); setShowResult(false); }}
              className={`flex-1 py-2 text-center text-xs rounded-lg cursor-pointer ${currentWs === i ? 'bg-primary-500 text-white' : 'bg-bg-tertiary text-text-secondary'}`}
            >{t}</div>
          ))}
        </div>

        <Card>
          <p className="text-xs text-text-secondary mb-3">{ws.instructions}</p>
          {!showResult ? (
            <div>
              <p className="text-sm font-medium text-text-primary mb-3">
                {currentQ + 1}. {q.text}
              </p>
              <input
                value={userAnswers[currentQ] || ''}
                onChange={e => handleAnswer(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="输入答案..."
                className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
              <div className="flex gap-2 mt-4">
                <Button variant="secondary" fullWidth disabled={currentQ === 0} onClick={() => setCurrentQ(q => q - 1)}>上一题</Button>
                <Button fullWidth onClick={handleSubmit}>{currentQ < ws.questions.length - 1 ? '下一题' : '提交'}</Button>
              </div>
              <p className="text-xs text-text-secondary text-center mt-3">{currentQ + 1}/{ws.questions.length}</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-bold text-primary-500 text-center mb-3">{score}/{ws.questions.length}</p>
              {ws.questions.map((qItem, i) => (
                <div key={i} className="mb-2 p-2 bg-bg-tertiary rounded-lg">
                  <p className="text-sm text-text-primary">{qItem.text}</p>
                  <p className="text-xs mt-1">
                    你的答案：{userAnswers[i]}
                    {userAnswers[i]?.toLowerCase().trim() === qItem.answer.toLowerCase().trim() ? ' ✅' : ` ❌ (正确答案：${qItem.answer})`}
                  </p>
                </div>
              ))}
              <Button fullWidth className="mt-4" onClick={() => { setCurrentQ(0); setUserAnswers([]); setShowResult(false); setScore(0); }}>
                重新作答
              </Button>
            </div>
          )}
        </Card>
      </div>
    </PageLayout>
  );
};
