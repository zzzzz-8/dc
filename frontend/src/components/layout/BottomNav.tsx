import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { id: 'home', label: '学习', icon: '📖', path: '/' },
  { id: 'wordbooks', label: '词书', icon: '📚', path: '/wordbooks' },
  { id: 'error-book', label: '生词本', icon: '📕', path: '/error-book' },
  { id: 'profile', label: '我的', icon: '👤', path: '/profile' },
];

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-border safe-area-bottom z-40">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              isActive(item.path)
                ? 'text-primary-500'
                : 'text-text-secondary'
            }`}
            onClick={() => navigate(item.path)}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs mt-0.5 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
