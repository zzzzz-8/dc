import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { useAuthStore } from '../../../stores/authStore';

const MENU_GROUPS = [
  {
    title: '账户管理',
    items: [
      { label: '学生管理', icon: '👦', path: '/profile/students' },
      { label: '会员套餐', icon: '💎', path: '/profile/membership' },
      { label: '积分中心', icon: '🪙', path: '/profile/credits' },
    ],
  },
  {
    title: '学习工具',
    items: [
      { label: '查词典', icon: '📖', path: '/dictionary' },
      { label: '词汇量测试', icon: '📊', path: '/vocabulary-test' },
      { label: '学语法', icon: '📐', path: '/grammar' },
      { label: '课堂计时器', icon: '⏱', path: '/timer' },
    ],
  },
  {
    title: '系统设置',
    items: [
      { label: '每日目标', icon: '🎯', path: '/settings/goal' },
      { label: '复习提醒', icon: '⏰', path: '/settings/reminder' },
      { label: '发音偏好', icon: '🔊', path: '/settings/pronunciation' },
      { label: '深色模式', icon: '🌙', path: '/settings/theme' },
    ],
  },
  {
    title: '更多',
    items: [
      { label: '推广奖励', icon: '🎁', path: '/profile/referral' },
      { label: '课件管理', icon: '📎', path: '/profile/courseware' },
      { label: '学习报告', icon: '📈', path: '/profile/reports' },
    ],
  },
];

export const ProfileMenu: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <PageLayout>
      <TopNav title="我的" />

      {/* User info */}
      <div className="mx-4 mt-2">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-2xl">
              {user?.name?.[0] || '👤'}
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold text-text-primary">{user?.name || '用户'}</p>
              <p className="text-sm text-text-secondary">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded-full text-xs">
                  {user?.membership === 'FREE' ? '免费版' : user?.membership === 'PERSONAL' ? '个人版' : user?.membership === 'COACH' ? '教练版' : '机构版'}
                </span>
                <span className="text-xs text-text-secondary">🪙 {user?.credits || 0} 积分</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/profile/edit')}
              className="text-primary-500 text-sm"
            >
              编辑
            </button>
          </div>
        </Card>
      </div>

      {/* Menu groups */}
      <div className="px-4 mt-4 space-y-3 pb-8">
        {MENU_GROUPS.map((group, gi) => (
          <div key={gi}>
            <p className="text-xs font-medium text-text-secondary mb-1.5 px-1">{group.title}</p>
            <Card padding="none">
              {group.items.map((item, ii) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-text-primary hover:bg-bg-tertiary transition-colors ${
                    ii < group.items.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                  <svg className="w-4 h-4 ml-auto text-text-placeholder" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </Card>
          </div>
        ))}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3 text-sm text-error font-medium text-center hover:bg-error-bg rounded-xl transition-colors"
        >
          退出登录
        </button>
      </div>
    </PageLayout>
  );
};
