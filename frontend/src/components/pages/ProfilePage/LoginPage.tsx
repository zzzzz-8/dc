import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import { useUIStore } from '../../../stores/uiStore';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, register } = useAuthStore();
  const { showToast } = useUIStore();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegister) {
        await register(name, email, password);
        showToast('注册成功！', 'success');
      } else {
        await login(email, password);
        showToast('登录成功！', 'success');
      }
      navigate('/');
    } catch (err: any) {
      const message = err?.response?.data?.error?.message || '操作失败，请重试';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary-500 mb-2">单词跳跳岛</h1>
          <p className="font-emotion text-primary-400 italic text-sm">
            "我只害怕不能一直陪着你"
          </p>
        </div>

        <div className="bg-bg-secondary rounded-2xl shadow-card p-6">
          <h2 className="text-lg font-semibold text-text-primary mb-5">
            {isRegister ? '创建账号' : '欢迎回来'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <Input
                label="姓名"
                placeholder="请输入姓名"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            )}
            <Input
              label="邮箱"
              type="email"
              placeholder="请输入邮箱地址"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              label="密码"
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              helperText={isRegister ? '密码至少6位' : undefined}
            />
            <Button type="submit" fullWidth isLoading={isLoading}>
              {isRegister ? '注册' : '登录'}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              className="text-sm text-primary-500 hover:text-primary-600"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? '已有账号？立即登录' : '没有账号？立即注册'}
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-text-secondary text-center">
              演示账号：demo@tdtd.com / 123456
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
