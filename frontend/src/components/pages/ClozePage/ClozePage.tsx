import React, { useState } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { useUIStore } from '../../../stores/uiStore';

const CLOZE_EXERCISES = [
  {
    title: 'My Daily Routine',
    text: 'I usually ___ up at 6:30 in the morning. After brushing my teeth, I ___ a glass of water. Then I go for a ___ in the park. I ___ breakfast at 7:30 and ___ to school at 8:00.',
    blanks: ['get', 'drink', 'walk', 'have', 'go'],
    options: [
      ['get', 'wake', 'stand', 'take', 'set'],
      ['drink', 'eat', 'make', 'pour', 'fill'],
      ['walk', 'run', 'swim', 'ride', 'drive'],
      ['have', 'eat', 'take', 'make', 'cook'],
      ['go', 'come', 'leave', 'return', 'arrive'],
    ],
  },
  {
    title: 'A Trip to the Beach',
    text: 'Last summer, my family ___ to the beach. The weather was ___ and sunny. We ___ in the ocean and ___ sandcastles on the beach. It was a ___ day!',
    blanks: ['went', 'warm', 'swam', 'built', 'wonderful'],
    options: [
      ['went', 'came', 'left', 'traveled', 'visited'],
      ['warm', 'cold', 'rainy', 'cloudy', 'windy'],
      ['swam', 'sailed', 'played', 'fished', 'dived'],
      ['built', 'made', 'drew', 'dug', 'formed'],
      ['wonderful', 'terrible', 'boring', 'ordinary', 'strange'],
    ],
  },
];

export const ClozePage: React.FC = () => {
  const { showToast } = useUIStore();
  const [currentEx, setCurrentEx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const exercise = CLOZE_EXERCISES[currentEx];
  const textParts = exercise.text.split('___');

  const selectAnswer = (blankIdx: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[blankIdx] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (answers.length < exercise.blanks.length) {
      showToast('请完成所有填空', 'warning');
      return;
    }
    let s = 0;
    exercise.blanks.forEach((correct, i) => {
      if (answers[i] === correct) s++;
    });
    setScore(s);
    setShowResult(true);
    showToast(`得分：${s}/${exercise.blanks.length}`, s === exercise.blanks.length ? 'success' : 'info');
  };

  const handleReset = () => {
    setAnswers([]);
    setShowResult(false);
    setScore(0);
  };

  return (
    <PageLayout showBottomNav={false}>
      <TopNav title="学完形" showBack />

      <div className="px-4 pb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-text-primary">{exercise.title}</span>
          <span className="text-xs text-text-secondary">{currentEx + 1}/{CLOZE_EXERCISES.length}</span>
        </div>

        <Card>
          <div className="leading-relaxed text-sm text-text-primary">
            {textParts.map((part, i) => (
              <span key={i}>
                {part}
                {i < exercise.blanks.length && (
                  <span className="relative inline-block">
                    {answers[i] ? (
                      <span className={`mx-1 px-2 py-0.5 rounded border-b-2 font-medium ${showResult ? (answers[i] === exercise.blanks[i] ? 'bg-success-bg text-success border-success' : 'bg-error-bg text-error border-error') : 'bg-primary-50 text-primary-600 border-primary-500'}`}>
                        {answers[i]}
                      </span>
                    ) : (
                      <span className="mx-1 inline-block w-16 border-b-2 border-dashed border-text-placeholder">&nbsp;</span>
                    )}
                    {!answers[i] && (
                      <div className="absolute top-full left-0 mt-1 bg-bg-secondary shadow-lg rounded-lg p-1.5 z-10 flex gap-1 flex-wrap min-w-[200px]" style={{ display: showResult ? 'none' : undefined }}>
                        {exercise.options[i]?.map((opt, oi) => (
                          <button
                            key={oi}
                            onClick={() => selectAnswer(i, opt)}
                            className="px-2 py-1 text-xs rounded hover:bg-primary-50 hover:text-primary-600"
                          >{opt}</button>
                        ))}
                      </div>
                    )}
                  </span>
                )}
              </span>
            ))}
          </div>
        </Card>

        {showResult && (
          <Card className="mt-3 text-center">
            <p className="text-lg font-bold text-primary-500">{score}/{exercise.blanks.length}</p>
            <p className="text-sm text-text-secondary">正确率：{Math.round((score / exercise.blanks.length) * 100)}%</p>
          </Card>
        )}

        <div className="flex gap-3 mt-4">
          <Button variant="secondary" fullWidth onClick={handleReset}>重置</Button>
          {!showResult ? (
            <Button fullWidth onClick={handleSubmit}>提交答案</Button>
          ) : (
            <Button fullWidth onClick={() => {
              if (currentEx < CLOZE_EXERCISES.length - 1) {
                setCurrentEx(e => e + 1);
                handleReset();
              } else {
                showToast('所有练习已完成！', 'success');
              }
            }}>
              {currentEx < CLOZE_EXERCISES.length - 1 ? '下一题' : '完成'}
            </Button>
          )}
        </div>
      </div>
    </PageLayout>
  );
};
