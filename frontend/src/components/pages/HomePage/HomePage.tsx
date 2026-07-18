import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { WordbookCard } from './WordbookCard';
import { FunctionGrid } from './FunctionGrid';
import { useAuthStore } from '../../../stores/authStore';
import { useStudyStore } from '../../../stores/studyStore';
import { useWordbookStore } from '../../../stores/wordbookStore';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { studyApi } from '../../../services/api/study';
import { useUIStore } from '../../../stores/uiStore';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loadUser } = useAuthStore();
  const { todayData, loadToday, isLoading } = useStudyStore();
  const { myWordbooks, loadMyWordbooks } = useWordbookStore();
  const { showToast } = useUIStore();
  const [todayWords, setTodayWords] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadUser();
    loadToday();
    loadMyWordbooks();
    loadTodayWords();
  }, []);

  const loadTodayWords = async () => {
    try {
      const res = await studyApi.getUserWords({ limit: 50 });
      setTodayWords(res.data.data?.items || []);
    } catch {}
  };

  const currentWordbook = myWordbooks?.[0]?.wordbook;
  const hasWordbook = !!currentWordbook;

  const handleStatClick = (type: string) => {
    switch (type) {
      case 'learned':
        navigate('/records');
        break;
      case 'review':
        navigate('/review/anti-forget');
        break;
      case 'new-words':
        if (hasWordbook) {
          navigate('/study');
        } else {
          showToast('请先选择词书', 'info');
          navigate('/wordbooks');
        }
        break;
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <TopNav showAvatar />
        <LoadingSpinner text="加载中..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <TopNav showAvatar />

      <div className="mt-4">
        <WordbookCard
          name={currentWordbook?.name}
          learned={todayData?.progress?.learned || 0}
          total={currentWordbook?.totalWords || 0}
          hasWordbook={hasWordbook}
          onClick={() => navigate('/wordbooks')}
        />
      </div>

      {/* Study stats - clickable */}
      <div className="flex items-center justify-around mx-4 mt-4 p-3 bg-bg-secondary rounded-xl shadow-card">
        <button className="text-center flex-1 active:scale-95 transition-transform" onClick={() => handleStatClick('learned')}>
          <p className="text-lg font-bold text-primary-500">{todayData?.progress?.learned || 0}</p>
          <p className="text-xs text-text-secondary">今日学习</p>
        </button>
        <div className="w-px h-8 bg-border" />
        <button className="text-center flex-1 active:scale-95 transition-transform" onClick={() => handleStatClick('review')}>
          <p className="text-lg font-bold text-reviewing">{todayData?.reviewWords || 0}</p>
          <p className="text-xs text-text-secondary">待复习</p>
        </button>
        <div className="w-px h-8 bg-border" />
        <button className="text-center flex-1 active:scale-95 transition-transform" onClick={() => handleStatClick('new-words')}>
          <p className="text-lg font-bold text-new-word">{todayData?.newWords || 0}</p>
          <p className="text-xs text-text-secondary">新词</p>
        </button>
        <div className="w-px h-8 bg-border" />
        <div className="text-center flex-1">
          <p className="text-lg font-bold text-warning">{todayData?.streak || 0}</p>
          <p className="text-xs text-text-secondary">连续天数</p>
        </div>
      </div>

      {/* Timer Button */}
      <div className="mx-4 mt-4">
        <button
          onClick={() => navigate('/timer')}
          className="w-full py-2.5 bg-primary-50 text-primary-600 rounded-xl text-sm font-medium hover:bg-primary-100 transition-colors"
        >
          ⏱ 课堂计时器
        </button>
      </div>

      {/* Function Grid */}
      <div className="mt-4">
        <FunctionGrid />
      </div>

      <div className="h-8" />
    </PageLayout>
  );
};
