import React from 'react';
import { PageLayout } from '../layout/PageLayout';
import { TopNav } from '../layout/TopNav';
import { EmptyState } from './EmptyState';

interface PlaceholderPageProps {
  title: string;
  emoji?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, emoji = '🚧' }) => {
  return (
    <PageLayout showBottomNav={false}>
      <TopNav title={title} showBack />
      <EmptyState
        icon={emoji}
        title={title}
        description="此模块正在开发中，敬请期待"
      />
    </PageLayout>
  );
};
