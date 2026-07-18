import React from 'react';

const TOOLS_ROW1 = [
  { id: 'card-mode', label: '词卡', icon: '🃏' },
  { id: 'shuffle', label: '换序', icon: '🔀' },
  { id: 'cn-en', label: '汉英', icon: '🔄' },
  { id: 'listening', label: '听力', icon: '🎧' },
  { id: 'spelling', label: '拼写', icon: '✏️' },
  { id: 'simple', label: '简译', icon: '📝' },
];

const TOOLS_ROW2 = [
  { id: 'note', label: '笔记', icon: '📌' },
  { id: 'expand', label: '拓展', icon: '🔗' },
  { id: 'font-size', label: '大小', icon: '🔤' },
  { id: 'speed', label: '快读', icon: '⚡' },
  { id: 'phonetic', label: '音标', icon: '🔊' },
  { id: 'linking', label: '连读', icon: '🔗' },
];

const TOOLS_ROW3 = [
  { id: 'full', label: '全显', icon: '👁' },
  { id: 'british', label: '英音', icon: '🇬🇧' },
  { id: 'mute', label: '静音', icon: '🔇' },
  { id: 'split', label: '拆分', icon: '✂️' },
  { id: 'phonics', label: '拼读', icon: '🔤' },
  { id: 'draw', label: '画板', icon: '🎨' },
  { id: 'dict', label: '词典', icon: '📖' },
];

export const BottomToolbar: React.FC = () => {
  return (
    <div className="px-2 py-3">
      <div className="flex flex-wrap gap-1.5 justify-center">
        {TOOLS_ROW1.map(tool => (
          <button
            key={tool.id}
            className="px-2.5 py-1.5 bg-bg-tertiary rounded-lg text-xs text-text-secondary hover:bg-primary-50 hover:text-primary-600 transition-colors"
          >
            {tool.icon} {tool.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5 justify-center mt-1.5">
        {TOOLS_ROW2.map(tool => (
          <button
            key={tool.id}
            className="px-2.5 py-1.5 bg-bg-tertiary rounded-lg text-xs text-text-secondary hover:bg-primary-50 hover:text-primary-600 transition-colors"
          >
            {tool.icon} {tool.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5 justify-center mt-1.5">
        {TOOLS_ROW3.map(tool => (
          <button
            key={tool.id}
            className="px-2.5 py-1.5 bg-bg-tertiary rounded-lg text-xs text-text-secondary hover:bg-primary-50 hover:text-primary-600 transition-colors"
          >
            {tool.icon} {tool.label}
          </button>
        ))}
      </div>
    </div>
  );
};
