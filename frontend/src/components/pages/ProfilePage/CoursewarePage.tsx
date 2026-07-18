import React, { useEffect, useState, useRef } from 'react';
import { PageLayout } from '../../layout/PageLayout';
import { TopNav } from '../../layout/TopNav';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { EmptyState } from '../../common/EmptyState';
import { coursewareApi } from '../../../services/api/courseware';
import { useUIStore } from '../../../stores/uiStore';

export const CoursewarePage: React.FC = () => {
  const { showToast } = useUIStore();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const res = await coursewareApi.list({ limit: 50 });
      setItems(res.data.data?.items || []);
    } catch {} finally { setIsLoading(false); }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);
      formData.append('label', '通用');

      await coursewareApi.upload(formData);
      showToast('上传成功，消耗5积分', 'success');
      loadData();
    } catch {
      showToast('上传失败，积分不足或文件过大', 'error');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await coursewareApi.delete(id);
      showToast('已删除', 'success');
      loadData();
    } catch { showToast('删除失败', 'error'); }
  };

  return (
    <PageLayout showBottomNav={false}>
      <TopNav title="课件管理" showBack rightAction={
        <button onClick={() => fileRef.current?.click()} className="text-sm text-primary-500 font-medium">
          {uploading ? '上传中...' : '+ 上传'}
        </button>
      } />

      <input ref={fileRef} type="file" accept=".pdf,.jpg,.png,.gif" className="hidden" onChange={handleUpload} />

      <div className="px-4 pb-8">
        <p className="text-xs text-text-secondary mb-3">支持 PDF、JPG、PNG 格式，上传消耗5积分</p>

        {isLoading ? <LoadingSpinner /> : items.length === 0 ? (
          <EmptyState icon="📎" title="暂无课件" description="上传课件资料，方便课堂使用" actionText="上传课件" onAction={() => fileRef.current?.click()} />
        ) : (
          <div className="space-y-2">
            {items.map((item: any) => (
              <Card key={item.id} padding="sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-lg">{item.fileType === 'PDF' ? '📄' : '🖼'}</span>
                    <div className="min-w-0">
                      <p className="text-sm text-text-primary truncate">{item.name}</p>
                      <p className="text-xs text-text-secondary">
                        {item.label} · {item.fileSize ? `${(item.fileSize / 1024).toFixed(0)}KB` : '未知大小'}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="text-xs text-error ml-2">删除</button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};
