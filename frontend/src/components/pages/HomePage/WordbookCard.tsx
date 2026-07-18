import React from 'react';
import { useNavigate } from 'react-router-dom';

interface WordbookCardProps {
  name?: string;
  learned: number;
  total: number;
  hasWordbook: boolean;
  onClick: () => void;
}

export const WordbookCard: React.FC<WordbookCardProps> = ({ name, learned, total, hasWordbook, onClick }) => {
  const percentage = total > 0 ? Math.round((learned / total) * 100) : 0;

  if (!hasWordbook) {
    return (
      <div
        className="mx-4 bg-bg-secondary rounded-xl shadow-card p-4 cursor-pointer active:scale-[0.98] transition-transform border-2 border-dashed border-border"
        onClick={onClick}
      >
        <div className="flex flex-col items-center py-3">
          <span className="text-3xl mb-2">📚</span>
          <h3 className="text-base font-semibold text-text-primary mb-1">未选择词库</h3>
          <p className="text-sm text-text-secondary">点击选择要学习的词书</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mx-4 bg-bg-secondary rounded-xl shadow-card p-4 cursor-pointer active:scale-[0.98] transition-transform"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-lg">📚</span>
            <h3 className="text-base font-semibold text-text-primary">{name}</h3>
          </div>
          <p className="text-sm text-text-secondary">学习进度：{learned}/{total}</p>
        </div>
        <span className="text-sm font-medium text-primary-500">{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-primary-50 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
    </div>
  );
};
