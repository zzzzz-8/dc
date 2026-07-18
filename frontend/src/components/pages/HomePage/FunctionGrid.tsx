import React from 'react';
import { useNavigate } from 'react-router-dom';

const FUNCTION_GRID = [
  { id: 'study', label: '学单词', icon: '📖', path: '/study' },
  { id: 'anti-forget', label: '抗遗忘', icon: '🧠', path: '/review/anti-forget' },
  { id: 'cycle', label: '循环记', icon: '🔄', path: '/review/cycle' },
  { id: 'learned', label: '已学词', icon: '✅', path: '/records' },
  { id: 'reading', label: '目学阅读', icon: '📚', path: '/reading' },
  { id: 'news', label: '学时文', icon: '📰', path: '/reading/news' },
  { id: 'cloze', label: '学完形', icon: '📝', path: '/cloze' },
  { id: 'context', label: '学语境', icon: '🌐', path: '/context' },
  { id: 'multi-choice', label: '多选五', icon: '🔢', path: '/multiple-choice' },
  { id: 'listening', label: '学听力', icon: '🎧', path: '/listening' },
  { id: 'root-affix', label: '词根缀', icon: '🌿', path: '/root-affix' },
  { id: 'word-ring', label: '单词环', icon: '⭕', path: '/word-ring' },
  { id: 'error-book', label: '☆错词本', icon: '⭐', path: '/error-book' },
  { id: 'spelling', label: '练拼写', icon: '✏️', path: '/spelling' },
  { id: 'grammar', label: '学语法', icon: '📐', path: '/grammar' },
  { id: 'phonetics', label: '学音标', icon: '🔊', path: '/phonetics' },
  { id: 'phonics', label: '学拼读', icon: '🔤', path: '/phonics' },
  { id: 'worksheet', label: '作业单', icon: '📋', path: '/worksheet' },
];

const BOTTOM_ENTRIES = [
  { id: 'fun-learning', label: '趣味学', icon: '🎮', path: '/fun-learning' },
  { id: 'random-test', label: '随机测', icon: '🎲', path: '/random-test' },
];

export const FunctionGrid: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4">
      {/* Main grid 6x3 */}
      <div className="grid grid-cols-3 gap-3">
        {FUNCTION_GRID.map(item => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center bg-bg-secondary rounded-xl py-4 px-2 shadow-card hover:shadow-md transition-all active:scale-95"
          >
            <span className="text-2xl mb-1">{item.icon}</span>
            <span className="text-xs text-text-secondary font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Bottom entries */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        {BOTTOM_ENTRIES.map(item => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className="flex items-center justify-center gap-2 bg-bg-secondary rounded-xl py-3 shadow-card hover:shadow-md transition-all active:scale-95"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium text-text-primary">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
