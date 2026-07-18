import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  correct: number;
  error: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, correct, error }) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  const accuracy = current > 0 ? Math.round((correct / current) * 100) : 0;

  return (
    <div className="px-4 py-3">
      {/* Stats */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-3 text-sm">
          <span className="text-success">✅ {correct}</span>
          <span className="text-error">❌ {error}</span>
          <span className="text-text-secondary">正确率：{accuracy}%</span>
        </div>
        <span className="text-sm text-text-secondary">{current}/{total}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-primary-50 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
    </div>
  );
};
