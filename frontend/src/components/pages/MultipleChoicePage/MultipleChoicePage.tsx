import React, { useState } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { useUIStore } from '../../../stores/uiStore';

const QUESTIONS = [
  { q: 'The word "abandon" means:', options: ['放弃', '接受', '拥抱', '到达', '创造'], answer: 0 },
  { q: 'What is the meaning of "brilliant"?', options: ['脆弱的', '杰出的', '勇敢的', '美丽的', '可怕的'], answer: 1 },
  { q: '"Consequence" means:', options: ['后果', '同意', '考虑', '保守', '保存'], answer: 0 },
  { q: 'Choose the correct meaning of "generate":', options: ['给予', '生产', '概括', '慷慨', '优雅'], answer: 1 },
  { q: '"Sufficient" means:', options: ['有效的', '充分的', '表面的', '连续的', '高效的'], answer: 1 },
  { q: 'The word "demonstrate" means:', options: ['摧毁', '展示', '要求', '下降', '设计'], answer: 1 },
  { q: '"adapt" means:', options: ['采用', '适应', '管理', '承认', '获得'], answer: 1 },
  { q: '"significant" means:', options: ['简单的', '重要的', '沉默的', '相似的', '真诚的'], answer: 1 },
];

export const MultipleChoicePage: React.FC = () => {
  const { showToast } = useUIStore();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (idx: number) => {
    if (showResult) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (!answers[currentQ] && answers[currentQ] !== 0) {
      showToast('请选择一个答案', 'warning');
      return;
    }
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(q => q + 1);
    } else {
      setShowResult(true);
      const score = answers.filter((a, i) => a === QUESTIONS[i].answer).length;
      showToast(`完成！得分：${score}/${QUESTIONS.length}`, score >= 5 ? 'success' : 'info');
    }
  };

  const score = showResult ? answers.filter((a, i) => a === QUESTIONS[i].answer).length : 0;

  return (
    <PageLayout showBottomNav={false}>
      <TopNav title="多选五" showBack />

      <div className="px-4 pb-8">
        {!showResult ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-text-secondary">第 {currentQ + 1}/{QUESTIONS.length} 题</span>
              <span className="text-xs text-text-secondary">已选 {answers.filter(a => a !== undefined).length} 题</span>
            </div>

            <div className="w-full h-1.5 bg-primary-50 rounded-full mb-4">
              <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }} />
            </div>

            <Card className="mb-4">
              <p className="text-base font-medium text-text-primary mb-4">{QUESTIONS[currentQ].q}</p>
              <div className="space-y-2">
                {QUESTIONS[currentQ].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={`w-full p-3 rounded-xl text-sm text-left transition-all ${
                      answers[currentQ] === i
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-bg-tertiary text-text-primary border-border hover:border-primary-500'
                    }`}
                  >{String.fromCharCode(65 + i)}. {opt}</button>
                ))}
              </div>
            </Card>

            <Button fullWidth onClick={handleNext}>
              {currentQ < QUESTIONS.length - 1 ? '下一题' : '提交'}
            </Button>
          </>
        ) : (
          <div>
            <Card className="text-center py-6 mb-4">
              <p className="text-4xl font-bold text-primary-500 mb-2">{score}/{QUESTIONS.length}</p>
              <p className="text-sm text-text-secondary">正确率：{Math.round((score / QUESTIONS.length) * 100)}%</p>
            </Card>

            <div className="space-y-2">
              {QUESTIONS.map((q, i) => (
                <Card key={i} className={`border-l-4 ${answers[i] === q.answer ? 'border-success' : 'border-error'}`}>
                  <p className="text-sm font-medium text-text-primary mb-1">{q.q}</p>
                  <p className="text-xs">你的答案：<span className={answers[i] === q.answer ? 'text-success' : 'text-error'}>{q.options[answers[i]]}</span></p>
                  {answers[i] !== q.answer && <p className="text-xs text-success">正确答案：{q.options[q.answer]}</p>}
                </Card>
              ))}
            </div>

            <Button fullWidth className="mt-4" onClick={() => { setCurrentQ(0); setAnswers([]); setShowResult(false); }}>
              重新测试
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};
