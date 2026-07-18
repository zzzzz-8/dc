import React, { useState, useEffect, useCallback } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { vocabularyTestApi } from '../../../services/api/vocabularyTest';
import { useUIStore } from '../../../stores/uiStore';
import type { TestQuestion, VocabularyTestResult } from '../../../types/api';

type Phase = 'start' | 'testing' | 'result';

export const VocabularyTestPage: React.FC = () => {
  const { showToast } = useUIStore();
  const [phase, setPhase] = useState<Phase>('start');
  const [testId, setTestId] = useState('');
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [result, setResult] = useState<VocabularyTestResult | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await vocabularyTestApi.getHistory({ limit: 10 });
      setHistory(res.data.data?.items || []);
    } catch {}
  };

  const startTest = async () => {
    setIsLoading(true);
    try {
      const res = await vocabularyTestApi.start();
      const data = res.data.data!;
      setTestId(data.testId);
      setQuestions(data.questions);
      setAnswers(new Array(60).fill(-1));
      setCurrentQ(0);
      setTimeLeft(15);
      setPhase('testing');
    } catch {
      showToast('启动测试失败', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = index;
    setAnswers(newAnswers);

    if (currentQ < 59) {
      setCurrentQ(prev => prev + 1);
      setTimeLeft(15);
    } else {
      submitTest(newAnswers);
    }
  };

  const submitTest = async (finalAnswers: number[]) => {
    setIsLoading(true);
    try {
      const res = await vocabularyTestApi.submit({
        testId,
        answers: finalAnswers,
        timeUsed: (60 - timeLeft) + (currentQ * 15),
      });
      setResult(res.data.data!);
      setPhase('result');
      loadHistory();
    } catch {
      showToast('提交失败', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Timer
  useEffect(() => {
    if (phase !== 'testing') return;
    if (timeLeft <= 0) {
      handleAnswer(5); // Auto-select "不认识"
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, phase, currentQ]);

  if (phase === 'testing') {
    const question = questions[currentQ];
    if (!question) return null;

    return (
      <PageLayout showBottomNav={false}>
        <TopNav title={`词汇量测试 (${currentQ + 1}/60)`} showBack />

        <div className="px-4 mt-4">
          {/* Timer */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-text-secondary">第 {currentQ + 1}/60 题</span>
            <span className={`text-lg font-bold ${timeLeft <= 5 ? 'text-error' : 'text-text-primary'}`}>
              {timeLeft}s
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-primary-50 rounded-full mb-6">
            <div
              className="h-full bg-primary-500 rounded-full transition-all"
              style={{ width: `${((currentQ + 1) / 60) * 100}%` }}
            />
          </div>

          {/* Word */}
          <Card className="text-center mb-4">
            <p className="text-3xl font-bold text-text-primary font-english mb-2">
              {question.word}
            </p>
            <p className="text-sm text-text-secondary">请选择正确的释义</p>
          </Card>

          {/* Options */}
          <div className="space-y-2">
            {question.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className="w-full p-3 bg-bg-secondary border border-border rounded-xl text-sm text-text-primary hover:border-primary-500 hover:bg-primary-50 active:scale-[0.98] transition-all"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  if (phase === 'result' && result) {
    const levelColors: Record<string, string> = {
      L1: 'bg-gray-100 text-gray-600',
      L2: 'bg-green-100 text-green-600',
      L3: 'bg-green-100 text-green-600',
      L4: 'bg-blue-100 text-blue-600',
      L5: 'bg-blue-100 text-blue-600',
      L6: 'bg-yellow-100 text-yellow-600',
      L7: 'bg-yellow-100 text-yellow-600',
      L8: 'bg-orange-100 text-orange-600',
      L9: 'bg-orange-100 text-orange-600',
      L10: 'bg-purple-100 text-purple-600',
    };

    return (
      <PageLayout showBottomNav={false}>
        <TopNav title="测试报告" showBack />
        <div className="px-4">
          <Card className="text-center mb-4">
            <p className="text-sm text-text-secondary mb-1">估算词汇量</p>
            <p className="text-4xl font-bold text-primary-500">{result.vocabulary}</p>
            <p className="text-xs text-text-secondary mt-1">
              估算区间：{result.interval[0]} ~ {result.interval[1]}
            </p>
          </Card>

          <Card className="mb-4">
            <div className="flex items-center justify-around">
              <div className="text-center">
                <p className="text-2xl font-bold text-text-primary">{result.score}/60</p>
                <p className="text-xs text-text-secondary">答对题数</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-text-primary">{Math.round(result.correctRate * 100)}%</p>
                <p className="text-xs text-text-secondary">正确率</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className={`text-lg font-bold px-3 py-1 rounded-full text-sm ${levelColors[result.level] || ''}`}>
                  {result.levelLabel}
                </p>
                <p className="text-xs text-text-secondary mt-1">当前等级</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-text-primary mb-3">学习建议</h3>
            <ul className="space-y-2">
              {result.suggestions.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-text-secondary">
                  <span className="text-primary-500">{i + 1}.</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Card>

          <div className="flex gap-3 mt-4">
            <Button variant="secondary" fullWidth onClick={() => setPhase('start')}>
              返回首页
            </Button>
            <Button fullWidth onClick={startTest}>
              再次测试
            </Button>
          </div>

          {history.length > 0 && (
            <Card className="mt-4">
              <h3 className="text-sm font-medium text-text-primary mb-3">历史记录</h3>
              <div className="space-y-2">
                {history.map((h: any) => (
                  <div key={h.id} className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">
                      {new Date(h.testedAt).toLocaleDateString()}
                    </span>
                    <span className="text-text-primary font-medium">
                      {h.vocabulary} 词 · {h.score}/{h.total}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="h-8" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout showBottomNav={false}>
      <TopNav title="词汇量测试" showBack />

      <div className="px-4 mt-8">
        <Card className="text-center py-8">
          <p className="text-5xl mb-4">📊</p>
          <h2 className="text-xl font-bold text-text-primary mb-2">词汇量测试</h2>
          <p className="text-sm text-text-secondary mb-6">
            60道选择题，快速估算你的英语词汇量
          </p>

          <div className="bg-bg-tertiary rounded-xl p-4 mb-6 text-left text-sm text-text-secondary space-y-2">
            <p>📝 共 60 题，每题 15 秒</p>
            <p>✅ 每题 6 个选项（5 个释义 + 不认识）</p>
            <p>🎯 选择最接近的释义</p>
            <p>⏱ 超时将自动跳过</p>
          </div>

          {isLoading ? (
            <LoadingSpinner text="生成题目中..." />
          ) : (
            <Button size="lg" fullWidth onClick={startTest}>
              开始测试
            </Button>
          )}
        </Card>

        {history.length > 0 && (
          <Card className="mt-4">
            <h3 className="text-sm font-medium text-text-primary mb-3">历史记录</h3>
            <div className="space-y-2">
              {history.map((h: any) => (
                <div key={h.id} className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">
                    {new Date(h.testedAt).toLocaleDateString()}
                  </span>
                  <span className="text-text-primary font-medium">
                    {h.vocabulary} 词 · {h.score}/{h.total}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="h-8" />
      </div>
    </PageLayout>
  );
};
