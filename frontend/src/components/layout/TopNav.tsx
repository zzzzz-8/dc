import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TopNavProps {
  title?: string;
  showBack?: boolean;
  showAvatar?: boolean;
  rightAction?: React.ReactNode;
  onBack?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ title, showBack = false, showAvatar = false, rightAction, onBack }) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-30 bg-bg-primary">
      {/* Emotion text */}
      <div className="text-center pt-4 pb-1">
        <p className="font-emotion text-primary-500 italic text-sm">
          "每一个单词都是通往世界的一步"
        </p>
        <p className="font-emotion text-primary-400 italic text-xs">
          "坚持每天进步一点点"
        </p>
      </div>

      {/* Main nav bar */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2 min-w-[60px]">
          {showBack && (
            <button onClick={() => { if (onBack) onBack(); else navigate(-1); }} className="p-1 text-text-secondary hover:text-text-primary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {showAvatar && (
            <button onClick={() => navigate('/profile')} className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-sm font-medium">
              👤
            </button>
          )}
        </div>

        <div className="flex-1 text-center">
          {title && <h1 className="text-lg font-semibold text-text-primary">{title}</h1>}
        </div>

        <div className="flex items-center gap-2 min-w-[60px] justify-end">
          {rightAction}
        </div>
      </div>
    </div>
  );
};
