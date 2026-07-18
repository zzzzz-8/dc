import React, { useState, useEffect, useRef } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';

export const TimerPage: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'countdown' | 'stopwatch'>('stopwatch');
  const [initialMinutes, setInitialMinutes] = useState(5);
  const [customMinutes, setCustomMinutes] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startTimer = () => {
    if (isRunning) return;
    setIsRunning(true);
    if (mode === 'countdown' && time === 0) {
      setTime(initialMinutes * 60);
    }
    intervalRef.current = window.setInterval(() => {
      setTime(prev => {
        if (mode === 'countdown') {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const resetTimer = () => {
    stopTimer();
    setTime(0);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const presets = [1, 3, 5, 10, 15, 20, 25, 30];

  const handleCustomSubmit = () => {
    const val = parseInt(customMinutes);
    if (val > 0 && val <= 999) {
      setInitialMinutes(val);
      setShowCustomInput(false);
      setCustomMinutes('');
    }
  };

  return (
    <PageLayout showBottomNav={false}>
      <TopNav title="课堂计时器" showBack />

      <div className="px-4 mt-4">
        <Card className="text-center py-8">
          <p className={`text-6xl font-bold font-mono mb-6 ${time <= 60 && mode === 'countdown' && isRunning ? 'text-error' : 'text-text-primary'}`}>
            {formatTime(time)}
          </p>

          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => { resetTimer(); setMode('stopwatch'); }}
              className={`px-4 py-2 rounded-lg text-sm ${mode === 'stopwatch' ? 'bg-primary-500 text-white' : 'bg-bg-tertiary text-text-secondary'}`}
            >⏱ 秒表</button>
            <button
              onClick={() => { resetTimer(); setMode('countdown'); }}
              className={`px-4 py-2 rounded-lg text-sm ${mode === 'countdown' ? 'bg-primary-500 text-white' : 'bg-bg-tertiary text-text-secondary'}`}
            >⏰ 倒计时</button>
          </div>

          {mode === 'countdown' && time === 0 && !isRunning && (
            <div className="mb-4">
              <p className="text-sm text-text-secondary mb-2">预设时间（分钟）</p>
              <div className="flex flex-wrap justify-center gap-2">
                {presets.map(m => (
                  <button
                    key={m}
                    onClick={() => { setInitialMinutes(m); setShowCustomInput(false); }}
                    className={`px-3 py-1.5 rounded-lg text-sm ${initialMinutes === m && !showCustomInput ? 'bg-primary-500 text-white' : 'bg-bg-tertiary text-text-secondary'}`}
                  >{m}分</button>
                ))}
                <button
                  onClick={() => setShowCustomInput(!showCustomInput)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${showCustomInput ? 'bg-primary-500 text-white' : 'bg-bg-tertiary text-text-secondary'}`}
                >自定义</button>
              </div>

              {showCustomInput && (
                <div className="flex items-center justify-center gap-2 mt-3">
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={customMinutes}
                    onChange={e => setCustomMinutes(e.target.value)}
                    placeholder="输入分钟"
                    className="w-28 px-3 py-2 rounded-lg border border-border text-center text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onKeyDown={e => e.key === 'Enter' && handleCustomSubmit()}
                  />
                  <button
                    onClick={handleCustomSubmit}
                    className="px-3 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600"
                  >
                    确定
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center gap-3">
            {!isRunning ? (
              <Button size="lg" onClick={startTimer}>
                {time > 0 ? '▶ 继续' : '▶ 开始'}
              </Button>
            ) : (
              <Button variant="danger" size="lg" onClick={stopTimer}>
                ⏸ 暂停
              </Button>
            )}
            {time > 0 && (
              <Button variant="secondary" size="lg" onClick={resetTimer}>
                🔄 重置
              </Button>
            )}
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};
