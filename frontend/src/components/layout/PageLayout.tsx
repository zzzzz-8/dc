import React from 'react';
import { BottomNav } from './BottomNav';

interface PageLayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showBottomNav = true,
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-bg-primary max-w-lg mx-auto relative ${className}`}>
      <main className={`pb-${showBottomNav ? '16' : '0'}`}>
        {children}
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
};
